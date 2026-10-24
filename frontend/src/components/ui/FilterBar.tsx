"use client";

import { Search } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDef {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
}

interface FilterBarProps {
  search: { value: string; onChange: (v: string) => void; placeholder?: string };
  filters?: FilterDef[];
  onClear?: () => void;
  hasActiveFilters?: boolean;
}

export default function FilterBar({ search, filters, onClear, hasActiveFilters }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--ink-3)" }}
        />
        <input
          type="text"
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          placeholder={search.placeholder || "Search..."}
          className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-shadow"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
        />
      </div>
      {filters?.map((f) => (
        <select
          key={f.label}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
        >
          <option value="">{f.label}</option>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ))}
      {hasActiveFilters && onClear && (
        <button
          onClick={onClear}
          className="text-sm font-medium"
          style={{ color: "var(--primary)" }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

