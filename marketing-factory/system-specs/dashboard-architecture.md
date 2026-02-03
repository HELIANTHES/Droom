# Dashboard Architecture Specification

## Overview

The dashboard is a full-stack application providing real-time visibility into campaign performance, content analytics, and AI-generated insights. It employs progressive disclosure: executive summary at Level 1, category breakdowns at Level 2, and granular media buyer metrics at Level 3.

**Stack:**
- **Frontend:** Next.js 14+ (TypeScript, App Router)
- **Backend:** FastAPI (Python)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Data Sources:** n8n workflows, Neo4j, Pinecone
- **Deployment:** Vercel (frontend), Railway/Render (backend)

---

## Design Philosophy

### Progressive Disclosure (3 Levels)

**Level 1: Executive View** (Landing Page)
- **Audience:** Business owner (non-technical)
- **Content:** KPIs, AI narrative, top insights
- **Time spent:** 30 seconds to grasp overall health
- **Formatting:** Minimal, scannable, visual

**Level 2: Category Views** (One click deep)
- **Audience:** Marketing manager or curious owner
- **Content:** Platform comparison, content performance, audience breakdown
- **Time spent:** 2-5 minutes exploring categories
- **Formatting:** Charts, tables, cards

**Level 3: Detailed Metrics** (Two clicks deep)
- **Audience:** Technical user, agency partner, or data-driven owner
- **Content:** Every media buyer metric (CPC, CPM, frequency, reach, quality score)
- **Time spent:** 10+ minutes deep analysis
- **Formatting:** Dense tables, multi-axis charts, exportable data

### Key Principles

1. **AI-Generated Narratives First:** Data should tell a story, not just show numbers
2. **Context Always:** Show comparison (vs. last week, vs. target, vs. industry)
3. **Actionable Insights:** Every insight includes "what this means" and "what to do"
4. **Mobile-Responsive:** Primary device may be mobile (business owners check on-the-go)
5. **Fast Load Times:** Data should appear within 1 second
6. **Real-Time Updates:** Polling or websockets for live data
7. **No AI Jargon:** Never mention "Claude," "vector DB," "embeddings" - just "insights"

---

## Information Architecture

### Page Structure

```
/                           # Level 1: Executive Dashboard
/campaigns                  # Level 2: Campaign management
/content                    # Level 2: Content library
/audiences                  # Level 2: Audience insights
/geography                  # Level 2: Geographic performance
/insights                   # Level 2: AI-generated opportunities
/detailed-metrics           # Level 3: Granular data

/settings                   # Configuration
/upload                     # Content upload interface
```

---

## Level 1: Executive Dashboard (`/`)

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  Zen Med Clinic Dashboard          [Upload] [Settings]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  AI Narrative Summary                                   ││
│  │                                                          ││
│  │  "Strong week with 18% ROAS improvement. Your calm,    ││
│  │   peaceful treatment room content is resonating         ││
│  │   powerfully with professional women 35-50 during       ││
│  │   evening hours..."                                     ││
│  │                                     [View Full Report] ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  $2,100  │  │   3.8x   │  │    67    │  │  $7,980  │   │
│  │  Spend   │  │   ROAS   │  │Conversions│  │ Revenue  │   │
│  │  ────────│  │  ────────│  │  ────────│  │  ────────│   │
│  │ on budget│  │  ↑ 18%  │  │  ↑ 24%  │  │  ↑ 31%  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  7-Day Performance Trend                 [View Details] ││
│  │  ┌─────────────────────────────────────────────────┐  ││
│  │  │     [Sparkline chart showing ROAS over 7 days]   │  ││
│  │  └─────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Top Insights & Opportunities                           ││
│  │                                                          ││
│  │  🎯 Evening engagement 2.8x higher than daytime        ││
│  │     → Shifted 60% of budget to 6-9pm window            ││
│  │                                                          ││
│  │  🔥 Content showing your clinic location performs      ││
│  │     22% better than product-only content               ││
│  │     → Request more location-based videos               ││
│  │                                                          ││
│  │  📈 Instagram outpacing Facebook (4.2 vs 2.1 ROAS)    ││
│  │     → Reallocated $150/day to Instagram                ││
│  │                                        [View All Insights]│
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  [Campaigns]  [Content]  [Audiences]  [Geography]  [Insights]│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Components

#### 1. AI Narrative Summary
**Component:** `<ExecutiveSummary />`

**Props:**
```typescript
interface ExecutiveSummaryProps {
  narrative: string;          // AI-generated from Client Translator Agent
  dateRange: string;          // "Feb 1-7, 2026"
  onViewFullReport: () => void;
}
```

**Data Source:** 
- Fetches from n8n via `/api/insights/narrative?brand_id={brand_id}&date_range=7d`
- Generated by Client Translator Agent in Weekly Strategy workflow
- Cached for 1 hour

**Styling:**
- Large, readable font (18px)
- Calm color (matching brand)
- Subtle background
- Max 3-4 sentences
- Action-oriented language

---

