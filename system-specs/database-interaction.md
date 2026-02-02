# Database Interaction & Integration Patterns

## Overview

This document describes how Pinecone (vector DB) and Neo4j (graph DB) work together, and how n8n workflows, runtime agents, and the dashboard interact with both databases.

**Key Principle:** Use the right database for the right job, and combine them for powerful queries.

---

## Database Roles Summary

### Pinecone: Semantic Memory
- **What:** Vector embeddings of rich descriptions
- **When:** "Find similar X" or "What's like Y?"
- **Strength:** Semantic similarity, fuzzy matching, pattern discovery
- **Example:** "Find content with calm vibe similar to video-003"

### Neo4j: Structured Facts
- **What:** Entities, relationships, metrics
- **When:** "Show me facts about X" or "How are X and Y related?"
- **Strength:** Exact queries, aggregations, relationship traversal
- **Example:** "Show me performance of video-003 by demographic"

### Together: Intelligence
- **Pattern:** Pinecone finds candidates → Neo4j provides details
- **Example:** "Find content similar to video-003 (Pinecone), then show ROAS by platform (Neo4j)"

---

## Common Integration Patterns

### Pattern 1: Content Discovery + Performance Analysis

**Use Case:** Find similar content that's fresh, then analyze its detailed performance.

**Flow:**
```
1. Pinecone: Find semantically similar content
   Query: embed("calm minimal treatment environment")
   Filter: total_impressions < 5000
   Returns: [video-007, video-011, video-015]

2. Neo4j: Get detailed performance for those content IDs
   Query: For each ID, get performance by demographic/platform/time
   Returns: Full performance breakdown

3. Agent Decision: Choose video-007 (best ROAS, matches target demo)
```

**Implementation:**
```python
# In n8n workflow or runtime agent

# Step 1: Pinecone semantic search
similar_content = pinecone_index.query(
    namespace="content-essence-zen-med-clinic",
    vector=embed("calm minimal treatment environment"),
    top_k=10,
    include_metadata=True,
    filter={
        "total_impressions": {"$lt": 5000},
        "status": "active"
    }
)

content_ids = [match.id for match in similar_content.matches]

# Step 2: Neo4j detailed performance
query = """
MATCH (c:Content)
WHERE c.id IN $content_ids
  AND c.brand_id = $brand_id

OPTIONAL MATCH (c)-[:RAN_IN]->(camp:Campaign)-[:TARGETED]->(demo:Demographic)
OPTIONAL MATCH (camp)-[:ACHIEVED]->(perf:Performance)

RETURN c.id,
       c.filename,
       c.drive_url,
       collect(DISTINCT demo.name) AS demographics_used,
       avg(perf.roas) AS avg_roas,
       sum(perf.impressions) AS total_impressions

ORDER BY avg_roas DESC
"""

with neo4j_driver.session() as session:
    results = session.run(query, content_ids=content_ids, brand_id="zen-med-clinic")
    detailed_performance = [record.data() for record in results]

# Step 3: Combine insights
for content in detailed_performance:
    print(f"{content['filename']}: ROAS {content['avg_roas']}")
```

---

### Pattern 2: Scenario-Based Decision Making

**Use Case:** CSO Agent deciding whether to shift budget from Facebook to Instagram.

**Flow:**
```
1. Construct scenario description (text)
   "Shifting budget from Facebook (ROAS 2.1) to Instagram (ROAS 4.2) 
    for wellness-focused-women-35-50 using calm minimal content"

2. Pinecone: Find similar past scenarios
   Query: embed(scenario_description)
   Namespace: scenario-outcomes-zen-med-clinic
   Returns: 10 similar scenarios with outcomes

3. Neo4j: Validate current state
   Query: Get actual current ROAS by platform
   Returns: Facebook 2.1, Instagram 4.2 (confirms scenario)

4. Analyze: Similar scenarios averaged +18% ROAS when making this shift
5. Decision: Recommend shift with 85% confidence
```

