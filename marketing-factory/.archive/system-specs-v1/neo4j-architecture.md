# Neo4j Graph Database Architecture

## Overview

All clients share a single Neo4j database instance with data isolated by `brand_id` property on all nodes.

for connection, use the available environment variables:
NEO4J_URI
NEO4J_USER
NEO4J_PASSWORD

also keep in mind that the neo4j db corresponding to the above env vars already exists and is in use for other projects so you will need to make sure the entities and relationships you create do not conflict with existing ones so you may need to review the existing schema



**Purpose:** Structured storage of entities, relationships, and performance data. Enables fast graph traversals, relationship queries, and complex pattern matching.

## Why Neo4j?

- **Relationship-first:** Natural model for content → campaigns → demographics → performance
- **Fast traversals:** "Find all content that performed well with this demographic" is a graph walk, not complex SQL joins
- **Pattern matching:** Cypher queries express complex patterns naturally
- **Flexible schema:** Add new node types and relationships as system evolves
- **ACID transactions:** Critical for data consistency
- **Real-time analytics:** Sub-second queries even with millions of nodes

## When to Use Neo4j vs. Pinecone

**Use Neo4j for:**
- Structured facts and metrics (performance data, campaign details)
- Relationship queries ("What demographics like this content?")
- Aggregations (average ROAS by platform)
- Temporal queries (performance over time)
- Exact matching (find content by ID)

**Use Pinecone for:**
- Semantic similarity ("Find content similar to this")
- Fuzzy matching ("Content with calm vibe")
- Learning from scenarios ("What happened in similar situations?")
- Pattern discovery across contexts

**Use Both Together:**
- Pinecone finds similar content semantically
- Neo4j provides detailed performance data for those content IDs
- Example: "Find content similar to video-003 (Pinecone), then show me its performance by demographic (Neo4j)"

---

## Node Types

### Content Nodes

**Video Node:**
```cypher
(:Content:Video {
  id: string,                    // "video-003"
  brand_id: string,              // "zen-med-clinic"
  drive_id: string,              // Google Drive file ID
  drive_url: string,             // Full Google Drive URL
  filename: string,              // "acupuncture-treatment-calm.mp4"
  duration_seconds: int,         // 30
  resolution: string,            // "1080x1920"
  format: string,                // "vertical-video"
  upload_date: date,             // 2026-01-15
  profile_date: date,            // When Claude analyzed it
  status: string,                // "active", "resting", "archived"
  total_impressions: int,        // Cumulative
  total_spend: float,            // Cumulative
  avg_roas: float,               // Calculated across all uses
  created_at: datetime,
  updated_at: datetime
})
```

**Image Node:**
```cypher
(:Content:Image {
  id: string,
  brand_id: string,
  drive_id: string,
  drive_url: string,
  filename: string,
  resolution: string,            // "1080x1080"
  format: string,                // "square-image", "vertical-image"
  upload_date: date,
  profile_date: date,
  status: string,
  total_impressions: int,
  total_spend: float,
  avg_roas: float,
  created_at: datetime,
  updated_at: datetime
})
```

**Note:** Detailed profile attributes (tones, aesthetics, colors) are stored in Pinecone, not Neo4j. Neo4j stores just enough to reference and aggregate.

---

### Profile Attribute Nodes (Shared Across All Brands)

These nodes are created once and shared. No `brand_id` property.

**Tone Node:**
```cypher
(:Tone {
  name: string,                  // "calm", "professional", "energetic"
  category: "emotional"
})
```

**Aesthetic Node:**
```cypher
(:Aesthetic {
  name: string,                  // "minimal", "intimate", "luxurious"
  category: "visual"
})
```

**ColorPalette Node:**
```cypher
(:ColorPalette {
  name: string,                  // "warm-tones", "earth-tones", "vibrant"
  category: "color"
})
```

**Composition Node:**
```cypher
(:Composition {
  name: string,                  // "close-up", "steady-cam", "dynamic"
  category: "technical"
})
```

**NarrativeElement Node:**
```cypher
(:NarrativeElement {
  name: string,                  // "shows-physical-space", "testimonial"
  category: "narrative"
})
```

