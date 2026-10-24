"use client";

import EmptyState from "./EmptyState";
import { SkeletonTable } from "./Skeleton";

interface Column {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  onRowClick?: (row: Record<string, unknown>) => void;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function DataTable({
  columns,
  data,
  onRowClick,
  loading,
  emptyTitle = "No data found",
  emptyDescription = "There are no records to display at this time.",
}: DataTableProps) {
  if (loading) return <SkeletonTable rows={5} cols={columns.length} />;

  if (!data.length) {
    return (
      <div className="rounded-2xl shadow-card" style={{ background: "var(--surface)" }}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-card font-sans" style={{ background: "var(--surface)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr style={{ background: "var(--sunken)" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: "var(--ink-3)", textAlign: col.align || "left" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60">
            {data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sunken)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-5 py-3.5 whitespace-nowrap"
                    style={{ textAlign: col.align || "left", color: "var(--ink)" }}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] as React.ReactNode) ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
