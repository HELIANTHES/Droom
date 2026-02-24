import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="content-width w-full py-20 text-center">
        <p className="text-8xl font-serif text-primary/20 mb-4">404</p>
        <h1 className="text-3xl font-serif text-secondary mb-4">Page not found</h1>
        <p className="text-secondary-light mb-10">
          The page you're looking for doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/"
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 text-sm tracking-label uppercase transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/book"
            className="bg-accent hover:bg-accent-dark text-white px-8 py-3 text-sm tracking-label uppercase transition-colors"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
