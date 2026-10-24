"use client";

const statusMap: Record<string, { fg: string; bg: string; label: string }> = {
  present:     { fg: "var(--st-present-fg)", bg: "var(--st-present-bg)", label: "Present" },
  late:        { fg: "var(--st-late-fg)",    bg: "var(--st-late-bg)",    label: "Late" },
  half_day:    { fg: "var(--st-half-fg)",    bg: "var(--st-half-bg)",    label: "Half day" },
  absent:      { fg: "var(--st-absent-fg)",  bg: "var(--st-absent-bg)",  label: "Absent" },
  on_leave:    { fg: "var(--st-leave-fg)",   bg: "var(--st-leave-bg)",   label: "On leave" },
  missing_checkout: { fg: "var(--st-missing-fg)", bg: "var(--st-missing-bg)", label: "Missing check-out" },
  pending:     { fg: "var(--st-missing-fg)", bg: "var(--st-missing-bg)", label: "Pending" },
  approved:    { fg: "var(--st-present-fg)", bg: "var(--st-present-bg)", label: "Approved" },
  rejected:    { fg: "var(--st-absent-fg)",  bg: "var(--st-absent-bg)",  label: "Rejected" },
  cancelled:   { fg: "var(--st-missing-fg)", bg: "var(--st-missing-bg)", label: "Cancelled" },
  draft:       { fg: "var(--st-half-fg)",    bg: "var(--st-half-bg)",    label: "Draft" },
  finalized:   { fg: "var(--st-present-fg)", bg: "var(--st-present-bg)", label: "Finalized" },
  active:      { fg: "var(--st-present-fg)", bg: "var(--st-present-bg)", label: "Active" },
  inactive:    { fg: "var(--st-missing-fg)", bg: "var(--st-missing-bg)", label: "Inactive" },
  probation:   { fg: "var(--st-late-fg)",    bg: "var(--st-late-bg)",    label: "Probation" },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = statusMap[status] || { fg: "var(--ink-3)", bg: "var(--sunken)", label: status };
  return (
    <span
      className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: s.fg, background: s.bg }}
    >
      {s.label}
    </span>
  );
}
