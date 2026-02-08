import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-bold text-accent mb-4">
              Eastern Healing Traditions
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Relieve your pain, return you to health, and maintain your lasting
              wellness without side effects.
            </p>
            <p className="text-gray-400 text-sm">
              Dr. Vel Natarajan, DACM
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/services" className="text-gray-300 hover:text-accent transition-colors">
                Services
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-accent transition-colors">
                About Dr. Vel
              </Link>
              <Link href="/book" className="text-gray-300 hover:text-accent transition-colors">
                Book Appointment
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-accent transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-gray-300">
              <a href="tel:+12245410022" className="hover:text-accent transition-colors">
                (224) 541-0022
              </a>
              <a
                href="mailto:info@easternhealingtraditions.com"
                className="hover:text-accent transition-colors"
              >
                info@easternhealingtraditions.com
              </a>
              <p>34121 US-45, Grayslake, IL 60030</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-10 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Eastern Healing Traditions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
