# n8n Workflow System

<purpose>
n8n is the autonomous runtime engine. After initial build, it runs the client's marketing system without human intervention — analyzing performance, optimizing budgets, rotating creative, scoring leads, and learning from outcomes. It connects Claude API (intelligence), Neo4j + Pinecone (memory), ad platforms (execution), AWS S3 (content intake), and the dashboard (visualization).

The n8n-architect agent builds 7-9 workflow JSON files per client. The marketing-agent-prompt-engineer creates 6 runtime agent prompts that these workflows invoke via Claude API.
</purpose>

---

<design_principles>
## Design Principles

- **One-time profiling, infinite querying** — Content is analyzed once at upload via Claude Vision. The resulting semantic profile lives in Neo4j (structured) and Pinecone (vector). All future decisions query stored profiles, never re-analyze media.
- **Dual-database decision context** — Every decision workflow queries Neo4j for structured facts (metrics, relationships, history) AND Pinecone for semantic similarity (past scenarios, content matching). Neither alone is sufficient.
- **Gradual execution** — Budget shifts, creative rotations, and campaign changes happen incrementally (max 30% shift/day). No sudden wholesale changes.
- **Test allocation preservation** — 10-20% of budget is always reserved for discovery/exploration, never fully optimized away.
- **Temporal orchestration** — Workflows run in deliberate sequence: creative rotation (1 AM) → performance analysis (2 AM) → budget optimization (3 AM) → learn & remember (4 AM). Each depends on the previous.
- **Graceful degradation** — If Pinecone is unavailable, fall back to Neo4j graph traversal for similarity. If an ad platform API fails, retry with exponential backoff, then log to dead letter queue.
- **Platform-minimum guardrails** — Minimum $50/day per active platform. Respect platform-specific constraints on budget changes and creative specs.
</design_principles>

---

<patterns>
## Workflow Suite

### Core Workflows (Always Built)

**1. Content Ingestion** — `content-ingestion.json`
- Trigger: S3 event notification — file added to `s3://droom/clients/{brand_id}/content/`
- Flow: Download file from S3 → Claude Vision analysis (emotional tones, visual aesthetics, color palette, composition, narrative elements, semantic description) → Generate content ID → Create embedding from semantic description → Store vector in Pinecone `droom-content-essence-{brand_id}` namespace → Create `:Droom:Content` node + attribute relationships in Neo4j → Notify dashboard
- Cost: ~$0.03/file (Claude Vision + embedding)
- Duration: 2-3 minutes per file

**2. Daily Performance Analysis** — `daily-performance.json`
- Trigger: Cron, 2 AM daily
- Flow: Set date variables → Fetch Google Ads performance → Fetch Meta Ads performance → Merge + calculate derived metrics (ROAS, conversion rate, cost per conversion) → Store Performance nodes in Neo4j, link to Campaigns → Recalculate content aggregate metrics → Query similar past scenarios from Pinecone → CSO Agent analyzes and decides → Execute tactical decisions (budget adjustments, campaign pauses, creative rotation triggers, alerts) → Update dashboard
- Cost: ~$0.08/day (CSO Agent)
- Duration: 10-15 minutes

**3. Weekly Strategy Review** — `weekly-strategy.json`
- Trigger: Cron, Monday 3 AM
- Flow: Compile week's performance from Neo4j → Query similar weekly scenarios from Pinecone → Invoke 4 agents sequentially (CSO strategic analysis → Creative Intelligence portfolio review → Cultural Anthropologist demographic insights → Data Scientist statistical patterns) → Synthesize insights → Client Translator generates client-facing report → Store learnings in Pinecone → Email report → Update dashboard
- Difference from daily: more agents, longer lookback, strategic not tactical
- Cost: ~$0.20/week
- Duration: 20-30 minutes

**4. Creative Rotation & Fatigue Detection** — `creative-rotation.json`
- Trigger: Cron, 1 AM daily (runs before performance analysis)
- Flow: Query active content performance trends from Neo4j → Calculate fatigue scores (CTR decline >30% over 7-14 day window, minimum 7 data points) → Creative Intelligence Agent analyzes fatigued content → Query Pinecone for similar fresh/unused content → Filter candidates by Neo4j performance history → Select replacements → Media Buyer Agent executes gradual rotation (ramp down fatigued, ramp up fresh) → Log rotation events → Mark fatigued content as "resting" → Notify dashboard
- Duration: 5-10 minutes

**5. Budget Optimization** — `budget-optimization.json`
- Trigger: Cron, 3 AM daily (runs after performance analysis)
- Flow: Query current allocation from Neo4j + ad platforms → Calculate ROAS by dimension (platform, demographic, geographic area, time slot, content) → Data Scientist Agent runs mathematical optimization → Query Pinecone for similar past budget shift outcomes → CSO Agent makes strategic decision → Media Buyer Agent executes shifts gradually → Log changes in Neo4j → Update dashboard
- Constraints: min $50/day per platform, max 30% shift per day, maintain 15% test allocation
- Duration: 5-8 minutes

