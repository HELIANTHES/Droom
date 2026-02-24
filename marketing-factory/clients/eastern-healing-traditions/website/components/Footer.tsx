import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white/80">
      <div className="content-width py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Image
              src="/logo.png"
              alt="Eastern Healing Traditions"
              width={180}
              height={45}
              className="mb-6"
            />
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Relieve your pain, return you to health, and maintain your lasting
              wellness — without side effects.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="label text-white/40 mb-4">Navigate</p>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/services", label: "Services" },
                { href: "/conditions", label: "Conditions" },
                { href: "/healing-stories", label: "Healing Stories" },
                { href: "/first-visit", label: "Your First Visit" },
                { href: "/about", label: "About Dr. Vel" },
                { href: "/book", label: "Book Appointment" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-4">
            <p className="label text-white/40 mb-4">Contact</p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:+12245410022" className="text-white/60 hover:text-accent transition-colors">
                (224) 541-0022
              </a>
              <a
                href="mailto:info@easternhealingtraditions.com"
                className="text-white/60 hover:text-accent transition-colors"
              >
                info@easternhealingtraditions.com
              </a>
              <p className="text-white/60">
                34121 US-45<br />
                Grayslake, IL 60030
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-white/30 text-xs">
          &copy; {new Date().getFullYear()} Eastern Healing Traditions. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
