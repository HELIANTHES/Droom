# Content Profiling Framework

## Overview

Content profiling is the **one-time analysis** of uploaded creative assets (videos, images) to extract semantic, visual, and performance-predictive attributes. This profile becomes the canonical representation of the content, stored in Pinecone and Neo4j, and is **never re-analyzed**.

**Key Principle:** Analyze once, query forever. The profile must be rich enough to support all future decision-making without needing to re-process the original media file.

---

## Why Content Profiling Matters

### Problem Without Profiling
- **Expensive:** Re-analyzing content with Claude Vision API for every decision ($0.03/analysis × 100 decisions = $3.00)
- **Slow:** Each analysis takes 5-10 seconds
- **Inconsistent:** Same content might be interpreted differently each time
- **Not scalable:** Can't compare 50 pieces of content without 50 API calls

### Solution With Profiling
- **Cost-efficient:** Analyze once ($0.03), query unlimited times ($0.00)
- **Fast:** Vector similarity search returns in <50ms
- **Consistent:** Same profile every time
- **Scalable:** Compare all content instantly via vector search

---

## Content Profile Structure

A complete content profile consists of:

### 1. Emotional Tones (with confidence)
**What:** The feelings/emotions the content evokes

**Examples:**
- calm (0.95)
- professional (0.82)
- reassuring (0.78)
- energetic (0.12) ← Low confidence, not a primary tone

**Taxonomy:**
- calm
- professional
- reassuring
- energetic
- playful
- aspirational
- educational
- urgent
- intimate
- luxurious
- warm
- serious
- joyful
- empowering
- mysterious

**Why it matters:** Different demographics respond to different tones. Wellness-focused women 35-50 respond strongly to "calm" and "reassuring", while younger professionals might prefer "energetic" and "aspirational".

---

### 2. Visual Aesthetics (with confidence)
**What:** The overall visual style and look

**Examples:**
- minimal (0.92)
- intimate (0.85)
- modern (0.73)
- rustic (0.15) ← Not prominent

**Taxonomy:**
- minimal
- intimate
- modern
- luxurious
- rustic
- vibrant
- clean
- warm
- bold
- elegant
- industrial
- organic
- geometric
- textured
- airy
- dramatic

**Why it matters:** Instagram favors certain aesthetics over others. "Minimal" and "clean" aesthetics tend to perform better on Instagram, while "dramatic" and "bold" may work better on TikTok.

---

### 3. Color Palette
**What:** Primary and accent colors, overall temperature and saturation

**Structure:**
```json
{
  "primary": ["warm-tones", "earth-tones", "beige"],
  "accent": ["soft-brown", "cream"],
  "temperature": "warm",        // warm | cool | neutral
  "saturation": "low",           // high | medium | low
  "brightness": "medium"         // bright | medium | dark
}
```

**Color Taxonomy:**
- warm-tones
- cool-tones
- earth-tones
- vibrant
- pastel
- monochrome
- jewel-tones
- muted
- neon
- natural

**Why it matters:** Color psychology affects emotional response. Warm earth tones = calm/grounded. Vibrant colors = energetic/exciting. Color consistency across a campaign builds brand recognition.

---

### 4. Composition & Technical Elements
**What:** How the content is shot/framed/structured

**Structure:**
```json
{
  "camera_movement": "steady",       // steady | handheld | dynamic | static
  "shot_types": ["close-up", "medium-shot"],
  "focus_style": "environment-focused",  // environment | people | product
  "framing": "intimate",             // intimate | spacious | centered | rule-of-thirds
  "depth_of_field": "shallow",       // shallow | deep | medium
  "lighting": "soft-natural"         // soft-natural | harsh | dramatic | backlit
}
```

**Why it matters:** Technical execution affects perceived quality and trust. "Steady + professional lighting" = high quality. "Handheld + natural lighting" = authentic/raw.

---

### 5. Narrative Elements (boolean flags)
**What:** What the content shows or includes

