---
name: debug-client
description: Investigates and diagnoses issues in an existing client system — broken integrations, workflow failures, data inconsistencies
---

<purpose>
# Debug Client

Investigates and diagnoses issues in an existing client system. Traces data flows, checks integration points, validates configurations, and identifies root causes. Proposes fixes but asks before applying them.
</purpose>

<input>
**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug matching the client directory name
- Remaining text in $ARGUMENTS is the problem description (what's going wrong)

Examples:
- `/debug-client name=zen-med-clinic forms are not appearing in the dashboard`
- `/debug-client name=zen-med-clinic n8n workflow failing with Neo4j connection error`
- `/debug-client name=zen-med-clinic content uploaded but not showing in content library`
- `/debug-client name=zen-med-clinic weekly reports not being sent`

Parse $ARGUMENTS to extract `name` and the problem description. If `name` is missing, stop and ask.
</input>

<prerequisites>
**Required:** `clients/{name}/` must exist

**Read before starting:**
- `clients/{name}/.manifest.md` — Current system state
- `clients/{name}/.build-context.md` — Previous decisions and known issues
- `clients/{name}/brand-config.json` — Current configuration
- `clients/{name}/QA-REPORT.md` — Previous validation results (if exists)
- `SYSTEM.md` — System architecture
- `system-specs/integration-patterns.md` — Expected data flows
</prerequisites>

<orchestration>
## Process

### Step 1: Understand the Problem
Read the problem description and categorize it:

**Problem categories:**
- **Data not flowing:** Content/leads/performance data not appearing where expected
- **Integration failure:** Components can't communicate (webhook failures, API errors, database connection)
- **Configuration mismatch:** IDs, URLs, or credentials don't match across components
- **Workflow failure:** n8n workflow errors, agent prompt issues, scheduling problems
- **Display issue:** Dashboard/website showing wrong data or broken UI
- **Performance issue:** Slow queries, high API costs, timeout errors

### Step 2: Trace the Data Flow
Based on the problem category, trace the relevant data flow path:

- **Content not appearing:** Google Drive → n8n content-ingestion → Claude Vision → embedding → Pinecone + Neo4j → dashboard API → frontend
- **Forms not processing:** Website form → API route → n8n webhook → Neo4j lead → scoring → notification
- **Performance data missing:** Cron trigger → platform API → Neo4j storage → dashboard API → frontend
- **Reports not sending:** Cron trigger → Neo4j queries → agent analysis → email send
- **Purchase attribution broken:** Shopify webhook → n8n → Neo4j customer/purchase → ROAS update

For each step in the flow, check:
1. Is the component configured correctly?
2. Are credentials/URLs valid?
3. Is data leaving this step in the expected format?
4. Is the next step receiving it?

### Step 3: Check Integration Points
Run targeted checks on the suspected failure point:
- Read relevant configuration files (connections.json, .env files, workflow JSON)
- Check for common issues: mismatched brand_id, wrong webhook URLs, missing env vars, expired credentials
- If health-checks.sh exists, run it
- If test-suite.py exists, run relevant tests

### Step 4: Identify Root Cause
Present findings:
- **Where the flow breaks** (specific component and step)
- **Why it breaks** (misconfiguration, missing data, code error, external service issue)
- **Evidence** (specific file, line, or configuration value that's wrong)

### Step 5: Propose Fix
Present the fix to the user:
- What needs to change (specific files, values)
- Which agent should make the fix (if code changes needed)
- Any manual steps required (credential updates, service restarts)
- Risk assessment (will the fix affect other components?)

**Ask for confirmation before applying any fixes.**

### Step 6: Apply Fix (if approved)
Invoke the appropriate agent in modify mode to make the fix. Then:
- Re-run the relevant integration tests
- Verify the data flow now works end-to-end
- Update .build-context.md with the issue and resolution under `<discoveries>`
- Update .manifest.md if system state changed
</orchestration>

<context_flow>
- Read `.manifest.md` to understand what's deployed and configured
- Read `.build-context.md` for known issues and warnings from build time
- After resolution, append to `.build-context.md` under `<discoveries>`: problem, root cause, fix applied
- If the issue reveals a systemic pattern, record in `factory-memory/anti-patterns.md`
</context_flow>

<error_handling>
- If the problem is unclear, ask the user for more details (error messages, when it started, what changed)
- If the issue is external (API down, credentials expired), report it clearly — don't try to fix external services
- If multiple issues found, prioritize by severity (data loss > broken flow > display issue)
- Never apply fixes without user confirmation
</error_handling>

<completion>
Display: problem summary, root cause identified, fix applied (or proposed), verification results, and any preventive recommendations.
</completion>
