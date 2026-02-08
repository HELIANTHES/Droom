# Website Patterns

<purpose>
The website is the client's primary conversion surface — where ad traffic converts into leads (service businesses) or purchases (e-commerce). The website-architect agent builds a Next.js (TypeScript, App Router) frontend + FastAPI (Python) backend, styled with Tailwind CSS, deployed on Vercel + Railway/Render.

The `business_model` field in brand-config.json determines which type of site to build. Every website integrates with n8n for conversion tracking and lead/purchase attribution.
</purpose>

---

<design_principles>
## Design Principles

- **Conversion-first architecture** — Every page exists to move visitors toward the primary conversion action. No decorative pages without a clear CTA path.
- **Campaign continuity** — Landing pages must visually and tonally match the ad creative that brought the visitor. Colors, imagery, and messaging should feel like a continuation, not a new experience.
- **Trust before action** — Credentials, testimonials, guarantees, and social proof must appear before or alongside conversion forms. The harder the ask (booking, purchase), the more trust signals needed.
- **Progressive engagement** — Home page → category/service overview → detail page → conversion action. Each step reveals more detail and builds more confidence.
- **Mobile-first forms** — All conversion forms must be thumb-friendly, auto-fill compatible, and minimal (only essential fields). Every extra field reduces conversion rate.
- **Attribution baked in** — UTM parameters, campaign IDs, and source tracking captured on every conversion. Forms submit to FastAPI → n8n webhook. Without attribution, the entire automation system is blind.
- **Speed is conversion** — Target <2 second load time. Lazy-load images, optimize fonts, minimize JavaScript bundle. Slow sites kill conversion rates.
</design_principles>

---

<patterns>
## Site Architecture by Business Model

### Service Business (`brick-and-mortar-primary`, `service-online`)
**Primary conversion:** Form submissions (booking appointments, consultations, contact requests)
**Secondary conversion:** Newsletter signups, phone calls

**Core pages:**
- **Home** — Value proposition hero + primary CTA, 3-5 key services overview, trust indicators (credentials, testimonials), location + hours
- **Services** — Detailed service descriptions, what to expect, pricing (if transparent), per-service CTAs
- **About** — Practitioner/team bios, credentials & certifications, philosophy, brand story
- **Book/Contact** — PRIMARY CONVERSION PAGE. Form: name, email, phone, service interest, date/time preference, message. Visual calm matching ad campaigns. Trust signals. Integration: form → FastAPI → n8n → lead scoring → notification
- **Contact** — Location map, hours, phone, email, parking/accessibility

**Optional pages:** Blog (SEO), FAQ, Resources (downloadable guides)

**Service sub-patterns:**
- Appointment-based (clinic, salon, medical): Emphasize scheduling, practitioner credentials, "what to expect" content
- Class/workshop-based (yoga, fitness): Emphasize schedule/calendar, class descriptions, pricing packages
- Consultation-based (law, financial, coaching): Emphasize expertise, case studies, free consultation offer

**Conversion funnel:**
Ad (platform + campaign ID) → Landing page with UTM params → Form submission → Thank you page with confirmation → n8n lead scoring → Dashboard alert + client notification

### E-commerce (`ecommerce-primary`)
**Primary conversion:** Product purchases (via Shopify Storefront API)
**Secondary conversion:** Email capture, custom consultation bookings (for bespoke work)

**Core pages:**
- **Home** — Lifestyle hero imagery + "Shop Collection" CTA, featured products (3-5 hero items), category overview, social proof (Instagram feed, testimonials), trust badges
- **Shop** (`/shop`) — Product grid with filters (category, price, material, style), sort options, pagination
- **Category** (`/shop/[category]`) — Category landing page with filtered grid, SEO content
- **Product Detail** (`/product/[slug]`) — Image gallery (4-8 high-res, zoom), product details (price, materials, dimensions), variant selector, add to cart, trust signals (shipping, returns, warranty), description, care instructions, related products, reviews
- **Cart** (`/cart`) — Cart items with thumbnails, quantity adjustment, promo code, totals, checkout button → Shopify checkout
- **About** — Brand story, craftsmanship, artisan bios, values

