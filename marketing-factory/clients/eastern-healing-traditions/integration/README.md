# Integration — Eastern Healing Traditions

**Brand ID:** `eastern-healing-traditions`
**Business Model:** `brick-and-mortar-primary` (NO e-commerce, NO Shopify)
**Location:** 34121 US-45, Grayslake, IL 60030

---

## Overview

This directory contains the integration layer that connects all services in the Eastern Healing Traditions marketing system. It provides:

- **connections.json** — Service URLs, credential references, and endpoint mappings
- **test-suite.py** — Python integration tests for all critical services
- **health-checks.sh** — Bash health check script for ongoing monitoring
- **credentials/.env.template** — Environment variable template (no secrets)

---

## Setup

### 1. Create the Environment File

Copy the template and fill in your credentials:

```bash
cp credentials/.env.template ../../.env
```

Edit `../../.env` (the `.env` file lives at the client root: `clients/eastern-healing-traditions/.env`). Fill in each variable following the inline comments.

### 2. Install Python Dependencies

```bash
pip install python-dotenv neo4j pinecone anthropic openai boto3
```

### 3. Run Integration Tests

```bash
# Run all tests
python test-suite.py

# Verbose output
python test-suite.py -v

# Run only Neo4j tests
python test-suite.py -k neo4j

# Run only Pinecone tests
python test-suite.py -k pinecone
```

Tests with missing credentials will skip gracefully (not fail).

### 4. Run Health Checks

```bash
chmod +x health-checks.sh
./health-checks.sh

# Verbose mode
./health-checks.sh --verbose

# JSON output (useful for dashboards and monitoring)
./health-checks.sh --json
```

### 5. Set Up Monitoring (Optional)

Add to crontab for periodic health checks:

```bash
# Run health checks every 15 minutes, log results
*/15 * * * * /path/to/integration/health-checks.sh --json >> /var/log/droom-health.log 2>&1
```

---

## Credential Configuration Guide

### Required Credentials (Core Infrastructure)

| Service | Env Variables | How to Obtain |
|---------|--------------|---------------|
| Neo4j | `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` | Neo4j Aura console or self-hosted instance |
| Pinecone | `PINECONE_API_KEY` | [Pinecone console](https://app.pinecone.io/) > API Keys |
| AWS S3 | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | AWS IAM console > Create access key |
| Claude | `ANTHROPIC_API_KEY` | [Anthropic console](https://console.anthropic.com/) > API Keys |
| OpenAI | `OPENAI_API_KEY` | [OpenAI platform](https://platform.openai.com/) > API Keys |

### Required Credentials (Ad Platforms)

| Service | Env Variables | How to Obtain |
|---------|--------------|---------------|
| Google Ads | `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID` | Google Ads API Center |
| Meta Marketing | `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, `META_APP_ID`, `META_APP_SECRET` | Meta Business Suite > System Users |

### Required Credentials (Communications)

| Service | Env Variables | How to Obtain |
|---------|--------------|---------------|
| SendGrid | `SENDGRID_API_KEY` | [SendGrid console](https://app.sendgrid.com/) > Settings > API Keys |
| Twilio | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE` | [Twilio console](https://console.twilio.com/) |

### Optional / Runtime Credentials

| Service | Env Variables | Notes |
|---------|--------------|-------|
| n8n | `N8N_BASE_URL`, `N8N_API_KEY` | Defaults to localhost:5678 |
| Dashboard | `DASHBOARD_API_URL`, `DASHBOARD_API_KEY` | Defaults to localhost:8000 |
| Website | `WEBSITE_URL` | Defaults to https://easternhealingtraditions.com |
| Tracking | `GA_MEASUREMENT_ID`, `GOOGLE_ADS_CONVERSION_ID`, `META_PIXEL_ID` | Set once tracking is configured |

---

## Service Architecture

```
                              connections.json
                                     |
                    +----------------+----------------+
                    |                |                |
              Databases         AI Services      Ad Platforms
              ---------         -----------      ------------
              Neo4j             Claude API       Google Ads
              Pinecone          OpenAI API       Meta Marketing
              AWS S3                             YouTube (via Google)
                    |                |                |
                    +-------+--------+-------+-------+
                            |                |
                      Communications    Infrastructure
                      --------------    --------------
                      SendGrid          n8n workflows
                      Twilio            Dashboard API
                                        Website API
```

---

## Troubleshooting

### Neo4j connection refused
- Verify `NEO4J_URI` protocol (`bolt://`, `neo4j://`, or `neo4j+s://` for Aura)
- Check that the database is running and the port (default 7687) is accessible
- For Aura: ensure the instance is not paused

### Pinecone index not found
- The index name must be exactly `graphelion-deux` (shared index)
- Verify your API key has access to the correct Pinecone project
- Check at https://app.pinecone.io/ that the index exists

### AWS S3 access denied
- The IAM user/role needs `s3:GetObject`, `s3:PutObject`, `s3:ListBucket` on `arn:aws:s3:::droom` and `arn:aws:s3:::droom/clients/eastern-healing-traditions/*`
- Verify the region is `us-east-1`

### Claude API 401
- API keys start with `sk-ant-`
- Check the key has not been revoked at https://console.anthropic.com/

### OpenAI API 401
- API keys start with `sk-`
- Verify the key belongs to an organization with active billing

### Meta Marketing API errors
- Access tokens expire. Use a system user token for long-lived access.
- The ad account ID format should be `act_XXXXXXXXXX`
- Verify your app has `ads_management` and `ads_read` permissions

### Google Ads API errors
- Refresh tokens can expire if the OAuth consent is revoked
- Verify the developer token is approved (not in test mode for production)
- The customer ID format should be `XXX-XXX-XXXX` (with hyphens)

### n8n unreachable
- Default URL is `http://localhost:5678` -- update `N8N_BASE_URL` if hosted elsewhere
- Check that n8n is running: `docker ps` or `systemctl status n8n`

### Health check script permission denied
- Run `chmod +x health-checks.sh`

### Tests skip everything
- Verify `.env` file exists at `clients/eastern-healing-traditions/.env`
- Verify `python-dotenv` is installed: `pip install python-dotenv`
- Check that env vars are not empty strings (a var set to `""` counts as missing)

---

## File Reference

| File | Purpose |
|------|---------|
| `connections.json` | All service URLs, credential env var references, endpoint mappings |
| `test-suite.py` | Python integration tests (run during setup and after changes) |
| `health-checks.sh` | Bash health checks (run periodically for monitoring) |
| `credentials/.env.template` | Environment variable template with descriptions |
| `README.md` | This file |
