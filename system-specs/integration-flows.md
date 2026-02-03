# Integration Flows & Data Movement Patterns

## Overview

This document describes how data flows between all system components: n8n workflows, Neo4j, Pinecone, dashboard (Next.js + FastAPI), website (Next.js + FastAPI), ad platforms, and external services.

**Key Principle:** Data flows in clear, unidirectional patterns with well-defined handoff points. Each component has a specific responsibility and communicates via HTTP APIs or webhooks.

---

## System Component Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Google   │  │   Meta   │  │  Claude  │  │  Google  │           │
│  │  Ads     │  │Marketing │  │   API    │  │  Drive   │           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
└───────┼─────────────┼─────────────┼──────────────┼──────────────────┘
        │             │             │              │
        │             │             │              │
        └─────────────┴─────────────┴──────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        n8n WORKFLOWS                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │  Content    │  │   Daily     │  │   Weekly    │                │
│  │ Ingestion   │  │Performance  │  │  Strategy   │  + 6 more      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                │
└─────────┼─────────────────┼─────────────────┼──────────────────────┘
          │                 │                 │
          │                 │                 │
          ↓                 ↓                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                     │
│  ┌─────────────────────┐        ┌─────────────────────┐            │
│  │     Pinecone        │        │       Neo4j         │            │
│  │  (Vector Memory)    │        │  (Graph Database)   │            │
│  │                     │        │                     │            │
│  │ • content-essence   │        │ • Content nodes     │            │
│  │ • scenario-outcomes │        │ • Campaign nodes    │            │
│  │ • psychographics    │        │ • Performance       │            │
│  └──────────┬──────────┘        └──────────┬──────────┘            │
└─────────────┼──────────────────────────────┼──────────────────────┘
              │                              │
              │                              │
              └──────────────┬───────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                              │
│  ┌─────────────────────┐        ┌─────────────────────┐            │
│  │   Dashboard API     │        │   Website API       │            │
│  │    (FastAPI)        │        │    (FastAPI)        │            │
│  └──────────┬──────────┘        └──────────┬──────────┘            │
│             │                              │                        │
│  ┌──────────▼──────────┐        ┌─────────▼──────────┐            │
│  │  Dashboard Frontend │        │  Website Frontend  │            │
│  │    (Next.js)        │        │    (Next.js)       │            │
│  └─────────────────────┘        └────────────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ↓
                       ┌──────────┐
                       │   USER   │
                       └──────────┘
```

---

## Flow 1: Content Upload & Analysis

**Trigger:** User uploads video/image to Google Drive

### Detailed Flow

```
1. User uploads file to Google Drive folder: /clients/{brand-id}/content/
   │
   ↓
2. Google Drive API fires event
   │
   ↓
3. n8n: Content Ingestion Workflow (triggered)
   │
   ├─→ Node: Google Drive Trigger
   │   Output: {file_id, filename, drive_url, mime_type, created_time}
   │
   ├─→ Node: Download File Temporarily
   │   Action: Download file to /tmp/{file_id}
   │   Why: Claude API needs actual file, not URL
   │
   ├─→ Node: Claude Vision API
   │   Input: File (base64)
   │   Prompt: "Analyze this content for marketing..."
   │   Output: {
   │     emotional_tones: [{name: "calm", confidence: 0.95}, ...],
   │     visual_aesthetics: [{name: "minimal", confidence: 0.92}, ...],
   │     color_palette: {...},
   │     composition: {...},
   │     narrative_elements: {...},
   │     semantic_description: "A 30-second vertical video..."
   │   }
   │
   ├─→ Node: Generate Content ID
   │   Logic: content_id = `${type}-${timestamp}`
   │   Output: {content_id: "video-003"}
   │
   ├─→ Node: Create Embedding (OpenAI)
   │   Input: semantic_description
   │   Output: {embedding: [0.234, -0.891, ...]}  // 1536 dimensions
   │
   ├─→ Node: Store in Pinecone
   │   API: POST https://pinecone.io/vectors/upsert
   │   Body: {
   │     vectors: [{
   │       id: "content_video-003_zen-med-clinic",
   │       values: [embedding],
   │       metadata: {
   │         content_id: "video-003",
   │         brand_id: "zen-med-clinic",
   │         emotional_tones: ["calm", "professional"],
   │         tone_confidences: [0.95, 0.82],
   │         visual_aesthetics: ["minimal", "intimate"],
   │         // ... all metadata
   │         total_impressions: 0,
   │         avg_roas: 0,
   │         status: "active"
   │       }
   │     }],
   │     namespace: "content-essence-zen-med-clinic"
   │   }
   │
   ├─→ Node: Create Content Node (Neo4j)
   │   Cypher: MERGE (c:Content:Video {
   │     id: "video-003",
   │     brand_id: "zen-med-clinic",
   │     drive_id: "abc123",
   │     drive_url: "https://drive.google.com/...",
   │     filename: "acupuncture-calm.mp4",
   │     status: "active",
   │     upload_date: date(),
   │     created_at: datetime()
   │   })
   │
   ├─→ Node: Create Attribute Relationships (Neo4j)
   │   Loop through tones, aesthetics, colors, composition:
   │   
   │   For each tone:
   │   Cypher: MATCH (c:Content {id: "video-003"})
   │           MATCH (t:Tone {name: "calm"})
   │           MERGE (c)-[:HAS_TONE {confidence: 0.95}]->(t)
   │   
   │   For each aesthetic:
   │   Cypher: MATCH (c:Content {id: "video-003"})
   │           MATCH (a:Aesthetic {name: "minimal"})
   │           MERGE (c)-[:HAS_AESTHETIC {confidence: 0.92}]->(a)
   │   
   │   // Similar for colors, composition, narrative elements
   │
   ├─→ Node: Delete Temporary File
   │   Action: fs.unlinkSync(`/tmp/${file_id}`)
   │
   └─→ Node: Notify Dashboard
       API: POST https://dashboard.zenmedclinic.com/api/webhooks/content-uploaded
       Body: {
         content_id: "video-003",
         filename: "acupuncture-calm.mp4",
         drive_url: "https://drive.google.com/...",
         status: "ready",
         analysis_summary: {
           tones: ["calm", "professional"],
           aesthetics: ["minimal", "intimate"]
         },
         timestamp: "2026-02-03T10:30:00Z"
       }
