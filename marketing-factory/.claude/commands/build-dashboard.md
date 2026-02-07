---
name: build-dashboard
description: Builds complete analytics dashboard application (Next.js frontend + FastAPI backend) for a client
---

# Build Dashboard Command

Creates the complete analytics dashboard application with a Next.js/TypeScript frontend and FastAPI Python backend, implementing the 3-level progressive disclosure information architecture.

## Input

**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug matching the client directory name

**Parse $ARGUMENTS to extract the `name` value.**

If `name` is missing, stop and ask the user for it.

## Validation

Before proceeding, verify:

**Required files:**
- `clients/{name}/brand-config.json` — Brand identity, colors, business model
- `clients/{name}/strategy/campaign-plan.md` — KPIs and goals
- `clients/{name}/creative/creative-strategy.md` — Creative context
- `clients/{name}/system-knowledge/database-schema.md` — Database structure

**Recommended (warn if missing but continue):**
- `clients/{name}/automation/prompts/` — Runtime prompts (dashboard queries n8n for AI narratives)
- `clients/{name}/n8n/workflows/` — n8n workflows (dashboard receives webhook data)

If required files are missing, instruct the user to run `/initialize-client name={name}` first.
If automation is missing, warn that the dashboard won't have AI narrative data until `/build-automation` is run.

## Process

Set the base paths:
```
FACTORY_ROOT = /Users/jaronarmiger/HELIANTHES/OEUVRE/Droom/marketing-factory
CLIENT_DIR = {FACTORY_ROOT}/clients/{name}
SPECS_DIR = /Users/jaronarmiger/HELIANTHES/OEUVRE/Droom/system-specs
AGENTS_DIR = {FACTORY_ROOT}/.claude/agents
```

---

### Step 1: Read Configuration & Determine Features

**Read the agent definition:** `{AGENTS_DIR}/dashboard-architect.md`

**Read the relevant system specs:**
- `{SPECS_DIR}/dashboard-architecture.md` — 3-level progressive disclosure design
- `{SPECS_DIR}/dashboard-ux.md` — UX patterns and information design
- `{SPECS_DIR}/dashboard-api.md` — FastAPI backend design
- `{SPECS_DIR}/database-interaction.md` — How to query Neo4j and Pinecone

**Read input files:**
- `{CLIENT_DIR}/brand-config.json`
- `{CLIENT_DIR}/strategy/campaign-plan.md`
- `{CLIENT_DIR}/system-knowledge/database-schema.md`

**Extract from brand-config.json:**
- `brand_id`, `brand_name`, `industry`
- `business_model` — Determines which features to include
- `brand_colors` — For theming the dashboard
- `demographics` — For audience views
- `platforms` — For platform comparison charts
- `campaign_goals` — For KPI targets
- `geographic_strategy` — For geo heatmap (if applicable)

**Feature matrix by business model:**

| Feature                  | brick-and-mortar | service-online | ecommerce | hybrid |
|--------------------------|:---:|:---:|:---:|:---:|
| Executive Summary        |  x  |  x  |  x  |  x  |
| Campaign Performance     |  x  |  x  |  x  |  x  |
| Content Library          |  x  |  x  |  x  |  x  |
| Audience Breakdown       |  x  |  x  |  x  |  x  |
| Geographic Heatmap       |  x  |     |     |  x  |
| Lead Journey             |  x  |  x  |     |  x  |
| Purchase Attribution     |     |     |  x  |  x  |
| Product Performance      |     |     |  x  |  x  |
| Detailed Metrics (L3)    |  x  |  x  |  x  |  x  |
| Content Upload           |  x  |  x  |  x  |  x  |

---

### Step 2: Generate Backend (FastAPI)

**Execute as the Dashboard Architect Agent (backend focus).**

Create the complete FastAPI application at `{CLIENT_DIR}/dashboard/backend/`.

