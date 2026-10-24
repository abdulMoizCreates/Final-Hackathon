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
  emptyTitle = "No data",
  emptyDescription = "Nothing to show yet.",
}: DataTableProps) {
  if (loading) return <SkeletonTable rows={5} cols={columns.length} />;

  if (!data.length) {
    return (
      <div className="rounded-xl" style={{ background: "var(--surface)" }}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-xs font-medium whitespace-nowrap"
                  style={{ color: "var(--ink-3)", textAlign: col.align || "left" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer" : ""}
                style={{ borderBottom: "1px solid var(--line)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sunken)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 whitespace-nowrap"
                    style={{ textAlign: col.align || "left" }}
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

