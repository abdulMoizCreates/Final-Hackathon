"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Route-level entrance: runs on every navigation (App Router remounts
 * templates). Two jobs:
 *  1. Page fade — opacity only. A transform/filter here would create a
 *     containing block and break the fixed navbar mid-animation.
 *  2. Content & chart entrances — [data-enter] blocks batch-fade-up as
 *     they enter the viewport; chart SVGs (data-spark / data-chart-area /
 *     data-chart-line / data-chart-donut) draw themselves in.
 * All animations are .from() — content is visible by default, stays
 * visible under prefers-reduced-motion or if JS fails.
 */
export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* 1 — page fade */
        gsap.from(ref.current, { opacity: 0, duration: 0.45, ease: "power2.out" });

        /* 2a — structural blocks, batched by viewport entry */
        ScrollTrigger.batch("[data-enter]", {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.from(batch, {
              y: 24,
              opacity: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.08,
            }),
        });

        /* 2b — KPI sparklines: stroke draw */
        gsap.utils.toArray<SVGPathElement>("[data-spark]").forEach((path) => {
          const len = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: { trigger: path.closest("[data-enter]") ?? path, start: "top 90%", once: true },
            }
          );
        });

        /* 2c — area fills: gentle fade, triggered per element */
        gsap.utils.toArray<SVGPathElement>("[data-chart-area]").forEach((path) => {
          gsap.from(path, {
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: path.closest("[data-enter]") ?? path, start: "top 88%", once: true },
          });
        });

        /* 2d — trend strokes: sequential draw */
        gsap.utils.toArray<SVGPathElement>("[data-chart-line]").forEach((path, i) => {
          const len = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 1.4,
              delay: i * 0.18,
              ease: "power2.out",
              scrollTrigger: { trigger: path.closest("[data-enter]") ?? path, start: "top 88%", once: true },
            }
          );
        });

        /* 2e — donuts: soft rise */
        gsap.utils.toArray<SVGElement>("[data-chart-donut]").forEach((svg) => {
          gsap.from(svg, {
            opacity: 0,
            scale: 0.92,
            rotate: -6,
            transformOrigin: "center center",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: svg.closest("[data-enter]") ?? svg, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
