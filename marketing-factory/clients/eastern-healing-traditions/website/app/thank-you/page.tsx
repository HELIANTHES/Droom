"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ThankYouPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as any;

    if (w.gtag) {
      const ga4 = process.env.NEXT_PUBLIC_GA4_ID;
      if (ga4) w.gtag("event", "generate_lead", { event_category: "engagement" });
      const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
      const adsLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL;
      if (adsId && adsLabel) w.gtag("event", "conversion", { send_to: `${adsId}/${adsLabel}` });
    }

    if (w.fbq) w.fbq("track", "Lead");
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="content-width w-full py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="label mb-6">Appointment requested</p>
          <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-6">
            Thank you
          </h1>
          <p className="text-lg text-secondary-light mb-12">
            We'll contact you within 24 hours to confirm your appointment.
          </p>

          <div className="bg-warm-50 p-8 mb-12 text-left">
            <p className="label mb-4">What happens next</p>
            <ol className="space-y-4 text-secondary-light text-[15px]">
              <li className="flex gap-3">
                <span className="text-accent font-serif text-lg">1</span>
                <span>We'll call to confirm your preferred date and time</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-serif text-lg">2</span>
                <span>Bring any relevant medical records or test results</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-serif text-lg">3</span>
                <span>Plan for 60-90 minutes for your initial consultation</span>
              </li>
            </ol>
          </div>

          <a
            href="tel:+12245410022"
            className="text-2xl font-serif text-primary hover:text-primary-dark transition-colors block mb-10"
          >
            (224) 541-0022
          </a>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="text-primary hover:text-primary-dark text-sm tracking-label uppercase transition-colors"
            >
              Explore services &rarr;
            </Link>
            <Link
              href="/"
              className="text-secondary-light hover:text-secondary text-sm tracking-label uppercase transition-colors"
            >
              Return home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
