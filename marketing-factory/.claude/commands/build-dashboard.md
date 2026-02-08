---
name: build-dashboard
description: Builds complete analytics dashboard application (Next.js frontend + FastAPI backend) for a client
---

<purpose>
# Build Dashboard

Creates the complete analytics dashboard application — a Next.js/TypeScript frontend and FastAPI Python backend implementing 3-level progressive disclosure. The dashboard gives clients real-time visibility into campaign performance, content analytics, and AI-generated insights.
</purpose>

<input>
**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug matching the client directory name

Parse $ARGUMENTS to extract `name`. If missing, stop and ask.
</input>

<prerequisites>
**Required files (stop if missing, instruct user to run `/initialize-client` first):**
- `clients/{name}/brand-config.json` — Brand identity, colors, business model
- `clients/{name}/strategy/campaign-plan.md` — KPIs and goals
- `clients/{name}/creative/creative-strategy.md` — Creative context
- `clients/{name}/database/schema-docs.md` — Database structure

**Recommended (warn if missing):**
- `clients/{name}/automation/` — Dashboard receives webhooks from n8n workflows

**Read system context:**
- `SYSTEM.md` for architecture
- `system-specs/dashboard-architecture.md` for progressive disclosure design
- `system-specs/database-design.md` for query patterns
- `system-specs/integration-patterns.md` for webhook endpoints
- `.build-context.md` for upstream decisions
</prerequisites>

<orchestration>
## Process

### Step 1: Determine Features
**Agent:** dashboard-architect → **Spec:** system-specs/dashboard-architecture.md

Read brand-config.json and determine features by business_model:

| Feature | brick-and-mortar | service-online | ecommerce | hybrid |
|---|:---:|:---:|:---:|:---:|
| Executive Summary | x | x | x | x |
| Campaign Performance | x | x | x | x |
| Content Library | x | x | x | x |
| Audience Breakdown | x | x | x | x |
| Geographic Heatmap | x | | | x |
| Lead Journey | x | x | | x |
| Purchase Attribution | | | x | x |
| Product Performance | | | x | x |
| Detailed Metrics (L3) | x | x | x | x |

Extract brand_colors for theming, campaign_goals for KPI targets, demographics for audience views, platforms for comparison charts.

### Step 2: Generate Backend (FastAPI)
Create `clients/{name}/dashboard/backend/` — complete FastAPI application:
- Router-based API: performance, content, campaigns, audiences, insights, leads, webhooks (+ geography, purchases if applicable)
- Service clients: Neo4j (structured queries), Pinecone (semantic queries), n8n (narrative retrieval)
- Webhook receivers for n8n notifications
- Caching, health check, CORS configuration
- All database queries filter by brand_id
- Pydantic response models, requirements.txt, .env.example

### Step 3: Generate Frontend (Next.js + TypeScript + Tailwind)
Create `clients/{name}/dashboard/frontend/` — complete Next.js application:
- **Level 1** (`/`): Executive dashboard — AI narrative, 4 KPI cards, trend sparkline, top 3 insights
- **Level 2**: Category views — campaigns, content library, audiences, geography (conditional), insights, leads (conditional)
- **Level 3**: `/content/[id]` detail view, `/detailed-metrics` with filters and CSV export
- Utility: content upload interface, settings
- Brand-themed with client colors via CSS custom properties
- Responsive, loading states, error boundaries
- Lightweight charting (custom SVG sparklines + Recharts for complex charts)

### Step 4: Create Configuration
- `dashboard/config.json` — Feature flags based on business model, brand colors, KPI targets
- Backend `.env.example` and frontend `.env.local.example`

### Step 5: Create Documentation
- `dashboard/README.md` — Architecture, setup, development commands, deployment guide
- `dashboard/DEPLOYMENT.md` — Production deployment (Vercel frontend, Python host backend)

### Step 6: Initialize (Optional)
Ask user if they want to install dependencies (backend: pip install, frontend: npm install).
</orchestration>

<context_flow>
- Read `.build-context.md` for database schema details and n8n webhook endpoints
- Append dashboard decisions to `.build-context.md` (feature flags, API structure, deviations from spec)
- Update `.manifest.md` with dashboard system state
- Coordinate with n8n Architect: webhook endpoints must match what workflows POST to
- Coordinate with Website Architect: visual consistency (brand colors, component patterns)
</context_flow>

<error_handling>
- If required files missing, instruct user to run `/initialize-client` first
- If automation not built, warn that AI narrative data won't be available — dashboard will show placeholders
- Backend must start without errors (`uvicorn main:app`)
- Frontend must start without errors (`npm run dev`)
- No stub files or placeholder components — complete implementation
</error_handling>

<completion>
Display: backend summary (routers, services, models), frontend summary (page routes, components), features enabled by business model, configuration files, local run commands, and next steps (configure .env, run locally, build website).
</completion>