**Example Shared Nodes:**
```cypher
// Created once during first spawn, reused by all clients
CREATE (:Tone {name: "calm", category: "emotional"})
CREATE (:Tone {name: "professional", category: "emotional"})
CREATE (:Tone {name: "reassuring", category: "emotional"})
CREATE (:Aesthetic {name: "minimal", category: "visual"})
CREATE (:Aesthetic {name: "intimate", category: "visual"})
CREATE (:ColorPalette {name: "warm-tones", category: "color"})
// etc.
```

---

### Campaign Nodes

```cypher
(:Campaign {
  id: string,                    // "campaign_20260115_001"
  brand_id: string,              // "zen-med-clinic"
  platform: string,              // "instagram", "facebook", "google-search"
  date: date,                    // Campaign start date
  budget_per_day: float,         // 45.00
  status: string,                // "active", "paused", "completed"
  campaign_goal: string,         // "local-awareness", "conversion"
  journey_stage: string,         // "awareness", "consideration", "conversion"
  created_at: datetime,
  updated_at: datetime
})
```

---

### Performance Nodes

```cypher
(:Performance {
  id: string,                    // "perf_20260115_001"
  date: date,                    // Which day this performance is for
  impressions: int,              // 12500
  clicks: int,                   // 525
  conversions: int,              // 22
  spend: float,                  // 315.00
  revenue: float,                // 1323.00
  ctr: float,                    // 0.042 (calculated: clicks/impressions)
  cpm: float,                    // 8.50 (calculated: spend/impressions*1000)
  cpc: float,                    // 0.45 (calculated: spend/clicks)
  roas: float,                   // 4.2 (calculated: revenue/spend)
  conversion_rate: float,        // 0.31 (calculated: conversions/clicks)
  frequency: float,              // 2.3 (avg times same person saw ad)
  reach: int                     // 5434 (unique people reached)
})
```

---

### Demographic Nodes

```cypher
(:Demographic {
  name: string,                  // "wellness-focused-women-35-50"
  brand_id: string,              // "zen-med-clinic"
  age_min: int,                  // 35
  age_max: int,                  // 50
  gender: string,                // "female", "male", "all"
  interests: [string],           // ["wellness", "stress-relief"]
  income_level: string,          // "middle-to-upper"
  psychographics: string,        // Long-form description
  created_at: datetime
})
```

**Note:** Deep psychographic profiles are in Pinecone. Neo4j stores basic demographics + relationship to performance.

---

### Platform Nodes (Shared)

```cypher
(:Platform {
  name: string,                  // "instagram", "facebook", "google-search"
  type: string                   // "social", "search", "display"
})
```

**Example Shared Nodes:**
```cypher
CREATE (:Platform {name: "instagram", type: "social"})
CREATE (:Platform {name: "facebook", type: "social"})
CREATE (:Platform {name: "google-search", type: "search"})
CREATE (:Platform {name: "google-display", type: "display"})
```

---

### TimeSlot Nodes (Shared)

```cypher
(:TimeSlot {
  name: string,                  // "weekday-evening", "weekend-morning"
  day_types: [string],           // ["monday", "tuesday", "wednesday", ...]
  hours: [int]                   // [18, 19, 20, 21]
})
```

**Example Shared Nodes:**
```cypher
CREATE (:TimeSlot {
  name: "weekday-evening", 
  day_types: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  hours: [18, 19, 20, 21]
})
CREATE (:TimeSlot {
  name: "weekend-morning",
  day_types: ["saturday", "sunday"],
  hours: [8, 9, 10, 11]
})
```

---

### Geographic Nodes

```cypher
(:GeographicArea {
  name: string,                  // "5-10mi", "Palo Alto", "Stanford"
  brand_id: string,              // "zen-med-clinic"
  distance_from_location_miles: float,  // 7.5
  coordinates: point             // Optional: point({latitude: 37.4419, longitude: -122.1430})
})
```

---

### Lead Nodes

```cypher
(:Lead {
  id: string,                    // "lead_20260115_001"
  brand_id: string,              // "zen-med-clinic"
  name: string,                  // "Jane Doe"
  email: string,                 // "jane@example.com"
  phone: string,                 // "(650) 555-0123"
  service_interest: string,      // "acupuncture"
  message: string,               // User's message from form
  source: string,                // "website-booking-form"
  source_campaign: string,       // "campaign_20260115_001"
  lead_score: float,             // 85.5 (calculated by Lead Scoring Agent)
  score_reasoning: string,       // Why this score
  status: string,                // "new", "contacted", "qualified", "converted", "lost"
  created_at: datetime,
  contacted_at: datetime,
  converted_at: datetime
})
```