**Implementation:**
```python
# In CSO Agent (via n8n Claude API node)

# Step 1: Generate scenario description
scenario = f"""
Considering shifting ${budget_shift}/day from {from_platform} (ROAS {from_roas}) 
to {to_platform} (ROAS {to_roas}) for {demographic} demographic. 
Content type: {content_tones} tones, {content_aesthetics} aesthetic.
Business model: {business_model}. Campaign goal: {campaign_goal}.
"""

# Step 2: Pinecone - find similar scenarios
scenario_vector = embed(scenario)
similar_scenarios = pinecone_index.query(
    namespace="scenario-outcomes-zen-med-clinic",
    vector=scenario_vector,
    top_k=15,
    include_metadata=True,
    filter={
        "platform": {"$in": [from_platform, to_platform]},
        "demographic_target": demographic
    }
)

# Extract outcomes
outcomes = [s.metadata['roas'] for s in similar_scenarios.matches]
avg_outcome = mean(outcomes)
confidence = len(outcomes) / 15

# Step 3: Neo4j - validate current state
query = """
MATCH (camp:Campaign {brand_id: $brand_id})-[:USED_PLATFORM]->(p:Platform)
MATCH (camp)-[:ACHIEVED]->(perf:Performance)
WHERE camp.date >= date() - duration({days: 7})
RETURN p.name, avg(perf.roas) AS avg_roas
"""
current_state = neo4j_query(query, brand_id="zen-med-clinic")

# Step 4: Make decision
recommendation = {
    "action": f"Shift ${budget_shift}/day from {from_platform} to {to_platform}",
    "reasoning": f"Similar scenarios (n={len(outcomes)}) averaged {avg_outcome:.2f} ROAS",
    "expected_outcome": f"Overall ROAS increase to {avg_outcome:.2f}",
    "confidence": confidence
}
```

---

### Pattern 3: Demographic Psychographic Deep Dive

**Use Case:** Cultural Anthropologist explaining why content performs with a demographic.

**Flow:**
```
1. Neo4j: Get performance facts
   Query: What content performed best with this demographic?
   Returns: video-003, ROAS 4.2, CTR 0.042

2. Neo4j: Get content attributes
   Query: What tones/aesthetics does video-003 have?
   Returns: calm, minimal, warm-tones, shows-location

3. Neo4j: Get demographic preferences (learned relationships)
   Query: What tones/aesthetics does this demographic respond to?
   Returns: [:RESPONDS_TO calm (avg_roas: 4.0)]

4. Pinecone: Get psychographic profile
   Query: Retrieve audience psychographic vector
   Returns: Rich description of demographic motivations/behaviors

5. Synthesize: "They respond to calm because they're stress-relief seeking..."
```

**Implementation:**
```python
# In Cultural Anthropologist Agent

demographic = "wellness-focused-women-35-50"
brand_id = "zen-med-clinic"

# Step 1 & 2: Neo4j - Get top content + attributes
query = """
MATCH (demo:Demographic {name: $demographic, brand_id: $brand_id})
<-[:TARGETED]-(camp:Campaign)<-[:RAN_IN]-(content:Content)
MATCH (camp)-[:ACHIEVED]->(perf:Performance)
MATCH (content)-[:HAS_TONE]->(tone:Tone)
MATCH (content)-[:HAS_AESTHETIC]->(aesthetic:Aesthetic)

WITH content, 
     avg(perf.roas) AS avg_roas,
     collect(DISTINCT tone.name) AS tones,
     collect(DISTINCT aesthetic.name) AS aesthetics

WHERE avg_roas > 3.5
RETURN content.id, content.filename, avg_roas, tones, aesthetics
ORDER BY avg_roas DESC
LIMIT 5
"""
top_content = neo4j_query(query, demographic=demographic, brand_id=brand_id)

# Step 3: Neo4j - Get demographic preferences
query = """
MATCH (demo:Demographic {name: $demographic, brand_id: $brand_id})
-[r:RESPONDS_TO|PREFERS_AESTHETIC]->(attr)
RETURN attr.name, attr.category, r.avg_roas, r.sample_size
ORDER BY r.avg_roas DESC
"""
preferences = neo4j_query(query, demographic=demographic, brand_id=brand_id)

# Step 4: Pinecone - Get psychographic profile
psychographic = pinecone_index.query(
    namespace="audience-psychographics-zen-med-clinic",
    vector=embed(demographic),
    top_k=1,
    include_metadata=True
)
profile = psychographic.matches[0].metadata

# Step 5: Synthesize explanation
explanation = f"""
{demographic} responds strongly to {top_content[0]['tones']} content because:

Behavioral Pattern: {profile['peak_engagement_times']} engagement suggests 
{profile['key_motivations']} seeking behavior.

Content Alignment: The {top_content[0]['aesthetics']} aesthetic matches their 
preference for {preferences[0]['attr.name']}, which has demonstrated {preferences[0]['r.avg_roas']} 
average ROAS across {preferences[0]['r.sample_size']} campaigns.

Psychographic Insight: This demographic values {profile['decision_factors']}. 
Content showing {top_content[0]['narrative_elements']} addresses these factors directly.
"""
```

