---
name: initialize-client
description: Complete client initialization - research, strategy, creative direction, database setup, configuration, and QA validation
---

# Initialize Client Command

Performs complete initialization for a new client: deep brand research, competitive analysis, strategy development, creative direction, content planning, database setup, runtime agent prompts, integration configuration, Google Drive setup, and QA validation.

## Input

**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug (lowercase, hyphens, no spaces). Example: `zen-med-clinic`
- `url=https://website.com` OR `file=path/to/description.txt` — Either the client's website URL or a path to a text file describing the business

**Parse $ARGUMENTS to extract `name`, `url`, and `file` values.**

If `name` is missing, stop and ask the user for it.
If both `url` and `file` are missing, stop and ask the user to provide one.

## Directory Setup

Set the base paths:
```
FACTORY_ROOT = /Users/jaronarmiger/HELIANTHES/OEUVRE/Droom/marketing-factory
CLIENT_DIR = {FACTORY_ROOT}/clients/{name}
SPECS_DIR = /Users/jaronarmiger/HELIANTHES/OEUVRE/Droom/system-specs
AGENTS_DIR = {FACTORY_ROOT}/.claude/agents
```

**If `CLIENT_DIR` already exists**, ask the user if they want to overwrite or abort.

Create the full client directory structure:
```bash
mkdir -p {CLIENT_DIR}/research
mkdir -p {CLIENT_DIR}/strategy
mkdir -p {CLIENT_DIR}/creative/briefs
mkdir -p {CLIENT_DIR}/content-requests/shot-lists
mkdir -p {CLIENT_DIR}/automation/prompts
mkdir -p {CLIENT_DIR}/database
mkdir -p {CLIENT_DIR}/system-knowledge
mkdir -p {CLIENT_DIR}/integration
mkdir -p {CLIENT_DIR}/n8n/workflows
mkdir -p {CLIENT_DIR}/assets
mkdir -p {CLIENT_DIR}/proposal
mkdir -p {CLIENT_DIR}/credentials
```

## Execution Pipeline

Execute these phases sequentially. Each phase depends on the output of the previous phase. After each phase, verify the expected output files exist before proceeding.

---

### Phase 1: Brand Research

**Read the agent definition:** `{AGENTS_DIR}/brand-research.md`

**Read the relevant system specs:**
- `{SPECS_DIR}/content-profiling-framework.md`

**Execute as the Brand Research Agent:**

- If `url` was provided: Use `web_fetch` to analyze the client website and `web_search` to research their online presence
- If `file` was provided: Read the file for business context, then use `web_search` to find additional information

Follow the complete process defined in the brand-research agent:
1. Website analysis (brand identity, services, visual brand, voice, audience signals, contact/location, social proof)
2. Online presence discovery (social media, reviews)
3. Industry & business model classification
4. Target audience hypothesis (2-3 audiences)
5. Competitive positioning assessment

**Output:** `{CLIENT_DIR}/research/brand-profile.md` (minimum 1500 words, comprehensive)

**Verify:** File exists and contains all required sections before proceeding.

---

### Phase 2: Competitive Intelligence

**Read the agent definition:** `{AGENTS_DIR}/competitive-intelligence.md`

**Execute as the Competitive Intelligence Agent:**

Using the brand profile from Phase 1, conduct competitive analysis:
1. Identify 5-8 direct competitors via web search
2. Analyze each competitor's website, social media, ads, and reputation
3. Create comparative analysis matrix
4. Identify market gaps and opportunities
5. Develop strategic recommendations

**Output:** `{CLIENT_DIR}/research/competitive-landscape.md` (minimum 2000 words)

**Verify:** File exists and contains competitor analysis before proceeding.

---

### Phase 3: Strategy Development

**Read the agent definition:** `{AGENTS_DIR}/strategist.md`

**Read input files:**
- `{CLIENT_DIR}/research/brand-profile.md`
- `{CLIENT_DIR}/research/competitive-landscape.md`

