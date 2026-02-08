# Database Schema Documentation

**Client:** Eastern Healing Traditions (`eastern-healing-traditions`)
**Business Model:** `brick-and-mortar-primary` (service business)
**Generated:** 2026-02-08

---

## Business Model Feature Matrix

| Feature | Enabled | Notes |
|---------|---------|-------|
| Content nodes | Yes | Video and Image assets |
| Campaign nodes | Yes | All platforms |
| Performance nodes | Yes | Daily metrics |
| Lead nodes | Yes | Form submissions, phone calls |
| WebsiteForm nodes | Yes | Booking forms, contact forms |
| Demographic nodes | Yes | 3 audience segments |
| Geographic nodes | Yes | 3 radius zones |
| Customer nodes | **No** | E-commerce only |
| Purchase nodes | **No** | E-commerce only |

---

## Neo4j Node Types

### Brand-Specific Nodes (carry `brand_id` property)

All brand-specific nodes carry both the `:Droom` label and the entity label. Every query must filter by `:Droom` label AND `brand_id` for proper isolation.

#### :Droom:Content:Video / :Droom:Content:Image

Creative assets analyzed by Claude Vision.

| Property | Type | Description |
|----------|------|-------------|
| id | String | Unique identifier |
| brand_id | String | `eastern-healing-traditions` |
| s3_key | String | S3 object key |
| s3_url | String | Full S3 URL |
| filename | String | Original filename |
| duration_seconds | Float | Video duration (video only) |
| resolution | String | e.g., `1920x1080` |
| format | String | e.g., `mp4`, `jpg` |
| upload_date | DateTime | When uploaded |
| profile_date | DateTime | When Claude Vision analyzed it |
| status | String | `active`, `resting`, `archived` |
| total_impressions | Integer | Aggregate impressions across campaigns |
| total_spend | Float | Aggregate spend (USD) |
| avg_roas | Float | Average return on ad spend |

#### :Droom:Campaign

Ad campaigns across platforms.

| Property | Type | Description |
|----------|------|-------------|
| id | String | Unique identifier |
| brand_id | String | `eastern-healing-traditions` |
| name | String | Campaign name |
| platform | String | `google-search`, `facebook`, `instagram`, `youtube` |
| objective | String | Campaign objective |
| demographic_target | String | Target segment name |
| geographic_target | String | Target zone name |
| budget_per_day | Float | Daily budget (USD) |
| start_date | DateTime | Campaign start |
| status | String | `active`, `paused`, `completed` |

#### :Droom:Performance

Daily performance records linked to campaigns.

| Property | Type | Description |
|----------|------|-------------|
| id | String | Unique identifier |
| brand_id | String | `eastern-healing-traditions` |
| date | Date | Performance date (ISO 8601) |
| impressions | Integer | Daily impressions |
| clicks | Integer | Daily clicks |
| conversions | Integer | Daily conversions |
| spend | Float | Daily spend (USD) |
| revenue | Float | Daily revenue (USD) |
| ctr | Float | Click-through rate (decimal, e.g., 0.042) |
| cpm | Float | Cost per 1000 impressions (USD) |
| cpc | Float | Cost per click (USD) |
| roas | Float | Return on ad spend |
| conversion_rate | Float | Conversion rate (decimal) |
| cost_per_conversion | Float | Cost per conversion (USD) |

#### :Droom:Lead

Qualified leads from campaigns and organic sources.

| Property | Type | Description |
|----------|------|-------------|
| id | String | Unique identifier |
| brand_id | String | `eastern-healing-traditions` |
| name | String | Lead name |
| email | String | Lead email |
| phone | String | Lead phone |
| service_interest | String | Which service they inquired about |
| score | Float | Lead quality score |
| tier | String | `hot`, `warm`, `cold` |
| source_campaign | String | Campaign ID that generated the lead |
| status | String | `new`, `contacted`, `booked`, `no-show`, `converted` |
| created_at | DateTime | When the lead was captured |

#### :Droom:WebsiteForm

Form submission tracking.

| Property | Type | Description |
|----------|------|-------------|
| id | String | Unique identifier |
| brand_id | String | `eastern-healing-traditions` |
| form_type | String | `booking`, `contact`, `consultation-request` |
| submitted_at | DateTime | When the form was submitted |

#### :Droom:Demographic

Target audience segments.

| Property | Type | Description |
|----------|------|-------------|
| id | String | `{brand_id}--{segment_name}` |
| brand_id | String | `eastern-healing-traditions` |
| name | String | Segment slug |
| display_name | String | Human-readable name |
| age_range | String | e.g., `40-65` |
| gender | String | `all`, `female-skew` |
| description | String | Full segment description |

#### :Droom:Geographic

Target geographic zones.

