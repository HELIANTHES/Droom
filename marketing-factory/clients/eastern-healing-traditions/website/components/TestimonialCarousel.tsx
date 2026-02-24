"use client";

import { useState } from "react";
import { testimonials } from "@/lib/data/testimonials";

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const t = testimonials[current];

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <div>
      <blockquote className="text-center">
        <p className="text-xl md:text-2xl font-serif text-secondary leading-snug mb-8">
          &ldquo;{t.quote}&rdquo;
        </p>
        <footer>
          <p className="font-medium text-secondary">{t.name}</p>
          <p className="text-sm text-secondary-light mt-0.5">{t.condition}</p>
          <p className="text-sm text-accent font-medium mt-2">{t.outcome}</p>
        </footer>
      </blockquote>

      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          onClick={prev}
          className="text-secondary-light hover:text-primary transition-colors"
          aria-label="Previous"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === current ? "bg-primary" : "bg-secondary/20"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="text-secondary-light hover:text-primary transition-colors"
          aria-label="Next"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
