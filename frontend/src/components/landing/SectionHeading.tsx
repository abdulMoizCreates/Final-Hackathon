"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  align?: "left" | "center";
  dark?: boolean;
}

/** Shared section header — eyebrow, display title, optional greyed lede. */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
  align = "left",
  dark = false,
}: SectionHeadingProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-heading-part]", {
          y: 26,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: container.current, start: "top 78%", once: true },
        });
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className={`max-w-2xl space-y-4 ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <span
        data-heading-part
        className="eyebrow block"
        style={dark ? { color: "#34D399" } : undefined}
      >
        {eyebrow}
      </span>
      <h2
        id={id}
        data-heading-part
        className="display-lg"
        style={dark ? { color: "#F1F5F9" } : undefined}
      >
        {title}
      </h2>
      {lede && (
        <p
          data-heading-part
          className={`text-base leading-relaxed ${align === "center" ? "mx-auto max-w-xl" : ""}`}
          style={dark ? { color: "var(--sidebar-ink-2)" } : { color: "var(--ink-3)" }}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
