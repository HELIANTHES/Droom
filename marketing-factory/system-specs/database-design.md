# Database Design

<purpose>
The system uses two databases that serve complementary roles. Neo4j (graph) stores structured facts and relationships — who, what, when, how much. Pinecone (vector) stores semantic memory — similarity, patterns, "situations like this." Together they give runtime agents both precise data and intelligent context for every decision.

Both databases are shared infrastructure. All clients coexist in the same Neo4j instance and the same Pinecone index, isolated by `brand_id` properties (Neo4j) and namespaces (Pinecone). The database-schema agent designs and initializes both for each new client.
</purpose>

---

<design_principles>
## Design Principles

- **Dual-database by design** — Neither database alone is sufficient. Neo4j answers "what happened?" Pinecone answers "what's similar?" Every important decision queries both.
- **Brand isolation via convention** — Every Neo4j node with client data has a `brand_id` property. Every Pinecone namespace includes the brand_id. Queries must always filter by brand_id. Shared attribute nodes (Tone, Aesthetic, Platform, etc.) have no brand_id — they're universal.
- **Relationships encode knowledge** — Neo4j relationships accumulate learned weights over time: `(Demographic)-[:RESPONDS_TO {avg_roas, sample_size}]->(Tone)`. The graph literally gets smarter as more data flows through it.
- **Semantic descriptions are the bridge** — Claude Vision generates rich narrative descriptions of content. These descriptions become Pinecone vectors AND inform Neo4j relationship creation. The same analysis populates both databases.
- **Write together, query independently** — Content ingestion and learning workflows write to both databases simultaneously. But queries typically start with one database and optionally enrich from the other.
- **Graceful degradation** — If Pinecone is unavailable, fall back to Neo4j graph traversal for similarity (traverse shared attribute nodes). If Neo4j is unavailable, cache recent queries and retry.
</design_principles>

---

<patterns>
## Neo4j Schema

### Node Types

**Brand-specific nodes** (always have `brand_id` property):
- **Content** (labels: `:Content:Video` or `:Content:Image`) — Creative assets. Properties: id, brand_id, drive_id, drive_url, filename, duration_seconds, resolution, format, upload_date, profile_date, status (active/resting/archived), total_impressions, total_spend, avg_roas, total_revenue (e-commerce)
- **Campaign** — Ad campaigns. Properties: id, brand_id, name, platform, objective, demographic_target, geographic_target, budget_per_day, start_date, status
- **Performance** — Daily performance records. Properties: id, date, impressions, clicks, conversions, spend, revenue, ctr, cpm, cpc, roas, conversion_rate, cost_per_conversion
- **Demographic** — Target audience segments. Properties: id, brand_id, name, age_range, description
- **Geographic** — Target areas. Properties: id, brand_id, name, type (city/zip/radius), coordinates
- **Lead** — Form submissions. Properties: id, brand_id, name, email, phone, service_interest, score, tier (hot/warm/cold), source_campaign, created_at
- **WebsiteForm** — Form submission data. Properties: id, brand_id, form_type, submitted_at
- **Customer** (e-commerce) — Customers with purchases. Properties: id, brand_id, email, total_purchases, total_revenue, first_purchase_date
- **Purchase** (e-commerce) — Individual orders. Properties: id, brand_id, order_total, products, purchase_date

**Shared attribute nodes** (no `brand_id` — universal across all clients):
- **Tone** — Emotional tones: calm, professional, energetic, playful, aspirational, reassuring, urgent, educational
- **Aesthetic** — Visual styles: minimal, luxurious, intimate, modern, rustic, vibrant, clean, warm
- **ColorPalette** — Color categories: warm-tones, cool-tones, earth-tones, vibrant, pastel, monochrome
- **Composition** — Shot types: close-up, medium-shot, wide-shot, establishing
- **NarrativeElement** — Content elements: shows_physical_space, shows_people, shows_product_service, etc.
- **Platform** — Ad platforms: instagram, facebook, google-search, google-display, tiktok
- **TimeSlot** — Day parts: early-morning, morning, midday, afternoon, evening, late-night

### Key Relationship Types

**Content relationships:**
- `(Content)-[:HAS_TONE {confidence}]->(Tone)` — Emotional profile from Claude Vision
- `(Content)-[:HAS_AESTHETIC {confidence}]->(Aesthetic)` — Visual style profile
- `(Content)-[:HAS_COLOR_PALETTE]->(ColorPalette)` — Color classification
- `(Content)-[:HAS_COMPOSITION]->(Composition)` — Shot type classification
- `(Content)-[:SHOWS]->(NarrativeElement)` — What appears in the content

**Campaign relationships:**
- `(Content)-[:RAN_IN]->(Campaign)` — Which campaigns used which content
- `(Campaign)-[:TARGETED]->(Demographic)` — Audience targeting
- `(Campaign)-[:TARGETED_AREA]->(Geographic)` — Geographic targeting
- `(Campaign)-[:USED_PLATFORM]->(Platform)` — Where it ran
- `(Campaign)-[:ACHIEVED]->(Performance)` — Daily results

**Learning relationships** (weights updated over time):
- `(Demographic)-[:RESPONDS_TO {avg_roas, sample_size}]->(Tone)` — Which tones work for which audiences
- `(Demographic)-[:PREFERS_AESTHETIC {avg_roas, sample_size}]->(Aesthetic)` — Aesthetic preferences
- `(Demographic)-[:ACTIVE_ON {avg_engagement}]->(TimeSlot)` — When they engage
- `(Platform)-[:BEST_FOR {avg_roas}]->(Demographic)` — Platform-audience fit

