import Link from "next/link";
import Image from "next/image";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { services } from "@/lib/data/services";
import { conditions } from "@/lib/data/conditions";

export default function HomePage() {
  return (
    <>
      {/* ── Video Hero ── */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/entrance.webp"
        >
          <source src="/walkthrough.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 content-width pb-20 md:pb-28 text-white">
          <p className="label text-white/60 mb-4">Grayslake, Illinois</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif max-w-2xl mb-6">
            Proven results when nothing else has worked
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-lg mb-10 font-light">
            The highest-credentialed TCM doctor in Lake County.
            Seven modalities. Documented outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/book"
              className="bg-accent hover:bg-accent-dark text-white px-8 py-3.5 text-sm tracking-label uppercase text-center transition-colors"
            >
              Book a Consultation
            </Link>
            <Link
              href="/services"
              className="border border-white/30 hover:border-white/60 text-white px-8 py-3.5 text-sm tracking-label uppercase text-center transition-colors"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── Credential Strip ── */}
      <section className="bg-primary text-white">
        <div className="content-width py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-white/20 text-center">
            <div className="md:px-8">
              <p className="text-3xl md:text-4xl font-serif mb-1">DACM</p>
              <p className="text-sm text-white/70">Highest TCM credential</p>
            </div>
            <div className="md:px-8">
              <p className="text-3xl md:text-4xl font-serif mb-1">44</p>
              <p className="text-sm text-white/70">Five-star reviews</p>
            </div>
            <div className="md:px-8">
              <p className="text-3xl md:text-4xl font-serif mb-1">7</p>
              <p className="text-sm text-white/70">Therapeutic modalities</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Introduction ── */}
      <section className="section-y">
        <div className="content-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="label mb-4">Our approach</p>
              <h2 className="text-3xl md:text-5xl font-serif text-secondary mb-6">
                Medicine that listens first
              </h2>
              <p className="text-secondary-light leading-relaxed mb-6">
                Every patient receives a thorough consultation, a hands-on evaluation,
                and a clear explanation before any treatment begins. Dr. Vel combines
                seven therapeutic modalities into a plan built specifically for your
                condition — not a one-size-fits-all protocol.
              </p>
              <Link
                href="/about"
                className="text-primary hover:text-primary-dark text-sm tracking-label uppercase transition-colors"
              >
                About Dr. Vel &rarr;
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/vel-headshot.jpg"
                alt="Dr. Vel Natarajan consulting with a patient"
                fill
                className="img-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Full-bleed Moxibustion Image ── */}
      <section className="relative h-[50vh] min-h-[400px]">
        <Image
          src="/hero-2.jpg"
          alt="Moxibustion treatment — gentle heat therapy"
          fill
          className="img-cover"
        />
      </section>

      {/* ── Services ── */}
      <section className="section-y">
        <div className="content-width">
          <div className="text-center mb-16">
            <p className="label mb-4">Services</p>
            <h2 className="text-3xl md:text-5xl font-serif text-secondary mb-4">
              Seven modalities, one practitioner
            </h2>
            <p className="text-secondary-light max-w-xl mx-auto">
              More tools means more precise treatment. Each modality addresses
              your condition from a different angle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {services.map((s) => (
              <div key={s.id} className="group">
                <Link href={`/services/${s.id}`}>
                  <h3 className="text-xl font-serif text-secondary mb-2 group-hover:text-primary transition-colors">
                    {s.name}
                  </h3>
                </Link>
                <p className="text-secondary-light text-[15px] leading-relaxed">
                  {s.shortDescription}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/services"
              className="text-primary hover:text-primary-dark text-sm tracking-label uppercase transition-colors"
            >
              View all services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-warm-50 section-y">
        <div className="content-width">
          <div className="text-center mb-14">
            <p className="label mb-4">Patient outcomes</p>
            <h2 className="text-3xl md:text-5xl font-serif text-secondary">
              Results you can measure
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <TestimonialCarousel />
          </div>
          <div className="text-center mt-10">
            <Link
              href="/healing-stories"
              className="text-primary hover:text-primary-dark text-sm tracking-label uppercase transition-colors"
            >
              Read all stories &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Herbal / Nutrition Image Grid ── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-square md:aspect-auto md:h-[500px]">
          <Image
            src="/hero-1.jpg"
            alt="Traditional Chinese herbal medicine ingredients"
            fill
            className="img-cover"
          />
        </div>
        <div className="relative aspect-square md:aspect-auto md:h-[500px]">
          <Image
            src="/hero-3.jpg"
            alt="Natural herbs and ingredients for food therapy"
            fill
            className="img-cover"
          />
        </div>
      </section>

      {/* ── Conditions ── */}
      <section className="section-y">
        <div className="content-width">
          <div className="text-center mb-16">
            <p className="label mb-4">Conditions we treat</p>
            <h2 className="text-3xl md:text-5xl font-serif text-secondary mb-4">
              Beyond typical acupuncture
            </h2>
            <p className="text-secondary-light max-w-xl mx-auto">
              From chronic pain to autoimmune disorders, we treat conditions
              most clinics won't touch.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {conditions.map((c) => (
              <div key={c.id}>
                <Link href={`/conditions/${c.id}`}>
                  <h3 className="text-lg font-serif text-secondary mb-2 hover:text-primary transition-colors">{c.name}</h3>
                </Link>
                <p className="text-secondary-light text-[15px] leading-relaxed mb-3">
                  {c.examples.slice(0, 4).join(" / ")}
                  {c.examples.length > 4 && ` + ${c.examples.length - 4} more`}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link
              href="/conditions"
              className="text-primary hover:text-primary-dark text-sm tracking-label uppercase transition-colors"
            >
              View all conditions &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Treatment Image ── */}
      <section className="relative h-[50vh] min-h-[400px]">
        <Image
          src="/hero-4.png"
          alt="Dr. Vel treating a patient with acupuncture"
          fill
          className="img-cover"
        />
      </section>

      {/* ── Location ── */}
      <section className="section-y">
        <div className="content-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="label mb-4">Visit us</p>
              <h2 className="text-3xl md:text-5xl font-serif text-secondary mb-6">
                Grayslake, Illinois
              </h2>
              <div className="space-y-4 text-secondary-light mb-8">
                <p>34121 US-45, Grayslake, IL 60030</p>
                <p>
                  <a href="tel:+12245410022" className="text-primary hover:text-primary-dark transition-colors">
                    (224) 541-0022
                  </a>
                </p>
                <p>
                  <a href="mailto:info@easternhealingtraditions.com" className="text-primary hover:text-primary-dark transition-colors">
                    info@easternhealingtraditions.com
                  </a>
                </p>
              </div>
              <p className="text-secondary-light text-[15px]">
                Serving Lake County and the greater Chicago northern suburbs.
                Most new patients are seen within one week.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/entrance.webp"
                alt="Eastern Healing Traditions clinic front desk"
                fill
                className="img-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-primary text-white section-y">
        <div className="content-width text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            Ready to feel better?
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-10">
            Schedule your consultation. Most new patients are seen within one week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-accent hover:bg-accent-dark text-white px-8 py-3.5 text-sm tracking-label uppercase transition-colors"
            >
              Book a Consultation
            </Link>
            <a
              href="tel:+12245410022"
              className="border border-white/30 hover:border-white/60 text-white px-8 py-3.5 text-sm tracking-label uppercase transition-colors text-center"
            >
              Call (224) 541-0022
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