---

### Pattern 4: Content Portfolio Balance Check

**Use Case:** Creative Intelligence Agent identifying content gaps.

**Flow:**
```
1. Neo4j: Get all active content with attributes
   Query: What content is active? What are its tones/aesthetics?
   Returns: 12 pieces, 10 are "calm", 2 are "professional"

2. Pinecone: Cluster content by similarity
   Query: Get all content vectors, compute similarity matrix
   Returns: All content clusters around "calm minimal" - tight cluster

3. Neo4j: Get demographic distribution
   Query: What demographics are we targeting?
   Returns: 90% women-35-50, 10% professionals-25-40

4. Insight: Over-concentration in calm content, under-serving younger demo
5. Recommendation: Need "energetic" or "aspirational" content for expansion
```

**Implementation:**
```python
# In Creative Intelligence Agent

brand_id = "zen-med-clinic"

# Step 1: Neo4j - Get active content attributes
query = """
MATCH (c:Content {brand_id: $brand_id, status: 'active'})
MATCH (c)-[:HAS_TONE]->(tone:Tone)
MATCH (c)-[:HAS_AESTHETIC]->(aesthetic:Aesthetic)

RETURN c.id,
       collect(DISTINCT tone.name) AS tones,
       collect(DISTINCT aesthetic.name) AS aesthetics
"""
active_content = neo4j_query(query, brand_id=brand_id)

# Analyze distribution
tone_distribution = Counter()
for content in active_content:
    for tone in content['tones']:
        tone_distribution[tone] += 1

# Step 2: Pinecone - Get content vectors for clustering
content_ids = [c['c.id'] for c in active_content]
vectors = []
for content_id in content_ids:
    result = pinecone_index.fetch(
        ids=[f"content_{content_id}_{brand_id}"],
        namespace=f"content-essence-{brand_id}"
    )
    vectors.append(result.vectors[f"content_{content_id}_{brand_id}"].values)

# Simple similarity analysis (in production, use proper clustering)
similarities = []
for i in range(len(vectors)):
    for j in range(i+1, len(vectors)):
        sim = cosine_similarity(vectors[i], vectors[j])
        similarities.append(sim)

avg_similarity = mean(similarities)

# Step 3: Neo4j - Get demographic distribution
query = """
MATCH (camp:Campaign {brand_id: $brand_id})-[:TARGETED]->(demo:Demographic)
WHERE camp.date >= date() - duration({days: 30})
RETURN demo.name, count(camp) AS campaign_count
ORDER BY campaign_count DESC
"""
demographic_distribution = neo4j_query(query, brand_id=brand_id)

# Step 4 & 5: Generate insights
insights = {
    "tone_distribution": dict(tone_distribution),
    "content_similarity": avg_similarity,
    "demographic_coverage": demographic_distribution,
    "gaps": []
}

# Identify gaps
if tone_distribution['calm'] / sum(tone_distribution.values()) > 0.7:
    insights['gaps'].append({
        "type": "tone",
        "issue": "over-concentration-calm",
        "recommendation": "Create energetic or aspirational content"
    })

if avg_similarity > 0.75:
    insights['gaps'].append({
        "type": "diversity",
        "issue": "content-too-similar",
        "recommendation": "Diversify visual style or narrative approach"
    })

if demographic_distribution[0]['campaign_count'] / sum([d['campaign_count'] for d in demographic_distribution]) > 0.8:
    insights['gaps'].append({
        "type": "demographic",
        "issue": "narrow-targeting",
        "recommendation": f"Expand to {demographic_distribution[1]['demo.name']}"
    })
```

---

### Pattern 5: Lead Attribution Chain

**Use Case:** Dashboard showing complete lead journey from ad to conversion.

**Flow:**
```
1. User query: "Show me lead journey for jane@example.com"

2. Neo4j: Traverse lead → form → campaign → content
   Query: Follow relationships from Lead back to Content
   Returns: Full attribution chain

3. Neo4j: Get campaign performance during that period
   Returns: Context of when/how lead was acquired

4. Pinecone: Get content semantic profile
   Returns: What type of content attracted this lead

5. Display: Complete journey visualization
```

