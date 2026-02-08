#!/usr/bin/env bash
# ==========================================================================
# Health Checks — Eastern Healing Traditions
# Brand ID: eastern-healing-traditions
# Business Model: brick-and-mortar-primary
#
# Checks reachability of all integrated services. Designed for cron or
# manual execution. Returns exit code 0 if all critical checks pass,
# 1 if any critical check fails.
#
# Usage:
#   ./health-checks.sh              # Run all checks
#   ./health-checks.sh --verbose    # Show full response details
#   ./health-checks.sh --json       # Output results as JSON
# ==========================================================================

set -euo pipefail

BRAND_ID="eastern-healing-traditions"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${CLIENT_DIR}/.env"

# ---------------------------------------------------------------------------
# Load environment
# ---------------------------------------------------------------------------

if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
    echo "[env] Loaded ${ENV_FILE}"
else
    echo "[env] WARNING: No .env at ${ENV_FILE} — using shell environment"
fi

# ---------------------------------------------------------------------------
# Options
# ---------------------------------------------------------------------------

VERBOSE=false
JSON_OUTPUT=false
for arg in "$@"; do
    case "$arg" in
        --verbose) VERBOSE=true ;;
        --json) JSON_OUTPUT=true ;;
    esac
done

# ---------------------------------------------------------------------------
# State tracking
# ---------------------------------------------------------------------------

PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0
RESULTS=()

check_result() {
    local name="$1"
    local status="$2"   # PASS, FAIL, SKIP
    local message="$3"

    case "$status" in
        PASS) ((PASS_COUNT++)) || true; symbol="+" ;;
        FAIL) ((FAIL_COUNT++)) || true; symbol="!" ;;
        SKIP) ((SKIP_COUNT++)) || true; symbol="-" ;;
    esac

    RESULTS+=("{\"name\":\"${name}\",\"status\":\"${status}\",\"message\":\"${message}\"}")

    if [ "$JSON_OUTPUT" = false ]; then
        printf "  [%s] %-30s %s\n" "$status" "$name" "$message"
    fi
}

# ---------------------------------------------------------------------------
# Neo4j
# ---------------------------------------------------------------------------

check_neo4j() {
    if [ -z "${NEO4J_URI:-}" ] || [ -z "${NEO4J_USERNAME:-}" ] || [ -z "${NEO4J_PASSWORD:-}" ]; then
        check_result "Neo4j" "SKIP" "Missing NEO4J_URI, NEO4J_USERNAME, or NEO4J_PASSWORD"
        return
    fi

    # Extract host:port from bolt:// or neo4j:// URI
    local host_port
    host_port=$(echo "$NEO4J_URI" | sed -E 's|^(neo4j|bolt)(\+s?s?)?://||' | sed 's|/.*||')
    local host="${host_port%%:*}"
    local port="${host_port##*:}"
    port="${port:-7687}"

    if nc -z -w 5 "$host" "$port" 2>/dev/null; then
        check_result "Neo4j" "PASS" "Reachable at ${host}:${port}"
    else
        check_result "Neo4j" "FAIL" "Cannot reach ${host}:${port}"
    fi
}

# ---------------------------------------------------------------------------
# Pinecone
# ---------------------------------------------------------------------------

check_pinecone() {
    if [ -z "${PINECONE_API_KEY:-}" ]; then
        check_result "Pinecone" "SKIP" "Missing PINECONE_API_KEY"
        return
    fi

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Api-Key: ${PINECONE_API_KEY}" \
        "https://api.pinecone.io/indexes" 2>/dev/null) || true

    if [ "$response" = "200" ]; then
        check_result "Pinecone" "PASS" "API reachable (HTTP 200)"
    else
        check_result "Pinecone" "FAIL" "API returned HTTP ${response}"
    fi
}

# ---------------------------------------------------------------------------
# AWS S3
# ---------------------------------------------------------------------------

