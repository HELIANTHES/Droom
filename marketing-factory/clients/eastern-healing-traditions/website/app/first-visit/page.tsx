import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { firstVisitSteps, faqs, whatToBring } from "@/lib/data/first-visit";

export const metadata: Metadata = {
  title: "Your First Visit — What to Expect at Eastern Healing Traditions",
  description:
    "Wondering what your first acupuncture appointment looks like? A step-by-step walkthrough from arrival to after-care, plus FAQs about pain, insurance, sessions, and what to wear.",
};

export default function FirstVisitPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src="/entrance.webp"
          alt="Eastern Healing Traditions front desk"
          fill
          className="img-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 content-width pb-16 md:pb-24 text-white">
          <p className="label text-white/60 mb-4">New patients</p>
          <h1 className="text-4xl md:text-6xl font-serif max-w-xl">
            Your first visit
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section-y">
        <div className="content-width max-w-3xl">
          <p className="text-xl md:text-2xl text-secondary-light leading-relaxed text-center">
            Your first appointment is about listening, understanding, and
            creating a plan — not rushing into treatment. Here is exactly what to
            expect, step by step.
          </p>
        </div>
      </section>

      {/* What to Bring */}
      <section className="pb-16 md:pb-24">
        <div className="content-width max-w-3xl">
          <div className="bg-warm-50 p-8">
            <h2 className="font-serif text-xl text-secondary mb-4">
              What to bring
            </h2>
            <ul className="space-y-3">
              {whatToBring.map((item) => (
                <li
                  key={item}
                  className="text-secondary-light text-[15px] flex items-start gap-3"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Step-by-Step Walkthrough */}
      <section className="bg-warm-50 section-y">
        <div className="content-width">
          <div className="text-center mb-14">
            <p className="label mb-4">Step by step</p>
            <h2 className="text-3xl md:text-5xl font-serif text-secondary">
              What happens at your first appointment
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-10">
            {firstVisitSteps.map((s) => (
              <div key={s.step} className="flex gap-6">
                <div className="shrink-0 w-10 h-10 bg-primary text-white flex items-center justify-center text-sm font-medium">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-secondary mb-2">
                    {s.title}
                  </h3>
                  <p className="text-secondary-light text-[15px] leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment & Insurance */}
      <section className="section-y">
        <div className="content-width max-w-3xl">
          <p className="label mb-4">Payment & insurance</p>
          <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-6">
            Investment in your health
          </h2>
          <p className="text-secondary-light leading-relaxed mb-4">
            Many insurance plans now cover acupuncture, and coverage has expanded
            significantly in recent years. We recommend contacting your insurance
            provider to verify your specific benefits. Our office can provide the
            necessary documentation and billing codes for reimbursement.
          </p>
          <p className="text-secondary-light leading-relaxed">
            We accept HSA and FSA payments. Consider the value: a course of
            acupuncture treatment that resolves a chronic condition is a fraction
            of the cost of ongoing medication, repeated specialist visits, or
            surgery — and comes without side effects.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-warm-50 section-y">
        <div className="content-width max-w-3xl">
          <div className="text-center mb-14">
            <p className="label mb-4">Common questions</p>
            <h2 className="text-3xl md:text-5xl font-serif text-secondary">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-serif text-lg text-secondary mb-2">
                  {faq.question}
                </h3>
                <p className="text-secondary-light text-[15px] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white section-y">
        <div className="content-width text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            Ready to get started?
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-10">
            Most new patients are seen within one week. Your first step toward
            feeling better starts with a consultation.
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
