---
name: initialize-factory
description: Bootstrap the complete marketing-factory structure from system specifications
---

# Initialize Factory Command

Creates the complete marketing-factory/ directory structure and all foundational agent files that will build client systems.

## Purpose

This command creates the Layer 1 factory infrastructure. The factory will then be capable of spawning complete client systems (Layer 2) that include marketing intelligence (n8n), analytics dashboards, and customer-facing websites.

## What This Command Creates

### Directory Structure
```
marketing-factory/
  .claude/
    agents/          # 23 agent.md files
    commands/        # 3 command.md files
  templates/         # Empty initially (Layer 1 populates on first spawn)
  system-knowledge/  # Empty initially (Layer 1 populates on first spawn)
  versions/          # Version tracking
  clients/           # Empty initially (Layer 1 spawns client systems here)
  README.md
```

### Agent Files (23 total)

**Intelligence Generators:**
1. orchestrator.md
2. brand-research.md
3. competitive-intelligence.md
4. strategist.md
5. creative-director.md
6. publicist.md

**Marketing Intelligence Architects:**
7. n8n-architect.md
8. database-schema.md
9. marketing-agent-prompt-engineer.md

**Dashboard Architects:**
10. dashboard-architect.md
11. data-visualization.md
12. dashboard-ux.md
13. dashboard-api.md

**Website Architects:**
14. website-strategist.md
15. website-designer.md
16. landing-page.md
17. form-conversion.md
18. ecommerce.md
19. website-backend.md

**Cross-System:**
20. integration-orchestrator.md
21. documentation.md
22. version-control.md
23. qa.md

### Command Files (3 total)
1. spawn-client.md
2. update-client.md
3. rollback-client.md

## Execution Steps

### 1. Read Foundation Documents

Read all files in `/droom/system-specs/` to understand:
- How Pinecone vector database should be designed
- How Neo4j graph database should be structured
- How databases interact with each other and other systems
- How n8n workflows should be structured
- How dashboards should be architected
- How websites should be built
- How systems integrate
- How agents collaborate
- How content should be profiled
- How versions should be managed

Also read `/droom/spec.md` for overall system vision.

### 2. Create Directory Structure

Create the following directory structure in `/marketing-factory/`:

```bash
mkdir -p marketing-factory/.claude/agents
mkdir -p marketing-factory/.claude/commands
mkdir -p marketing-factory/templates/n8n-workflows
mkdir -p marketing-factory/templates/dashboard
mkdir -p marketing-factory/templates/website
mkdir -p marketing-factory/templates/runtime-prompts
mkdir -p marketing-factory/system-knowledge/database-schemas
mkdir -p marketing-factory/system-knowledge/n8n-patterns
mkdir -p marketing-factory/system-knowledge/dashboard-patterns
mkdir -p marketing-factory/system-knowledge/website-patterns
mkdir -p marketing-factory/system-knowledge/integration-patterns
mkdir -p marketing-factory/system-knowledge/versioning
mkdir -p marketing-factory/system-knowledge/creative-profiling
mkdir -p marketing-factory/versions/v1.0.0
mkdir -p marketing-factory/clients
```

### 3. Create Agent Files

For each of the 23 agents, create an agent.md file in `/marketing-factory/.claude/agents/` with the following structure:

```markdown
---
name: [agent-name]
description: [clear one-line description of agent's purpose]
tools: [Read, Create, Bash, Task - as appropriate]
model: sonnet
---

# [Agent Name] Agent

**Context Documents:**
- Read: /droom/system-specs/[relevant-spec].md
- [additional specs as needed]

**Input:**
[What this agent receives as input]

**Process:**
[Step-by-step process the agent follows]

**Output:**
[What this agent produces]

**Special Instructions:**
[Any first-spawn responsibilities or unique behaviors]
```

**Agent Context Document References:**

**Intelligence Generators:**
- Brand Research: content-profiling-framework.md, pinecone-architecture.md, neo4j-architecture.md
- Competitive Intelligence: content-profiling-framework.md
- Strategist: pinecone-architecture.md, neo4j-architecture.md, agent-collaboration-patterns.md
- Creative Director: content-profiling-framework.md, agent-collaboration-patterns.md
- Publicist: agent-collaboration-patterns.md

**Marketing Intelligence Architects:**
- n8n Architect: n8n-system.md, pinecone-architecture.md, neo4j-architecture.md, database-interaction.md, integration-flows.md
- Database Schema: pinecone-architecture.md, neo4j-architecture.md, database-interaction.md
- Marketing Agent Prompt Engineer: agent-collaboration-patterns.md, n8n-system.md

**Dashboard Architects:**
- Dashboard Architect: dashboard-architecture.md, database-interaction.md, integration-flows.md
- Data Visualization: dashboard-architecture.md
- Dashboard UX: dashboard-architecture.md
- Dashboard API: dashboard-architecture.md, pinecone-architecture.md, neo4j-architecture.md, database-interaction.md, integration-flows.md

