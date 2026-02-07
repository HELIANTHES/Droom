---
name: build-automation
description: Builds complete n8n workflow JSON files and automation system for a client
---

# Build Automation Command

Generates all n8n workflow JSON files, runtime agent prompts (if not already created), and integration configurations that power the automated marketing system.

## Input

**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug matching the client directory name

**Parse $ARGUMENTS to extract the `name` value.**

If `name` is missing, stop and ask the user for it.

## Validation

Before proceeding, verify:

**Required files:**
- `clients/{name}/brand-config.json` — Master configuration
- `clients/{name}/strategy/campaign-plan.md` — Strategy document
- `clients/{name}/creative/creative-strategy.md` — Creative direction
- `clients/{name}/system-knowledge/database-schema.md` — Database schema docs

If any are missing, report which files are absent and instruct the user to run `/initialize-client name={name}` first.

**Check database accessibility (optional but recommended):**
- If `clients/{name}/credentials/.env` exists, source it and verify:
  - Neo4j connection works
  - Pinecone API key is valid
- If credentials are not configured, warn the user but continue (workflows can be generated without live database access)

## Process

Set the base paths:
```
FACTORY_ROOT = /Users/jaronarmiger/HELIANTHES/OEUVRE/Droom/marketing-factory
CLIENT_DIR = {FACTORY_ROOT}/clients/{name}
SPECS_DIR = /Users/jaronarmiger/HELIANTHES/OEUVRE/Droom/system-specs
AGENTS_DIR = {FACTORY_ROOT}/.claude/agents
```

---

### Step 1: Read Configuration & Context

Read and internalize:
1. `{CLIENT_DIR}/brand-config.json` — Extract brand_id, brand_name, business_model, platforms, demographics, budget, campaign_goals
2. `{CLIENT_DIR}/strategy/campaign-plan.md` — Understand strategic priorities
3. `{CLIENT_DIR}/creative/creative-strategy.md` — Understand content approach
4. `{CLIENT_DIR}/system-knowledge/database-schema.md` — Understand database structure

Determine business model to know which workflows to generate:
- If `business_model` is `ecommerce-primary` or `hybrid`: Include Shopify Integration workflow
- Otherwise: Skip Shopify workflow

---

### Step 2: Generate n8n Workflows

**Read the agent definition:** `{AGENTS_DIR}/n8n-architect.md`

**Read the relevant system specs:**
- `{SPECS_DIR}/n8n-system.md` — Comprehensive n8n workflow specifications
- `{SPECS_DIR}/integration-flows.md` — How components communicate
- `{SPECS_DIR}/database-interaction.md` — How workflows interact with databases

**Execute as the n8n Architect Agent:**

Generate complete, valid n8n workflow JSON files. Each workflow must be importable into n8n without modification (after credential configuration).

**For ALL clients, generate these 7 workflows:**

#### Workflow 1: Content Ingestion (`01-content-ingestion.json`)
- **Trigger:** Google Drive file upload
- **Function:** Analyze uploaded content with Claude Vision, generate embeddings, store in Pinecone and Neo4j
- **Key nodes:** Google Drive Trigger → Download → File Type Switch → Base64 Convert → Claude Vision API → Parse Response → Generate ID → OpenAI Embeddings → Pinecone Upsert → Neo4j Create Content Node → Neo4j Create Relationships → Cleanup → Dashboard Notify → Error Handler

#### Workflow 2: Daily Performance Analysis (`02-daily-performance.json`)
- **Trigger:** Cron at 2:00 AM daily
- **Function:** Fetch platform performance data, analyze with CSO agent, make optimization decisions
- **Key nodes:** Schedule Trigger → Date Variables → Fetch Google Ads → Fetch Meta Ads → Merge Data → Calculate Metrics → Store in Neo4j → Generate Scenario → Create Embedding → Query Similar Scenarios (Pinecone) → CSO Agent (Claude) → Parse Decisions → Execute Budget Shifts → Execute Creative Rotation → Update Pinecone Metadata → Log Decisions → Dashboard Update → Error Handler

#### Workflow 3: Weekly Strategy Review (`03-weekly-strategy.json`)
- **Trigger:** Cron at 3:00 AM every Monday
- **Function:** Comprehensive weekly analysis using multiple AI agents, generate client report
- **Key nodes:** Schedule Trigger → Query Week Performance (Neo4j) → Query Similar Weeks (Pinecone) → CSO Analysis (Claude) → Creative Intelligence Analysis (Claude) → Cultural Anthropologist Analysis (Claude) → Data Scientist Analysis (Claude) → Synthesize Insights → Client Translator Report (Claude) → Store Summary (Neo4j) → Store Meta-Learnings (Pinecone) → Email Report (SendGrid) → Dashboard Update → Error Handler