---

### Form Nodes

```cypher
(:WebsiteForm {
  form_type: string,             // "booking", "newsletter", "contact"
  submitted_at: datetime,
  utm_source: string,            // From URL params
  utm_medium: string,
  utm_campaign: string,
  referrer: string               // Which page led to form
})
```

---

### Customer Nodes (E-commerce)

```cypher
(:Customer {
  id: string,                    // "customer_001"
  brand_id: string,              // "diamond-jeweler"
  name: string,
  email: string,
  phone: string,
  total_lifetime_value: float,   // 12500.00
  first_purchase_date: date,
  last_purchase_date: date,
  purchase_count: int            // 3
})
```

---

### Purchase Nodes (E-commerce)

```cypher
(:Purchase {
  id: string,                    // "purchase_20260115_001"
  brand_id: string,              // "diamond-jeweler"
  order_total: float,            // 2400.00
  product_names: [string],       // ["Diamond Ring", "Necklace"]
  purchase_date: datetime,
  source: string                 // "instagram-ad" or "organic"
})
```

---

## Relationship Types

### Content → Profile Attributes

**Content has profile attributes with confidence scores:**

```cypher
(Content)-[:HAS_TONE {confidence: float}]->(Tone)
(Content)-[:HAS_AESTHETIC {confidence: float}]->(Aesthetic)
(Content)-[:HAS_COLOR_PALETTE]->(ColorPalette)
(Content)-[:HAS_COMPOSITION]->(Composition)
(Content)-[:SHOWS]->(NarrativeElement)
```

**Example:**
```cypher
// video-003 has calm tone with 95% confidence
(video003:Content:Video {id: "video-003", brand_id: "zen-med-clinic"})
-[:HAS_TONE {confidence: 0.95}]->
(calm:Tone {name: "calm"})
```

---

### Campaign Relationships

**Content runs in campaigns:**
```cypher
(Content)-[:RAN_IN]->(Campaign)
```

**Campaigns target demographics, areas, platforms, time slots:**
```cypher
(Campaign)-[:TARGETED]->(Demographic)
(Campaign)-[:TARGETED_AREA]->(GeographicArea)
(Campaign)-[:USED_PLATFORM]->(Platform)
(Campaign)-[:SCHEDULED_AT]->(TimeSlot)
```

**Campaigns achieve performance:**
```cypher
(Campaign)-[:ACHIEVED]->(Performance)
```

**Example:**
```cypher
(video003)-[:RAN_IN]->(campaign001:Campaign)
(campaign001)-[:TARGETED]->(women3550:Demographic {name: "wellness-focused-women-35-50"})
(campaign001)-[:USED_PLATFORM]->(instagram:Platform {name: "instagram"})
(campaign001)-[:SCHEDULED_AT]->(evenings:TimeSlot {name: "weekday-evening"})
(campaign001)-[:ACHIEVED]->(perf001:Performance {roas: 4.2})
```

---

### Learning Relationships (Performance Patterns)

**Demographics respond to attributes:**

```cypher
(Demographic)-[:RESPONDS_TO {
  avg_ctr: float,
  avg_roas: float,
  sample_size: int,
  last_updated: date
}]->(Tone)

(Demographic)-[:PREFERS_AESTHETIC {
  avg_ctr: float,
  avg_roas: float,
  sample_size: int,
  last_updated: date
}]->(Aesthetic)

(Demographic)-[:ENGAGES_AT {
  avg_ctr: float,
  sample_size: int,
  last_updated: date
}]->(TimeSlot)
```

**Example:**
```cypher
// Women 35-50 respond well to calm tone (based on 15 campaigns)
(women3550)-[:RESPONDS_TO {
  avg_ctr: 0.041,
  avg_roas: 4.0,
  sample_size: 15,
  last_updated: date('2026-02-01')
}]->(calm:Tone {name: "calm"})
```

**These relationships are updated by n8n Learn & Remember workflow after analyzing performance.**

---

### Platform Preferences

```cypher
(Platform)-[:FAVORS_AESTHETIC {
  correlation: float,
  sample_size: int
}]->(Aesthetic)
```

**Example:**
```cypher
// Instagram favors minimal aesthetic (0.72 correlation)
(instagram)-[:FAVORS_AESTHETIC {correlation: 0.72, sample_size: 45}]->(minimal:Aesthetic)
```

