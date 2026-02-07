---
name: generate-proposal
description: Generates a client-facing strategy presentation as HTML and PDF from initialization data and brand assets
---

# Generate Proposal Command

Creates a beautiful, client-facing strategy presentation that synthesizes all research, strategy, and creative direction into a professional proposal. Outputs both an interactive HTML file (viewable in browser) and a print-ready PDF.

## Input

**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug matching the client directory name

**Parse $ARGUMENTS to extract the `name` value.**

If `name` is missing, stop and ask the user for it.

## Validation

Before proceeding, verify these files exist:

**Required:**
- `clients/{name}/brand-config.json`
- `clients/{name}/research/brand-profile.md`
- `clients/{name}/research/competitive-landscape.md`
- `clients/{name}/strategy/campaign-plan.md`
- `clients/{name}/creative/creative-strategy.md`

If any are missing, report which files are absent and instruct the user to run `/initialize-client name={name}` first.

**Optional (enhance proposal if present):**
- `clients/{name}/assets/` — Logo, hero images, brand photos
- `clients/{name}/creative/briefs/*.md` — Content briefs
- `clients/{name}/content-requests/monthly-content-plan.md`

## Process

### Step 1: Read All Source Material

Read and internalize:
1. `brand-config.json` — Brand identity, demographics, platforms, budget, goals
2. `brand-profile.md` — Brand research findings
3. `competitive-landscape.md` — Competitive analysis
4. `campaign-plan.md` — Full marketing strategy
5. `creative-strategy.md` — Creative direction and copy examples

### Step 2: Discover Brand Assets

Check `clients/{name}/assets/` for any files:
- Look for logo files (logo.png, logo.svg, logo.jpg, etc.)
- Look for hero/banner images
- Look for product/service photos
- Look for any brand guideline documents

If assets are found, they will be embedded in the presentation using base64 encoding (for self-contained HTML) or file references.

### Step 3: Extract Brand Colors

From `brand-config.json`, extract:
- `brand_colors.primary`
- `brand_colors.secondary`
- `brand_colors.accent`

If brand colors are not defined in config, infer them from the brand profile research (noted visual brand section). Use sensible defaults if neither source has them.

### Step 4: Build HTML Presentation

Create `clients/{name}/proposal/presentation.html` — a single, self-contained HTML file with embedded CSS.

**Design Principles:**
- Clean, modern, professional design
- Uses the client's brand colors throughout
- Landscape-oriented slides (16:9 aspect ratio, print-friendly)
- Each section is a "slide" that fills one page when printed
- Embedded images (base64) so the HTML works standalone
- No external dependencies (no CDN links) — everything inline
- Smooth scroll navigation between sections
- Print media queries for clean PDF export

**Presentation Structure (Slides):**

#### Slide 1: Title Slide
- Brand name (large, prominent)
- Brand logo (if available in assets)
- "Digital Marketing Strategy & Proposal"
- Prepared by: Helianthes Marketing
- Date: {current date}
- Tagline or positioning statement

#### Slide 2: Executive Summary
- 3-4 sentence overview of the opportunity
- Key insight from research
- Primary strategic recommendation
- Expected impact/outcomes

#### Slide 3: Brand Understanding
- Summary of brand identity findings
- Brand voice and personality
- Core values and differentiators
- Current digital presence assessment
- Include brand imagery if available

#### Slide 4: Market & Competitive Landscape
- Market overview (industry trends, opportunity size)
- Key competitors identified (3-5, summarized)
- Competitive positioning map (visual quadrant if possible)
- Key gaps and opportunities discovered
- Client's competitive advantages

#### Slide 5: Target Audiences
- Primary demographic profile (name, age, psychographics)
- Secondary demographic profile
- Tertiary (if defined)
- For each: motivations, pain points, media consumption
- Visual representation (persona cards)

#### Slide 6: Platform Strategy
- Selected platforms with rationale
- Platform-specific approach for each
- Content format strategy per platform
- Visual icons/representations for each platform

#### Slide 7: Budget Allocation
- Monthly budget breakdown
- Platform allocation (visual pie/bar chart using CSS)
- Budget rationale
- Expected reach/impressions at this budget level
- Testing allocation (15-20%)

#### Slide 8: Campaign Goals & KPIs
- Primary KPI with target
- Secondary KPIs with targets
- Measurement framework
- Reporting cadence (weekly reports, monthly reviews)
- How success will be determined

#### Slide 9: Content Strategy Overview
- Content themes (3-5)
- Content volume per month
- Content types and formats
- Visual direction summary
- Sample ad copy (2-3 examples from creative strategy)

#### Slide 10: Creative Direction
- Visual mood/direction description
- Tone and voice guidelines
- Example content concepts (from briefs)
- Photography/video direction
- Include sample imagery if available in assets

#### Slide 11: Technology & Automation
- Overview of the automation system
- AI-powered optimization (daily performance analysis)
- Automated content rotation
- Lead scoring and routing
- Analytics dashboard
- Keep this high-level and non-technical — focus on benefits