```

### Data State After Flow

**Pinecone:**
```json
{
  "namespace": "content-essence-zen-med-clinic",
  "vectors": {
    "content_video-003_zen-med-clinic": {
      "values": [0.234, -0.891, ...],
      "metadata": {
        "content_id": "video-003",
        "emotional_tones": ["calm", "professional"],
        "total_impressions": 0,
        "avg_roas": 0,
        "status": "active"
      }
    }
  }
}
```

**Neo4j:**
```cypher
// Nodes created:
(video:Content:Video {id: "video-003", brand_id: "zen-med-clinic", ...})

// Relationships created:
(video)-[:HAS_TONE {confidence: 0.95}]->(calm:Tone {name: "calm"})
(video)-[:HAS_TONE {confidence: 0.82}]->(professional:Tone {name: "professional"})
(video)-[:HAS_AESTHETIC {confidence: 0.92}]->(minimal:Aesthetic {name: "minimal"})
// ... etc
```

**Dashboard State:**
- New content card appears in content library
- Status: "Ready"
- Can now be used in campaigns

---

## Flow 2: Daily Performance Analysis & Optimization

**Trigger:** Cron (daily at 2:00 AM)

### Detailed Flow

```
1. n8n: Daily Performance Workflow (cron triggered)
   │
   ├─→ Node: Set Date Variables
   │   Output: {yesterday: "2026-02-02", seven_days_ago: "2026-01-26"}
   │
   ├─→ Node: Fetch Google Ads Performance
   │   API: Google Ads API
   │   Request: Get campaign performance for yesterday
   │   Output: [{
   │     campaign_id: "campaign-001",
   │     platform: "google-search",
   │     impressions: 5200,
   │     clicks: 189,
   │     conversions: 12,
   │     spend: 142.50,
   │     revenue: 600.00
   │   }, ...]
   │
   ├─→ Node: Fetch Meta Ads Performance
   │   API: Meta Marketing API
   │   Request: Get campaign insights for yesterday
   │   Output: [{
   │     campaign_id: "campaign-002",
   │     platform: "instagram",
   │     impressions: 12500,
   │     clicks: 525,
   │     conversions: 22,
   │     spend: 315.00,
   │     revenue: 1323.00
   │   }, ...]
   │
   ├─→ Node: Merge Performance Data
   │   Logic: Combine Google + Meta data
   │         Calculate: ROAS = revenue / spend
   │                   CTR = clicks / impressions
   │                   Conversion rate = conversions / clicks
   │   Output: Combined array with all metrics
   │
   ├─→ Node: Store Performance in Neo4j
   │   For each campaign:
   │   
   │   Cypher: MATCH (camp:Campaign {id: $campaign_id})
   │           CREATE (perf:Performance {
   │             id: "perf_2026-02-02_campaign-001",
   │             date: date("2026-02-02"),
   │             impressions: 5200,
   │             clicks: 189,
   │             conversions: 12,
   │             spend: 142.50,
   │             revenue: 600.00,
   │             roas: 4.21,
   │             ctr: 0.036,
   │             conversion_rate: 0.063
   │           })
   │           MERGE (camp)-[:ACHIEVED]->(perf)
   │           
   │           // Update content aggregate metrics
   │           WITH camp
   │           MATCH (c:Content)<-[:RAN_IN]-(camp)
   │           SET c.total_impressions = c.total_impressions + 5200,
   │               c.total_spend = c.total_spend + 142.50,
   │               c.updated_at = datetime()
   │
   ├─→ Node: Recalculate Content Avg ROAS
   │   Cypher: MATCH (c:Content {brand_id: "zen-med-clinic"})
   │           -[:RAN_IN]->(camp:Campaign)
   │           -[:ACHIEVED]->(perf:Performance)
   │           WITH c, avg(perf.roas) AS avgRoas
   │           SET c.avg_roas = avgRoas
   │
   ├─→ Node: Generate Scenario Description
   │   Logic: Create text describing current situation
   │   Output: "Current campaign performance for zen-med-clinic:
   │            Instagram: 4.2 ROAS, Facebook: 2.1 ROAS, Google: 4.0 ROAS
   │            Total spend: $457.50, Total conversions: 34
   │            Analyzing budget allocation..."
   │
   ├─→ Node: Create Scenario Embedding
   │   API: OpenAI Embeddings
   │   Input: scenario_description
   │   Output: {embedding: [0.123, 0.456, ...]}
   │
   ├─→ Node: Query Similar Scenarios (Pinecone)
   │   API: POST https://pinecone.io/query
   │   Body: {
   │     namespace: "scenario-outcomes-zen-med-clinic",
   │     vector: [0.123, 0.456, ...],
   │     topK: 10,
   │     includeMetadata: true
   │   }
   │   Output: [{
   │     id: "scenario_20260115_001",
   │     score: 0.89,
   │     metadata: {
   │       platform: "instagram",
   │       roas: 4.5,
   │       action_taken: "increased_budget",
   │       outcome: "positive"
   │     }
   │   }, ...]
   │
   ├─→ Node: CSO Agent (Claude API)
   │   API: POST https://api.anthropic.com/v1/messages
   │   System Prompt: [Load from /automation/prompts/chief-strategy-officer.md]
   │   User Message: "Analyze yesterday's performance and make decisions.
   │                   Current Performance: {performance_data}
   │                   Similar Past Scenarios: {similar_scenarios}
   │                   Brand Config: {brand_config}
   │                   
   │                   Provide recommendations in JSON:
   │                   {
   │                     summary: '...',
   │                     decisions: [{
   │                       type: 'budget_shift',
   │                       action: '...',
   │                       reasoning: '...',
   │                       confidence: 0.85
   │                     }],
   │                     alerts: [...]
   │                   }"
   │   
   │   Output: {
   │     summary: "Strong performance day. Instagram significantly outperforming Facebook.",
   │     decisions: [{
   │       type: "budget_shift",
   │       action: "Shift $50/day from Facebook to Instagram",
   │       reasoning: "Instagram ROAS (4.2) is 2x Facebook (2.1). Similar scenarios showed 18% ROAS improvement.",
   │       confidence: 0.87,
   │       from_platform: "facebook",
   │       to_platform: "instagram",
   │       amount: 50
   │     }],
   │     alerts: [{
   │       type: "opportunity",
   │       message: "Consider scaling Instagram further if ROAS maintains above 4.0"
   │     }]
   │   }
   │
   ├─→ Node: Execute Budget Shift (Switch)
   │   Branch: If decision.type === "budget_shift"
   │   
   │   ├─→ Update Google Ads Budget
   │   │   API: Google Ads API
   │   │   Action: Update campaign daily budget
   │   │
   │   └─→ Update Meta Ads Budget
   │       API: Meta Marketing API
   │       Action: Update campaign daily budget
   │
   ├─→ Node: Update Pinecone Content Metadata
   │   For each content that ran yesterday:
   │   
   │   API: POST https://pinecone.io/vectors/update
   │   Body: {
   │     id: "content_video-003_zen-med-clinic",
   │     setMetadata: {
   │       total_impressions: 45000,  // incremented
   │       total_spend: 1250.50,      // incremented
   │       avg_roas: 4.1,             // recalculated
   │       last_used_date: "2026-02-02"
   │     },
   │     namespace: "content-essence-zen-med-clinic"
   │   }
   │
   ├─→ Node: Log Decision in Neo4j
   │   Cypher: CREATE (d:Decision {
   │             id: "decision_20260203_001",
   │             type: "budget_shift",
   │             made_by: "CSO Agent",
   │             action: "Shift $50/day from Facebook to Instagram",
   │             reasoning: "...",
   │             confidence: 0.87,
   │             made_at: datetime()
   │           })
   │
   └─→ Node: Send to Dashboard
       API: POST https://dashboard.zenmedclinic.com/api/webhooks/daily-analysis
       Body: {
         date: "2026-02-02",
         summary: "Strong performance day...",
         decisions: [...],
         alerts: [...],
         performance: [...]
       }
