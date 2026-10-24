"use client";

interface KpiItem {
  label: string;
  value: string | number;
  hint?: string;
}

interface KpiStripProps {
  items: KpiItem[];
}

export default function KpiStrip({ items }: KpiStripProps) {
  return (
    <div
      className="rounded-2xl p-6 sm:p-7 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 shadow-card font-sans transition-shadow"
      style={{ background: "var(--surface)" }}
    >
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-3)" }}>
            {item.label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight" style={{ color: "var(--ink)" }}>
            {item.value}
          </p>
          {item.hint && (
            <p className="text-[11px] font-normal" style={{ color: "var(--ink-3)" }}>
              {item.hint}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