---

### Content Similarity

**Note:** Primary similarity is in Pinecone (semantic), but top N similar can be cached in Neo4j for fast access:

```cypher
(Content)-[:SIMILAR_TO {
  similarity_score: float,
  computed_date: date
}]->(Content)
```

**Example:**
```cypher
// video-003 is similar to video-007 (0.89 similarity from Pinecone)
(video003)-[:SIMILAR_TO {similarity_score: 0.89, computed_date: date('2026-01-20')}]->(video007)
```

---

### Campaign Comparison

```cypher
(Campaign)-[:OUTPERFORMED {
  delta_roas: float,
  delta_ctr: float
}]->(Campaign)
```

**Example:**
```cypher
// campaign002 outperformed campaign001
(campaign002)-[:OUTPERFORMED {delta_roas: 1.4, delta_ctr: 0.015}]->(campaign001)
```

---

### Lead Relationships

**Leads come from campaigns:**
```cypher
(Lead)-[:CAME_FROM]->(Campaign)
```

**Leads submit forms:**
```cypher
(Lead)-[:SUBMITTED]->(WebsiteForm)
```

**Leads convert to customers:**
```cypher
(Lead)-[:CONVERTED_TO]->(Customer)
```

**Example:**
```cypher
(lead001:Lead {email: "jane@example.com"})
-[:CAME_FROM]->
(campaign001:Campaign)

(lead001)-[:SUBMITTED]->(form:WebsiteForm {form_type: "booking"})

// Later, when converted:
(lead001)-[:CONVERTED_TO {converted_at: datetime('2026-01-20T14:30:00Z')}]->(customer001:Customer)
```

---

### Purchase Attribution (E-commerce)

**Customers make purchases:**
```cypher
(Customer)-[:MADE_PURCHASE]->(Purchase)
```

**Purchases are attributed to campaigns and content:**
```cypher
(Purchase)-[:ATTRIBUTED_TO]->(Campaign)
(Purchase)-[:ATTRIBUTED_TO]->(Content)
```

**Example:**
```cypher
(customer001)-[:MADE_PURCHASE]->(purchase001:Purchase {order_total: 2400.00})
(purchase001)-[:ATTRIBUTED_TO]->(campaign001)
(purchase001)-[:ATTRIBUTED_TO]->(video003)

// Now we know: video-003 led to $2,400 purchase
// Update video-003.total_revenue, recalculate ROAS
```

---

## Constraints & Indexes

### Constraints (Uniqueness)

```cypher
// Content nodes must have unique IDs
CREATE CONSTRAINT content_id_unique IF NOT EXISTS 
FOR (c:Content) REQUIRE c.id IS UNIQUE;

// Campaigns must have unique IDs
CREATE CONSTRAINT campaign_id_unique IF NOT EXISTS 
FOR (c:Campaign) REQUIRE c.id IS UNIQUE;

// Leads must have unique IDs
CREATE CONSTRAINT lead_id_unique IF NOT EXISTS 
FOR (l:Lead) REQUIRE l.id IS UNIQUE;

// Customers must have unique email per brand
CREATE CONSTRAINT customer_email_unique IF NOT EXISTS 
FOR (c:Customer) REQUIRE (c.brand_id, c.email) IS UNIQUE;

// Shared attribute nodes must have unique names
CREATE CONSTRAINT tone_name_unique IF NOT EXISTS 
FOR (t:Tone) REQUIRE t.name IS UNIQUE;

CREATE CONSTRAINT aesthetic_name_unique IF NOT EXISTS 
FOR (a:Aesthetic) REQUIRE a.name IS UNIQUE;

CREATE CONSTRAINT platform_name_unique IF NOT EXISTS 
FOR (p:Platform) REQUIRE p.name IS UNIQUE;
```

### Indexes (Query Performance)