```

### Data State After Flow

**Neo4j:**
```cypher
// New Performance nodes created
(:Performance {date: date("2026-02-02"), roas: 4.2, ...})

// Content metrics updated
(:Content {id: "video-003", total_impressions: 45000, avg_roas: 4.1})

// Decision logged
(:Decision {type: "budget_shift", action: "Shift $50/day...", confidence: 0.87})
```

**Pinecone:**
```json
// Content metadata updated
{
  "content_video-003_zen-med-clinic": {
    "metadata": {
      "total_impressions": 45000,  // was 32500
      "total_spend": 1250.50,      // was 935.50
      "avg_roas": 4.1,             // recalculated
      "last_used_date": "2026-02-02"
    }
  }
}
```

**Ad Platforms:**
- Facebook campaign budget: $85/day → $35/day
- Instagram campaign budget: $100/day → $150/day

**Dashboard:**
- Displays new performance metrics
- Shows AI narrative: "Strong performance day..."
- Lists decisions made
- Updates charts with latest data

---

## Flow 3: Website Form Submission → Lead Scoring → Dashboard

**Trigger:** User submits booking form on website

### Detailed Flow

```
1. User fills out form on website: /book-appointment
   Form data: {
     name: "Jane Doe",
     email: "jane@example.com",
     phone: "(650) 555-1234",
     service: "acupuncture",
     preferredDate: "2026-02-10",
     message: "Chronic lower back pain for 6 months..."
   }
   │
   ↓
2. Website Frontend (Next.js)
   Event: form.onSubmit
   
   Action: Extract UTM parameters from URL
   const utmParams = {
     source: urlParams.get('utm_source'),      // "instagram"
     medium: urlParams.get('utm_medium'),      // "cpc"
     campaign: urlParams.get('utm_campaign'),  // "awareness-001"
     content: urlParams.get('utm_content')     // "video-003"
   }
   
   Action: POST to backend
   │
   ↓
