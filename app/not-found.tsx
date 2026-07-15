import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Homepage" },
  { href: "/en/services", label: "Services" },
  { href: "/en/about", label: "About SENEDX" },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-lightbg px-6 py-14 text-charcoal">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-charcoal/10 bg-white/85 p-8 shadow-xl backdrop-blur md:p-12">
        <p className="inline-flex rounded-full border border-charcoal/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/70">
          Error 404
        </p>

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
          Page not found
        </h1>

        <p className="mt-4 text-base leading-relaxed text-charcoal/80 md:text-lg">
          The page you requested may have been moved, renamed, or no longer
          exists.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Back to homepage
          </Link>
          <Link
            href="/en/services"
            className="inline-flex items-center justify-center rounded-xl border border-charcoal/20 px-5 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-primary hover:text-primary"
          >
            Explore services
          </Link>
        </div>

        <div className="mt-8 border-t border-charcoal/10 pt-6">
          <p className="text-sm font-medium text-charcoal/70">Quick links</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-lg border border-charcoal/15 px-3 py-2 text-sm text-charcoal/80 transition-colors hover:border-primary hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