```cypher
// Index content by brand_id (most common filter)
CREATE INDEX content_brand_id IF NOT EXISTS 
FOR (c:Content) ON (c.brand_id);

// Index content by status (active/resting/archived)
CREATE INDEX content_status IF NOT EXISTS 
FOR (c:Content) ON (c.status);

// Index campaigns by brand_id
CREATE INDEX campaign_brand_id IF NOT EXISTS 
FOR (c:Campaign) ON (c.brand_id);

// Index campaigns by date (for temporal queries)
CREATE INDEX campaign_date IF NOT EXISTS 
FOR (c:Campaign) ON (c.date);

// Index performance by date
CREATE INDEX performance_date IF NOT EXISTS 
FOR (p:Performance) ON (p.date);

// Index leads by brand_id
CREATE INDEX lead_brand_id IF NOT EXISTS 
FOR (l:Lead) ON (l.brand_id);

// Index leads by status (new/contacted/converted)
CREATE INDEX lead_status IF NOT EXISTS 
FOR (l:Lead) ON (l.status);

// Index demographics by brand_id
CREATE INDEX demographic_brand_id IF NOT EXISTS 
FOR (d:Demographic) ON (d.brand_id);
```

---

## Common Query Patterns

### 1. Get Content Performance by Demographic

```cypher
// "How does video-003 perform with each demographic?"

MATCH (c:Content {id: "video-003", brand_id: "zen-med-clinic"})
-[:RAN_IN]->(camp:Campaign)
-[:TARGETED]->(demo:Demographic)

MATCH (camp)-[:ACHIEVED]->(perf:Performance)

RETURN demo.name AS demographic,
       avg(perf.roas) AS avg_roas,
       avg(perf.ctr) AS avg_ctr,
       sum(perf.impressions) AS total_impressions,
       sum(perf.spend) AS total_spend,
       count(camp) AS campaign_count

ORDER BY avg_roas DESC
```

### 2. Find Best-Performing Content for a Demographic

```cypher
// "What content works best with wellness-focused-women-35-50?"

MATCH (demo:Demographic {name: "wellness-focused-women-35-50", brand_id: "zen-med-clinic"})
<-[:TARGETED]-(camp:Campaign)
<-[:RAN_IN]-(content:Content)

MATCH (camp)-[:ACHIEVED]->(perf:Performance)

WITH content, avg(perf.roas) AS avg_roas, count(camp) AS sample_size

WHERE sample_size >= 3  // Need at least 3 campaigns for confidence

RETURN content.id,
       content.filename,
       content.drive_url,
       avg_roas,
       sample_size

ORDER BY avg_roas DESC
LIMIT 10
```

### 3. Identify Creative Fatigue

```cypher
// "Find content showing declining CTR over time"

MATCH (c:Content {brand_id: "zen-med-clinic"})
-[:RAN_IN]->(camp:Campaign)
-[:ACHIEVED]->(perf:Performance)

WHERE camp.date >= date() - duration({days: 14})
  AND c.status = "active"

WITH c, camp.date AS date, perf.ctr AS ctr
ORDER BY c.id, date

WITH c, collect({date: date, ctr: ctr}) AS performance_history

WHERE size(performance_history) >= 7  // Need at least 7 days

WITH c,
     performance_history[0].ctr AS early_ctr,
     performance_history[-1].ctr AS recent_ctr

WHERE recent_ctr < early_ctr * 0.70  // 30%+ decline

RETURN c.id,
       c.filename,
       c.drive_url,
       early_ctr,
       recent_ctr,
       (early_ctr - recent_ctr) / early_ctr AS decline_pct

ORDER BY decline_pct DESC
```

### 4. What Does a Demographic Respond To?

```cypher
// "What attributes does wellness-focused-women-35-50 prefer?"

MATCH (d:Demographic {name: "wellness-focused-women-35-50", brand_id: "zen-med-clinic"})
-[r:RESPONDS_TO|PREFERS_AESTHETIC]->(attr)

RETURN attr.name,
       attr.category,
       r.avg_ctr,
       r.avg_roas,
       r.sample_size

ORDER BY r.avg_roas DESC
LIMIT 10
```

### 5. Platform Performance Comparison

```cypher
// "Compare Instagram vs Facebook for this brand"

MATCH (camp:Campaign {brand_id: "zen-med-clinic"})
-[:USED_PLATFORM]->(platform:Platform)

MATCH (camp)-[:ACHIEVED]->(perf:Performance)

WHERE camp.date >= date() - duration({days: 30})

RETURN platform.name,
       sum(perf.spend) AS total_spend,
       sum(perf.impressions) AS total_impressions,
       sum(perf.clicks) AS total_clicks,
       sum(perf.conversions) AS total_conversions,
       avg(perf.roas) AS avg_roas,
       avg(perf.ctr) AS avg_ctr,
       avg(perf.cpm) AS avg_cpm

ORDER BY avg_roas DESC
```