| Property | Type | Description |
|----------|------|-------------|
| id | String | `{brand_id}--{zone_name}` |
| brand_id | String | `eastern-healing-traditions` |
| name | String | `core`, `extended`, `metro` |
| radius_miles | Integer | Radius from center |
| budget_weight | Float | Budget allocation weight |
| center_lat | Float | Center latitude |
| center_lng | Float | Center longitude |
| center_address | String | Center address |
| areas | String | Comma-separated area names |

### Shared Attribute Nodes (no `brand_id` -- universal across Droom)

These nodes carry the `:Droom` label but no `brand_id`. They are shared across all Droom clients.

| Label | Values |
|-------|--------|
| :Droom:Tone | calm, professional, energetic, playful, aspirational, reassuring, urgent, educational |
| :Droom:Aesthetic | minimal, luxurious, intimate, modern, rustic, vibrant, clean, warm |
| :Droom:ColorPalette | warm-tones, cool-tones, earth-tones, vibrant, pastel, monochrome |
| :Droom:Composition | close-up, medium-shot, wide-shot, establishing |
| :Droom:NarrativeElement | shows_physical_space, shows_people, shows_product_service, demonstrates_use, has_dialogue, has_text_overlay |
| :Droom:Platform | instagram, facebook, google-search, youtube |
| :Droom:TimeSlot | early-morning, morning, midday, afternoon, evening, late-night |

---

## Relationships

### Content Relationships

| Relationship | From | To | Properties |
|-------------|------|-----|------------|
| HAS_TONE | :Droom:Content | :Droom:Tone | confidence (0-1) |
| HAS_AESTHETIC | :Droom:Content | :Droom:Aesthetic | confidence (0-1) |
| HAS_COLOR_PALETTE | :Droom:Content | :Droom:ColorPalette | |
| HAS_COMPOSITION | :Droom:Content | :Droom:Composition | |
| SHOWS | :Droom:Content | :Droom:NarrativeElement | |

### Campaign Relationships

| Relationship | From | To | Properties |
|-------------|------|-----|------------|
| RAN_IN | :Droom:Content | :Droom:Campaign | |
| TARGETED | :Droom:Campaign | :Droom:Demographic | |
| TARGETED_AREA | :Droom:Campaign | :Droom:Geographic | |
| USED_PLATFORM | :Droom:Campaign | :Droom:Platform | |
| ACHIEVED | :Droom:Campaign | :Droom:Performance | |

### Learning Relationships (weights updated over time)

| Relationship | From | To | Properties |
|-------------|------|-----|------------|
| RESPONDS_TO | :Droom:Demographic | :Droom:Tone | avg_roas, sample_size |
| PREFERS_AESTHETIC | :Droom:Demographic | :Droom:Aesthetic | avg_roas, sample_size |
| ACTIVE_ON | :Droom:Demographic | :Droom:TimeSlot | avg_engagement |
| BEST_FOR | :Droom:Platform | :Droom:Demographic | avg_roas |

### Attribution Relationships (enabled for this business model)

| Relationship | From | To | Properties |
|-------------|------|-----|------------|
| SUBMITTED | :Droom:Lead | :Droom:WebsiteForm | |
| CAME_FROM | :Droom:Lead | :Droom:Campaign | |

### Attribution Relationships (NOT enabled -- e-commerce only)

| Relationship | From | To | Notes |
|-------------|------|-----|-------|
| CONVERTED_TO | :Droom:Lead | :Droom:Customer | Requires Customer nodes |
| ATTRIBUTED_TO | :Droom:Purchase | :Droom:Campaign | Requires Purchase nodes |
| ATTRIBUTED_TO | :Droom:Purchase | :Droom:Content | Requires Purchase nodes |

---

## Constraints

| Constraint Name | Label | Property | Type |
|----------------|-------|----------|------|
| droom_content_id_unique | :Droom:Content | id | UNIQUE |
| droom_campaign_id_unique | :Droom:Campaign | id | UNIQUE |
| droom_lead_id_unique | :Droom:Lead | id | UNIQUE |
| droom_performance_id_unique | :Droom:Performance | id | UNIQUE |
| droom_websiteform_id_unique | :Droom:WebsiteForm | id | UNIQUE |
| droom_demographic_id_unique | :Droom:Demographic | id | UNIQUE |
| droom_geographic_id_unique | :Droom:Geographic | id | UNIQUE |

---

## Indexes

