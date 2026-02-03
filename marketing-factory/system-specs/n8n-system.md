# n8n Workflow System Architecture

## Overview

n8n is the orchestration engine that connects all system components: Claude API for intelligence, Pinecone and Neo4j for memory, ad platforms for campaign management, Google Drive for content storage, and the dashboard for visualization.

**Purpose:** Automate the complete campaign lifecycle from content upload to performance optimization.

---

## Workflow Architecture

### Core Workflows (9 Total)

1. **content-ingestion.json** - Analyzes uploaded content, creates metadata
2. **daily-performance.json** - Analyzes yesterday's data, makes tactical optimizations
3. **weekly-strategy.json** - Strategic review and planning
4. **creative-rotation.json** - Manages creative lifecycle and fatigue
5. **budget-optimization.json** - Distributes budget for maximum ROAS
6. **learn-and-remember.json** - Stores learnings in vector DB
7. **form-ingestion.json** - Processes website form submissions
8. **lead-scoring.json** - Scores and routes leads
9. **shopify-integration.json** - E-commerce purchase tracking (conditional)

---

## Workflow 1: Content Ingestion

**Purpose:** One-time profiling of uploaded content

**Trigger:** Google Drive file added to `/content/` folder

**Frequency:** Real-time (on file upload)

**Duration:** ~2-3 minutes per file

### Node-by-Node Specification