### 6. Geographic Performance Analysis

```cypher
// "Which geographic areas perform best?"

MATCH (camp:Campaign {brand_id: "zen-med-clinic"})
-[:TARGETED_AREA]->(area:GeographicArea)

MATCH (camp)-[:ACHIEVED]->(perf:Performance)

RETURN area.name,
       area.distance_from_location_miles,
       avg(perf.roas) AS avg_roas,
       sum(perf.spend) AS total_spend,
       sum(perf.conversions) AS total_conversions

ORDER BY avg_roas DESC
```

### 7. Time-of-Day Performance

```cypher
// "When do campaigns perform best?"

MATCH (camp:Campaign {brand_id: "zen-med-clinic"})
-[:SCHEDULED_AT]->(timeslot:TimeSlot)

MATCH (camp)-[:ACHIEVED]->(perf:Performance)

RETURN timeslot.name,
       avg(perf.roas) AS avg_roas,
       avg(perf.ctr) AS avg_ctr,
       count(camp) AS campaign_count

ORDER BY avg_roas DESC
```

### 8. Lead Attribution

```cypher
// "Which campaigns generated the most leads?"

MATCH (camp:Campaign {brand_id: "zen-med-clinic"})
<-[:CAME_FROM]-(lead:Lead)

MATCH (camp)<-[:RAN_IN]-(content:Content)

RETURN camp.id,
       content.filename,
       count(lead) AS lead_count,
       avg(lead.lead_score) AS avg_lead_score,
       sum(CASE WHEN lead.status = "converted" THEN 1 ELSE 0 END) AS conversions

ORDER BY lead_count DESC
```

### 9. Purchase Attribution (E-commerce)

```cypher
// "Which content drives actual purchases?"

MATCH (content:Content {brand_id: "diamond-jeweler"})
<-[:ATTRIBUTED_TO]-(purchase:Purchase)

RETURN content.id,
       content.filename,
       count(purchase) AS purchase_count,
       sum(purchase.order_total) AS total_revenue,
       avg(purchase.order_total) AS avg_order_value

ORDER BY total_revenue DESC
```

### 10. Content Portfolio Balance

```cypher
// "What attributes are in my current active content?"

MATCH (c:Content {brand_id: "zen-med-clinic", status: "active"})
-[:HAS_TONE]->(tone:Tone)

RETURN tone.name,
       count(c) AS content_count

ORDER BY content_count DESC

// Repeat for aesthetics, color palettes, etc.
// Identify gaps: "No energetic content" or "Too much calm"
```

---

## Data Flow: How Data Gets Into Neo4j

### 1. Content Upload → Ingestion Workflow

```
User uploads video to Google Drive
  ↓
n8n: Content Ingestion Workflow
  ↓
Claude Vision API analyzes content
  ↓
Creates semantic description → Pinecone
  ↓
Creates Neo4j nodes:

MERGE (c:Content:Video {
  id: "video-003",
  brand_id: "zen-med-clinic",
  drive_id: "abc123",
  drive_url: "https://drive.google.com/...",
  filename: "acupuncture-calm.mp4",
  duration_seconds: 30,
  upload_date: date(),
  status: "active"
})

// Create relationships to attributes
MATCH (tone:Tone {name: "calm"})
MERGE (c)-[:HAS_TONE {confidence: 0.95}]->(tone)

MATCH (aesthetic:Aesthetic {name: "minimal"})
MERGE (c)-[:HAS_AESTHETIC {confidence: 0.92}]->(aesthetic)
// etc.
```

### 2. Daily Performance → Performance Analysis Workflow

```
n8n: Daily Performance Workflow runs at 2am
  ↓
Fetches yesterday's data from Google Ads, Meta APIs
  ↓
For each campaign that ran yesterday:

MATCH (camp:Campaign {id: "campaign_20260115_001"})

CREATE (perf:Performance {
  id: "perf_20260115_001",
  date: date('2026-01-15'),
  impressions: 12500,
  clicks: 525,
  conversions: 22,
  spend: 315.00,
  revenue: 1323.00,
  ctr: 0.042,
  roas: 4.2
  // ... all metrics
})

MERGE (camp)-[:ACHIEVED]->(perf)

// Update content aggregate metrics
MATCH (c:Content)<-[:RAN_IN]-(camp)
SET c.total_impressions = c.total_impressions + 12500,
    c.total_spend = c.total_spend + 315.00,
    c.avg_roas = ... // recalculate across all campaigns
```