#### Workflow 4: Creative Rotation (`04-creative-rotation.json`)
- **Trigger:** Cron at 1:00 AM daily OR webhook (called by other workflows)
- **Function:** Detect fatigued content, find replacements, execute gradual rotation
- **Key nodes:** Trigger → Query Active Content (Neo4j) → Calculate Fatigue Scores → Filter Fatigued → Creative Intelligence Agent (Claude) → Find Replacements (Pinecone similarity search) → Query Replacement History (Neo4j) → Select Best → Media Buyer Agent (Claude) → Execute Platform Updates (gradual) → Update Content Status (Neo4j) → Dashboard Update → Error Handler

#### Workflow 5: Budget Optimization (`05-budget-optimization.json`)
- **Trigger:** Cron at 3:00 AM daily
- **Function:** Optimize budget allocation across platforms, demographics, geography, and time slots
- **Key nodes:** Schedule Trigger → Query Current Allocation (Neo4j) → Query Performance by Segment (Neo4j) → Data Scientist Optimization (Claude) → Query Similar Budget Shifts (Pinecone) → CSO Strategic Decision (Claude) → Media Buyer Execute Gradual Changes → Log Optimization (Neo4j) → Dashboard Update → Error Handler

#### Workflow 6: Learn & Remember (`06-learn-remember.json`)
- **Trigger:** Cron at 4:00 AM daily
- **Function:** Store historical patterns, update relationship weights, identify learnings
- **Key nodes:** Schedule Trigger → Query Yesterday's Campaigns (Neo4j) → Loop: Get Content Profile (Pinecone) + Campaign Params (Neo4j) → Generate Scenario Description → Create Embedding (OpenAI) → Store in Pinecone → Update Demographic Weights (Neo4j) → Identify Surprises → Cultural Anthropologist Explain (Claude) → Store Meta-Learnings (Pinecone) → Dashboard Update → Error Handler

#### Workflow 7: Form Ingestion (`07-form-ingestion.json`)
- **Trigger:** Webhook (real-time from website)
- **Function:** Process form submissions, score leads, route by priority
- **Key nodes:** Webhook Trigger → Validate Data → Generate Lead ID → Create Lead Node (Neo4j) → Create Form Node (Neo4j) → Link to Campaign (if UTM) → Lead Scoring Agent (Claude) → Update Lead Score (Neo4j) → Route by Score (Hot/Warm/Cold) → Send Notifications (SendGrid/Twilio) → Send Confirmation Email → Add to Retargeting Audiences → Dashboard Update → Error Handler

#### Workflow 8 (E-commerce only): Shopify Integration (`08-shopify-integration.json`)
- **Trigger:** Webhook from Shopify (order created)
- **Function:** Attribute purchases to campaigns, update true ROAS
- **Key nodes:** Webhook Trigger (HMAC verify) → Parse Order → Find Matching Lead (Neo4j) → Trace to Campaign (Neo4j) → Create/Merge Customer Node → Link Lead to Customer → Create Purchase Node → Create Attribution Relationships → Update Content Revenue/ROAS (Neo4j) → Update Pinecone Metadata → CSO Analyze Impact (Claude) → Scale if Recommended → Dashboard Update → Error Handler

**For each workflow, ensure:**
- Valid n8n JSON format with proper `nodes`, `connections`, `settings` structure
- Each node has a unique `id`, `name`, `type`, `typeVersion`, and `position` (x,y for visual layout)
- Workflow-level variables are used (not hardcoded brand values):
  ```json
  {
    "settings": {
      "variables": {
        "brand_id": "{brand-id}",
        "brand_name": "{Brand Name}",
        "google_drive_folder_id": "",
        "neo4j_database": "neo4j",
        "pinecone_index": "marketing-automation",
        "dashboard_webhook_url": "",
        "client_email": ""
      }
    }
  }
  ```
- Error handling nodes are included (retry with exponential backoff)
- Monitoring/logging nodes for critical operations
- Proper node connections (output → input mappings)

---

### Step 3: Verify Runtime Agent Prompts

Check if runtime agent prompts already exist from `/initialize-client`:
- `{CLIENT_DIR}/automation/prompts/chief-strategy-officer.md`
- `{CLIENT_DIR}/automation/prompts/creative-intelligence.md`
- `{CLIENT_DIR}/automation/prompts/media-buyer.md`
- `{CLIENT_DIR}/automation/prompts/data-scientist.md`
- `{CLIENT_DIR}/automation/prompts/cultural-anthropologist.md`
- `{CLIENT_DIR}/automation/prompts/client-translator.md`

If any are missing, generate them now following the Marketing Agent Prompt Engineer agent definition (`{AGENTS_DIR}/marketing-agent-prompt-engineer.md`).

---

