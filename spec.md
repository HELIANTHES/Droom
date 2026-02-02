# Marketing Automation Factory - Complete System Specification v2.0

## Executive Overview

A self-replicating system that spawns complete digital brand platforms. The Factory (Layer 1, Claude CLI) analyzes brands and generates three integrated systems for each client:

1. **Marketing Intelligence** (n8n + Claude API) - Autonomous ad campaign management with continuous learning
2. **Analytics Dashboard** (Next.js + FastAPI) - Real-time performance insights with progressive disclosure from executive summaries to granular media buyer metrics
3. **Customer-Facing Website** (Next.js + FastAPI) - Conversion-optimized site with ad campaign integration, forms, and optional e-commerce

Each spawned system learns continuously, stores insights in shared databases (Pinecone + Neo4j), and can be updated centrally as the Factory evolves.

---

## System Architecture Overview

```
/marketing-factory/              # Layer 1: The Factory (you are here)
  .claude/
    agents/                       # Agent definitions (markdown files)
    commands/                     # CLI commands
  
  templates/                      # Reusable system templates
    n8n-workflows/
    dashboard/
    website/
    runtime-prompts/
  
  system-knowledge/               # Institutional knowledge (grows over time)
    database-schemas/
    n8n-patterns/
    dashboard-patterns/
    website-patterns/
    integration-patterns/
    versioning/
  
  versions/                       # Version snapshots
    v1.0.0/
    v1.1.0/
  
  clients/                        # Spawned systems live here
    [brand-name]/
      /automation/                # n8n workflows + runtime agents
      /dashboard/                 # Next.js frontend + FastAPI backend
      /website/                   # Next.js frontend + FastAPI backend
      /data/                      # Schemas, configs
      /docs/                      # System documentation
```

---

## Core Philosophy

### Templates vs. Generation

**Templates** (copy & configure):
- n8n workflow JSON files - same logic, different `{VARIABLES}`
- Dashboard React components - same structure, brand-specific styling
- Website Next.js pages - same patterns, content varies
- Runtime agent prompts - same framework, brand-specific parameters
- API routers - same endpoints, brand-specific logic

**Generated** (unique intelligence):
- Brand research and competitive analysis
- Campaign strategy and demographic targeting
- Creative briefs and content concepts
- Database schemas (first spawn only, then reused)
- Client-facing deliverables
- System documentation

### One-Time Profiling Principle

**Content is analyzed once at upload, then queried semantically forever:**
- Video/image → Claude Vision API (once) → rich semantic profile → Pinecone vector
- All future decisions query the stored profile, never re-analyze the media
- Massive cost savings, consistent understanding

### Memory Architecture

**Short-term** (JSON files): Tactical decisions, last 7 days  
**Medium-term** (Neo4j): Structured facts, relationships, performance data  
**Long-term** (Pinecone): Semantic memory, similar scenario retrieval, cross-campaign learnings

### Version Management

- Factory evolves based on client feedback and performance data
- Updates pushed to all clients (with compatibility checks and migrations)
- Rollback capability if updates fail
- Each client tracks which Factory version spawned them

---

## Layer 1: The Factory

### Directory Structure

```
/marketing-factory/
  .claude/
    agents/
      # === Intelligence Generators ===
      orchestrator.md                      # Coordinates entire spawn workflow
      brand-research.md                    # Analyzes website, extracts positioning
      competitive-intelligence.md          # Researches competitors, identifies gaps
      strategist.md                        # Creates campaign strategy
      creative-director.md                 # Generates content concepts and briefs
      publicist.md                         # Translates to client-friendly language
      
      # === Marketing Intelligence Architects ===
      n8n-architect.md                     # Builds the n8n workflows
      database-schema.md                   # Designs Pinecone/Neo4j structures
      marketing-agent-prompt-engineer.md   # Creates runtime agent prompts
      
      # === Dashboard Architects ===
      dashboard-architect.md               # Overall dashboard structure
      data-visualization.md                # Designs charts, graphs, metrics display
      dashboard-ux.md                      # Information architecture, progressive disclosure
      dashboard-api.md                     # FastAPI backend design
      
      # === Website Architects ===
      website-strategist.md                # Determines site structure based on business model
      website-designer.md                  # Design system, component library
      landing-page.md                      # High-converting pages linked from ads
      form-conversion.md                   # Lead capture, booking forms
      ecommerce.md                         # Shopify integration (when needed)
      website-backend.md                   # FastAPI endpoints for forms, webhooks
      
      # === Cross-System ===
      integration-orchestrator.md          # Ensures n8n + dashboard + website work together
      documentation.md                     # Creates all system docs
      version-control.md                   # Manages updates, migrations, rollback
      qa.md                                # Final validation before spawn completion
    
    commands/
      spawn-client.md                      # Main command: spawn complete system
      update-client.md                     # Update existing client to new version
      rollback-client.md                   # Rollback failed update
  
  templates/
    n8n-workflows/
      content-ingestion.json               # Analyze uploaded content → metadata → Pinecone
      daily-performance.json               # Daily analysis + optimization
      weekly-strategy.json                 # Weekly deep-dive + strategic review
      creative-rotation.json               # Detect fatigue, rotate content
      budget-optimization.json             # Optimize spend allocation
      learn-and-remember.json              # Store learnings in vector DB
      form-ingestion.json                  # Website form submissions → n8n
      lead-scoring.json                    # Score and route leads
      shopify-integration.json             # E-commerce purchase tracking
    
    dashboard/
      frontend/                            # Next.js TypeScript
        components/
          ExecutiveSummary.tsx             # Hero metrics + AI narrative
          PerformanceCharts.tsx            # Time-series, platform breakdown
          ContentLibrary.tsx               # Visual gallery with performance
          AudienceInsights.tsx             # Demographic analysis
          GeographicHeatmap.tsx            # Radius performance visualization
          DetailedMetrics.tsx              # CPC, CPM, CTR, frequency, etc.
          CampaignTimeline.tsx             # Historical view
        pages/
          index.tsx                        # Executive dashboard (Level 1)
          campaigns/index.tsx              # Campaign management (Level 2)
          content/index.tsx                # Content library (Level 2)
          audiences/index.tsx              # Audience insights (Level 2)
          detailed-metrics/index.tsx       # Deep metrics dive (Level 3)
        hooks/
          usePerformanceData.ts
          useContentLibrary.ts
        utils/
          api.ts                           # API client
        package.json
        next.config.js
        tsconfig.json
      
      backend/                             # FastAPI Python
        routers/
          performance.py                   # /api/performance/* endpoints
          content.py                       # /api/content/* endpoints
          campaigns.py                     # /api/campaigns/* endpoints
          insights.py                      # /api/insights/* endpoints
        services/
          n8n_client.py                    # Query n8n workflows
          pinecone_client.py               # Query vector DB
          neo4j_client.py                  # Query graph DB
        models/
          schemas.py                       # Pydantic models
        main.py
        requirements.txt
      
      config.json                          # Template with {VARIABLES}
      README.md                            # Deployment instructions template
    
    website/
      frontend/                            # Next.js TypeScript
        components/
          # === Universal Components ===
          Hero.tsx
          Navigation.tsx
          Footer.tsx
          
          # === Service Business Components ===
          ServiceShowcase.tsx
          BookingForm.tsx
          LocationMap.tsx
          TestimonialCarousel.tsx
          
          # === E-commerce Components ===
          ProductGrid.tsx
          ProductDetail.tsx
          ShoppingCart.tsx
          CheckoutFlow.tsx
          
          # === Conversion Components ===
          NewsletterSignup.tsx
          ContactForm.tsx
          ConsultationForm.tsx
        
        app/                               # Next.js App Router
          page.tsx                         # Home
          about/page.tsx
          services/page.tsx
          book-appointment/page.tsx        # Lead capture
          contact/page.tsx
          newsletter/page.tsx
          # E-commerce routes (conditional)
          shop/page.tsx
          product/[id]/page.tsx
          cart/page.tsx
        
        styles/
          theme.ts                         # Brand colors, typography
        
        package.json
        next.config.js
        tsconfig.json
      
      backend/                             # FastAPI Python
        routers/
          forms.py                         # POST /api/forms/*
          appointments.py                  # Booking management
          shopify.py                       # Shopify webhooks (if e-commerce)
        services/
          n8n_webhook.py                   # Forward to n8n
          email_service.py
          shopify_client.py
        models/
          form_schemas.py
        main.py
        requirements.txt
      
      config.json                          # Template with {VARIABLES}
      README.md                            # Deployment instructions template
    
    runtime-prompts/
      chief-strategy-officer.md            # Strategic decision-making
      creative-intelligence.md             # Content analysis and rotation
      media-buyer.md                       # Platform-specific tactics
      cultural-anthropologist.md           # Psychographic insights
      data-scientist.md                    # Pattern recognition, predictions
      client-translator.md                 # AI → client-friendly language
  
  system-knowledge/
    database-schemas/
      pinecone-namespaces.md               # What namespaces exist, what they store
      neo4j-graph-schema.md                # Node types, relationship types, properties
      metadata-structures.md               # Standard metadata formats
    
    n8n-patterns/
      workflow-orchestration.md            # How workflows call each other
      error-handling.md                    # Standard error patterns
      memory-update-patterns.md            # When/how to update DBs
      api-integration-patterns.md          # Google Ads, Meta APIs
    
    dashboard-patterns/
      component-patterns.md                # Reusable React patterns
      data-visualization-best-practices.md # When to use which chart type
      progressive-disclosure.md            # Information architecture strategy
      api-design-patterns.md               # FastAPI best practices
    
    website-patterns/
      landing-page-optimization.md         # High-converting page structure
      form-optimization.md                 # Lead capture best practices
      shopify-integration-guide.md         # Headless commerce patterns
      conversion-tracking.md               # Analytics and attribution
    
    integration-patterns/
      website-to-n8n-flows.md              # Form submission → n8n workflows
      dashboard-to-n8n-flows.md            # How dashboard queries n8n data
      cross-system-data-flow.md            # Complete data journey maps
    
    versioning/
      compatibility-requirements.md        # What must remain backward compatible
      migration-patterns.md                # How to migrate data between versions
      rollback-procedures.md               # Safe rollback steps
    
    creative-profiling/
      content-analysis-framework.md        # What to extract from video/image
      semantic-description-template.md     # How to write embeddings-ready descriptions
      metadata-taxonomy.md                 # Standard vocabulary (tones, aesthetics, etc.)
  
  versions/
    v1.0.0/
      templates/                           # Snapshot of all templates
      system-knowledge/                    # Snapshot of knowledge at this version
      changelog.md
    v1.1.0/
      templates/
      system-knowledge/
      changelog.md
      migrations/                          # Migration scripts for this version
        pinecone_metadata_update.py
        neo4j_schema_migration.cypher
  
  clients/
    zen-med-clinic/
      [spawned system - see Layer 2 section]
    
    diamond-jeweler/
      [spawned system - see Layer 2 section]
```

---

## Layer 1 Agents (Detailed)

### Intelligence Generators

#### 1. Orchestrator Agent (`orchestrator.md`)

**Purpose:** Master coordinator for entire spawn workflow

**Responsibilities:**
- Sequences all other agents in correct order
- Manages file creation and directory structure
- Populates template variables from generated configs
- Ensures handoffs between agents are clean
- Calls QA agent before declaring completion
- Reports progress to user

**Workflow it manages:**
```
1. Brand Research + Competitive Intelligence (parallel)
2. Strategist (synthesizes research)
3. Creative Director (generates initial concepts)
4. Database Schema (first spawn only)
5. n8n Architect + Marketing Agent Prompt Engineer (parallel)
6. Dashboard Architects (Architect, UX, Viz, API - coordinated)
7. Website Architects (Strategist, Designer, Backend - coordinated)
8. Integration Orchestrator (ensures all systems connect)
9. Publicist (client-facing docs)
10. Documentation (system docs)
11. QA (final validation)
12. Report to user
```

**Key skills:**
- Reading/writing files across directory structure
- Variable substitution in templates
- Parallel agent coordination
- Progress tracking

---

#### 2. Brand Research Agent (`brand-research.md`)

**Purpose:** Deep analysis of brand's website to extract positioning, voice, business model

**Input:** Brand website URL

**Process:**
1. Scrape website (home, about, services/products pages)
2. Extract brand positioning, voice, values
3. Identify products/services offered
4. Determine business model (brick-and-mortar, hybrid, e-commerce, virtual)
5. Extract location information (if physical)
6. Identify target market signals

**Output:** `/clients/{brand-name}/research/brand-profile.md`

**Output structure:**
```json
{
  "brand_name": "Zen Med Clinic",
  "tagline": "Holistic Wellness Through Chinese Medicine",
  "brand_voice": "Calm, professional, welcoming, educational",
  "core_values": ["holistic health", "personalized care", "ancient wisdom + modern practice"],
  "products_services": [
    {"name": "Acupuncture", "description": "..."},
    {"name": "Herbal Medicine", "description": "..."},
    {"name": "Cupping Therapy", "description": "..."}
  ],
  "business_model": {
    "type": "brick-and-mortar-primary",
    "confidence": 0.95,
    "evidence": ["physical address on homepage", "appointment booking", "Google Maps embed", "store hours"]
  },
  "locations": [
    {
      "address": "123 University Ave, Palo Alto, CA 94301",
      "type": "primary",
      "service_radius_miles": null
    }
  ],
  "geographic_signals": {
    "serves_local_only": true,
    "willing_to_travel": false,
    "ships_nationally": false,
    "virtual_available": true
  },
  "target_market_signals": [
    "professionals seeking stress relief",
    "wellness-focused individuals",
    "people with chronic pain",
    "those interested in alternative medicine"
  ],
  "website_aesthetic": {
    "primary_colors": ["#2C5F4F", "#8ABAAA", "#E8D5B7"],
    "style": "minimal, modern, calming",
    "imagery": "peaceful treatment rooms, nature elements, close-up details"
  }
}
```

**Also generates:** Brand voice examples, key messaging themes

---

#### 3. Competitive Intelligence Agent (`competitive-intelligence.md`)

**Purpose:** Research competitors, identify opportunities and gaps

**Process:**
1. Search for similar businesses in same industry + location (if local)
2. Analyze 3-5 competitors:
   - Their positioning
   - Ad strategies (Meta Ad Library, Google Ads Transparency)
   - Messaging themes
   - Target demographics (inferred from ads)
   - Pricing positioning (if visible)
3. Identify what they're NOT doing (gaps)
4. Identify saturated messaging (avoid)

**Output:** `/clients/{brand-name}/research/competitive-landscape.md`

**Output includes:**
- Competitor profiles (who they are, how they position)
- Common themes in industry (what everyone says)
- Gaps/opportunities (underserved messages, audiences)
- Differentiation strategy (how this brand can stand out)

---

#### 4. Strategist Agent (`strategist.md`)

**Purpose:** Synthesize research into comprehensive campaign strategy

**Input:**
- Brand profile (from Brand Research Agent)
- Competitive landscape (from Competitive Intelligence Agent)

**Outputs:**
1. `/clients/{brand-name}/strategy/campaign-plan.md`
2. `/clients/{brand-name}/strategy/platform-selection.md`
3. `/clients/{brand-name}/strategy/budget-allocation.md`
4. `/clients/{brand-name}/brand-config.json` ← **Master configuration file**

