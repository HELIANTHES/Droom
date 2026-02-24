#!/bin/bash
# ──────────────────────────────────────────────────────────────
# Eastern Healing Traditions — n8n Workflow Setup Script
# ──────────────────────────────────────────────────────────────
# This script helps import workflow JSON files into n8n and
# verify that required credentials are configured.
#
# Usage: bash setup.sh [n8n-base-url]
# Example: bash setup.sh http://localhost:5678
# ──────────────────────────────────────────────────────────────

set -euo pipefail

N8N_URL="${1:-http://localhost:5678}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRAND_ID="eastern-healing-traditions"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Eastern Healing Traditions — n8n Workflow Setup        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "n8n instance: $N8N_URL"
echo "Workflow directory: $SCRIPT_DIR"
echo ""

# ── Step 1: Check n8n is running ──
echo "── Step 1: Checking n8n connectivity..."
if curl -sf "$N8N_URL/healthz" > /dev/null 2>&1; then
  echo "   ✓ n8n is running at $N8N_URL"
else
  echo "   ✗ Cannot reach n8n at $N8N_URL"
  echo "   Start n8n first, then re-run this script."
  exit 1
fi
echo ""

# ── Step 2: List required credentials ──
echo "── Step 2: Required credentials (configure in n8n UI before activating workflows)"
echo ""
echo "   Credential Name              Service                 Required For"
echo "   ─────────────────────────    ──────────────────      ─────────────────────────"
echo "   anthropic-api                Anthropic Claude API    All agent workflows"
echo "   openai-api                   OpenAI API              Content embedding"
echo "   neo4j-db                     Neo4j Database          All workflows"
echo "   pinecone-api                 Pinecone Vector DB      Content, learning workflows"
echo "   google-ads-api               Google Ads API          Performance, budget workflows"
echo "   meta-marketing-api           Meta Marketing API      Performance, budget workflows"
echo "   aws-s3                       AWS S3                  Content ingestion"
echo "   sendgrid-api                 SendGrid                Email notifications"
echo "   twilio-api                   Twilio                  SMS (hot leads)"
echo ""

# ── Step 3: Import workflows ──
echo "── Step 3: Importing workflows..."
echo ""

# Import order matters — form-ingestion first (webhook), then cron workflows in schedule order
WORKFLOW_FILES=(
  "form-ingestion.json"
  "content-ingestion.json"
  "creative-rotation.json"
  "daily-performance.json"
  "budget-optimization.json"
  "learn-and-remember.json"
  "weekly-strategy.json"
)

IMPORTED=0
SKIPPED=0

for wf in "${WORKFLOW_FILES[@]}"; do
  WF_PATH="$SCRIPT_DIR/$wf"
  if [ -f "$WF_PATH" ]; then
    echo "   Importing $wf..."
    RESPONSE=$(curl -sf -X POST "$N8N_URL/api/v1/workflows" \
      -H "Content-Type: application/json" \
      -d @"$WF_PATH" 2>&1) || {
      echo "   ⚠ Failed to import $wf (may already exist or API auth required)"
      SKIPPED=$((SKIPPED + 1))
      continue
    }
    echo "   ✓ Imported $wf"
    IMPORTED=$((IMPORTED + 1))
  else
    echo "   ⚠ $wf not found — skipping"
    SKIPPED=$((SKIPPED + 1))
  fi
done

echo ""
echo "── Results: $IMPORTED imported, $SKIPPED skipped"
echo ""

# ── Step 4: Activation checklist ──
echo "── Step 4: Activation Checklist"
echo ""
echo "   Before activating workflows:"
echo ""
echo "   [ ] Configure all 9 credentials listed above in n8n"
echo "   [ ] Verify Neo4j database schema is initialized (run database/init scripts)"
echo "   [ ] Set up S3 event notification for content uploads"
echo "   [ ] Configure website form handler to POST to form-ingestion webhook"
echo "   [ ] Test each workflow manually using the Manual Trigger before activating"
echo ""
echo "   Activation order (respect temporal dependencies):"
echo "   1. form-ingestion      (webhook — always ready)"
echo "   2. content-ingestion   (S3 trigger — ready when S3 events configured)"
echo "   3. creative-rotation   (1:00 AM daily)"
echo "   4. daily-performance   (2:00 AM daily)"
echo "   5. budget-optimization (3:30 AM daily)"
echo "   6. learn-and-remember  (4:00 AM daily)"
echo "   7. weekly-strategy     (3:00 AM Mondays)"
echo ""
echo "══════════════════════════════════════════════════════════"
echo "  Setup complete. Configure credentials, then activate."
echo "══════════════════════════════════════════════════════════"
