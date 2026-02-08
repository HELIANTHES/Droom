import Link from "next/link";

interface HeroProps {
  headline: string;
  subtext: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export default function Hero({
  headline,
  subtext,
  ctaText = "Book Your Consultation",
  ctaHref = "/book",
  secondaryCtaText,
  secondaryCtaHref,
}: HeroProps) {
  return (
    <section className="bg-primary text-white pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {headline}
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
            {subtext}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={ctaHref}
              className="bg-accent hover:bg-accent-dark text-white px-8 py-3.5 rounded-md font-semibold text-center transition-colors text-lg"
            >
              {ctaText}
            </Link>
            {secondaryCtaText && secondaryCtaHref && (
              <Link
                href={secondaryCtaHref}
                className="border-2 border-white/30 hover:border-white text-white px-8 py-3.5 rounded-md font-semibold text-center transition-colors text-lg"
              >
                {secondaryCtaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