check_s3() {
    if [ -z "${AWS_ACCESS_KEY_ID:-}" ] || [ -z "${AWS_SECRET_ACCESS_KEY:-}" ]; then
        check_result "AWS S3" "SKIP" "Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY"
        return
    fi

    if command -v aws &>/dev/null; then
        if aws s3 ls "s3://droom/clients/${BRAND_ID}/" --region us-east-1 --max-items 1 &>/dev/null; then
            check_result "AWS S3" "PASS" "Bucket 'droom' accessible at prefix clients/${BRAND_ID}/"
        else
            check_result "AWS S3" "FAIL" "Cannot access bucket 'droom' or prefix"
        fi
    else
        # Fallback: just check S3 endpoint reachability
        local response
        response=$(curl -s -o /dev/null -w "%{http_code}" "https://droom.s3.us-east-1.amazonaws.com" 2>/dev/null) || true
        if [ "$response" != "000" ]; then
            check_result "AWS S3" "PASS" "S3 endpoint reachable (HTTP ${response})"
        else
            check_result "AWS S3" "FAIL" "S3 endpoint unreachable"
        fi
    fi
}

# ---------------------------------------------------------------------------
# Claude API (Anthropic)
# ---------------------------------------------------------------------------

check_claude() {
    if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
        check_result "Claude API" "SKIP" "Missing ANTHROPIC_API_KEY"
        return
    fi

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "x-api-key: ${ANTHROPIC_API_KEY}" \
        -H "anthropic-version: 2023-06-01" \
        -H "content-type: application/json" \
        -d '{"model":"claude-sonnet-4-20250514","max_tokens":1,"messages":[{"role":"user","content":"ping"}]}' \
        "https://api.anthropic.com/v1/messages" 2>/dev/null) || true

    if [ "$response" = "200" ]; then
        check_result "Claude API" "PASS" "API reachable (HTTP 200)"
    elif [ "$response" = "401" ]; then
        check_result "Claude API" "FAIL" "Authentication failed (HTTP 401)"
    else
        check_result "Claude API" "FAIL" "API returned HTTP ${response}"
    fi
}

# ---------------------------------------------------------------------------
# OpenAI API
# ---------------------------------------------------------------------------

check_openai() {
    if [ -z "${OPENAI_API_KEY:-}" ]; then
        check_result "OpenAI API" "SKIP" "Missing OPENAI_API_KEY"
        return
    fi

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer ${OPENAI_API_KEY}" \
        "https://api.openai.com/v1/models" 2>/dev/null) || true

    if [ "$response" = "200" ]; then
        check_result "OpenAI API" "PASS" "API reachable (HTTP 200)"
    elif [ "$response" = "401" ]; then
        check_result "OpenAI API" "FAIL" "Authentication failed (HTTP 401)"
    else
        check_result "OpenAI API" "FAIL" "API returned HTTP ${response}"
    fi
}

# ---------------------------------------------------------------------------
# Google Ads API
# ---------------------------------------------------------------------------

check_google_ads() {
    if [ -z "${GOOGLE_ADS_DEVELOPER_TOKEN:-}" ]; then
        check_result "Google Ads API" "SKIP" "Missing GOOGLE_ADS_DEVELOPER_TOKEN"
        return
    fi

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        "https://googleads.googleapis.com" 2>/dev/null) || true

    if [ "$response" != "000" ]; then
        check_result "Google Ads API" "PASS" "Endpoint reachable (HTTP ${response})"
    else
        check_result "Google Ads API" "FAIL" "Endpoint unreachable"
    fi
}

# ---------------------------------------------------------------------------
# Meta Marketing API
# ---------------------------------------------------------------------------

check_meta() {
    if [ -z "${META_ACCESS_TOKEN:-}" ]; then
        check_result "Meta Marketing API" "SKIP" "Missing META_ACCESS_TOKEN"
        return
    fi

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        "https://graph.facebook.com/v21.0/me?access_token=${META_ACCESS_TOKEN}" 2>/dev/null) || true

    if [ "$response" = "200" ]; then
        check_result "Meta Marketing API" "PASS" "API reachable (HTTP 200)"
    elif [ "$response" = "401" ] || [ "$response" = "400" ]; then
        check_result "Meta Marketing API" "FAIL" "Authentication failed (HTTP ${response})"
    else
        check_result "Meta Marketing API" "FAIL" "API returned HTTP ${response}"
    fi
}

# ---------------------------------------------------------------------------
# SendGrid
# ---------------------------------------------------------------------------

check_sendgrid() {
    if [ -z "${SENDGRID_API_KEY:-}" ]; then
        check_result "SendGrid" "SKIP" "Missing SENDGRID_API_KEY"
        return
    fi

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer ${SENDGRID_API_KEY}" \
        "https://api.sendgrid.com/v3/user/profile" 2>/dev/null) || true

    if [ "$response" = "200" ]; then
        check_result "SendGrid" "PASS" "API reachable (HTTP 200)"
    elif [ "$response" = "401" ]; then
        check_result "SendGrid" "FAIL" "Authentication failed (HTTP 401)"
    else
        check_result "SendGrid" "FAIL" "API returned HTTP ${response}"
    fi
}

