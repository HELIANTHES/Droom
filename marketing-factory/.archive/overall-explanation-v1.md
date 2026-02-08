# Marketing Factory System Overview

## What This Is

A **marketing automation factory** powered by AI agents. You (Claude) operate from within `/droom/marketing-factory/` to build complete, customized marketing systems for clients. Each client gets their own autonomous marketing operation: content analysis, campaign optimization, lead management, and performance tracking - all running automatically.

## How It Works

**You are the factory.** When a user runs `/spawn-client`, you:
1. Research the client's brand and competitive landscape
2. Develop marketing strategy and creative direction
3. Build their complete tech stack: databases, workflows, dashboard, website
4. Deploy a system that runs itself using AI agents for ongoing decisions

**The factory contains:**
- **Agents** (23 builder agents + 6 runtime agents) - Each agent is a specialist that handles one domain
- **System specs** - Architectural blueprints for what to build
- **Commands** - User commands like `/spawn-client`

**The output:**
- Complete client system in `/droom/clients/{brand-name}/`
- n8n workflows that run daily (fetch performance, optimize budgets, rotate content)
- Neo4j + Pinecone databases storing all marketing intelligence
- Dashboard for client to monitor performance
- Website that captures leads and attributes conversions

## Architecture Philosophy

**Agent-driven, not script-driven.** Agents are given:
- A role and goal
- Context about what's already been built
- Constraints and success criteria

They figure out HOW to accomplish their goal. We don't prescribe exact implementations.

**Example:** The Dashboard Architect agent knows it needs to "create a 3-level progressive disclosure dashboard." It reads the system spec to understand requirements, then builds it however makes sense - file structure, component organization, implementation details are its decisions.

## Current State

We've defined:
- **12 system spec files** (architecture patterns, data schemas, integration flows)
- **~14 agent files** (brand research, strategy, creative, database setup, n8n workflows, dashboard, website, etc.)

**What's left:**
- Finish remaining ~9 builder agents
- Define the 6 runtime agent prompts (these live in client systems and make daily decisions)
- Create command definitions (`/spawn-client`, etc.)
- Test end-to-end factory execution

## How You Execute

When user runs `/spawn-client url=https://example.com name=brand-name`:
1. You invoke agents sequentially (respecting dependencies)
2. Each agent reads relevant context, creates its outputs
3. Agents pass artifacts to downstream agents
4. You validate completeness at the end
5. User gets a fully functional marketing system

## Key Principles We're Following

**Lean agent definitions:** Agents know their job, not every implementation detail. ~50-150 lines each.

**System specs as reference:** Detailed patterns live in `/system-specs/`, agents reference them as needed.

**Smart delegation:** You (orchestrator) understand the big picture and provide relevant context to each agent. Agents don't redundantly re-read everything.

**Flexible execution:** Agents make intelligent decisions about implementation rather than following rigid templates.

## What Makes This Different

Traditional marketing automation = rigid playbooks, manual optimization, disconnected tools.

This factory = adaptive AI agents that learn from performance data, make strategic decisions autonomously, and continuously optimize based on what's working. Each client gets a custom system tailored to their brand, audience, and goals.

The client uploads content, and the system handles everything else: analyzing it, choosing where/when to run it, optimizing budgets, scoring leads, attributing revenue, and reporting insights in plain language.

---

**We're building the factory that builds the machines.**