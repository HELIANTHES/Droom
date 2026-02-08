# Agent Collaboration

<purpose>
This spec defines how agents collaborate during builds, modifications, and debugging. The system uses 14 factory agents (in `.claude/agents/`) that build and maintain client systems, plus 6 runtime agents (invoked by n8n workflows via Claude API) that make daily marketing decisions.

Agents are specialists with clear boundaries. They collaborate through structured handoffs, a shared scratchpad (`.build-context.md`), and orchestrator-managed context distillation — not by reading each other's full outputs or doing each other's jobs.
</purpose>

---

<design_principles>
## Design Principles

- **Clear authority domains** — Each agent owns specific outputs and decisions. The strategist owns brand-config.json. The n8n-architect owns workflow files. No agent modifies another agent's outputs without going through the orchestrator.
- **File-based handoffs** — Agents communicate by writing files that downstream agents read. brand-profile.md → brand-config.json → workflow JSONs. The file system is the communication medium.
- **Context distillation, not context forwarding** — The orchestrator doesn't pass entire upstream outputs to downstream agents. It distills relevant context into focused briefs. A 50-page brand profile becomes a 2-paragraph summary for the database-schema agent.
- **Shared scratchpad for cross-cutting concerns** — The `.build-context.md` file captures decisions, discoveries, cross-agent requests, and warnings that don't belong in any single agent's output files. Every agent reads it before starting and appends to it when done.
- **Fail-forward with logging** — If an agent encounters an issue it can't resolve, it logs the issue to `.build-context.md` under `<warnings>` and continues with its best judgment. The QA agent catches inconsistencies at the end.
</design_principles>

---

<patterns>
## Collaboration Patterns

### Pattern 1: Sequential Pipeline (Initial Build)
Agents execute in ordered phases. Each phase's outputs become the next phase's inputs.

```
Phase 1 (Research, parallel): Brand Research + Competitive Intelligence
Phase 2 (Strategy): Strategist reads research outputs → brand-config.json
Phase 3 (Creative): Creative Director + Publicist read strategy
Phase 4 (Infrastructure, parallel): Database Schema + n8n Architect + Prompt Engineer — all read brand-config.json
Phase 5 (Presentation, parallel): Dashboard Architect + Website Architect — read brand-config.json + infrastructure outputs
Phase 6 (Integration): Integration Orchestrator verifies all connections
Phase 7 (Quality): QA validates everything
```

### Pattern 2: Targeted Modification
The orchestrator analyzes the modification request, reads `.manifest.md` to understand current system state, and routes to only the affected agents with focused context.

```
User request → Orchestrator → reads .manifest.md → determines impact scope → invokes 1-3 specific agents with distilled context → agents make targeted changes → orchestrator updates .manifest.md
```

### Pattern 3: Debug Investigation
The orchestrator traces the issue through the dependency chain, invoking agents in diagnostic mode.

```
Bug report → Orchestrator → reads .manifest.md + .build-context.md → identifies likely affected components → invokes relevant agents in debug mode → agents investigate and propose fixes → orchestrator synthesizes findings
```

### Pattern 4: Runtime Agent Collaboration (in n8n)
Runtime agents (CSO, Creative Intelligence, Media Buyer, Data Scientist, Cultural Anthropologist, Client Translator) collaborate within n8n workflows via sequential API calls. Each receives the previous agent's output as part of its context.

```
Performance data → CSO Agent (strategic analysis) → Media Buyer Agent (execute tactical changes)
Week's data → CSO + Creative Intelligence + Cultural Anthropologist + Data Scientist → Client Translator (synthesize for client report)
```

## Build Context Protocol

During any multi-agent operation, the `.build-context.md` scratchpad follows this protocol:

1. **Before starting:** Agent reads current `.build-context.md` to understand prior decisions and cross-agent requests
2. **During work:** Agent notes any decisions that affect other agents, discoveries about the client's system, or questions that need resolution
3. **After completing:** Agent appends its entries to the appropriate sections (`<decisions>`, `<discoveries>`, `<cross_agent_requests>`, `<warnings>`)
4. **Orchestrator role:** Between agent invocations, the orchestrator reads new entries and incorporates relevant ones into the next agent's context brief

## Manifest Update Protocol

After any modification to a client system:

1. Agent identifies which components it changed
2. Agent updates the relevant rows in `.manifest.md` `<system_state>` table (status, last_modified, notes)
3. Agent adds an entry to `<change_log>` describing what changed and why
4. If new dependencies were created, agent updates `<dependency_map>`
</patterns>

---

<interfaces>
## Agent Authority Matrix

| Domain | Authority (owns decisions) | Consulted (provides input) |
|--------|---------------------------|---------------------------|
| Brand identity & strategy | Strategist | Brand Research, Competitive Intelligence |
| Creative direction | Creative Director | Strategist, Publicist |
| Content requests | Publicist | Creative Director |
| Database schema | Database Schema Agent | Strategist (for data model), n8n Architect (for query needs) |
| Workflow design | n8n Architect | Strategist (for goals), Prompt Engineer (for agent integration) |
| Runtime prompts | Prompt Engineer | Strategist (for brand voice), Creative Director (for tone) |
| Dashboard | Dashboard Architect | Strategist (for KPIs), Website Architect (for consistency) |
| Website | Website Architect | Strategist (for conversion goals), Creative Director (for visual direction) |
| Integration testing | Integration Orchestrator | All system builders |
| Quality validation | QA Agent | All agents |
| Routing & context | Orchestrator | None — it coordinates, never builds |

## Conflict Resolution

If agents produce contradictory outputs (e.g., strategist targets one demographic, creative director designs for another):
1. The orchestrator detects the inconsistency via `.build-context.md` or QA validation
2. The authority agent for that domain (see matrix above) has final say
3. The resolution is logged in `.build-context.md` under `<decisions>` for future reference
</interfaces>

---

<constraints>
## Constraints

- No agent should read another agent's full output files unless it's a direct downstream consumer
- The orchestrator never builds anything — it only routes, distills, and coordinates
- `.build-context.md` entries must be append-only during a build (never delete previous entries)
- `.manifest.md` must be updated after every modification, not just during initial builds
- Runtime agents in n8n cannot access factory agent files — they operate solely within the client system
- Maximum 3 agents invoked per modification request (keep changes targeted)
</constraints>

---

<quality_criteria>
## Quality Criteria

- Every agent invocation must have a clear input context and expected output format
- Build context must be readable by any agent without additional explanation
- Manifest must accurately reflect the current state of all client system components
- QA agent must validate cross-agent consistency (e.g., brand-config.json values match what downstream agents actually built)
- Agent execution should be logged with: agent name, mode (build/modify/debug), duration, input context size, output files created/modified
</quality_criteria>
