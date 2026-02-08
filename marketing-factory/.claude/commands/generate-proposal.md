---
name: generate-proposal
description: Generates a client-facing strategy presentation as HTML and PDF from initialization data and brand assets
---

<purpose>
# Generate Proposal

Creates a professional, client-facing strategy presentation that synthesizes all research, strategy, and creative direction into a visual proposal. Outputs a self-contained HTML file (viewable in browser, printable as PDF) styled with the client's brand colors.
</purpose>

<input>
**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug matching the client directory name

Parse $ARGUMENTS to extract `name`. If missing, stop and ask.
</input>

<prerequisites>
**Required files (stop if missing, instruct user to run `/initialize-client` first):**
- `clients/{name}/brand-config.json`
- `clients/{name}/research/brand-profile.md`
- `clients/{name}/research/competitive-landscape.md`
- `clients/{name}/strategy/campaign-plan.md`
- `clients/{name}/creative/creative-strategy.md`

**Optional (enhance proposal if present):**
- `clients/{name}/assets/` — Logo, hero images, brand photos (embedded as base64)
- `clients/{name}/creative/briefs/*.md` — Content briefs
- `clients/{name}/content-requests/monthly-content-plan.md`
</prerequisites>

<orchestration>
## Process

### Step 1: Read All Source Material
Read and internalize all required + optional files. Extract brand colors from brand-config.json (`brand_colors.primary`, `.secondary`, `.accent`). If colors not in config, infer from brand profile research.

### Step 2: Discover Brand Assets
Check `clients/{name}/assets/` for logo files, hero/banner images, product/service photos. These will be embedded in the HTML as base64 for a self-contained file.

### Step 3: Build HTML Presentation
Create `clients/{name}/proposal/presentation.html` — a single, self-contained HTML file.

**Design principles:**
- Clean, modern, professional design using client's brand colors
- Landscape-oriented slides (16:9, print-friendly with CSS `page-break-after`)
- No external dependencies — all CSS inline, images base64-embedded
- Smooth scroll navigation between sections

**Slide structure (each section = one printed page):**
1. **Title** — Brand name, logo, "Digital Marketing Strategy & Proposal", date
2. **Executive Summary** — Key insight, primary recommendation, expected outcomes
3. **Brand Understanding** — Identity, voice, differentiators, digital presence
4. **Market & Competitive Landscape** — Competitors, positioning, gaps, advantages
5. **Target Audiences** — Demographic profiles with psychographics and media habits
6. **Platform Strategy** — Selected platforms with rationale and approach
7. **Budget Allocation** — Monthly breakdown with visual chart (CSS-based)
8. **Campaign Goals & KPIs** — Targets, measurement framework, success criteria
9. **Content Strategy** — Themes, volume, formats, sample ad copy
10. **Creative Direction** — Visual direction, tone guidelines, content concepts
11. **Technology & Automation** — High-level system benefits (non-technical, client-friendly)
12. **Geographic Strategy** — (conditional: brick-and-mortar only) Service area, targeting approach
13. **Implementation Timeline** — Phase 1: Setup (wk 1-2), Phase 2: Optimize (wk 3-4), Phase 3: Scale (mo 2+), Phase 4: Ongoing
14. **What's Included** — Deliverables checklist
15. **Investment & Next Steps** — Monthly investment, contract terms, how to get started

### Step 4: Generate PDF
Attempt PDF generation via Chrome headless (`--headless --print-to-pdf --landscape`) or wkhtmltopdf. If neither available, instruct user to open HTML in browser and Print → Save as PDF.

### Step 5: Create Proposal README
Create `clients/{name}/proposal/README.md` with viewing, printing, and customization instructions.
</orchestration>

<context_flow>
This command is read-only — it does not modify any source files. It reads the outputs of `/initialize-client` and synthesizes them into a presentation. No `.build-context.md` updates needed.
</context_flow>

<error_handling>
- If required files missing, report which and instruct user to run `/initialize-client`
- If no brand assets found, proceed without images (note in output)
- If PDF generation fails, instruct user on browser-based PDF export
</error_handling>

<completion>
Display: files created (HTML, PDF if generated, README), number of slides, number of brand assets embedded, instructions to open in browser, and how to improve (add assets and re-run).
</completion>
