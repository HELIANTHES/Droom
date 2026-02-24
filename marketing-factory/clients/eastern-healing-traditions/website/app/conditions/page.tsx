import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { conditions } from "@/lib/data/conditions";

export const metadata: Metadata = {
  title: "Conditions We Treat — Chronic Pain, Autoimmune, Neuropathy & More",
  description:
    "From chronic pain and autoimmune disorders to neuropathy, women's health, and men's health — Eastern Healing Traditions treats conditions most clinics won't touch. DACM-certified TCM in Grayslake, IL.",
};

export default function ConditionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src="/hero-4.png"
          alt="Dr. Vel treating a patient"
          fill
          className="img-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 content-width pb-16 md:pb-24 text-white">
          <p className="label text-white/60 mb-4">Conditions we treat</p>
          <h1 className="text-4xl md:text-6xl font-serif max-w-xl">
            Beyond typical acupuncture
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section-y">
        <div className="content-width max-w-3xl">
          <p className="text-xl md:text-2xl text-secondary-light leading-relaxed text-center">
            From chronic pain to autoimmune disorders, we treat conditions most
            clinics won&apos;t touch. Dr. Vel combines seven therapeutic modalities
            with the highest TCM credential to address the root cause — not just
            the symptoms.
          </p>
        </div>
      </section>

      {/* Condition Cards */}
      <section className="pb-20 md:pb-32">
        <div className="content-width">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {conditions.map((c) => (
              <Link
                key={c.id}
                href={`/conditions/${c.id}`}
                className="group bg-warm-50 p-8 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-serif text-secondary mb-3 group-hover:text-primary transition-colors">
                  {c.name}
                </h2>
                <p className="text-secondary-light text-[15px] leading-relaxed mb-4">
                  {c.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {c.examples.slice(0, 4).map((ex) => (
                    <span
                      key={ex}
                      className="text-xs bg-white text-secondary-light px-2.5 py-0.5"
                    >
                      {ex}
                    </span>
                  ))}
                  {c.examples.length > 4 && (
                    <span className="text-xs text-secondary-light px-2.5 py-0.5">
                      + {c.examples.length - 4} more
                    </span>
                  )}
                </div>
                <span className="text-primary text-sm tracking-label uppercase">
                  Learn more &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white section-y">
        <div className="content-width text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            Not sure if we can help?
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-10">
            Book a consultation and Dr. Vel will evaluate your condition and
            recommend the right treatment approach.
          </p>
          <Link
            href="/book"
            className="bg-accent hover:bg-accent-dark text-white px-8 py-3.5 text-sm tracking-label uppercase transition-colors inline-block"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
