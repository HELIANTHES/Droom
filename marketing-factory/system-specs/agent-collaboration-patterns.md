# Agent Collaboration Patterns

## Overview

The marketing automation system uses 29 specialized agents working together:
- **23 Layer 1 agents** (in marketing-factory/.claude/agents/) - Build client systems
- **6 Runtime agents** (in n8n workflows) - Execute marketing operations

This document defines how agents collaborate, communicate, hand off work, and make decisions together.

**Key Principle:** Each agent is a specialist with clear boundaries. Agents collaborate through structured handoffs, not by doing each other's jobs.

---

## Layer 1 Agent Collaboration (Factory Building)

### Collaboration Model: Sequential Pipeline with Orchestration

**Pattern:** Orchestrator coordinates, agents execute in sequence, each agent receives output from previous agents as input.

```
User: /spawn-client url=https://zenmedclinic.com name=zen-med-clinic
  ↓
Orchestrator reads command
  ↓
Orchestrator spawns agents in sequence:
  ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Research (Parallel)                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Brand Research Agent          Competitive Intelligence     │
│         ↓                              ↓                     │
│  brand-profile.md          competitive-landscape.md         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
  ↓
  Wait for both to complete
  ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Strategy (Sequential)                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Strategist Agent                                           │
│  Input: brand-profile.md + competitive-landscape.md         │
│  Output: brand-config.json + strategy docs                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Creative (Sequential)                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Creative Director Agent                                    │
│  Input: brand-config.json + brand-profile.md               │
│  Output: /creative/briefs/ + ad-copy-variations.json       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
  ↓
[Continue through all phases...]
```

---

## Orchestrator Agent: The Coordinator

**Role:** Sequence agent execution, manage dependencies, handle errors

**Responsibilities:**
1. Parse user command
2. Determine execution order based on dependencies
3. Invoke agents sequentially
4. Pass outputs from previous agents as inputs to next agents
5. Handle errors and retry logic
6. Report progress to user
7. Validate final output

### Decision Framework

**Question: Which agent should run next?**

```python
def determine_next_agent(completed_agents, available_agents):
    """
    Determine which agent can run next based on dependencies
    """
    for agent in available_agents:
        dependencies = get_agent_dependencies(agent)
        
        # Can this agent run? (all dependencies met)
        if all(dep in completed_agents for dep in dependencies):
            return agent
    
    return None  # All agents complete or blocked

# Example dependencies:
AGENT_DEPENDENCIES = {
    "brand-research": [],  # No dependencies
    "competitive-intelligence": [],  # No dependencies
    "strategist": ["brand-research", "competitive-intelligence"],
    "creative-director": ["strategist"],
    "n8n-architect": ["strategist", "database-schema"],
    "dashboard-architect": ["strategist", "database-schema"],
    # etc.
}
```

---

## Agent Communication Protocols

### Protocol 1: File-Based Handoffs

**Pattern:** Agent A writes file → Agent B reads file

**Example:**
```
Brand Research Agent writes:
  /clients/zen-med-clinic/research/brand-profile.md

Strategist Agent reads:
  /clients/zen-med-clinic/research/brand-profile.md
  /clients/zen-med-clinic/research/competitive-landscape.md
  
Strategist Agent writes:
  /clients/zen-med-clinic/brand-config.json
  
n8n Architect Agent reads:
  /clients/zen-med-clinic/brand-config.json
```

**Why this works:**
- Clear, auditable handoffs
- Human-readable intermediate outputs
- Easy to debug (inspect files)
- Agents can work independently

---

### Protocol 2: Structured Data in JSON

**Pattern:** Agent A writes structured JSON → Agent B parses JSON

**Example: brand-config.json**
```json
{
  "brand_name": "Zen Med Clinic",
  "brand_id": "zen-med-clinic",
  "industry": "chinese-medicine",
  "business_model": "brick-and-mortar-primary",
  "demographics": {
    "primary": {
      "name": "wellness-focused-women-35-50",
      "age_range": [35, 50],
      "psychographics": "Professional women seeking stress relief..."
    }
  },
  "platforms": ["instagram", "facebook", "google-search"],
  "budget": {
    "monthly_total": 5000,
    "platform_allocation": {
      "instagram": 0.45,
      "facebook": 0.35,
      "google-search": 0.20
    }
  }
}
```