#### Slide 12: Geographic Strategy (if brick-and-mortar)
- Service area visualization
- Radius-based targeting approach
- Budget allocation by distance
- Local SEO considerations

#### Slide 13: Implementation Timeline
- Phase 1: Setup & Launch (Week 1-2)
  - Account setup, creative production, campaign configuration
- Phase 2: Optimization (Week 3-4)
  - Data collection, initial optimizations, A/B testing
- Phase 3: Scale (Month 2+)
  - Scale winning strategies, expand content, refine audiences
- Phase 4: Ongoing (Month 3+)
  - Autonomous optimization, weekly reports, monthly strategy reviews

#### Slide 14: What's Included
- Deliverables checklist:
  - Analytics dashboard (real-time performance monitoring)
  - Weekly AI-powered performance reports
  - Content strategy and creative briefs
  - Automated campaign optimization
  - Lead scoring and routing
  - Monthly strategy review sessions
  - Conversion-optimized website (if applicable)

#### Slide 15: Investment & Next Steps
- Monthly investment amount
- What's included at this level
- Contract terms (suggest: 3-month minimum for optimization)
- Next steps to get started:
  1. Approve strategy direction
  2. Provide brand assets and content
  3. Set up platform access
  4. Launch date target

**HTML/CSS Implementation Notes:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Brand Name} - Marketing Strategy Proposal</title>
  <style>
    /* Use CSS custom properties for brand colors */
    :root {
      --brand-primary: {primary_color};
      --brand-secondary: {secondary_color};
      --brand-accent: {accent_color};
    }

    /* Page/slide sizing for print */
    @media print {
      .slide { page-break-after: always; }
      .slide:last-child { page-break-after: avoid; }
    }

    /* Each slide should be ~16:9 landscape */
    .slide {
      width: 100%;
      max-width: 1280px;
      min-height: 720px;
      margin: 0 auto;
      padding: 60px 80px;
      box-sizing: border-box;
    }

    /* Professional typography */
    /* Clean data visualizations using CSS */
    /* Responsive for screen viewing */
    /* Print-optimized for PDF export */
  </style>
</head>
```

### Step 5: Generate PDF

After creating the HTML file, attempt to generate a PDF:

**Option 1: Use Chrome/Chromium headless (preferred)**
```bash
# Check if Chrome is available
which google-chrome || which chromium || which "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

If Chrome is available:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --print-to-pdf="{CLIENT_DIR}/proposal/presentation.pdf" \
  --no-margins --landscape \
  "file://{CLIENT_DIR}/proposal/presentation.html"
```

**Option 2: Use wkhtmltopdf if installed**
```bash
which wkhtmltopdf && wkhtmltopdf --orientation Landscape \
  "{CLIENT_DIR}/proposal/presentation.html" \
  "{CLIENT_DIR}/proposal/presentation.pdf"
```

**Option 3: If no PDF tool available**
- Inform the user that the HTML was created successfully
- Instruct them to open the HTML in a browser and use Print → Save as PDF (landscape orientation)
- The HTML is designed with print media queries to produce clean PDF output

### Step 6: Create Proposal README

Create `clients/{name}/proposal/README.md`:

```markdown
# Proposal for {Brand Name}

## Files

- `presentation.html` — Open in any browser to view the interactive presentation
- `presentation.pdf` — Print-ready PDF version (landscape)

## Viewing

Open `presentation.html` in your browser. Navigate between slides by scrolling.

## Printing / PDF

If you need to regenerate the PDF:
1. Open `presentation.html` in Chrome
2. Press Ctrl/Cmd + P
3. Set orientation to Landscape
4. Set margins to None
5. Enable "Background graphics"
6. Save as PDF

## Customization

To update the proposal:
- Edit the source HTML directly
- Or re-run: `/generate-proposal name={name}`

## Brand Assets

To improve the proposal with client imagery:
1. Add files to `clients/{name}/assets/` (logo.png, hero images, etc.)
2. Re-run the command to regenerate with embedded assets
```

## Output

After completion, display:

```
Proposal Generated: {brand_name}
=================================

  Files created:
    [x] proposal/presentation.html (viewable in browser)
    [x] proposal/presentation.pdf  (print-ready landscape)
    [x] proposal/README.md

  Open in browser:
    open clients/{name}/proposal/presentation.html

  Brand assets used: {N} files from assets/
  Slides generated: {N}

  To improve the proposal:
    - Add logo/images to clients/{name}/assets/
    - Re-run: /generate-proposal name={name}
```

## Notes

- The HTML is self-contained — no external dependencies or CDN links
- Brand colors from `brand-config.json` are used throughout
- If brand assets exist in `clients/{name}/assets/`, they are embedded as base64
- The presentation is designed for 16:9 landscape viewing/printing
- Each slide maps to one printed page
- All data comes from the initialization phase — no new research is done here
- Keep the language client-facing: professional, benefit-focused, minimal jargon
- The proposal should make the client excited about the strategy and confident in the approach