**Execute as the Strategist Agent:**

Synthesize research into comprehensive strategy:
1. Define 2-3 primary demographics with detailed profiles
2. Select 3-4 marketing platforms with rationale
3. Allocate monthly budget across platforms
4. Define campaign goals and KPIs
5. Develop geographic targeting strategy
6. Set content strategy direction
7. Design funnel strategy
8. Establish competitive differentiation and positioning

**Outputs:**
- `{CLIENT_DIR}/brand-config.json` — Master configuration JSON (valid, parseable)
- `{CLIENT_DIR}/strategy/campaign-plan.md` — Narrative strategy document (minimum 3000 words)

**Verify:** Both files exist. Validate that `brand-config.json` is valid JSON with required fields: `brand_id`, `brand_name`, `industry`, `business_model`, `demographics`, `platforms`, `budget`, `campaign_goals`.

---

### Phase 4: Creative Direction

**Read the agent definition:** `{AGENTS_DIR}/creative-director.md`

**Read input files:**
- `{CLIENT_DIR}/brand-config.json`
- `{CLIENT_DIR}/research/brand-profile.md`
- `{CLIENT_DIR}/strategy/campaign-plan.md`

**Execute as the Creative Director Agent:**

Translate strategy into creative execution:
1. Internalize brand voice and personality
2. Develop 5-8 content brief templates
3. Write 15-20 ad copy variations across platforms
4. Establish visual direction guidelines
5. Create production guidance

**Outputs:**
- `{CLIENT_DIR}/creative/creative-strategy.md` — Comprehensive creative direction document
- `{CLIENT_DIR}/creative/briefs/*.md` — 5-8 individual content brief files

**Verify:** Creative strategy file exists and at least 3 brief files exist.

---

### Phase 5: Content Planning (Publicist)

**Read the agent definition:** `{AGENTS_DIR}/publicist.md`

**Read input files:**
- `{CLIENT_DIR}/brand-config.json`
- `{CLIENT_DIR}/creative/creative-strategy.md`
- All files in `{CLIENT_DIR}/creative/briefs/`

**Execute as the Publicist Agent:**

Convert creative briefs into actionable content requests:
1. Extract content volume needs from brand-config
2. Create monthly content calendar
3. Generate detailed shot lists for each brief
4. Write filming guide with equipment and technical specs
5. Provide copy templates with hashtag sets

**Outputs:**
- `{CLIENT_DIR}/content-requests/monthly-content-plan.md`
- `{CLIENT_DIR}/content-requests/filming-guide.md`
- `{CLIENT_DIR}/content-requests/shot-lists/*.md` — One per content brief
- `{CLIENT_DIR}/content-requests/copy-templates.md`

**Verify:** All four output types exist.

---

### Phase 6: Database Setup

**Read the agent definition:** `{AGENTS_DIR}/database-schema.md`

**Read the relevant system specs:**
- `{SPECS_DIR}/neo4j-architecture.md`
- `{SPECS_DIR}/pinecone-architecture.md`
- `{SPECS_DIR}/database-interaction.md`

**Read input files:**
- `{CLIENT_DIR}/brand-config.json`

**Execute as the Database Schema Agent:**

1. Generate all database initialization Python scripts:
   - `{CLIENT_DIR}/database/init_neo4j_constraints.py`
   - `{CLIENT_DIR}/database/init_shared_nodes.py`
   - `{CLIENT_DIR}/database/init_demographics.py`
   - `{CLIENT_DIR}/database/init_schema_version.py`
   - `{CLIENT_DIR}/database/init_pinecone_namespaces.py`

2. Generate database schema documentation:
   - `{CLIENT_DIR}/system-knowledge/database-schema.md`
   - `{CLIENT_DIR}/database/pinecone-namespaces.md`
   - `{CLIENT_DIR}/database/README.md`

