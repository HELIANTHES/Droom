import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services — 7 Therapeutic Modalities",
  description:
    "Acupuncture, Chinese Herbal Medicine, Dry Needling, Moxibustion, Electroacupuncture, Nutrition Therapy, and manual therapies. The most comprehensive TCM treatment range in Lake County, IL.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src="/hero-2.jpg"
          alt="Moxibustion treatment"
          fill
          className="img-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 content-width pb-16 md:pb-24 text-white">
          <p className="label text-white/60 mb-4">Our services</p>
          <h1 className="text-4xl md:text-6xl font-serif max-w-xl">
            Seven modalities, one practitioner
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section-y">
        <div className="content-width max-w-3xl">
          <p className="text-xl md:text-2xl text-secondary-light leading-relaxed text-center">
            Dr. Vel selects the right combination of therapies for your specific
            condition. More modalities means a more precise, personalized treatment
            plan — not a one-size-fits-all approach.
          </p>
        </div>
      </section>

      {/* Services list */}
      <section className="pb-20 md:pb-32">
        <div className="content-width">
          <div className="space-y-16 md:space-y-24">
            {services.map((s, i) => (
              <div
                key={s.id}
                id={s.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 ${
                  i % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
              >
                <div className="lg:col-span-5">
                  <p className="label mb-3">0{i + 1}</p>
                  <Link href={`/services/${s.id}`}>
                    <h2 className="text-2xl md:text-3xl font-serif text-secondary mb-4 hover:text-primary transition-colors">
                      {s.name}
                    </h2>
                  </Link>
                  <p className="text-secondary-light leading-relaxed mb-5">
                    {s.fullDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {s.conditions.map((c) => (
                      <span
                        key={c}
                        className="text-xs bg-warm-100 text-secondary-light px-3 py-1"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <Link
                      href={`/services/${s.id}`}
                      className="text-primary hover:text-primary-dark text-sm tracking-label uppercase transition-colors"
                    >
                      Learn more &rarr;
                    </Link>
                    <Link
                      href="/book"
                      className="text-secondary-light hover:text-secondary text-sm tracking-label uppercase transition-colors"
                    >
                      Book this service &rarr;
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <div className="bg-warm-100 p-6 md:p-8">
                    <h3 className="font-serif text-lg text-secondary mb-3">
                      What to expect
                    </h3>
                    <p className="text-secondary-light text-[15px] leading-relaxed">
                      {s.whatToExpect}
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
            Not sure which service is right for you?
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-10">
            Book a consultation and Dr. Vel will recommend the right combination
            for your condition.
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
