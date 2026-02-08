---
name: initialize-client
description: Complete client initialization - research, strategy, creative direction, database setup, configuration, and QA validation
---

<purpose>
# Initialize Client

Performs complete initialization for a new client: deep brand research, competitive analysis, strategy development, creative direction, content planning, database setup, runtime agent prompts, integration configuration, and QA validation. This is the primary entry point for onboarding a new client into the marketing system.
</purpose>

<input>
**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug (lowercase, hyphens, no spaces). Example: `zen-med-clinic`
- `url=https://website.com` OR `file=path/to/description.txt` — Either the client's website URL or a path to a text file describing the business

Parse $ARGUMENTS to extract `name`, `url`, and `file` values. If `name` is missing, stop and ask. If both `url` and `file` are missing, stop and ask.
</input>

<prerequisites>
**Base paths:**
- `FACTORY_ROOT` = the marketing-factory directory (parent of this command file)
- `CLIENT_DIR` = `{FACTORY_ROOT}/clients/{name}`
- `SPECS_DIR` = `{FACTORY_ROOT}/system-specs`
- `AGENTS_DIR` = `{FACTORY_ROOT}/.claude/agents`

**Before starting:**
- If `CLIENT_DIR` already exists, ask the user if they want to overwrite or abort
- Read `FACTORY_ROOT/SYSTEM.md` for system architecture context
- Read `FACTORY_ROOT/factory-memory/patterns.md` for learnings from previous client builds
- Create `CLIENT_DIR` with subdirectories: research/, strategy/, creative/briefs/, content-requests/shot-lists/, automation/prompts/, database/, integration/, assets/, proposal/, docs/
- Initialize `CLIENT_DIR/.build-context.md` from `FACTORY_ROOT/templates/build-context-template.md`
- Initialize `CLIENT_DIR/.manifest.md` from `FACTORY_ROOT/templates/manifest-template.md`
</prerequisites>

<orchestration>
## Execution Pipeline

Execute phases sequentially. Each phase depends on the output of the previous phase. After each phase, verify expected output files exist before proceeding.

### Phase 1: Brand Research
**Agent:** brand-research → **Spec:** system-specs/content-profiling.md
**Input:** `url` or `file` from arguments
**Output:** `research/brand-profile.md` (minimum 1500 words)
**Verify:** File exists with all required sections

### Phase 2: Competitive Intelligence
**Agent:** competitive-intelligence
**Input:** research/brand-profile.md
**Output:** `research/competitive-landscape.md` (minimum 2000 words)
**Verify:** File contains competitor analysis

### Phase 3: Strategy Development
**Agent:** strategist
**Input:** research/brand-profile.md, research/competitive-landscape.md
**Outputs:**
- `brand-config.json` — Master configuration (valid JSON with: brand_id, brand_name, industry, business_model, demographics, platforms, budget, campaign_goals)
- `strategy/campaign-plan.md` — Narrative strategy (minimum 3000 words)
**Verify:** brand-config.json is valid JSON with required fields

### Phase 4: Creative Direction
**Agent:** creative-director
**Input:** brand-config.json, research/brand-profile.md, strategy/campaign-plan.md
**Outputs:**
- `creative/creative-strategy.md` — Comprehensive creative direction
- `creative/briefs/*.md` — 5-8 content brief files
**Verify:** Creative strategy exists and at least 3 briefs exist

### Phase 5: Content Planning
**Agent:** publicist
**Input:** brand-config.json, creative/creative-strategy.md, creative/briefs/*.md
**Outputs:**
- `content-requests/monthly-content-plan.md`
- `content-requests/filming-guide.md`
- `content-requests/shot-lists/*.md` — One per content brief
- `content-requests/copy-templates.md`
**Verify:** All four output types exist

### Phase 6: Database Setup
**Agent:** database-schema → **Spec:** system-specs/database-design.md
**Input:** brand-config.json, environment variables (NEO4J_*, PINECONE_*)
**Outputs:**
- `database/init_neo4j.py` — Neo4j initialization script
- `database/init_pinecone.py` — Pinecone verification script
- `database/schema-docs.md` — Schema documentation
- `database/init-summary.md` — Initialization results
**Action:** Ask user if they want to run initialization scripts now. If yes, check for required env vars first.
**Verify:** All script and doc files exist

### Phase 7: Runtime Agent Prompts
**Agent:** marketing-agent-prompt-engineer
**Input:** brand-config.json, strategy/campaign-plan.md, creative/creative-strategy.md
**Output:** 6 files in `automation/prompts/`: chief-strategy-officer.md, creative-intelligence.md, media-buyer.md, data-scientist.md, cultural-anthropologist.md, client-translator.md
**Verify:** All 6 prompt files exist

### Phase 8: Integration Configuration
**Agent:** integration-orchestrator → **Spec:** system-specs/integration-patterns.md, system-specs/credentials-and-setup.md
**Input:** brand-config.json, database/schema-docs.md
**Outputs:**
- `integration/connections.json` — Service URLs and connection configs
- `integration/test-suite.py` — Integration test script
- `integration/health-checks.sh` — Health check script
- `integration/README.md` — Setup and troubleshooting
- `credentials/.env.template` — Environment variable template
**Action:** Ask user if they want to configure any credentials now
**Verify:** All integration files exist

### Phase 9: Google Drive Setup
**Spec:** system-specs/credentials-and-setup.md
**Output:** `integration/google-drive-structure.md` — Required folder structure and setup instructions

### Phase 10: QA Validation
**Agent:** qa
**Input:** All generated files
**Output:** `QA-REPORT.md` — Pass/fail checklist for all validation checks
</orchestration>

<context_flow>
## Context Flow Between Phases

Each agent appends decisions, discoveries, and warnings to `.build-context.md`. Subsequent agents read this file before starting.

- Phase 1-2 → Phase 3: Research findings inform strategy decisions
- Phase 3 → All subsequent: brand-config.json is the master config every agent reads
- Phase 4 → Phase 5: Creative direction drives content planning
- Phase 3 → Phase 6: Business model determines which database nodes to create
- Phase 6 → Phase 8: Schema details inform integration configuration
- All phases → Phase 10: QA validates everything produced

After all phases, update `.manifest.md` with complete system state.
</context_flow>

<error_handling>
- If any phase fails, report the error clearly and ask the user to retry or skip
- Do not proceed to a dependent phase if its prerequisite failed
- If web_fetch or web_search fails, ask user to provide a `file` input instead
- If a phase produces incomplete output, note it in the QA report
- The command is re-runnable — skip completed phases by checking which output files already exist
</error_handling>

<completion>
After all phases, display a summary showing:
- All files created with paths (grouped by: Research & Strategy, Creative Direction, System Configuration, Validation)
- QA report summary (critical pass/fail counts)
- Next steps: add brand assets, generate proposal (`/generate-proposal`), configure credentials, run database init (if skipped), build automation/dashboard/website
</completion>