**Structure:**
```json
{
  "shows_physical_space": true,
  "shows_people": false,
  "shows_product_service": true,
  "demonstrates_use": true,
  "has_dialogue": false,
  "has_text_overlay": false,
  "has_voiceover": false,
  "local_landmark_visible": "stanford-campus",  // or false
  "testimonial": false,
  "before_after": false,
  "tutorial": false
}
```

**Why it matters:** 
- "shows_physical_space + local_landmark_visible" = 22% higher performance for local businesses
- "testimonial" = high trust signal
- "tutorial" = high engagement, lower conversion (awareness not conversion content)

---

### 6. Pacing & Energy
**What:** The rhythm and tempo of the content

**Values:** slow | moderate | fast

**Indicators:**
- Slow: Long static shots, minimal cuts, calm music/silence
- Moderate: Balanced pacing, some variation
- Fast: Quick cuts, dynamic movement, upbeat music

**Why it matters:** Pacing should match audience state. "Weekday evening" audience wants "slow" content (stress relief). "Morning commute" audience wants "fast" content (quick info).

---

### 7. Audio Elements (video only)
**What:** Sound design and audio characteristics

**Structure:**
```json
{
  "type": "ambient-only",       // voiceover | music | ambient-only | silent
  "music_genre": null,          // "calm-instrumental" | "upbeat-pop" | etc.
  "voiceover_tone": null,       // "professional" | "conversational" | "enthusiastic"
  "sound_effects": "subtle"     // prominent | subtle | none
}
```

**Why it matters:** Audio significantly affects emotional impact. "Ambient-only" = meditative. "Upbeat music" = energetic. "Professional voiceover" = authoritative.

---

### 8. Production Quality
**What:** Overall technical execution quality

**Values:** amateur | semi-professional | professional-high

**Indicators:**
- Amateur: Phone camera, natural light only, shaky footage, poor audio
- Semi-professional: Decent camera, some lighting, stable footage, clear audio
- Professional-high: Cinema camera, professional lighting, pristine footage, mastered audio

**Why it matters:** Quality affects trust and perceived brand value. Luxury brands need "professional-high". Authentic/personal brands can use "semi-professional" or even "amateur" (authenticity signal).

---

### 9. Technical Metadata
**What:** File properties and specs

**Structure:**
```json
{
  "duration_seconds": 30,
  "resolution": "1080x1920",
  "format": "vertical-video",    // vertical | horizontal | square
  "aspect_ratio": "9:16",
  "file_size_mb": 12.4,
  "codec": "h264",
  "frame_rate": 30
}
```

**Why it matters:** Platform optimization. Instagram prefers 9:16 vertical. YouTube prefers 16:9 horizontal. TikTok requires vertical.

---

### 10. Semantic Description (for embedding)
**What:** A rich, 150-200 word narrative description capturing the essence

**Purpose:** This is what gets embedded into a vector for semantic similarity search.

**Good Example:**
```
A 30-second vertical video showcasing a peaceful acupuncture treatment session. 
Visual aesthetic is minimal and intimate with warm, soft lighting creating a calm 
atmosphere. Color palette features earth tones, beiges, and warm browns. Camera 
work is steady and close, focusing on the serene treatment environment. The space 
is modern yet inviting with clean lines. Through the window, the Stanford campus 
is visible, establishing local context. No dialogue, just ambient peaceful sounds. 
Pacing is slow and meditative. Shows the physical clinic interior, establishing 
place. Production quality is professional with high resolution. The emotional tone 
is calming, reassuring, and professional. This content communicates expertise, 
tranquility, and local presence. Suitable for awareness-building among local 
audiences who value wellness and stress relief. Works best during evening hours 
when audience seeks relaxation after work.
```

**Bad Example:**
```
Video of acupuncture treatment. Shows clinic. 30 seconds long.
```

**Why it matters:** The semantic description is the **most important** part of the profile. It's what enables Pinecone to find similar content, predict performance, and inform strategic decisions.

---

## Claude Vision API Prompt Template

### Full Prompt (for n8n Content Ingestion workflow)