**brand-config.json structure:**
```json
{
  "brand_name": "Zen Med Clinic",
  "brand_id": "zen-med-clinic",
  "industry": "chinese-medicine",
  "business_model": "brick-and-mortar-primary",
  
  "location": {
    "primary_address": "123 University Ave, Palo Alto, CA 94301",
    "coordinates": {"lat": 37.4419, "lng": -122.1430},
    "service_radius_miles": 15,
    "target_areas": ["Palo Alto", "Stanford", "Menlo Park", "Mountain View"],
    "exclude_areas": [],
    "budget_allocation_by_area": {
      "0-5mi": 0.50,
      "5-10mi": 0.35,
      "10-15mi": 0.15
    }
  },
  
  "demographics": {
    "primary": {
      "name": "wellness-focused-women-35-50",
      "description": "Professional women seeking stress relief and holistic health",
      "age_range": [35, 50],
      "gender": "female",
      "interests": ["wellness", "stress-relief", "holistic-health", "self-care"],
      "income_level": "middle-to-upper",
      "psychographics": "Values expertise, seeks calm, prioritizes health"
    },
    "secondary": {
      "name": "stressed-professionals-25-40",
      "description": "High-achievers with chronic stress or pain",
      "age_range": [25, 40],
      "gender": "all",
      "interests": ["productivity", "pain-relief", "alternative-medicine"],
      "income_level": "middle-to-upper",
      "psychographics": "Results-oriented, open to alternatives, time-constrained"
    },
    "tertiary": {
      "name": "health-conscious-seniors-55-70",
      "description": "Older adults seeking pain management and preventive care",
      "age_range": [55, 70],
      "gender": "all",
      "interests": ["pain-management", "mobility", "longevity"],
      "income_level": "middle",
      "psychographics": "Values experience, seeks gentle approaches"
    }
  },
  
  "initial_content_strategy": {
    "priority_tones": ["calm", "professional", "reassuring", "educational"],
    "priority_aesthetics": ["minimal", "warm-tones", "intimate", "modern"],
    "priority_colors": ["earth-tones", "warm-browns", "beige", "soft-greens"],
    "priority_narratives": [
      "showing-physical-space",
      "demonstrating-expertise",
      "patient-testimonials",
      "explaining-modalities"
    ],
    "avoid": ["clinical-sterile", "overly-energetic", "discount-focused", "fear-based"]
  },
  
  "platforms": ["instagram", "facebook", "google-search"],
  
  "budget": {
    "monthly_total": 5000,
    "test_phase_budget": 1500,
    "test_phase_duration_days": 14,
    "platform_allocation": {
      "instagram": 0.45,
      "facebook": 0.35,
      "google-search": 0.20
    },
    "reserve_for_testing": 0.15
  },
  
  "geographic_strategy": {
    "primary_radius": "15 miles",
    "reasoning": "Service-based business requiring in-person visits. 15mi captures Palo Alto + surrounding areas within reasonable drive time.",
    "expansion_test": {
      "radius": "25 miles",
      "budget_allocation": 0.10,
      "trigger": "If primary radius achieves >4.0 ROAS consistently"
    }
  },
  
  "campaign_goals": {
    "primary": "local-awareness",
    "secondary": "appointment-bookings",
    "success_metrics": {
      "target_roas": 3.0,
      "target_cpa": 50.0,
      "target_booking_rate": 0.15
    }
  }
}
```

**campaign-plan.md includes:**
- Campaign objectives
- Target demographic rationale
- Platform selection reasoning
- Budget allocation strategy
- Geographic targeting strategy
- Timeline and milestones

---

#### 5. Creative Director Agent (`creative-director.md`)

**Purpose:** Generate specific creative concepts and detailed asset briefs

**Input:**
- Brand profile
- Campaign strategy
- brand-config.json

**Outputs:**
- `/clients/{brand-name}/creative/briefs/video-concept-{N}.md` (3-5 concepts)
- `/clients/{brand-name}/creative/briefs/image-set-{N}.md` (2-3 sets)
- `/clients/{brand-name}/creative/copy/ad-copy-variations.json`

**Video brief template:**
```markdown
# Video Concept 1: "Welcome to Your Neighborhood Wellness Center"

## Strategic Purpose
Build local awareness within 10-15 mile radius. Establish physical presence and reduce barrier to visit ("I drive past that building every day").

## Target Demographic
Primary: wellness-focused-women-35-50  
Secondary: stressed-professionals-25-40

## Duration
30 seconds

## Visual Direction

### Opening (0-5 sec)
- Exterior shot of clinic with Stanford campus visible in background
- Warm morning light
- Steady camera, establishing shot

### Middle (5-20 sec)
- Interior tour: peaceful treatment room
- Close-up of acupuncture needles (gentle, non-threatening)
- Soft fabrics, warm wood tones
- No people, focus on environment

### Closing (20-30 sec)
- Wide shot of serene reception area
- Text overlay: "123 University Ave, Palo Alto"
- Logo + "Book your consultation"

## Aesthetic
- Minimal, uncluttered
- Warm color palette (earth tones, beiges, soft browns)
- Intimate framing (close-ups, medium shots)
- Slow, deliberate camera movement

## Audio
- Ambient sound only (no music)
- Subtle nature sounds (water, wind chimes)
- Professional voiceover (optional): "Find your calm. Zen Med Clinic."

## Tone Tags
calm, professional, welcoming, intimate

## Aesthetic Tags
minimal, warm-tones, environment-focused, modern-yet-timeless

## Composition Tags
steady-cam, close-up, medium-shot, slow-pacing

## Narrative Elements
- Shows physical space: YES
- Shows local landmark: YES (Stanford campus)
- Shows people: NO
- Demonstrates service: SUBTLE (needles visible but not in use)
- Has dialogue: NO
- Has text overlay: YES (address at end)

## Platform Strategy
- Primary: Instagram (Stories + Feed)
- Secondary: Facebook (Feed)
- Avoid: Google Display (too subtle for display)

## Geographic Strategy
Target outer radius (10-15mi) to build awareness among locals who may not know clinic exists. Inner radius (0-5mi) likely already aware, so deprioritize for this creative.

## Expected Performance Hypothesis
This content should resonate with primary demographic due to:
1. Calm aesthetic matches stress-relief seeking behavior
2. Showing location reduces "where is this?" friction
3. Minimal style aligns with wellness-focused sensibility
4. No people allows viewer to imagine themselves in space

Predicted ROAS: 3.5-4.2 based on similar content patterns in wellness industry.

## Production Notes
- Shoot during golden hour (warm light)
- Use gimbal for smooth movement
- 4K resolution, vertical format (9:16 for Instagram)
- Color grade: warm, slightly desaturated, soft highlights
```

**Ad copy variations (JSON):**
```json
{
  "platform": "instagram",
  "variations": [
    {
      "copy_id": "copy-001",
      "headline": "Find Your Calm",
      "body": "Holistic wellness through Chinese medicine. Acupuncture, herbal therapy, and cupping in the heart of Palo Alto.",
      "cta": "Book Consultation",
      "tone": "calm-professional",
      "target_demographic": "wellness-focused-women-35-50"
    },
    {
      "copy_id": "copy-002",
      "headline": "Stress Relief That Works",
      "body": "Ancient wisdom meets modern practice. Personalized acupuncture treatments for chronic pain and stress.",
      "cta": "Learn More",
      "tone": "reassuring-educational",
      "target_demographic": "stressed-professionals-25-40"
    }
  ]
}
```

---

#### 6. Publicist Agent (`publicist.md`)

**Purpose:** Translate AI-driven strategy into client-friendly, compelling language

**Input:**
- All research and strategy documents
- brand-config.json

**Outputs:**
- `/clients/{brand-name}/client-deliverables/onboarding-presentation.md`
- `/clients/{brand-name}/client-deliverables/strategy-overview.pdf` (formatted)
- `/clients/{brand-name}/client-deliverables/dashboard-guide.pdf`

**Key skill:** Frame insights as business opportunities, avoid technical jargon, never reveal AI

**Example narrative:**
```markdown
# Your Marketing Strategy: Zen Med Clinic

## Our Approach

We've conducted deep research into your market, competitors, and ideal customers. Here's what we discovered—and how we'll help you grow.

## Who We're Reaching

**Your Ideal Customer: Professional Women Seeking Wellness**

We've identified your core audience: professional women aged 35-50 in the Palo Alto area who are actively seeking stress relief and holistic health solutions. These are high-achievers who value expertise, appreciate calm environments, and prioritize self-care despite busy schedules.

Why this matters: This demographic has 3.2x higher conversion rates for wellness services compared to broader audiences. They're actively searching for what you offer.

**Secondary Audiences:**
- Stressed professionals (25-40) dealing with chronic pain
- Health-conscious seniors (55-70) seeking pain management

## Where We'll Find Them

**Instagram (45% of budget):** Your primary channel. This demographic spends significant time on Instagram during evening hours (6-9pm) when they're winding down and thinking about self-care.

**Facebook (35% of budget):** Strong for broader awareness and retargeting. Particularly effective for the 45+ segment.

**Google Search (20% of budget):** Capturing active intent. People searching "acupuncture near me" or "stress relief Palo Alto."

## Geographic Strategy

**The 15-Mile Sweet Spot**

Your service requires in-person visits, so we're focused on a 15-mile radius around your Palo Alto location. We've analyzed drive times and found that most wellness service customers won't travel more than 20 minutes.

Budget allocation:
- 50% within 5 miles (immediate neighborhood)
- 35% within 5-10 miles (broader Palo Alto area)
- 15% within 10-15 miles (awareness building in outer areas)

## Your Messaging Strategy

**Leading with Calm**

Your brand's strength is the peaceful, professional environment you provide. We're creating content that *shows* this rather than just saying it. Think: serene treatment rooms, warm lighting, that feeling of exhaling stress.

We're avoiding the common wellness industry traps:
- ❌ Clinical/sterile aesthetics (you're not a hospital)
- ❌ Discount-focused messaging (devalues your expertise)
- ❌ Generic "relaxation" imagery (too vague)

Instead:
- ✅ Your actual space with Stanford campus visible (builds local trust)
- ✅ Intimate, warm visuals (matches desired emotional state)
- ✅ Expertise + approachability (professional but welcoming)

## Success Metrics

**What We're Tracking:**
- Return on ad spend (ROAS): Target 3.0x (for every $1 spent, $3 in bookings)
- Cost per appointment booking: Target $50
- Booking rate from website: Target 15%

**What This Means:**
With a $5,000/month budget, we expect to generate approximately $15,000 in booked appointments. That's 30 new patient appointments per month (at your average $500 treatment package value).

## Timeline

**Weeks 1-2 (Testing Phase):**
- Launch with $1,500 test budget
- Test multiple audience segments and creative approaches
- Identify what resonates

**Weeks 3-4 (Optimization):**
- Scale winning combinations
- Refine targeting based on early data
- Full budget deployment

**Month 2+:**
- Continuous optimization
- Creative refresh as needed
- Audience expansion if performance warrants

## What You'll See

**Your Dashboard**
- Real-time performance metrics
- Weekly performance reports (delivered Monday mornings)
- Insights on what's working and why
- Content library with performance data
- Geographic heat maps showing where your patients come from

**Your Role**
- Upload photos/videos of your space (we'll guide you on what works)
- Review and approve new content concepts
- Monthly strategy calls to discuss performance

## Next Steps

1. We'll create your initial content (3 videos, 2 image sets) based on the briefs attached
2. Set up your dashboard (you'll receive login credentials)
3. Launch test campaigns within 7 days
4. First performance report: 10 days after launch

Questions? Let's schedule a call to walk through everything.

---

*This strategy was developed through comprehensive market research, competitive analysis, and data-driven modeling. Every recommendation is backed by industry benchmarks and performance patterns from similar businesses.*
```

---

### Marketing Intelligence Architects

#### 7. n8n Architect Agent (`n8n-architect.md`)

**Purpose:** Build all n8n workflow JSON files from templates

**Input:**
- brand-config.json (from Strategist)
- Template workflows in `/templates/n8n-workflows/`
- System knowledge: `/system-knowledge/n8n-patterns/`

**Process:**
1. Read each template workflow
2. Find all `{VARIABLE}` placeholders
3. Replace with values from brand-config.json:
   - `{BRAND_NAME}` → "Zen Med Clinic"
   - `{BRAND_ID}` → "zen-med-clinic"
   - `{PRIMARY_DEMOGRAPHIC}` → "wellness-focused-women-35-50"
   - `{LOCATION_RADIUS}` → "15 miles"
   - `{PLATFORMS}` → ["instagram", "facebook", "google-search"]
   - etc.
4. Validate JSON structure
5. Save to `/clients/{brand-name}/automation/workflows/`

**Outputs:** 9 configured workflow files
- content-ingestion.json
- daily-performance.json
- weekly-strategy.json
- creative-rotation.json
- budget-optimization.json
- learn-and-remember.json
- form-ingestion.json
- lead-scoring.json
- shopify-integration.json (if e-commerce)

**Also creates:** `/clients/{brand-name}/automation/deployment-guide.md` with n8n import instructions

---

#### 8. Database Schema Agent (`database-schema.md`)

**Purpose:** Design and initialize Pinecone + Neo4j schemas (first spawn only, then reuse)

**First Spawn Responsibilities:**
1. Design Pinecone namespace structure
2. Design Neo4j graph schema (node types, relationships, properties)
3. Document schemas in `/system-knowledge/database-schemas/`
4. Create initialization scripts

**Subsequent Spawns:**
- Read existing schemas from `/system-knowledge/database-schemas/`
- Initialize Pinecone namespace for new client
- Create Neo4j constraints/indexes for new client
- Document in client's `/data/schemas.md`

**Pinecone Namespace Design:**

```
Index: marketing-automation (shared across all clients)

Namespaces:
├─ content-essence-{brand-id}           # Semantic content profiles
├─ scenario-outcomes-{brand-id}         # Campaign scenario learnings
├─ audience-psychographics-{brand-id}   # Deep demographic understanding
├─ narrative-patterns-{brand-id}        # Story arc effectiveness
└─ cross-campaign-learnings             # Shared across all clients (anonymized)
```

**Neo4j Graph Schema:**