**All downstream agents read this config:**
- n8n Architect: Uses platforms, brand_id, demographics
- Dashboard Architect: Uses brand_name, brand_colors, budget
- Website Architect: Uses contact info, services, business_model
- Marketing Agent Prompt Engineer: Uses demographics, campaign_goals

---

### Protocol 3: Markdown Documentation

**Pattern:** Agent A writes narrative markdown → Agent B/Human reads

**Example: brand-profile.md**
```markdown
# Zen Med Clinic - Brand Profile

## Overview
Zen Med Clinic is a Chinese medicine and acupuncture practice in Palo Alto...

## Brand Voice
- Professional yet warm
- Educational without being preachy
- Calm and reassuring
...

## Target Audience
Primary: Professional women 35-50 seeking stress relief and holistic wellness
...
```

**Why markdown:**
- Human-readable (client can review)
- Narrative captures nuance JSON can't
- Easy to parse for AI agents
- Good for documentation

---

## Agent Decision Boundaries

### Principle: Clear Authority Domains

**Each agent has decision authority in their domain. No agent overrules another agent's decisions.**

**Example Boundaries:**

**Strategist Agent decides:**
- Which demographics to target
- Budget allocation by platform
- Campaign goals and objectives
- Geographic targeting strategy

**Creative Director Agent decides:**
- Which content concepts to develop
- Tone and aesthetic guidelines
- How many pieces of content needed
- Ad copy variations

**n8n Architect Agent decides:**
- Workflow structure and node sequence
- Error handling approach
- Webhook URLs and triggers
- API integration patterns

**Dashboard Architect Agent decides:**
- Information architecture (Level 1/2/3)
- Chart types and visualizations
- Navigation structure
- API endpoint design