```
You are analyzing content for marketing campaigns. Extract detailed profile attributes.

Analyze this {image/video} and provide a comprehensive marketing profile.

Extract:

1. **Emotional Tones** (with confidence 0-1): What emotions does this evoke?
   Options: calm, professional, reassuring, energetic, playful, aspirational, educational, urgent, intimate, luxurious, warm, serious, joyful, empowering, mysterious
   Provide 2-5 tones with confidence scores.

2. **Visual Aesthetics** (with confidence 0-1): What's the visual style?
   Options: minimal, intimate, modern, luxurious, rustic, vibrant, clean, warm, bold, elegant, industrial, organic, geometric, textured, airy, dramatic
   Provide 2-5 aesthetics with confidence scores.

3. **Color Palette**:
   - Primary colors (2-4): warm-tones, cool-tones, earth-tones, vibrant, pastel, monochrome, jewel-tones, muted, neon, natural
   - Accent colors (0-2)
   - Temperature: warm | cool | neutral
   - Saturation: high | medium | low
   - Brightness: bright | medium | dark

4. **Composition**:
   - Camera movement: steady | handheld | dynamic | static
   - Shot types (1-3): close-up, medium-shot, wide-shot, establishing, detail-shot
   - Focus style: environment-focused | people-focused | product-focused
   - Framing: intimate | spacious | centered | rule-of-thirds
   - Depth of field: shallow | deep | medium (if applicable)
   - Lighting: soft-natural | harsh | dramatic | backlit | professional

5. **Narrative Elements** (boolean true/false):
   - shows_physical_space
   - shows_people
   - shows_product_service
   - demonstrates_use
   - has_dialogue
   - has_text_overlay
   - has_voiceover
   - local_landmark_visible: (specify landmark name if true, else false)
   - testimonial
   - before_after
   - tutorial

6. **Pacing**: slow | moderate | fast
   Consider: shot duration, cuts per second, overall rhythm

7. **Production Quality**: amateur | semi-professional | professional-high
   Consider: camera quality, lighting, stability, audio quality (if video)

8. **Audio Elements** (video only):
   - Type: voiceover | music | ambient-only | silent
   - Music genre (if applicable): "calm-instrumental", "upbeat-pop", etc.
   - Voiceover tone (if applicable): professional | conversational | enthusiastic
   - Sound effects: prominent | subtle | none

9. **Duration**: Estimate in seconds (video) or N/A (image)

10. **Semantic Description**: Write a rich, detailed 150-200 word narrative description 
    that captures the essence of this content. Include:
    - What's shown (physical elements)
    - The emotional atmosphere
    - Visual style and aesthetic
    - Color palette and lighting
    - Any notable narrative elements
    - The overall message or feeling it communicates
    - What type of audience and campaign goal it would suit
    - When/where it would perform best
    
    This description will be used for semantic search, so be thorough and descriptive.

Return ONLY valid JSON in this exact structure:

```json
{
  "emotional_tones": [
    {"name": "calm", "confidence": 0.95},
    {"name": "professional", "confidence": 0.82}
  ],
  "visual_aesthetics": [
    {"name": "minimal", "confidence": 0.92},
    {"name": "intimate", "confidence": 0.85}
  ],
  "color_palette": {
    "primary": ["warm-tones", "earth-tones", "beige"],
    "accent": ["soft-brown", "cream"],
    "temperature": "warm",
    "saturation": "low",
    "brightness": "medium"
  },
  "composition": {
    "camera_movement": "steady",
    "shot_types": ["close-up", "medium-shot"],
    "focus_style": "environment-focused",
    "framing": "intimate",
    "depth_of_field": "shallow",
    "lighting": "soft-natural"
  },
  "narrative_elements": {
    "shows_physical_space": true,
    "shows_people": false,
    "shows_product_service": true,
    "demonstrates_use": true,
    "has_dialogue": false,
    "has_text_overlay": false,
    "has_voiceover": false,
    "local_landmark_visible": "stanford-campus",
    "testimonial": false,
    "before_after": false,
    "tutorial": false
  },
  "pacing": "slow",
  "production_quality": "professional-high",
  "audio_elements": {
    "type": "ambient-only",
    "music_genre": null,
    "voiceover_tone": null,
    "sound_effects": "subtle"
  },
  "duration_seconds": 30,
  "semantic_description": "A 30-second vertical video showcasing a peaceful acupuncture treatment session. Visual aesthetic is minimal and intimate with warm, soft lighting creating a calm atmosphere. Color palette features earth tones, beiges, and warm browns. Camera work is steady and close, focusing on the serene treatment environment. The space is modern yet inviting with clean lines. Through the window, the Stanford campus is visible, establishing local context. No dialogue, just ambient peaceful sounds. Pacing is slow and meditative. Shows the physical clinic interior, establishing place. Production quality is professional with high resolution. The emotional tone is calming, reassuring, and professional. This content communicates expertise, tranquility, and local presence. Suitable for awareness-building among local audiences who value wellness and stress relief. Works best during evening hours when audience seeks relaxation after work."
}
```

Do not include any preamble or markdown formatting. Return only the JSON object.
```