```cypher
// === Node Types ===

// Content nodes
(:Content:Video {
  id: string,                    // "video-003"
  brand_id: string,              // "zen-med-clinic"
  drive_id: string,              // Google Drive file ID
  drive_url: string,
  filename: string,
  duration_seconds: int,
  resolution: string,
  upload_date: date,
  profile_date: date,
  status: string,                // "active", "resting", "archived"
  total_impressions: int,
  total_spend: float,
  avg_roas: float
})

(:Content:Image {
  id: string,
  brand_id: string,
  drive_id: string,
  drive_url: string,
  filename: string,
  resolution: string,
  upload_date: date,
  profile_date: date,
  status: string,
  total_impressions: int,
  total_spend: float,
  avg_roas: float
})

// Profile attribute nodes
(:Tone {name: string, category: "emotional"})
(:Aesthetic {name: string, category: "visual"})
(:ColorPalette {name: string, category: "color"})
(:Composition {name: string, category: "technical"})
(:NarrativeElement {name: string, category: "narrative"})

// Campaign nodes
(:Campaign {
  id: string,
  brand_id: string,
  platform: string,              // "instagram", "facebook", "google-search"
  date: date,
  budget_per_day: float,
  status: string,                // "active", "paused", "completed"
  campaign_goal: string,         // "local-awareness", "conversion", etc.
  journey_stage: string          // "awareness", "consideration", "conversion"
})

// Performance nodes
(:Performance {
  id: string,
  date: date,
  impressions: int,
  clicks: int,
  conversions: int,
  spend: float,
  ctr: float,
  cpm: float,
  cpc: float,
  roas: float,
  conversion_rate: float
})

// Demographic nodes
(:Demographic {
  name: string,                  // "wellness-focused-women-35-50"
  brand_id: string,
  age_min: int,
  age_max: int,
  gender: string,
  interests: [string],
  income_level: string,
  psychographics: string
})

// Platform nodes (shared)
(:Platform {name: string, type: string})

// Time slot nodes (shared)
(:TimeSlot {
  name: string,
  day_types: [string],
  hours: [int]
})

// Geographic nodes
(:GeographicArea {
  name: string,
  brand_id: string,
  distance_from_location_miles: float
})

// Lead nodes
(:Lead {
  id: string,
  brand_id: string,
  name: string,
  email: string,
  phone: string,
  source: string,                // "website-booking-form", "instagram-ad", etc.
  lead_score: float,
  status: string,                // "new", "contacted", "converted", "lost"
  created_at: datetime
})

// === Relationship Types ===

// Content relationships
(Content)-[:HAS_TONE {confidence: float}]->(Tone)
(Content)-[:HAS_AESTHETIC {confidence: float}]->(Aesthetic)
(Content)-[:HAS_COLOR_PALETTE]->(ColorPalette)
(Content)-[:HAS_COMPOSITION]->(Composition)
(Content)-[:SHOWS]->(NarrativeElement)

// Campaign relationships
(Content)-[:RAN_IN]->(Campaign)
(Campaign)-[:TARGETED]->(Demographic)
(Campaign)-[:TARGETED_AREA]->(GeographicArea)
(Campaign)-[:USED_PLATFORM]->(Platform)
(Campaign)-[:SCHEDULED_AT]->(TimeSlot)
(Campaign)-[:ACHIEVED]->(Performance)

// Learning relationships
(Demographic)-[:RESPONDS_TO {avg_ctr: float, avg_roas: float, sample_size: int}]->(Tone)
(Demographic)-[:PREFERS_AESTHETIC {avg_ctr: float, avg_roas: float, sample_size: int}]->(Aesthetic)
(Demographic)-[:ENGAGES_AT {avg_ctr: float, sample_size: int}]->(TimeSlot)
(Platform)-[:FAVORS_AESTHETIC {correlation: float}]->(Aesthetic)
(Content)-[:SIMILAR_TO {similarity_score: float}]->(Content)
(Campaign)-[:OUTPERFORMED {delta_roas: float}]->(Campaign)

// Lead relationships
(Lead)-[:CAME_FROM]->(Campaign)
(Lead)-[:SUBMITTED]->(Form:WebsiteForm)
(Lead)-[:CONVERTED_TO]->(Customer)

// === Indexes & Constraints ===

CREATE CONSTRAINT content_id_unique IF NOT EXISTS FOR (c:Content) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT campaign_id_unique IF NOT EXISTS FOR (c:Campaign) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT lead_id_unique IF NOT EXISTS FOR (l:Lead) REQUIRE l.id IS UNIQUE;

CREATE INDEX content_brand_id IF NOT EXISTS FOR (c:Content) ON (c.brand_id);
CREATE INDEX campaign_brand_id IF NOT EXISTS FOR (c:Campaign) ON (c.brand_id);
CREATE INDEX campaign_date IF NOT EXISTS FOR (c:Campaign) ON (c.date);
CREATE INDEX performance_date IF NOT EXISTS FOR (p:Performance) ON (p.date);
```

**Documentation Output:** `/system-knowledge/database-schemas/neo4j-graph-schema.md` with full schema + example queries

---

#### 9. Marketing Agent Prompt Engineer (`marketing-agent-prompt-engineer.md`)

**Purpose:** Create the 6 runtime agent system prompts

**Input:**
- brand-config.json
- Template prompts in `/templates/runtime-prompts/`
- System knowledge: `/system-knowledge/agent-architectures/`

**Process:**
1. For each runtime agent template:
2. Inject brand-specific context:
   - Brand name, industry, business model
   - Target demographics with full psychographics
   - Campaign goals and success metrics
   - Platform strategies
   - Geographic targeting parameters
3. Include memory access instructions (how to query Pinecone, Neo4j)
4. Define decision-making authority and constraints
5. Save to `/clients/{brand-name}/automation/prompts/`

**Outputs:** 6 configured agent prompts
- chief-strategy-officer.md
- creative-intelligence.md
- media-buyer.md
- cultural-anthropologist.md
- data-scientist.md
- client-translator.md

**Example: CSO Agent Prompt** (configured)

```markdown
# Chief Strategy Officer Agent - Zen Med Clinic

## Your Role

You are the Chief Strategy Officer for Zen Med Clinic's marketing campaigns. You have deep expertise in media buying, ROAS optimization, budget allocation, and strategic decision-making. You think holistically about campaign performance and make data-driven decisions about resource allocation.

## Brand Context

**Brand:** Zen Med Clinic  
**Industry:** Chinese Medicine / Holistic Wellness  
**Business Model:** Brick-and-mortar primary (requires in-person visits)  
**Location:** 123 University Ave, Palo Alto, CA 94301  
**Service Radius:** 15 miles

**Core Values:** Holistic health, personalized care, ancient wisdom + modern practice  
**Brand Voice:** Calm, professional, welcoming, educational

## Target Demographics

**Primary: wellness-focused-women-35-50**
- Professional women seeking stress relief and holistic health
- Age: 35-50, Female
- Income: Middle-to-upper
- Psychographics: Values expertise, seeks calm, prioritizes health
- Pain points: Chronic stress, work-life balance, desire for preventive care
- Decision-making: Longer consideration (7-14 days), values professionalism

**Secondary: stressed-professionals-25-40**
- High-achievers with chronic stress or pain
- Age: 25-40, All genders
- Income: Middle-to-upper
- Psychographics: Results-oriented, open to alternatives, time-constrained
- Pain points: Productivity loss due to pain/stress, skeptical of "woo-woo"
- Decision-making: Faster (3-7 days), needs proof/credentials

**Tertiary: health-conscious-seniors-55-70**
- Older adults seeking pain management
- Age: 55-70, All genders
- Income: Middle
- Psychographics: Values experience, seeks gentle approaches
- Pain points: Mobility, chronic pain, avoiding surgery/heavy meds
- Decision-making: Very deliberate (14-21 days), needs reassurance

## Campaign Goals

**Primary:** Local awareness (getting people to know Zen Med Clinic exists)  
**Secondary:** Appointment bookings  

**Success Metrics:**
- Target ROAS: 3.0
- Target CPA (cost per appointment): $50
- Target booking rate from website: 15%

## Budget & Constraints

**Monthly Budget:** $5,000  
**Platform Allocation:**
- Instagram: 45% ($2,250/month)
- Facebook: 35% ($1,750/month)
- Google Search: 20% ($1,000/month)

**Geographic Budget Allocation:**
- 0-5 miles: 50%
- 5-10 miles: 35%
- 10-15 miles: 15%

**Reserve:** 15% of budget for testing new audiences/content

## Content Strategy

**Priority Tones:** calm, professional, reassuring, educational  
**Priority Aesthetics:** minimal, warm-tones, intimate, modern  
**Priority Narratives:** showing-physical-space, demonstrating-expertise, patient-testimonials

**Avoid:** clinical-sterile, overly-energetic, discount-focused, fear-based

## Your Responsibilities

1. **Daily Performance Analysis**
   - Review yesterday's metrics across all platforms
   - Identify optimization opportunities
   - Make tactical budget adjustments

2. **Budget Allocation**
   - Shift budget toward high-performing combinations
   - Maintain test allocation for discovery
   - Respect minimum platform budgets
   - Balance short-term ROAS with long-term learning

3. **Campaign Management**
   - Decide when to pause underperforming campaigns
   - Identify when to scale winners
   - Flag creative fatigue
   - Recommend strategic pivots

4. **Strategic Thinking**
   - Consider broader patterns (not just yesterday's data)
   - Think about seasonal factors, day-of-week patterns
   - Balance multiple demographics (don't over-optimize to one)
   - Think about customer journey (awareness → consideration → conversion)

## Memory Access

You have access to three memory layers:

**1. Pinecone Vector DB (Semantic Memory)**

Query similar past scenarios:
```
Namespace: scenario-outcomes-zen-med-clinic
Query: [embed current situation description]
Returns: 10 most similar past scenarios with outcomes
```

Use cases:
- "What happened when we ran similar content with similar audiences?"
- "How have geographic budget shifts performed historically?"
- "What ROAS patterns emerge for this demographic?"

**2. Neo4j Graph DB (Structured Facts)**

Query relationships and performance:
```cypher
// Get platform performance trends
MATCH (c:Campaign {brand_id: 'zen-med-clinic'})-[:USED_PLATFORM]->(p:Platform)
MATCH (c)-[:ACHIEVED]->(perf:Performance)
WHERE perf.date >= date() - duration({days: 7})
RETURN p.name, avg(perf.roas) as avg_roas, sum(perf.spend) as total_spend
ORDER BY avg_roas DESC

// Get content performance by demographic
MATCH (content:Content)-[:RAN_IN]->(camp:Campaign)-[:TARGETED]->(demo:Demographic)
MATCH (camp)-[:ACHIEVED]->(perf:Performance)
WHERE camp.brand_id = 'zen-med-clinic'
RETURN content.id, demo.name, avg(perf.roas) as avg_roas, count(camp) as sample_size
ORDER BY avg_roas DESC
```

Use cases:
- "Which demographics are performing best?"
- "What content works with which audiences?"
- "Are there emerging patterns in time-of-day performance?"

**3. Short-Term JSON Files**

Location: `/clients/zen-med-clinic/data/recent-decisions.json`  
Contains: Last 7 days of tactical decisions and immediate outcomes

## Decision-Making Framework

For each decision:

1. **Query Similar Scenarios**
   - Generate description of current situation
   - Embed and query Pinecone
   - Review what worked/didn't work in past

2. **Analyze Current Data**
   - Query Neo4j for relevant relationships
   - Look for trends, not just single data points
   - Consider statistical significance (sample size matters)

3. **Consider Constraints**
   - Budget limits
   - Brand guidelines
   - Demographic priorities
   - Platform minimums

4. **Make Recommendation**
   - State decision clearly
   - Quantify expected outcome
   - Provide reasoning
   - Include confidence level

5. **Log for Learning**
   - Every decision should be stored as a scenario
   - Will be evaluated against actual outcome
   - System learns from your decisions

## Example Decision Output

```json
{
  "decision_type": "budget_reallocation",
  "date": "2026-02-03",
  "recommendation": "Shift $150/day from Facebook to Instagram for wellness-focused-women-35-50 demographic",
  "reasoning": "Instagram ROAS for this demographic is 4.2 vs Facebook's 2.1. Similar historical scenarios (n=8) show average +18% ROAS lift when shifting budget to high-performer. Content type (calm, minimal aesthetic) has 0.72 correlation with Instagram success.",
  "expected_outcome": "Overall ROAS increase from 3.2 to 3.7 within 3-5 days",
  "confidence": 0.85,
  "risks": [
    "Facebook sample size smaller (7 days vs 14 for Instagram)",
    "Weekend performance may differ from weekday"
  ],
  "constraints_checked": [
    "Instagram budget won't exceed 50% of total",
    "Facebook maintains minimum $50/day",
    "Reserve budget for testing maintained at 15%"
  ]
}
```

## Key Principles

**Balance is Critical**
- Don't over-optimize to one demographic (maintain portfolio)
- Don't abandon platforms too quickly (need statistical significance)
- Don't stop testing (reserve 15% for discovery)

**Context Matters**
- Day of week affects performance (weekend vs weekday)
- Time in campaign lifecycle (new campaigns need time to optimize)
- Seasonality (holidays, weather, local events)

**Learn Continuously**
- Every campaign is a learning opportunity
- Surprising results are valuable (understand why)
- Update beliefs based on evidence

**Think Long-Term**
- Short-term ROAS isn't everything
- Building audience understanding takes time
- Strategic positioning matters more than tactical wins

## Collaboration with Other Agents

**Creative Intelligence Agent:** Provides content performance analysis and rotation recommendations. You decide whether to implement.

**Media Buyer Agent:** Executes your strategic decisions tactically (bids, targeting details).

**Cultural Anthropologist Agent:** Provides "why" behind performance patterns. Use to inform strategy.

**Data Scientist Agent:** Provides statistical analysis and predictions. Use to validate decisions.

**Client Translator Agent:** Takes your decisions and explains them to client. Frame everything for business impact.

---

You are autonomous within your domain but should flag major strategic shifts for human review:
- Budget changes >30%
- New platform recommendations
- Major demographic pivots
- Performance significantly below targets (ROAS <2.0 for >7 days)
```

---

### Dashboard Architects

#### 10. Dashboard Architect Agent (`dashboard-architect.md`)

**Purpose:** Design overall dashboard structure and coordinate other dashboard agents

**Responsibilities:**
- Define page hierarchy (Level 1, 2, 3 views)
- Coordinate Dashboard UX, Data Viz, and API agents
- Create overall component architecture
- Configure Next.js + FastAPI projects
- Populate brand-specific config

**Output:** Complete dashboard codebase in `/clients/{brand-name}/dashboard/`

**Process:**
1. Copy template dashboard from `/templates/dashboard/`
2. Update `config.json` with brand specifics:
   - Brand name, logo, colors (from brand-config.json and website scrape)
   - API endpoint URLs
   - Google Drive folder ID
   - Timezone
3. Coordinate with other dashboard agents to populate components
4. Create deployment instructions

**config.json example:**
```json
{
  "client_name": "Zen Med Clinic",
  "brand_id": "zen-med-clinic",
  "logo_url": "/assets/zen-med-logo.svg",
  "brand_colors": {
    "primary": "#2C5F4F",
    "secondary": "#8ABAAA",
    "accent": "#E8D5B7",
    "neutral": "#F5F5F5"
  },
  "api_endpoint": "http://localhost:8001",
  "n8n_endpoint": "https://n8n.yourserver.com/webhook/zen-med-clinic",
  "google_drive_folder_id": "abc123xyz",
  "pinecone_namespace_prefix": "zen-med-clinic",
  "neo4j_database": "marketing-automation",
  "timezone": "America/Los_Angeles",
  "currency": "USD"
}
```

---

#### 11. Data Visualization Agent (`data-visualization.md`)

**Purpose:** Design specific charts, graphs, and metrics displays

**Input:**
- brand-config.json (metrics priorities)
- Dashboard architecture plan

**Responsibilities:**
- Choose appropriate chart types for each metric
- Design executive summary visualizations (sparklines, trend indicators)
- Create detailed metrics views (time-series, breakdowns)
- Design content library performance overlays
- Create geographic heat map visualization

**Outputs:**
- Component specifications for each visualization
- Mock data structures for testing
- Recharts/Chart.js configuration code

**Key decisions:**
- **Executive view:** Minimal charts, focus on KPIs + narrative
- **Category views:** Platform comparison (bar chart), trend over time (line chart), demographic breakdown (donut chart)
- **Detailed metrics:** Time-series with multiple metrics (line chart with dual axis), comparison tables, scatter plots for correlation analysis

---

#### 12. Dashboard UX Agent (`dashboard-ux.md`)

**Purpose:** Design information architecture and user flows

**Responsibilities:**
- Define progressive disclosure strategy (Level 1 → 2 → 3)
- Design navigation patterns
- Determine what information is visible when
- Create responsive layouts
- Design mobile experience

**Information Architecture:**

**Level 1: Executive Dashboard (Landing Page)**
```
Hero Section:
  - Total Spend vs Budget (progress bar)
  - ROAS (large number with trend arrow)
  - Conversions (number + week-over-week %)
  - Revenue (number + week-over-week %)

AI Narrative Summary:
  - 2-3 sentence high-level summary
  - Written by Client Translator Agent
  - Updates daily

Top 3 Insights:
  - Alert cards (opportunities or issues)
  - Clickable to dive deeper

7-Day Performance Trend:
  - Sparkline for key metrics
  - Hover for daily breakdown
```

**Level 2: Category Views (One Click Deep)**
```
Campaigns Tab:
  - Active campaigns list
  - Spend by platform (bar chart)
  - ROAS by platform (comparison)
  - Click any campaign → drill down

Content Tab:
  - Visual grid of all content
  - Performance overlay (ROAS, CTR badges)
  - Filter by: status, tone, aesthetic, platform
  - Click any asset → full analysis

Audiences Tab:
  - Demographic performance cards
  - Psychographic insights
  - Best-performing content per demo
  - Click any demo → deep dive

Geography Tab:
  - Heat map of performance by distance
  - Table: area → impressions/spend/ROAS
  - Insights on sweet spot radius
```