3. **Ask the user** if they want to run the database initialization scripts now.
   - If yes: Check for required environment variables (`NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`, `PINECONE_API_KEY`, `PINECONE_ENVIRONMENT`). If missing, prompt the user to set them.
   - If yes and env vars present: Execute the scripts in order (constraints → shared nodes → demographics → schema version → pinecone namespaces).
   - If no: Note in output that scripts need to be run manually before automation can work.

4. Generate `{CLIENT_DIR}/database/INITIALIZATION_SUMMARY.md`

**Verify:** All script files and documentation exist.

---

### Phase 7: Runtime Agent Prompts

**Read the agent definition:** `{AGENTS_DIR}/marketing-agent-prompt-engineer.md`

**Read input files:**
- `{CLIENT_DIR}/brand-config.json`
- `{CLIENT_DIR}/strategy/campaign-plan.md`
- `{CLIENT_DIR}/creative/creative-strategy.md`

**Execute as the Marketing Agent Prompt Engineer:**

Create all 6 runtime agent prompt files:
1. `{CLIENT_DIR}/automation/prompts/chief-strategy-officer.md`
2. `{CLIENT_DIR}/automation/prompts/creative-intelligence.md`
3. `{CLIENT_DIR}/automation/prompts/media-buyer.md`
4. `{CLIENT_DIR}/automation/prompts/data-scientist.md`
5. `{CLIENT_DIR}/automation/prompts/cultural-anthropologist.md`
6. `{CLIENT_DIR}/automation/prompts/client-translator.md`

Each prompt should be 200-400 lines, self-contained, brand-specific, with clear JSON output formats and example scenarios.

**Verify:** All 6 prompt files exist.

---

### Phase 8: Integration Configuration

**Read the agent definition:** `{AGENTS_DIR}/integration-orchestrator.md`

**Read the relevant system specs:**
- `{SPECS_DIR}/integration-flows.md`
- `{SPECS_DIR}/credentials-manager.md`

**Read input files:**
- `{CLIENT_DIR}/brand-config.json`
- `{CLIENT_DIR}/system-knowledge/database-schema.md`

**Execute as the Integration Orchestrator Agent:**

1. Create `{CLIENT_DIR}/integration/connections.json` — All service URLs and connection configs
2. Create `{CLIENT_DIR}/integration/test-suite.py` — Integration test script
3. Create `{CLIENT_DIR}/integration/health-checks.sh` — Quick health check script
4. Create `{CLIENT_DIR}/integration/README.md` — Setup and troubleshooting guide

5. Create credentials template:
   `{CLIENT_DIR}/credentials/.env.template`
   ```
   # Database
   NEO4J_URI=
   NEO4J_USER=
   NEO4J_PASSWORD=
   PINECONE_API_KEY=
   PINECONE_ENVIRONMENT=

   # AI
   ANTHROPIC_API_KEY=
   OPENAI_API_KEY=

   # Google
   GOOGLE_DRIVE_FOLDER_ID=
   GOOGLE_ADS_CLIENT_ID=
   GOOGLE_ADS_CLIENT_SECRET=
   GOOGLE_ADS_REFRESH_TOKEN=
   GOOGLE_ADS_CUSTOMER_ID=

   # Meta
   META_ACCESS_TOKEN=
   META_AD_ACCOUNT_ID=
   META_PIXEL_ID=

   # Email & SMS
   SENDGRID_API_KEY=
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=

   # n8n
   N8N_BASE_URL=
   N8N_API_KEY=

   # Tracking
   GOOGLE_ANALYTICS_ID=
   ```

6. **Ask the user** if they want to configure any credentials now. For each one they provide, write it to `{CLIENT_DIR}/credentials/.env` (add `.env` to `.gitignore` if a git repo).

**Verify:** connections.json, test-suite.py, health-checks.sh, and .env.template all exist.

---

### Phase 9: Google Drive Setup

**Read the relevant system specs:**
- `{SPECS_DIR}/google-drive-setup.md`

Create the Google Drive folder structure documentation:

**Output:** `{CLIENT_DIR}/integration/google-drive-structure.md`

