---
name: modify-client
description: Makes targeted modifications to an existing client system — strategy changes, new features, component updates
---

<purpose>
# Modify Client

Makes targeted modifications to an existing client system. Instead of rebuilding from scratch, this command analyzes what needs to change, determines which agents to invoke, and coordinates updates across affected components while preserving everything that doesn't need to change.
</purpose>

<input>
**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug matching the client directory name
- Remaining text in $ARGUMENTS is the modification request (what needs to change)

Examples:
- `/modify-client name=zen-med-clinic add a blog section to the website`
- `/modify-client name=zen-med-clinic change monthly budget from $3000 to $5000`
- `/modify-client name=zen-med-clinic add TikTok as a marketing platform`
- `/modify-client name=zen-med-clinic update brand colors to navy and gold`

Parse $ARGUMENTS to extract `name` and the modification description. If `name` is missing, stop and ask.
</input>

<prerequisites>
**Required:** `clients/{name}/` must exist with at least `brand-config.json` and `.manifest.md`

**Read before starting:**
- `clients/{name}/.manifest.md` — Current system state
- `clients/{name}/.build-context.md` — Previous decisions and context
- `clients/{name}/brand-config.json` — Current configuration
- `SYSTEM.md` — System architecture
</prerequisites>

<orchestration>
## Process

### Step 1: Impact Analysis
Read the modification request and the current system state (.manifest.md). Determine:

1. **What changes:** Which configuration values, files, or components are directly affected
2. **Cascade impact:** Which downstream components depend on what's changing
3. **Agents needed:** Which agents need to be invoked in modify mode

**Impact categories:**
- **Strategy change** (budget, platforms, demographics, goals) → Strategist (modify) → cascades to: n8n workflows, dashboard features, runtime prompts, possibly website
- **Creative change** (brand colors, voice, visual direction) → Creative Director (modify) → cascades to: website, dashboard theming, proposal
- **Website change** (new pages, form changes, design updates) → Website Architect (modify) → may cascade to: integration config
- **Dashboard change** (new metrics, UI changes, new data sources) → Dashboard Architect (modify) → may cascade to: n8n webhooks
- **Automation change** (new workflow, schedule change, new platform) → n8n Architect (modify) → may cascade to: runtime prompts, integration config
- **Database change** (new node types, new relationships) → Database Schema (modify) → cascades to: n8n workflows, dashboard queries

### Step 2: Present Impact Assessment
Before making changes, present to the user:
- What will change (files affected)
- What will cascade (downstream updates)
- What won't change (preserved components)
- Estimated scope (number of agents, files affected)

Ask for confirmation before proceeding.

### Step 3: Execute Modifications
Invoke affected agents in dependency order, each in **modify mode**:
1. Update source of truth first (brand-config.json if strategy change)
2. Update intermediate dependencies (database schema, creative direction)
3. Update downstream consumers (workflows, dashboard, website)
4. Re-run integration tests if integration points changed

Each agent reads the current codebase, makes targeted changes, and preserves everything else.

### Step 4: Verify
- Check that modified components still work (no broken imports, routes, types)
- Verify integration points still align (webhook URLs, API endpoints)
- Update .manifest.md with changes
- Update .build-context.md with modification decisions

### Step 5: Summary
Report what was changed, what was preserved, and any manual steps needed.
</orchestration>

<context_flow>
- Read `.manifest.md` to understand current state before modifying
- Read `.build-context.md` for context on why things were built the way they are
- Append modification decisions to `.build-context.md` under `<decisions>`
- Update `.manifest.md` with new system state after modifications
- Record learnings in `factory-memory/patterns.md` if the modification reveals a common pattern
</context_flow>

<error_handling>
- If modification request is ambiguous, ask for clarification before proceeding
- If a modification would break integration points, warn the user and suggest alternatives
- If an agent fails during modification, report which agent and what failed — don't cascade to downstream agents
- Always preserve the ability to roll back (don't delete original files, modify in place)
</error_handling>

<completion>
Display: modification summary (what changed, what was preserved), files modified with paths, integration verification results, any manual steps needed, and updated system state.
</completion>
