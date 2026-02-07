---
name: build-website
description: Builds complete customer-facing website (service business or e-commerce) with conversion tracking and n8n integration
---

# Build Website Command

Creates a complete, conversion-optimized website based on the client's business model. Service businesses get a booking/contact-focused site. E-commerce businesses get a Shopify-integrated product site. Both include conversion tracking, form validation, and n8n webhook integration.

## Input

**Required arguments (passed as $ARGUMENTS):**
- `name=brand-name` — The brand slug matching the client directory name

**Parse $ARGUMENTS to extract the `name` value.**

If `name` is missing, stop and ask the user for it.

## Validation

Before proceeding, verify:

**Required files:**
- `clients/{name}/brand-config.json` — Brand identity, business model, services, colors
- `clients/{name}/research/brand-profile.md` — Brand voice, visual direction, audience insights
- `clients/{name}/creative/creative-strategy.md` — Messaging, copy, visual direction

**Recommended (warn if missing):**
- `clients/{name}/n8n/workflows/07-form-ingestion.json` — Website sends forms to n8n
- `clients/{name}/automation/prompts/` — Lead scoring depends on these

If required files are missing, instruct the user to run `/initialize-client name={name}` first.
If automation is missing, warn that form submissions won't be processed until `/build-automation` is run. The website will still work — forms will submit but won't trigger n8n workflows.

## Process

Set the base paths:
```
FACTORY_ROOT = /Users/jaronarmiger/HELIANTHES/OEUVRE/Droom/marketing-factory
CLIENT_DIR = {FACTORY_ROOT}/clients/{name}
SPECS_DIR = /Users/jaronarmiger/HELIANTHES/OEUVRE/Droom/system-specs
AGENTS_DIR = {FACTORY_ROOT}/.claude/agents
```

---

### Step 1: Read Configuration & Determine Website Type

**Read the agent definition:** `{AGENTS_DIR}/website-architect.md`

**Read the relevant system specs:**
- `{SPECS_DIR}/website-service-business.md` (if service business)
- `{SPECS_DIR}/website-ecommerce.md` (if e-commerce)
- `{SPECS_DIR}/integration-flows.md` — How website communicates with n8n
- `{SPECS_DIR}/analytics-setup.md` — Conversion tracking setup

**Read input files:**
- `{CLIENT_DIR}/brand-config.json`
- `{CLIENT_DIR}/research/brand-profile.md`
- `{CLIENT_DIR}/creative/creative-strategy.md`

**Determine website type from `business_model`:**
- `brick-and-mortar-primary` → **Service Business Website**
- `service-online` → **Service Business Website**
- `ecommerce-primary` → **E-commerce Website**
- `hybrid` → **E-commerce Website** with service booking option

**Extract from brand-config.json:**
- `brand_name`, `brand_id`, `tagline`
- `brand_colors` (primary, secondary, accent)
- `contact` (phone, email, address, coordinates, hours)
- `services` or `products` (what they offer)
- `business_model` and `service_delivery_model`
- `tracking` (Google Analytics ID, Google Ads conversion ID, Meta Pixel ID)

**Extract from brand-profile.md:**
- Brand voice and tone
- Visual brand direction
- Trust signals (testimonials, credentials, years in business)
- Unique value propositions

**Extract from creative-strategy.md:**
- Messaging hierarchy (primary message, supporting messages)
- Ad copy samples (adapt for website copy)
- Visual direction (photography style, color usage)

---

### Step 2: Generate Service Business Website

**Only if business_model is `brick-and-mortar-primary` or `service-online`.**

Create a Next.js + TypeScript application at `{CLIENT_DIR}/website/`.