**Implementation:**
```python
# In Dashboard API (FastAPI)

@router.get("/api/leads/{lead_id}/journey")
async def get_lead_journey(lead_id: str, brand_id: str):
    # Step 1 & 2: Neo4j - Traverse lead attribution
    query = """
    MATCH (lead:Lead {id: $lead_id, brand_id: $brand_id})
    
    OPTIONAL MATCH (lead)-[:SUBMITTED]->(form:WebsiteForm)
    
    OPTIONAL MATCH (lead)-[:CAME_FROM]->(camp:Campaign)
    OPTIONAL MATCH (camp)<-[:RAN_IN]-(content:Content)
    OPTIONAL MATCH (camp)-[:TARGETED]->(demo:Demographic)
    OPTIONAL MATCH (camp)-[:USED_PLATFORM]->(platform:Platform)
    OPTIONAL MATCH (camp)-[:SCHEDULED_AT]->(timeslot:TimeSlot)
    OPTIONAL MATCH (camp)-[:ACHIEVED]->(perf:Performance)
    WHERE perf.date = camp.date
    
    RETURN lead,
           form,
           camp,
           content,
           demo.name AS demographic,
           platform.name AS platform,
           timeslot.name AS timeslot,
           perf
    """
    
    with neo4j_driver.session() as session:
        result = session.run(query, lead_id=lead_id, brand_id=brand_id)
        record = result.single()
        
        if not record:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        journey = {
            "lead": dict(record["lead"]),
            "form": dict(record["form"]) if record["form"] else None,
            "campaign": dict(record["camp"]) if record["camp"] else None,
            "content": dict(record["content"]) if record["content"] else None,
            "demographic": record["demographic"],
            "platform": record["platform"],
            "timeslot": record["timeslot"],
            "performance": dict(record["perf"]) if record["perf"] else None
        }
    
    # Step 3: Pinecone - Get content semantic profile
    if journey["content"]:
        content_id = journey["content"]["id"]
        content_profile = pinecone_index.fetch(
            ids=[f"content_{content_id}_{brand_id}"],
            namespace=f"content-essence-{brand_id}"
        )
        
        if content_profile.vectors:
            vector_data = content_profile.vectors[f"content_{content_id}_{brand_id}"]
            journey["content_profile"] = vector_data.metadata
    
    # Step 4: Build narrative
    narrative = generate_lead_journey_narrative(journey)
    journey["narrative"] = narrative
    
    return journey

def generate_lead_journey_narrative(journey):
    """Create human-readable story of lead journey"""
    
    parts = []
    
    if journey["campaign"]:
        parts.append(f"Lead came from a {journey['platform']} campaign")
        
    if journey["content"]:
        parts.append(f"featuring {journey['content']['filename']}")
        
    if journey["content_profile"]:
        tones = ", ".join(journey["content_profile"]["emotional_tones"][:2])
        parts.append(f"with {tones} tone")
    
    if journey["timeslot"]:
        parts.append(f"shown during {journey['timeslot']}")
    
    if journey["demographic"]:
        parts.append(f"targeting {journey['demographic']}")
    
    if journey["form"]:
        parts.append(f"They submitted a {journey['form']['form_type']} form")
        parts.append(f"with UTM source: {journey['form'].get('utm_source', 'direct')}")
    
    if journey["lead"]["lead_score"]:
        parts.append(f"Lead score: {journey['lead']['lead_score']}/100")
        parts.append(f"Reasoning: {journey['lead']['score_reasoning']}")
    
    return ". ".join(parts) + "."
```

---

### Pattern 6: Cross-Campaign Learning Application

**Use Case:** Applying insights from one client to inform strategy for a new client in similar industry.

**Flow:**
```
1. Pinecone: Query cross-campaign-learnings namespace
   Query: embed("wellness brick-and-mortar local awareness strategy")
   Returns: Patterns discovered across similar businesses

2. Filter by industry/business model
   Filter: industries includes "wellness"
   Returns: "Local landmark visibility boosts engagement 15-25%"

3. Neo4j: Validate pattern holds for current client
   Query: Compare content with/without location visibility
   Returns: Confirms pattern (+22% for this client)

4. Apply: Recommend all future content include location visibility
```