#### 2. Hero Metrics Cards
**Component:** `<MetricCard />`

**Props:**
```typescript
interface MetricCardProps {
  label: string;              // "Spend", "ROAS", "Conversions", "Revenue"
  value: string | number;     // "3.8x", "$2,100", "67"
  change?: {
    value: number;            // 18
    direction: 'up' | 'down'; // 'up'
    period: string;           // "vs last week"
  };
  status: 'on-track' | 'warning' | 'critical';
  target?: number;            // Optional: show progress to goal
}
```

**Data Source:**
- `/api/performance/executive-summary`
- Real-time aggregation from Neo4j

**Calculation Logic:**
```python
# Backend: routers/performance.py

@router.get("/api/performance/executive-summary")
async def get_executive_summary(brand_id: str, date_range: str = "7d"):
    # Get current period metrics
    current = await neo4j_query("""
        MATCH (camp:Campaign {brand_id: $brand_id})-[:ACHIEVED]->(perf:Performance)
        WHERE perf.date >= date() - duration({days: $days})
        RETURN sum(perf.spend) AS total_spend,
               sum(perf.revenue) AS total_revenue,
               sum(perf.conversions) AS total_conversions,
               avg(perf.roas) AS avg_roas
    """, brand_id=brand_id, days=7)
    
    # Get prior period for comparison
    prior = await neo4j_query("""
        MATCH (camp:Campaign {brand_id: $brand_id})-[:ACHIEVED]->(perf:Performance)
        WHERE perf.date >= date() - duration({days: 14})
          AND perf.date < date() - duration({days: 7})
        RETURN sum(perf.spend) AS total_spend,
               avg(perf.roas) AS avg_roas,
               sum(perf.conversions) AS total_conversions,
               sum(perf.revenue) AS total_revenue
    """, brand_id=brand_id)
    
    # Calculate changes
    return {
        "spend": {
            "value": current["total_spend"],
            "change": calculate_change(current["total_spend"], prior["total_spend"]),
            "status": "on-track" if current["total_spend"] <= budget else "warning"
        },
        "roas": {
            "value": current["avg_roas"],
            "change": calculate_change(current["avg_roas"], prior["avg_roas"]),
            "status": "on-track" if current["avg_roas"] >= target_roas else "warning"
        },
        "conversions": {
            "value": current["total_conversions"],
            "change": calculate_change(current["total_conversions"], prior["total_conversions"]),
            "status": "on-track"
        },
        "revenue": {
            "value": current["total_revenue"],
            "change": calculate_change(current["total_revenue"], prior["total_revenue"]),
            "status": "on-track"
        }
    }
```

**Visual Design:**
```typescript
// Green up arrow for positive changes
{change.direction === 'up' && change.value > 0 && (
  <span className="text-green-600 flex items-center gap-1">
    <ArrowUpIcon className="w-4 h-4" />
    {change.value}%
  </span>
)}

// Status indicator
{status === 'warning' && (
  <div className="absolute top-2 right-2">
    <AlertCircle className="w-5 h-5 text-yellow-500" />
  </div>
)}
```

---

#### 3. 7-Day Trend Sparkline
**Component:** `<TrendSparkline />`

**Props:**
```typescript
interface TrendSparklineProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  metric: 'roas' | 'spend' | 'conversions';
  height?: number;
}
```

**Implementation:**
```typescript
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function TrendSparkline({ data, metric, height = 80 }: TrendSparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#2C5F4F"  // Brand primary color
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**Data Source:**
```python
@router.get("/api/performance/trend")
async def get_trend(brand_id: str, metric: str, days: int = 7):
    query = f"""
        MATCH (camp:Campaign {{brand_id: $brand_id}})-[:ACHIEVED]->(perf:Performance)
        WHERE perf.date >= date() - duration({{days: $days}})
        RETURN perf.date AS date, 
               {'avg(perf.roas)' if metric == 'roas' else f'sum(perf.{metric})'} AS value
        ORDER BY date ASC
    """
    
    results = await neo4j_query(query, brand_id=brand_id, days=days)
    return [{"date": r["date"], "value": r["value"]} for r in results]
```

---

#### 4. Top Insights Cards
**Component:** `<InsightCard />`

**Props:**
```typescript
interface InsightCardProps {
  icon: 'target' | 'fire' | 'trending' | 'alert';
  insight: string;            // "Evening engagement 2.8x higher"
  action?: string;            // "Shifted 60% of budget to 6-9pm"
  impact?: string;            // Optional: "+18% ROAS expected"
  type: 'opportunity' | 'alert' | 'achievement';
}
```

**Data Source:**
- `/api/insights/top?brand_id={brand_id}&limit=3`
- Generated by agents (CSO, Creative Intelligence, Cultural Anthropologist)
- Stored in n8n workflow outputs

**Visual Design:**
```typescript
const iconMap = {
  target: <Target className="w-6 h-6 text-blue-500" />,
  fire: <Flame className="w-6 h-6 text-orange-500" />,
  trending: <TrendingUp className="w-6 h-6 text-green-500" />,
  alert: <AlertCircle className="w-6 h-6 text-yellow-500" />
};

