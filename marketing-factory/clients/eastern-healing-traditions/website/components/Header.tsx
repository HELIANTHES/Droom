"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/conditions", label: "Conditions" },
  { href: "/healing-stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="content-width">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="relative w-48 h-12">
            <Image
              src="/logo.png"
              alt="Eastern Healing Traditions"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-label uppercase transition-colors ${
                  scrolled
                    ? "text-secondary hover:text-primary"
                    : "text-secondary/80 hover:text-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="text-sm tracking-label uppercase bg-primary hover:bg-primary-dark text-white px-6 py-2.5 transition-colors"
            >
              Book Now
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-secondary"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-cream border-t border-warm-200">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-label uppercase text-secondary hover:text-primary py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-label uppercase bg-primary text-white px-6 py-3 text-center mt-2"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
