# Marketing Factory — System Context

<system_overview>
The Marketing Factory is an AI-powered agency operated by Claude CLI. It builds complete, autonomous marketing systems for clients. Each client gets a customized suite: brand research, marketing strategy, n8n workflow automation (with 6 runtime AI agents making daily optimization decisions), an analytics dashboard, and a conversion-optimized website. After initial build, the same agents continue to modify, debug, and optimize each client's system over time.

The factory operates from `/marketing-factory/`. Client systems live in `/marketing-factory/clients/{brand-name}/`.
</system_overview>

---

<architecture>
## System Architecture

**The Factory (Layer 1)** — What you're operating within:
- `SYSTEM.md` — This file. Global context for every agent.
- `system-specs/` — Domain-specific design principles and patterns (8 focused specs)
- `.claude/agents/` — 14 agent definitions, each owning a specific domain
- `.claude/commands/` — User-facing commands that orchestrate agents
- `factory-memory/` — Cross-client learnings that accumulate over time
- `templates/` — Reusable templates (build context, manifest)

**Client Systems (Layer 2)** — What the factory builds per client:
- `automation/` — n8n workflow JSON files + 6 runtime agent prompts
- `dashboard/` — Next.js frontend + FastAPI backend (3-level progressive disclosure)
- `website/` — Next.js site (service business or e-commerce, determined by business model)
- `database/` — Initialization scripts for Neo4j + Pinecone
- `research/` — Brand profile + competitive landscape analysis
- `strategy/` — Campaign plan + master configuration (brand-config.json)
- `creative/` — Creative strategy + content briefs
- `content-requests/` — Shot lists, filming guides, copy templates for client
- `integration/` — Connection configs, test suite, health checks

**Key file:** `clients/{name}/brand-config.json` is the master configuration. Every downstream agent and component reads it. It contains brand identity, demographics, platforms, budget, campaign goals, geographic strategy, and content direction.
</architecture>

---

<data_flow>
## How Data Flows

**During Client Build (Layer 1 → Layer 2):**
```
Brand Research → Competitive Intelligence → Strategist → Creative Director → Publicist
                                               ↓
                                        brand-config.json
                                               ↓
                    ┌──────────────────────┬────┴─────────────────┐
              Database Schema        n8n Architect          Prompt Engineer
                    ↓                     ↓                       ↓
           Neo4j + Pinecone       7-9 Workflow JSONs      6 Runtime Prompts
                    │                     │                       │
                    └──────────┬──────────┘                       │
                               ↓                                  │
                    Dashboard Architect ←──────────────────────────┘
                               ↓
                    Website Architect
                               ↓
                    Integration Orchestrator → QA
```

**During Runtime (Layer 2, autonomous):**
```
Content Upload → Google Drive → n8n Content Ingestion → Claude Vision → Neo4j + Pinecone
                                                                              ↓
Daily (2 AM) → n8n Performance Analysis → CSO Agent → Budget/Creative Decisions
                                                              ↓
Weekly (Mon 3 AM) → n8n Strategy Review → All 6 Agents → Client Report via Email
                                                              ↓
Website Form → n8n Form Ingestion → Lead Scoring → Neo4j → Dashboard + Notifications
```

**During Modifications (Layer 1 → Layer 2):**
```
User Request → Orchestrator → reads .manifest.md → determines affected agents
                                                  → routes with focused context
                                                  → agents make targeted changes
                                                  → updates .manifest.md
```
</data_flow>

---

<conventions>
## Shared Conventions

**Brand Isolation:** All clients share Neo4j and Pinecone infrastructure. Isolation is via `brand_id` property on every node and vector namespace (`{type}-{brand_id}`). Never query without filtering by brand_id.

**Directory Pattern:** Client directories follow a consistent structure. All agents create outputs within `clients/{name}/`. The directory structure is not rigidly prescribed — agents create what they need — but the top-level categories (research, strategy, creative, automation, dashboard, website, database, integration) are consistent.

**Configuration Pattern:** `brand-config.json` is the single source of truth for client configuration. It includes: brand_id, brand_name, industry, business_model, demographics (primary/secondary/tertiary), platforms, budget allocation, campaign_goals, geographic_strategy, content_strategy, contact info, and tracking IDs.

**Business Model Routing:** The `business_model` field in brand-config.json determines what gets built:
- `brick-and-mortar-primary` or `service-online` → Service business website, geographic targeting, lead-focused KPIs
- `ecommerce-primary` → E-commerce website with Shopify, purchase attribution, ROAS-focused KPIs
- `hybrid` → E-commerce site with service booking, all features enabled

**Inter-Agent Collaboration:** During builds and modifications, agents communicate via `.build-context.md` (shared scratchpad). Every agent reads it before starting, appends key decisions/reasoning/requests when done. See `system-specs/agent-collaboration.md` for the protocol.

**System State Tracking:** Each client has a `.manifest.md` that records what's deployed, what's changed, and what depends on what. Any agent making changes must update the manifest. See `templates/manifest-template.md` for structure.

**Structured Markup:** All factory files use semantic XML tags for efficient parsing. Different file types use different tag sets appropriate to their purpose. This lets agents quickly identify what kind of information they're reading.