| Index Name | Label | Property | Purpose |
|-----------|-------|----------|---------|
| droom_content_brand_id | :Droom:Content | brand_id | Client isolation |
| droom_content_status | :Droom:Content | status | Filter active/resting/archived |
| droom_campaign_brand_id | :Droom:Campaign | brand_id | Client isolation |
| droom_campaign_status | :Droom:Campaign | status | Filter active/paused/completed |
| droom_performance_date | :Droom:Performance | date | Date range queries |
| droom_performance_brand_id | :Droom:Performance | brand_id | Client isolation |
| droom_lead_brand_id | :Droom:Lead | brand_id | Client isolation |
| droom_lead_email | :Droom:Lead | email | Lead lookup by email |
| droom_lead_status | :Droom:Lead | status | Filter by lead status |
| droom_websiteform_brand_id | :Droom:WebsiteForm | brand_id | Client isolation |
| droom_demographic_brand_id | :Droom:Demographic | brand_id | Client isolation |
| droom_geographic_brand_id | :Droom:Geographic | brand_id | Client isolation |

---

## Pinecone Namespaces

**Index:** `graphelion-deux` (shared -- contains non-Droom data)
**Dimensions:** 1536
**Metric:** cosine
**Embedding model:** OpenAI text-embedding-3-small

| Namespace | Scope | Description |
|-----------|-------|-------------|
| droom-content-essence-eastern-healing-traditions | Client | Semantic profiles of creative assets from Claude Vision analysis |
| droom-scenario-outcomes-eastern-healing-traditions | Client | Historical campaign situations and outcomes |
| droom-audience-psychographics-eastern-healing-traditions | Client | Behavioral patterns and audience insights |
| droom-narrative-patterns-eastern-healing-traditions | Client | Storytelling approaches and content strategies |
| droom-cross-campaign-learnings | Shared | Meta-learnings across all Droom clients |

---

## Query Examples

All queries include `:Droom` label AND `brand_id` filter for proper isolation.

### Find all active content for this client

```cypher
MATCH (c:Droom:Content {brand_id: 'eastern-healing-traditions', status: 'active'})
RETURN c.id, c.filename, c.avg_roas, c.total_impressions
ORDER BY c.upload_date DESC
```

### Find content with specific tone

```cypher
MATCH (c:Droom:Content {brand_id: 'eastern-healing-traditions', status: 'active'})
      -[:HAS_TONE {confidence: conf}]->(t:Droom:Tone {name: 'reassuring'})
WHERE conf > 0.6
RETURN c.id, c.filename, conf
ORDER BY conf DESC
```

### Get campaign performance for a date range

```cypher
MATCH (camp:Droom:Campaign {brand_id: 'eastern-healing-traditions'})
      -[:ACHIEVED]->(p:Droom:Performance)
WHERE p.date >= date('2026-01-01') AND p.date <= date('2026-01-31')
RETURN camp.name, camp.platform,
       SUM(p.impressions) AS total_impressions,
       SUM(p.clicks) AS total_clicks,
       SUM(p.spend) AS total_spend,
       SUM(p.conversions) AS total_conversions
ORDER BY total_spend DESC
```

### Find which tones a demographic responds to

```cypher
MATCH (d:Droom:Demographic {brand_id: 'eastern-healing-traditions',
                             name: 'chronic-pain-seekers-40-65'})
      -[r:RESPONDS_TO]->(t:Droom:Tone)
WHERE r.sample_size >= 10
RETURN t.name, r.avg_roas, r.sample_size
ORDER BY r.avg_roas DESC
```

### Lead attribution chain

```cypher
MATCH (l:Droom:Lead {brand_id: 'eastern-healing-traditions'})
      -[:CAME_FROM]->(camp:Droom:Campaign)
      -[:USED_PLATFORM]->(p:Droom:Platform)
RETURN l.name, l.tier, l.service_interest,
       camp.name AS campaign, p.name AS platform
ORDER BY l.created_at DESC
LIMIT 25
```

### Portfolio balance check -- content by tone

```cypher
MATCH (c:Droom:Content {brand_id: 'eastern-healing-traditions', status: 'active'})
      -[:HAS_TONE]->(t:Droom:Tone)
RETURN t.name, COUNT(c) AS content_count
ORDER BY content_count DESC
```

### Geographic zone performance

```cypher
MATCH (camp:Droom:Campaign {brand_id: 'eastern-healing-traditions'})
      -[:TARGETED_AREA]->(g:Droom:Geographic)
MATCH (camp)-[:ACHIEVED]->(p:Droom:Performance)
RETURN g.name, g.radius_miles,
       SUM(p.spend) AS total_spend,
       SUM(p.conversions) AS total_conversions,
       CASE WHEN SUM(p.spend) > 0
            THEN SUM(p.conversions) * 1.0 / SUM(p.spend) * 100
            ELSE 0 END AS conversions_per_dollar
ORDER BY g.radius_miles
```

### List all Droom nodes (safety check -- never returns non-Droom data)

```cypher
MATCH (n:Droom)
WHERE n.brand_id = 'eastern-healing-traditions' OR NOT EXISTS(n.brand_id)
RETURN labels(n) AS node_labels, COUNT(n) AS count
ORDER BY count DESC
```