#### Directory Structure:
```
website/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .env.local.example
├── app/
│   ├── layout.tsx                # Root layout: nav, footer, tracking scripts
│   ├── page.tsx                  # Home page (hero, services, trust, CTA)
│   ├── services/
│   │   └── page.tsx              # Services overview with details
│   ├── about/
│   │   └── page.tsx              # About page (story, team, credentials)
│   ├── book-appointment/
│   │   ├── page.tsx              # Booking form (PRIMARY CONVERSION)
│   │   └── thank-you/
│   │       └── page.tsx          # Thank you page with conversion tracking
│   ├── contact/
│   │   └── page.tsx              # Contact page (map, phone, email, form)
│   └── api/
│       └── forms/
│           ├── booking/
│           │   └── route.ts      # POST handler: validate, send to n8n, respond
│           ├── contact/
│           │   └── route.ts      # POST handler: validate, send to n8n, respond
│           └── newsletter/
│               └── route.ts      # POST handler: add to email list
├── components/
│   ├── sections/
│   │   ├── Hero.tsx              # Full-width hero with headline + CTA
│   │   ├── ServicesShowcase.tsx   # Service cards with descriptions
│   │   ├── TrustIndicators.tsx   # Reviews, credentials, years in business
│   │   ├── Testimonials.tsx      # Customer testimonials
│   │   ├── LocationHours.tsx     # Map embed, address, hours
│   │   ├── FAQ.tsx               # Common questions
│   │   └── CTABanner.tsx         # Call-to-action banner
│   ├── forms/
│   │   ├── BookingForm.tsx       # Multi-field booking form with validation
│   │   ├── ContactForm.tsx       # Simple contact form
│   │   └── NewsletterSignup.tsx  # Email capture
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   └── PhoneInput.tsx
│   └── layout/
│       ├── Navigation.tsx        # Sticky nav with mobile hamburger
│       └── Footer.tsx            # Footer with links, contact, social
├── lib/
│   ├── types.ts                  # TypeScript types
│   ├── validation.ts             # Zod schemas for form validation
│   ├── tracking.ts               # GA4 + Meta Pixel + Google Ads conversion events
│   └── n8n.ts                    # n8n webhook client (server-side only)
└── public/
    ├── assets/                   # Brand assets (copy from client assets)
    └── favicon.ico
```

#### Key Implementation Details:

**Home Page (app/page.tsx):**
- Hero section: Headline from messaging hierarchy, subheadline, primary CTA button ("Book Now" / "Schedule Consultation")
- Services showcase: Cards for each service from brand-config
- Trust indicators: Reviews count, credentials, years in business
- Testimonials section (if available from research)
- Location & hours section with embedded map
- Bottom CTA banner repeating primary conversion action
- Mobile-responsive throughout

**Booking Form (components/forms/BookingForm.tsx):**
- Fields: Name, Email, Phone, Service Interest (dropdown from services list), Preferred Date/Time, Message
- Client-side validation with Zod schemas
- Accessible (proper labels, ARIA attributes, error messages)
- Loading state during submission
- Success state with thank-you message
- UTM parameter capture (hidden fields: utm_source, utm_medium, utm_campaign)

**Form API Route (app/api/forms/booking/route.ts):**
- Server-side validation (never trust client)
- Send form data to n8n webhook: `POST {N8N_WEBHOOK_URL}/form-submission`
  ```json
  {
    "brand_id": "{brand-id}",
    "form_type": "booking",
    "name": "...",
    "email": "...",
    "phone": "...",
    "service_interest": "...",
    "message": "...",
    "utm_source": "...",
    "utm_medium": "...",
    "utm_campaign": "...",
    "submitted_at": "ISO timestamp",
    "referrer": "..."
  }
  ```
- Return success/error response
- If n8n webhook fails, still return success to user (log error, queue for retry)

**Conversion Tracking (lib/tracking.ts):**
```typescript
// Google Analytics 4
export function trackGA4Event(eventName: string, params: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// Google Ads Conversion
export function trackGoogleAdsConversion(conversionId: string, conversionLabel: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`,
    });
  }
}

// Meta Pixel
export function trackMetaPixelEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
}