**Level 3: Detailed Metrics (Two Clicks Deep)**
```
Accessible from any Level 2 view via "See Details" button

Detailed Metrics View:
  - All media buyer metrics (CPC, CPM, CTR, frequency, reach, impressions)
  - Time-series selector (daily, weekly, monthly)
  - Comparison period selector
  - Export to CSV
  - Filter by: platform, campaign, demographic, date range
```

---

#### 13. Dashboard API Agent (`dashboard-api.md`)

**Purpose:** Design FastAPI backend that serves dashboard data

**Responsibilities:**
- Design API endpoints
- Create data aggregation services
- Connect to n8n, Pinecone, Neo4j
- Implement caching for performance
- Generate API documentation

**Outputs:**
- Complete FastAPI backend code
- API documentation (OpenAPI/Swagger)
- Service layer for data queries

**Key Endpoints:**

```python
# routers/performance.py

@router.get("/api/performance/executive-summary")
async def get_executive_summary(
    date_range: str = "7d"
) -> ExecutiveSummary:
    """
    Returns:
    - Total spend, budget remaining
    - ROAS, conversions, revenue
    - Week-over-week changes
    - AI-generated narrative (from n8n → Client Translator Agent)
    - Top 3 insights/alerts
    """
    pass

@router.get("/api/performance/platform-breakdown")
async def get_platform_breakdown(
    date_range: str = "7d"
) -> List[PlatformMetrics]:
    """
    Returns performance by platform:
    - Platform name
    - Spend, impressions, clicks, conversions
    - ROAS, CTR, CPM, CPC
    """
    pass

@router.get("/api/performance/time-series")
async def get_time_series(
    metric: str,  # "roas", "spend", "conversions", etc.
    date_range: str = "30d",
    granularity: str = "daily"  # "daily", "weekly", "monthly"
) -> TimeSeriesData:
    """
    Returns time-series data for any metric
    """
    pass

@router.get("/api/performance/detailed-metrics")
async def get_detailed_metrics(
    date_range: str = "7d",
    platform: Optional[str] = None,
    campaign_id: Optional[str] = None,
    demographic: Optional[str] = None
) -> DetailedMetrics:
    """
    Returns granular media buyer metrics:
    - CPC, CPM, CTR
    - Frequency, reach, impressions
    - Quality score, relevance score
    - Engagement rate
    - All filterable by platform, campaign, demographic
    """
    pass

# routers/content.py

@router.get("/api/content/library")
async def get_content_library(
    status: Optional[str] = None,  # "active", "resting", "archived"
    tone: Optional[str] = None,
    aesthetic: Optional[str] = None
) -> List[ContentAsset]:
    """
    Returns all content with:
    - Drive URL for viewing
    - Semantic profile (tones, aesthetics, narrative)
    - Performance metrics (ROAS, CTR, total impressions)
    - Current campaigns using it
    - Fatigue score
    - Upload date, last used date
    """
    pass

@router.get("/api/content/{content_id}/analysis")
async def get_content_analysis(content_id: str) -> ContentAnalysis:
    """
    Deep dive on single asset:
    - Full semantic profile
    - Performance by demographic
    - Performance by platform
    - Performance by time-of-day
    - Similar content and their performance
    - AI insights: why this performs well/poorly
    """
    pass

# routers/insights.py

@router.get("/api/insights/narrative")
async def get_ai_narrative(
    date_range: str = "7d"
) -> str:
    """
    Fetches latest AI-generated narrative from n8n
    Generated by Client Translator Agent
    Human-friendly summary of performance
    """
    pass

@router.get("/api/insights/opportunities")
async def get_opportunities() -> List[Opportunity]:
    """
    Strategic opportunities identified by CSO Agent:
    - Underutilized content
    - Audience expansion possibilities
    - Budget optimization recommendations
    - Creative requests
    """
    pass

# routers/campaigns.py

@router.get("/api/campaigns/active")
async def get_active_campaigns() -> List[Campaign]:
    """
    All currently running campaigns with:
    - Platform, demographic, budget
    - Performance to date
    - Status (active, paused)
    """
    pass

@router.get("/api/campaigns/{campaign_id}")
async def get_campaign_detail(campaign_id: str) -> CampaignDetail:
    """
    Full detail on single campaign:
    - All metrics
    - Content being used
    - Demographic targeting
    - Performance trend over life of campaign
    - AI recommendations for this campaign
    """
    pass

# Services

# services/n8n_client.py
class N8NClient:
    """Query n8n workflows for AI-generated insights and decisions"""
    
    async def get_latest_narrative(self) -> str:
        """Fetch narrative from Client Translator Agent"""
        pass
    
    async def get_opportunities(self) -> List[dict]:
        """Fetch strategic opportunities from CSO Agent"""
        pass

# services/pinecone_client.py
class PineconeClient:
    """Query vector DB for content profiles and similar scenarios"""
    
    async def get_content_profile(self, content_id: str) -> dict:
        """Retrieve semantic profile for content"""
        pass
    
    async def find_similar_content(self, content_id: str, top_k: int = 5) -> List[dict]:
        """Find semantically similar content"""
        pass

# services/neo4j_client.py
class Neo4jClient:
    """Query graph DB for performance data and relationships"""
    
    async def get_platform_performance(self, date_range: str) -> List[dict]:
        """Aggregate performance by platform"""
        pass
    
    async def get_content_performance_by_demographic(self, content_id: str) -> List[dict]:
        """How does this content perform with each demographic?"""
        pass
    
    async def get_demographic_preferences(self, demographic_name: str) -> dict:
        """What tones/aesthetics does this demographic respond to?"""
        pass
```

---

### Website Architects

#### 14. Website Strategist Agent (`website-strategist.md`)

**Purpose:** Determine site structure based on business model

**Input:**
- brand-config.json (business model, services)
- Brand profile (from Brand Research Agent)

**Process:**
1. Analyze business model:
   - Brick-and-mortar → Service-focused site with booking
   - E-commerce → Product showcase with Shopify integration
   - Hybrid → Both service pages and shop
2. Determine required pages
3. Define conversion goals
4. Plan integration points with n8n

**Outputs:**
- Site map
- Page specifications
- Conversion funnel design
- Integration requirements

**Example: Brick-and-Mortar Service Site**

```markdown
# Website Strategy: Zen Med Clinic

## Site Structure

### Core Pages
1. **Home** (`/`)
   - Hero: Value proposition + primary CTA
   - Services overview (3-4 key services)
   - Trust indicators (credentials, testimonials)
   - Location + hours
   - CTA: Book Appointment

2. **Services** (`/services`)
   - Detailed service descriptions
   - Pricing (if transparent)
   - What to expect
   - CTA per service: Book This Service

3. **About** (`/about`)
   - Team bios (practitioner credentials)
   - Philosophy/approach
   - Certifications
   - CTA: Meet Our Team / Book Consultation

4. **Book Appointment** (`/book-appointment`)
   - **PRIMARY CONVERSION PAGE**
   - Form: name, email, phone, service interest, preferred date/time, message
   - Visual: Calming imagery consistent with ad campaigns
   - Trust signals: "We'll respond within 24 hours"
   - Integration: Form → FastAPI → n8n → Lead Scoring → Client notification

5. **Contact** (`/contact`)
   - Location map
   - Hours
   - Phone, email
   - Simple contact form
   - Parking info

### Optional/Future Pages
- **Blog** (`/blog`) - SEO + educational content
- **FAQ** (`/faq`) - Common questions
- **Resources** (`/resources`) - Educational materials
- **Newsletter Signup** (`/newsletter`) - Lead capture without commitment

## Conversion Funnels

### Primary Funnel: Ad → Landing Page → Booking
```
Instagram/Facebook Ad (video-003: calm treatment room)
  ↓
Landing: /book-appointment?source=instagram&campaign=awareness-001
  ↓
User fills booking form
  ↓
Form → FastAPI backend → Validates
  ↓
POST to n8n webhook: /webhook/zen-med-clinic/form-submission
  ↓
n8n: Lead Scoring Workflow
  ├─→ Store in Neo4j: (Lead)-[:CAME_FROM]->(Campaign)
  ├─→ Lead Scoring Agent: Analyzes → assigns score
  ├─→ If hot lead (>90): SMS + email to owner immediately
  ├─→ If warm lead: Standard email sequence
  └─→ Dashboard: New lead notification
  ↓
Confirmation page: "Thanks! We'll be in touch within 24 hours."
  ↓
Add to retargeting pixel (Facebook, Google)
```

### Secondary Funnel: Newsletter → Nurture → Booking
```
User sees ad → clicks → lands on /newsletter
  ↓
Enters email only (low friction)
  ↓
Added to email list (Mailchimp/SendGrid via n8n)
  ↓
Nurture sequence (weekly wellness tips)
  ↓
Eventually clicks "Book Now" in email
  ↓
Returns to /book-appointment (now warmer lead)
```

## Integration Points with n8n

### Form Submissions
- `/book-appointment` form → `/api/forms/booking` → n8n webhook
- `/contact` form → `/api/forms/contact` → n8n webhook
- `/newsletter` form → `/api/forms/newsletter` → n8n webhook

### Lead Tracking
- All form submissions include:
  - `source` param (which ad campaign?)
  - UTM parameters (if from ad)
  - Referring URL
- n8n links lead to originating campaign in Neo4j
- Dashboard shows: "This lead came from video-003 on Instagram"

### Conversion Tracking
- When booking confirmed (phone call/in-person) → mark in system
- Eventually: (Lead)-[:CONVERTED_TO]->(Customer) in Neo4j
- Updates content performance: "video-003 led to 12 conversions"

## Mobile-First Design

All pages optimized for mobile (primary device for Instagram/Facebook traffic):
- Vertical video-friendly
- Tap-to-call phone number
- Simplified forms (minimal fields)
- Fast load times (<2 seconds)

## Brand Consistency

Website aesthetic must match ad content:
- Same color palette (earth tones, warm)
- Same photography style (minimal, intimate, professional)
- Consistent voice (calm, educational, welcoming)

Goal: User clicks ad → lands on site → "This is clearly the same place" (trust)
```

---

#### 15. Website Designer Agent (`website-designer.md`)

**Purpose:** Create design system and component library

**Input:**
- Website strategy (from Website Strategist)
- Brand aesthetic (from brand-config.json, website scrape)

**Responsibilities:**
- Define typography, colors, spacing
- Design component library (buttons, forms, cards, etc.)
- Create page layouts
- Ensure brand consistency
- Mobile-first responsive design

**Outputs:**
- `styles/theme.ts` (design tokens)
- Component specifications
- Layout designs

**theme.ts example:**
```typescript
// styles/theme.ts

export const theme = {
  colors: {
    // Brand colors from brand-config.json
    primary: '#2C5F4F',      // Deep green
    secondary: '#8ABAAA',    // Soft teal
    accent: '#E8D5B7',       // Warm beige
    
    // Semantic colors
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#2C2C2C',
      secondary: '#666666',
      disabled: '#999999'
    },
    
    // Feedback colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3'
  },
  
  typography: {
    fontFamily: {
      heading: "'Montserrat', sans-serif",
      body: "'Open Sans', sans-serif"
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '2rem',    // 32px
      '4xl': '2.5rem'   // 40px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    '2xl': '4rem'   // 64px
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px'
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 25px rgba(0,0,0,0.1)'
  },
  
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px'
  }
}
```

---

#### 16. Landing Page Agent (`landing-page.md`)

**Purpose:** Build high-converting pages linked from ads

**Input:**
- Creative briefs (from Creative Director)
- Website strategy
- Design system

**Responsibilities:**
- Create ad-specific landing pages
- Optimize for conversion (minimal friction)
- Match visual aesthetic of originating ad
- Implement conversion tracking

**Outputs:**
- Landing page components
- Page variants for A/B testing

**Example: `/book-appointment` Landing Page**

```tsx
// app/book-appointment/page.tsx

import { BookingForm } from '@/components/BookingForm'
import { Hero } from '@/components/Hero'

export default function BookAppointmentPage({
  searchParams
}: {
  searchParams: { source?: string; campaign?: string; utm_source?: string }
}) {
  // Track source for attribution
  const source = searchParams.source || searchParams.utm_source || 'direct'
  const campaign = searchParams.campaign || 'unknown'
  
  return (
    <main>
      <Hero 
        title="Begin Your Wellness Journey"
        subtitle="Personalized acupuncture and holistic care in Palo Alto"
        image="/images/treatment-room-calm.jpg"  {/* Matches ad creative */}
        cta="Book Your Consultation Below"
      />
      
      <Section className="bg-surface">
        <Container>
          <TrustIndicators>
            <Indicator icon="certificate" text="Licensed & Certified Practitioners" />
            <Indicator icon="clock" text="Flexible Scheduling" />
            <Indicator icon="location" text="Convenient Palo Alto Location" />
          </TrustIndicators>
          
          <BookingForm 
            source={source}
            campaign={campaign}
          />
          
          <Testimonial
            quote="After just three sessions, my chronic back pain improved dramatically. The space is so calming."
            author="Sarah M."
            demographic="Professional, Age 42"
          />
        </Container>
      </Section>
    </main>
  )
}
```

**Conversion Optimization:**
- Hero image matches ad aesthetic (if they saw calm treatment room ad, they see calm treatment room here)
- Minimal navigation (reduce exits)
- Form above fold on mobile
- Trust signals before form
- Single CTA (book appointment, not 5 different options)

---

#### 17. Form/Conversion Agent (`form-conversion.md`)

**Purpose:** Design and implement lead capture forms

**Responsibilities:**
- Form field optimization (minimal required fields)
- Validation and error handling
- Integration with FastAPI backend → n8n
- Conversion tracking
- Thank you pages

**Outputs:**
- Form components (BookingForm, NewsletterForm, ContactForm)
- Backend form handlers
- Thank you page templates

**Example: BookingForm Component**

```tsx
// components/BookingForm.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookingFormProps {
  source: string
  campaign: string
}

export function BookingForm({ source, campaign }: BookingFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    preferredDate: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/forms/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source,
          campaign,
          submittedAt: new Date().toISOString(),
          utmParams: {
            source: new URLSearchParams(window.location.search).get('utm_source'),
            medium: new URLSearchParams(window.location.search).get('utm_medium'),
            campaign: new URLSearchParams(window.location.search).get('utm_campaign')
          }
        })
      })

      if (!response.ok) throw new Error('Submission failed')

      // Redirect to thank you page
      router.push('/book-appointment/thank-you')
      
      // Fire conversion tracking pixel
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-XXXXXX/XXXXXX',
          'transaction_id': '',
          'value': 500,  // Average appointment value
          'currency': 'USD'
        })
      }
      
    } catch (err) {
      setError('Something went wrong. Please try again or call us at (650) 555-0123.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Book Your Appointment</h2>
      
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Your full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="you@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone *</label>
        <input
          id="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="(650) 555-0123"
        />
      </div>

      <div className="form-group">
        <label htmlFor="service">Service Interest</label>
        <select
          id="service"
          value={formData.service}
          onChange={(e) => setFormData({...formData, service: e.target.value})}
        >
          <option value="">Select a service...</option>
          <option value="acupuncture">Acupuncture</option>
          <option value="herbal-medicine">Herbal Medicine</option>
          <option value="cupping">Cupping Therapy</option>
          <option value="consultation">General Consultation</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="message">Tell us about your wellness goals</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="e.g., 'I've had lower back pain for 6 months...' (optional)"
          rows={4}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Submitting...' : 'Book My Consultation'}
      </button>

      <p className="privacy-note">
        We respect your privacy. Your information is secure and will not be shared.
      </p>
    </form>
  )
}
```

**Backend Handler:**

