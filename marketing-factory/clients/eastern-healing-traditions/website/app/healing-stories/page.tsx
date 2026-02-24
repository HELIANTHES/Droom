import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { testimonials } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "Healing Stories — Real Patients, Real Results",
  description:
    "Read how patients like Patricia J. (canceled surgery after 3 sessions), Patsy W. (20-year pain resolved), and others found lasting relief at Eastern Healing Traditions.",
};

export default function HealingStoriesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src="/entrance.webp"
          alt="Eastern Healing Traditions clinic"
          fill
          className="img-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 content-width pb-16 md:pb-24 text-white">
          <p className="label text-white/60 mb-4">Patient outcomes</p>
          <h1 className="text-4xl md:text-6xl font-serif max-w-xl">
            Healing stories
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section-y">
        <div className="content-width max-w-3xl">
          <p className="text-xl md:text-2xl text-secondary-light leading-relaxed text-center">
            These are real patients with real conditions who found real relief.
            Every story includes specific outcomes — because vague testimonials
            aren&apos;t helpful when you&apos;re trying to decide if treatment is
            worth pursuing.
          </p>
        </div>
      </section>

      {/* Stories */}
      <section className="pb-20 md:pb-32">
        <div className="content-width">
          <div className="space-y-20 md:space-y-28">
            {testimonials.map((t, i) => (
              <div
                key={t.slug}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start ${
                  i % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
              >
                <div>
                  <span className="inline-block text-xs bg-primary/10 text-primary px-3 py-1 mb-4">
                    {t.conditionCategory
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif text-secondary mb-2">
                    {t.name}
                  </h2>
                  <p className="text-primary font-medium mb-6">
                    {t.condition}
                  </p>
                  <blockquote className="text-secondary-light leading-relaxed text-lg mb-6 border-l-2 border-primary/20 pl-6">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <div className="bg-warm-50 p-6 md:p-8 space-y-4">
                  <div>
                    <p className="label mb-1">Duration of condition</p>
                    <p className="text-secondary-light text-[15px]">
                      {t.duration}
                    </p>
                  </div>
                  <div>
                    <p className="label mb-1">Prior treatments</p>
                    <p className="text-secondary-light text-[15px]">
                      {t.priorTreatments}
                    </p>
                  </div>
                  <div>
                    <p className="label mb-1">Treatment at EHT</p>
                    <p className="text-secondary-light text-[15px]">
                      {t.treatment}
                    </p>
                  </div>
                  <div>
                    <p className="label mb-1">Sessions to result</p>
                    <p className="text-secondary-light text-[15px] font-medium text-primary">
                      {t.sessionsToResult}
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium text-secondary">
                      Outcome
                    </p>
                    <p className="text-secondary-light text-[15px]">
                      {t.outcome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white section-y">
        <div className="content-width text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            Your story could be next
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-10">
            Schedule your consultation. Most new patients are seen within one
            week.
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
