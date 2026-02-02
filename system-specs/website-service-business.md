# Website Architecture: Service Businesses

## Overview

This specification covers websites for brick-and-mortar and service-based businesses (acupuncture clinics, yoga studios, salons, consulting firms, medical practices, etc.). These businesses require:

- **Primary conversion:** Form submissions (booking appointments, consultations, contact)
- **Secondary conversion:** Newsletter signups, phone calls
- **Key pages:** Services, About, Booking, Contact
- **Integration:** Forms → FastAPI → n8n → Lead scoring → Client notification

**Stack:**
- **Frontend:** Next.js 14+ (TypeScript, App Router)
- **Backend:** FastAPI (Python)
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod validation
- **Deployment:** Vercel (frontend), Railway/Render (backend)

---

## Site Architecture Patterns by Business Type

### Pattern 1: Appointment-Based Services (Acupuncture, Massage, Medical)

**Key Characteristic:** Services require scheduled appointments

**Site Structure:**
```
Home
├─ Hero: Value proposition + primary CTA
├─ Services overview (3-5 key services)
├─ Trust indicators (credentials, testimonials)
├─ Location + hours
└─ CTA: Book Appointment

/services
├─ Detailed service descriptions
├─ What to expect
├─ Pricing (if transparent)
└─ CTA per service: Book This Service

/about
├─ Practitioner/team bios
├─ Credentials & certifications
├─ Philosophy/approach
└─ CTA: Meet Our Team / Book

/book-appointment ← PRIMARY CONVERSION PAGE
├─ Form: name, email, phone, service, date/time preference, message
├─ Visual: Calming imagery matching ad campaigns
├─ Trust: "We'll respond within 24 hours"
└─ Integration: Form → n8n → Lead Scoring → Notification

/contact
├─ Location map
├─ Hours, phone, email
├─ Simple contact form
└─ Parking/accessibility info

Optional:
/blog - SEO + educational content
/faq - Common questions
/resources - Downloadable guides
```

**Conversion Funnel:**
```
Instagram Ad (video-003: calm treatment room)
  ↓
Landing: /book-appointment?source=instagram&campaign=awareness-001
  ↓
User fills booking form
  ↓
Confirmation: "Thanks! We'll call within 24 hours."
  ↓
n8n: Lead Scoring → Hot/Warm/Cold routing
  ↓
Dashboard: New lead alert
```

---

### Pattern 2: Class/Workshop Based (Yoga, Fitness, Cooking Classes)

**Key Characteristic:** Group sessions with schedules

**Site Structure:**
```
Home
/schedule - Weekly class schedule with "Book Now" buttons
/classes - Types of classes offered
/pricing - Memberships, packages, drop-in rates
/book - Registration/booking system
/teachers - Instructor bios
/contact
```

**Unique needs:**
- Calendar/schedule display
- Multi-person booking
- Membership management (optional: integrate with MindBody, ClassPass)
- Trial class signup

---

### Pattern 3: Consultation-Based (Law, Financial, Coaching)

**Key Characteristic:** High-ticket, requires discovery call first

**Site Structure:**
```
Home
/services - Practice areas
/about - Credentials, case results
/resources - Blog, whitepapers
/book-consultation ← PRIMARY CONVERSION
  └─ Detailed form: budget, timeline, specific needs
/testimonials
/contact
```

**Conversion Focus:**
- Qualification questions in form (budget, timeline, urgency)
- High lead score threshold for immediate contact
- Nurture sequence for lower-quality leads

---

## Universal Components (All Service Sites)

### Component 1: Hero Section

**Purpose:** Grab attention, communicate value, drive to primary CTA

**Design Principles:**
- **Above fold:** Hero should be immediately visible
- **Clear value prop:** What you do + who it's for in 10 words or less
- **Visual consistency:** Match ad campaign aesthetic (if user clicked from ad)
- **Single primary CTA:** Don't overwhelm with choices