```python
# backend/routers/forms.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from services.n8n_webhook import N8NWebhookService
from typing import Optional

router = APIRouter(prefix="/api/forms", tags=["forms"])

class BookingFormData(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: Optional[str] = None
    message: Optional[str] = None
    preferredDate: Optional[str] = None
    source: str
    campaign: str
    submittedAt: str
    utmParams: Optional[dict] = None

@router.post("/booking")
async def submit_booking_form(form: BookingFormData):
    """
    1. Validate form data (Pydantic does basic validation)
    2. Send to n8n webhook for processing
    3. Return success response
    """
    
    # Send to n8n
    n8n_service = N8NWebhookService()
    
    try:
        response = await n8n_service.send_form_submission(
            form_type="booking",
            data=form.dict()
        )
        
        if not response.get('success'):
            raise HTTPException(status_code=500, detail="Failed to process submission")
        
        return {
            "success": True,
            "message": "Thank you! We'll contact you within 24 hours."
        }
        
    except Exception as e:
        # Log error
        print(f"Form submission error: {e}")
        raise HTTPException(status_code=500, detail="Submission failed")


# services/n8n_webhook.py

import httpx
from typing import Dict, Any

class N8NWebhookService:
    def __init__(self):
        self.base_url = "https://n8n.yourserver.com/webhook/zen-med-clinic"
    
    async def send_form_submission(self, form_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send form submission to n8n workflow
        
        n8n will:
        1. Store in Neo4j as (Lead) node
        2. Link to campaign via source/campaign params
        3. Send to Lead Scoring Agent
        4. Route based on score (hot/warm/cold)
        5. Notify dashboard
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/form-submission",
                json={
                    "form_type": form_type,
                    "data": data,
                    "timestamp": data.get('submittedAt')
                },
                timeout=10.0
            )
            
            return response.json()
```

---

#### 18. E-commerce Agent (`ecommerce.md`)

**Purpose:** Build Shopify integration for e-commerce clients

**Triggered:** Only when `business_model` includes "ecommerce"

**Responsibilities:**
- Set up Shopify headless commerce
- Product pages on Next.js site
- Cart functionality
- Webhook handlers for purchases
- Integration with n8n for purchase attribution

**Key Integration: Purchase Attribution**

When a purchase is completed:
```
Customer completes checkout on Shopify
  ↓
Shopify webhook fires → Website backend receives
  ↓
Backend extracts:
  - Customer info (email, name)
  - Products purchased
  - Order total
  - Referrer (if available)
  ↓
POST to n8n: /webhook/brand-id/shopify-purchase
  ↓
n8n: E-commerce Conversion Workflow
  ├─→ Match customer email to (Lead) node in Neo4j
  ├─→ If match found: Link (Lead)-[:CONVERTED_TO]->(Purchase)
  ├─→ Trace back to originating campaign
  ├─→ Update content metadata: "video-003 led to purchase, $2,400 revenue"
  ├─→ CSO Agent: Analyze true ROAS (not just lead, but purchase)
  ├─→ Scale content that drives purchases
  └─→ Dashboard: Show purchase attribution
```

---

#### 19. Website Backend Agent (`website-backend.md`)

**Purpose:** Build FastAPI backend for website

**Responsibilities:**
- Form submission endpoints
- Shopify webhook handlers (if e-commerce)
- Email service integration
- n8n webhook forwarding
- Error handling and logging

**Outputs:**
- Complete FastAPI backend code
- Deployment instructions

**Structure:**
```
backend/
  routers/
    forms.py           # POST /api/forms/*
    appointments.py    # Appointment management (future)
    shopify.py         # Shopify webhooks (if e-commerce)
  services/
    n8n_webhook.py     # Forward to n8n
    email_service.py   # Send confirmation emails
    shopify_client.py  # Query Shopify (if e-commerce)
  models/
    form_schemas.py    # Pydantic models
  main.py
  requirements.txt
```

---

### Cross-System Agents

#### 20. Integration Orchestrator Agent (`integration-orchestrator.md`)

**Purpose:** Ensure n8n + dashboard + website all communicate correctly

**Responsibilities:**
- Verify webhook connections
- Test data flow end-to-end
- Create integration diagrams
- Document API contracts
- Generate integration tests

**Outputs:**
- Integration documentation
- Data flow diagrams
- API contract specifications
- Test scripts

**Example Data Flow Documentation:**

```markdown
# Integration Map: Zen Med Clinic

## Form Submission Flow

Website Frontend → Website Backend → n8n → Neo4j + Dashboard

### Step-by-Step:

1. **User submits form** (`/book-appointment`)
   - Component: `BookingForm.tsx`
   - Event: `onSubmit`

2. **Frontend sends to backend**
   - POST to `/api/forms/booking`
   - Payload: `{name, email, phone, service, source, campaign, utmParams}`

3. **Backend validates and forwards**
   - Router: `routers/forms.py`
   - Validates with Pydantic
   - Calls: `N8NWebhookService.send_form_submission()`

4. **n8n receives webhook**
   - Endpoint: `POST /webhook/zen-med-clinic/form-submission`
   - Workflow: `form-ingestion.json`

5. **n8n processes**
   - Node 1: Parse form data
   - Node 2: Create (Lead) node in Neo4j
   - Node 3: Link to (Campaign) if source/campaign provided
   - Node 4: Call Lead Scoring Agent (Claude API)
   - Node 5: Route based on score:
     - Hot (>90): SMS + email to owner
     - Warm (70-89): Email sequence
     - Cold (50-69): Newsletter list
   - Node 6: Update dashboard data (webhook to dashboard API)

6. **Dashboard updates**
   - Dashboard backend receives webhook
   - Updates recent leads cache
   - Frontend polls `/api/leads/recent` → shows new lead

### Webhook Contracts:

**Website Backend → n8n:**
```json
POST /webhook/zen-med-clinic/form-submission
{
  "form_type": "booking",
  "data": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "(650) 555-0123",
    "service": "acupuncture",
    "message": "Chronic lower back pain...",
    "source": "instagram",
    "campaign": "awareness-001",
    "submittedAt": "2026-02-03T14:23:00Z",
    "utmParams": {
      "source": "instagram",
      "medium": "cpc",
      "campaign": "awareness-launch"
    }
  }
}
```

**n8n → Dashboard:**
```json
POST /api/webhooks/new-lead
{
  "lead_id": "lead-001",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "source": "instagram",
  "campaign": "awareness-001",
  "score": 85,
  "status": "warm",
  "timestamp": "2026-02-03T14:23:05Z"
}
```

### Error Handling:

- **Website backend timeout (10s)**: Return error to user, log for retry
- **n8n webhook down**: Queue submission, retry 3x with exponential backoff
- **Neo4j write failure**: n8n workflow should retry, alert if persistent
- **Dashboard webhook failure**: Non-critical, don't block lead processing
```

---

#### 21. Documentation Agent (`documentation.md`)

**Purpose:** Create all system documentation

**Responsibilities:**
- System overview for client's team
- Dashboard user guide
- Content upload instructions
- API documentation
- Troubleshooting guides

**Outputs:**
- `/clients/{brand-name}/docs/system-overview.md`
- `/clients/{brand-name}/docs/dashboard-guide.md`
- `/clients/{brand-name}/docs/content-upload-guide.md`
- `/clients/{brand-name}/docs/api-documentation.md`

**Example: Content Upload Guide**

```markdown
# Content Upload Guide: Zen Med Clinic

## How to Add New Videos or Images

Your marketing system automatically analyzes and optimizes any content you upload. Here's how:

### Step 1: Prepare Your Content

**Video Guidelines:**
- Format: MP4, MOV
- Resolution: Minimum 1080p (1920x1080)
- Orientation: Vertical (9:16) for Instagram, Square (1:1) for Facebook, or Horizontal (16:9) for all platforms
- Duration: 15-60 seconds optimal
- File size: Under 500MB

**Image Guidelines:**
- Format: JPG, PNG
- Resolution: Minimum 1080x1080 (square) or 1080x1920 (vertical)
- File size: Under 10MB
- Quality: High resolution, well-lit, in focus

### Step 2: Upload to Google Drive

1. Go to your shared Google Drive folder: [Link]
2. Navigate to the `content/` folder
3. Drag and drop your video or image files

**Important:** Name your files descriptively (e.g., `acupuncture-treatment-calm-lighting.mp4` not `IMG_1234.mp4`)

### Step 3: System Analyzes Automatically

Within 2-3 minutes of upload:
- Our system analyzes the content (tone, aesthetic, visual elements, narrative)
- Generates a detailed profile
- Determines optimal audience targeting
- Predicts performance
- Makes it available to campaigns

### Step 4: Review in Dashboard

1. Log into your dashboard
2. Go to Content Library
3. Find your newly uploaded content
4. Review the analysis:
   - Emotional tones detected
   - Visual aesthetics
   - Recommended audience targeting
   - Predicted ROAS
5. Content status will show "Ready"

### Step 5: System Deploys Automatically

Based on performance predictions and current campaign needs, the system will:
- Test new content with small budget first
- If it performs well, scale automatically
- Rotate it with existing content to prevent fatigue
- Monitor performance continuously

You don't need to do anything—the system handles deployment.

## What Makes Content Perform Well?

Based on your brand and audience:

**✅ Good:**
- Calm, peaceful tone
- Minimal, uncluttered visuals
- Warm color palettes (earth tones, beige, soft browns)
- Shows your physical space
- Includes local landmarks (Stanford campus visible = good for local awareness)
- Slow, deliberate pacing
- Professional but approachable feel

**❌ Avoid:**
- Overly clinical/sterile environments
- Loud, energetic music
- Fast-paced editing
- Too much text overlay
- Stock photos (use your actual space)

## Content Requests

The system will occasionally request specific content types based on what's working. You'll see these in your dashboard under "Insights → Content Requests."

Example request:
> "We're seeing strong performance with calm, minimal content featuring your treatment rooms. Request: Short video (20-30 sec) showing consultation room with warm afternoon light. This will help expand reach to 'stressed-professionals-25-40' demographic."

## Questions?

- "Why isn't my content being used?" → Check Content Library for analysis. May be flagged for quality issues or may be waiting for optimal timing.
- "Can I request specific targeting?" → Yes! Contact us and we'll adjust manually.
- "How do I know what's working?" → Dashboard shows performance for each asset. Look for ROAS (return on ad spend) metric.

**Contact:** support@yourmarketing.com
```

---

#### 22. Version Control Agent (`version-control.md`)

**Purpose:** Manage system updates, migrations, and rollbacks

**Responsibilities:**
- Track which clients are on which version
- Design update procedures
- Create migration scripts
- Test updates before deployment
- Execute rollbacks if needed

**Key File:** `/clients/{brand-name}/version.json`

```json
{
  "factory_version": "1.0.0",
  "spawned_date": "2026-01-15",
  "last_updated": "2026-01-15",
  "components": {
    "n8n_workflows": "1.0.0",
    "dashboard_frontend": "1.0.0",
    "dashboard_backend": "1.0.0",
    "website_frontend": "1.0.0",
    "website_backend": "1.0.0",
    "runtime_agents": "1.0.0"
  },
  "custom_modifications": [],
  "update_history": []
}
```

**Update Process:**

When new Factory version (v1.1.0) is released:

1. **Version Control Agent analyzes changelog:**
   - What changed?
   - Breaking changes?
   - Migration required?

2. **For each client:**
   - Read current version from `version.json`
   - Determine update path (v1.0.0 → v1.1.0)
   - Check for custom modifications (may conflict)
   - Generate update plan

3. **Update Plan Example:**

```markdown
# Update Plan: Zen Med Clinic (v1.0.0 → v1.1.0)

## Changes in v1.1.0:
- Added lead scoring workflow (NEW)
- Improved creative fatigue algorithm (ENHANCEMENT)
- Added detailed metrics dashboard page (NEW)
- Changed Pinecone metadata structure (BREAKING - migration required)

## Compatibility Assessment:
- ✅ No custom modifications detected
- ⚠️ Pinecone migration required
- ✅ All other changes non-breaking

## Update Steps:

### Phase 1: Backup (Estimated: 5 min)
1. Export current Neo4j data
2. Backup Pinecone vectors
3. Backup current workflow files
4. Create restore point

### Phase 2: Database Migration (Estimated: 10 min)
1. Run Pinecone metadata migration:
   - Script: `/versions/v1.1.0/migrations/pinecone_metadata_update.py`
   - Action: Transform metadata from old to new structure
   - Affects: ~150 content vectors
   - Downtime: None (read-only during migration)

### Phase 3: n8n Workflows (Estimated: 5 min)
1. Import new workflow: `lead-scoring.json`
2. Replace workflow: `creative-rotation.json` (improved algorithm)
3. Test webhooks

### Phase 4: Dashboard (Estimated: 10 min)
1. Pull latest dashboard code
2. Install dependencies (`npm install`, `pip install -r requirements.txt`)
3. Build frontend (`npm run build`)
4. Deploy new version
5. Verify: New "Detailed Metrics" page renders

### Phase 5: Runtime Agents (Estimated: 5 min)
1. Update agent prompts with improved instructions
2. No action required (prompts loaded dynamically)

### Phase 6: Validation (Estimated: 10 min)
1. Test form submission flow
2. Verify lead scoring works
3. Check dashboard metrics load
4. Confirm n8n workflows running
5. Monitor for errors (first hour)

## Total Estimated Time: 45 minutes
## Risk Level: Medium (database migration)
## Rollback Available: Yes (restore from Phase 1 backup)

## Recommendation: Proceed with update
```

4. **Execute Update:**
   - Run migration scripts
   - Replace workflow files
   - Deploy dashboard/website updates
   - Update `version.json`

5. **Validation:**
   - Run automated tests
   - Check n8n workflows executing
   - Verify dashboard loads
   - Monitor for errors for 24 hours

6. **Rollback Procedure** (if update fails):
```markdown
# Rollback Procedure

If update fails:

1. **Stop all n8n workflows** (prevent data corruption)
2. **Restore Pinecone vectors** from backup
3. **Restore Neo4j data** from export
4. **Restore workflow files** from backup
5. **Redeploy previous dashboard version**
6. **Update version.json** to mark rollback
7. **Restart n8n workflows**
8. **Validate system functioning**

Rollback time: ~15-20 minutes
```

---

#### 23. QA Agent (`qa.md`)

**Purpose:** Final validation before declaring spawn complete

**Responsibilities:**
- Verify all files created
- Check variable substitution
- Validate JSON syntax
- Test API connections
- Review strategy coherence
- Ensure client deliverables are compelling

**Checklist:**