#### Directory Structure:
```
backend/
├── main.py                     # FastAPI app, CORS, lifespan, router includes
├── config.py                   # Settings from env vars + brand config
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variable template
├── services/
│   ├── __init__.py
│   ├── neo4j_client.py         # Neo4j async driver, connection pool, query methods
│   ├── pinecone_client.py      # Pinecone client, similarity search methods
│   └── n8n_client.py           # Fetch AI narratives and workflow status from n8n
├── routers/
│   ├── __init__.py
│   ├── performance.py          # GET /performance/summary, /performance/daily, /performance/trends
│   ├── content.py              # GET /content/library, /content/{id}, POST /content/upload
│   ├── campaigns.py            # GET /campaigns, /campaigns/{id}, /campaigns/comparison
│   ├── audiences.py            # GET /audiences/breakdown, /audiences/{demographic}
│   ├── geography.py            # GET /geography/heatmap, /geography/performance (if applicable)
│   ├── insights.py             # GET /insights/latest, /insights/weekly, /insights/ai-narrative
│   ├── leads.py                # GET /leads, /leads/{id}, /leads/funnel (if applicable)
│   ├── purchases.py            # GET /purchases, /purchases/attribution (if ecommerce)
│   └── webhooks.py             # POST /webhooks/performance, /webhooks/lead, /webhooks/insight
├── models/
│   ├── __init__.py
│   ├── performance.py          # Pydantic response models for performance data
│   ├── content.py              # Content models
│   ├── campaign.py             # Campaign models
│   ├── audience.py             # Audience/demographic models
│   ├── insight.py              # AI insight models
│   └── lead.py                 # Lead models
└── utils/
    ├── __init__.py
    ├── cache.py                # In-memory caching (or Redis if available)
    └── helpers.py              # Date calculations, metric formatting
```

#### Key Implementation Details:

**main.py:**
- FastAPI app with CORS middleware (allow dashboard frontend origin)
- Lifespan context manager for Neo4j driver initialization/cleanup
- Include all routers with appropriate prefixes
- Health check endpoint at `/health`
- Brand config loaded at startup

**services/neo4j_client.py:**
- Async Neo4j driver using `neo4j` Python package
- Connection pool management
- Query methods that accept `brand_id` filter
- Key queries:
  - `get_performance_summary(brand_id, days)` — Aggregate KPIs
  - `get_daily_performance(brand_id, start_date, end_date)` — Time series
  - `get_content_library(brand_id, status_filter)` — Content with attributes
  - `get_campaign_performance(brand_id)` — Campaign comparison
  - `get_audience_breakdown(brand_id)` — Performance by demographic
  - `get_geographic_performance(brand_id)` — Performance by area
  - `get_lead_funnel(brand_id)` — Lead journey stages
  - `get_content_detail(brand_id, content_id)` — Full content with relationships

**routers/performance.py:**
- `GET /api/performance/summary` — Level 1 KPI cards (spend, ROAS, conversions, revenue)
- `GET /api/performance/daily?days=7` — Daily performance time series
- `GET /api/performance/trends?period=30d` — Trend data with sparklines
- `GET /api/performance/comparison?compare=platform` — Platform comparison

**routers/insights.py:**
- `GET /api/insights/latest` — Most recent AI-generated insights
- `GET /api/insights/weekly` — Last weekly strategy review narrative
- `GET /api/insights/ai-narrative` — Current AI narrative summary (from n8n)

**requirements.txt:**
```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
neo4j>=5.0.0
pinecone-client>=3.0.0
pydantic>=2.0.0
python-dotenv>=1.0.0
httpx>=0.27.0
```

---

### Step 3: Generate Frontend (Next.js + TypeScript)

**Execute as the Dashboard Architect Agent (frontend focus).**

Create the complete Next.js application at `{CLIENT_DIR}/dashboard/frontend/`.