3. Website Backend API (FastAPI)
   Endpoint: POST /api/forms/booking
   
   Validation: Pydantic schema validates form data
   
   If validation fails → Return 400 error
   If validation passes → Continue
   │
   ↓
4. Website Backend → n8n Webhook
   API: POST https://n8n.yourserver.com/webhook/zen-med-clinic/form-submission
   Body: {
     form_type: "booking",
     data: {
       name: "Jane Doe",
       email: "jane@example.com",
       phone: "(650) 555-1234",
       service: "acupuncture",
       preferredDate: "2026-02-10",
       preferredTime: "afternoon",
       message: "Chronic lower back pain for 6 months...",
       source: "website-booking-form",
       campaign: "awareness-001",
       utmParams: {
         source: "instagram",
         medium: "cpc",
         campaign: "awareness-001"
       },
       referrer: "https://instagram.com",
       submittedAt: "2026-02-03T14:30:00Z"
     }
   }
   │
   ↓
5. n8n: Form Ingestion Workflow (webhook triggered)
   │
   ├─→ Node: Validate Webhook Data
   │   Check: All required fields present
   │
   ├─→ Node: Generate Lead ID
   │   Logic: lead_id = `lead_${timestamp}_${random()}`
   │   Output: {lead_id: "lead_20260203_001"}
   │
   ├─→ Node: Create Lead Node (Neo4j)
   │   Cypher: CREATE (l:Lead {
   │             id: "lead_20260203_001",
   │             brand_id: "zen-med-clinic",
   │             name: "Jane Doe",
   │             email: "jane@example.com",
   │             phone: "(650) 555-1234",
   │             service_interest: "acupuncture",
   │             message: "Chronic lower back pain...",
   │             source: "website-booking-form",
   │             source_campaign: "awareness-001",
   │             status: "new",
   │             created_at: datetime()
   │           })
   │
   ├─→ Node: Create Form Node (Neo4j)
   │   Cypher: CREATE (f:WebsiteForm {
   │             form_type: "booking",
   │             submitted_at: datetime(),
   │             utm_source: "instagram",
   │             utm_medium: "cpc",
   │             utm_campaign: "awareness-001",
   │             referrer: "https://instagram.com"
   │           })
   │
   ├─→ Node: Link Lead to Form (Neo4j)
   │   Cypher: MATCH (l:Lead {id: "lead_20260203_001"})
   │           MATCH (f:WebsiteForm {submitted_at: datetime()})
   │           MERGE (l)-[:SUBMITTED]->(f)
   │
   ├─→ Node: Link Lead to Campaign (Neo4j)
   │   Cypher: MATCH (l:Lead {id: "lead_20260203_001"})
   │           MATCH (camp:Campaign {id: "awareness-001"})
   │           MERGE (l)-[:CAME_FROM]->(camp)
   │
   ├─→ Node: Lead Scoring Agent (Claude API)
   │   API: POST https://api.anthropic.com/v1/messages
   │   System Prompt: "You are a lead scoring specialist..."
   │   User Message: "Analyze this lead and assign score 0-100:
   │                   
   │                   Form Data:
   │                   - Name: Jane Doe
   │                   - Service: acupuncture
   │                   - Message: 'Chronic lower back pain for 6 months...'
   │                   - Source: Instagram ad (awareness campaign)
   │                   
   │                   Context:
   │                   - Brand: Zen Med Clinic (acupuncture)
   │                   - Avg customer value: $500
   │                   
   │                   Score based on:
   │                   1. Specificity of need (chronic pain = specific)
   │                   2. Message quality (detailed)
   │                   3. Urgency (6 months = moderate)
   │                   4. Source quality (paid social)
   │                   5. Contact info completeness (all provided)
   │                   
   │                   Return JSON:
   │                   {
   │                     score: 85,
   │                     tier: 'hot|warm|cold',
   │                     reasoning: '...',
   │                     recommended_action: '...'
   │                   }"
   │   
   │   Output: {
   │     score: 85,
   │     tier: "warm",
   │     reasoning: "Specific chronic pain issue with 6-month history shows genuine need. Detailed message indicates serious interest. Good source quality. Missing: immediate urgency.",
   │     recommended_action: "Call within 24 hours. Emphasize pain relief success stories."
   │   }
   │
   ├─→ Node: Update Lead with Score (Neo4j)
   │   Cypher: MATCH (l:Lead {id: "lead_20260203_001"})
   │           SET l.lead_score = 85,
   │               l.score_reasoning = "Specific chronic pain...",
   │               l.tier = "warm"
   │
   ├─→ Node: Route by Score (Switch)
   │   
   │   Branch 1: If score >= 90 (HOT)
   │   ├─→ Send SMS to Owner
   │   │   Service: Twilio
   │   │   Message: "🔥 Hot lead: Jane Doe wants acupuncture for chronic back pain. Call: (650) 555-1234"
   │   │
   │   └─→ Send Email to Owner
   │       Service: SendGrid
   │       Subject: "Hot Lead: Jane Doe - Acupuncture"
   │       Body: [Lead details with score + reasoning]
   │   
   │   Branch 2: If score 70-89 (WARM)
   │   └─→ Send Email to Owner
   │       Service: SendGrid
   │       Subject: "New Lead: Jane Doe - Acupuncture"
   │       Body: [Lead details]
   │   
   │   Branch 3: If score 50-69 (COLD)
   │   └─→ Add to Newsletter Sequence
   │       Service: Mailchimp/SendGrid
   │       Action: Add to nurture sequence
   │
   ├─→ Node: Send Confirmation Email to Lead
   │   Service: SendGrid
   │   To: jane@example.com
   │   Subject: "We received your appointment request"
   │   Body: "Thank you, Jane! We'll contact you within 24 hours..."
   │
   ├─→ Node: Add to Retargeting Audience
   │   Branch 1: Meta Pixel
   │   API: Meta Conversions API
   │   Event: "Lead"
   │   
   │   Branch 2: Google Ads
   │   API: Google Ads Customer Match
   │   Action: Add email to remarketing list
   │
   └─→ Node: Notify Dashboard
       API: POST https://dashboard.zenmedclinic.com/api/webhooks/new-lead
       Body: {
         lead_id: "lead_20260203_001",
         name: "Jane Doe",
         email: "jane@example.com",
         service: "acupuncture",
         score: 85,
         tier: "warm",
         source: "instagram",
         campaign: "awareness-001",
         timestamp: "2026-02-03T14:30:00Z"
       }