**Strategist does NOT decide:**
- How workflows should be structured (n8n Architect's domain)
- What charts to use (Dashboard Architect's domain)
- Specific ad copy (Creative Director's domain)

---

## Collaboration Pattern 1: Sequential Handoff

**When to use:** Agent B needs Agent A's complete output before starting

**Example: Research → Strategy**

```markdown
# In Orchestrator execution:

1. Invoke Brand Research Agent
   Input: {url: "https://zenmedclinic.com"}
   Wait for completion
   Output: brand-profile.md
   
2. Invoke Competitive Intelligence Agent
   Input: {brand_name: "Zen Med Clinic", location: "Palo Alto"}
   Wait for completion
   Output: competitive-landscape.md
   
3. Wait for BOTH to complete
   
4. Invoke Strategist Agent
   Input: {
     brand_profile_path: "/clients/zen-med-clinic/research/brand-profile.md",
     competitive_landscape_path: "/clients/zen-med-clinic/research/competitive-landscape.md"
   }
   Wait for completion
   Output: brand-config.json + strategy docs
```

**Agent Perspective (Strategist):**
```markdown
---
name: strategist
---

**Input:**
- /clients/{brand-name}/research/brand-profile.md
- /clients/{brand-name}/research/competitive-landscape.md

**Process:**
1. Read both input files thoroughly
2. Synthesize insights from research
3. Determine demographics (2-3 primary targets)
4. Select platforms (2-4 optimal channels)
5. Allocate budget strategically
6. Define campaign goals
7. Output brand-config.json
8. Output strategy documentation

**Output:**
- /clients/{brand-name}/brand-config.json (master config)
- /clients/{brand-name}/strategy/campaign-plan.md
- /clients/{brand-name}/strategy/platform-selection.md
- /clients/{brand-name}/strategy/budget-allocation.md
```

---

## Collaboration Pattern 2: Parallel Execution

**When to use:** Multiple agents can work simultaneously (no dependencies between them)

**Example: Research Phase**

```markdown
# In Orchestrator execution:

# Launch both agents in parallel
parallel_tasks = [
    invoke_agent("brand-research", {...}),
    invoke_agent("competitive-intelligence", {...})
]

# Wait for all to complete
results = await Promise.all(parallel_tasks)

# Continue to next phase
invoke_agent("strategist", {...})
```

**Why parallel:**
- Faster execution (5 min + 5 min = 5 min, not 10 min)
- No dependencies between these agents
- Independent data sources (website vs. Google search)

---

## Collaboration Pattern 3: Coordinated Team

**When to use:** Multiple agents need to work together with one coordinator

**Example: Dashboard Team**

```markdown
# Dashboard Architect coordinates 3 sub-agents

Dashboard Architect:
  ↓
  Reads: brand-config.json, strategy docs
  ↓
  Creates: Overall architecture plan
  ↓
  Invokes sub-agents:
    ├─→ Data Visualization Agent
    │   Task: Design charts for each metric
    │   Output: Chart specifications
    │
    ├─→ Dashboard UX Agent  
    │   Task: Information architecture
    │   Output: Navigation structure, page layouts
    │
    └─→ Dashboard API Agent
        Task: Backend endpoint design
        Output: API specification
  ↓
  Waits for all sub-agents
  ↓
  Synthesizes outputs into complete dashboard codebase
  ↓
  Output: /clients/{brand-name}/dashboard/ (complete)
```

**Dashboard Architect perspective:**
```markdown
---
name: dashboard-architect
---

**Role:** Coordinate dashboard creation, synthesize sub-agent outputs

**Process:**
1. Read brand-config.json for brand info
2. Determine dashboard requirements based on business model
3. Create overall architecture plan
4. Invoke sub-agents:
   - Data Visualization: "Design charts for these metrics: [...]"
   - Dashboard UX: "Create information architecture for these user needs: [...]"
   - Dashboard API: "Design endpoints for these data requirements: [...]"
5. Wait for all sub-agents to complete
6. Read all sub-agent outputs
7. Synthesize into complete dashboard codebase
8. Populate config.json with brand-specific values
9. Create README.md with deployment instructions

**Output:**
- Complete /dashboard/ directory with frontend + backend
```

---

## Collaboration Pattern 4: Validation Chain

**When to use:** Agent B validates/reviews Agent A's output

**Example: QA Agent validates all outputs**

```markdown
# After all creation agents complete

Orchestrator invokes QA Agent:
  Input: {client_directory: "/clients/zen-med-clinic"}
  
QA Agent:
  ↓
  Runs 50-point checklist:
    ├─ File existence checks
    ├─ JSON validity checks  
    ├─ Variable substitution verification
    ├─ Strategy coherence review
    ├─ Template completeness check
    └─ Client deliverables quality review
  ↓
  If issues found:
    ├─ Report to Orchestrator
    ├─ Orchestrator re-invokes relevant agent to fix
    └─ QA Agent re-validates
  ↓
  If all checks pass:
    └─ Report success to Orchestrator
```

**QA Agent does NOT fix issues itself.** It identifies issues and reports back to Orchestrator, which re-invokes the appropriate specialist agent.

---

## Runtime Agent Collaboration (n8n Workflows)

### Collaboration Model: API-Based Sequential Calls

**Pattern:** Workflow calls Agent 1 → Agent 1 returns → Workflow calls Agent 2 with Agent 1's output

```
n8n: Daily Performance Workflow
  ↓
Node: Fetch performance data from ad platforms
  ↓
Node: Store in Neo4j
  ↓
Node: Query similar scenarios (Pinecone)
  ↓
Node: Call CSO Agent (Claude API)
  Input: {
    current_performance: {...},
    similar_scenarios: {...},
    brand_config: {...}
  }
  Output: {
    decisions: [{type: "budget_shift", action: "...", confidence: 0.87}],
    alerts: [...]
  }
  ↓
Node: If decision.type === "creative_rotation"
  ↓
Node: Call Creative Intelligence Agent (Claude API)
  Input: {
    decision: {...},
    active_content: {...}
  }
  Output: {
    fatigued_content: ["video-003"],
    replacement_content: ["video-007"],
    rotation_plan: {...}
  }
  ↓
Node: Execute rotation via Media Buyer Agent
  ↓
Continue...
```

---

## Runtime Agent Interaction Patterns

### Pattern 1: Decision → Execution

**Flow:** Strategic agent makes decision → Tactical agent executes

**Example:**
```
CSO Agent (strategic):
  "Shift $50/day from Facebook to Instagram"
  Reasoning: "Instagram ROAS 2x Facebook based on last 7 days"
  Confidence: 0.87
  ↓
Media Buyer Agent (tactical):
  - Update Facebook campaign budget: $85 → $35
  - Update Instagram campaign budget: $100 → $150
  - Verify changes applied successfully
  - Log execution in Neo4j
```

**Why separation:**
- CSO focuses on "what" and "why"
- Media Buyer focuses on "how"
- CSO doesn't need to know API details
- Media Buyer doesn't need to make strategic judgments

---

### Pattern 2: Analysis → Insight

**Flow:** Data agent analyzes → Cultural agent explains

**Example:**
```
Data Scientist Agent (quantitative):
  "Detected pattern: Evening time slot CTR 2.8x higher than morning"
  Statistical significance: p < 0.01
  Sample size: 45 campaigns
  ↓
Cultural Anthropologist Agent (qualitative):
  "This pattern indicates stress-relief seeking behavior.
   Your wellness-focused audience finishes work, feels tension,
   seeks immediate relief. Evening ads catch them in this mindset.
   Morning ads catch them pre-work (wrong mental state)."
  Recommendation: "Schedule 70% of budget for 6-9pm window"
```

**Why separation:**
- Data Scientist finds "what" (patterns in numbers)
- Cultural Anthropologist explains "why" (human behavior)
- Combined output = actionable insight

---

### Pattern 3: Request → Fulfillment

**Flow:** Creative agent identifies need → CSO approves → Media Buyer executes

**Example:**
```
Creative Intelligence Agent:
  "Content portfolio over-concentrated in 'calm' tone (85%).
   Need 'energetic' content for younger demographic expansion.
   Recommend commissioning 3 new videos."
  ↓
CSO Agent:
  Reviews recommendation
  Checks budget availability
  Validates strategic alignment
  Decision: "Approved. Allocate $2,000 for content creation."
  ↓
n8n Workflow:
  - Creates request in /content-requests/
  - Notifies client via dashboard
  - Provides creative briefs (from Creative Director)
```

---

## Agent Authority Matrix

| Decision Type | Primary Authority | Review Authority | Execution Authority |
|---------------|-------------------|------------------|---------------------|
| Budget allocation | CSO | Data Scientist | Media Buyer |
| Content rotation | Creative Intelligence | CSO | Media Buyer |
| Platform selection | Strategist | CSO | Media Buyer |
| Creative direction | Creative Director | None | Client (creates content) |
| Lead scoring | Lead Scoring Agent | None | n8n (routes lead) |
| Demographic targeting | Strategist | Cultural Anthropologist | Media Buyer |
| Campaign pause/scale | CSO | Data Scientist | Media Buyer |
| New content request | Creative Intelligence | CSO | n8n (notifies client) |

**Key:**
- **Primary Authority:** Makes the decision
- **Review Authority:** Validates the decision (optional)
- **Execution Authority:** Implements the decision

---

## Conflict Resolution

### Scenario 1: Agents Disagree on Strategy

**Example:**
- CSO Agent: "Shift budget from Facebook to Instagram"
- Data Scientist Agent: "Insufficient sample size, recommend wait 7 more days"

**Resolution Protocol:**
1. **Confidence scores decide:** CSO confidence 0.87 vs Data Scientist confidence 0.92 → Data Scientist wins
2. **If confidence similar:** CSO has final authority (strategic decisions)
3. **Log disagreement:** Store in Neo4j for learning

```cypher
CREATE (d:Disagreement {
  decision_id: "budget_shift_20260203",
  cso_recommendation: "shift",
  cso_confidence: 0.87,
  data_scientist_recommendation: "wait",
  data_scientist_confidence: 0.92,
  resolution: "wait",
  resolved_by: "confidence_score",
  timestamp: datetime()
})
```

---

### Scenario 2: Agent Output Quality Issues

**Example:**
- Creative Director creates briefs that are too vague
- n8n Architect can't build workflows from unclear strategy

**Resolution Protocol:**
1. **QA Agent catches issue:** "Creative briefs lack specific direction"
2. **Orchestrator re-invokes Creative Director:** With additional context/examples
3. **Maximum 2 retries:** After 2 attempts, escalate to human review
4. **Learn from failure:** Update agent prompt to prevent recurrence

---

## Agent Prompt Design Principles

### Principle 1: Context, Not Instructions

**Bad prompt:**
```markdown
You are the Strategist Agent. Create a strategy for the client.
```

**Good prompt:**
```markdown
You are the Strategist Agent for a marketing automation system.

Your role is to synthesize research into actionable strategy.

You have access to:
- Brand research from Brand Research Agent
- Competitive landscape from Competitive Intelligence Agent
- System specs in /droom/system-specs/

Your output will be used by:
- n8n Architect (needs demographics, platforms, budget)
- Creative Director (needs brand voice, target audience)
- Dashboard Architect (needs campaign goals, KPIs)

Context Documents:
- Read: /droom/system-specs/database-design.md
- Read: /droom/system-specs/agent-collaboration-patterns.md

[Rest of specific instructions...]
```

**Why better:** Agent understands its place in the system, who depends on its output.

---

### Principle 2: Explicit Handoffs

**Include in agent prompt:**
```markdown
**Input Files:**
- /clients/{brand-name}/research/brand-profile.md (from Brand Research Agent)
- /clients/{brand-name}/research/competitive-landscape.md (from Competitive Intelligence)

**Output Files:**
- /clients/{brand-name}/brand-config.json (master config, used by ALL downstream agents)
- /clients/{brand-name}/strategy/campaign-plan.md
- /clients/{brand-name}/strategy/platform-selection.md

**Who Uses Your Output:**
- n8n Architect: brand-config.json → populates workflow templates
- Creative Director: brand-config.json → informs content briefs
- Dashboard Architect: brand-config.json → configures dashboard
```

---

### Principle 3: Decision Frameworks

**Give agents structured decision-making frameworks:**

```markdown
**Decision Framework: Platform Selection**

For each potential platform, evaluate:
1. Audience fit (does target demographic use this platform?)
2. Content format compatibility (do our content types work here?)
3. Cost efficiency (typical CPM for our industry)
4. Competition level (how saturated is this platform in our niche?)

Score each platform 0-10 on each criterion.
Select top 3-4 platforms.
Allocate budget proportionally to scores.

Example:
Instagram: 
  - Audience fit: 9/10 (women 35-50 heavily use Instagram)
  - Format: 10/10 (vertical video performs excellently)
  - Cost: 7/10 (moderate CPM)
  - Competition: 6/10 (many wellness brands)
  Total: 32/40 → 40% budget

Document reasoning in platform-selection.md
```

---

## Testing Agent Collaboration

### Test Scenario 1: Complete Spawn

**Test:** End-to-end client spawn from command to completion

**Success Criteria:**
- All 23 agents execute in correct order
- No agent blocks waiting for missing dependencies
- All handoffs successful (files created and readable)
- Final output passes QA validation
- Total execution time < 70 minutes

---

### Test Scenario 2: Agent Failure Recovery

**Test:** Simulate agent failure mid-spawn

**Inject Failure:** Creative Director fails after Strategist completes

**Expected Behavior:**
1. Orchestrator detects failure
2. Orchestrator retries Creative Director (max 2 retries)
3. If retries fail, Orchestrator reports error to user
4. Orchestrator saves partial progress
5. User can resume from last successful checkpoint

---

### Test Scenario 3: Parallel Execution

**Test:** Verify parallel agents don't interfere

**Scenario:** Brand Research + Competitive Intelligence run simultaneously

**Success Criteria:**
- Both agents complete successfully
- Neither agent overwrites the other's files
- Both outputs are correct and independent
- Total time ≈ max(agent1_time, agent2_time), not sum

---

## Observability & Debugging

### Agent Execution Logging

**Log every agent invocation:**
```json
{
  "timestamp": "2026-02-03T10:30:00Z",
  "agent": "strategist",
  "event": "invoked",
  "input": {
    "brand_profile_path": "/clients/zen-med-clinic/research/brand-profile.md",
    "competitive_landscape_path": "/clients/zen-med-clinic/research/competitive-landscape.md"
  },
  "invoked_by": "orchestrator"
}
```

**Log agent completion:**
```json
{
  "timestamp": "2026-02-03T10:35:00Z",
  "agent": "strategist",
  "event": "completed",
  "duration_seconds": 300,
  "output": {
    "brand_config_path": "/clients/zen-med-clinic/brand-config.json",
    "files_created": 4
  },
  "status": "success"
}
```

**Log agent failure:**
```json
{
  "timestamp": "2026-02-03T10:33:00Z",
  "agent": "creative-director",
  "event": "failed",
  "error": "Could not read brand-config.json",
  "retry_count": 1,
  "will_retry": true
}
```

---

### Collaboration Visualization

**Tool: Generate execution graph**

```
Brand Research ─────┐
                     ├─→ Strategist ─→ Creative Director ─→ Publicist
Competitive Intel ───┘                      │
                                            │
Database Schema ─────────────┬─────────────┘
                              │
                              ├─→ n8n Architect ──────┐
                              │                        │
                              ├─→ Marketing Prompts ───┤
                              │                        ├─→ Integration Orch
                              ├─→ Dashboard Architect ─┤
                              │                        │
                              └─→ Website Architect ───┘
                                           │
                                           ↓
                                      QA Agent
                                           │
                                           ↓
                                    Documentation
```

---

## Best Practices Summary

### Do:
✅ Give each agent clear, narrow responsibilities
✅ Use structured handoffs (files, JSON)
✅ Make dependencies explicit
✅ Include decision frameworks in prompts
✅ Log all agent interactions
✅ Test collaboration flows end-to-end
✅ Implement retry logic for transient failures
✅ Use confidence scores for conflict resolution

### Don't:
❌ Let agents do each other's jobs
❌ Create circular dependencies
❌ Use implicit handoffs (shared state without files)
❌ Make agents too general-purpose
❌ Skip validation between agents
❌ Ignore agent disagreements
❌ Proceed if dependencies missing
❌ Let one agent failure block unrelated agents

---

## Future Enhancements

### Multi-Agent Consensus

**Concept:** For critical decisions, get consensus from multiple agents

**Example:**
```
Decision: Should we pause underperforming campaign?

Poll agents:
- CSO: Yes (confidence 0.82)
- Data Scientist: Yes (confidence 0.91)
- Creative Intelligence: No (confidence 0.65) - "Content may not be fatigued yet"

Consensus: Yes (2/3 agree, average confidence 0.79)
Action: Pause campaign
Note: Creative Intelligence dissent logged for learning
```

---

### Agent Performance Metrics

**Track agent quality over time:**

```python
agent_metrics = {
    "strategist": {
        "invocations": 127,
        "success_rate": 0.98,
        "avg_duration_seconds": 285,
        "retry_rate": 0.03,
        "output_quality_score": 4.7/5.0  # From QA Agent ratings
    },
    "creative-director": {
        "invocations": 127,
        "success_rate": 0.94,
        "avg_duration_seconds": 320,
        "retry_rate": 0.08,
        "output_quality_score": 4.2/5.0
    }
}
```

**Use metrics to:**
- Identify agents that need prompt improvements
- Detect performance degradation
- Prioritize agent upgrades
- Optimize execution order