#### Directory Structure:
```
frontend/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .env.local.example
├── app/
│   ├── layout.tsx               # Root layout: sidebar nav, header, brand theming
│   ├── page.tsx                 # Level 1: Executive Dashboard
│   ├── campaigns/
│   │   └── page.tsx             # Level 2: Campaign Performance
│   ├── content/
│   │   ├── page.tsx             # Level 2: Content Library
│   │   └── [id]/
│   │       └── page.tsx         # Level 3: Content Detail
│   ├── audiences/
│   │   └── page.tsx             # Level 2: Audience Breakdown
│   ├── geography/
│   │   └── page.tsx             # Level 2: Geographic Performance (conditional)
│   ├── insights/
│   │   └── page.tsx             # Level 2: AI Insights
│   ├── leads/
│   │   └── page.tsx             # Level 2: Lead Management (conditional)
│   ├── detailed-metrics/
│   │   └── page.tsx             # Level 3: All Media Buyer Metrics
│   └── upload/
│       └── page.tsx             # Content Upload Interface
├── components/
│   ├── ui/
│   │   ├── MetricCard.tsx       # KPI card with value, trend, sparkline
│   │   ├── TrendSparkline.tsx   # Inline sparkline chart (SVG)
│   │   ├── InsightCard.tsx      # AI insight with type badge
│   │   ├── StatusBadge.tsx      # Status indicator (active, paused, etc.)
│   │   ├── DataTable.tsx        # Sortable, filterable table
│   │   ├── LoadingState.tsx     # Skeleton loading
│   │   └── EmptyState.tsx       # No data placeholder
│   ├── charts/
│   │   ├── PerformanceChart.tsx # Line/area chart for time series
│   │   ├── PlatformComparison.tsx # Bar chart comparing platforms
│   │   ├── DemographicBreakdown.tsx # Stacked bar or donut chart
│   │   ├── BudgetAllocation.tsx # Pie/donut chart
│   │   └── GeographicHeatmap.tsx # Map visualization (conditional)
│   ├── content/
│   │   ├── ContentGrid.tsx      # Grid of content cards with thumbnails
│   │   ├── ContentCard.tsx      # Individual content preview
│   │   └── ContentDetail.tsx    # Full content analysis view
│   ├── insights/
│   │   ├── AINarrative.tsx      # AI-generated narrative block
│   │   └── InsightsList.tsx     # List of recent insights
│   └── layout/
│       ├── Sidebar.tsx          # Navigation sidebar
│       ├── Header.tsx           # Top header with brand name
│       └── QuickNav.tsx         # Quick navigation pills
├── lib/
│   ├── api.ts                   # API client (fetch wrapper with error handling)
│   ├── types.ts                 # TypeScript interfaces for all API responses
│   ├── utils.ts                 # Formatting (currency, percentage, dates)
│   └── hooks/
│       ├── usePerformance.ts    # SWR/React Query hook for performance data
│       ├── useContent.ts        # Hook for content library
│       └── useInsights.ts       # Hook for AI insights
└── public/
    └── assets/
```

#### Key Implementation Details:

**Level 1 — Executive Dashboard (app/page.tsx):**
- 4 KPI metric cards across the top: Total Spend, ROAS, Conversions, Revenue (or Leads for service businesses)
- Each card shows: current value, trend arrow (up/down), % change vs prior period, 7-day sparkline
- AI Narrative section: Latest AI-generated summary from weekly review
- Top 3 Insights: Action-oriented insight cards
- 7-day performance trend chart (line/area)
- Quick navigation to Level 2 views

**Level 2 — Category Views:**
- `/campaigns` — Platform comparison bar chart, campaign table with status/metrics, filter by platform
- `/content` — Content grid with thumbnail previews, performance metrics overlay, filter by status/type
- `/audiences` — Demographic performance breakdown, persona cards with KPIs per audience
- `/geography` — Service area heatmap (conditional), performance by radius zone
- `/insights` — Full AI insights history, weekly review summaries, trend explanations

**Level 3 — Detailed Views:**
- `/content/[id]` — Full content analysis: all attributes (tones, aesthetics, colors), campaign history, performance timeline, similar content recommendations
- `/detailed-metrics` — Dense data tables with all media buyer metrics (CPC, CPM, CTR, frequency, quality score, impression share), exportable, multi-axis charts