```markdown
# QA Checklist: Zen Med Clinic

## File Structure
- [ ] All directories created
- [ ] /research/ folder with brand-profile.md and competitive-landscape.md
- [ ] /strategy/ folder with 3 strategy docs + brand-config.json
- [ ] /creative/ folder with briefs and copy variations
- [ ] /automation/ folder with 9 workflows + 6 agent prompts
- [ ] /dashboard/ folder with frontend + backend code
- [ ] /website/ folder with frontend + backend code
- [ ] /client-deliverables/ folder with 3 docs
- [ ] /docs/ folder with 4 system docs
- [ ] version.json present

## Configuration Validation
- [ ] brand-config.json valid JSON
- [ ] All required fields populated
- [ ] Demographics defined with psychographics
- [ ] Budget allocations sum to 1.0
- [ ] Platforms match available integrations
- [ ] Geographic strategy makes sense for business model

## n8n Workflows
- [ ] All 9 workflow files present
- [ ] Valid JSON syntax (no parse errors)
- [ ] All {VARIABLES} replaced with actual values
- [ ] Webhook URLs configured
- [ ] Claude API credentials placeholder present
- [ ] Platform API placeholders documented

## Dashboard
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend starts without errors (`python main.py`)
- [ ] config.json populated with brand colors/logo
- [ ] API endpoints defined for all routes
- [ ] Database connection strings configured

## Website
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend starts without errors (`python main.py`)
- [ ] All pages created per site map
- [ ] Forms present and connected to backend
- [ ] config.json populated with brand specifics
- [ ] E-commerce components (if applicable)

## Integration
- [ ] Form submission → backend → n8n webhook path documented
- [ ] Dashboard ← n8n webhook documented
- [ ] Website ← backend API documented
- [ ] All webhook URLs consistent across systems

## Documentation Quality
- [ ] System overview clear and comprehensive
- [ ] Dashboard guide non-technical, user-friendly
- [ ] Content upload guide specific and actionable
- [ ] No references to "AI" or "Claude" in client docs
- [ ] Deployment instructions complete

## Client Deliverables
- [ ] Onboarding presentation compelling
- [ ] Strategy overview business-focused (not technical)
- [ ] Dashboard guide includes screenshots
- [ ] All docs formatted professionally

## Database Initialization
- [ ] Pinecone namespace created for this client
- [ ] Neo4j constraints/indexes created
- [ ] Schemas documented in /data/schemas.md

## Strategy Coherence
- [ ] Geographic strategy matches business model

- [ ] Demographics align with brand positioning
- [ ] Budget allocation makes sense
- [ ] Content strategy aligns with demographics
- [ ] Platform selection justified

## Creative Quality
- [ ] At least 3 video briefs with specific direction
- [ ] At least 2 image set briefs
- [ ] Ad copy variations match brand voice
- [ ] Briefs include strategic rationale
- [ ] All briefs reference demographics from brand-config

## Final Check
- [ ] No TODO comments in code
- [ ] No placeholder text in client-facing docs
- [ ] All links/URLs functional
- [ ] Consistent naming (brand_id) across all files
- [ ] Version number correct in version.json
```

**If all checks pass:**
```
✓ QA Complete: Zen Med Clinic system ready for deployment
```

**If checks fail:**
```
⚠️ QA Issues Detected:
- [ ] Issue 1: Missing website backend deployment instructions
- [ ] Issue 2: Dashboard config.json has placeholder logo URL
- [ ] Issue 3: Strategy document references wrong demographic name

→ Orchestrator: Fix issues and re-run QA
```

---

## Layer 2: Spawned Systems

### Directory Structure (Complete)

```
/clients/zen-med-clinic/
  
  /research/
    brand-profile.md                    # Output from Brand Research Agent
    competitive-landscape.md            # Output from Competitive Intelligence Agent
  
  /strategy/
    campaign-plan.md                    # Output from Strategist Agent
    platform-selection.md               # Output from Strategist Agent
    budget-allocation.md                # Output from Strategist Agent
  
  /creative/
    /briefs/
      video-concept-1.md                # Output from Creative Director Agent
      video-concept-2.md
      video-concept-3.md
      image-set-1.md
      image-set-2.md
    /copy/
      ad-copy-variations.json           # Output from Creative Director Agent
  
  /automation/                          # n8n + Runtime Agents
    /workflows/
      content-ingestion.json
      daily-performance.json
      weekly-strategy.json
      creative-rotation.json
      budget-optimization.json
      learn-and-remember.json
      form-ingestion.json
      lead-scoring.json
      shopify-integration.json          # (if e-commerce)
    
    /prompts/
      chief-strategy-officer.md
      creative-intelligence.md
      media-buyer.md
      cultural-anthropologist.md
      data-scientist.md
      client-translator.md
    
    deployment-guide.md
  
  /dashboard/
    /frontend/                          # Next.js TypeScript
      /components/
        ExecutiveSummary.tsx
        PerformanceCharts.tsx
        ContentLibrary.tsx
        AudienceInsights.tsx
        GeographicHeatmap.tsx
        CampaignTimeline.tsx
        DetailedMetrics.tsx
        Filters.tsx
        MetricCard.tsx
      /pages/
        index.tsx
        campaigns/index.tsx
        content/index.tsx
        audiences/index.tsx
        geography/index.tsx
        insights/index.tsx
        detailed-metrics/index.tsx
      /hooks/
        usePerformanceData.ts
        useContentLibrary.ts
        useCampaigns.ts
      /utils/
        api.ts
        formatters.ts
      /styles/
        globals.css
      package.json
      next.config.js
      tsconfig.json
    
    /backend/                           # FastAPI Python
      /routers/
        performance.py
        content.py
        campaigns.py
        insights.py
        leads.py
        webhooks.py
      /services/
        n8n_client.py
        pinecone_client.py
        neo4j_client.py
      /models/
        schemas.py
      main.py
      requirements.txt
    
    config.json
    README.md
  
  /website/
    /frontend/                          # Next.js TypeScript
      /components/
        Hero.tsx
        Navigation.tsx
        Footer.tsx
        ServiceShowcase.tsx
        BookingForm.tsx
        NewsletterSignup.tsx
        ContactForm.tsx
        LocationMap.tsx
        TestimonialCarousel.tsx
        # E-commerce (if applicable)
        ProductGrid.tsx
        ProductDetail.tsx
        ShoppingCart.tsx
      /app/                             # App Router
        page.tsx                        # Home
        about/page.tsx
        services/page.tsx
        book-appointment/
          page.tsx
          thank-you/page.tsx
        contact/page.tsx
        newsletter/page.tsx
        # E-commerce routes (if applicable)
        shop/
          page.tsx
          [category]/page.tsx
        product/[id]/page.tsx
        cart/page.tsx
      /styles/
        theme.ts
        globals.css
      package.json
      next.config.js
      tsconfig.json
    
    /backend/                           # FastAPI Python
      /routers/
        forms.py
        appointments.py
        shopify.py                      # (if e-commerce)
      /services/
        n8n_webhook.py
        email_service.py
        shopify_client.py
      /models/
        form_schemas.py
      main.py
      requirements.txt
    
    config.json
    README.md
  
  /data/
    schemas.md                          # Documents Pinecone + Neo4j schemas for this client
  
  /docs/
    system-overview.md
    dashboard-guide.md
    content-upload-guide.md
    api-documentation.md
  
  /client-deliverables/
    onboarding-presentation.md
    strategy-overview.pdf               # (formatted version of .md)
    dashboard-guide.pdf                 # (formatted version of docs/dashboard-guide.md)
  
  brand-config.json                     # Master configuration
  version.json                          # Version tracking
```

---

## Database Architecture (Detailed)

### Pinecone Namespaces

**Index:** `marketing-automation` (shared across all clients)

**Namespace Structure:**

```
marketing-automation/
├─ content-essence-zen-med-clinic
│  Purpose: Semantic profiles of all creative assets
│  Embedding: Rich narrative description of content
│  Metadata: Tones, aesthetics, colors, composition, narrative elements, performance
│  Query: "Find similar content" OR "Find fresh content with X aesthetic"
│
├─ scenario-outcomes-zen-med-clinic
│  Purpose: Campaign scenarios + outcomes for learning
│  Embedding: Full context description (content + audience + platform + time + outcome)
│  Metadata: All scenario parameters + performance metrics
│  Query: "What happened in similar situations?"
│
├─ audience-psychographics-zen-med-clinic
│  Purpose: Deep understanding of demographic behaviors
│  Embedding: Rich description of who the audience is and what they care about
│  Metadata: Demographic attrs, preferences, pain points, decision patterns
│  Query: "Who is this demographic really?"
│
├─ narrative-patterns-zen-med-clinic
│  Purpose: Story arc and messaging theme effectiveness
│  Embedding: Description of narrative structure and its resonance
│  Metadata: Narrative type, performance, context
│  Query: "What stories work with this audience?"
│
└─ cross-campaign-learnings
   Purpose: Meta-insights across all clients (anonymized)
   Embedding: Pattern description that applies beyond single brand
   Metadata: Industry, business model, insight type, confidence
   Query: "What patterns exist across similar businesses?"
```

**Vector Metadata Structure:**

```python
# Example: Content Essence Vector
{
  "id": "content_video-003_zen-med-clinic",
  "values": [0.234, -0.891, 0.445, ...],  # 1536-dim embedding
  "metadata": {
    # Identity
    "content_id": "video-003",
    "brand_id": "zen-med-clinic",
    "industry": "chinese-medicine",
    "drive_id": "abc123xyz",
    "drive_url": "https://drive.google.com/file/d/abc123xyz",
    "filename": "acupuncture-treatment-calm.mp4",
    
    # Profile Attributes
    "emotional_tones": ["calm", "reassuring", "professional"],
    "tone_confidences": [0.95, 0.88, 0.82],
    "visual_aesthetics": ["minimal", "intimate", "modern"],
    "aesthetic_confidences": [0.92, 0.85, 0.78],
    "color_palette_primary": ["warm-tones", "earth-tones", "beige"],
    "color_palette_accent": ["soft-brown", "cream"],
    "color_temperature": "warm",
    "composition_types": ["close-up", "medium-shot"],
    "camera_movement": "steady",
    "pacing": "slow",
    
    # Narrative Elements
    "shows_physical_space": True,
    "shows_people": False,
    "shows_product_service": True,
    "local_landmark_visible": "stanford-campus",
    "has_dialogue": False,
    "has_text_overlay": False,
    
    # Technical
    "duration_seconds": 30,
    "resolution": "1080x1920",
    "format": "vertical-video",
    "production_quality": "professional-high",
    
    # Performance (updated over time)
    "total_impressions": 45000,
    "total_spend": 1250.50,
    "avg_ctr": 0.039,
    "avg_cpm": 8.50,
    "avg_roas": 4.1,
    "best_performing_demographic": "wellness-focused-women-35-50",
    "best_performing_platform": "instagram",
    "best_performing_time": "weekday-evening",
    "creative_fatigue_score": 0.2,
    "last_used_date": "2026-01-28",
    
    # Temporal
    "upload_date": "2026-01-15",
    "profile_date": "2026-01-15"
  }
}

# Example: Scenario Outcome Vector
{
  "id": "scenario_20260115_001_zen-med-clinic",
  "values": [0.123, 0.567, -0.234, ...],
  "metadata": {
    # Scenario Identity
    "scenario_id": "scenario_20260115_001",
    "brand_id": "zen-med-clinic",
    "industry": "chinese-medicine",
    
    # Campaign Parameters
    "content_id": "video-003",
    "platform": "instagram",
    "demographic_target": "wellness-focused-women-35-50",
    "geographic_target": "10-15mi-radius",
    "time_slot": "weekday-evening",
    "budget_per_day": 45.00,
    "campaign_goal": "local-awareness",
    "journey_stage": "awareness",
    
    # Content Characteristics (copied from content profile for filtering)
    "content_tones": ["calm", "reassuring", "professional"],
    "content_aesthetics": ["minimal", "intimate", "modern"],
    "content_colors": ["warm-tones", "earth-tones"],
    "shows_location": True,
    "local_landmark": "stanford-campus",
    
    # Performance Outcomes
    "roas": 4.2,
    "ctr": 0.042,
    "conversion_rate": 0.31,
    "cpm": 8.50,
    "cpc": 0.45,
    "cost_per_conversion": 14.52,
    "total_impressions": 12500,
    "total_spend": 315.00,
    "total_conversions": 22,
    
    # Insights/Learnings
    "key_insight": "local-landmark-visibility-boosts-engagement",
    "surprise_factor": 0.15,  # 15% above prediction
    "confidence_score": 0.92,
    
    # Temporal/Contextual
    "date": "2026-01-15",
    "day_of_week": "wednesday",
    "season": "winter",
    "campaign_age_days": 12
  }
}
```

---

### Neo4j Graph Schema (Complete)

**Node Types:**

```cypher
// === Content Nodes ===

(:Content:Video {
  id: string,                    // "video-003"
  brand_id: string,              // "zen-med-clinic"
  drive_id: string,
  drive_url: string,
  filename: string,
  duration_seconds: int,
  resolution: string,
  upload_date: date,
  profile_date: date,
  status: string,                // "active", "resting", "archived"
  total_impressions: int,
  total_spend: float,
  avg_roas: float,
  created_at: datetime,
  updated_at: datetime
})

(:Content:Image {
  id: string,
  brand_id: string,
  drive_id: string,
  drive_url: string,
  filename: string,
  resolution: string,
  upload_date: date,
  profile_date: date,
  status: string,
  total_impressions: int,
  total_spend: float,
  avg_roas: float,
  created_at: datetime,
  updated_at: datetime
})

// === Profile Attribute Nodes (shared across brands) ===

(:Tone {
  name: string,                  // "calm", "professional", "energetic"
  category: "emotional"
})

(:Aesthetic {
  name: string,                  // "minimal", "intimate", "luxurious"
  category: "visual"
})

(:ColorPalette {
  name: string,                  // "warm-tones", "earth-tones", "vibrant"
  category: "color"
})

(:Composition {
  name: string,                  // "close-up", "steady-cam", "dynamic"
  category: "technical"
})

(:NarrativeElement {
  name: string,                  // "shows-physical-space", "testimonial", "demo"
  category: "narrative"
})

// === Campaign Nodes ===

(:Campaign {
  id: string,
  brand_id: string,
  platform: string,              // "instagram", "facebook", "google-search"
  date: date,
  budget_per_day: float,
  status: string,                // "active", "paused", "completed"
  campaign_goal: string,         // "local-awareness", "conversion"
  journey_stage: string,         // "awareness", "consideration", "conversion"
  created_at: datetime,
  updated_at: datetime
})

// === Performance Nodes ===

(:Performance {
  id: string,
  date: date,
  impressions: int,
  clicks: int,
  conversions: int,
  spend: float,
  revenue: float,
  ctr: float,
  cpm: float,
  cpc: float,
  roas: float,
  conversion_rate: float,
  frequency: float,
  reach: int
})

// === Demographic Nodes ===

(:Demographic {
  name: string,                  // "wellness-focused-women-35-50"
  brand_id: string,
  age_min: int,
  age_max: int,
  gender: string,
  interests: [string],
  income_level: string,
  psychographics: string,        // Long-form description
  created_at: datetime
})

// === Platform Nodes (shared) ===

(:Platform {
  name: string,                  // "instagram", "facebook", "google-search"
  type: string                   // "social", "search", "display"
})

// === Time Slot Nodes (shared) ===

(:TimeSlot {
  name: string,                  // "weekday-evening", "weekend-morning"
  day_types: [string],           // ["monday", "tuesday", ...]
  hours: [int]                   // [18, 19, 20, 21]
})

// === Geographic Nodes ===

(:GeographicArea {
  name: string,                  // "5-10mi", "Palo Alto", "Stanford"
  brand_id: string,
  distance_from_location_miles: float,
  coordinates: point             // Optional: lat/lng
})

// === Lead Nodes ===

(:Lead {
  id: string,
  brand_id: string,
  name: string,
  email: string,
  phone: string,
  service_interest: string,
  message: string,
  source: string,                // "website-booking-form", "instagram-ad"
  source_campaign: string,       // Campaign ID
  lead_score: float,             // 0-100
  score_reasoning: string,
  status: string,                // "new", "contacted", "qualified", "converted", "lost"
  created_at: datetime,
  contacted_at: datetime,
  converted_at: datetime
})

// === Customer/Purchase Nodes (E-commerce) ===

(:Customer {
  id: string,
  brand_id: string,
  name: string,
  email: string,
  phone: string,
  total_lifetime_value: float,
  first_purchase_date: date,
  last_purchase_date: date,
  purchase_count: int
})

(:Purchase {
  id: string,
  brand_id: string,
  order_total: float,
  product_names: [string],
  purchase_date: datetime,
  source: string                 // Originating campaign/content
})
```

**Relationship Types:**