---

## Profile Validation Rules

After Claude returns the profile, validate before storing:

### 1. Required Fields Check
```javascript
const requiredFields = [
  'emotional_tones',
  'visual_aesthetics',
  'color_palette',
  'composition',
  'narrative_elements',
  'pacing',
  'production_quality',
  'semantic_description'
];

for (const field of requiredFields) {
  if (!profile[field]) {
    throw new Error(`Missing required field: ${field}`);
  }
}
```

### 2. Confidence Score Validation
```javascript
// All tones and aesthetics must have confidence between 0 and 1
for (const tone of profile.emotional_tones) {
  if (tone.confidence < 0 || tone.confidence > 1) {
    throw new Error(`Invalid confidence score for tone: ${tone.name}`);
  }
}

for (const aesthetic of profile.visual_aesthetics) {
  if (aesthetic.confidence < 0 || aesthetic.confidence > 1) {
    throw new Error(`Invalid confidence score for aesthetic: ${aesthetic.name}`);
  }
}
```

### 3. Semantic Description Length
```javascript
const wordCount = profile.semantic_description.split(/\s+/).length;

if (wordCount < 100) {
  console.warn(`Semantic description too short (${wordCount} words). Minimum 100 recommended.`);
}

if (wordCount > 300) {
  console.warn(`Semantic description too long (${wordCount} words). Maximum 300 recommended.`);
}
```

### 4. Taxonomy Validation
```javascript
const validTones = [
  'calm', 'professional', 'reassuring', 'energetic', 'playful', 
  'aspirational', 'educational', 'urgent', 'intimate', 'luxurious',
  'warm', 'serious', 'joyful', 'empowering', 'mysterious'
];

for (const tone of profile.emotional_tones) {
  if (!validTones.includes(tone.name)) {
    console.warn(`Unknown tone: ${tone.name}. Consider adding to taxonomy.`);
  }
}

// Similar validation for aesthetics, colors, etc.
```

---

## Profile Storage Strategy

### Pinecone Vector Storage

**What goes in the vector:**
- Embedding of semantic_description (1536 dimensions via OpenAI)

**What goes in metadata:**
- Everything else from the profile
- Plus: performance metrics (updated over time)
- Plus: content identifiers (id, brand_id, drive_url)