**Website Architects:**
- Website Strategist: website-service-business.md, website-ecommerce.md, integration-flows.md
- Website Designer: website-service-business.md, website-ecommerce.md
- Landing Page: website-service-business.md, website-ecommerce.md
- Form Conversion: website-service-business.md, integration-flows.md
- E-commerce: website-ecommerce.md, integration-flows.md
- Website Backend: website-service-business.md, website-ecommerce.md, integration-flows.md

**Cross-System:**
- Integration Orchestrator: integration-flows.md, database-interaction.md, agent-collaboration-patterns.md
- Documentation: agent-collaboration-patterns.md
- Version Control: version-management.md, database-interaction.md
- QA: agent-collaboration-patterns.md, version-management.md

### 4. Create Command Files

Create three command files in `/marketing-factory/.claude/commands/`:

**spawn-client.md:**
- Orchestrates all agents to create complete client system
- Handles first-spawn vs. subsequent-spawn logic
- References: agent-collaboration-patterns.md

**update-client.md:**
- Updates existing client to new factory version
- Handles migrations and compatibility
- References: version-management.md

**rollback-client.md:**
- Rolls back failed update
- Restores from backup
- References: version-management.md

### 5. Create README

Create `/marketing-factory/README.md` with:
- What this factory does
- How to spawn a client system
- Prerequisites (API keys, databases, etc.)
- Link back to `/droom/spec.md` for complete documentation

### 6. Create Version Tracking

Create `/marketing-factory/versions/v1.0.0/README.md` documenting:
- This is initial factory version
- What capabilities it has
- Date created
- Template structure (to be populated on first spawn)

### 7. Create Placeholder Files

Create these files to guide Layer 1 agents:

**`/marketing-factory/templates/README.md`:**
```markdown
# Templates Directory

This directory will be populated during the FIRST client spawn.

When the first client is created, Layer 1 agents will:
- Design n8n workflow templates
- Design dashboard templates (Next.js + FastAPI)
- Design website templates (Next.js + FastAPI)
- Design runtime agent prompt templates

These templates will contain {VARIABLES} that are populated per-client.

After first spawn, all subsequent client spawns will use these templates.
```

**`/marketing-factory/system-knowledge/README.md`:**
```markdown
# System Knowledge Directory

This directory will be populated during the FIRST client spawn.

When the first client is created, Layer 1 agents will:
- Initialize Pinecone namespaces for the client
- Initialize Neo4j graph schema
- Document database schemas and query patterns
- Document n8n workflow patterns
- Document dashboard architecture patterns
- Document website patterns
- Document integration patterns

This knowledge is then reused for all subsequent client spawns.
```

## Success Criteria

After running this command, verify:

- [ ] `/marketing-factory/` directory exists
- [ ] All 23 agent.md files present in `/marketing-factory/.claude/agents/`
- [ ] All 3 command.md files present in `/marketing-factory/.claude/commands/`
- [ ] All subdirectories created (templates/, system-knowledge/, versions/, clients/)
- [ ] README.md exists with clear usage instructions
- [ ] Placeholder README files in templates/ and system-knowledge/

## Output to User

After successful initialization, display:

```
✓ Factory Initialized Successfully

Structure created:
  ✓ 23 agent files in .claude/agents/
  ✓ 3 command files in .claude/commands/
  ✓ Directory structure complete
  ✓ README.md created

The factory is ready to spawn client systems.

Next Steps:

1. Review the factory structure:
   - Read: /marketing-factory/README.md

2. Understand the system:
   - Read: /droom/spec.md (complete specification)
   - Browse: /droom/system-specs/ (implementation details)

3. Spawn your first client:
   cd marketing-factory/
   claude
   > /spawn-client url=https://clientwebsite.com name=client-name

IMPORTANT: The first spawn will take longer (60-90 min) because it will:
- Design database schemas (Pinecone + Neo4j)
- Initialize database structures
- Create all templates (n8n workflows, dashboard, website)
- Document patterns for reuse

Subsequent spawns will be faster (30-40 min) using existing templates.

Prerequisites before first spawn:
- Pinecone account (free tier: 100k vectors)
- Neo4j AuraDB account (free tier available)
- Claude API key
- Google Ads API credentials (can set up during spawn)
- Meta Marketing API credentials (can set up during spawn)
- OpenAI API key (for embeddings)
- Google Drive API credentials (for content storage)

See /marketing-factory/README.md for detailed setup instructions.
```

## Notes

- This command is idempotent - can be run multiple times safely
- If `/marketing-factory/` already exists, confirm before overwriting
- All agent.md files should be concise and delegate details to system-specs/
- Templates and schemas are intentionally NOT created here - Layer 1 handles on first spawn
- Agents reference system-specs/ in /droom/ for implementation guidance


also you do not have to follow the specs EXACTLY as they are. the purpose of the spec docs is that much of the arhcitecture is already thought out for you. But you're more than welcome to make adjustments as you are building if you think things can be improved/streamlined.


let me know any environment variables you need me to populate, where to place them, what to name them, etc.