```cypher
// === Content → Attributes ===

(Content)-[:HAS_TONE {confidence: float}]->(Tone)
(Content)-[:HAS_AESTHETIC {confidence: float}]->(Aesthetic)
(Content)-[:HAS_COLOR_PALETTE]->(ColorPalette)
(Content)-[:HAS_COMPOSITION]->(Composition)
(Content)-[:SHOWS]->(NarrativeElement)

// === Campaign Relationships ===

(Content)-[:RAN_IN]->(Campaign)
(Campaign)-[:TARGETED]->(Demographic)
(Campaign)-[:TARGETED_AREA]->(GeographicArea)
(Campaign)-[:USED_PLATFORM]->(Platform)
(Campaign)-[:SCHEDULED_AT]->(TimeSlot)
(Campaign)-[:ACHIEVED]->(Performance)

// === Learning Relationships (weighted by performance) ===

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

(Platform)-[:FAVORS_AESTHETIC {
  correlation: float,
  sample_size: int
}]->(Aesthetic)

// === Content Similarity (from Pinecone but stored in Neo4j for graph queries) ===

(Content)-[:SIMILAR_TO {
  similarity_score: float,
  computed_date: date
}]->(Content)

// === Campaign Comparison ===

(Campaign)-[:OUTPERFORMED {
  delta_roas: float,
  delta_ctr: float
}]->(Campaign)

// === Lead Relationships ===

(Lead)-[:CAME_FROM]->(Campaign)
(Lead)-[:SUBMITTED]->(Form:WebsiteForm {
  form_type: string,
  submitted_at: datetime,
  utm_params: map
})
(Lead)-[:CONVERTED_TO]->(Customer)

// === Purchase Attribution (E-commerce) ===

(Customer)-[:MADE_PURCHASE]->(Purchase)
(Purchase)-[:ATTRIBUTED_TO]->(Campaign)
(Purchase)-[:ATTRIBUTED_TO]->(Content)
```

**Key Indexes & Constraints:**

```cypher
// Constraints (uniqueness)
CREATE CONSTRAINT content_id_unique IF NOT EXISTS 
FOR (c:Content) REQUIRE c.id IS UNIQUE;

CREATE CONSTRAINT campaign_id_unique IF NOT EXISTS 
FOR (c:Campaign) REQUIRE c.id IS UNIQUE;

CREATE CONSTRAINT lead_id_unique IF NOT EXISTS 
FOR (l:Lead) REQUIRE l.id IS UNIQUE;

CREATE CONSTRAINT customer_email_unique IF NOT EXISTS 
FOR (c:Customer) REQUIRE (c.brand_id, c.email) IS UNIQUE;

// Indexes (query performance)
CREATE INDEX content_brand_id IF NOT EXISTS 
FOR (c:Content) ON (c.brand_id);

CREATE INDEX content_status IF NOT EXISTS 
FOR (c:Content) ON (c.status);

CREATE INDEX campaign_brand_id IF NOT EXISTS 
FOR (c:Campaign) ON (c.brand_id);

CREATE INDEX campaign_date IF NOT EXISTS 
FOR (c:Campaign) ON (c.date);

CREATE INDEX performance_date IF NOT EXISTS 
FOR (p:Performance) ON (p.date);

CREATE INDEX lead_brand_id IF NOT EXISTS 
FOR (l:Lead) ON (l.brand_id);

CREATE INDEX lead_status IF NOT EXISTS 
FOR (l:Lead) ON (l.status);
```

---

## Spawn Workflow (Detailed Sequence)

### Command

```bash
# Run from /marketing-factory/
/spawn-client url=https://zenmedclinic.com name=zen-med-clinic
```

### Orchestrator Execution

```
┌─────────────────────────────────────────────────────┐
│ Phase 1: Research (Parallel)                        │
│ Estimated: 5-10 minutes                            │
└─────────────────────────────────────────────────────┘

├─→ Brand Research Agent
│   - Scrape website
│   - Extract positioning, voice, business model
│   - Identify location (physical address on site)
│   - Output: /research/brand-profile.md
│
└─→ Competitive Intelligence Agent
    - Search: "acupuncture palo alto"
    - Search: "chinese medicine bay area"
    - Analyze Meta Ad Library for competitors
    - Output: /research/competitive-landscape.md

[Wait for both to complete]

┌─────────────────────────────────────────────────────┐
│ Phase 2: Strategy Generation                        │
│ Estimated: 5-7 minutes                              │
└─────────────────────────────────────────────────────┘

└─→ Strategist Agent
    - Read brand-profile.md
    - Read competitive-landscape.md
    - Synthesize into strategy
    - Determine:
      * Primary demographics (wellness-focused-women-35-50)
      * Geographic strategy (15mi radius, brick-and-mortar)
      * Platform selection (Instagram, Facebook, Google Search)
      * Budget allocation
    - Output:
      * /strategy/campaign-plan.md
      * /strategy/platform-selection.md
      * /strategy/budget-allocation.md
      * brand-config.json ← MASTER CONFIG

┌─────────────────────────────────────────────────────┐
│ Phase 3: Creative Concepts                          │
│ Estimated: 5-7 minutes                              │
└─────────────────────────────────────────────────────┘

└─→ Creative Director Agent
    - Read brand-config.json
    - Read brand-profile.md
    - Generate 3-5 video concepts
    - Generate 2-3 image set concepts
    - Write ad copy variations
    - Output:
      * /creative/briefs/video-concept-{1-5}.md
      * /creative/briefs/image-set-{1-3}.md
      * /creative/copy/ad-copy-variations.json

┌─────────────────────────────────────────────────────┐
│ Phase 4: Database Initialization                    │
│ Estimated: 2-3 minutes                              │
└─────────────────────────────────────────────────────┘

└─→ Database Schema Agent
    - Check if first spawn (yes/no)
    - If first spawn:
      * Design Pinecone namespace structure
      * Design Neo4j graph schema
      * Document in /system-knowledge/database-schemas/
    - Create Pinecone namespace: content-essence-zen-med-clinic
    - Create Pinecone namespace: scenario-outcomes-zen-med-clinic
    - Create Pinecone namespace: audience-psychographics-zen-med-clinic
    - Create Pinecone namespace: narrative-patterns-zen-med-clinic
    - Initialize Neo4j constraints and indexes
    - Output: /data/schemas.md

┌─────────────────────────────────────────────────────┐
│ Phase 5: Marketing Intelligence System (Parallel)   │
│ Estimated: 5-7 minutes                              │
└─────────────────────────────────────────────────────┘

├─→ n8n Architect Agent
│   - Copy templates from /templates/n8n-workflows/
│   - Replace variables:
│     * {BRAND_NAME} → "Zen Med Clinic"
│     * {BRAND_ID} → "zen-med-clinic"
│     * {PRIMARY_DEMOGRAPHIC} → "wellness-focused-women-35-50"
│     * {LOCATION_RADIUS} → "15 miles"
│     * {PLATFORMS} → ["instagram", "facebook", "google-search"]
│   - Output: 9 workflow JSON files to /automation/workflows/
│
└─→ Marketing Agent Prompt Engineer
    - Copy templates from /templates/runtime-prompts/
    - Inject brand context from brand-config.json:
      * Brand name, industry, business model
      * Full demographic profiles
      * Campaign goals
      * Budget constraints
    - Output: 6 agent prompt .md files to /automation/prompts/

┌─────────────────────────────────────────────────────┐
│ Phase 6: Dashboard System (Coordinated)             │
│ Estimated: 7-10 minutes                             │
└─────────────────────────────────────────────────────┘

Dashboard Architect Agent coordinates:

├─→ Dashboard Architect
│   - Copy /templates/dashboard/ to /clients/zen-med-clinic/dashboard/
│   - Update config.json:
│     * Brand name, logo URL
│     * Brand colors (from brand-profile: #2C5F4F, etc.)
│     * API endpoints
│     * Google Drive folder ID (to be created)
│   - Create package.json, tsconfig.json with brand name
│
├─→ Data Visualization Agent
│   - Configure chart types for metrics
│   - Create ExecutiveSummary component config
│   - Create DetailedMetrics component config
│   - Define what metrics appear where
│
├─→ Dashboard UX Agent
│   - Define information architecture
│   - Create navigation structure
│   - Configure progressive disclosure
│
└─→ Dashboard API Agent
    - Copy /templates/dashboard/backend/
    - Configure API endpoints
    - Set up Pinecone/Neo4j connection code
    - Output: Complete FastAPI backend

┌─────────────────────────────────────────────────────┐
│ Phase 7: Website System (Coordinated)               │
│ Estimated: 10-15 minutes                            │
└─────────────────────────────────────────────────────┘

Website Strategist Agent coordinates:

├─→ Website Strategist
│   - Analyze business model: brick-and-mortar-primary
│   - Determine site structure (service site, not e-commerce)
│   - Define pages: Home, Services, About, Book Appointment, Contact
│   - Plan conversion funnels
│
├─→ Website Designer
│   - Copy /templates/website/frontend/
│   - Create theme.ts with brand colors
│   - Configure typography
│   - Define component styling
│
├─→ Landing Page Agent
│   - Create /book-appointment page
│   - Optimize for conversion
│   - Match aesthetic to ad campaigns
│
├─→ Form/Conversion Agent
│   - Create BookingForm component
│   - Create NewsletterSignup component
│   - Create ContactForm component
│   - Configure backend form handlers
│
├─→ Website Backend Agent
│   - Copy /templates/website/backend/
│   - Create form submission endpoints
│   - Configure n8n webhook forwarding
│   - Set up email service
│
└─→ (E-commerce Agent SKIPPED - not e-commerce business)

┌─────────────────────────────────────────────────────┐
│ Phase 8: Integration                                 │
│ Estimated: 3-5 minutes                              │
└─────────────────────────────────────────────────────┘

└─→ Integration Orchestrator Agent
    - Verify all webhook URLs consistent
    - Document data flows:
      * Website form → backend → n8n → Neo4j → Dashboard
      * n8n → Dashboard (insights updates)
      * Content upload → Drive → n8n → Pinecone + Neo4j
    - Create integration diagrams
    - Generate API contract docs
    - Output: /docs/system-overview.md (integration section)

┌─────────────────────────────────────────────────────┐
│ Phase 9: Client-Facing Documents                    │
│ Estimated: 5-7 minutes                              │
└─────────────────────────────────────────────────────┘

└─→ Publicist Agent
    - Read all strategy docs
    - Translate into business language
    - Create compelling narrative
    - Output:
      * /client-deliverables/onboarding-presentation.md
      * /client-deliverables/strategy-overview.pdf
      * /client-deliverables/dashboard-guide.pdf

┌─────────────────────────────────────────────────────┐
│ Phase 10: Documentation                              │
│ Estimated: 3-5 minutes                              │
└─────────────────────────────────────────────────────┘

└─→ Documentation Agent
    - Create system-overview.md
    - Create dashboard-guide.md (technical)
    - Create content-upload-guide.md
    - Create api-documentation.md
    - Output: 4 docs to /docs/

┌─────────────────────────────────────────────────────┐
│ Phase 11: QA & Validation                           │
│ Estimated: 5-7 minutes                              │
└─────────────────────────────────────────────────────┘

└─→ QA Agent
    - Run through 50-point checklist
    - Verify all files present
    - Check JSON syntax (brand-config.json, workflows)
    - Validate variable substitution
    - Review strategy coherence
    - Check client deliverables quality
    - Test builds (npm run build, python main.py)
    
    If issues found → Report to Orchestrator → Fix → Re-run QA
    If all pass → Continue

┌─────────────────────────────────────────────────────┐
│ Phase 12: Finalization                               │
│ Estimated: 1-2 minutes                              │
└─────────────────────────────────────────────────────┘

└─→ Orchestrator
    - Create version.json
    - Create Google Drive folder structure (instructions)
    - Generate deployment checklist
    - Report completion to user

═══════════════════════════════════════════════════════

TOTAL ESTIMATED TIME: 50-70 minutes

═══════════════════════════════════════════════════════
```

### Completion Output

```
✓ Spawn Complete: Zen Med Clinic

System generated in 62 minutes.

Directory: /clients/zen-med-clinic/

Components Created:
  ✓ Research (brand + competitive analysis)
  ✓ Strategy (campaign plan + demographics + budget)
  ✓ Creative Briefs (3 video concepts, 2 image sets, ad copy)
  ✓ n8n Workflows (9 workflows configured)
  ✓ Runtime Agents (6 agent prompts)
  ✓ Dashboard (Next.js frontend + FastAPI backend)
  ✓ Website (Next.js frontend + FastAPI backend)
  ✓ Database Schemas (Pinecone + Neo4j initialized)
  ✓ Client Deliverables (onboarding presentation + strategy overview)
  ✓ Documentation (4 system docs)

Next Steps:

1. Review System
   - Read: /clients/zen-med-clinic/docs/system-overview.md
   - Review: /client-deliverables/strategy-overview.pdf

2. Set Up Infrastructure
   - Create Google Drive folder (instructions in /docs/system-overview.md)
   - Deploy n8n instance (local or cloud)
   - Set up Pinecone account (free tier)
   - Set up Neo4j instance (AuraDB free tier or local)
   - Get API credentials:
     * Google Ads API
     * Meta Marketing API
     * Claude API
     * OpenAI API (for embeddings)

3. Deploy n8n Workflows
   - Import workflows from /automation/workflows/
   - Configure credentials:
     * Google Ads
     * Meta Marketing
     * Claude API
     * Pinecone
     * Neo4j
     * Google Drive
   - Test webhook URLs

4. Create Initial Content
   - Follow briefs in /creative/briefs/
   - Shoot/create:
     * 3 videos (video-concept-1, 2, 3)
     * 2 image sets (image-set-1, 2)
   - Upload to Google Drive /content/ folder
   - System will auto-analyze and create metadata

5. Deploy Dashboard
   - Frontend:
     cd /clients/zen-med-clinic/dashboard/frontend
     npm install
     npm run build
     Deploy to Vercel (recommended)
   - Backend:
     cd /clients/zen-med-clinic/dashboard/backend
     pip install -r requirements.txt
     Deploy to Railway/Render (recommended)
   - Configure environment variables (Pinecone, Neo4j, n8n endpoints)

6. Deploy Website
   - Frontend:
     cd /clients/zen-med-clinic/website/frontend
     npm install
     npm run build
     Deploy to Vercel (recommended)
   - Backend:
     cd /clients/zen-med-clinic/website/backend
     pip install -r requirements.txt
     Deploy to Railway/Render (recommended)
   - Configure environment variables (n8n webhook, email service)
   - Point domain to deployment

7. Launch Test Campaigns
   - Start with $1,500 test budget (14 days)
   - Run campaigns on Instagram, Facebook, Google Search
   - Monitor in dashboard
   - System will optimize automatically

8. Deliver to Client
   - Send: /client-deliverables/onboarding-presentation.md
   - Provide dashboard access
   - Schedule onboarding call
   - Share content upload guide

Estimated Time to Full Deployment: 2-3 days
(Including content creation, infrastructure setup, deployment)

═══════════════════════════════════════════════════════
```

---

## System Knowledge (First Spawn Documentation)

After the first client is spawned, the Database Schema Agent and other architects should create comprehensive documentation in `/system-knowledge/` for future spawns.

### Example: `/system-knowledge/database-schemas/pinecone-namespaces.md`