Document the required Google Drive folder structure:
```
{Brand Name} Marketing/
├── Content/
│   ├── Videos/
│   ├── Images/
│   └── Graphics/
├── Reports/
│   ├── Weekly/
│   └── Monthly/
├── Assets/
│   ├── Logo/
│   ├── Brand Guidelines/
│   └── Templates/
└── Archive/
```

Include instructions for:
- Creating the folder structure
- Sharing with service account
- Getting the folder ID for n8n configuration

---

### Phase 10: QA Validation

**Read the agent definition:** `{AGENTS_DIR}/qa.md`

**Execute as the QA Agent:**

Run comprehensive validation across all generated files:

1. **File Existence** — Verify all expected files exist
2. **JSON Validity** — Parse `brand-config.json`, `connections.json`
3. **Variable Substitution** — Check for unsubstituted `{brand-name}` or `{brand-id}` placeholders in all files
4. **Configuration Consistency** — `brand_id` matches across all files
5. **Database Scripts** — Python syntax validation
6. **Integration Points** — Referenced files exist
7. **Documentation Completeness** — All README files present

**Output:** `{CLIENT_DIR}/QA-REPORT.md`

Format as a checklist with PASS/FAIL for each check. If any CRITICAL checks fail, report them prominently.

---

## Final Output

After all phases complete, display a summary to the user:

```
========================================
  Client Initialized: {brand_name}
========================================

  Research & Strategy
  -------------------
  [x] Brand profile          → research/brand-profile.md
  [x] Competitive landscape  → research/competitive-landscape.md
  [x] Campaign strategy      → strategy/campaign-plan.md
  [x] Master configuration   → brand-config.json

  Creative Direction
  ------------------
  [x] Creative strategy      → creative/creative-strategy.md
  [x] Content briefs ({N})   → creative/briefs/
  [x] Monthly content plan   → content-requests/monthly-content-plan.md
  [x] Filming guide          → content-requests/filming-guide.md
  [x] Shot lists ({N})       → content-requests/shot-lists/
  [x] Copy templates         → content-requests/copy-templates.md

  System Configuration
  --------------------
  [x] Database scripts ({N}) → database/
  [x] Database docs          → system-knowledge/database-schema.md
  [x] Runtime prompts (6)    → automation/prompts/
  [x] Integration config     → integration/
  [x] Credentials template   → credentials/.env.template
  [x] Drive structure doc    → integration/google-drive-structure.md

  Validation
  ----------
  [x] QA Report              → QA-REPORT.md
      Critical: {N} pass, {N} fail
      Total:    {N} pass, {N} fail

========================================
  Next Steps
========================================

  1. Add brand assets (logo, images) to:
     clients/{name}/assets/

  2. Generate client proposal:
     /generate-proposal name={name}

  3. Configure credentials:
     Edit clients/{name}/credentials/.env

  4. Run database initialization (if not done):
     cd clients/{name}/database/
     python init_neo4j_constraints.py
     python init_shared_nodes.py
     python init_demographics.py {name}
     python init_schema_version.py {name}

  5. Build automation system:
     /build-automation name={name}

  6. Build dashboard:
     /build-dashboard name={name}

  7. Build website:
     /build-website name={name}
```

## Error Handling

- If any phase fails, report the error clearly and ask the user if they want to retry that phase or skip it
- Do not proceed to a dependent phase if its prerequisite failed
- If web_fetch or web_search fails (e.g., website is down), ask the user to provide a `file` input instead
- If a phase produces incomplete output, note it in the QA report

## Notes

- This command orchestrates multiple agents sequentially. Each phase may take several minutes.
- The command is designed to be re-runnable. If interrupted, you can skip completed phases by checking which output files already exist.
- All agent definitions are in `{AGENTS_DIR}/` — read them for detailed process instructions.
- All system specs are in `{SPECS_DIR}/` — reference them for architectural guidance.
- You do not have to follow specs EXACTLY. The specs provide architectural guidance, but you can make improvements and adjustments as you build.