**Example:**
```json
{
  "id": "content_video-003_zen-med-clinic",
  "values": [0.234, -0.891, 0.445, ...],  // 1536 dimensions
  "metadata": {
    // Identity
    "content_id": "video-003",
    "brand_id": "zen-med-clinic",
    "drive_id": "abc123",
    "drive_url": "https://drive.google.com/...",
    "filename": "acupuncture-treatment-calm.mp4",
    
    // Profile attributes
    "emotional_tones": ["calm", "professional", "reassuring"],
    "tone_confidences": [0.95, 0.82, 0.78],
    "visual_aesthetics": ["minimal", "intimate", "modern"],
    "aesthetic_confidences": [0.92, 0.85, 0.73],
    "color_palette_primary": ["warm-tones", "earth-tones", "beige"],
    "color_palette_accent": ["soft-brown", "cream"],
    "color_temperature": "warm",
    "composition_camera_movement": "steady",
    "composition_shot_types": ["close-up", "medium-shot"],
    "shows_physical_space": true,
    "local_landmark_visible": "stanford-campus",
    "pacing": "slow",
    "production_quality": "professional-high",
    
    // Technical
    "duration_seconds": 30,
    "resolution": "1080x1920",
    "format": "vertical-video",
    
    // Performance (updated over time)
    "total_impressions": 0,
    "total_spend": 0.0,
    "avg_roas": 0.0,
    "avg_ctr": 0.0,
    "creative_fatigue_score": 0.0,
    "status": "active",
    
    // Timestamps
    "upload_date": "2026-01-15",
    "profile_date": "2026-01-15",
    "last_used_date": null
  }
}
```

---

### Neo4j Graph Storage

**What goes in Content node:**
- Basic identifiers
- Performance aggregates
- Status

**Example:**
```cypher
CREATE (c:Content:Video {
  id: "video-003",
  brand_id: "zen-med-clinic",
  drive_id: "abc123",
  drive_url: "https://drive.google.com/...",
  filename: "acupuncture-treatment-calm.mp4",
  duration_seconds: 30,
  resolution: "1080x1920",
  format: "vertical-video",
  status: "active",
  total_impressions: 0,
  total_spend: 0.0,
  avg_roas: 0.0,
  upload_date: date("2026-01-15"),
  created_at: datetime()
})
```

**What goes in relationships:**
- Profile attributes linked to shared nodes

**Example:**
```cypher
// Link to tone nodes
MATCH (c:Content {id: "video-003"})
MATCH (t:Tone {name: "calm"})
MERGE (c)-[:HAS_TONE {confidence: 0.95}]->(t)

// Link to aesthetic nodes
MATCH (c:Content {id: "video-003"})
MATCH (a:Aesthetic {name: "minimal"})
MERGE (c)-[:HAS_AESTHETIC {confidence: 0.92}]->(a)

// Similar for colors, composition, narrative elements
```

---

## Using Profiles for Decision-Making

### Use Case 1: Find Similar Fresh Content

**Scenario:** video-003 is showing fatigue. Find similar fresh content to rotate in.

**Query:**
```python
# Step 1: Get vector for video-003
fatigued_vector = pinecone_index.fetch(
    ids=["content_video-003_zen-med-clinic"],
    namespace="content-essence-zen-med-clinic"
).vectors["content_video-003_zen-med-clinic"].values

# Step 2: Find similar content that's fresh
similar_fresh = pinecone_index.query(
    namespace="content-essence-zen-med-clinic",
    vector=fatigued_vector,
    top_k=10,
    include_metadata=True,
    filter={
        "total_impressions": {"$lt": 5000},  # Fresh/unused
        "status": "active",
        "content_id": {"$ne": "video-003"}   # Not the same content
    }
)

# Returns: Content with similar tones/aesthetics but unused
```

---

### Use Case 2: Predict Performance for New Content

**Scenario:** Just uploaded video-025. Predict its ROAS.

**Query:**
```python
# Step 1: Get profile for new content
new_content = pinecone_index.fetch(
    ids=["content_video-025_zen-med-clinic"],
    namespace="content-essence-zen-med-clinic"
)

new_content_vector = new_content.vectors["content_video-025_zen-med-clinic"].values
new_content_meta = new_content.vectors["content_video-025_zen-med-clinic"].metadata

# Step 2: Find similar content that has performance history
similar_with_history = pinecone_index.query(
    namespace="content-essence-zen-med-clinic",
    vector=new_content_vector,
    top_k=20,
    include_metadata=True,
    filter={
        "total_impressions": {"$gte": 10000},  # Has significant history
        "avg_roas": {"$gt": 0}  # Has ROAS data
    }
)

# Step 3: Calculate predicted ROAS
predicted_roas = mean([
    match.metadata['avg_roas'] for match in similar_with_history.matches
])

confidence = len(similar_with_history.matches) / 20  # More matches = higher confidence

# Result: "Predicted ROAS: 3.8x (confidence: 0.85)"
```