```markdown
# Pinecone Namespace Architecture

## Overview

All clients share a single Pinecone index: `marketing-automation`

Namespaces are created per-client with the pattern: `{namespace-type}-{brand-id}`

## Namespace Types

### 1. content-essence-{brand-id}

**Purpose:** Semantic profiles of creative assets

**What's Stored:**
- Rich narrative description of each video/image (embedded)
- Full profile attributes (tones, aesthetics, colors, composition, narrative)
- Performance metrics (updated over time)
- Google Drive reference (ID, URL)

**Embedding Source:**
Generated by Claude API from comprehensive content analysis. Example:

> "A 30-second vertical video showcasing a peaceful acupuncture treatment session. Visual aesthetic is minimal and intimate with warm, soft lighting creating a calm atmosphere. Color palette features earth tones, beiges, and warm browns. Camera work is steady and close, focusing on the serene treatment environment. The space is modern yet inviting with clean lines. Through the window, the Stanford campus is visible, establishing local context. No dialogue, just ambient peaceful sounds. Pacing is slow and meditative. Shows the physical clinic interior, establishing place. Production quality is professional with high resolution. The emotional tone is calming, reassuring, and professional. This content communicates expertise, tranquility, and local presence. Suitable for awareness-building among local audiences who value wellness and stress relief."

**Use Cases:**
- Find similar content: `query_vector = embed("calm minimal treatment room")` → returns similar assets
- Find fresh content with specific aesthetic: Filter by `total_impressions < 5000` + `tones: ["calm"]`
- Portfolio analysis: Cluster content to identify gaps

**Metadata Fields:**
- content_id, brand_id, industry, drive_id, drive_url, filename
- emotional_tones[], tone_confidences[], visual_aesthetics[], aesthetic_confidences[]
- color_palette_primary[], color_palette_accent[], color_temperature, composition_types[]
- shows_physical_space, shows_people, local_landmark_visible, has_dialogue
- duration_seconds, resolution, format, production_quality
- total_impressions, total_spend, avg_ctr, avg_cpm, avg_roas
- best_performing_demographic, best_performing_platform, creative_fatigue_score
- upload_date, profile_date, last_used_date

---

### 2. scenario-outcomes-{brand-id}

**Purpose:** Learn from past campaign scenarios

**What's Stored:**
- Full context description: content + audience + platform + time + performance (embedded)
- All scenario parameters as metadata
- Actual outcomes (ROAS, CTR, conversions, etc.)
- Learnings and insights

**Embedding Source:**
Generated description combining all scenario context. Example:

> "Scenario: Running a 30-second video with calm, reassuring tone and minimal aesthetic featuring warm earth tones. Video shows peaceful acupuncture treatment in modern clinic space with Stanford campus visible through windows. Content demonstrates service in intimate, professional manner with slow pacing and ambient audio only. Targeting wellness-focused professional women aged 35-50 within 10-15 mile radius of Palo Alto location. Running on Instagram during weekday evenings (6-9pm) with $45/day budget. Campaign goal is local awareness building for people who may not know clinic exists. User journey stage: awareness. Season: Winter. Day: Wednesday. Outcome: Achieved 4.2 ROAS with 0.042 CTR, $8.50 CPM, 31% conversion rate. Strong performance in outer radius (10-15mi) as predicted. Content resonated particularly well with target demographic. Local landmark visibility correlated with 20% higher engagement than similar content without location context."

**Use Cases:**
- Before making decision: "What happened in similar situations?"
- Predict performance: Find similar scenarios, average their outcomes
- Validate hypotheses: "Does showing location really boost performance?" → query similar scenarios with/without

**Metadata Fields:**
- scenario_id, brand_id, industry, content_id, platform, demographic_target
- geographic_target, time_slot, budget_per_day, campaign_goal, journey_stage
- content_tones[], content_aesthetics[], shows_location, local_landmark
- Performance: roas, ctr, conversion_rate, cpm, cpc, total_impressions, total_spend
- key_insight, surprise_factor, confidence_score
- date, day_of_week, season, campaign_age_days

---

### 3. audience-psychographics-{brand-id}

**Purpose:** Deep understanding of who audiences are

**What's Stored:**
- Rich psychographic profile (embedded)
- Behavioral patterns, motivations, preferences
- Decision-making characteristics

**Embedding Source:**
Synthesized description of demographic. Example:

> "Wellness-focused professional women aged 35-50 in Palo Alto area demonstrate strong affinity for calm, reassuring content with minimal aesthetics and warm color palettes. They engage heavily during weekday evenings (6-9pm), suggesting stress-relief seeking behavior after work hours. This demographic responds to narratives of self-care, expertise, and local trust-building. They value professional quality and authenticity over flashy marketing. Content showing physical spaces and establishing local presence performs 20% better than purely service-focused content. They prefer slow-paced, meditative content over fast, energetic styles. Key motivations include: stress relief, preventive health, holistic wellness, work-life balance. Decision-making factors: proximity to location, professional credentials visible, calm atmosphere, modern facilities. Price sensitivity: moderate-low (values quality over cost). Conversion journey: longer consideration phase (7-14 days), multiple touchpoints needed."

**Use Cases:**
- Understand "why" behind performance
- Inform creative strategy
- Guide messaging
- Identify expansion opportunities (similar demographics)

---

### 4. narrative-patterns-{brand-id}

**Purpose:** Understanding story effectiveness

**What's Stored:**
- Description of narrative structure/theme (embedded)
- Performance across audiences

**Use Cases:**
- "What stories resonate with this audience?"
- Guide creative briefs

---

### 5. cross-campaign-learnings (shared, no brand-id)

**Purpose:** Meta-insights across all clients

**What's Stored:**
- Patterns that hold true across brands (anonymized)
- Industry-level insights
- Universal principles

**Embedding Source:**
Example:

> "Pattern: Wellness/service businesses showing physical location with visible local landmarks consistently outperform location-free content by 15-25% for local awareness campaigns within 15-mile radius. Effectiveness increases with proximity tier (5-10mi: +25%, 10-15mi: +40%). This pattern holds across acupuncture, massage therapy, yoga studios, and med spas. Likely driven by trust-building through place establishment and reducing perceived barrier to visit ('I drive past that every day'). Most effective when combined with calm, professional tone and minimal aesthetic."

**Use Cases:**
- Inform strategy for new clients in similar industries
- Cross-pollinate learnings
- Build institutional knowledge

**Metadata Fields:**
- insight_id, industry, business_model, pattern_type, confidence, sample_size
- applicable_to[], performance_delta, discovered_date

## Namespace Initialization

When spawning a new client:

```python
# Example: Create namespace for zen-med-clinic
import pinecone

pinecone.init(api_key="...", environment="...")
index = pinecone.Index("marketing-automation")

# Namespaces are created automatically on first upsert
# No explicit creation needed

# Just ensure namespace naming convention: {type}-{brand_id}
namespace_content = f"content-essence-zen-med-clinic"
namespace_scenarios = f"scenario-outcomes-zen-med-clinic"
namespace_psychographics = f"audience-psychographics-zen-med-clinic"
namespace_narratives = f"narrative-patterns-zen-med-clinic"

# cross-campaign-learnings namespace is shared (no brand_id)
```

## Query Patterns

### Find Similar Content
```python
# User wants content similar to video-003
results = index.query(
    namespace="content-essence-zen-med-clinic",
    vector=content_embedding,  # Embedding of video-003's description
    top_k=10,
    include_metadata=True,
    filter={
        "total_impressions": {"$lt": 5000},  # Fresh content only
        "emotional_tones": {"$in": ["calm", "professional"]}
    }
)
```

### Find Historical Scenarios
```python
# CSO Agent deciding budget allocation
scenario_description = "Shifting budget from Facebook to Instagram for wellness-focused women demographic based on performance disparity"
scenario_embedding = embed(scenario_description)

similar_scenarios = index.query(
    namespace="scenario-outcomes-zen-med-clinic",
    vector=scenario_embedding,
    top_k=10,
    include_metadata=True,
    filter={
        "platform": {"$in": ["facebook", "instagram"]},
        "demographic_target": "wellness-focused-women-35-50"
    }
)

# Analyze outcomes of similar decisions
avg_roas_lift = mean([s.metadata['roas'] for s in similar_scenarios])
```

## Metadata Update Pattern

Content performance metadata is updated continuously:

```python
# After campaign runs for a day
# Update content vector metadata with latest performance

index.update(
    id="content_video-003_zen-med-clinic",
    set_metadata={
        "total_impressions": 45000,  # +12500 from yesterday
        "total_spend": 1250.50,      # +$315 from yesterday
        "avg_roas": 4.1,             # Recalculated
        "avg_ctr": 0.039,
        "last_used_date": "2026-01-28"
    },
    namespace="content-essence-zen-med-clinic"
)
```

**Note:** The vector itself never changes (content doesn't change), only metadata updates.
```

---

## Version Management (Detailed)

### Version Lifecycle

```
v1.0.0 (Initial Release)
  ├─→ 10 clients spawned
  ├─→ Run for 1 month
  ├─→ Collect feedback
  └─→ Identify improvements

     ↓

v1.1.0 Development
  ├─→ Improve creative fatigue algorithm
  ├─→ Add lead scoring workflow
  ├─→ Enhance dashboard detailed metrics
  ├─→ BREAKING: Change Pinecone metadata structure
  └─→ Create migration scripts

     ↓

v1.1.0 Testing
  ├─→ Test on 1-2 clients first (staged rollout)
  ├─→ Validate migrations work
  ├─→ Monitor for issues
  └─→ If successful → roll out to all

     ↓

v1.1.0 Rollout
  ├─→ Version Control Agent assesses each client
  ├─→ Generates update plan per client
  ├─→ Executes updates (with human approval for risky changes)
  ├─→ Validates
  └─→ Rollback if issues
```

### Update Strategy

**Automatic Updates** (no human approval needed):
- Bug fixes
- Performance optimizations
- New features that don't change existing behavior
- Dashboard UI improvements
- Documentation updates

**Semi-Automatic Updates** (human approval for risky clients):
- Breaking changes with migration scripts
- Budget allocation algorithm changes
- New workflows that change campaign behavior
- Database schema changes

**Manual Updates** (always require human review):
- Custom client modifications present
- Clients with unusual configurations
- Updates affecting >30% of budget allocation
- Major strategic pivots

### Migration Script Example

```python
# /versions/v1.1.0/migrations/pinecone_metadata_update.py

"""
Migration: v1.0.0 → v1.1.0
Changes Pinecone metadata structure for content vectors

Old structure:
  tones: ["calm", "professional"]

New structure:
  emotional_tones: [{"name": "calm", "confidence": 0.95}, ...]
"""

import pinecone
from typing import List, Dict

def migrate_content_metadata(brand_id: str):
    """
    Migrates content metadata from v1.0.0 to v1.1.0 structure
    """
    index = pinecone.Index("marketing-automation")
    namespace = f"content-essence-{brand_id}"
    
    # Fetch all vectors for this client
    # (In practice, use pagination for large datasets)
    results = index.query(
        namespace=namespace,
        vector=[0]*1536,  # Dummy vector
        top_k=10000,
        include_metadata=True,
        filter={"brand_id": brand_id}
    )
    
    for match in results['matches']:
        content_id = match['id']
        old_metadata = match['metadata']
        
        # Transform metadata
        new_metadata = transform_metadata(old_metadata)
        
        # Update in Pinecone
        index.update(
            id=content_id,
            set_metadata=new_metadata,
            namespace=namespace
        )
        
        print(f"✓ Migrated {content_id}")
    
    print(f"\n✓ Migration complete: {len(results['matches'])} vectors updated")

def transform_metadata(old: Dict) -> Dict:
    """Transform old metadata structure to new"""
    new = old.copy()
    
    # Transform: tones → emotional_tones with confidence
    if 'tones' in old:
        new['emotional_tones'] = old['tones']  # Keep simple for now
        # In real version, would add confidence scores
        new['tone_confidences'] = [0.90] * len(old['tones'])
        del new['tones']
    
    # Transform: aesthetics → visual_aesthetics with confidence
    if 'aesthetics' in old:
        new['visual_aesthetics'] = old['aesthetics']
        new['aesthetic_confidences'] = [0.90] * len(old['aesthetics'])
        del new['aesthetics']
    
    # Add new fields with defaults
    if 'creative_fatigue_score' not in new:
        new['creative_fatigue_score'] = 0.0
    
    return new

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python pinecone_metadata_update.py <brand_id>")
        sys.exit(1)
    
    brand_id = sys.argv[1]
    migrate_content_metadata(brand_id)
```

### Changelog Template

```markdown
# Changelog v1.1.0

**Release Date:** 2026-02-15

## New Features

### Lead Scoring Workflow
- Automatically scores leads from website forms (0-100)
- Routes hot leads (>90) to immediate SMS/email notification
- Routes warm leads to standard email sequence
- Routes cold leads to newsletter nurture
- Stores scoring rationale in Neo4j

**Files Added:**
- `/templates/n8n-workflows/lead-scoring.json`
- `/templates/runtime-prompts/lead-scoring-agent.md` (optional specialized agent)

**Breaking:** No  
**Migration Required:** No

---

### Detailed Metrics Dashboard Page
- New dashboard page: `/detailed-metrics`
- Displays granular media buyer metrics: CPC, CPM, CTR, frequency, reach, quality score
- Time-series visualization for any metric
- Comparison period selector
- Export to CSV

**Files Modified:**
- `/templates/dashboard/frontend/pages/detailed-metrics/index.tsx` (NEW)
- `/templates/dashboard/frontend/components/DetailedMetrics.tsx` (NEW)
- `/templates/dashboard/backend/routers/performance.py` (added `/api/performance/detailed-metrics` endpoint)

**Breaking:** No  
**Migration Required:** No

---

## Enhancements

### Improved Creative Fatigue Detection
- More sophisticated decay curve modeling
- Accounts for seasonality and day-of-week patterns
- Flags fatigue earlier (when CTR decline accelerates, not just drops)

**Files Modified:**
- `/templates/n8n-workflows/creative-rotation.json`
- Logic change in Creative Intelligence Agent context

**Breaking:** No (improves existing behavior)  
**Migration Required:** No

---

## Breaking Changes

### Pinecone Metadata Structure
**What Changed:**
- `tones` → `emotional_tones` + `tone_confidences`
- `aesthetics` → `visual_aesthetics` + `aesthetic_confidences`
- Added: `creative_fatigue_score` field

**Why:**
- More granular analysis
- Enables confidence-weighted decisions
- Better fatigue tracking

**Migration Required:** YES

**Migration Script:** `/versions/v1.1.0/migrations/pinecone_metadata_update.py`

**Estimated Migration Time:** ~10 minutes per client (150 vectors avg)

**Rollback:** Available (restore from pre-migration backup)

---

## Bug Fixes

- Fixed: Dashboard occasionally showing stale data (added cache invalidation)
- Fixed: n8n workflow error handling when Claude API times out
- Fixed: Geographic heatmap rendering issue with >20 areas

---

## Compatibility

**Backward Compatible:** Mostly yes (except Pinecone metadata)

**Requires Migration:** Only if using Pinecone content search features extensively

**Recommended for:** All clients

**Tested With:**
- n8n v1.20.0+
- Next.js 14+
- FastAPI 0.110+
- Pinecone v2.0+
- Neo4j 5.0+

---

## Upgrade Path

### From v1.0.0 → v1.1.0

**Estimated Time:** 45 minutes per client

**Steps:**
1. Backup (5 min)
2. Run Pinecone migration (10 min)
3. Update n8n workflows (5 min)
4. Deploy dashboard updates (10 min)
5. Update agent prompts (5 min)
6. Validation (10 min)

**Rollback Available:** Yes

**Risk Level:** Medium (database migration)

---

## Known Issues

- None at release time

---

## Next Version Preview (v1.2.0)

Planned features:
- Shopify deep integration for e-commerce clients
- Multi-location support for franchises
- A/B test framework
- Seasonal campaign auto-adjustment

Expected: March 2026
```

---

This completes the comprehensive specification. The document now contains:

1. ✅ **Complete Layer 1 architecture** - All 23 agents with detailed responsibilities
2. ✅ **Complete Layer 2 architecture** - Full spawned system structure
3. ✅ **Complete database schemas** - Pinecone namespaces + Neo4j graph with examples
4. ✅ **Detailed spawn workflow** - Step-by-step orchestration with timing
5. ✅ **Integration patterns** - How all systems communicate
6. ✅ **Version management** - Update procedures, migrations, rollback
7. ✅ **System knowledge** - What gets documented for future spawns
8. ✅ **Real-world examples** - Code snippets, configurations, workflows

This spec should enable Claude CLI to build the complete system.