**Arguments Convention:** All commands accept `name=brand-name` via $ARGUMENTS. The name must be lowercase with hyphens (e.g., `zen-med-clinic`).
</conventions>

---

<database_philosophy>
## Database Design Philosophy

**Neo4j (Graph Database)** — Structured facts and relationships:
- Stores: Content nodes, Campaign nodes, Performance records, Lead/Customer data, Demographic profiles, Geographic areas
- Relationships encode meaning: `(Content)-[:HAS_TONE]->(Tone)`, `(Campaign)-[:TARGETED]->(Demographic)`, `(Lead)-[:CAME_FROM]->(Campaign)`
- Shared attribute nodes (Tone, Aesthetic, ColorPalette, Composition, Platform, TimeSlot) have no brand_id — they're universal
- Learned relationships grow over time: `(Demographic)-[:RESPONDS_TO {avg_roas, sample_size}]->(Tone)`
- Queried by: n8n workflows (performance data, content metadata), dashboard backend (all views), lead management

**Pinecone (Vector Database)** — Semantic memory and similarity search:
- Single index: `marketing-automation`, isolated by namespaces: `{type}-{brand_id}`
- 5 namespace types: content-essence (semantic content profiles), scenario-outcomes (historical campaign results), audience-psychographics (behavioral patterns), narrative-patterns (storytelling approaches), cross-campaign-learnings (shared across all brands)
- Embedding model: OpenAI text-embedding-3-small (1536 dimensions)
- Queried by: n8n workflows ("find similar content", "what happened in similar situations?"), runtime agents (context for decisions)

**When to use which:**
- Need exact facts, metrics, or relationships? → Neo4j
- Need "find something similar" or "what worked in a situation like this"? → Pinecone
- Performance data → Neo4j (structured, aggregatable)
- Content understanding → Pinecone (semantic similarity)
- Both are updated together — content ingestion writes to both, performance analysis updates both

**One-Time Profiling Principle:** Content (video/images) is analyzed once at upload via Claude Vision, producing a rich semantic profile. This profile is stored as a vector in Pinecone and as node properties/relationships in Neo4j. All future decisions query the stored profile — the original media is never re-analyzed.
</database_philosophy>

---

<agent_roles>
## Agent Categories

**Intelligence Generators** — Research and strategy (run during initialization):
- `brand-research` — Analyzes client website and online presence, extracts brand identity
- `competitive-intelligence` — Maps competitive landscape, identifies market gaps
- `strategist` — Synthesizes research into marketing strategy, creates brand-config.json
- `creative-director` — Translates strategy into creative direction and content briefs
- `publicist` — Converts creative briefs into actionable content requests for the client

**System Builders** — Create the technical infrastructure:
- `database-schema` — Designs and initializes Neo4j + Pinecone schemas
- `n8n-architect` — Creates the n8n workflow automation suite (7-9 workflows)
- `marketing-agent-prompt-engineer` — Creates the 6 runtime agent prompts used by n8n
- `dashboard-architect` — Builds the analytics dashboard (Next.js + FastAPI)
- `website-architect` — Builds the client website (service business or e-commerce)
- `integration-orchestrator` — Creates integration configs, test suites, health checks

**Cross-System:**
- `orchestrator` — Routes requests to the right agents, manages context flow, does not build anything
- `documentation` — Creates system documentation and client handoff materials
- `qa` — Validates all generated files for completeness, correctness, consistency

**Runtime Agents** (live in client systems, invoked by n8n workflows):
- Chief Strategy Officer — High-level budget and campaign decisions
- Creative Intelligence — Content rotation and creative gap analysis
- Media Buyer — Executes tactical ad platform changes
- Data Scientist — Statistical analysis and predictions
- Cultural Anthropologist — Explains audience behavior patterns
- Client Translator — Converts technical insights to client-friendly narratives

**All agents operate in four modes:** build (create from scratch), modify (targeted changes), debug (investigate issues), and optimize (improve based on data). They are not disposable build tools — they are the ongoing engineering team for each client system.
</agent_roles>

---

<runtime_system>
## Runtime System (n8n Workflows)

After initial build, the client system runs autonomously via n8n:

**Core Workflows:**
1. Content Ingestion — Triggered by Google Drive upload, analyzes content with Claude Vision, stores in both databases
2. Daily Performance Analysis — 2 AM daily, fetches platform data, CSO agent makes optimization decisions
3. Weekly Strategy Review — Monday 3 AM, all 6 agents analyze the week, generates client report
4. Creative Rotation — 1 AM daily, detects fatigued content, finds and deploys replacements
5. Budget Optimization — 3 AM daily, optimizes budget allocation across platforms/demographics/geo/time
6. Learn & Remember — 4 AM daily, stores historical patterns, updates relationship weights, identifies learnings
7. Form Ingestion — Webhook, processes website form submissions, scores leads, routes by priority

**Conditional Workflow:**
8. Shopify Integration — Webhook from Shopify, attributes purchases to campaigns (e-commerce only)

**Estimated monthly cost:** $35-65 for API calls (Claude, OpenAI, platform APIs)
</runtime_system>