// Fire all on form submission
export function trackFormSubmission(formType: string) {
  trackGA4Event('form_submission', { form_type: formType });
  trackGoogleAdsConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID!, 'form_submit');
  trackMetaPixelEvent('Lead', { content_name: formType });
}
```

**Thank You Page (app/book-appointment/thank-you/page.tsx):**
- Fires conversion tracking events on mount
- Confirmation message
- Next steps for the client
- Link back to homepage

**SEO:**
- Proper `<title>` and `<meta description>` on every page
- Open Graph tags for social sharing
- Structured data (JSON-LD) for local business schema
- Sitemap generation
- robots.txt

---

### Step 3: Generate E-commerce Website

**Only if business_model is `ecommerce-primary` or `hybrid`.**

Create a Next.js + TypeScript application at `{CLIENT_DIR}/website/`.

#### Directory Structure:
```
website/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .env.local.example
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Home page (hero, featured products, story)
│   ├── shop/
│   │   ├── page.tsx              # Product grid with filters
│   │   └── [category]/
│   │       └── page.tsx          # Category page
│   ├── product/
│   │   └── [slug]/
│   │       └── page.tsx          # Product detail (CONVERSION)
│   ├── cart/
│   │   └── page.tsx              # Shopping cart
│   ├── about/
│   │   └── page.tsx              # Brand story
│   ├── custom-consultation/
│   │   ├── page.tsx              # Custom order inquiry form
│   │   └── thank-you/
│   │       └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   └── api/
│       ├── shopify/
│       │   ├── products/
│       │   │   └── route.ts      # Fetch products from Shopify Storefront API
│       │   └── cart/
│       │       └── route.ts      # Cart operations via Shopify
│       └── forms/
│           └── custom-consultation/
│               └── route.ts      # Custom inquiry → n8n
├── components/
│   ├── product/
│   │   ├── ProductGrid.tsx       # Responsive product grid
│   │   ├── ProductCard.tsx       # Product card with image, price, quick-add
│   │   ├── ProductDetail.tsx     # Full product view with images, description, add-to-cart
│   │   ├── ProductGallery.tsx    # Image gallery with zoom
│   │   └── AddToCart.tsx         # Add to cart button with quantity
│   ├── cart/
│   │   ├── CartDrawer.tsx        # Slide-out cart drawer
│   │   ├── CartItem.tsx          # Individual cart item
│   │   └── CartSummary.tsx       # Subtotal, checkout button
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── BrandStory.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTABanner.tsx
│   ├── forms/
│   │   └── CustomConsultationForm.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── PriceDisplay.tsx
│   └── layout/
│       ├── Navigation.tsx        # Nav with cart icon + count
│       └── Footer.tsx
├── lib/
│   ├── shopify.ts                # Shopify Storefront API client (GraphQL)
│   ├── types.ts
│   ├── validation.ts
│   ├── tracking.ts               # Same tracking as service + purchase events
│   ├── n8n.ts
│   └── cart-context.tsx          # React context for cart state
└── public/
    └── assets/
```

#### Key Implementation Details:

**Shopify Integration (lib/shopify.ts):**
- Use Shopify Storefront API (GraphQL)
- Fetch products, collections, product details
- Cart operations (create cart, add/remove items, get checkout URL)
- Product images, variants, pricing

**Product Detail (app/product/[slug]/page.tsx):**
- Product image gallery
- Title, description, price
- Variant selection (size, color, etc.)
- Add to cart button
- Related products
- Conversion tracking on add-to-cart

**Cart (components/cart/CartDrawer.tsx):**
- Slide-out drawer (not a full page) for quick access
- Cart items with quantity adjustment
- Subtotal calculation
- "Checkout" button → Shopify checkout URL
- Track checkout initiation

**Purchase Tracking:**
```typescript
// Track add to cart
export function trackAddToCart(product: Product, quantity: number) {
  trackGA4Event('add_to_cart', {
    currency: 'USD',
    value: product.price * quantity,
    items: [{ item_id: product.id, item_name: product.title, price: product.price, quantity }]
  });
  trackMetaPixelEvent('AddToCart', {
    content_ids: [product.id],
    content_type: 'product',
    value: product.price * quantity,
    currency: 'USD'
  });
}