**Attribution relationships:**
- `(Lead)-[:SUBMITTED]->(WebsiteForm)` — Form submission tracking
- `(Lead)-[:CAME_FROM]->(Campaign)` — Source attribution
- `(Lead)-[:CONVERTED_TO]->(Customer)` — Lead → customer journey (e-commerce)
- `(Purchase)-[:ATTRIBUTED_TO]->(Campaign)` — Purchase attribution
- `(Purchase)-[:ATTRIBUTED_TO]->(Content)` — Content attribution

## Pinecone Schema

**Index:** `marketing-automation` (single index for all clients)
**Embedding model:** OpenAI text-embedding-3-small (1536 dimensions)
**Namespace pattern:** `{type}-{brand_id}` (brand isolation)

### Namespaces (5 types per client + 1 shared)

1. **content-essence-{brand_id}** — Semantic profiles of creative assets (videos/images). Embedded from Claude Vision's 150-200 word narrative description. Metadata includes all profile attributes, performance metrics, status. Used for: "find content similar to this," "what unused content matches this campaign?"

2. **scenario-outcomes-{brand_id}** — Historical campaign situations + outcomes. Embedded from rich scenario descriptions (content type, tones, demographics, platform, budget, outcome metrics). Used for: "what happened in a situation like this?" "should I shift budget based on similar past scenarios?"

3. **audience-psychographics-{brand_id}** — Behavioral patterns and audience insights. Embedded from Cultural Anthropologist agent observations. Used for: "why does this audience behave this way?" "what messaging themes resonate?"

4. **narrative-patterns-{brand_id}** — Storytelling approaches and content strategies. Embedded from Creative Intelligence agent analysis. Used for: "what narrative styles have worked?" "what creative gaps exist?"

5. **cross-campaign-learnings** (shared, no brand_id) — Meta-learnings applicable across all clients. Embedded from aggregated insights. Tagged by industry and business_model. Used for: "what have we learned across all clients in this industry?"
</patterns>

---

<interfaces>
## When to Use Which Database

| Question Type | Use |
|---------------|-----|
| "Find similar content" | Pinecone |
| "What are the exact metrics?" | Neo4j |
| "What should I do in this situation?" | Pinecone (scenario-outcomes) |
| "Show the lead attribution chain" | Neo4j |
| "Why does this content perform well?" | Both (Pinecone for similarity, Neo4j for metrics) |
| "What's the portfolio balance?" | Both |
| "Apply cross-client learnings" | Pinecone (cross-campaign-learnings) |
| "Real-time dashboard data" | Neo4j |

**General rule:** Pinecone first when the question involves similarity, patterns, or soft matching. Neo4j first when the question involves specific facts, metrics, or relationships. Both when you need intelligent discovery + detailed analysis.

## Data Flow Into Databases

- **Content ingestion workflow:** Claude Vision analysis → Neo4j Content node + attribute relationships + Pinecone content-essence vector (simultaneously)
- **Daily performance workflow:** Ad platform data → Neo4j Performance nodes linked to Campaigns → content aggregate metrics updated
- **Learn & remember workflow:** Generate scenario descriptions → Pinecone scenario-outcomes vectors → Neo4j relationship weight updates
- **Form ingestion workflow:** Form data → Neo4j Lead + WebsiteForm nodes + campaign attribution
- **Shopify integration:** Order data → Neo4j Purchase node + Customer node + attribution relationships
</interfaces>

---

<constraints>
## Constraints

- Every query with client data MUST filter by brand_id — this is the isolation mechanism
- Shared attribute nodes (Tone, Aesthetic, etc.) must be created once during first client initialization, then reused
- Neo4j constraints: unique id+brand_id combinations for Content, Campaign, Lead, Customer, Purchase nodes
- Neo4j indexes: brand_id on all brand-specific nodes, date on Performance nodes, email on Lead/Customer nodes, status on Content/Campaign nodes
- Pinecone: single index `marketing-automation`, max 1000 vectors per upsert batch
- Embedding must use text-embedding-3-small (1536 dimensions) for all namespaces — mixing models breaks similarity
- Learning relationship weights must track sample_size to prevent small-sample conclusions from dominating
</constraints>

---

<quality_criteria>
## Quality Criteria

- Schema initialization scripts must be idempotent (safe to run multiple times)
- All Neo4j constraints and indexes must be created before any data insertion
- Shared attribute nodes must exist before client-specific Content nodes are created
- Pinecone namespaces are created implicitly on first upsert — no explicit creation needed
- Schema must support both service business (leads, forms) and e-commerce (customers, purchases) — conditional nodes based on business_model
- All timestamp fields must use ISO 8601 format
- Performance metrics must use consistent units: spend/revenue in dollars (float), rates as decimals (0.042 not 4.2%)
</quality_criteria>

---

<reference_examples>
## Cost Estimates

**Neo4j:**
- AuraDB Free: 200K nodes, 400K relationships (sufficient for ~5 clients during testing)
- AuraDB Pro: $65/month (unlimited, production-ready)

**Pinecone:**
- Starter: Free, 1 index, 100K vectors (sufficient for ~3-5 clients)
- Standard: $70/month, unlimited vectors

**OpenAI Embeddings:**
- text-embedding-3-small: $0.02/1M tokens (~$0.000006 per embedding)
- Negligible cost even at high volume

**Total database infrastructure:** ~$0 (testing) to ~$135/month (production with multiple clients)
</reference_examples>
