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
      className="rounded-xl p-6 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      style={{ background: "var(--surface)" }}
    >
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
            {item.label}
          </p>
          <p className="text-3xl font-medium tabular-nums" style={{ color: "var(--ink)" }}>
            {item.value}
          </p>
          {item.hint && (
            <p className="text-xs mt-1" style={{ color: "var(--ink-3)" }}>
              {item.hint}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