### 3. Learn & Remember → Update Relationship Weights

```
n8n: Learn & Remember Workflow
  ↓
After analyzing performance patterns:

// Update demographic preferences
MATCH (demo:Demographic {name: "wellness-focused-women-35-50"})
MATCH (tone:Tone {name: "calm"})

MERGE (demo)-[r:RESPONDS_TO]->(tone)
SET r.avg_ctr = 0.041,
    r.avg_roas = 4.0,
    r.sample_size = 15,
    r.last_updated = date()
```

### 4. Website Form → Lead Creation

```
User submits booking form on website
  ↓
Website backend → n8n webhook
  ↓
n8n: Form Ingestion Workflow

CREATE (lead:Lead {
  id: "lead_20260115_001",
  brand_id: "zen-med-clinic",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(650) 555-0123",
  source: "website-booking-form",
  source_campaign: "campaign_20260115_001",
  created_at: datetime()
})

CREATE (form:WebsiteForm {
  form_type: "booking",
  submitted_at: datetime(),
  utm_source: "instagram"
})

MERGE (lead)-[:SUBMITTED]->(form)

// Link to campaign
MATCH (camp:Campaign {id: "campaign_20260115_001"})
MERGE (lead)-[:CAME_FROM]->(camp)
```

---

## First Spawn Initialization

### Database Schema Agent Responsibilities

On first spawn, create:

**1. Constraints and Indexes:**
Run all constraint and index creation queries listed above.

**2. Shared Attribute Nodes:**
```cypher
// Create shared tone nodes
CREATE (:Tone {name: "calm", category: "emotional"})
CREATE (:Tone {name: "professional", category: "emotional"})
CREATE (:Tone {name: "reassuring", category: "emotional"})
CREATE (:Tone {name: "energetic", category: "emotional"})
CREATE (:Tone {name: "playful", category: "emotional"})
CREATE (:Tone {name: "aspirational", category: "emotional"})
CREATE (:Tone {name: "educational", category: "emotional"})
CREATE (:Tone {name: "urgent", category: "emotional"})

// Create shared aesthetic nodes
CREATE (:Aesthetic {name: "minimal", category: "visual"})
CREATE (:Aesthetic {name: "intimate", category: "visual"})
CREATE (:Aesthetic {name: "modern", category: "visual"})
CREATE (:Aesthetic {name: "luxurious", category: "visual"})
CREATE (:Aesthetic {name: "rustic", category: "visual"})
CREATE (:Aesthetic {name: "vibrant", category: "visual"})
CREATE (:Aesthetic {name: "clean", category: "visual"})

// Create color palette nodes
CREATE (:ColorPalette {name: "warm-tones", category: "color"})
CREATE (:ColorPalette {name: "cool-tones", category: "color"})
CREATE (:ColorPalette {name: "earth-tones", category: "color"})
CREATE (:ColorPalette {name: "vibrant", category: "color"})
CREATE (:ColorPalette {name: "pastel", category: "color"})
CREATE (:ColorPalette {name: "monochrome", category: "color"})

// Create platform nodes
CREATE (:Platform {name: "instagram", type: "social"})
CREATE (:Platform {name: "facebook", type: "social"})
CREATE (:Platform {name: "google-search", type: "search"})
CREATE (:Platform {name: "google-display", type: "display"})
CREATE (:Platform {name: "tiktok", type: "social"})
CREATE (:Platform {name: "linkedin", type: "social"})

// Create time slot nodes
CREATE (:TimeSlot {
  name: "weekday-morning",
  day_types: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  hours: [6, 7, 8, 9, 10, 11]
})
CREATE (:TimeSlot {
  name: "weekday-afternoon",
  day_types: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  hours: [12, 13, 14, 15, 16, 17]
})
CREATE (:TimeSlot {
  name: "weekday-evening",
  day_types: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  hours: [18, 19, 20, 21]
})
CREATE (:TimeSlot {
  name: "weekday-night",
  day_types: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  hours: [22, 23, 0, 1, 2, 3, 4, 5]
})
CREATE (:TimeSlot {
  name: "weekend-morning",
  day_types: ["saturday", "sunday"],
  hours: [8, 9, 10, 11]
})
CREATE (:TimeSlot {
  name: "weekend-afternoon",
  day_types: ["saturday", "sunday"],
  hours: [12, 13, 14, 15, 16, 17]
})
CREATE (:TimeSlot {
  name: "weekend-evening",
  day_types: ["saturday", "sunday"],
  hours: [18, 19, 20, 21]
})

// Create composition nodes
CREATE (:Composition {name: "close-up", category: "technical"})
CREATE (:Composition {name: "medium-shot", category: "technical"})
CREATE (:Composition {name: "wide-shot", category: "technical"})
CREATE (:Composition {name: "steady-cam", category: "technical"})
CREATE (:Composition {name: "handheld", category: "technical"})
CREATE (:Composition {name: "dynamic", category: "technical"})

// Create narrative element nodes
CREATE (:NarrativeElement {name: "shows-physical-space", category: "narrative"})
CREATE (:NarrativeElement {name: "shows-people", category: "narrative"})
CREATE (:NarrativeElement {name: "testimonial", category: "narrative"})
CREATE (:NarrativeElement {name: "product-demo", category: "narrative"})
CREATE (:NarrativeElement {name: "before-after", category: "narrative"})
CREATE (:NarrativeElement {name: "educational", category: "narrative"})
CREATE (:NarrativeElement {name: "local-landmark", category: "narrative"})
```