```

### Data State After Flow

**Neo4j:**
```cypher
// Lead node created
(lead:Lead {
  id: "lead_20260203_001",
  email: "jane@example.com",
  lead_score: 85,
  tier: "warm",
  status: "new"
})

// Form node created
(form:WebsiteForm {form_type: "booking", utm_source: "instagram"})

// Relationships created
(lead)-[:SUBMITTED]->(form)
(lead)-[:CAME_FROM]->(campaign:Campaign {id: "awareness-001"})
```

**Dashboard:**
- New lead alert appears
- Lead card shows: Jane Doe, Score: 85, Tier: Warm
- Attribution shown: Instagram → awareness-001 → video-003

**Notifications Sent:**
- Email to business owner: "New Lead: Jane Doe"
- Email to lead: "We received your appointment request"

**Retargeting:**
- jane@example.com added to Facebook Custom Audience
- jane@example.com added to Google Customer Match list

---

## Flow 4: Purchase Attribution (E-commerce)

**Trigger:** Customer completes purchase on Shopify

### Detailed Flow

```
1. Customer completes checkout on Shopify
   Order: {
     order_id: "12345",
     customer_email: "sarah@example.com",
     total_price: 2400.00,
     items: [{product_id: "ring-001", title: "Ethereal Diamond Ring"}]
   }
   │
   ↓
2. Shopify → Webhook fires
   Event: orders/create
   URL: https://api.etherealjewelry.com/api/webhooks/shopify/orders/create
   │
   ↓
3. Website Backend API (FastAPI)
   Endpoint: POST /api/webhooks/shopify/orders/create
   
   Action: Verify webhook signature (HMAC)
   If invalid → Return 401
   If valid → Continue
   │
   ↓
4. Website Backend → n8n Webhook
   API: POST https://n8n.yourserver.com/webhook/ethereal-jewelry/shopify-order
   Body: {
     order_id: "12345",
     order_number: "#1001",
     customer_email: "sarah@example.com",
     customer_name: "Sarah Johnson",
     total_price: 2400.00,
     line_items: [{
       product_id: "ring-001",
       title: "Ethereal Diamond Ring",
       price: 2400.00,
       quantity: 1
     }],
     created_at: "2026-02-03T15:45:00Z",
     landing_site: "/product/ethereal-ring?utm_source=instagram",
     referring_site: "https://instagram.com"
   }
   │
   ↓
