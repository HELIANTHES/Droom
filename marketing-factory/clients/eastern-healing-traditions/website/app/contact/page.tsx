import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Eastern Healing Traditions in Grayslake, IL. Call (224) 541-0022 or send us a message.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-end overflow-hidden">
        <Image
          src="/entrance.webp"
          alt="Eastern Healing Traditions clinic"
          fill
          className="img-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 content-width pb-12 md:pb-16 text-white">
          <p className="label text-white/60 mb-4">Contact</p>
          <h1 className="text-4xl md:text-5xl font-serif">Get in touch</h1>
        </div>
      </section>

      <section className="section-y">
        <div className="content-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info */}
            <div className="space-y-10">
              <div>
                <p className="label mb-3">Phone</p>
                <a
                  href="tel:+12245410022"
                  className="text-2xl font-serif text-primary hover:text-primary-dark transition-colors"
                >
                  (224) 541-0022
                </a>
              </div>

              <div>
                <p className="label mb-3">Email</p>
                <a
                  href="mailto:info@easternhealingtraditions.com"
                  className="text-lg text-primary hover:text-primary-dark transition-colors"
                >
                  info@easternhealingtraditions.com
                </a>
              </div>

              <div>
                <p className="label mb-3">Address</p>
                <p className="text-secondary-light">
                  34121 US-45<br />
                  Grayslake, IL 60030
                </p>
              </div>

              <div>
                <p className="label mb-3">Service area</p>
                <p className="text-secondary-light text-[15px] leading-relaxed">
                  Serving Lake County and the greater Chicago northern suburbs —
                  Grayslake, Mundelein, Libertyville, Gurnee, Vernon Hills,
                  Lake Forest, and surrounding communities.
                </p>
              </div>

              <div className="pt-4">
                <p className="text-secondary-light text-[15px]">
                  Ready to book?{" "}
                  <a href="/book" className="text-primary hover:text-primary-dark font-medium transition-colors">
                    Schedule an appointment &rarr;
                  </a>
                </p>
              </div>
            </div>

            {/* Form */}
            <div>
              <p className="label mb-6">Send a message</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