**3. Document Schema:**
Save complete node/relationship documentation to:
`/marketing-factory/system-knowledge/database-schemas/neo4j-graph-schema.md`

**4. Document Query Patterns:**
Save common query examples to:
`/marketing-factory/system-knowledge/database-schemas/neo4j-query-patterns.md`

---

## Subsequent Spawns

For each new client:

**1. No new shared nodes needed** (tones, platforms, etc. already exist)

**2. Just create client-specific nodes:**
```cypher
// Create demographic nodes for new client
CREATE (:Demographic {
  name: "wellness-focused-women-35-50",
  brand_id: "new-client-id",
  age_min: 35,
  age_max: 50,
  // ...
})

// Create geographic area nodes
CREATE (:GeographicArea {
  name: "5-10mi",
  brand_id: "new-client-id",
  distance_from_location_miles: 7.5
})
```

**3. Content, campaigns, performance nodes created dynamically** as system runs.

---

## Backup & Maintenance

### Regular Backups
```bash
# Export entire database
neo4j-admin dump --database=marketing-automation --to=/backups/backup-2026-02-01.dump

# Or use Neo4j's built-in backup (AuraDB handles automatically)
```

### Cleanup Old Data
```cypher
// Archive performance data older than 1 year
MATCH (p:Performance)
WHERE p.date < date() - duration({years: 1})
DETACH DELETE p

// Archive old leads
MATCH (l:Lead)
WHERE l.status = "lost" 
  AND l.created_at < datetime() - duration({months: 6})
DETACH DELETE l
```

### Optimize Queries
```cypher
// Explain query to see execution plan
EXPLAIN
MATCH (c:Content {brand_id: "zen-med-clinic"})-[:RAN_IN]->(camp)
RETURN c, camp

// Profile to see actual performance
PROFILE
MATCH (c:Content {brand_id: "zen-med-clinic"})-[:RAN_IN]->(camp)
RETURN c, camp
```

---

## Cost Estimation

**Neo4j AuraDB Free Tier:**
- 1 database
- 200k nodes + relationships
- 50MB storage
- Good for 5-10 clients initially

**Neo4j AuraDB Professional:**
- $65/month (smallest instance)
- 2M nodes + relationships
- 8GB storage
- Good for 50-100 clients

**Total Monthly Cost (20 clients on AuraDB Free):**
- Neo4j: Free tier
- **Total: $0/month**

---

## Security

### Authentication
```python
# Store in environment variables
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

from neo4j import GraphDatabase
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
```

### Data Isolation
- All client data has `brand_id` property
- Queries must always filter by `brand_id`
- Prevents accidental cross-client data access

### Example Safe Query Pattern
```python
def get_content_for_brand(brand_id: str):
    query = """
    MATCH (c:Content {brand_id: $brand_id})
    WHERE c.status = 'active'
    RETURN c
    """
    with driver.session() as session:
        result = session.run(query, brand_id=brand_id)
        return [record["c"] for record in result]
```
```