5. n8n: Shopify Integration Workflow (webhook triggered)
   │
   ├─→ Node: Parse Order Data
   │   Extract: email, order_id, total_price, products
   │
   ├─→ Node: Query Neo4j - Find Matching Lead
   │   Cypher: MATCH (l:Lead {
   │             email: "sarah@example.com",
   │             brand_id: "ethereal-jewelry"
   │           })
   │           RETURN l
   │   
   │   Result: Lead found (submitted custom consultation form 2 weeks ago)
   │   OR: Lead not found (organic purchase, no prior form submission)
   │
   ├─→ Node: Branch - Lead Found?
   │   
   │   IF LEAD NOT FOUND:
   │   ├─→ Create Customer Node
   │   │   Cypher: CREATE (c:Customer {
   │   │             email: "sarah@example.com",
   │   │             brand_id: "ethereal-jewelry",
   │   │             name: "Sarah Johnson",
   │   │             first_purchase_date: date()
   │   │           })
   │   │
   │   └─→ Create Purchase Node (No Attribution)
   │       Cypher: CREATE (p:Purchase {
   │                 id: "purchase_12345",
   │                 order_id: "12345",
   │                 order_total: 2400.00,
   │                 source: "organic"
   │               })
   │       → Skip to Step 10 (No attribution possible)
   │   
   │   IF LEAD FOUND:
   │   ├─→ Query Neo4j - Trace to Campaign
   │   │   Cypher: MATCH (l:Lead {email: "sarah@example.com"})
   │   │           -[:CAME_FROM]->(camp:Campaign)
   │   │           MATCH (camp)<-[:RAN_IN]-(content:Content)
   │   │           RETURN camp.id AS campaign_id,
   │   │                  content.id AS content_id
   │   │   
   │   │   Result: {
   │   │     campaign_id: "engagement-rings-001",
   │   │     content_id: "image-015"
   │   │   }
   │   │
   │   ├─→ Create Customer Node (if doesn't exist)
   │   │   Cypher: MERGE (c:Customer {
   │   │             email: "sarah@example.com",
   │   │             brand_id: "ethereal-jewelry"
   │   │           })
   │   │           ON CREATE SET c.name = "Sarah Johnson",
   │   │                         c.first_purchase_date = date()
   │   │
   │   ├─→ Link Lead to Customer
   │   │   Cypher: MATCH (l:Lead {email: "sarah@example.com"})
   │   │           MATCH (c:Customer {email: "sarah@example.com"})
   │   │           MERGE (l)-[:CONVERTED_TO {
   │   │             converted_at: datetime()
   │   │           }]->(c)
   │   │           SET l.status = "converted",
   │   │               l.converted_at = datetime()
   │   │
   │   ├─→ Create Purchase Node
   │   │   Cypher: CREATE (p:Purchase {
   │   │             id: "purchase_12345",
   │   │             brand_id: "ethereal-jewelry",
   │   │             order_id: "12345",
   │   │             order_total: 2400.00,
   │   │             product_names: ["Ethereal Diamond Ring"],
   │   │             purchase_date: datetime(),
   │   │             source: "instagram"
   │   │           })
   │   │
   │   ├─→ Create Attribution Relationships
   │   │   Cypher: MATCH (p:Purchase {id: "purchase_12345"})
   │   │           MATCH (c:Customer {email: "sarah@example.com"})
   │   │           MATCH (camp:Campaign {id: "engagement-rings-001"})
   │   │           MATCH (content:Content {id: "image-015"})
   │   │           
   │   │           MERGE (c)-[:MADE_PURCHASE]->(p)
   │   │           MERGE (p)-[:ATTRIBUTED_TO]->(camp)
   │   │           MERGE (p)-[:ATTRIBUTED_TO]->(content)
   │   │
   │   ├─→ Update Content Revenue & ROAS
   │   │   Cypher: MATCH (c:Content {id: "image-015"})
   │   │           SET c.total_revenue = coalesce(c.total_revenue, 0) + 2400.00
   │   │           
   │   │           WITH c
   │   │           MATCH (c)-[:RAN_IN]->()-[:ACHIEVED]->(perf:Performance)
   │   │           WITH c, 
   │   │                sum(perf.spend) AS total_spend,
   │   │                c.total_revenue AS total_revenue
   │   │           SET c.true_roas = total_revenue / total_spend
   │   │   
   │   │   Result: 
   │   │   - c.total_revenue: $0 → $2,400
   │   │   - c.true_roas: If spent $400 on this content, ROAS = 6.0x
   │   │
   │   ├─→ Update Pinecone Content Metadata
   │   │   API: POST https://pinecone.io/vectors/update
   │   │   Body: {
   │   │     id: "content_image-015_ethereal-jewelry",
   │   │     setMetadata: {
   │   │       total_revenue: 2400.00,
   │   │       true_roas: 6.0,
   │   │       last_purchase_date: "2026-02-03"
   │   │     },
   │   │     namespace: "content-essence-ethereal-jewelry"
   │   │   }
   │   │
   │   ├─→ CSO Agent: Analyze Purchase Impact
   │   │   API: Claude API
   │   │   Prompt: "A purchase was just attributed to image-015.
   │   │            Previous ROAS (leads only): 3.2x
   │   │            New ROAS (with purchase): 6.0x
   │   │            Total revenue from this content: $2,400
   │   │            
   │   │            Should we scale this content?
   │   │            Return JSON: {
   │   │              recommendation: 'scale|maintain|reduce',
   │   │              reasoning: '...',
   │   │              suggested_action: '...'
   │   │            }"
   │   │   
   │   │   Output: {
   │   │     recommendation: "scale",
   │   │     reasoning: "True ROAS of 6.0x significantly exceeds target (3.5x). Purchase validates lead quality.",
   │   │     suggested_action: "Increase budget to this content by 50% and find similar content in Pinecone"
   │   │   }
   │   │
   │   └─→ If CSO recommends scaling: Execute budget increase
   │       API: Meta/Google Ads API
   │       Action: Increase campaign budget
   │
   └─→ Node: Notify Dashboard
       API: POST https://dashboard.etherealjewelry.com/api/webhooks/purchase-attribution
       Body: {
         purchase_id: "purchase_12345",
         order_total: 2400.00,
         customer_email: "sarah@example.com",
         attributed: true,
         content_id: "image-015",
         campaign_id: "engagement-rings-001",
         old_roas: 3.2,
         new_roas: 6.0,
         attribution_confidence: "high",
         timestamp: "2026-02-03T15:45:00Z"
       }
```

### Data State After Flow

**Neo4j:**
```cypher
// Purchase created and attributed
(customer:Customer {email: "sarah@example.com"})
-[:MADE_PURCHASE]->
(purchase:Purchase {order_id: "12345", order_total: 2400.00})
-[:ATTRIBUTED_TO]->
(campaign:Campaign {id: "engagement-rings-001"})

(purchase)-[:ATTRIBUTED_TO]->(content:Content {id: "image-015"})

// Lead converted
(lead:Lead {email: "sarah@example.com", status: "converted"})
-[:CONVERTED_TO]->(customer)

// Content revenue updated
(content:Content {
  id: "image-015",
  total_revenue: 2400.00,
  true_roas: 6.0
})
```

**Pinecone:**
```json
{
  "content_image-015_ethereal-jewelry": {
    "metadata": {
      "total_revenue": 2400.00,
      "true_roas": 6.0,
      "last_purchase_date": "2026-02-03"
    }
  }
}
```

**Dashboard:**
- Purchase attribution card appears
- Shows: $2,400 purchase → image-015 → engagement-rings-001
- Content ROAS updated: 3.2x → 6.0x
- Alert: "High-performing content scaled"

**Ad Platforms:**
- Campaign budget increased by 50% (if CSO recommended)

---

## Flow 5: Dashboard Data Query

**Trigger:** User opens dashboard executive view

### Detailed Flow

```
1. User navigates to https://dashboard.zenmedclinic.com/
   │
   ↓
2. Dashboard Frontend (Next.js)
   Component: <ExecutiveDashboard />
   
   useEffect hook triggers:
   ├─→ Fetch executive summary
   ├─→ Fetch AI narrative
   ├─→ Fetch top insights
   └─→ Fetch 7-day trend
   │
   ↓
3. API Call: GET /api/performance/executive-summary
   │
   ↓
4. Dashboard Backend API (FastAPI)
   Endpoint: GET /api/performance/executive-summary?brand_id=zen-med-clinic&date_range=7d
   
   ├─→ Query Neo4j - Current Period Metrics
   │   Cypher: MATCH (camp:Campaign {brand_id: "zen-med-clinic"})
   │           -[:ACHIEVED]->(perf:Performance)
   │           WHERE perf.date >= date() - duration({days: 7})
   │           RETURN sum(perf.spend) AS total_spend,
   │                  sum(perf.revenue) AS total_revenue,
   │                  sum(perf.conversions) AS total_conversions,
   │                  avg(perf.roas) AS avg_roas
   │   
   │   Result: {
   │     total_spend: 2100.00,
   │     total_revenue: 7980.00,
   │     total_conversions: 67,
   │     avg_roas: 3.8
   │   }
   │
   ├─→ Query Neo4j - Prior Period Metrics (for comparison)
   │   Cypher: [Same query but for days 8-14]
   │   
   │   Result: {
   │     total_spend: 2050.00,
   │     total_revenue: 6150.00,
   │     total_conversions: 54,
   │     avg_roas: 3.0
   │   }
   │
   ├─→ Calculate Changes
   │   Logic: 
   │   roas_change = ((3.8 - 3.0) / 3.0) * 100 = +26.7%
   │   revenue_change = ((7980 - 6150) / 6150) * 100 = +29.8%
   │   conversions_change = ((67 - 54) / 54) * 100 = +24.1%
   │
   └─→ Return Response
       JSON: {
         spend: {
           value: 2100.00,
           change: {value: 2.4, direction: "up"},
           status: "on-track"
         },
         roas: {
           value: 3.8,
           change: {value: 26.7, direction: "up"},
           status: "on-track"
         },
         conversions: {
           value: 67,
           change: {value: 24.1, direction: "up"},
           status: "on-track"
         },
         revenue: {
           value: 7980.00,
           change: {value: 29.8, direction: "up"},
           status: "on-track"
         }
       }
   │
   ↓
5. API Call: GET /api/insights/narrative
   │
   ↓
6. Dashboard Backend → n8n
   API: GET https://n8n.yourserver.com/webhook/zen-med-clinic/latest-narrative
   
   n8n: Returns latest narrative from Client Translator Agent
   (Generated during Weekly Strategy workflow)
   
   Response: {
     narrative: "Strong week with 18% ROAS improvement. Your calm, peaceful treatment room content is resonating powerfully with professional women 35-50 during evening hours. Instagram campaigns significantly outperforming Facebook.",
     date_range: "2026-01-27 to 2026-02-02",
     generated_at: "2026-02-03T03:00:00Z"
   }
   │
   ↓
7. API Call: GET /api/insights/top
   │
   ↓
8. Dashboard Backend → Query n8n
   API: GET https://n8n.yourserver.com/webhook/zen-med-clinic/top-insights?limit=3
   
   Response: [{
     icon: "target",
     insight: "Evening engagement 2.8x higher than daytime",
     action: "Shifted 60% of budget to 6-9pm window",
     impact: "+18% ROAS expected",
     type: "opportunity"
   }, {
     icon: "fire",
     insight: "Content showing your clinic location performs 22% better",
     action: "Request more location-based videos",
     type: "achievement"
   }, {
     icon: "trending",
     insight: "Instagram outpacing Facebook (4.2 vs 2.1 ROAS)",
     action: "Reallocated $150/day to Instagram",
     impact: "+$225/day revenue projected",
     type: "opportunity"
   }]
   │
   ↓
9. Dashboard Frontend receives all data
   
   State updated:
   - executiveSummary: {metrics data}
   - narrative: "Strong week with..."
   - topInsights: [3 insights]
   - trend: [7 days of ROAS data]
   
   Components re-render with data
   │
   ↓
10. User sees complete dashboard (render time: <1 second)
```

---

## Flow 6: Cross-System Data Consistency

**Challenge:** Keep data synchronized across Pinecone, Neo4j, and dashboard

### Pattern: Event-Driven Updates

**Scenario:** Content performance changes (daily)

```
Event Source: n8n Daily Performance Workflow completes
  │
  ├─→ Update 1: Neo4j
  │   Cypher: Update content.total_impressions, content.avg_roas
  │   Status: ✓ Complete
  │
  ├─→ Update 2: Pinecone
  │   API: Update vector metadata (total_impressions, avg_roas)
  │   Status: ✓ Complete
  │
  ├─→ Update 3: Notify Dashboard
  │   Webhook: POST /api/webhooks/performance-updated
  │   Action: Dashboard invalidates cache, fetches fresh data
  │   Status: ✓ Complete
  │
  └─→ Consistency Check (Optional)
      Every 24 hours: Compare Neo4j vs Pinecone metrics
      If mismatch: Log warning, trigger reconciliation
```

### Pattern: Cache Invalidation

**Dashboard Backend (FastAPI):**
```python
from functools import lru_cache
from datetime import datetime, timedelta
import redis

redis_client = redis.Redis()

@lru_cache(maxsize=128)
def get_executive_summary_cached(brand_id: str, date_str: str):
    """Cache executive summary for 1 hour"""
    return get_executive_summary(brand_id, date_str)

@router.post("/api/webhooks/performance-updated")
async def invalidate_cache(brand_id: str):
    """Invalidate cache when n8n updates data"""
    # Clear function cache
    get_executive_summary_cached.cache_clear()
    
    # Clear Redis cache
    redis_client.delete(f"executive_summary:{brand_id}")
    
    return {"status": "cache_invalidated"}
```

---

## Error Handling Patterns

### Pattern 1: Retry with Exponential Backoff

**Scenario:** Pinecone API temporarily unavailable

```javascript
// In n8n Code node
async function updatePineconeWithRetry(vectorId, metadata, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await pinecone.update({
        id: vectorId,
        setMetadata: metadata,
        namespace: namespace
      });
      return { success: true };
    } catch (error) {
      if (attempt === maxRetries - 1) {
        // Final attempt failed - log and queue for retry
        await logError({
          operation: "pinecone_update",
          vectorId,
          error: error.message,
          attempt: attempt + 1
        });
        
        // Queue in Redis for later retry
        await queueForRetry({
          operation: "pinecone_update",
          data: { vectorId, metadata, namespace }
        });
        
        return { success: false, queued: true };
      }
      
      // Wait with exponential backoff: 1s, 2s, 4s
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}
```

### Pattern 2: Graceful Degradation

**Scenario:** Dashboard needs data but Neo4j is slow

```python
# Dashboard Backend
from functools import wraps
import asyncio

def with_timeout(seconds):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await asyncio.wait_for(func(*args, **kwargs), timeout=seconds)
            except asyncio.TimeoutError:
                # Return cached data if available
                cache_key = f"{func.__name__}:{args}"
                cached = redis_client.get(cache_key)
                if cached:
                    return json.loads(cached)
                # Return minimal safe default
                return {"error": "timeout", "data": None}
        return wrapper
    return decorator

@router.get("/api/performance/executive-summary")
@with_timeout(2.0)  # 2 second timeout
async def get_executive_summary(brand_id: str):
    # Query Neo4j
    data = await neo4j_query(...)
    
    # Cache for 5 minutes
    redis_client.setex(f"exec_summary:{brand_id}", 300, json.dumps(data))
    
    return data
```

### Pattern 3: Fallback Chain

**Scenario:** Content similarity search

```python
async def find_similar_content(content_id: str, brand_id: str):
    # Try 1: Pinecone semantic search (preferred)
    try:
        similar = await pinecone_similarity_search(content_id, brand_id)
        if similar:
            return {"source": "pinecone", "results": similar}
    except Exception as e:
        logger.warning(f"Pinecone search failed: {e}")
    
    # Try 2: Neo4j attribute matching (fallback)
    try:
        similar = await neo4j_attribute_match(content_id, brand_id)
        if similar:
            return {"source": "neo4j", "results": similar}
    except Exception as e:
        logger.warning(f"Neo4j search failed: {e}")
    
    # Try 3: Return empty (last resort)
    return {"source": "none", "results": []}
```

---

## Monitoring & Observability

### Key Metrics to Track

**Flow Health:**
- n8n workflow execution success rate (target: >95%)
- Average workflow duration (target: <5 minutes for daily workflows)
- Database query response times (target: <100ms for Neo4j, <50ms for Pinecone)
- API endpoint response times (target: <500ms)

**Data Consistency:**
- Neo4j vs Pinecone metric mismatches (alert if >5%)
- Dashboard cache hit rate (target: >80%)
- Webhook delivery success rate (target: >98%)

**Business Metrics:**
- Lead capture rate (forms submitted / page views)
- Purchase attribution rate (% of purchases attributed to campaigns)
- ROAS calculation accuracy (compare predicted vs actual)

### Logging Strategy

**Structured Logging in n8n:**
```javascript
// Log important events
await log({
  timestamp: new Date().toISOString(),
  workflow: "content-ingestion",
  event: "content_profiled",
  content_id: contentId,
  brand_id: brandId,
  tones_detected: tones.length,
  duration_ms: executionTime
});
```

**Centralized Logging:**
- n8n → Datadog/New Relic/Sentry
- Dashboard API → Datadog
- Website API → Datadog

**Alert Conditions:**
- Workflow failure rate >5% in 1 hour → Alert
- Pinecone update failure → Queue for retry, alert if queue >100
- Neo4j connection failures → Alert immediately
- Dashboard API errors >10/minute → Alert