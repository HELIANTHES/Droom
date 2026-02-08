---
name: build-automation
description: Builds complete n8n workflow JSON files and automation system for a client
---

<purpose>
# Build Automation

Generates all n8n workflow JSON files, verifies runtime agent prompts exist, and creates workflow documentation. These workflows are the autonomous runtime engine — once activated, they run the client's marketing system without human intervention.
</purpose>

<input>
**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug matching the client directory name

Parse $ARGUMENTS to extract `name`. If missing, stop and ask.
</input>

<prerequisites>
**Required files (stop if missing, instruct user to run `/initialize-client` first):**
- `clients/{name}/brand-config.json`
- `clients/{name}/strategy/campaign-plan.md`
- `clients/{name}/creative/creative-strategy.md`
- `clients/{name}/database/schema-docs.md`

**Optional check:** If `clients/{name}/credentials/.env` exists, verify database connectivity. If not configured, warn but continue — workflows can be generated without live database access.

**Read system context:**
- `SYSTEM.md` for architecture
- `system-specs/n8n-system.md` for workflow specification
- `system-specs/integration-patterns.md` for data flows
- `system-specs/database-design.md` for database interaction patterns
- `.build-context.md` for upstream decisions
</prerequisites>

<orchestration>
## Process

### Step 1: Read Configuration
Read brand-config.json. Extract: brand_id, brand_name, business_model, platforms, demographics, budget, campaign_goals. Determine which workflows to generate based on business_model.

### Step 2: Generate n8n Workflows
**Agent:** n8n-architect → **Spec:** system-specs/n8n-system.md

Generate complete, valid n8n workflow JSON files in `clients/{name}/automation/`:

**Core workflows (always built):**
1. `content-ingestion.json` — Google Drive trigger → Claude Vision analysis → embedding → dual storage → dashboard notification
2. `daily-performance.json` — Cron 2AM → fetch platform data → CSO Agent analysis → tactical decisions → dashboard update
3. `weekly-strategy.json` — Cron Monday 3AM → multi-agent analysis (CSO → Creative Intelligence → Cultural Anthropologist → Data Scientist) → Client Translator report → email + dashboard
4. `creative-rotation.json` — Cron 1AM → detect fatigue → find replacements → gradual rotation
5. `budget-optimization.json` — Cron 3AM → ROAS analysis → Data Scientist + CSO decisions → Media Buyer execution
6. `learn-and-remember.json` — Cron 4AM → store patterns → update weights → identify surprises
7. `form-ingestion.json` — Webhook → validate → Neo4j lead → Claude scoring → route by tier → notify

**Conditional:**
8. `shopify-integration.json` — Shopify webhook → purchase attribution → ROAS update (e-commerce/hybrid only)

**Requirements per workflow:** Valid n8n JSON importable without modification, workflow-level variables (not hardcoded), error handler nodes, both cron/webhook AND manual trigger, all queries filter by brand_id.

### Step 3: Verify Runtime Agent Prompts
Check that all 6 runtime agent prompts exist in `automation/prompts/`. If any missing, generate them using the marketing-agent-prompt-engineer agent.

### Step 4: Create Documentation
- `automation/README.md` — Overview, setup instructions, activation order, cost estimates, troubleshooting
- `automation/VERSION` — Version tracking JSON
- `automation/setup.sh` — Helper script for n8n import and credential setup
</orchestration>

<context_flow>
- Read `.build-context.md` for database schema decisions and any warnings
- Append workflow configuration decisions to `.build-context.md`
- Update `.manifest.md` with automation system state
- Coordinate with Prompt Engineer: workflow prompt file paths must match `automation/prompts/{agent-name}.md`
</context_flow>

<error_handling>
- If required files missing, instruct user to run `/initialize-client` first
- If database not accessible, warn but continue generating workflow files
- Validate each workflow JSON is parseable before writing
</error_handling>

<completion>
Display: all workflow files created with triggers and schedule times, runtime agent prompts status, documentation files, estimated monthly cost ($35-65), and next steps (import into n8n, configure credentials, build dashboard, build website).
</completion>