**Optional pages:** Custom consultation form (for bespoke/custom work → lead scoring), blog, lookbook/gallery

**E-commerce sub-patterns:**
- Jewelry/luxury: Heavy on visual presentation, trust signals (certifications, guarantees), custom/bespoke options, high-ticket psychology
- Fashion/apparel: Size guides, styling suggestions, outfit collections, seasonal campaigns
- Artisan/handmade: Maker story emphasis, process documentation, limited edition urgency

**Purchase attribution flow:**
Shopify webhook (order created) → FastAPI validates signature → Match customer email to Lead in Neo4j → Create Purchase node → Trace attribution: Purchase → Campaign → Content → Update ROAS metrics

### Hybrid (`hybrid`)
All features from both models. E-commerce for products + booking forms for services. Toggle between revenue and lead KPIs in dashboard.
</patterns>

---

<interfaces>
## Integration Points

**Form submissions (service business):**
- Frontend form → POST to FastAPI `/api/forms/submit`
- FastAPI validates, stores, forwards to n8n webhook
- n8n runs lead scoring → routes by tier → notifies client → updates dashboard
- UTM params and campaign ID captured from URL query parameters, submitted with form data

**Shopify integration (e-commerce):**
- Frontend uses Shopify Storefront API (GraphQL) for product data, cart management
- Checkout handled by Shopify (redirect or embedded)
- Shopify sends order webhook → FastAPI `/api/webhooks/shopify` → n8n → purchase attribution
- Product data cached to reduce Storefront API calls

**Conversion tracking pixels:**
- Google Ads conversion pixel: fires on thank you page (service) or purchase confirmation (e-commerce)
- Meta Pixel: fires on page view (all pages), lead event (form submit), purchase event (Shopify order)
- Both pixels receive dynamic values (conversion value, campaign ID) for attribution

**Backend (FastAPI):**
- Form processing endpoints with validation
- Shopify webhook receiver with signature verification
- Conversion tracking event endpoints
- Environment variables: SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN, SHOPIFY_WEBHOOK_SECRET, N8N_WEBHOOK_URL, BRAND_ID
</interfaces>

---

<constraints>
## Constraints

- All forms must capture UTM parameters from URL — without this, attribution is broken
- Shopify Storefront API access token must be scoped to read-only product/collection data
- Webhook signatures must be verified before processing (Shopify HMAC validation)
- Form submissions must validate server-side (never trust client-only validation)
- Image optimization required: WebP format, responsive srcset, lazy loading below fold
- Target: <2 second initial load, <1 second subsequent navigation
- HTTPS required on all pages
- Cookie consent banner required (GDPR/CCPA compliance)
- Mobile viewport must be primary design target
</constraints>

---

<quality_criteria>
## Quality Criteria

- Every page must have a clear, visible CTA
- Booking/contact form must work on mobile without horizontal scrolling
- Form validation must show inline errors, not page-level alerts
- Thank you page must confirm the action and set expectations ("We'll call within 24 hours")
- Product images must load progressively (blur-up or skeleton)
- Cart must persist across page navigations (Shopify cart API or local state)
- 404 page must redirect to useful content, not dead-end
- All pages must pass Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- Conversion tracking must fire exactly once per conversion event
- Site must be accessible (WCAG 2.1 AA): keyboard navigation, screen reader support, color contrast
</quality_criteria>

---

<reference_examples>
## Deployment

**Frontend (Vercel):** `vercel deploy --prod`. Environment variables: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_BRAND_ID, NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN (if e-commerce), NEXT_PUBLIC_GOOGLE_ADS_ID, NEXT_PUBLIC_META_PIXEL_ID.

**Backend (Railway/Render):** Docker or platform CLI. Environment variables: SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN, SHOPIFY_WEBHOOK_SECRET, N8N_WEBHOOK_URL, BRAND_ID, NEO4J_URI (for direct attribution queries).

**Cost:** Vercel free tier or $20/month. Backend $5-20/month. Shopify plan separate (client's own account).
</reference_examples>