#### Node 1: Google Drive Trigger
**Type:** Google Drive Trigger  
**Event:** File Created  
**Folder:** `/clients/{brand_id}/content/`  
**File Types:** video/*, image/*

**Configuration:**
```json
{
  "resource": "file",
  "event": "add",
  "folderId": "{{$parameter[\"google_drive_folder_id\"]}}",
  "triggerOn": "specificFolder"
}
```

**Output:**
```json
{
  "id": "abc123xyz",
  "name": "acupuncture-treatment-calm.mp4",
  "mimeType": "video/mp4",
  "webViewLink": "https://drive.google.com/file/d/abc123xyz",
  "createdTime": "2026-02-01T10:30:00Z"
}
```

---

#### Node 2: Download File Temporarily
**Type:** HTTP Request  
**Method:** GET  
**URL:** `{{$node["Google Drive Trigger"].json["webViewLink"]}}`  
**Authentication:** OAuth2 (Google)  
**Response Format:** File  
**Download:** Save to `/tmp/{{$node["Google Drive Trigger"].json["id"]}}`

**Why:** Claude API needs the actual file, not just a URL.

---

#### Node 3: Determine File Type
**Type:** Switch  
**Route On:** `{{$node["Google Drive Trigger"].json["mimeType"]}}`

**Routes:**
- `video/*` → Node 4a: Claude Vision API (Video)
- `image/*` → Node 4b: Claude Vision API (Image)
- Other → Node Error Handler

---

#### Node 4a: Claude Vision API - Video Analysis
**Type:** HTTP Request  
**Method:** POST  
**URL:** `https://api.anthropic.com/v1/messages`  
**Authentication:** Header (x-api-key)

**Request Body:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4000,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "document",
          "source": {
            "type": "base64",
            "media_type": "{{$node["Google Drive Trigger"].json["mimeType"]}}",
            "data": "{{$binary.data}}"
          }
        },
        {
          "type": "text",
          "text": "Analyze this video for marketing campaign use. Extract:\n\n1. **Emotional Tones** (with confidence 0-1): What emotions does this evoke? (calm, energetic, professional, playful, aspirational, reassuring, urgent, educational)\n\n2. **Visual Aesthetics** (with confidence 0-1): What's the visual style? (minimal, luxurious, intimate, modern, rustic, vibrant, clean, warm)\n\n3. **Color Palette**: \n   - Primary colors (warm-tones, cool-tones, earth-tones, vibrant, pastel, monochrome)\n   - Accent colors\n   - Overall temperature (warm/cool/neutral)\n   - Saturation level (high/medium/low)\n   - Brightness level (bright/medium/dark)\n\n4. **Composition**:\n   - Camera movement (steady, handheld, dynamic, static)\n   - Shot types (close-up, medium-shot, wide-shot, establishing)\n   - Focus style (environment-focused, people-focused, product-focused)\n   - Framing (intimate, spacious, centered, rule-of-thirds)\n\n5. **Narrative Elements** (boolean):\n   - shows_physical_space\n   - shows_people\n   - shows_product_service\n   - demonstrates_use\n   - has_dialogue\n   - has_text_overlay\n   - local_landmark_visible (if yes, specify what landmark)\n\n6. **Pacing**: slow, moderate, fast\n\n7. **Production Quality**: amateur, semi-professional, professional-high\n\n8. **Audio Elements**:\n   - Type (voiceover, music, ambient-only, silent)\n   - Music genre (if applicable)\n   - Voiceover tone (if applicable)\n   - Sound effects (subtle, prominent, none)\n\n9. **Duration**: Estimate in seconds\n\n10. **Semantic Description**: Write a rich, detailed 150-200 word narrative description that captures the essence of this video. This will be used for semantic search. Include:\n    - What's shown\n    - The emotional atmosphere\n    - Visual style and aesthetic\n    - Color palette and lighting\n    - Any notable narrative elements\n    - The overall message or feeling it communicates\n    - What type of audience and campaign goal it would suit\n\nReturn ONLY valid JSON in this exact structure:\n\n```json\n{\n  \"emotional_tones\": [\n    {\"name\": \"calm\", \"confidence\": 0.95},\n    {\"name\": \"professional\", \"confidence\": 0.82}\n  ],\n  \"visual_aesthetics\": [\n    {\"name\": \"minimal\", \"confidence\": 0.92},\n    {\"name\": \"intimate\", \"confidence\": 0.85}\n  ],\n  \"color_palette\": {\n    \"primary\": [\"warm-tones\", \"earth-tones\", \"beige\"],\n    \"accent\": [\"soft-brown\", \"cream\"],\n    \"temperature\": \"warm\",\n    \"saturation\": \"low\",\n    \"brightness\": \"medium\"\n  },\n  \"composition\": {\n    \"camera_movement\": \"steady\",\n    \"shot_types\": [\"close-up\", \"medium-shot\"],\n    \"focus_style\": \"environment-focused\",\n    \"framing\": \"intimate\"\n  },\n  \"narrative_elements\": {\n    \"shows_physical_space\": true,\n    \"shows_people\": false,\n    \"shows_product_service\": true,\n    \"demonstrates_use\": true,\n    \"has_dialogue\": false,\n    \"has_text_overlay\": false,\n    \"local_landmark_visible\": \"stanford-campus\"\n  },\n  \"pacing\": \"slow\",\n  \"production_quality\": \"professional-high\",\n  \"audio_elements\": {\n    \"type\": \"ambient-only\",\n    \"music\": false,\n    \"voiceover\": false,\n    \"sound_effects\": \"subtle\"\n  },\n  \"duration_seconds\": 30,\n  \"semantic_description\": \"A 30-second vertical video showcasing...\"\n}\n```"
        }
      ]
    }
  ]
}
```

**Output Processing:**
- Extract JSON from Claude response
- Strip any markdown code fences if present
- Parse JSON
- Validate structure

---

#### Node 4b: Claude Vision API - Image Analysis
**Type:** HTTP Request  
**Similar to Node 4a but with image-specific prompt**

**Prompt differences:**
- Remove audio elements
- Remove duration
- Remove pacing (static image)
- Add: "Composition: symmetry, negative space, focal point"

---

#### Node 5: Generate Content ID
**Type:** Code (JavaScript)  
**Purpose:** Create unique content ID

```javascript
const fileId = $node["Google Drive Trigger"].json.id;
const filename = $node["Google Drive Trigger"].json.name;
const brandId = "{{$parameter[\"brand_id\"]}}";
const timestamp = Date.now();

// Determine content type
const mimeType = $node["Google Drive Trigger"].json.mimeType;
const isVideo = mimeType.startsWith('video/');
const contentType = isVideo ? 'video' : 'image';

// Generate sequential ID
// In production, query Neo4j for max ID and increment
const contentId = `${contentType}-${timestamp}`;

return {
  json: {
    content_id: contentId,
    brand_id: brandId,
    drive_id: fileId,
    drive_url: $node["Google Drive Trigger"].json.webViewLink,
    filename: filename,
    content_type: contentType
  }
};
```

---

#### Node 6: Create Semantic Description Embedding
**Type:** HTTP Request  
**Method:** POST  
**URL:** `https://api.openai.com/v1/embeddings`  
**Authentication:** Bearer Token

**Request Body:**
```json
{
  "model": "text-embedding-3-small",
  "input": "{{$node["Claude Vision API"].json.semantic_description}}"
}
```

**Output:**
```json
{
  "data": [
    {
      "embedding": [0.234, -0.891, 0.445, ...],  // 1536 dimensions
      "index": 0
    }
  ]
}
```

---

#### Node 7: Store in Pinecone
**Type:** HTTP Request  
**Method:** POST  
**URL:** `https://{index-host}/vectors/upsert`  
**Authentication:** API Key Header

**Request Body:**
```json
{
  "vectors": [
    {
      "id": "content_{{$node["Generate Content ID"].json.content_id}}_{{$node["Generate Content ID"].json.brand_id}}",
      "values": {{$node["Create Embedding"].json.data[0].embedding}},
      "metadata": {
        "content_id": "{{$node["Generate Content ID"].json.content_id}}",
        "brand_id": "{{$node["Generate Content ID"].json.brand_id}}",
        "industry": "{{$parameter[\"industry\"]}}",
        "drive_id": "{{$node["Generate Content ID"].json.drive_id}}",
        "drive_url": "{{$node["Generate Content ID"].json.drive_url}}",
        "filename": "{{$node["Generate Content ID"].json.filename}}",
        
        "emotional_tones": {{$node["Claude Vision API"].json.emotional_tones.map(t => t.name)}},
        "tone_confidences": {{$node["Claude Vision API"].json.emotional_tones.map(t => t.confidence)}},
        "visual_aesthetics": {{$node["Claude Vision API"].json.visual_aesthetics.map(a => a.name)}},
        "aesthetic_confidences": {{$node["Claude Vision API"].json.visual_aesthetics.map(a => a.confidence)}},
        
        "color_palette_primary": {{$node["Claude Vision API"].json.color_palette.primary}},
        "color_palette_accent": {{$node["Claude Vision API"].json.color_palette.accent}},
        "color_temperature": "{{$node["Claude Vision API"].json.color_palette.temperature}}",
        
        "composition_camera_movement": "{{$node["Claude Vision API"].json.composition.camera_movement}}",
        "composition_shot_types": {{$node["Claude Vision API"].json.composition.shot_types}},
        
        "shows_physical_space": {{$node["Claude Vision API"].json.narrative_elements.shows_physical_space}},
        "shows_people": {{$node["Claude Vision API"].json.narrative_elements.shows_people}},
        "local_landmark_visible": "{{$node["Claude Vision API"].json.narrative_elements.local_landmark_visible}}",
        "has_dialogue": {{$node["Claude Vision API"].json.narrative_elements.has_dialogue}},
        
        "pacing": "{{$node["Claude Vision API"].json.pacing}}",
        "production_quality": "{{$node["Claude Vision API"].json.production_quality}}",
        "duration_seconds": {{$node["Claude Vision API"].json.duration_seconds}},
        
        "total_impressions": 0,
        "total_spend": 0.0,
        "avg_roas": 0.0,
        "avg_ctr": 0.0,
        "creative_fatigue_score": 0.0,
        
        "upload_date": "{{$node["Google Drive Trigger"].json.createdTime.split('T')[0]}}",
        "profile_date": "{{$today}}",
        "status": "active"
      }
    }
  ],
  "namespace": "content-essence-{{$node["Generate Content ID"].json.brand_id}}"
}
```

---

#### Node 8: Create Content Node in Neo4j
**Type:** Neo4j Node  
**Operation:** Run Query

**Query:**
```cypher
MERGE (c:Content:{content_type} {
  id: $content_id,
  brand_id: $brand_id
})
SET c.drive_id = $drive_id,
    c.drive_url = $drive_url,
    c.filename = $filename,
    c.duration_seconds = $duration_seconds,
    c.resolution = $resolution,
    c.format = $format,
    c.upload_date = date($upload_date),
    c.profile_date = date(),
    c.status = 'active',
    c.total_impressions = 0,
    c.total_spend = 0.0,
    c.avg_roas = 0.0,
    c.created_at = datetime(),
    c.updated_at = datetime()
```

**Parameters:**
```json
{
  "content_id": "{{$node["Generate Content ID"].json.content_id}}",
  "brand_id": "{{$node["Generate Content ID"].json.brand_id}}",
  "content_type": "{{$node["Generate Content ID"].json.content_type === 'video' ? 'Video' : 'Image'}}",
  "drive_id": "{{$node["Generate Content ID"].json.drive_id}}",
  "drive_url": "{{$node["Generate Content ID"].json.drive_url}}",
  "filename": "{{$node["Generate Content ID"].json.filename}}",
  "duration_seconds": {{$node["Claude Vision API"].json.duration_seconds || null}},
  "resolution": "{{$node["Google Drive Trigger"].json.imageMediaMetadata?.width || $node["Google Drive Trigger"].json.videoMediaMetadata?.width}}x{{$node["Google Drive Trigger"].json.imageMediaMetadata?.height || $node["Google Drive Trigger"].json.videoMediaMetadata?.height}}",
  "format": "{{$node["Generate Content ID"].json.content_type === 'video' ? 'video' : 'image'}}",
  "upload_date": "{{$node["Google Drive Trigger"].json.createdTime}}"
}
```

---

#### Node 9: Create Attribute Relationships in Neo4j
**Type:** Code (JavaScript) + Loop + Neo4j Nodes

**Purpose:** Create relationships from content to tone/aesthetic/color nodes

**Code:**
```javascript
const analysis = $node["Claude Vision API"].json;
const contentId = $node["Generate Content ID"].json.content_id;
const brandId = $node["Generate Content ID"].json.brand_id;

const relationships = [];

// Tones
analysis.emotional_tones.forEach(tone => {
  relationships.push({
    type: 'HAS_TONE',
    target_node: 'Tone',
    target_property: 'name',
    target_value: tone.name,
    relationship_props: { confidence: tone.confidence }
  });
});

// Aesthetics
analysis.visual_aesthetics.forEach(aesthetic => {
  relationships.push({
    type: 'HAS_AESTHETIC',
    target_node: 'Aesthetic',
    target_property: 'name',
    target_value: aesthetic.name,
    relationship_props: { confidence: aesthetic.confidence }
  });
});

// Colors
analysis.color_palette.primary.forEach(color => {
  relationships.push({
    type: 'HAS_COLOR_PALETTE',
    target_node: 'ColorPalette',
    target_property: 'name',
    target_value: color,
    relationship_props: {}
  });
});

// Composition
analysis.composition.shot_types.forEach(shotType => {
  relationships.push({
    type: 'HAS_COMPOSITION',
    target_node: 'Composition',
    target_property: 'name',
    target_value: shotType,
    relationship_props: {}
  });
});

// Narrative elements
Object.entries(analysis.narrative_elements).forEach(([key, value]) => {
  if (value === true || (typeof value === 'string' && value !== '')) {
    relationships.push({
      type: 'SHOWS',
      target_node: 'NarrativeElement',
      target_property: 'name',
      target_value: key,
      relationship_props: {}
    });
  }
});

return relationships.map(rel => ({
  json: {
    content_id: contentId,
    brand_id: brandId,
    ...rel
  }
}));
```

**Loop:** For each relationship, run Neo4j query:

```cypher
MATCH (c:Content {id: $content_id, brand_id: $brand_id})
MATCH (target:{target_node} {name: $target_value})
MERGE (c)-[r:{relationship_type}]->(target)
SET r += $relationship_props
```

---

#### Node 10: Delete Temporary File
**Type:** Code (JavaScript)

```javascript
const fs = require('fs');
const filePath = `/tmp/{{$node["Google Drive Trigger"].json.id}}`;

try {
  fs.unlinkSync(filePath);
  return { json: { deleted: true, path: filePath } };
} catch (error) {
  return { json: { deleted: false, error: error.message } };
}
```

---

#### Node 11: Notify Dashboard
**Type:** HTTP Request  
**Method:** POST  
**URL:** `{{$parameter["dashboard_api_url"]}}/api/webhooks/content-uploaded`

**Body:**
```json
{
  "content_id": "{{$node["Generate Content ID"].json.content_id}}",
  "filename": "{{$node["Generate Content ID"].json.filename}}",
  "drive_url": "{{$node["Generate Content ID"].json.drive_url}}",
  "status": "ready",
  "analysis_summary": {
    "tones": {{$node["Claude Vision API"].json.emotional_tones.map(t => t.name)}},
    "aesthetics": {{$node["Claude Vision API"].json.visual_aesthetics.map(a => a.name)}}
  },
  "timestamp": "{{$now}}"
}
```

---

#### Node 12: Error Handler
**Type:** Error Workflow

**On Error:**
1. Log to error tracking service
2. Store failed file metadata
3. Notify admin via email
4. Mark file in Google Drive with "FAILED" prefix

---

### Content Ingestion Summary

**Total Nodes:** 12  
**Execution Time:** 2-3 minutes  
**Cost per Execution:**
- Claude API: ~$0.03 (vision analysis)
- OpenAI Embeddings: ~$0.000006
- Total: ~$0.03

**Outputs:**
- Pinecone vector with full metadata
- Neo4j content node with relationships
- Dashboard notification
- Content ready for campaign use

---

## Workflow 2: Daily Performance Analysis

**Purpose:** Analyze yesterday's performance, make tactical optimizations

**Trigger:** Cron - Daily at 2:00 AM

**Frequency:** Once per day

**Duration:** ~10-15 minutes

### Node-by-Node Specification

#### Node 1: Cron Trigger
**Type:** Cron  
**Schedule:** `0 2 * * *` (2 AM daily)

**Configuration:**
```json
{
  "cronExpression": "0 2 * * *",
  "timezone": "{{$parameter[\"timezone\"]}}"
}
```

---

#### Node 2: Set Date Variables
**Type:** Code (JavaScript)

```javascript
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const yesterdayStr = yesterday.toISOString().split('T')[0];
const sevenDaysAgo = new Date(yesterday);
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

return {
  json: {
    yesterday: yesterdayStr,
    seven_days_ago: sevenDaysAgoStr,
    brand_id: "{{$parameter[\"brand_id\"]}}"
  }
};
```

---

#### Node 3: Fetch Google Ads Performance
**Type:** Google Ads Node  
**Operation:** Get Campaigns Report

**Configuration:**
```json
{
  "operation": "getReport",
  "reportType": "CAMPAIGN_PERFORMANCE_REPORT",
  "fields": [
    "campaign.id",
    "campaign.name",
    "metrics.impressions",
    "metrics.clicks",
    "metrics.conversions",
    "metrics.cost_micros",
    "metrics.conversion_value",
    "metrics.ctr",
    "metrics.average_cpm",
    "metrics.average_cpc"
  ],
  "dateRange": {
    "startDate": "{{$node["Set Date Variables"].json.yesterday}}",
    "endDate": "{{$node["Set Date Variables"].json.yesterday}}"
  }
}
```

**Output Processing:**
```javascript
// Convert cost from micros to dollars
const results = $input.all().map(item => ({
  campaign_id: item.json.campaign.id,
  campaign_name: item.json.campaign.name,
  platform: 'google-search',
  date: $node["Set Date Variables"].json.yesterday,
  impressions: parseInt(item.json.metrics.impressions),
  clicks: parseInt(item.json.metrics.clicks),
  conversions: parseFloat(item.json.metrics.conversions),
  spend: parseInt(item.json.metrics.cost_micros) / 1000000,
  revenue: parseFloat(item.json.metrics.conversion_value),
  ctr: parseFloat(item.json.metrics.ctr),
  cpm: parseFloat(item.json.metrics.average_cpm),
  cpc: parseFloat(item.json.metrics.average_cpc)
}));

return results;
```

---

#### Node 4: Fetch Meta Ads Performance
**Type:** HTTP Request  
**Method:** GET  
**URL:** `https://graph.facebook.com/v18.0/act_{ad_account_id}/insights`

**Query Parameters:**
```json
{
  "time_range": {
    "since": "{{$node["Set Date Variables"].json.yesterday}}",
    "until": "{{$node["Set Date Variables"].json.yesterday}}"
  },
  "fields": "campaign_id,campaign_name,impressions,clicks,actions,spend,ctr,cpm,cpc",
  "level": "campaign",
  "access_token": "{{$credentials.metaAccessToken}}"
}
```

**Output Processing:**
```javascript
const results = $input.all().map(item => {
  const conversions = item.json.actions?.find(a => a.action_type === 'purchase')?.value || 0;
  const revenue = item.json.action_values?.find(a => a.action_type === 'purchase')?.value || 0;
  
  return {
    campaign_id: item.json.campaign_id,
    campaign_name: item.json.campaign_name,
    platform: 'facebook', // or 'instagram' based on placement
    date: $node["Set Date Variables"].json.yesterday,
    impressions: parseInt(item.json.impressions),
    clicks: parseInt(item.json.clicks),
    conversions: parseFloat(conversions),
    spend: parseFloat(item.json.spend),
    revenue: parseFloat(revenue),
    ctr: parseFloat(item.json.ctr),
    cpm: parseFloat(item.json.cpm),
    cpc: parseFloat(item.json.cpc)
  };
});

return results;
```

---

#### Node 5: Merge Performance Data
**Type:** Code (JavaScript)

**Purpose:** Combine Google Ads + Meta Ads data

```javascript
const googleData = $node["Fetch Google Ads Performance"].json;
const metaData = $node["Fetch Meta Ads Performance"].json;

const allPerformance = [...googleData, ...metaData];

// Calculate derived metrics
const enriched = allPerformance.map(perf => ({
  ...perf,
  roas: perf.revenue > 0 ? perf.revenue / perf.spend : 0,
  conversion_rate: perf.clicks > 0 ? perf.conversions / perf.clicks : 0,
  cost_per_conversion: perf.conversions > 0 ? perf.spend / perf.conversions : 0
}));

return enriched;
```

---

#### Node 6: Store Performance in Neo4j
**Type:** Loop + Neo4j Node

**For Each Performance Record:**

```cypher
MATCH (camp:Campaign)
WHERE camp.id = $campaign_id OR camp.external_id = $campaign_id

CREATE (perf:Performance {
  id: $perf_id,
  date: date($date),
  impressions: $impressions,
  clicks: $clicks,
  conversions: $conversions,
  spend: $spend,
  revenue: $revenue,
  ctr: $ctr,
  cpm: $cpm,
  cpc: $cpc,
  roas: $roas,
  conversion_rate: $conversion_rate,
  cost_per_conversion: $cost_per_conversion
})

MERGE (camp)-[:ACHIEVED]->(perf)

// Update content aggregate metrics
WITH camp
MATCH (c:Content)<-[:RAN_IN]-(camp)
SET c.total_impressions = c.total_impressions + $impressions,
    c.total_spend = c.total_spend + $spend,
    c.updated_at = datetime()
```

**Parameters:**
```json
{
  "campaign_id": "{{$item.campaign_id}}",
  "perf_id": "perf_{{$item.date}}_{{$item.campaign_id}}",
  "date": "{{$item.date}}",
  "impressions": {{$item.impressions}},
  "clicks": {{$item.clicks}},
  "conversions": {{$item.conversions}},
  "spend": {{$item.spend}},
  "revenue": {{$item.revenue}},
  "ctr": {{$item.ctr}},
  "cpm": {{$item.cpm}},
  "cpc": {{$item.cpc}},
  "roas": {{$item.roas}},
  "conversion_rate": {{$item.conversion_rate}},
  "cost_per_conversion": {{$item.cost_per_conversion}}
}
```

---

#### Node 7: Recalculate Content Avg ROAS
**Type:** Neo4j Node

```cypher
MATCH (c:Content {brand_id: $brand_id})
-[:RAN_IN]->(camp:Campaign)
-[:ACHIEVED]->(perf:Performance)

WITH c, avg(perf.roas) AS avgRoas, avg(perf.ctr) AS avgCtr, avg(perf.cpm) AS avgCpm

SET c.avg_roas = avgRoas,
    c.avg_ctr = avgCtr,
    c.avg_cpm = avgCpm,
    c.updated_at = datetime()
```

---

#### Node 8: Query Similar Scenarios from Pinecone
**Type:** Code (JavaScript) + HTTP Request

**Purpose:** Find similar past situations for decision context

```javascript
// Generate scenario description for current state
const platformPerformance = $node["Merge Performance Data"].json;

const scenarioDescription = `
Current campaign performance analysis for ${$node["Set Date Variables"].json.brand_id}:

Platform performance:
${platformPerformance.map(p => 
  `- ${p.platform}: ROAS ${p.roas.toFixed(2)}, CTR ${(p.ctr * 100).toFixed(2)}%, CPM $${p.cpm.toFixed(2)}`
).join('\n')}

Total spend: $${platformPerformance.reduce((sum, p) => sum + p.spend, 0).toFixed(2)}
Total conversions: ${platformPerformance.reduce((sum, p) => sum + p.conversions, 0)}

Analyzing whether budget allocation should be adjusted.
`;

return { json: { scenario_description: scenarioDescription } };
```

**Then: Create Embedding + Query Pinecone** (similar to content ingestion pattern)

```json
{
  "namespace": "scenario-outcomes-{{$parameter[\"brand_id\"]}}",
  "vector": "{{$node["Create Scenario Embedding"].json.data[0].embedding}}",
  "topK": 10,
  "includeMetadata": true
}
```

---

#### Node 9: CSO Agent - Analyze & Decide
**Type:** HTTP Request (Claude API)  
**Method:** POST  
**URL:** `https://api.anthropic.com/v1/messages`

**Request Body:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 3000,
  "system": "{{file::/automation/prompts/chief-strategy-officer.md}}",
  "messages": [
    {
      "role": "user",
      "content": "Analyze yesterday's performance and make tactical optimization decisions.\n\n**Current Performance:**\n{{JSON.stringify($node[\"Merge Performance Data\"].json, null, 2)}}\n\n**Similar Past Scenarios:**\n{{JSON.stringify($node[\"Query Similar Scenarios\"].json.matches, null, 2)}}\n\n**Brand Config:**\n{{JSON.stringify($parameter[\"brand_config\"], null, 2)}}\n\nProvide recommendations in JSON format:\n```json\n{\n  \"summary\": \"Brief overall assessment\",\n  \"decisions\": [\n    {\n      \"type\": \"budget_shift\",\n      \"action\": \"Shift $X from Platform A to Platform B\",\n      \"reasoning\": \"...\",\n      \"expected_outcome\": \"...\",\n      \"confidence\": 0.85\n    }\n  ],\n  \"alerts\": [\n    {\"type\": \"warning\", \"message\": \"...\"}\n  ]\n}\n```"
    }
  ]
}
```

**Output Processing:**
- Extract JSON from response
- Validate decision structure
- Log decisions to Neo4j

---

#### Node 10: Execute Tactical Decisions
**Type:** Switch + Multiple Branches

**Routes:**
1. Budget Adjustments → Update campaigns via ad platform APIs
2. Campaign Pauses → Pause underperforming campaigns
3. Creative Rotations → Trigger creative rotation workflow
4. Alerts → Send to dashboard/email

**Example: Budget Adjustment Branch**

**Node 10a: Update Google Ads Budget**
```json
{
  "operation": "update",
  "resource": "campaign",
  "campaignId": "{{$item.campaign_id}}",
  "budget": {
    "amountMicros": {{$item.new_budget * 1000000}}
  }
}
```

**Node 10b: Update Meta Ads Budget**
```json
{
  "method": "POST",
  "url": "https://graph.facebook.com/v18.0/{{$item.campaign_id}}",
  "body": {
    "daily_budget": {{$item.new_budget * 100}},
    "access_token": "{{$credentials.metaAccessToken}}"
  }
}
```

---

#### Node 11: Update Pinecone Content Metadata
**Type:** Loop + HTTP Request

**For each content that ran yesterday, update performance metadata:**

```javascript
// Query Neo4j for content performance
const contentPerformance = await neo4jQuery(`
  MATCH (c:Content {brand_id: $brand_id})
  -[:RAN_IN]->()-[:ACHIEVED]->(p:Performance {date: date($yesterday)})
  RETURN c.id AS content_id, 
         sum(p.impressions) AS impressions,
         sum(p.spend) AS spend
`);

// For each content, update Pinecone
for (const content of contentPerformance) {
  await pineconeUpdate({
    id: `content_${content.content_id}_${brandId}`,
    setMetadata: {
      total_impressions: content.total_impressions + content.impressions,
      total_spend: content.total_spend + content.spend,
      last_used_date: yesterday
    },
    namespace: `content-essence-${brandId}`
  });
}
```

---

#### Node 12: Send to Dashboard
**Type:** HTTP Request  
**Method:** POST  
**URL:** `{{$parameter["dashboard_api_url"]}}/api/webhooks/daily-analysis`

```json
{
  "date": "{{$node["Set Date Variables"].json.yesterday}}",
  "summary": "{{$node["CSO Agent"].json.summary}}",
  "decisions": {{$node["CSO Agent"].json.decisions}},
  "alerts": {{$node["CSO Agent"].json.alerts}},
  "performance": {{$node["Merge Performance Data"].json}}
}
```

---

### Daily Performance Summary

**Total Nodes:** 12 main + branches  
**Execution Time:** 10-15 minutes  
**Cost per Execution:**
- Claude API (CSO Agent): ~$0.08
- OpenAI Embeddings: ~$0.000006
- Total: ~$0.08

**Key Outputs:**
- Performance data in Neo4j
- Updated content metadata in Pinecone
- Tactical decisions executed on ad platforms
- Dashboard updated with latest insights

---

## Workflow 3: Weekly Strategy Review

**Purpose:** Deep strategic analysis and planning

**Trigger:** Cron - Weekly (Monday at 3:00 AM)

**Frequency:** Once per week

**Duration:** ~20-30 minutes

### High-Level Flow

```
1. Compile week's performance data (Neo4j)
2. Query similar week-long scenarios (Pinecone)
3. Get historical context for this client
4. CSO Agent: Strategic analysis
5. Creative Intelligence Agent: Portfolio review
6. Cultural Anthropologist Agent: Demographic insights
7. Data Scientist Agent: Statistical patterns
8. Synthesize all insights
9. Client Translator Agent: Generate report
10. Store learnings in Pinecone
11. Email report to client
12. Update dashboard
```

**Key Difference from Daily:** More agents involved, longer lookback period, strategic (not tactical) focus.

---

## Workflow 4: Creative Rotation & Fatigue Detection

**Purpose:** Manage creative lifecycle, prevent fatigue

**Trigger:** Cron - Daily at 1:00 AM (before performance analysis)

**Frequency:** Once per day

**Duration:** ~5-10 minutes

### High-Level Flow

```
1. Query all active content performance trends (Neo4j)
2. Calculate fatigue scores (CTR decline over time)
3. Identify fatigued content (CTR dropped >30% over 7-14 days)
4. Creative Intelligence Agent: Analyze fatigue
5. For each fatigued content:
   a. Query Pinecone for similar fresh content
   b. Filter by unused/low-impression content
   c. Get Neo4j performance history of candidates
6. Creative Intelligence Agent: Select replacements
7. Media Buyer Agent: Execute rotation
   a. Gradually reduce budget on fatigued content
   b. Gradually increase budget on fresh content
8. Log rotation events in Neo4j
9. Update content status: fatigued → "resting"
10. Notify dashboard
```

**Fatigue Calculation:**
```javascript
// For each active content
const performanceHistory = await neo4jQuery(`
  MATCH (c:Content {id: $contentId})-[:RAN_IN]->()-[:ACHIEVED]->(p:Performance)
  WHERE p.date >= date() - duration({days: 14})
  RETURN p.date, p.ctr
  ORDER BY p.date ASC
`);

if (performanceHistory.length < 7) {
  return { fatigued: false }; // Not enough data
}

const earlyCtr = mean(performanceHistory.slice(0, 3).map(p => p.ctr));
const recentCtr = mean(performanceHistory.slice(-3).map(p => p.ctr));

const declinePercent = (earlyCtr - recentCtr) / earlyCtr;

return {
  fatigued: declinePercent > 0.30,
  decline_percent: declinePercent,
  early_ctr: earlyCtr,
  recent_ctr: recentCtr
};
```

---

## Workflow 5: Budget Optimization

**Purpose:** Distribute budget for maximum ROAS

**Trigger:** Cron - Daily at 3:00 AM (after performance analysis)

**Frequency:** Once per day

**Duration:** ~5-8 minutes

### High-Level Flow

```
1. Query current budget allocation (Neo4j + ad platforms)
2. Query performance by:
   - Platform
   - Demographic
   - Geographic area
   - Time slot
   - Content
3. Calculate ROAS for each dimension
4. Data Scientist Agent: Mathematical optimization
5. Query Pinecone for similar budget shift scenarios
6. CSO Agent: Strategic decision (combines math + historical context)
7. Media Buyer Agent: Execute shifts gradually
8. Maintain test allocation (10-20% for discovery)
9. Log budget changes in Neo4j
10. Update dashboard
```

**Key Constraints:**
- Minimum budget per platform ($50/day)
- Maximum shift per day (30% of total budget)
- Maintain test allocation (15%)
- Respect platform minimums

---

## Workflow 6: Learn & Remember

**Purpose:** Store learnings in vector DB for future decision-making

**Trigger:** Cron - Daily at 4:00 AM (after all analysis complete)

**Frequency:** Once per day

**Duration:** ~10-15 minutes

### High-Level Flow

```
1. Query all campaigns that ran yesterday (Neo4j)
2. For each campaign:
   a. Get content semantic profile (Pinecone)
   b. Get campaign parameters (platform, demographic, time, budget)
   c. Get performance outcome (Neo4j)
   d. Generate rich scenario description
   e. Create embedding
   f. Store in Pinecone scenario-outcomes namespace
3. Identify "surprise outcomes" (performance deviated from prediction)
4. Cultural Anthropologist Agent: Explain surprises
5. Store meta-learnings in cross-campaign namespace
6. Update Neo4j relationship weights:
   - (Demographic)-[:RESPONDS_TO]->(Tone) [update avg_roas, sample_size]
   - (Demographic)-[:PREFERS_AESTHETIC]->(Aesthetic)
   - etc.
7. Log learnings summary to dashboard
```

**Scenario Description Template:**
```javascript
const scenario = `
Scenario: Running ${contentType} with ${tones.join(', ')} tone and ${aesthetics.join(', ')} aesthetic featuring ${colorPalette} colors. Content shows ${narrativeElements}. Targeting ${demographic} (age ${ageRange}) on ${platform} during ${timeSlot} with $${budget}/day budget. Campaign goal: ${goal}. Journey stage: ${stage}. Geographic targeting: ${geoStrategy}. Season: ${season}. Day: ${dayOfWeek}.

Outcome: Achieved ${roas} ROAS with ${ctr} CTR, ${conversionRate} conversion rate, $${cpm} CPM. ${totalImpressions} impressions, ${totalConversions} conversions. ${keyInsight}
`;
```

---

## Workflow 7: Form Ingestion

**Purpose:** Process website form submissions

**Trigger:** Webhook from website backend

**Frequency:** Real-time (on form submission)

**Duration:** ~30 seconds

### High-Level Flow

```
1. Webhook receives form data from website
2. Validate form data
3. Create (Lead) node in Neo4j
4. Create (WebsiteForm) node in Neo4j
5. Link (Lead)-[:SUBMITTED]->(Form)
6. If source_campaign provided, link (Lead)-[:CAME_FROM]->(Campaign)
7. Lead Scoring Agent (Claude API):
   a. Analyze form data (service interest, message content, urgency signals)
   b. Assign score 0-100
   c. Provide scoring reasoning
8. Route based on score:
   - Hot lead (>90): Immediate SMS + email to owner
   - Warm lead (70-89): Standard email sequence
   - Cold lead (50-69): Newsletter list + retargeting
9. Add to retargeting audiences (Meta, Google)
10. Send confirmation email to lead
11. Notify dashboard (new lead alert)
12. Store lead event for attribution analysis
```

**Lead Scoring Prompt:**
```
Analyze this lead and assign a quality score 0-100.

Form Data:
- Name: {{$json.name}}
- Email: {{$json.email}}
- Phone: {{$json.phone}}
- Service Interest: {{$json.service_interest}}
- Message: {{$json.message}}
- Source: {{$json.source}}
- Campaign: {{$json.source_campaign}}
- UTM Parameters: {{JSON.stringify($json.utm_params)}}

Context:
- Brand: {{$parameter["brand_name"]}}
- Industry: {{$parameter["industry"]}}
- Average customer value: {{$parameter["avg_customer_value"]}}

Score based on:
1. Specificity of service interest
2. Quality/detail of message
3. Urgency signals ("ASAP", "soon", "urgent")
4. Contact info completeness
5. Source quality (organic > paid social > cold traffic)

Return JSON:
{
  "score": 85,
  "tier": "hot|warm|cold",
  "reasoning": "...",
  "recommended_action": "..."
}
```

---

## Workflow 8: Lead Scoring

**Purpose:** Score and route leads intelligently

**Trigger:** Called by Form Ingestion workflow

**Frequency:** Real-time (per form submission)

**Duration:** ~10 seconds

(Integrated into Form Ingestion workflow above)

---

## Workflow 9: Shopify Integration (E-commerce Only)

**Purpose:** Track purchase attribution for e-commerce clients

**Trigger:** Webhook from Shopify (order created)

**Frequency:** Real-time (on purchase)

**Duration:** ~30 seconds

### High-Level Flow

```
1. Webhook receives order data from Shopify
2. Validate webhook signature
3. Extract customer email, order total, products
4. Match email to (Lead) node in Neo4j (if exists)
5. Create (Purchase) node in Neo4j
6. Link (Customer)-[:MADE_PURCHASE]->(Purchase)
7. If lead found:
   a. Trace back to (Campaign) via (Lead)-[:CAME_FROM]->(Campaign)
   b. Trace to (Content) via (Campaign)<-[:RAN_IN]-(Content)
   c. Create attribution relationships:
      - (Purchase)-[:ATTRIBUTED_TO]->(Campaign)
      - (Purchase)-[:ATTRIBUTED_TO]->(Content)
8. Update content metrics:
   a. content.total_revenue += purchase.order_total
   b. Recalculate content.avg_roas (now includes purchase data, not just leads)
9. Update campaign ROAS in Neo4j
10. Update Pinecone content metadata (true ROAS)
11. CSO Agent: Analyze impact, adjust budget if needed
12. Notify dashboard (purchase attribution shown)
```

**Purchase Attribution Query:**
```cypher
MATCH (purchase:Purchase {id: $purchase_id})
MATCH (customer:Customer {email: $customer_email})

OPTIONAL MATCH (customer)<-[:CONVERTED_TO]-(lead:Lead)
OPTIONAL MATCH (lead)-[:CAME_FROM]->(campaign:Campaign)
OPTIONAL MATCH (campaign)<-[:RAN_IN]-(content:Content)

// Create attribution if found
FOREACH (_ IN CASE WHEN campaign IS NOT NULL THEN [1] ELSE [] END |
  MERGE (purchase)-[:ATTRIBUTED_TO]->(campaign)
)

FOREACH (_ IN CASE WHEN content IS NOT NULL THEN [1] ELSE [] END |
  MERGE (purchase)-[:ATTRIBUTED_TO]->(content)
  SET content.total_revenue = content.total_revenue + $order_total
)

RETURN campaign.id AS campaign_id, 
       content.id AS content_id,
       CASE WHEN campaign IS NOT NULL THEN true ELSE false END AS attributed
```

---

## Error Handling Patterns

### Pattern 1: Retry with Exponential Backoff

```javascript
async function executeWithRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error; // Final attempt failed
      }
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await sleep(delay);
    }
  }
}

// Usage in n8n Code node
return await executeWithRetry(async () => {
  return await $http.post('https://api.anthropic.com/v1/messages', requestBody);
});
```

### Pattern 2: Graceful Degradation

```javascript
// If Pinecone is down, fall back to Neo4j-only query
let similarContent;

try {
  similarContent = await queryPinecone(contentId);
} catch (error) {
  console.log('Pinecone unavailable, using Neo4j fallback');
  similarContent = await neo4jQuery(`
    MATCH (c1:Content {id: $contentId})-[:HAS_TONE]->(t)<-[:HAS_TONE]-(c2)
    WHERE c2.id <> $contentId
    RETURN c2.id, count(*) AS similarity_score
    ORDER BY similarity_score DESC
    LIMIT 10
  `);
}
```

### Pattern 3: Dead Letter Queue

```javascript
// If workflow node fails repeatedly, send to DLQ
if ($runIndex > 3) { // Failed 3+ times
  await sendToDeadLetterQueue({
    workflow: $workflow.name,
    node: $node.name,
    data: $input.all(),
    error: $error,
    timestamp: new Date()
  });
  
  // Alert admin
  await sendEmail({
    to: 'admin@company.com',
    subject: `Workflow ${$workflow.name} Failed`,
    body: `Node ${$node.name} failed after 3 retries.`
  });
  
  throw new Error('Max retries exceeded, sent to DLQ');
}
```

---

## Workflow Variables & Configuration

### Global Parameters (Set at Workflow Level)

```json
{
  "brand_id": "zen-med-clinic",
  "brand_name": "Zen Med Clinic",
  "industry": "chinese-medicine",
  "business_model": "brick-and-mortar-primary",
  "timezone": "America/Los_Angeles",
  
  "google_drive_folder_id": "abc123xyz",
  "dashboard_api_url": "https://dashboard.zenmedclinic.com",
  
  "pinecone_index_name": "marketing-automation",
  "neo4j_database": "marketing-automation",
  
  "avg_customer_value": 500,
  
  "brand_config": {
    "demographics": {
      "primary": {
        "name": "wellness-focused-women-35-50",
        "age_range": [35, 50]
      }
    },
    "platforms": ["instagram", "facebook", "google-search"],
    "budget": {
      "monthly_total": 5000,
      "test_allocation": 0.15
    }
  }
}
```

### Credentials (Stored Securely in n8n)

- Google Ads API
- Meta Marketing API
- Claude API Key
- OpenAI API Key
- Pinecone API Key
- Neo4j Credentials
- Google Drive OAuth2
- Shopify API Key (if e-commerce)
- Email Service (SendGrid/Mailgun)

---

## Testing Strategy

### Unit Testing Individual Nodes

```javascript
// Test content analysis node
const testFile = loadTestFile('sample-video.mp4');
const analysis = await claudeVisionAPI(testFile);

assert(analysis.emotional_tones.length > 0);
assert(analysis.semantic_description.length > 100);
assert(analysis.duration_seconds > 0);
```

### Integration Testing Workflows

```javascript
// Test entire content ingestion flow
const result = await triggerWorkflow('content-ingestion', {
  testMode: true,
  mockFile: 'test-video.mp4'
});

// Verify Pinecone insertion
const pineconeResult = await pinecone.fetch({
  ids: [`content_test-001_test-brand`],
  namespace: 'content-essence-test-brand'
});
assert(pineconeResult.vectors.length === 1);

// Verify Neo4j insertion
const neo4jResult = await neo4j.run(`
  MATCH (c:Content {id: 'test-001'})
  RETURN c
`);
assert(neo4jResult.records.length === 1);
```

### Load Testing

- Simulate 100 concurrent content uploads
- Verify workflows don't block each other
- Monitor Claude API rate limits
- Test database connection pooling

---

## Deployment Checklist

**First Spawn:**
- [ ] n8n instance deployed (self-hosted or n8n Cloud)
- [ ] All credentials configured
- [ ] Brand-specific workflow variables set
- [ ] Test workflow execution (manual trigger)
- [ ] Verify Pinecone namespace created
- [ ] Verify Neo4j nodes created
- [ ] Test end-to-end: Upload file → Check Pinecone + Neo4j
- [ ] Enable cron triggers

**Subsequent Spawns:**
- [ ] Copy workflow JSON files
- [ ] Find/replace {BRAND_ID}, {BRAND_NAME}, etc.
- [ ] Import to n8n
- [ ] Configure credentials (same as first client)
- [ ] Set workflow variables
- [ ] Test execution
- [ ] Enable cron triggers

---

## Cost Estimation

**Per Client per Month:**

| Service | Usage | Cost |
|---------|-------|------|
| Claude API (Content Analysis) | ~50 uploads × $0.03 | $1.50 |
| Claude API (Daily CSO) | 30 days × $0.08 | $2.40 |
| Claude API (Weekly Strategy) | 4 weeks × $0.20 | $0.80 |
| Claude API (Creative Intelligence) | 30 days × $0.05 | $1.50 |
| OpenAI Embeddings | ~50 embeddings × $0.000006 | $0.00 |
| **Total** | | **~$6.20/month** |

**n8n Hosting:**
- Self-hosted: $0 (VPS cost separate)
- n8n Cloud: $20/month (covers all clients)

**Total Infrastructure Cost:** ~$26/month (for 20 clients on single n8n instance)

---

## Monitoring & Observability

### Workflow Execution Logs

```javascript
// In each critical node, log to external service
await logToDatadog({
  workflow: $workflow.name,
  node: $node.name,
  execution_id: $execution.id,
  status: 'success',
  duration_ms: $executionTime,
  metadata: {
    brand_id: $parameter.brand_id,
    // ... relevant data
  }
});
```

### Alert Conditions

- Workflow execution time >30 minutes → Alert
- Workflow failure rate >5% → Alert
- Claude API errors >10/hour → Alert
- Database connection failures → Immediate alert
- Cost spike (>2x normal) → Alert

### Health Check Endpoint

```javascript
// Create n8n webhook workflow for health checks
// GET /webhook/health-check/{brand_id}

const recentExecutions = await getWorkflowExecutions({
  brand_id: $parameter.brand_id,
  since: Date.now() - 3600000 // Last hour
});

const failureRate = recentExecutions.filter(e => e.status === 'error').length / recentExecutions.length;

return {
  status: failureRate < 0.05 ? 'healthy' : 'degraded',
  failure_rate: failureRate,
  last_execution: recentExecutions[0].timestamp,
  workflows: {
    content_ingestion: 'healthy',
    daily_performance: 'healthy',
    // ... status of each workflow
  }
};
```