return (
  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
    <div className="flex items-start gap-3">
      {iconMap[icon]}
      <div>
        <p className="font-semibold text-gray-900">{insight}</p>
        {action && (
          <p className="text-sm text-gray-600 mt-1">→ {action}</p>
        )}
        {impact && (
          <p className="text-sm text-green-600 font-medium mt-1">{impact}</p>
        )}
      </div>
    </div>
  </div>
);
```

---

#### 5. Quick Navigation Bar
**Component:** `<QuickNav />`

**Purpose:** Jump to Level 2 category views

```typescript
const categories = [
  { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { label: 'Content', href: '/content', icon: Image },
  { label: 'Audiences', href: '/audiences', icon: Users },
  { label: 'Geography', href: '/geography', icon: MapPin },
  { label: 'Insights', href: '/insights', icon: Lightbulb }
];

return (
  <nav className="flex gap-4 border-t pt-4">
    {categories.map(cat => (
      <Link 
        href={cat.href}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        <cat.icon className="w-5 h-5" />
        <span>{cat.label}</span>
      </Link>
    ))}
  </nav>
);
```

---

## Level 2: Category Views

### Page 1: Campaigns (`/campaigns`)

**Purpose:** Manage active campaigns, see platform breakdown

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Campaigns                                [+ New Campaign]│
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Platform Performance Comparison                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  [Bar chart: Instagram, Facebook, Google Search]  │  │
│  │   ROAS by platform                                │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Active Campaigns                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Campaign Name    Platform  Budget   ROAS   Status   ││
│  │─────────────────────────────────────────────────────││
│  │ Awareness-001    Instagram $50/day  4.2    Active  🟢││
│  │ Awareness-002    Facebook  $35/day  2.1    Active  🟡││
│  │ Conversion-001   Google    $40/day  3.8    Active  🟢││
│  └─────────────────────────────────────────────────────┘│
│                                                           │
│  [View Paused]  [View Completed]                         │
└─────────────────────────────────────────────────────────┘
```

**Components:**

**Platform Performance Chart:**
```typescript
interface PlatformPerformanceProps {
  data: Array<{
    platform: string;
    roas: number;
    spend: number;
    conversions: number;
  }>;
}

// Recharts BarChart implementation
<BarChart data={data}>
  <XAxis dataKey="platform" />
  <YAxis />
  <Tooltip content={<CustomTooltip />} />
  <Bar dataKey="roas" fill="#2C5F4F" />
</BarChart>
```

**Campaign Table:**
```typescript
interface Campaign {
  id: string;
  name: string;
  platform: string;
  budget_per_day: number;
  current_roas: number;
  status: 'active' | 'paused' | 'completed';
  content_id: string;
  demographic: string;
}

// Data fetched from Neo4j
@router.get("/api/campaigns/active")
async def get_active_campaigns(brand_id: str):
    return await neo4j_query("""
        MATCH (camp:Campaign {brand_id: $brand_id, status: 'active'})
        MATCH (camp)-[:USED_PLATFORM]->(p:Platform)
        MATCH (camp)-[:ACHIEVED]->(perf:Performance)
        WHERE perf.date >= date() - duration({days: 7})
        RETURN camp.id, camp.name, p.name AS platform,
               camp.budget_per_day, avg(perf.roas) AS current_roas
    """)
```

---

### Page 2: Content Library (`/content`)

**Purpose:** Visual gallery of all content with performance overlays

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Content Library              [Upload New]  [Filters ▾] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │[Thumbnail]│  │[Thumbnail]│  │[Thumbnail]│  │[Thumbnail]││
│  │          │  │          │  │          │  │          ││
│  │ 4.2 ROAS │  │ 3.8 ROAS │  │ 2.1 ROAS │  │   NEW    ││
│  │  Active  │  │  Active  │  │  Resting │  │  Ready   ││
│  │          │  │          │  │          │  │          ││
│  │calm,     │  │energetic,│  │calm,     │  │calm,     ││
│  │minimal   │  │vibrant   │  │minimal   │  │minimal   ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│                                                           │
│  [Click any content for detailed analysis]                │
└─────────────────────────────────────────────────────────┘
```

**Component:**
```typescript
interface ContentCardProps {
  content: {
    id: string;
    filename: string;
    drive_url: string;
    thumbnail_url: string;
    status: 'active' | 'resting' | 'archived' | 'ready';
    avg_roas: number;
    emotional_tones: string[];
    visual_aesthetics: string[];
    total_impressions: number;
    creative_fatigue_score: number;
  };
}

export function ContentCard({ content }: ContentCardProps) {
  const statusColor = {
    active: 'bg-green-100 text-green-800',
    resting: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <Link href={`/content/${content.id}`} className="block">
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100">
          <img 
            src={content.thumbnail_url} 
            alt={content.filename}
            className="w-full h-full object-cover"
          />
          
          {/* Performance badge */}
          {content.avg_roas > 0 && (
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow">
              <span className="font-bold text-green-600">
                {content.avg_roas.toFixed(1)}x ROAS
              </span>
            </div>
          )}
          
          {/* Status badge */}
          <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${statusColor[content.status]}`}>
            {content.status}
          </div>
        </div>
        
        {/* Metadata */}
        <div className="p-3">
          <p className="text-sm text-gray-600 truncate">{content.filename}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {content.emotional_tones.slice(0, 2).map(tone => (
              <span key={tone} className="px-2 py-1 bg-gray-100 text-xs rounded">
                {tone}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

**Data Source:**
```python
@router.get("/api/content/library")
async def get_content_library(
    brand_id: str,
    status: Optional[str] = None,
    min_roas: Optional[float] = None
):
    # Get content from Neo4j
    query = """
        MATCH (c:Content {brand_id: $brand_id})
        WHERE ($status IS NULL OR c.status = $status)
          AND ($min_roas IS NULL OR c.avg_roas >= $min_roas)
        RETURN c
        ORDER BY c.avg_roas DESC
    """
    
    content_nodes = await neo4j_query(query, brand_id=brand_id, status=status, min_roas=min_roas)
    
    # Fetch metadata from Pinecone for each content
    content_ids = [f"content_{c['c']['id']}_{brand_id}" for c in content_nodes]
    pinecone_data = pinecone_index.fetch(ids=content_ids, namespace=f"content-essence-{brand_id}")
    
    # Combine Neo4j + Pinecone data
    results = []
    for node in content_nodes:
        content_id = node['c']['id']
        pinecone_key = f"content_{content_id}_{brand_id}"
        
        metadata = pinecone_data.vectors.get(pinecone_key, {}).get('metadata', {})
        
        results.append({
            **node['c'],
            "emotional_tones": metadata.get('emotional_tones', []),
            "visual_aesthetics": metadata.get('visual_aesthetics', []),
            "thumbnail_url": generate_thumbnail_url(node['c']['drive_url'])
        })
    
    return results
```

---

### Page 3: Content Detail (`/content/[id]`)

**Purpose:** Deep dive on single piece of content

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Library                                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │                  │  │ acupuncture-treatment.mp4   │ │
│  │  [Video Player]  │  │ Uploaded: Jan 15, 2026      │ │
│  │                  │  │ Duration: 30 seconds         │ │
│  │                  │  │ Status: Active               │ │
│  └──────────────────┘  └─────────────────────────────┘ │
│                                                           │
│  Semantic Profile                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Emotional Tones: calm (95%), professional (82%)   │  │
│  │ Visual Aesthetic: minimal (92%), intimate (85%)   │  │
│  │ Color Palette: warm-tones, earth-tones, beige     │  │
│  │ Shows: Physical space ✓, Local landmark ✓        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Performance by Demographic                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │ women-35-50:           4.2 ROAS (23 campaigns)    │  │
│  │ professionals-25-40:   3.1 ROAS (8 campaigns)     │  │
│  │ seniors-55-70:         2.8 ROAS (4 campaigns)     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Performance by Platform                                  │
│  [Bar chart: Instagram 4.5, Facebook 3.2, Google 2.9]    │
│                                                           │
│  Performance Over Time                                    │
│  [Line chart showing ROAS by week - detect fatigue]      │
│                                                           │
│  Where It's Running                                       │
│  • Campaign: Awareness-001 (Instagram, women-35-50)       │
│  • Campaign: Conversion-003 (Facebook, professionals)     │
│                                                           │
│  Similar Content (by semantic similarity)                 │
│  [3 content cards with similarity scores]                 │
└─────────────────────────────────────────────────────────┘
```

**Data Source:**
```python
@router.get("/api/content/{content_id}/analysis")
async def get_content_analysis(content_id: str, brand_id: str):
    # Get basic info from Neo4j
    content_node = await neo4j_query("""
        MATCH (c:Content {id: $content_id, brand_id: $brand_id})
        RETURN c
    """)
    
    # Get full semantic profile from Pinecone
    pinecone_result = pinecone_index.fetch(
        ids=[f"content_{content_id}_{brand_id}"],
        namespace=f"content-essence-{brand_id}"
    )
    semantic_profile = pinecone_result.vectors[f"content_{content_id}_{brand_id}"].metadata
    
    # Get performance by demographic
    demo_performance = await neo4j_query("""
        MATCH (c:Content {id: $content_id})-[:RAN_IN]->(camp:Campaign)
        -[:TARGETED]->(demo:Demographic)
        MATCH (camp)-[:ACHIEVED]->(perf:Performance)
        RETURN demo.name, 
               avg(perf.roas) AS avg_roas,
               count(camp) AS campaign_count
        ORDER BY avg_roas DESC
    """)
    
    # Get performance by platform
    platform_performance = await neo4j_query("""
        MATCH (c:Content {id: $content_id})-[:RAN_IN]->(camp:Campaign)
        -[:USED_PLATFORM]->(p:Platform)
        MATCH (camp)-[:ACHIEVED]->(perf:Performance)
        RETURN p.name, avg(perf.roas) AS avg_roas
        ORDER BY avg_roas DESC
    """)
    
    # Get performance over time (fatigue detection)
    time_series = await neo4j_query("""
        MATCH (c:Content {id: $content_id})-[:RAN_IN]->(camp:Campaign)
        -[:ACHIEVED]->(perf:Performance)
        RETURN perf.date, avg(perf.roas) AS avg_roas, avg(perf.ctr) AS avg_ctr
        ORDER BY perf.date ASC
    """)
    
    # Get similar content from Pinecone
    content_vector = pinecone_result.vectors[f"content_{content_id}_{brand_id}"].values
    similar_content = pinecone_index.query(
        namespace=f"content-essence-{brand_id}",
        vector=content_vector,
        top_k=4,  # Including self
        include_metadata=True,
        filter={"content_id": {"$ne": content_id}}  # Exclude self
    )
    
    # Get currently running campaigns
    active_campaigns = await neo4j_query("""
        MATCH (c:Content {id: $content_id})-[:RAN_IN]->(camp:Campaign {status: 'active'})
        -[:TARGETED]->(demo:Demographic)
        MATCH (camp)-[:USED_PLATFORM]->(p:Platform)
        RETURN camp.name, p.name AS platform, demo.name AS demographic
    """)
    
    return {
        "basic_info": content_node,
        "semantic_profile": semantic_profile,
        "performance_by_demographic": demo_performance,
        "performance_by_platform": platform_performance,
        "performance_over_time": time_series,
        "similar_content": similar_content.matches,
        "active_campaigns": active_campaigns
    }
```

---

### Page 4: Audiences (`/audiences`)

**Purpose:** Understand demographic performance and preferences

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Audience Insights                                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Performance by Demographic                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │ [Donut chart showing spend/ROAS by demographic]   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐│
│  │ wellness-focused-women-35-50          [View Detail] ││
│  │                                                      ││
│  │ Performance:  4.1 ROAS  |  0.041 CTR  |  28% Conv   ││
│  │ Campaigns:    15 active campaigns                   ││
│  │                                                      ││
│  │ Prefers:  calm tone, minimal aesthetic, warm colors ││
│  │ Best time:  Weekday evenings (6-9pm)               ││
│  │ Top content: [3 thumbnails]                         ││
│  └─────────────────────────────────────────────────────┘│
│                                                           │
│  ┌─────────────────────────────────────────────────────┐│
│  │ stressed-professionals-25-40          [View Detail] ││
│  │                                                      ││
│  │ Performance:  3.2 ROAS  |  0.035 CTR  |  22% Conv   ││
│  │ Campaigns:    8 active campaigns                    ││
│  │                                                      ││
│  │ Prefers:  professional tone, modern aesthetic       ││
│  │ Best time:  Weekday mornings (7-10am)              ││
│  │ Top content: [3 thumbnails]                         ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Component:**
```typescript
interface AudienceCardProps {
  demographic: {
    name: string;
    avg_roas: number;
    avg_ctr: number;
    conversion_rate: number;
    campaign_count: number;
    preferred_tones: string[];
    preferred_aesthetics: string[];
    best_time_slots: string[];
    top_content_ids: string[];
  };
}

export function AudienceCard({ demographic }: AudienceCardProps) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{demographic.name}</h3>
        <Link href={`/audiences/${demographic.name}`}>
          <Button variant="outline" size="sm">View Detail</Button>
        </Link>
      </div>
      
      {/* Performance metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <MetricPill label="ROAS" value={`${demographic.avg_roas.toFixed(1)}x`} />
        <MetricPill label="CTR" value={`${(demographic.avg_ctr * 100).toFixed(2)}%`} />
        <MetricPill label="Conv" value={`${(demographic.conversion_rate * 100).toFixed(0)}%`} />
      </div>
      
      {/* Preferences */}
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-600">Prefers: </span>
          <span className="font-medium">
            {demographic.preferred_tones[0]} tone, {demographic.preferred_aesthetics[0]} aesthetic
          </span>
        </div>
        <div>
          <span className="text-gray-600">Best time: </span>
          <span className="font-medium">{demographic.best_time_slots[0]}</span>
        </div>
      </div>
      
      {/* Top content thumbnails */}
      <div className="flex gap-2 mt-4">
        {demographic.top_content_ids.slice(0, 3).map(id => (
          <ContentThumbnail key={id} contentId={id} size="sm" />
        ))}
      </div>
    </div>
  );
}
```

**Data Source:**
```python
@router.get("/api/audiences")
async def get_audiences(brand_id: str):
    # Get demographics with performance
    demographics = await neo4j_query("""
        MATCH (demo:Demographic {brand_id: $brand_id})
        <-[:TARGETED]-(camp:Campaign)-[:ACHIEVED]->(perf:Performance)
        WHERE perf.date >= date() - duration({days: 30})
        
        WITH demo,
             avg(perf.roas) AS avg_roas,
             avg(perf.ctr) AS avg_ctr,
             avg(perf.conversion_rate) AS conversion_rate,
             count(DISTINCT camp) AS campaign_count
        
        // Get preferred attributes
        OPTIONAL MATCH (demo)-[r:RESPONDS_TO]->(tone:Tone)
        WITH demo, avg_roas, avg_ctr, conversion_rate, campaign_count,
             collect({name: tone.name, score: r.avg_roas}) AS tone_preferences
        
        OPTIONAL MATCH (demo)-[r2:PREFERS_AESTHETIC]->(aes:Aesthetic)
        WITH demo, avg_roas, avg_ctr, conversion_rate, campaign_count, tone_preferences,
             collect({name: aes.name, score: r2.avg_roas}) AS aesthetic_preferences
        
        OPTIONAL MATCH (demo)-[r3:ENGAGES_AT]->(ts:TimeSlot)
        WITH demo, avg_roas, avg_ctr, conversion_rate, campaign_count, tone_preferences, aesthetic_preferences,
             collect({name: ts.name, score: r3.avg_ctr}) AS time_preferences
        
        // Get top performing content for this demo
        OPTIONAL MATCH (demo)<-[:TARGETED]-(camp2:Campaign)<-[:RAN_IN]-(content:Content)
        MATCH (camp2)-[:ACHIEVED]->(perf2:Performance)
        WITH demo, avg_roas, avg_ctr, conversion_rate, campaign_count, 
             tone_preferences, aesthetic_preferences, time_preferences,
             content, avg(perf2.roas) AS content_roas
        ORDER BY content_roas DESC
        
        RETURN demo.name AS name,
               avg_roas, avg_ctr, conversion_rate, campaign_count,
               [p IN tone_preferences WHERE p.name IS NOT NULL | p.name][0..3] AS preferred_tones,
               [p IN aesthetic_preferences WHERE p.name IS NOT NULL | p.name][0..3] AS preferred_aesthetics,
               [p IN time_preferences WHERE p.name IS NOT NULL | p.name][0..3] AS best_time_slots,
               collect(content.id)[0..3] AS top_content_ids
        ORDER BY avg_roas DESC
    """)
    
    return demographics
```

---

### Page 5: Geography (`/geography`)

**Purpose:** Visualize performance by location

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Geographic Performance                                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │           [Heat map visualization]                │  │
│  │                                                    │  │
│  │   Palo Alto (0-5mi):  4.5 ROAS                   │  │
│  │   Stanford area:      4.2 ROAS                    │  │
│  │   Menlo Park (5-10mi): 3.8 ROAS                  │  │
│  │   Mountain View:      3.2 ROAS                    │  │
│  │                                                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Performance by Distance                                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Distance   Spend    ROAS    Conversions  Budget % │  │
│  │──────────────────────────────────────────────────│  │
│  │ 0-5 mi     $1,050   4.5     45           50%      │  │
│  │ 5-10 mi    $735     3.8     28           35%      │  │
│  │ 10-15 mi   $315     3.2     9            15%      │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Insight: Inner radius (0-5mi) outperforming. Consider  │
│           reallocating budget from 10-15mi to 5-10mi.    │
└─────────────────────────────────────────────────────────┘
```

**Component:**
```typescript
import { MapContainer, Circle, Marker, Popup } from 'react-leaflet';

interface GeographicHeatmapProps {
  center: [number, number];  // [lat, lng]
  areas: Array<{
    name: string;
    coordinates: [number, number];
    distance_miles: number;
    roas: number;
    spend: number;
  }>;
}

export function GeographicHeatmap({ center, areas }: GeographicHeatmapProps) {
  const getColorByRoas = (roas: number) => {
    if (roas >= 4.0) return '#10b981';  // green
    if (roas >= 3.0) return '#f59e0b';  // yellow
    return '#ef4444';  // red
  };
  
  return (
    <MapContainer center={center} zoom={11} style={{ height: '400px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Business location marker */}
      <Marker position={center}>
        <Popup>Your Location</Popup>
      </Marker>
      
      {/* Performance circles */}
      {areas.map(area => (
        <Circle
          key={area.name}
          center={area.coordinates}
          radius={area.distance_miles * 1609.34}  // miles to meters
          pathOptions={{
            color: getColorByRoas(area.roas),
            fillColor: getColorByRoas(area.roas),
            fillOpacity: 0.3
          }}
        >
          <Popup>
            <div>
              <h4 className="font-bold">{area.name}</h4>
              <p>ROAS: {area.roas.toFixed(1)}x</p>
              <p>Spend: ${area.spend}</p>
            </div>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}
```

---

## Level 3: Detailed Metrics (`/detailed-metrics`)

**Purpose:** Granular media buyer metrics for technical users

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Detailed Metrics                [Export CSV] [Filters ▾]│
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Date Range: [Feb 1-7, 2026 ▾]  Platform: [All ▾]       │
│                                                           │
│  Core Metrics                                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Metric          Value    Change    Industry Avg   │  │
│  │────────────────────────────────────────────────────│  │
│  │ CPM            $8.50     -5%       $9.20          │  │
│  │ CPC            $0.45     +2%       $0.52          │  │
│  │ CTR            4.2%      +18%      3.1%           │  │
│  │ Frequency      2.3       -         2.1            │  │
│  │ Reach          5,434     +12%      -              │  │
│  │ Impressions    12,500    +15%      -              │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Conversion Metrics                                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Cost/Conv      $14.52    -12%      $18.30        │  │
│  │ Conv Rate      3.1%      +8%       2.4%          │  │
│  │ ROAS           4.2x      +18%      2.8x          │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Time Series View              [Select Metrics ▾]        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  [Multi-axis line chart with 3-4 metrics]         │  │
│  │  - ROAS (left axis)                               │  │
│  │  - CTR (left axis)                                │  │
│  │  - CPM (right axis)                               │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Platform Breakdown                                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Platform   CPM    CPC    CTR   Freq  Quality Score││
│  │────────────────────────────────────────────────────│  │
│  │ Instagram  $9.20  $0.42  4.5%  2.1   8.5/10       ││
│  │ Facebook   $7.80  $0.48  3.8%  2.6   7.2/10       ││
│  │ Google     $8.10  $0.51  3.2%  -     9.1/10       ││
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Data Source:**
```python
@router.get("/api/performance/detailed-metrics")
async def get_detailed_metrics(
    brand_id: str,
    date_range: str = "7d",
    platform: Optional[str] = None,
    campaign_id: Optional[str] = None
):
    # Parse date range
    days = int(date_range.replace('d', ''))
    
    # Build dynamic query based on filters
    filters = ["perf.date >= date() - duration({days: $days})"]
    if platform:
        filters.append("p.name = $platform")
    if campaign_id:
        filters.append("camp.id = $campaign_id")
    
    where_clause = " AND ".join(filters)
    
    query = f"""
        MATCH (camp:Campaign {{brand_id: $brand_id}})-[:ACHIEVED]->(perf:Performance)
        MATCH (camp)-[:USED_PLATFORM]->(p:Platform)
        WHERE {where_clause}
        
        RETURN p.name AS platform,
               avg(perf.cpm) AS avg_cpm,
               avg(perf.cpc) AS avg_cpc,
               avg(perf.ctr) AS avg_ctr,
               avg(perf.frequency) AS avg_frequency,
               avg(perf.reach) AS avg_reach,
               sum(perf.impressions) AS total_impressions,
               avg(perf.conversion_rate) AS avg_conversion_rate,
               avg(perf.cost_per_conversion) AS avg_cost_per_conversion,
               avg(perf.roas) AS avg_roas
        ORDER BY p.name
    """
    
    current_metrics = await neo4j_query(query, brand_id=brand_id, days=days, platform=platform, campaign_id=campaign_id)
    
    # Get prior period for comparison
    prior_metrics = await neo4j_query(query.replace(
        "date() - duration({days: $days})",
        "date() - duration({days: $prior_days})"
    ).replace(
        "WHERE perf.date >= date() - duration({days: $days})",
        "WHERE perf.date >= date() - duration({days: $prior_days}) AND perf.date < date() - duration({days: $days})"
    ), brand_id=brand_id, days=days, prior_days=days*2, platform=platform)
    
    # Calculate changes
    metrics_with_changes = []
    for curr, prior in zip(current_metrics, prior_metrics):
        metrics_with_changes.append({
            "platform": curr["platform"],
            "cpm": {
                "value": curr["avg_cpm"],
                "change": calculate_pct_change(curr["avg_cpm"], prior["avg_cpm"])
            },
            "cpc": {
                "value": curr["avg_cpc"],
                "change": calculate_pct_change(curr["avg_cpc"], prior["avg_cpc"])
            },
            "ctr": {
                "value": curr["avg_ctr"],
                "change": calculate_pct_change(curr["avg_ctr"], prior["avg_ctr"])
            },
            # ... all other metrics
        })
    
    return {
        "metrics": metrics_with_changes,
        "industry_benchmarks": get_industry_benchmarks(brand_id)  # External data
    }
```

---

## Content Upload Interface (`/upload`)

**Purpose:** Drag-and-drop content upload with real-time analysis preview

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Upload Content                                          │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │         Drag & drop files here                    │  │
│  │         or click to browse                        │  │
│  │                                                    │  │
│  │         Supported: MP4, MOV, JPG, PNG             │  │
│  │                                                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Uploading: acupuncture-treatment.mp4                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │ ████████████████░░░░░░░░░░ 65%                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Analyzing...                                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Detected:                                          │  │
│  │ • Tones: calm, professional, reassuring           │  │
│  │ • Aesthetic: minimal, intimate                    │  │
│  │ • Shows: Physical space, local landmark           │  │
│  │                                                    │  │
│  │ Predicted Performance: 3.8-4.2 ROAS               │  │
│  │ Best for: wellness-focused-women-35-50            │  │
│  │                                                    │  │
│  │ [Deploy to Campaigns]  [Save as Draft]            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Component:**
```typescript
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export function ContentUpload() {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov'],
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      
      // Upload to Google Drive
      setUploading(true);
      const driveUrl = await uploadToGoogleDrive(file);
      setUploading(false);
      
      // Trigger n8n content ingestion workflow
      setAnalyzing(true);
      const result = await fetch('/api/content/analyze', {
        method: 'POST',
        body: JSON.stringify({ drive_url: driveUrl }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const analysisData = await result.json();
      setAnalysis(analysisData);
      setAnalyzing(false);
    }
  });
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 cursor-pointer"
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2">Drag & drop files here</p>
        <p className="text-sm text-gray-500">or click to browse</p>
        <p className="text-xs text-gray-400 mt-2">Supported: MP4, MOV, JPG, PNG</p>
      </div>
      
      {uploading && (
        <div className="mt-6">
          <p className="mb-2">Uploading...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
          </div>
        </div>
      )}
      
      {analyzing && (
        <div className="mt-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Analyzing content...</p>
        </div>
      )}
      
      {analysis && (
        <div className="mt-6 border rounded-lg p-6 bg-gray-50">
          <h3 className="font-bold text-lg mb-4">Analysis Complete</h3>
          
          <div className="space-y-3 mb-6">
            <div>
              <span className="font-medium">Detected Tones:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {analysis.emotional_tones.map(tone => (
                  <span key={tone.name} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {tone.name} ({(tone.confidence * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <span className="font-medium">Visual Aesthetic:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {analysis.visual_aesthetics.map(aes => (
                  <span key={aes.name} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {aes.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <p className="font-medium text-green-600">
                Predicted Performance: {analysis.predicted_roas_min}-{analysis.predicted_roas_max} ROAS
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Best for: {analysis.best_demographic}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => deployToActiveCampaigns(analysis.content_id)}
              className="flex-1"
            >
              Deploy to Campaigns
            </Button>
            <Button 
              variant="outline"
              onClick={() => saveDraft(analysis.content_id)}
            >
              Save as Draft
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## API Structure (FastAPI Backend)

### Router Organization

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Marketing Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from routers import performance, content, campaigns, insights, leads, webhooks

app.include_router(performance.router, prefix="/api/performance", tags=["performance"])
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(campaigns.router, prefix="/api/campaigns", tags=["campaigns"])
app.include_router(insights.router, prefix="/api/insights", tags=["insights"])
app.include_router(leads.router, prefix="/api/leads", tags=["leads"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### Services Layer

```python
# services/neo4j_client.py
from neo4j import GraphDatabase
import os

class Neo4jClient:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            os.getenv("NEO4J_URI"),
            auth=(os.getenv("NEO4J_USER"), os.getenv("NEO4J_PASSWORD"))
        )
    
    async def query(self, cypher: str, **params):
        with self.driver.session() as session:
            result = session.run(cypher, **params)
            return [record.data() for record in result]
    
    def close(self):
        self.driver.close()

neo4j_client = Neo4jClient()


# services/pinecone_client.py
import pinecone
import os

pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT")
)

pinecone_index = pinecone.Index("marketing-automation")


# services/n8n_client.py
import httpx

class N8NClient:
    def __init__(self):
        self.base_url = os.getenv("N8N_BASE_URL")
    
    async def get_latest_narrative(self, brand_id: str):
        """Fetch latest AI-generated narrative from n8n"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/webhook/{brand_id}/latest-narrative"
            )
            return response.json()

n8n_client = N8NClient()
```

---

## Deployment

### Frontend (Vercel)

```bash
# In dashboard/frontend/
npm install
npm run build
vercel deploy --prod
```

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://api.zenmedclinic.com
NEXT_PUBLIC_BRAND_ID=zen-med-clinic
```

### Backend (Railway/Render)

```bash
# In dashboard/backend/
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Environment Variables:**
```
NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=xxxxx
PINECONE_API_KEY=xxxxx
PINECONE_ENVIRONMENT=us-east-1-aws
N8N_BASE_URL=https://n8n.yourserver.com
BRAND_ID=zen-med-clinic
```

---

## Performance Optimization

### Caching Strategy
- Redis cache for frequently accessed data (demographics, brand config)
- Cache TTL: 1 hour for metrics, 24 hours for configurations
- Invalidate cache after n8n workflow updates

### API Response Times
- Target: <500ms for all endpoints
- Use database indexes extensively
- Batch Pinecone queries when possible
- Implement pagination for large result sets

### Real-Time Updates
- WebSocket connection for live data (optional)
- Or: Polling every 30 seconds for active page
- Push notifications for critical alerts

---

## Cost Estimation

**Monthly Cost per Client:**
- Vercel (frontend): Free tier (hobby project) or $20/month (pro)
- Railway/Render (backend): $5-20/month depending on usage
- Total: ~$0-40/month per client dashboard

**Shared Infrastructure:**
- Single backend can serve multiple client dashboards
- Just need separate frontend deployments (or multi-tenant frontend)