"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Roles", href: "#roles" },
  { label: "AI Assistant", href: "#ai-assistant" },
];

export default function Navbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Glass + hide/show on scroll (desktop only) */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const y = self.scroll();
            setScrolled(y > 12);
            setHidden(y > 140 && self.direction === 1);
          },
        });
      });
      mm.add("(prefers-reduced-motion: reduce) or (max-width: 767px)", () => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
      });
    },
    { scope: headerRef }
  );

  /* Mobile menu — staggered link reveal, scroll lock, Escape to close */
  useGSAP(
    () => {
      if (!menuOpen || !menuRef.current) return;
      document.documentElement.style.overflow = "hidden";
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return () => { document.documentElement.style.overflow = ""; };

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(menuRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
        .fromTo(
          "[data-menu-link]",
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
          "<0.05"
        )
        .fromTo("[data-menu-cta]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "<0.1");

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMenuOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.documentElement.style.overflow = "";
        tl.kill();
      };
    },
    { dependencies: [menuOpen] }
  );

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.55)",
          backdropFilter: scrolled ? "blur(16px)" : "blur(8px)",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(8px)",
          borderBottom: `1px solid ${scrolled ? "#E4E9EE" : "transparent"}`,
          boxShadow: scrolled ? "var(--shadow-subtle)" : "none",
          transform: hidden && !menuOpen ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <nav
          aria-label="Primary"
          className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-4"
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="HCM Lite home">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent)", boxShadow: "0 2px 8px rgba(22,101,52,0.3)" }}
              aria-hidden
            >
              <div className="w-4 h-0.5 rounded bg-white relative">
                <div className="absolute w-2 h-2 rounded-full -top-[3px] left-1" style={{ background: "var(--accent-light)" }} />
              </div>
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">HCM Lite</span>
          </Link>

          {/* Desktop anchors */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 hover:text-[var(--accent)]"
                style={{ color: "var(--ink-3)" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-accent hover:bg-accent-hover active:bg-accent-hover text-white"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: "var(--ink-2)" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/setup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-accent hover:bg-accent-hover active:bg-accent-hover text-white"
                >
                  Company setup
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors hover:bg-slate-50"
              style={{ borderColor: "#E4E9EE", color: "var(--ink)" }}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[70] md:hidden"
          style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        >
          <div className="h-full flex flex-col px-6 pt-24 pb-10">
            <ul className="flex-1 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href} data-menu-link>
                  <a
                    href={link.href}
                    className="block py-3 font-display text-3xl font-medium tracking-tight"
                    style={{ color: "var(--ink)" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div data-menu-cta className="space-y-3 pt-8" style={{ borderTop: "1px solid #E4E9EE" }}>
              {user ? (
                <Link
                  href="/dashboard"
                  className="block w-full text-center px-5 py-3.5 rounded-xl text-sm font-semibold bg-accent hover:bg-accent-hover active:bg-accent-hover text-white transition-all"
                >
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full text-center px-5 py-3.5 rounded-xl text-sm font-semibold border"
                    style={{ borderColor: "#E4E9EE", color: "var(--ink)", background: "var(--surface)" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/setup"
                    className="block w-full text-center px-5 py-3.5 rounded-xl text-sm font-semibold bg-accent hover:bg-accent-hover active:bg-accent-hover text-white transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    Company setup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
