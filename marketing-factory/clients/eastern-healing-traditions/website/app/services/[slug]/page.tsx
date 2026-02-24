import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/lib/data/services";
import { conditions } from "@/lib/data/conditions";
import { testimonials } from "@/lib/data/testimonials";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = services.find((s) => s.id === params.slug);
  if (!service) return {};
  return {
    title: `${service.name} — How It Works & What to Expect`,
    description: `${service.shortDescription} Learn how ${service.name.toLowerCase()} works, what to expect during treatment, and the conditions it treats at Eastern Healing Traditions in Grayslake, IL.`,
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = services.find((s) => s.id === params.slug);
  if (!service) notFound();

  const relatedConditions = conditions.filter((c) =>
    service.relatedConditions.includes(c.id)
  );
  const testimonial = service.relatedTestimonial
    ? testimonials.find((t) => t.slug === service.relatedTestimonial)
    : null;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src={service.heroImage}
          alt={service.name}
          fill
          className="img-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 content-width pb-16 md:pb-24 text-white">
          <p className="label text-white/60 mb-4">Our services</p>
          <h1 className="text-4xl md:text-6xl font-serif max-w-xl">
            {service.name}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section-y">
        <div className="content-width max-w-3xl">
          <p className="text-xl md:text-2xl text-secondary-light leading-relaxed text-center">
            {service.fullDescription}
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-warm-50 section-y">
        <div className="content-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="label mb-4">How it works</p>
              <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-6">
                The science behind {service.name.toLowerCase()}
              </h2>
              <p className="text-secondary-light leading-relaxed">
                {service.howItWorks}
              </p>
            </div>
            <div>
              <div className="bg-white p-8 mb-8">
                <h3 className="font-serif text-lg text-secondary mb-4">
                  The TCM perspective
                </h3>
                <p className="text-secondary-light text-[15px] leading-relaxed">
                  {service.tcmPerspective}
                </p>
              </div>
              <div className="bg-white p-8">
                <h3 className="font-serif text-lg text-secondary mb-4">
                  Research basis
                </h3>
                <p className="text-secondary-light text-[15px] leading-relaxed">
                  {service.researchBasis}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-y">
        <div className="content-width max-w-3xl">
          <p className="label mb-4">What to expect</p>
          <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-6">
            Your treatment experience
          </h2>
          <p className="text-secondary-light leading-relaxed mb-6">
            {service.whatToExpect}
          </p>
          <div className="flex flex-wrap gap-2">
            {service.conditions.map((c) => (
              <span
                key={c}
                className="text-xs bg-warm-100 text-secondary-light px-3 py-1"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions Treated */}
      {relatedConditions.length > 0 && (
        <section className="bg-warm-50 section-y">
          <div className="content-width">
            <p className="label mb-4">Conditions treated</p>
            <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-10">
              Who benefits from {service.name.toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedConditions.map((c) => (
                <Link
                  key={c.id}
                  href={`/conditions/${c.id}`}
                  className="group bg-white p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-serif text-secondary mb-2 group-hover:text-primary transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-secondary-light text-[15px] leading-relaxed mb-3">
                    {c.examples.slice(0, 4).join(" / ")}
                  </p>
                  <span className="text-primary text-sm tracking-label uppercase">
                    Learn more &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Patient Story */}
      {testimonial && (
        <section className="section-y">
          <div className="content-width max-w-3xl">
            <p className="label mb-4">Patient story</p>
            <blockquote className="text-xl md:text-2xl font-serif text-secondary leading-relaxed mb-6">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-medium text-secondary">{testimonial.name}</p>
                <p className="text-secondary-light text-sm">
                  {testimonial.condition} &mdash; {testimonial.outcome}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/healing-stories"
                className="text-primary hover:text-primary-dark text-sm tracking-label uppercase transition-colors"
              >
                Read all patient stories &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary text-white section-y">
        <div className="content-width text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            Ready to try {service.name.toLowerCase()}?
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-10">
            Schedule your consultation and Dr. Vel will determine if{" "}
            {service.name.toLowerCase()} is right for your condition.
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
