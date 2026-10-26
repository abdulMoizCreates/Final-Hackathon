import Link from "next/link";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Signature Dayrail", href: "#dayrail" },
      { label: "AI Assistant", href: "#ai-assistant" },
    ],
  },
  {
    title: "Roles",
    links: [
      { label: "Company Administrator", href: "#roles" },
      { label: "HR Operations", href: "#roles" },
      { label: "Employee Self-Service", href: "#roles" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Company setup", href: "/setup" },
      { label: "Go to dashboard", href: "/dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="border-t mt-4"
      style={{ background: "var(--surface)", borderColor: "#E4E9EE" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-14 pb-28 sm:pb-12">
        {/* Chat-widget safe zone: extra bottom padding on mobile (floating button bottom-right) */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "var(--primary)", boxShadow: "0 2px 8px rgba(13,148,136,0.3)" }}
                aria-hidden
              >
                <div className="w-4 h-0.5 rounded bg-white relative">
                  <div className="absolute w-2 h-2 rounded-full -top-[3px] left-1" style={{ background: "var(--highlight)" }} />
                </div>
              </div>
              <span className="font-display font-semibold text-lg tracking-tight">HCM Lite</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--ink-3)" }}>
              Human capital management that agrees with itself — one record per day, one
              calculation per payslip.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="md:col-span-2 space-y-3">
              <h3 className="eyebrow">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="text-sm transition-colors duration-200 hover:text-[var(--ink)]"
                        style={{ color: "var(--ink-3)" }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-200 hover:text-[var(--ink)]"
                        style={{ color: "var(--ink-3)" }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-14 pt-6"
          style={{ borderTop: "1px solid #EEF1F4" }}
        >
          <span className="text-xs" style={{ color: "var(--ink-4)" }}>
            HCM Lite © 2026 — Enterprise human capital management platform
          </span>
          <span className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