**Implementation:**
```python
# In Strategist Agent (first spawn for new wellness client)

new_client_industry = "yoga-studio"
business_model = "brick-and-mortar-primary"

# Step 1 & 2: Pinecone - Get relevant cross-campaign insights
insights_query = embed(f"{new_client_industry} {business_model} content strategy")

relevant_insights = pinecone_index.query(
    namespace="cross-campaign-learnings",
    vector=insights_query,
    top_k=10,
    include_metadata=True,
    filter={
        "$or": [
            {"industries": {"$in": [new_client_industry, "wellness"]}},
            {"business_models": {"$in": [business_model]}}
        ],
        "confidence": {"$gte": 0.8}
    }
)

# Extract actionable patterns
patterns = []
for match in relevant_insights.matches:
    patterns.append({
        "pattern": match.id,
        "insight": match.metadata["key_insight"],
        "performance_lift": match.metadata["avg_performance_lift"],
        "sample_size": match.metadata["sample_size"],
        "confidence": match.metadata["confidence"]
    })

# Step 3: For existing clients, validate with Neo4j
# For new client, just apply recommended patterns

# Generate strategy recommendations
recommendations = []
for pattern in patterns:
    if pattern["performance_lift"] > 0.15:  # 15%+ improvement
        recommendations.append({
            "strategy": pattern["insight"],
            "expected_impact": f"+{pattern['performance_lift']*100:.0f}% performance",
            "evidence": f"Validated across {pattern['sample_size']} campaigns",
            "confidence": pattern["confidence"]
        })

# Example output:
# {
#   "strategy": "Show physical location with local landmark",
#   "expected_impact": "+22% performance",
#   "evidence": "Validated across 47 campaigns",
#   "confidence": 0.94
# }
```

---

## n8n Workflow Database Interactions

### Workflow 1: Content Ingestion

**Database Operations:**

```javascript
// n8n workflow nodes

// Node 1: Claude Vision API analyzes content
// (no database yet)

// Node 2: Generate semantic description
const semanticDescription = claudeResponse.description;

// Node 3: Create embedding
const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: semanticDescription
});

// Node 4: Store in Pinecone
await pinecone.upsert({
    vectors: [{
        id: `content_${contentId}_${brandId}`,
        values: embedding.data[0].embedding,
        metadata: {
            content_id: contentId,
            brand_id: brandId,
            emotional_tones: claudeAnalysis.tones,
            visual_aesthetics: claudeAnalysis.aesthetics,
            // ... all metadata
        }
    }],
    namespace: `content-essence-${brandId}`
});

// Node 5: Store in Neo4j
await neo4j.run(`
    MERGE (c:Content:Video {
        id: $contentId,
        brand_id: $brandId,
        drive_id: $driveId,
        drive_url: $driveUrl,
        filename: $filename,
        status: 'active',
        upload_date: date(),
        created_at: datetime()
    })
`, {
    contentId,
    brandId,
    driveId,
    driveUrl,
    filename
});

// Node 6: Create attribute relationships in Neo4j
for (const tone of claudeAnalysis.tones) {
    await neo4j.run(`
        MATCH (c:Content {id: $contentId, brand_id: $brandId})
        MATCH (t:Tone {name: $toneName})
        MERGE (c)-[:HAS_TONE {confidence: $confidence}]->(t)
    `, {
        contentId,
        brandId,
        toneName: tone.name,
        confidence: tone.confidence
    });
}

// Similar for aesthetics, colors, composition, narrative elements
```

---

### Workflow 2: Daily Performance Analysis

**Database Operations:**

