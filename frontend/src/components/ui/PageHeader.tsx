"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--ink)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm mt-1 font-normal" style={{ color: "var(--ink-3)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3 mt-2 sm:mt-0">{children}</div>}
    </div>
  );
}