# ---------------------------------------------------------------------------
# Twilio
# ---------------------------------------------------------------------------

check_twilio() {
    if [ -z "${TWILIO_ACCOUNT_SID:-}" ] || [ -z "${TWILIO_AUTH_TOKEN:-}" ]; then
        check_result "Twilio" "SKIP" "Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN"
        return
    fi

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -u "${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}" \
        "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}.json" 2>/dev/null) || true

    if [ "$response" = "200" ]; then
        check_result "Twilio" "PASS" "API reachable (HTTP 200)"
    elif [ "$response" = "401" ]; then
        check_result "Twilio" "FAIL" "Authentication failed (HTTP 401)"
    else
        check_result "Twilio" "FAIL" "API returned HTTP ${response}"
    fi
}

# ---------------------------------------------------------------------------
# n8n
# ---------------------------------------------------------------------------

check_n8n() {
    local base_url="${N8N_BASE_URL:-http://localhost:5678}"

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        "${base_url}/healthz" 2>/dev/null) || true

    if [ "$response" = "200" ]; then
        check_result "n8n" "PASS" "Reachable at ${base_url} (HTTP 200)"
    elif [ "$response" = "000" ]; then
        check_result "n8n" "FAIL" "Unreachable at ${base_url} (connection refused)"
    else
        check_result "n8n" "FAIL" "Returned HTTP ${response} at ${base_url}"
    fi
}

# ---------------------------------------------------------------------------
# Dashboard API
# ---------------------------------------------------------------------------

check_dashboard() {
    local base_url="${DASHBOARD_API_URL:-http://localhost:8000}"

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        "${base_url}/api/health" 2>/dev/null) || true

    if [ "$response" = "200" ]; then
        check_result "Dashboard API" "PASS" "Reachable at ${base_url} (HTTP 200)"
    elif [ "$response" = "000" ]; then
        check_result "Dashboard API" "FAIL" "Unreachable at ${base_url}"
    else
        check_result "Dashboard API" "FAIL" "Returned HTTP ${response} at ${base_url}"
    fi
}

# ---------------------------------------------------------------------------
# Website
# ---------------------------------------------------------------------------

check_website() {
    local url="${WEBSITE_URL:-https://easternhealingtraditions.com}"

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        "${url}" 2>/dev/null) || true

    if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
        check_result "Website" "PASS" "Reachable at ${url} (HTTP ${response})"
    elif [ "$response" = "000" ]; then
        check_result "Website" "FAIL" "Unreachable at ${url}"
    else
        check_result "Website" "FAIL" "Returned HTTP ${response} at ${url}"
    fi
}

# ==========================================================================
# Run all checks
# ==========================================================================

echo "======================================================================"
echo "Health Checks — Eastern Healing Traditions"
echo "Brand ID: ${BRAND_ID}"
echo "Timestamp: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo "======================================================================"
echo ""

check_neo4j
check_pinecone
check_s3
check_claude
check_openai
check_google_ads
check_meta
check_sendgrid
check_twilio
check_n8n
check_dashboard
check_website

echo ""
echo "----------------------------------------------------------------------"
echo "Summary: ${PASS_COUNT} passed, ${FAIL_COUNT} failed, ${SKIP_COUNT} skipped"
echo "----------------------------------------------------------------------"

# ---------------------------------------------------------------------------
# JSON output (if requested)
# ---------------------------------------------------------------------------

if [ "$JSON_OUTPUT" = true ]; then
    echo ""
    echo "{"
    echo "  \"brand_id\": \"${BRAND_ID}\","
    echo "  \"timestamp\": \"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\","
    echo "  \"summary\": {\"pass\": ${PASS_COUNT}, \"fail\": ${FAIL_COUNT}, \"skip\": ${SKIP_COUNT}},"
    echo "  \"results\": ["
    for i in "${!RESULTS[@]}"; do
        if [ "$i" -lt $((${#RESULTS[@]} - 1)) ]; then
            echo "    ${RESULTS[$i]},"
        else
            echo "    ${RESULTS[$i]}"
        fi
    done
    echo "  ]"
    echo "}"
fi

# Exit with failure if any critical check failed
if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
fi
exit 0