**Component Structure:**
```typescript
interface HeroProps {
  headline: string;          // "Find Your Calm in Palo Alto"
  subheadline: string;       // "Expert acupuncture & Chinese medicine"
  ctaPrimary: {
    text: string;            // "Book Appointment"
    href: string;            // "/book-appointment"
  };
  ctaSecondary?: {
    text: string;            // "Learn More"
    href: string;            // "#services"
  };
  backgroundImage?: string;  // Hero background
  backgroundVideo?: string;  // Or video background
}

export function Hero({ headline, subheadline, ctaPrimary, ctaSecondary, backgroundImage }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center">
      {/* Background */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" /> {/* Overlay */}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          {headline}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {subheadline}
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button 
            href={ctaPrimary.href}
            size="lg"
            variant="primary"
            className="px-8 py-4 text-lg"
          >
            {ctaPrimary.text}
          </Button>
          
          {ctaSecondary && (
            <Button 
              href={ctaSecondary.href}
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg"
            >
              {ctaSecondary.text}
            </Button>
          )}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white" />
      </div>
    </section>
  );
}
```

**Configuration per Brand:**
```json
{
  "hero": {
    "headline": "Find Your Calm in Palo Alto",
    "subheadline": "Expert acupuncture & Chinese medicine for stress relief and holistic wellness",
    "ctaPrimary": {
      "text": "Book Appointment",
      "href": "/book-appointment"
    },
    "backgroundImage": "/images/hero-treatment-room.jpg",
    "brandColors": {
      "primary": "#2C5F4F",
      "text": "#FFFFFF"
    }
  }
}
```

---

### Component 2: Navigation

**Purpose:** Easy access to key pages, persistent CTA

**Design Principles:**
- **Sticky on scroll:** Always accessible
- **Mobile-first:** Hamburger menu on mobile
- **CTA in nav:** "Book Now" button always visible
- **Simple structure:** 5-7 items max

**Component Structure:**
```typescript
interface NavigationProps {
  logo: string;
  logoAlt: string;
  links: Array<{
    label: string;
    href: string;
  }>;
  ctaButton: {
    text: string;
    href: string;
  };
  brandColors: {
    primary: string;
    text: string;
  };
}

export function Navigation({ logo, logoAlt, links, ctaButton, brandColors }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <img 
              src={logo} 
              alt={logoAlt}
              className="h-12"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            <Button 
              href={ctaButton.href}
              style={{ backgroundColor: brandColors.primary }}
              className="text-white px-6 py-2 rounded-lg"
            >
              {ctaButton.text}
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            {links.map(link => (
              <Link 
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button 
              href={ctaButton.href}
              className="w-full mt-4"
              style={{ backgroundColor: brandColors.primary }}
            >
              {ctaButton.text}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
```

---

### Component 3: Services Showcase

**Purpose:** Overview of key services with visual appeal

