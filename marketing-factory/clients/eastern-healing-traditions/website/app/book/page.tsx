import type { Metadata } from "next";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book Your Appointment",
  description:
    "Schedule your consultation with Dr. Vel Natarajan, DACM. Most new patients are seen within one week.",
};

export default function BookPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-end overflow-hidden">
        <Image
          src="/hero-1.jpg"
          alt="Traditional Chinese herbal medicine"
          fill
          className="img-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 content-width pb-12 md:pb-16 text-white">
          <p className="label text-white/60 mb-4">Book</p>
          <h1 className="text-4xl md:text-5xl font-serif">
            Schedule your consultation
          </h1>
        </div>
      </section>

      <section className="section-y">
        <div className="content-width">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <BookingForm />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5 space-y-10">
              <div>
                <p className="label mb-3">What to expect</p>
                <ol className="space-y-4 text-secondary-light text-[15px]">
                  <li className="flex gap-3">
                    <span className="text-accent font-serif text-lg">1</span>
                    <span>We'll call within 24 hours to confirm your appointment</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-serif text-lg">2</span>
                    <span>Your first visit includes a thorough consultation (60-90 min)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-serif text-lg">3</span>
                    <span>Dr. Vel will explain your condition and recommended treatment</span>
                  </li>
                </ol>
              </div>

              <div className="bg-warm-50 p-8">
                <p className="label mb-3">Credentials</p>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-2xl font-serif text-primary">DACM</span>
                    <span className="text-sm text-secondary-light">Highest TCM credential</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-2xl font-serif text-primary">44</span>
                    <span className="text-sm text-secondary-light">Five-star reviews</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-2xl font-serif text-primary">7</span>
                    <span className="text-sm text-secondary-light">Therapeutic modalities</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="label mb-3">Prefer to call?</p>
                <a
                  href="tel:+12245410022"
                  className="text-2xl font-serif text-primary hover:text-primary-dark transition-colors"
                >
                  (224) 541-0022
                </a>
                <p className="text-sm text-secondary-light mt-2">
                  34121 US-45, Grayslake, IL 60030
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