### Step 4: Create Workflow Documentation

Generate `{CLIENT_DIR}/n8n/README.md` with:
- Overview of all workflows
- For each workflow: file name, trigger, frequency, purpose, execution time, estimated cost
- Setup instructions (import into n8n, configure credentials, set variables)
- Activation order (Content Ingestion first, then Form Ingestion, then scheduled workflows)
- Monitoring guide
- Troubleshooting for common errors
- Cost estimates (daily, weekly, monthly)

Generate `{CLIENT_DIR}/n8n/VERSION`:
```json
{
  "workflow_version": "{date}-001",
  "generated_date": "{ISO date}",
  "brand_id": "{brand-id}",
  "workflows": {
    "01-content-ingestion.json": { "version": "1.0.0", "changelog": "Initial generation" },
    ...
  }
}
```

---

### Step 5: Create Workflow Setup Script

Generate `{CLIENT_DIR}/n8n/setup.sh` — A helper script that:
1. Checks n8n is running and accessible
2. Lists all workflow files to import
3. Provides commands to import each workflow via n8n API (if n8n API is available)
4. Reminds user to configure credentials after import
5. Provides activation order

```bash
#!/bin/bash
# n8n Workflow Setup for {Brand Name}
# Run this script after importing workflows into n8n

echo "=== n8n Workflow Setup for {Brand Name} ==="
echo ""
echo "Step 1: Import workflows into n8n"
echo "  Open n8n → Workflows → Import from File"
echo "  Import in this order:"
echo "    1. 01-content-ingestion.json"
echo "    2. 07-form-ingestion.json"
echo "    3. 02-daily-performance.json"
echo "    ... (etc)"
echo ""
echo "Step 2: Configure credentials in n8n"
echo "  Required credentials:"
echo "    - Google Drive API"
echo "    - Anthropic API (Claude)"
echo "    - OpenAI API (Embeddings)"
echo "    - Pinecone API"
echo "    - Neo4j Database"
echo "    - Google Ads API"
echo "    - Meta Marketing API"
echo "    - SendGrid (email)"
echo ""
echo "Step 3: Set workflow variables"
echo "  For each workflow, set these variables:"
echo "    brand_id: {brand-id}"
echo "    brand_name: {Brand Name}"
echo "    google_drive_folder_id: (from Google Drive setup)"
echo "    dashboard_webhook_url: (from dashboard deployment)"
echo "    client_email: (client notification email)"
echo ""
echo "Step 4: Activate workflows"
echo "  Activate in this order:"
echo "    1. Content Ingestion (test with a file upload first)"
echo "    2. Form Ingestion (test with a form submission)"
echo "    3. Daily Performance (runs at 2 AM)"
echo "    4. Creative Rotation (runs at 1 AM)"
echo "    5. Budget Optimization (runs at 3 AM)"
echo "    6. Learn & Remember (runs at 4 AM)"
echo "    7. Weekly Strategy (runs Monday 3 AM)"
```

## Output

After completion, display:

```
Automation Built: {brand_name}
================================

  n8n Workflows
  -------------
  [x] 01-content-ingestion.json     (trigger: Google Drive upload)
  [x] 02-daily-performance.json     (trigger: daily 2:00 AM)
  [x] 03-weekly-strategy.json       (trigger: Monday 3:00 AM)
  [x] 04-creative-rotation.json     (trigger: daily 1:00 AM)
  [x] 05-budget-optimization.json   (trigger: daily 3:00 AM)
  [x] 06-learn-remember.json        (trigger: daily 4:00 AM)
  [x] 07-form-ingestion.json        (trigger: webhook)
  {if ecommerce: [x] 08-shopify-integration.json (trigger: Shopify webhook)}

  Runtime Agent Prompts
  ---------------------
  [x] chief-strategy-officer.md
  [x] creative-intelligence.md
  [x] media-buyer.md
  [x] data-scientist.md
  [x] cultural-anthropologist.md
  [x] client-translator.md

  Documentation
  -------------
  [x] n8n/README.md
  [x] n8n/VERSION
  [x] n8n/setup.sh

  Estimated Monthly Cost: $35-65
  ==============================

  Next Steps:
  1. Import workflows into n8n (see n8n/setup.sh)
  2. Configure n8n credentials
  3. Build dashboard: /build-dashboard name={name}
  4. Build website: /build-website name={name}
```

## Notes

- Workflow JSON files must be valid n8n format — test by importing into n8n
- Each workflow should use workflow-level variables, not hardcoded values
- Error handling is critical — all API calls should have retry logic
- The n8n-system.md spec is the source of truth for workflow architecture
- Workflows are brand-specific but parameterized for easy configuration
- Include position coordinates for visual layout in n8n editor
- Cost estimates should be realistic based on API pricing