**Theming:**
Apply brand colors from `brand-config.json`:
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: {
        primary: 'var(--brand-primary)',
        secondary: 'var(--brand-secondary)',
        accent: 'var(--brand-accent)',
      }
    }
  }
}
```

**Charts:**
Use lightweight charting. Prefer:
1. Custom SVG for sparklines (no dependency)
2. Recharts or Chart.js for complex charts
3. CSS-only for simple bar/pie charts where possible

**Data Fetching:**
- Use SWR or React Query for data fetching with caching and revalidation
- API client in `lib/api.ts` with base URL from env
- Loading skeletons while data loads
- Error boundaries with retry

---

### Step 4: Create Configuration Files

**Dashboard config:** `{CLIENT_DIR}/dashboard/config.json`
```json
{
  "brand_id": "{brand-id}",
  "brand_name": "{Brand Name}",
  "industry": "{industry}",
  "business_model": "{business_model}",
  "api_url": "http://localhost:8000",
  "frontend_url": "http://localhost:3000",
  "features": {
    "geographic_heatmap": {true/false based on business_model},
    "purchase_attribution": {true/false},
    "lead_journey": {true/false},
    "content_upload": true
  },
  "brand_colors": {
    "primary": "{from brand-config}",
    "secondary": "{from brand-config}",
    "accent": "{from brand-config}"
  },
  "kpi_targets": {
    "primary_kpi": "{from campaign_goals}",
    "target_value": "{from campaign_goals}"
  }
}
```

**Backend .env.example:**
```
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=
PINECONE_API_KEY=
PINECONE_INDEX=marketing-automation
BRAND_ID={brand-id}
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=
CORS_ORIGINS=http://localhost:3000
```

**Frontend .env.local.example:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BRAND_NAME={Brand Name}
NEXT_PUBLIC_BRAND_PRIMARY_COLOR={color}
NEXT_PUBLIC_BRAND_SECONDARY_COLOR={color}
```

---

### Step 5: Create Documentation

**`{CLIENT_DIR}/dashboard/README.md`:**
- Overview of dashboard architecture
- Screenshots/descriptions of each level
- Setup instructions (backend + frontend)
- Environment variable configuration
- Development commands (`uvicorn`, `npm run dev`)
- Deployment guide (Vercel for frontend, any Python host for backend)

**`{CLIENT_DIR}/dashboard/DEPLOYMENT.md`:**
- Production deployment instructions
- Vercel setup for frontend
- Backend deployment options (Railway, Render, AWS, etc.)
- Environment variable configuration for production
- Domain/SSL setup

---

### Step 6: Initialize Project Dependencies

Ask the user if they want to install dependencies now:

**If yes (backend):**
```bash
cd {CLIENT_DIR}/dashboard/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**If yes (frontend):**
```bash
cd {CLIENT_DIR}/dashboard/frontend
npm install
```

**If no:** Note in output that dependencies need to be installed before running.

## Output

After completion, display:

```
Dashboard Built: {brand_name}
==============================

  Backend (FastAPI)
  -----------------
  [x] main.py + config
  [x] {N} API routers
  [x] {N} service clients (Neo4j, Pinecone, n8n)
  [x] {N} Pydantic models
  [x] requirements.txt

  Frontend (Next.js)
  ------------------
  [x] {N} page routes
  [x] {N} components
  [x] API client + TypeScript types
  [x] Brand-themed with {brand_name} colors
  [x] package.json + tailwind config

  Features Enabled
  ----------------
  [x] Executive Summary (Level 1)
  [x] Campaign Performance (Level 2)
  [x] Content Library (Level 2)
  [x] Audience Breakdown (Level 2)
  {conditional features listed}
  [x] Detailed Metrics (Level 3)

  Configuration
  -------------
  [x] dashboard/config.json
  [x] backend/.env.example
  [x] frontend/.env.local.example
  [x] README.md + DEPLOYMENT.md

  Run Locally
  -----------
  Backend:  cd clients/{name}/dashboard/backend && uvicorn main:app --reload
  Frontend: cd clients/{name}/dashboard/frontend && npm run dev

  Next Steps:
  1. Configure backend .env with database credentials
  2. Configure frontend .env.local with API URL
  3. Run backend: uvicorn main:app --reload (port 8000)
  4. Run frontend: npm run dev (port 3000)
  5. Build website: /build-website name={name}
```

## Notes

- The dashboard must implement the 3-level progressive disclosure architecture
- Use the system specs as the source of truth for information architecture
- All components should be fully implemented, not stubs
- Include loading states, error handling, and empty states
- Brand colors should be applied throughout via CSS custom properties
- The frontend should be responsive (mobile-friendly)
- Backend should include proper CORS configuration
- Caching should be implemented for expensive database queries
- The dashboard queries n8n for AI narratives — if automation isn't built yet, show placeholder
