# Database Initialization Summary

**Client:** Eastern Healing Traditions
**Business Model:** `brick-and-mortar-primary` (service business — no e-commerce)
**Generated:** 2026-02-08
**Status:** Initialization scripts ready; awaiting database credentials configuration

---

## Overview

Two initialization scripts prepare the Droom Marketing Factory infrastructure for the Eastern Healing Traditions client:

1. **`init_neo4j.py`** — Creates Neo4j graph schema (constraints, indexes, attribute nodes)
2. **`init_pinecone.py`** — Verifies Pinecone vector index and documents client namespaces

**Neither script has been executed yet.** They are ready to run once Neo4j and Pinecone credentials are configured in the environment.

---

## Neo4j Schema Initialization

### Constraints (7 total)

Unique constraints enforce identity across node types:

- `droom_content_id_unique` — :Droom:Content
- `droom_campaign_id_unique` — :Droom:Campaign
- `droom_lead_id_unique` — :Droom:Lead
- `droom_performance_id_unique` — :Droom:Performance
- `droom_websiteform_id_unique` — :Droom:WebsiteForm
- `droom_demographic_id_unique` — :Droom:Demographic
- `droom_geographic_id_unique` — :Droom:Geographic

### Indexes (12 total)

Query optimization across high-cardinality lookups:

- **Content:** `brand_id`, `status`
- **Campaign:** `brand_id`, `status`
- **Performance:** `date`, `brand_id`
- **Lead:** `brand_id`, `email`, `status`
- **WebsiteForm:** `brand_id`
- **Demographic:** `brand_id`
- **Geographic:** `brand_id`

### Shared Attribute Nodes (38 total across 7 types)

Universal nodes shared across all Droom clients. Created with MERGE for idempotency:

| Type | Count | Values |
|------|-------|--------|
| :Droom:Tone | 8 | calm, professional, energetic, playful, aspirational, reassuring, urgent, educational |
| :Droom:Aesthetic | 8 | minimal, luxurious, intimate, modern, rustic, vibrant, clean, warm |
| :Droom:ColorPalette | 6 | warm-tones, cool-tones, earth-tones, vibrant, pastel, monochrome |
| :Droom:Composition | 4 | close-up, medium-shot, wide-shot, establishing |
| :Droom:NarrativeElement | 6 | shows_physical_space, shows_people, shows_product_service, demonstrates_use, has_dialogue, has_text_overlay |
| :Droom:Platform | 4 | instagram, facebook, google-search, youtube |
| :Droom:TimeSlot | 6 | early-morning, morning, midday, afternoon, evening, late-night |

### Client-Specific Demographic Nodes (3 total)

Audience segments with age, gender, and income profiles:

1. **chronic-pain-seekers-40-65** — Ages 40–65, all genders, $75K–150K. Research-heavy, trust-focused.
2. **autoimmune-wellness-women-30-55** — Ages 30–55, female-skew, $65K–130K. Community-influenced.
3. **proactive-wellness-adults-28-50** — Ages 28–50, all genders, $90K–200K. Education-first.

### Client-Specific Geographic Nodes (3 total)

Service delivery zones centered on Grayslake, IL:

1. **core** — 10 miles, 50% budget weight
2. **extended** — 20 miles, 35% budget weight
3. **metro** — 35 miles, 15% budget weight

### Node Label Isolation

All brand-specific nodes carry both the `:Droom` label and their entity label (e.g., `:Droom:Content`, `:Droom:Campaign`). Queries must filter by both `:Droom` AND `brand_id` for proper multi-tenant isolation.

---

## Business Model Configuration

**Feature Matrix:**

| Feature | Enabled | Notes |
|---------|---------|-------|
| Content (Video/Image) | Yes | Claude Vision analysis |
| Campaign | Yes | Multi-platform support |
| Performance | Yes | Daily metrics tracking |
| Lead | Yes | Form submissions, phone calls |
| WebsiteForm | Yes | Booking, contact, consultation forms |
| Demographic | Yes | 3 audience segments |
| Geographic | Yes | 3 service zones |
| **Customer** | **No** | E-commerce only |
| **Purchase** | **No** | E-commerce only |

**Implications:**
- Full lead tracking and attribution pipeline enabled
- No customer/purchase node relationships
- Geographic and demographic targeting fully supported

---

## Pinecone Vector Index

### Index Verification

- **Index Name:** `graphelion-deux` (shared — contains vectors from all Droom clients)
- **Dimensions:** 1536 (OpenAI text-embedding-3-small)
- **Metric:** cosine similarity
- **Status:** Verified to exist; namespaces created implicitly on first upsert

### Client Namespaces (4 + 1 shared = 5 total)

All Droom namespaces use `droom-` prefix for easy identification in shared index:

**Client-specific:**

1. **droom-content-essence-eastern-healing-traditions**
   Semantic profiles of creative assets from Claude Vision analysis (150–200 word narratives). Used for: "Find content similar to this," "What unused content matches this campaign?"

2. **droom-scenario-outcomes-eastern-healing-traditions**
   Historical campaign situations and outcomes (content type, tones, demographics, platform, budget, metrics). Used for: "What happened in a situation like this?"

3. **droom-audience-psychographics-eastern-healing-traditions**
   Behavioral patterns and audience insights from Cultural Anthropologist agent. Used for: "Why does this audience behave this way?" "What messaging themes resonate?"

4. **droom-narrative-patterns-eastern-healing-traditions**
   Storytelling approaches and content strategies from Creative Intelligence agent. Used for: "What narrative styles have worked?" "What creative gaps exist?"

**Shared (cross-client learning):**

5. **droom-cross-campaign-learnings**
   Meta-learnings aggregated across all Droom clients, tagged by industry and business_model. Used for: "What have we learned across all clients in this industry?"

---

## Next Steps

1. **Configure credentials** in `.env` at marketing-factory root:
   - `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`
   - `PINECONE_API_KEY`

2. **Execute Neo4j initialization:**
   ```bash
   python clients/eastern-healing-traditions/database/init_neo4j.py
   ```

3. **Verify Pinecone setup:**
   ```bash
   python clients/eastern-healing-traditions/database/init_pinecone.py
   ```

4. **Begin content ingestion** — Schema is then ready for asset uploads and campaign data.

---

## Reference

- Full schema details: `/clients/eastern-healing-traditions/database/schema-docs.md`
- Neo4j init script: `/clients/eastern-healing-traditions/database/init_neo4j.py`
- Pinecone verification script: `/clients/eastern-healing-traditions/database/init_pinecone.py`
