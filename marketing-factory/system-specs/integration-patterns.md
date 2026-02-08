# Integration Patterns

<purpose>
This spec describes how data flows between all system components and the patterns that govern their communication. The system has four layers: external services (Google Ads, Meta, Claude API, Google Drive, Shopify), n8n workflows (orchestration engine), data layer (Neo4j + Pinecone), and presentation layer (dashboard + website, each with FastAPI backend + Next.js frontend).

Data flows in clear, unidirectional patterns with well-defined handoff points. Each component has a specific responsibility and communicates via HTTP APIs or webhooks.
</purpose>

---

<design_principles>
## Design Principles

- **Unidirectional data flow** — Data moves in one direction through the system. External services → n8n → databases → presentation. Never backwards.
- **Webhook-driven communication** — Components push updates to each other via webhooks rather than polling. n8n → dashboard API, website → n8n, Shopify → n8n.
- **Single source of truth** — Neo4j is the source of truth for structured data (metrics, relationships). Pinecone is the source of truth for semantic data (similarity, patterns). The dashboard and website read from these, never write directly.
- **Event-driven updates** — When data changes in one component, affected downstream components are notified. Content ingested → dashboard notified. Lead scored → client notified.
- **Cache invalidation on event** — Dashboard and website cache data for performance, but invalidate caches when receiving update webhooks from n8n.
</design_principles>

---

<patterns>
## Core Data Flows

### Flow 1: Content Upload → Analysis → Storage
```
Google Drive (file uploaded) → n8n Content Ingestion workflow → Claude Vision API (analysis) → OpenAI (embedding) → Pinecone (vector) + Neo4j (node + relationships) → Dashboard API webhook (content-uploaded notification)
```
**Result:** Content profiled and ready for campaign use. Dashboard shows new content in library.

### Flow 2: Daily Performance → Analysis → Optimization
```
Google Ads API + Meta Marketing API (pull metrics) → n8n Daily Performance workflow → Neo4j (store Performance nodes, update aggregates) → Pinecone (query similar scenarios) → Claude API / CSO Agent (analyze + decide) → Ad Platform APIs (execute changes) → Dashboard API webhook (performance-updated notification)
```
**Result:** Yesterday's data stored, decisions made and executed, dashboard updated.

### Flow 3: Form Submission → Lead Scoring → Notification
```
Website form submit → Website FastAPI backend (validate) → n8n Form Ingestion webhook → Neo4j (create Lead + WebsiteForm nodes, link to Campaign via UTM) → Claude API (score lead 0-100) → Route by tier: SMS/email to client (hot), email sequence (warm), retargeting (cold) → Dashboard API webhook (new-lead notification)
```
**Result:** Lead captured, scored, routed, client notified, dashboard updated.

### Flow 4: Purchase → Attribution → Metrics Update (e-commerce)
```
Shopify order webhook → Website FastAPI backend (validate HMAC signature) → n8n Shopify Integration workflow → Neo4j (create Purchase + Customer nodes, trace attribution chain: Purchase → Campaign → Content) → Update content revenue metrics and true ROAS → Pinecone (update content metadata with revenue) → Dashboard API webhook (purchase-attributed notification)
```
**Result:** Purchase attributed to campaign and content, ROAS recalculated, dashboard updated.

### Flow 5: Dashboard Data Query
```
Dashboard frontend (user request) → Dashboard FastAPI backend → Neo4j (structured queries: metrics, campaigns, leads) + Pinecone (semantic queries: similar content, psychographics) → Aggregate + format response → Frontend renders
```
**Note:** Dashboard never writes to databases. It only reads + receives webhook notifications.

## Communication Patterns

**n8n → Dashboard/Website:** HTTP POST webhooks to API endpoints. Payload includes event type, affected entity IDs, summary data.

**Website → n8n:** HTTP POST to n8n webhook URLs. Form data includes all fields + UTM parameters + campaign attribution.

**Shopify → Website Backend → n8n:** Shopify sends webhook to website FastAPI, which validates signature and forwards to n8n. Never expose n8n webhook URLs directly to Shopify.

**Dashboard/Website → Databases:** Direct database client connections. Neo4j via official driver, Pinecone via REST API. Both filtered by brand_id.
</patterns>

---

<interfaces>
## Component Interfaces

**n8n webhook endpoints (inbound to n8n):**
- `/webhook/{brand_id}/form-submit` — Website form submissions
- `/webhook/{brand_id}/shopify-order` — Shopify purchase events (via website backend proxy)

**Dashboard API webhook endpoints (inbound to dashboard):**
- `/api/webhooks/content-uploaded` — New content profiled and ready
- `/api/webhooks/performance-updated` — Daily/weekly analysis complete
- `/api/webhooks/lead-scored` — New lead scored and routed
- `/api/webhooks/purchase-attributed` — Purchase attributed to campaign

**Website API endpoints (inbound to website backend):**
- `/api/forms/submit` — Form submission processing
- `/api/webhooks/shopify` — Shopify order webhook receiver

**External API connections (outbound from n8n):**
- Google Ads API — Campaign performance data, budget adjustments
- Meta Marketing API — Campaign performance data, ad management
- Claude API (Anthropic) — Runtime agent invocations
- OpenAI API — Embedding generation
- Google Drive API — File monitoring and downloads
- SendGrid/Mailgun — Email delivery
- Twilio — SMS notifications (hot leads)
</interfaces>

---

<constraints>
## Constraints

- All webhook payloads must include `brand_id` for routing
- Shopify webhooks must be signature-verified (HMAC) before processing
- n8n webhook URLs should not be directly exposed to external services — route through backend proxies
- Dashboard and website must never write directly to Neo4j or Pinecone — all writes go through n8n
- Retry policy for failed webhook delivery: exponential backoff (1s, 2s, 4s), max 3 attempts, then dead letter queue
- If Pinecone is unavailable, fall back to Neo4j graph traversal for similarity queries
- If Neo4j is unavailable, cache recent queries and alert admin — this is critical infrastructure
- All API connections must use HTTPS
- API keys and credentials stored in n8n credential manager, never in workflow JSON
</constraints>

---

<quality_criteria>
## Quality Criteria

- Every data flow must be traceable end-to-end: from trigger event to final storage and notification
- Webhook receivers must return 200 immediately and process asynchronously (don't block the sender)
- All integration tests must verify the complete flow, not just individual API calls
- Health check endpoints on dashboard backend and website backend for monitoring
- Key metrics to monitor: webhook delivery success rate, API response times, database query latency, n8n workflow execution times, error rates per component
- Logging must include correlation IDs that trace a single event across all components it touches
</quality_criteria>