**6. Learn & Remember** — `learn-and-remember.json`
- Trigger: Cron, 4 AM daily (runs after all analysis)
- Flow: Query all campaigns that ran yesterday from Neo4j → For each: get content semantic profile from Pinecone + campaign parameters + performance outcome → Generate rich scenario description → Create embedding → Store in Pinecone `scenario-outcomes-{brand_id}` namespace → Identify "surprise outcomes" (actual deviated from predicted) → Cultural Anthropologist Agent explains surprises → Store meta-learnings in `cross-campaign-learnings` namespace → Update Neo4j relationship weights (e.g., `(Demographic)-[:RESPONDS_TO {avg_roas, sample_size}]->(Tone)`) → Log summary to dashboard
- Duration: 10-15 minutes

**7. Form Ingestion + Lead Scoring** — `form-ingestion.json`
- Trigger: Webhook from website backend
- Flow: Validate form data → Create Lead + WebsiteForm nodes in Neo4j → Link to source Campaign if UTM present → Claude API scores lead 0-100 (based on service interest specificity, message quality, urgency signals, contact completeness, source quality) → Route by tier: hot (>90) gets immediate SMS + email to owner, warm (70-89) gets standard email sequence, cold (50-69) gets newsletter + retargeting → Add to retargeting audiences → Send confirmation email → Notify dashboard
- Duration: ~30 seconds

### Conditional Workflow

**8. Shopify Integration** — `shopify-integration.json` (e-commerce only)
- Trigger: Webhook from Shopify (order created)
- Flow: Validate webhook signature → Extract customer/order data → Match customer email to Lead node in Neo4j → Create Purchase node → Trace attribution chain: `(Purchase)-[:ATTRIBUTED_TO]->(Campaign)` and `(Purchase)-[:ATTRIBUTED_TO]->(Content)` → Update content revenue metrics → Recalculate true ROAS (purchase-based, not just leads) → Update Pinecone content metadata → CSO Agent analyzes impact → Notify dashboard
- Duration: ~30 seconds
</patterns>

---

<interfaces>
## Integration Points

**Inputs consumed by workflows:**
- AWS S3: content files (video/image uploads from `s3://droom/clients/{brand_id}/content/`)
- Google Ads API: campaign performance data (impressions, clicks, conversions, spend, revenue)
- Meta Marketing API: campaign performance data (same metrics)
- Shopify Webhooks: order data (e-commerce only)
- Website Webhooks: form submission data

**Outputs produced by workflows:**
- Neo4j: Content nodes, Performance nodes, Lead nodes, Purchase nodes, relationship weights, aggregate metrics
- Pinecone: content-essence vectors, scenario-outcome vectors, cross-campaign learnings
- Ad Platforms: budget adjustments, campaign pauses, creative rotations
- Dashboard API: webhooks for content uploads, performance updates, lead alerts, purchase attributions
- Email/SMS: client reports (weekly), lead notifications (real-time), confirmation emails

**Runtime agent prompts** (created by prompt-engineer, invoked by workflows):
- Chief Strategy Officer — strategic budget and campaign decisions
- Creative Intelligence — content rotation and creative gap analysis
- Media Buyer — tactical ad platform execution
- Data Scientist — statistical analysis and predictions
- Cultural Anthropologist — audience behavior explanations
- Client Translator — converts technical insights to client-friendly narratives
</interfaces>

---

<constraints>
## Constraints & Guardrails

- All queries must filter by `brand_id` — workflows serve multiple clients on shared infrastructure
- Budget shift maximum: 30% of total daily budget per optimization cycle
- Platform minimum: $50/day per active platform
- Test allocation: 15% of budget reserved for discovery, never optimized away
- Creative fatigue threshold: CTR decline >30% over 7-14 day window, minimum 7 data points required
- Lead scoring: 0-100 scale, three tiers (hot >90, warm 70-89, cold 50-69)
- Retry policy: exponential backoff (1s, 2s, 4s), max 3 attempts, then dead letter queue
- Workflow execution timeout: 30 minutes max, alert if exceeded
- Alert on: failure rate >5%, API errors >10/hour, database connection failures, cost spike >2x normal
</constraints>

---

<quality_criteria>
## Quality Criteria for Built Workflows

- Each workflow JSON must be importable to n8n without modification (valid n8n workflow format)
- All credentials referenced must match n8n credential names documented in setup
- Workflow variables must be parameterized (brand_id, brand_name, etc.), not hardcoded
- Error handler nodes on every workflow with logging + notification
- Cron schedules must respect the temporal orchestration sequence
- Each workflow must include a manual trigger option for testing
- Content ingestion must handle both video and image file types
- Performance data must calculate and store derived metrics (ROAS, conversion rate, cost per conversion)
- Lead routing must work for both service businesses (form submissions) and e-commerce (purchase attribution)
</quality_criteria>

---

<reference_examples>
## Cost Estimates

**Per client per month (estimated):**
| Category | Calculation | Cost |
|----------|-------------|------|
| Content analysis | ~50 uploads x $0.03 | $1.50 |
| Daily CSO decisions | 30 days x $0.08 | $2.40 |
| Weekly strategy review | 4 weeks x $0.20 | $0.80 |
| Creative intelligence | 30 days x $0.05 | $1.50 |
| Embeddings | ~50/day x $0.000006 | ~$0.01 |
| **Total API costs** | | **~$6.20/month** |

**n8n hosting:** Self-hosted ($0 beyond VPS) or n8n Cloud (~$20/month for all clients)

**Credentials required:** Google Ads API, Meta Marketing API, Claude API, OpenAI API, Pinecone API, Neo4j credentials, AWS S3 credentials, SendGrid/Mailgun, Shopify API (if e-commerce)
</reference_examples>