```javascript
// n8n workflow

// Node 1: Fetch yesterday's performance from ad platforms
const performanceData = await fetchFromAdPlatforms(yesterday);

// Node 2: For each campaign, store performance in Neo4j
for (const campaign of performanceData) {
    await neo4j.run(`
        MATCH (camp:Campaign {id: $campaignId})
        
        CREATE (perf:Performance {
            id: $perfId,
            date: date($date),
            impressions: $impressions,
            clicks: $clicks,
            conversions: $conversions,
            spend: $spend,
            revenue: $revenue,
            ctr: $ctr,
            roas: $roas
        })
        
        MERGE (camp)-[:ACHIEVED]->(perf)
    `, {
        campaignId: campaign.id,
        perfId: `perf_${date}_${campaign.id}`,
        date: yesterday,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        conversions: campaign.conversions,
        spend: campaign.spend,
        revenue: campaign.revenue,
        ctr: campaign.ctr,
        roas: campaign.roas
    });
    
    // Update content aggregate metrics
    await neo4j.run(`
        MATCH (c:Content)<-[:RAN_IN]-(camp:Campaign {id: $campaignId})
        SET c.total_impressions = c.total_impressions + $impressions,
            c.total_spend = c.total_spend + $spend,
            c.updated_at = datetime()
    `, {
        campaignId: campaign.id,
        impressions: campaign.impressions,
        spend: campaign.spend
    });
    
    // Recalculate avg_roas (requires aggregation across all campaigns)
    await neo4j.run(`
        MATCH (c:Content)<-[:RAN_IN]-(camp:Campaign)-[:ACHIEVED]->(perf:Performance)
        WHERE c.brand_id = $brandId
        WITH c, avg(perf.roas) AS avgRoas
        SET c.avg_roas = avgRoas
    `, { brandId });
}

// Node 3: CSO Agent analyzes performance
// Query Pinecone for similar scenarios
const scenario = generateScenarioDescription(performanceData);
const scenarioVector = await embed(scenario);

const similarScenarios = await pinecone.query({
    namespace: `scenario-outcomes-${brandId}`,
    vector: scenarioVector,
    topK: 10,
    includeMetadata: true
});

// Node 4: Make decisions based on similar scenarios + current data
const decision = await claudeAPI({
    prompt: `
        Current performance: ${JSON.stringify(performanceData)}
        Similar past scenarios: ${JSON.stringify(similarScenarios)}
        Make budget allocation decision.
    `
});

// Node 5: Execute decision (update campaigns via ad platform APIs)
await executeBudgetChanges(decision.recommendations);
```

---

### Workflow 3: Learn & Remember

**Database Operations:**

```javascript
// n8n workflow: Runs at end of day after performance analysis

// Node 1: For each campaign × content × audience combination that ran yesterday

const campaigns = await neo4j.run(`
    MATCH (content:Content)<-[:RAN_IN]-(camp:Campaign)-[:TARGETED]->(demo:Demographic)
    MATCH (camp)-[:USED_PLATFORM]->(platform:Platform)
    MATCH (camp)-[:SCHEDULED_AT]->(timeslot:TimeSlot)
    MATCH (camp)-[:ACHIEVED]->(perf:Performance {date: date($yesterday)})
    
    RETURN content.id AS contentId,
           camp.id AS campaignId,
           demo.name AS demographic,
           platform.name AS platform,
           timeslot.name AS timeslot,
           perf
`, { yesterday });

// Node 2: For each result, create scenario description
for (const record of campaigns) {
    // Get content profile from Pinecone
    const contentProfile = await pinecone.fetch({
        ids: [`content_${record.contentId}_${brandId}`],
        namespace: `content-essence-${brandId}`
    });
    
    // Generate rich scenario description
    const scenarioDescription = `
        Scenario: Running ${contentProfile.metadata.format} with 
        ${contentProfile.metadata.emotional_tones.join(', ')} tone and 
        ${contentProfile.metadata.visual_aesthetics.join(', ')} aesthetic.
        Targeting ${record.demographic} on ${record.platform} during 
        ${record.timeslot} with $${record.perf.spend}/day budget.
        Campaign goal: ${record.campaign_goal}.
        
        Outcome: Achieved ${record.perf.roas} ROAS, ${record.perf.ctr} CTR,
        ${record.perf.conversion_rate} conversion rate.
    `;
    
    // Node 3: Create embedding
    const scenarioVector = await embed(scenarioDescription);
    
    // Node 4: Store in Pinecone
    await pinecone.upsert({
        vectors: [{
            id: `scenario_${record.campaignId}_${yesterday}`,
            values: scenarioVector,
            metadata: {
                scenario_id: `scenario_${record.campaignId}_${yesterday}`,
                brand_id: brandId,
                content_id: record.contentId,
                platform: record.platform,
                demographic_target: record.demographic,
                // ... all scenario parameters
                roas: record.perf.roas,
                ctr: record.perf.ctr,
                // ... all performance metrics
                date: yesterday
            }
        }],
        namespace: `scenario-outcomes-${brandId}`
    });
}

// Node 5: Update demographic preference relationships in Neo4j
await neo4j.run(`
    MATCH (demo:Demographic {brand_id: $brandId})
    -[:TARGETED]-(camp:Campaign)
    -[:RAN_IN]-(content:Content)
    -[:HAS_TONE]->(tone:Tone)
    
    MATCH (camp)-[:ACHIEVED]->(perf:Performance)
    WHERE perf.date >= date() - duration({days: 30})
    
    WITH demo, tone, 
         avg(perf.roas) AS avgRoas,
         avg(perf.ctr) AS avgCtr,
         count(camp) AS sampleSize
    
    MERGE (demo)-[r:RESPONDS_TO]->(tone)
    SET r.avg_roas = avgRoas,
        r.avg_ctr = avgCtr,
        r.sample_size = sampleSize,
        r.last_updated = date()