---

### Use Case 3: Content Portfolio Balance

**Scenario:** Check if content portfolio is diverse or over-concentrated.

**Query:**
```python
# Get all active content
all_content = pinecone_index.query(
    namespace="content-essence-zen-med-clinic",
    vector=[0]*1536,  # Dummy vector
    top_k=100,
    include_metadata=True,
    filter={"status": "active"}
)

# Analyze tone distribution
tone_counts = {}
for content in all_content.matches:
    for tone in content.metadata['emotional_tones']:
        tone_counts[tone] = tone_counts.get(tone, 0) + 1

# Check for over-concentration
total_content = len(all_content.matches)
calm_percentage = tone_counts.get('calm', 0) / total_content

if calm_percentage > 0.7:
    print(f"⚠️ Portfolio over-concentrated in 'calm' tone ({calm_percentage:.0%})")
    print("Recommendation: Create content with 'energetic' or 'aspirational' tones")

# Analyze aesthetic diversity
aesthetic_counts = {}
for content in all_content.matches:
    for aesthetic in content.metadata['visual_aesthetics']:
        aesthetic_counts[aesthetic] = aesthetic_counts.get(aesthetic, 0) + 1

# Check for aesthetic gaps
if 'vibrant' not in aesthetic_counts:
    print("⚠️ No 'vibrant' aesthetic content in portfolio")
    print("Recommendation: Create colorful, high-energy content")
```

---

### Use Case 4: Demographic-Specific Content Recommendation

**Scenario:** CSO Agent needs to recommend content for "stressed-professionals-25-40" demographic.

**Query:**
```python
# Step 1: Get demographic preferences from Neo4j
demo_prefs = neo4j_query("""
    MATCH (d:Demographic {name: "stressed-professionals-25-40"})
    -[r:RESPONDS_TO]->(t:Tone)
    RETURN t.name, r.avg_roas
    ORDER BY r.avg_roas DESC
    LIMIT 3
""")

preferred_tones = [pref['t.name'] for pref in demo_prefs]
# Result: ["professional", "energetic", "aspirational"]

# Step 2: Find content with these tones
matching_content = pinecone_index.query(
    namespace="content-essence-zen-med-clinic",
    vector=[0]*1536,  # Not semantic search, just metadata filtering
    top_k=50,
    include_metadata=True,
    filter={
        "$and": [
            {"emotional_tones": {"$in": preferred_tones}},
            {"status": "active"},
            {"total_impressions": {"$lt": 20000}}  # Not overused
        ]
    }
)

# Step 3: Rank by how many preferred tones each content has
ranked = []
for content in matching_content.matches:
    tone_match_count = len(set(content.metadata['emotional_tones']) & set(preferred_tones))
    ranked.append({
        "content_id": content.metadata['content_id'],
        "filename": content.metadata['filename'],
        "tone_match_count": tone_match_count,
        "tones": content.metadata['emotional_tones']
    })

ranked.sort(key=lambda x: x['tone_match_count'], reverse=True)

# Return top 5 recommendations
recommendations = ranked[:5]
```

---

## Profile Update Strategy

### When to Update Profiles

**NEVER re-analyze the content itself.** The profile is canonical.

**DO update these fields over time:**
- Performance metrics (total_impressions, avg_roas, etc.)
- Status (active → resting → archived)
- Creative fatigue score
- Last used date

**Example Update (in n8n Daily Performance workflow):**
```javascript
// After calculating today's performance
await pinecone.update({
    id: `content_${contentId}_${brandId}`,
    setMetadata: {
        total_impressions: currentImpressions + todayImpressions,
        total_spend: currentSpend + todaySpend,
        avg_roas: recalculateRoas(allPerformance),
        creative_fatigue_score: calculateFatigue(performanceHistory),
        last_used_date: today
    },
    namespace: `content-essence-${brandId}`
});
```

