import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { conditions } from "@/lib/data/conditions";
import { services } from "@/lib/data/services";
import { testimonials } from "@/lib/data/testimonials";

export function generateStaticParams() {
  return conditions.map((c) => ({ slug: c.id }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const condition = conditions.find((c) => c.id === params.slug);
  if (!condition) return {};
  return {
    title: `${condition.name} — TCM Treatment in Grayslake, IL`,
    description: `${condition.description} Learn how Traditional Chinese Medicine treats ${condition.name.toLowerCase()} at Eastern Healing Traditions.`,
  };
}

export default function ConditionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const condition = conditions.find((c) => c.id === params.slug);
  if (!condition) notFound();

  const relatedServices = services.filter((s) =>
    condition.modalities.includes(s.id)
  );
  const testimonial = condition.relatedTestimonial
    ? testimonials.find((t) => t.slug === condition.relatedTestimonial)
    : null;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src={condition.heroImage}
          alt={condition.name}
          fill
          className="img-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 content-width pb-16 md:pb-24 text-white">
          <p className="label text-white/60 mb-4">Conditions we treat</p>
          <h1 className="text-4xl md:text-6xl font-serif max-w-xl">
            {condition.name}
          </h1>
        </div>
      </section>

      {/* Overview */}
      <section className="section-y">
        <div className="content-width max-w-3xl">
          <p className="label mb-4">Understanding {condition.name.toLowerCase()}</p>
          <p className="text-xl md:text-2xl text-secondary-light leading-relaxed">
            {condition.overview}
          </p>
        </div>
      </section>

      {/* How TCM Helps */}
      <section className="bg-warm-50 section-y">
        <div className="content-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="label mb-4">How TCM helps</p>
              <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-6">
                A different approach to {condition.name.toLowerCase()}
              </h2>
              <p className="text-secondary-light leading-relaxed">
                {condition.howTCMHelps}
              </p>
            </div>
            <div>
              <div className="bg-white p-8">
                <h3 className="font-serif text-lg text-secondary mb-4">
                  Specific conditions we treat
                </h3>
                <ul className="space-y-3">
                  {condition.examples.map((ex) => (
                    <li
                      key={ex}
                      className="text-secondary-light text-[15px] flex items-start gap-3"
                    >
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modalities Used */}
      {relatedServices.length > 0 && (
        <section className="section-y">
          <div className="content-width">
            <p className="label mb-4">Treatment modalities</p>
            <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-10">
              How we treat {condition.name.toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedServices.map((s) => (
                <Link
                  key={s.id}
                  href={`/services/${s.id}`}
                  className="group bg-warm-50 p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-serif text-secondary mb-2 group-hover:text-primary transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-secondary-light text-[15px] leading-relaxed mb-3">
                    {s.shortDescription}
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
        <section className="bg-warm-50 section-y">
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
            Ready to explore treatment?
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-10">
            Schedule your consultation and Dr. Vel will create a personalized
            treatment plan for your condition.
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
