import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Dr. Vel Natarajan, DACM",
  description:
    "Dr. Vel Natarajan holds a DACM — the highest credential in Traditional Chinese Medicine. Learn about his education-first approach and comprehensive treatment philosophy.",
};

export default function AboutPage() {
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
          <p className="label text-white/60 mb-4">About</p>
          <h1 className="text-4xl md:text-6xl font-serif max-w-xl">
            Dr. Vel Natarajan, DACM
          </h1>
        </div>
      </section>

      {/* Bio */}
      <section className="section-y">
        <div className="content-width">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden sticky top-28">
                <Image
                  src="/vel-headshot.jpg"
                  alt="Dr. Vel Natarajan"
                  fill
                  className="img-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div>
                <p className="label mb-4">Credentials</p>
                <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-6">
                  The highest credential in TCM
                </h2>
                <p className="text-secondary-light leading-relaxed">
                  The DACM — Doctorate of Acupuncture and Chinese Medicine — represents
                  years of advanced clinical training beyond the standard master's-level
                  certification most practitioners hold. When you choose Eastern Healing
                  Traditions, you're working with a practitioner who has the deepest level
                  of formal training available in the field.
                </p>
              </div>

              <div className="border-l-2 border-accent pl-6 py-2">
                <p className="text-xl font-serif text-secondary leading-snug">
                  &ldquo;I don't just apply techniques — I understand why each treatment
                  works and how to adapt it to your specific situation.&rdquo;
                </p>
              </div>

              <div>
                <p className="label mb-4">Philosophy</p>
                <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-6">
                  Education before treatment
                </h2>
                <p className="text-secondary-light leading-relaxed mb-4">
                  Many patients arrive after years of frustration with conventional
                  medicine. They've been told "your labs look fine" or "there's nothing
                  more we can do."
                </p>
                <p className="text-secondary-light leading-relaxed">
                  Dr. Vel starts differently: a thorough consultation, a comprehensive
                  health history, and a clear explanation of what's happening in your body.
                  You'll understand your treatment plan — not just what we're doing, but why.
                </p>
              </div>

              <div>
                <p className="label mb-4">Approach</p>
                <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-6">
                  Seven modalities, one plan
                </h2>
                <p className="text-secondary-light leading-relaxed mb-4">
                  With seven therapeutic modalities available, Dr. Vel draws from a broader
                  toolkit than most TCM practitioners. Treatment plans are built around your
                  specific condition, its acuity, your lifestyle, and how your body responds.
                </p>
                <p className="text-secondary-light leading-relaxed">
                  Treatment timelines are communicated honestly. Acute conditions resolve
                  faster. Chronic conditions require patience and a structured plan. You'll
                  always know what to expect.
                </p>
              </div>

              <div className="bg-warm-50 p-8">
                <p className="label mb-3">By the numbers</p>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-2xl md:text-3xl font-serif text-primary">DACM</p>
                    <p className="text-xs text-secondary-light mt-1">Highest credential</p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-serif text-primary">7</p>
                    <p className="text-xs text-secondary-light mt-1">Modalities</p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-serif text-primary">44</p>
                    <p className="text-xs text-secondary-light mt-1">5-star reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic image */}
      <section className="relative h-[50vh] min-h-[400px]">
        <Image
          src="/entrance.webp"
          alt="Eastern Healing Traditions clinic"
          fill
          className="img-cover"
        />
      </section>

      {/* CTA */}
      <section className="bg-primary text-white section-y">
        <div className="content-width text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            Experience the difference
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-10">
            Most new patients are seen within one week.
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