`, { brandId });

// Similar for aesthetics, time slots, etc.
```

---

## Runtime Agent Database Access Patterns

### CSO Agent Pattern

**When Called:** Daily performance analysis, budget decisions

**Database Queries:**
```python
# 1. Neo4j: Get current state
current_state = neo4j_query("""
    MATCH (camp:Campaign {brand_id: $brand_id})-[:USED_PLATFORM]->(p:Platform)
    MATCH (camp)-[:ACHIEVED]->(perf:Performance)
    WHERE perf.date >= date() - duration({days: 7})
    RETURN p.name, avg(perf.roas) AS avg_roas, sum(perf.spend) AS total_spend
""")

# 2. Pinecone: Query similar scenarios
scenario_desc = f"Budget allocation decision for {brand_id}..."
similar_scenarios = pinecone_query(scenario_desc, namespace=f"scenario-outcomes-{brand_id}")

# 3. Analyze and decide
decision = analyze_with_context(current_state, similar_scenarios)

# 4. Neo4j: Log decision
neo4j_run("""
    CREATE (decision:Decision {
        id: $decision_id,
        type: 'budget-reallocation',
        made_at: datetime(),
        reasoning: $reasoning
    })
""")
```

---

### Creative Intelligence Agent Pattern

**When Called:** Content rotation, creative strategy

**Database Queries:**
```python
# 1. Neo4j: Get fatigued content
fatigued = neo4j_query("""
    MATCH (c:Content)-[:RAN_IN]->(camp:Campaign)-[:ACHIEVED]->(perf:Performance)
    WHERE perf.date >= date() - duration({days: 14})
    WITH c, collect({date: perf.date, ctr: perf.ctr}) AS history
    WHERE size(history) >= 7
    // Calculate decline
    RETURN c.id WHERE ctr_declining
""")

# 2. Pinecone: Find similar fresh content
for fatigued_id in fatigued:
    fatigued_vector = get_pinecone_vector(fatigued_id)
    
    replacements = pinecone_query(
        vector=fatigued_vector,
        namespace=f"content-essence-{brand_id}",
        filter={"total_impressions": {"$lt": 5000}}
    )

# 3. Neo4j: Get replacement performance history
for replacement in replacements:
    history = neo4j_query("""
        MATCH (c:Content {id: $content_id})-[:RAN_IN]->()-[:ACHIEVED]->(p:Performance)
        RETURN avg(p.roas)
    """)

# 4. Make rotation decision
```

---

## Dashboard Database Access Patterns

### Executive Summary Endpoint

**Combines both databases:**

```python
@router.get("/api/performance/executive-summary")
async def get_executive_summary(brand_id: str, date_range: str = "7d"):
    # 1. Neo4j: Get aggregate metrics
    metrics = neo4j_query("""
        MATCH (camp:Campaign {brand_id: $brand_id})-[:ACHIEVED]->(perf:Performance)
        WHERE perf.date >= date() - duration({days: $days})
        RETURN sum(perf.spend) AS total_spend,
               avg(perf.roas) AS avg_roas,
               sum(perf.conversions) AS total_conversions,
               sum(perf.revenue) AS total_revenue
    """, brand_id=brand_id, days=7)
    
    # 2. Fetch AI-generated narrative from n8n (stored after Client Translator Agent runs)
    narrative = await fetch_from_n8n(f"/api/insights/latest-narrative/{brand_id}")
    
    # 3. Neo4j: Get top insights (e.g., best performing content)
    insights = neo4j_query("""
        MATCH (c:Content {brand_id: $brand_id})-[:RAN_IN]->()-[:ACHIEVED]->(p:Performance)
        WHERE p.date >= date() - duration({days: $days})
        WITH c, avg(p.roas) AS avg_roas
        ORDER BY avg_roas DESC
        LIMIT 3
        RETURN c.filename, avg_roas
    """, brand_id=brand_id, days=7)
    
    return {
        "metrics": metrics,
        "narrative": narrative,
        "insights": insights
    }
```