**Component Structure:**
```typescript
interface Service {
  name: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  benefits: string[];
  ctaText: string;
  ctaHref: string;
}

interface ServicesShowcaseProps {
  headline: string;
  services: Service[];
}

export function ServicesShowcase({ headline, services }: ServicesShowcaseProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          {headline}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
            >
              {/* Service Image */}
              {service.image && (
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }} />
              )}
              
              {/* Service Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  {service.icon}
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  href={service.ctaHref}
                  variant="outline"
                  className="w-full"
                >
                  {service.ctaText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Configuration Example:**
```json
{
  "servicesShowcase": {
    "headline": "Our Services",
    "services": [
      {
        "name": "Acupuncture",
        "description": "Traditional Chinese acupuncture for pain relief, stress reduction, and holistic wellness.",
        "image": "/images/acupuncture-treatment.jpg",
        "benefits": [
          "Reduces chronic pain",
          "Alleviates stress and anxiety",
          "Improves sleep quality",
          "Boosts immune system"
        ],
        "ctaText": "Book Acupuncture",
        "ctaHref": "/book-appointment?service=acupuncture"
      },
      {
        "name": "Herbal Medicine",
        "description": "Custom herbal formulations tailored to your specific health needs.",
        "image": "/images/herbal-medicine.jpg",
        "benefits": [
          "Natural healing approach",
          "Personalized formulations",
          "Complements acupuncture",
          "Addresses root causes"
        ],
        "ctaText": "Learn More",
        "ctaHref": "/services/herbal-medicine"
      },
      {
        "name": "Cupping Therapy",
        "description": "Ancient technique for muscle tension, inflammation, and circulation.",
        "image": "/images/cupping.jpg",
        "benefits": [
          "Releases muscle tension",
          "Improves circulation",
          "Reduces inflammation",
          "Speeds recovery"
        ],
        "ctaText": "Book Cupping",
        "ctaHref": "/book-appointment?service=cupping"
      }
    ]
  }
}
```

---

### Component 4: Trust Indicators

**Purpose:** Build credibility and overcome objections

**Types:**
1. **Credentials/Certifications:** Logos of certifications, memberships
2. **Testimonials:** Client reviews with photos (if permission)
3. **Social Proof:** "Trusted by 500+ clients in Palo Alto"
4. **Media Mentions:** "As featured in..."
5. **Before/After:** Results (where appropriate/ethical)

**Component Structure:**
```typescript
interface TrustIndicatorsProps {
  credentials?: Array<{
    name: string;
    logo: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role?: string;
    photo?: string;
    rating: number;
  }>;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export function TrustIndicators({ credentials, testimonials, stats }: TrustIndicatorsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Credentials */}
        {credentials && (
          <div className="mb-16">
            <h3 className="text-center text-gray-600 mb-8">Certified & Accredited</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {credentials.map((cred, i) => (
                <img 
                  key={i}
                  src={cred.logo} 
                  alt={cred.name}
                  className="h-16 grayscale hover:grayscale-0 transition"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Testimonials */}
        {testimonials && (
          <div>
            <h3 className="text-3xl font-bold text-center mb-12">
              What Our Clients Say
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard key={i} {...testimonial} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ quote, author, role, photo, rating }: Testimonial) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
      
      {/* Quote */}
      <p className="text-gray-700 mb-4 italic">
        "{quote}"
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-3">
        {photo && (
          <img 
            src={photo}
            alt={author}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-semibold">{author}</div>
          {role && <div className="text-sm text-gray-600">{role}</div>}
        </div>
      </div>
    </div>
  );
}
```

---

### Component 5: Location & Hours

**Purpose:** Make it easy to visit (physical location visibility)

**Component Structure:**
```typescript
interface LocationProps {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: Array<{
    days: string;
    hours: string;
  }>;
  coordinates: {
    lat: number;
    lng: number;
  };
  parkingInfo?: string;
}

export function LocationMap({ name, address, phone, email, hours, coordinates, parkingInfo }: LocationProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Visit Us
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Map */}
          <div className="h-96 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${coordinates.lat},${coordinates.lng}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
          
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">{name}</h3>
              <p className="text-gray-600">{address}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <p className="text-gray-600">
                <Phone className="inline w-4 h-4 mr-2" />
                <a href={`tel:${phone}`} className="hover:text-primary">
                  {phone}
                </a>
              </p>
              <p className="text-gray-600 mt-1">
                <Mail className="inline w-4 h-4 mr-2" />
                <a href={`mailto:${email}`} className="hover:text-primary">
                  {email}
                </a>
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Hours</h4>
              {hours.map((slot, i) => (
                <div key={i} className="flex justify-between text-gray-600 mb-1">
                  <span>{slot.days}</span>
                  <span>{slot.hours}</span>
                </div>
              ))}
            </div>
            
            {parkingInfo && (
              <div>
                <h4 className="font-semibold mb-2">Parking</h4>
                <p className="text-gray-600 text-sm">{parkingInfo}</p>
              </div>
            )}
            
            <Button 
              href="/book-appointment"
              className="w-full"
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## Primary Conversion: Booking Form

### Component: BookingForm

**Purpose:** Capture leads with optimal conversion rate

**Design Principles:**
- **Minimal friction:** Only ask for essential info
- **Progressive disclosure:** Show optional fields after required ones filled
- **Real-time validation:** Show errors immediately
- **Trust signals:** "We respect your privacy" + security badges
- **Visual consistency:** Match brand aesthetic and ad campaigns
- **Mobile-optimized:** Large tap targets, auto-focus, appropriate keyboards

**Component Structure:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone format: (555) 123-4567'),
  service: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().optional(),
  hearAboutUs: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  source?: string;        // URL param: which ad/page led here
  campaign?: string;      // URL param: campaign ID
  services?: string[];    // Available services
  onSuccess?: () => void;
}

export function BookingForm({ source, campaign, services, onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  });
  
  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = {
        source: urlParams.get('utm_source'),
        medium: urlParams.get('utm_medium'),
        campaign: urlParams.get('utm_campaign'),
        content: urlParams.get('utm_content')
      };
      
      // Submit to backend
      const response = await fetch('/api/forms/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: source || 'direct',
          campaign: campaign || 'unknown',
          submittedAt: new Date().toISOString(),
          utmParams,
          referrer: document.referrer
        })
      });
      
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      
      // Fire conversion tracking (Google Ads, Meta Pixel)
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
          'value': 1.0,
          'currency': 'USD'
        });
      }
      
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead');
      }
      
      // Redirect to thank you page
      window.location.href = '/book-appointment/thank-you';
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Something went wrong. Please try again or call us at (650) 555-0123.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Book Your Appointment</h2>
        
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Full Name *
          </label>
          <input
            {...register('name')}
            id="name"
            type="text"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address *
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone Number *
          </label>
          <input
            {...register('phone')}
            id="phone"
            type="tel"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="(650) 555-0123"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        
        {/* Service Selection */}
        {services && services.length > 0 && (
          <div className="mb-4">
            <label htmlFor="service" className="block text-sm font-medium mb-2">
              Service Interest
            </label>
            <select
              {...register('service')}
              id="service"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a service...</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Preferred Date & Time */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium mb-2">
              Preferred Date
            </label>
            <input
              {...register('preferredDate')}
              id="preferredDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium mb-2">
              Preferred Time
            </label>
            <select
              {...register('preferredTime')}
              id="preferredTime"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="">Select time...</option>
              <option value="morning">Morning (9am-12pm)</option>
              <option value="afternoon">Afternoon (12pm-5pm)</option>
              <option value="evening">Evening (5pm-8pm)</option>
            </select>
          </div>
        </div>
        
        {/* Message */}
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Tell us about your wellness goals (optional)
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="e.g., 'I've had chronic lower back pain for 6 months...'"
          />
        </div>
        
        {/* How did you hear about us */}
        <div className="mb-6">
          <label htmlFor="hearAboutUs" className="block text-sm font-medium mb-2">
            How did you hear about us?
          </label>
          <select
            {...register('hearAboutUs')}
            id="hearAboutUs"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">Select...</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="google">Google Search</option>
            <option value="friend">Friend/Family</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{submitError}</p>
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </span>
          ) : (
            'Book My Consultation'
          )}
        </button>
        
        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          We respect your privacy. Your information is secure and will not be shared.
        </p>
      </div>
    </form>
  );
}
```

---

## Backend: Form Handler

### FastAPI Router

```python
# backend/routers/forms.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
import httpx
import os
from datetime import datetime

