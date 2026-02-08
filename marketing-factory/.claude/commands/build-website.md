---
name: build-website
description: Builds complete customer-facing website (service business or e-commerce) with conversion tracking and n8n integration
---

<purpose>
# Build Website

Creates a complete, conversion-optimized website based on the client's business model. Service businesses get a booking/contact-focused site. E-commerce businesses get a Shopify-integrated product site. Both include conversion tracking, form validation, UTM parameter capture, and n8n webhook integration.
</purpose>

<input>
**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug matching the client directory name

Parse $ARGUMENTS to extract `name`. If missing, stop and ask.
</input>

<prerequisites>
**Required files (stop if missing, instruct user to run `/initialize-client` first):**
- `clients/{name}/brand-config.json` — Brand identity, business model, services/products, colors
- `clients/{name}/research/brand-profile.md` — Brand voice, visual direction, trust signals
- `clients/{name}/creative/creative-strategy.md` — Messaging, copy, visual direction

**Recommended (warn if missing):**
- `clients/{name}/automation/` — Website sends forms to n8n webhooks

**Read system context:**
- `SYSTEM.md` for architecture
- `system-specs/website-patterns.md` for conversion patterns and site architecture
- `system-specs/integration-patterns.md` for form → n8n → database flow
- `system-specs/credentials-and-setup.md` for tracking pixel setup
- `.build-context.md` for upstream decisions (especially creative direction)
</prerequisites>

<orchestration>
## Process

### Step 1: Determine Website Type
**Agent:** website-architect → **Spec:** system-specs/website-patterns.md

Read brand-config.json `business_model`:
- `brick-and-mortar-primary` or `service-online` → **Service Business Website**
- `ecommerce-primary` → **E-commerce Website**
- `hybrid` → **E-commerce Website** with service booking option

Extract: brand_name, brand_colors, contact info, services/products, tracking IDs, messaging from creative-strategy.md.

### Step 2: Generate Website (business model determines which)

**Service Business Website** — Next.js + TypeScript at `clients/{name}/website/`:
- Pages: Home (hero + services + trust signals + CTA), Services, About, Book Appointment (PRIMARY CONVERSION), Contact, Thank You
- Booking form: name, email, phone, service interest, preferred date/time, message, hidden UTM fields
- Form API routes: server-side validation → n8n webhook POST → success/error response
- If n8n unavailable, still return success to user (graceful degradation)

**E-commerce Website** — Next.js + TypeScript at `clients/{name}/website/`:
- Pages: Home (hero + featured products + brand story), Shop (grid + filters), Category, Product Detail (CONVERSION), Cart, About, Contact
- Shopify Storefront API integration: fetch products/collections, cart operations, checkout redirect
- Optional: Custom consultation form for bespoke work
- Cart: slide-out drawer with quantity adjustment, Shopify checkout URL

**Both types include:**
- Mobile-first responsive design (Tailwind CSS)
- Brand colors applied throughout via CSS custom properties
- Conversion tracking: Google Analytics 4, Google Ads conversion pixel, Meta Pixel
- UTM parameter capture on all conversion events
- SEO: meta tags, Open Graph, structured data (JSON-LD), sitemap, robots.txt
- Actual brand messaging from creative strategy (not lorem ipsum)
- Core Web Vitals targets: LCP <2.5s, FID <100ms, CLS <0.1

### Step 3: Configuration
- `.env.local.example` — Tracking IDs, n8n webhook URL, Shopify credentials (if e-commerce)
- `tailwind.config.ts` — Brand colors, fonts

### Step 4: Documentation
- `website/README.md` — Architecture, setup, form flow, tracking setup, SEO, deployment guide
- `website/DEPLOYMENT.md` — Vercel deployment, environment variables, domain/SSL

### Step 5: Brand Assets
If `clients/{name}/assets/` contains files, copy relevant assets to `website/public/assets/` and reference in components (logo in nav, favicon). If no assets, use placeholders and note in README.

### Step 6: Initialize (Optional)
Ask user if they want to run `npm install`.
</orchestration>

<context_flow>
- Read `.build-context.md` for creative direction and brand voice decisions
- Append website decisions to `.build-context.md` (site type, page structure, form fields, tracking config)
- Update `.manifest.md` with website system state
- Coordinate with n8n Architect: webhook URLs must match what website POSTs to
- Coordinate with Dashboard Architect: visual consistency (brand colors, design patterns)
- Campaign continuity: landing pages should visually match ad creative direction
</context_flow>

<error_handling>
- If required files missing, instruct user to run `/initialize-client` first
- If automation not built, warn that forms won't trigger n8n — website still works, forms gracefully degrade
- Website must start without errors (`npm run dev`)
- All forms must submit successfully
- Conversion tracking pixels must fire exactly once per event
</error_handling>

<completion>
Display: website type built, pages created, components (sections, forms, UI), integrations (n8n, GA4, Google Ads, Meta Pixel, Shopify if applicable), configuration files, local run command, and next steps (add brand assets, configure .env.local, test forms end-to-end, deploy to Vercel).
</completion>