---

## Error Handling & Resilience

### Pinecone Connection Failures

```python
def query_pinecone_with_retry(namespace, vector, max_retries=3):
    for attempt in range(max_retries):
        try:
            result = pinecone_index.query(
                namespace=namespace,
                vector=vector,
                top_k=10,
                include_metadata=True
            )
            return result
        except Exception as e:
            if attempt == max_retries - 1:
                # Log error, fall back to Neo4j-only query
                logger.error(f"Pinecone query failed after {max_retries} attempts: {e}")
                return None  # Caller handles gracefully
            time.sleep(2 ** attempt)  # Exponential backoff
```

### Neo4j Connection Failures

```python
def neo4j_query_with_transaction_retry(query, params, max_retries=3):
    for attempt in range(max_retries):
        try:
            with neo4j_driver.session() as session:
                result = session.run(query, params)
                return [record.data() for record in result]
        except Exception as e:
            if attempt == max_retries - 1:
                logger.error(f"Neo4j query failed: {e}")
                raise  # Let caller handle
            time.sleep(1)
```

### Graceful Degradation

```python
# If Pinecone is down, use Neo4j only (less intelligent but functional)
def find_similar_content(content_id, brand_id):
    # Try Pinecone first (semantic similarity)
    try:
        similar = query_pinecone(content_id, brand_id)
        if similar:
            return similar
    except:
        pass
    
    # Fall back to Neo4j (attribute matching)
    return neo4j_query("""
        MATCH (c1:Content {id: $content_id})-[:HAS_TONE]->(tone:Tone)<-[:HAS_TONE]-(c2:Content)
        MATCH (c1)-[:HAS_AESTHETIC]->(aesthetic:Aesthetic)<-[:HAS_AESTHETIC]-(c2)
        WHERE c2.id <> $content_id AND c2.brand_id = $brand_id
        RETURN c2.id, count(*) AS similarity_score
        ORDER BY similarity_score DESC
        LIMIT 10
    """, content_id=content_id, brand_id=brand_id)
```

---

## Performance Optimization

### Caching Strategy

```python
from functools import lru_cache
import redis

redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Cache Neo4j queries that don't change frequently
def get_demographic_preferences_cached(demographic, brand_id):
    cache_key = f"demo_prefs:{brand_id}:{demographic}"
    
    # Check cache
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Query Neo4j
    result = neo4j_query("""
        MATCH (d:Demographic {name: $demographic, brand_id: $brand_id})
        -[r:RESPONDS_TO|PREFERS_AESTHETIC]->(attr)
        RETURN attr.name, r.avg_roas
    """, demographic=demographic, brand_id=brand_id)
    
    # Cache for 1 hour
    redis_client.setex(cache_key, 3600, json.dumps(result))
    
    return result

# Invalidate cache after Learn & Remember workflow updates relationships
def invalidate_demographic_cache(brand_id):
    pattern = f"demo_prefs:{brand_id}:*"
    for key in redis_client.scan_iter(pattern):
        redis_client.delete(key)
```

### Batch Operations

```python
# Instead of querying Pinecone once per content piece
# Batch fetch multiple content profiles

def get_multiple_content_profiles(content_ids, brand_id):
    pinecone_ids = [f"content_{cid}_{brand_id}" for cid in content_ids]
    
    result = pinecone_index.fetch(
        ids=pinecone_ids,
        namespace=f"content-essence-{brand_id}"
    )
    
    return {cid: result.vectors.get(f"content_{cid}_{brand_id}") 
            for cid in content_ids}
```

---

## Summary: When to Use Which Database

| Use Case | Pinecone | Neo4j | Both |
|----------|----------|-------|------|
| Find similar content | ✓ | | |
| Get content performance by demographic | | ✓ | |
| "What should I do in this situation?" | ✓ | | |
| Show lead attribution chain | | ✓ | |
| Understand why content performs | | | ✓ |
| Portfolio balance analysis | ✓ | ✓ | |
| Apply cross-client learnings | ✓ | | |
| Real-time metrics dashboard | | ✓ | |
| Content discovery + performance | | | ✓ |

**General Rule:**
- **Pinecone first** when the question involves similarity, patterns, or "soft" matching
- **Neo4j first** when the question involves specific facts, metrics, or relationships
- **Both together** when you need intelligent discovery + detailed analysis