router = APIRouter(prefix="/api/forms", tags=["forms"])

class BookingFormData(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: Optional[str] = None
    preferredDate: Optional[str] = None
    preferredTime: Optional[str] = None
    message: Optional[str] = None
    hearAboutUs: Optional[str] = None
    source: str
    campaign: str
    submittedAt: str
    utmParams: Optional[dict] = None
    referrer: Optional[str] = None
    
    @validator('phone')
    def validate_phone(cls, v):
        # Basic US phone validation
        import re
        if not re.match(r'^\(\d{3}\) \d{3}-\d{4}$', v):
            raise ValueError('Invalid phone format')
        return v

@router.post("/booking")
async def submit_booking_form(form: BookingFormData):
    """
    Handles booking form submission:
    1. Validate form data (Pydantic does this)
    2. Send to n8n webhook for processing
    3. Return success response
    """
    
    brand_id = os.getenv("BRAND_ID")
    n8n_webhook_url = os.getenv("N8N_WEBHOOK_URL")
    
    try:
        # Send to n8n for processing
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{n8n_webhook_url}/webhook/{brand_id}/form-submission",
                json={
                    "form_type": "booking",
                    "data": form.dict(),
                    "timestamp": datetime.now().isoformat()
                },
                timeout=10.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to process submission")
        
        return {
            "success": True,
            "message": "Thank you! We'll contact you within 24 hours."
        }
        
    except httpx.TimeoutException:
        # Log error but don't fail - queue for retry
        print(f"n8n webhook timeout for form submission: {form.email}")
        
        # TODO: Queue in Redis/database for retry
        
        return {
            "success": True,
            "message": "Thank you! We'll contact you within 24 hours."
        }
        
    except Exception as e:
        print(f"Form submission error: {e}")
        raise HTTPException(status_code=500, detail="Submission failed")


@router.post("/newsletter")
async def submit_newsletter_form(email: EmailStr, source: str = "website"):
    """
    Newsletter signup - simpler, just email
    """
    brand_id = os.getenv("BRAND_ID")
    n8n_webhook_url = os.getenv("N8N_WEBHOOK_URL")
    
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{n8n_webhook_url}/webhook/{brand_id}/newsletter-signup",
            json={
                "email": email,
                "source": source,
                "timestamp": datetime.now().isoformat()
            }
        )
    
    return {"success": True}