// Track checkout initiation
export function trackBeginCheckout(cart: CartItem[]) {
  trackGA4Event('begin_checkout', {
    currency: 'USD',
    value: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    items: cart.map(item => ({ item_id: item.id, item_name: item.title, price: item.price, quantity: item.quantity }))
  });
  trackMetaPixelEvent('InitiateCheckout', {
    content_ids: cart.map(item => item.id),
    num_items: cart.length,
    value: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    currency: 'USD'
  });
}
```

---

### Step 4: Shared Configuration (Both Website Types)

**`.env.local.example`:**
```
# API & Webhooks
NEXT_PUBLIC_SITE_URL=http://localhost:3000
N8N_WEBHOOK_URL=https://n8n.yourserver.com/webhook/{brand-id}
N8N_API_KEY=

# Tracking
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX

# Shopify (e-commerce only)
NEXT_PUBLIC_SHOPIFY_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=
```

**`tailwind.config.ts`:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '{primary_color}',
          secondary: '{secondary_color}',
          accent: '{accent_color}',
        }
      },
      fontFamily: {
        // Brand-appropriate fonts
      }
    }
  },
  plugins: [],
}
export default config
```

---

### Step 5: Create Documentation

**`{CLIENT_DIR}/website/README.md`:**
- Website overview and architecture
- Pages and their purposes
- Development setup instructions
- Environment variable configuration
- Form submission flow (website → n8n → Neo4j → dashboard)
- Conversion tracking setup (GA4, Google Ads, Meta Pixel)
- SEO configuration
- Deployment guide (Vercel recommended)
- Testing checklist

**`{CLIENT_DIR}/website/DEPLOYMENT.md`:**
- Vercel deployment steps
- Environment variables for production
- Custom domain setup
- SSL/HTTPS configuration
- Post-deployment testing checklist

---

### Step 6: Copy Brand Assets

If `{CLIENT_DIR}/assets/` contains files:
- Copy relevant assets to `{CLIENT_DIR}/website/public/assets/`
- Reference them in components (logo in nav, favicon, etc.)

If no assets exist, use placeholder references and note in README that assets need to be added.

---

### Step 7: Initialize Project (Optional)

Ask the user if they want to install dependencies:

**If yes:**
```bash
cd {CLIENT_DIR}/website
npm install
```

**If no:** Note in output that `npm install` needs to be run before development.

## Output

After completion, display:

```
Website Built: {brand_name}
============================

  Type: {Service Business Website | E-commerce Website}

  Pages
  -----
  [x] Home page (hero, services/products, trust indicators, CTA)
  [x] {Services | Shop} page
  [x] About page
  [x] {Book Appointment | Cart} page
  [x] Contact page
  [x] Thank You page (with conversion tracking)
  {if ecommerce: [x] Product detail pages}
  {if ecommerce: [x] Category pages}
  {if hybrid: [x] Custom consultation form}

  Components
  ----------
  [x] {N} section components
  [x] {N} form components (with Zod validation)
  [x] {N} UI components
  [x] Navigation + Footer

  Integrations
  ------------
  [x] n8n webhook integration (form submissions)
  [x] Google Analytics 4 tracking
  [x] Google Ads conversion tracking
  [x] Meta Pixel tracking
  {if ecommerce: [x] Shopify Storefront API}

  Configuration
  -------------
  [x] .env.local.example
  [x] tailwind.config.ts (brand colors applied)
  [x] README.md + DEPLOYMENT.md

  Run Locally
  -----------
  cd clients/{name}/website && npm install && npm run dev
  Open http://localhost:3000

  Next Steps:
  1. Add brand assets to clients/{name}/website/public/assets/
  2. Configure .env.local with tracking IDs and n8n webhook URL
  3. Customize content/copy as needed
  4. Test form submissions end-to-end
  5. Deploy to Vercel
```

## Notes

- The website type is automatically determined from `business_model` in brand-config.json
- All forms integrate with n8n via webhooks — the website → n8n → Neo4j pipeline must work
- Conversion tracking is critical — every form submission and purchase should fire GA4 + Meta Pixel events
- The website should be mobile-first and load in under 3 seconds
- Use brand colors and voice throughout — this is a client-facing asset
- SEO is important — include proper meta tags, structured data, and sitemap
- All form API routes validate server-side (never trust client input)
- If n8n webhook is unavailable, forms should still work (graceful degradation)
- Copy should come from creative strategy — use actual brand messaging, not lorem ipsum
- Follow the system specs for service business vs e-commerce architecture
