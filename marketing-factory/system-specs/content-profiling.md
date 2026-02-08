# Content Profiling

<purpose>
Content profiling is the one-time analysis of uploaded creative assets (videos, images) via Claude Vision API. The resulting profile becomes the canonical representation of that content — stored in both Pinecone (as a semantic vector) and Neo4j (as structured nodes and relationships). The original media is never re-analyzed.

**Core principle:** Analyze once ($0.03), query forever ($0.00). The profile must be rich enough to support all future decision-making — content matching, fatigue detection, demographic targeting, portfolio balancing — without ever re-processing the source file.
</purpose>

---

<design_principles>
## Design Principles

- **Richness over precision** — A detailed, evocative semantic description is more valuable than precise numeric scores. The description becomes the embedding that powers all semantic search.
- **Confidence-weighted attributes** — Every tone and aesthetic classification includes a confidence score (0-1). Low-confidence attributes are preserved but weighted less in decisions.
- **Extensible taxonomy** — The attribute categories (tones, aesthetics, etc.) are starting points, not exhaustive lists. Claude Vision may identify attributes outside the taxonomy — preserve them rather than discard.
- **Dual storage** — Profile data splits across databases by purpose: structured attributes → Neo4j (for exact queries and relationship building), semantic description → Pinecone (for similarity search).
- **Performance metadata grows** — The initial profile is static (what the content IS), but performance metadata accumulates over time (how the content PERFORMS). Both live alongside each other.
</design_principles>

---

<patterns>
## Profile Structure

A complete content profile extracts these attribute categories from Claude Vision analysis:

**1. Emotional Tones** (with confidence 0-1)
What feelings the content evokes. Taxonomy includes: calm, professional, reassuring, energetic, playful, aspirational, educational, urgent, intimate, luxurious, warm, serious, joyful, empowering, mysterious. Multiple tones per content, each with confidence score.

**2. Visual Aesthetics** (with confidence 0-1)
The visual style. Taxonomy includes: minimal, luxurious, intimate, modern, rustic, vibrant, clean, warm, industrial, natural, clinical, editorial. Multiple aesthetics per content.

**3. Color Palette**
- Primary colors (warm-tones, cool-tones, earth-tones, vibrant, pastel, monochrome)
- Accent colors
- Temperature (warm/cool/neutral)
- Saturation (high/medium/low)
- Brightness (bright/medium/dark)

**4. Composition & Technical**
- Camera movement: steady, handheld, dynamic, static
- Shot types: close-up, medium-shot, wide-shot, establishing
- Focus style: environment-focused, people-focused, product-focused
- Framing: intimate, spacious, centered, rule-of-thirds

**5. Narrative Elements** (boolean flags)
What appears in the content: shows_physical_space, shows_people, shows_product_service, demonstrates_use, has_dialogue, has_text_overlay, local_landmark_visible (with landmark name if yes)

**6. Pacing & Energy** (video only)
Pacing: slow, moderate, fast. Energy level: low, medium, high.

**7. Audio Elements** (video only)
Type: voiceover, music, ambient-only, silent. Music genre, voiceover tone, sound effects level.

**8. Production Quality**
amateur, semi-professional, professional-high

**9. Semantic Description** (most important)
A 150-200 word rich narrative description capturing the essence of the content: what's shown, emotional atmosphere, visual style, color palette, lighting, notable elements, overall message, what type of audience and campaign goal it suits. This description becomes the Pinecone embedding.

## Storage Split

**Pinecone** (droom-content-essence-{brand_id} namespace):
- Vector: embedding of semantic description (text-embedding-3-small, 1536 dimensions)
- Metadata: all profile attributes (flattened), plus performance metrics that accumulate over time (total_impressions, total_spend, avg_roas, creative_fatigue_score, status)

**Neo4j:**
- Content node (`:Droom:Content:Video` or `:Droom:Content:Image`): id, brand_id, s3_key, s3_url, filename, upload/profile dates, status, aggregate performance metrics
- Relationships to shared attribute nodes: `(:Droom:Content)-[:HAS_TONE {confidence}]->(:Droom:Tone)`, `(:Droom:Content)-[:HAS_AESTHETIC {confidence}]->(:Droom:Aesthetic)`, etc.

## How Profiles Drive Decisions

- **Content matching:** "Find fresh content similar to this fatigued piece" → Pinecone similarity search on content-essence vectors, filtered by status=active and low impressions
- **Demographic targeting:** "What tones does this demographic respond to?" → Neo4j traversal of learning relationships, then Pinecone search for content matching those tones
- **Portfolio balance:** "Do we have enough calm content vs. energetic?" → Neo4j count by tone relationship, identify gaps
- **Performance prediction:** "How will this new content perform?" → Pinecone search for similar past content, get their Neo4j performance records
</patterns>

---

<constraints>
## Constraints

- Semantic description must be 150-200 words — shorter loses nuance, longer wastes embedding tokens
- Confidence scores must be between 0 and 1
- At least 2 emotional tones and 2 visual aesthetics must be identified per content
- Profile must be generated and stored before content can be used in any campaign
- Embedding model must match across all content: text-embedding-3-small (1536 dimensions)
- Profile attributes are immutable after creation (what the content IS doesn't change). Only performance metadata updates over time.
</constraints>

---

<quality_criteria>
## Quality Criteria

- Semantic descriptions must be specific to the actual content, never generic ("a marketing video" is insufficient)
- Descriptions must mention visual details that would differentiate this content from similar content
- Confidence scores should reflect genuine analysis, not default to 1.0 for all attributes
- Profile must successfully parse as valid JSON before storage
- Both Pinecone vector and Neo4j nodes must be created from the same analysis — never just one
- Content with failed profiling must be flagged for retry, not silently dropped
</quality_criteria>