@router.post("/contact")
async def submit_contact_form(
    name: str,
    email: EmailStr,
    subject: str,
    message: str
):
    """
    Simple contact form
    """
    brand_id = os.getenv("BRAND_ID")
    n8n_webhook_url = os.getenv("N8N_WEBHOOK_URL")
    
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{n8n_webhook_url}/webhook/{brand_id}/contact-form",
            json={
                "form_type": "contact",
                "name": name,
                "email": email,
                "subject": subject,
                "message": message,
                "timestamp": datetime.now().isoformat()
            }
        )
    
    return {
        "success": True,
        "message": "Thank you for contacting us. We'll respond within 1 business day."
    }
```

---

## Thank You Page

### Component: ThankYouPage

**Purpose:** Confirm submission, set expectations, provide next steps

```typescript
// app/book-appointment/thank-you/page.tsx

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          Thank You for Booking!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          We've received your appointment request and will contact you within 24 hours 
          to confirm your preferred date and time.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">What Happens Next?</h2>
          <ol className="text-left space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
              <span>We'll review your information and call you to confirm your appointment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
              <span>You'll receive a confirmation email with appointment details</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
              <span>We'll send a reminder 24 hours before your appointment</span>
            </li>
          </ol>
        </div>
        
        <div className="border-t pt-6">
          <p className="text-gray-600 mb-4">
            Have questions before your appointment?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:(650) 555-0123"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <a 
            href="/"
            className="text-primary hover:underline"
          >
            ← Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## Additional Components

### Newsletter Signup

**Purpose:** Low-friction lead capture for users not ready to book

```typescript
interface NewsletterSignupProps {
  inline?: boolean;  // Inline in page vs. modal popup
}

export function NewsletterSignup({ inline = true }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/forms/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'website-newsletter' })
      });
      
      if (!response.ok) throw new Error();
      
      setStatus('success');
      setEmail('');
      
      // Fire conversion pixel for newsletter signup
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Subscribe');
      }
      
    } catch (error) {
      setStatus('error');
    }
  };
  
  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <Check className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <p className="text-green-800 font-medium">Thanks for subscribing!</p>
      </div>
    );
  }
  
  return (
    <div className={inline ? 'bg-gray-50 rounded-lg p-6' : ''}>
      <h3 className="font-semibold text-lg mb-2">
        Stay Updated
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Get wellness tips and special offers delivered to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {status === 'error' && (
        <p className="text-red-600 text-sm mt-2">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
```

---

## Site Configuration File

**Location:** `/clients/{brand-name}/website/config.json`

```json
{
  "brand_name": "Zen Med Clinic",
  "brand_id": "zen-med-clinic",
  "tagline": "Holistic Wellness Through Chinese Medicine",
  "business_model": "brick-and-mortar-primary",
  
  "contact": {
    "phone": "(650) 555-0123",
    "email": "hello@zenmedclinic.com",
    "address": "123 University Ave, Palo Alto, CA 94301",
    "coordinates": {
      "lat": 37.4419,
      "lng": -122.1430
    }
  },
  
  "hours": [
    {"days": "Monday - Friday", "hours": "9:00 AM - 7:00 PM"},
    {"days": "Saturday", "hours": "10:00 AM - 4:00 PM"},
    {"days": "Sunday", "hours": "Closed"}
  ],
  
  "services": [
    {
      "name": "Acupuncture",
      "slug": "acupuncture",
      "description": "Traditional Chinese acupuncture for pain relief, stress reduction, and holistic wellness.",
      "benefits": ["Reduces chronic pain", "Alleviates stress", "Improves sleep", "Boosts immunity"]
    },
    {
      "name": "Herbal Medicine",
      "slug": "herbal-medicine",
      "description": "Custom herbal formulations tailored to your specific health needs.",
      "benefits": ["Natural healing", "Personalized formulas", "Complements acupuncture", "Root cause treatment"]
    },
    {
      "name": "Cupping Therapy",
      "slug": "cupping",
      "description": "Ancient technique for muscle tension, inflammation, and circulation.",
      "benefits": ["Releases tension", "Improves circulation", "Reduces inflammation", "Speeds recovery"]
    }
  ],
  
  "brand_colors": {
    "primary": "#2C5F4F",
    "secondary": "#8ABAAA",
    "accent": "#E8D5B7",
    "text": "#2C2C2C"
  },
  
  "logo": "/assets/logo.svg",
  "favicon": "/assets/favicon.ico",
  
  "social_media": {
    "instagram": "https://instagram.com/zenmedclinic",
    "facebook": "https://facebook.com/zenmedclinic"
  },
  
  "seo": {
    "title": "Zen Med Clinic | Acupuncture & Chinese Medicine in Palo Alto",
    "description": "Expert acupuncture, herbal medicine, and holistic wellness services in Palo Alto. Trusted by 500+ clients for stress relief, pain management, and preventive care.",
    "keywords": ["acupuncture palo alto", "chinese medicine", "holistic wellness", "stress relief", "pain management"]
  },
  
  "tracking": {
    "google_analytics": "G-XXXXXXXXXX",
    "google_ads_conversion_id": "AW-XXXXXXXXXX",
    "meta_pixel_id": "XXXXXXXXXX"
  }
}
```