---

## Quality Assurance

### Manual Review Process (Optional)

For critical campaigns, optionally review Claude's profile:

**Review Checklist:**
- [ ] Emotional tones make sense when viewing content
- [ ] Visual aesthetics accurately described
- [ ] Color palette matches what you see
- [ ] Narrative elements correct (does it show location? people?)
- [ ] Semantic description captures the essence
- [ ] No obvious misclassifications

**Correction Process:**
If profile is incorrect, manually edit metadata in Pinecone:
```python
pinecone_index.update(
    id="content_video-003_zen-med-clinic",
    setMetadata={
        "emotional_tones": ["calm", "professional"],  # Corrected
        "tone_confidences": [0.95, 0.85]
    },
    namespace="content-essence-zen-med-clinic"
)
```

---

## Profile Evolution

### Adding New Attributes (Future)

As the system learns, you may want to add new profile attributes:

**Example: Adding "seasonal_relevance"**

```python
# For all existing content, analyze and add new attribute
for content_id in all_content_ids:
    # Use Claude to analyze seasonality
    result = claude_api(f"Does this content have seasonal relevance? {content_metadata}")
    
    # Update Pinecone
    pinecone_index.update(
        id=content_id,
        setMetadata={
            "seasonal_relevance": result.seasonal_relevance,  # "winter", "summer", "all-year"
            "holiday_themed": result.holiday_themed  # True/False
        },
        namespace=namespace
    )
```

**Note:** This is a one-time backfill. New content will have this attribute from initial profiling (update the prompt).

---

## Common Pitfalls & How to Avoid

### Pitfall 1: Semantic Description Too Generic

**Bad:**
```
"Video showing acupuncture. Has calm music."
```

**Good:**
```
"A 30-second vertical video showcasing a peaceful acupuncture treatment session. 
Visual aesthetic is minimal and intimate with warm, soft lighting creating a calm 
atmosphere. Color palette features earth tones, beiges, and warm browns..."
```

**Fix:** In the prompt, emphasize "rich, detailed, 150-200 word narrative".

---

### Pitfall 2: Over-Reliance on Confidence Scores

**Problem:** Claude might assign high confidence (0.95) to marginal tones.

**Solution:** Use both confidence AND count. If content has 5 tones all at 0.90+, it's probably unfocused. Good content typically has 2-3 dominant tones.

---

### Pitfall 3: Not Validating Against Reality

**Problem:** Profile says "shows_people: false" but there are people in the video.

**Solution:** Implement automated validation where possible:
```python
# Use computer vision to validate boolean flags
if profile['shows_people'] == False:
    # Quick check with face detection API
    faces = detect_faces(image)
    if len(faces) > 0:
        logger.warning(f"Profile says no people, but {len(faces)} faces detected")
        profile['shows_people'] = True  # Auto-correct
```

---

### Pitfall 4: Ignoring Temporal Context

**Problem:** A "winter holiday" themed video performs poorly in July.

**Solution:** Add temporal context to profiles and query filters:
```python
# When selecting content in July
relevant_content = pinecone_index.query(
    namespace=namespace,
    vector=query_vector,
    filter={
        "$or": [
            {"seasonal_relevance": "summer"},
            {"seasonal_relevance": "all-year"}
        ]
    }
)
```

---

## Summary: The Profile Lifecycle

```
1. UPLOAD
   User uploads video → Google Drive
   │
2. ANALYZE (ONE TIME)
   n8n workflow → Claude Vision API
   Generate comprehensive profile
   │
3. STORE
   Pinecone: Vector + metadata
   Neo4j: Content node + relationships
   │
4. USE
   Query for decisions:
   - Find similar content
   - Predict performance
   - Match to demographics
   - Balance portfolio
   │
5. UPDATE (PERFORMANCE ONLY)
   After campaigns run:
   - Update impressions, spend, ROAS
   - Calculate fatigue score
   - Update last_used_date
   │
6. NEVER RE-ANALYZE
   Profile is canonical
   Query forever at no additional cost