---

## Deployment

### Frontend (Vercel)

```bash
# In website/frontend/
npm install
npm run build
vercel deploy --prod
```

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://api.zenmedclinic.com
NEXT_PUBLIC_BRAND_ID=zen-med-clinic
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Backend (Railway/Render)

```bash
# In website/backend/
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Environment Variables:**
```
BRAND_ID=zen-med-clinic
N8N_WEBHOOK_URL=https://n8n.yourserver.com
SENDGRID_API_KEY=xxxxx  # For sending emails
```

---

## SEO & Performance

### SEO Optimization

**1. Meta Tags:**
```typescript
// app/layout.tsx
export const metadata = {
  title: 'Zen Med Clinic | Acupuncture & Chinese Medicine in Palo Alto',
  description: 'Expert acupuncture, herbal medicine, and holistic wellness services in Palo Alto. Trusted by 500+ clients for stress relief, pain management, and preventive care.',
  keywords: 'acupuncture palo alto, chinese medicine, holistic wellness, stress relief, pain management',
  openGraph: {
    title: 'Zen Med Clinic | Acupuncture & Chinese Medicine',
    description: 'Expert acupuncture and holistic wellness in Palo Alto',
    images: ['/images/og-image.jpg'],
  }
}
```

**2. Structured Data (Schema.org):**
```typescript
// components/StructuredData.tsx
export function LocalBusinessSchema({ config }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": config.brand_name,
    "description": config.seo.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config.contact.address.split(',')[0],
      "addressLocality": "Palo Alto",
      "addressRegion": "CA",
      "postalCode": "94301"
    },
    "telephone": config.contact.phone,
    "openingHours": config.hours.map(h => h.hours),
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": config.contact.coordinates.lat,
      "longitude": config.contact.coordinates.lng
    },
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**3. Sitemap:**
```typescript
// app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://zenmedclinic.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://zenmedclinic.com/services',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://zenmedclinic.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://zenmedclinic.com/book-appointment',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
```

### Performance Optimization

**1. Image Optimization:**
- Use Next.js Image component
- Lazy load images below fold
- Serve WebP format with fallback
- Proper sizing (don't serve 4K images for thumbnails)

**2. Code Splitting:**
- Dynamic imports for heavy components
- Route-based splitting (Next.js does automatically)

**3. Caching:**
- Static pages cached at CDN (Vercel Edge)
- API responses cached appropriately
- Service worker for offline support (optional)

---

## Conversion Tracking

### Google Ads Conversion Pixel

```typescript
// app/book-appointment/thank-you/page.tsx
useEffect(() => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
      'value': 500,  // Average appointment value
      'currency': 'USD'
    });
  }
}, []);
```

### Meta Pixel

```typescript
// app/book-appointment/thank-you/page.tsx
useEffect(() => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'Lead', {
      value: 500,
      currency: 'USD',
      content_name: 'Appointment Booking'
    });
  }
}, []);
```

---

## Testing Checklist

**Before Launch:**
- [ ] All forms submit successfully
- [ ] Form validation works (try invalid emails, phones)
- [ ] Thank you page displays after submission
- [ ] n8n receives webhook (check n8n execution logs)
- [ ] Lead appears in Neo4j
- [ ] Dashboard shows new lead
- [ ] Conversion pixels fire (check via browser dev tools)
- [ ] Mobile responsive (test on actual devices)
- [ ] Load time < 3 seconds (test with Lighthouse)
- [ ] All links work (no 404s)
- [ ] Contact info correct everywhere
- [ ] Google Maps embed works
- [ ] Images load properly
- [ ] SSL certificate valid (https)