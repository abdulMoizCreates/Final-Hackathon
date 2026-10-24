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
    <div className="flex flex-wrap items-center gap-3 mb-6 font-sans">
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--ink-3)" }}
        />
        <input
          type="text"
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          placeholder={search.placeholder || "Search records..."}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none shadow-soft transition-all focus:bg-white"
          style={{
            background: "var(--surface)",
            color: "var(--ink)",
          }}
        />
      </div>
      {filters?.map((f) => (
        <select
          key={f.label}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm outline-none shadow-soft transition-all cursor-pointer"
          style={{
            background: "var(--surface)",
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
          className="text-xs font-semibold px-2 py-1 rounded-lg hover:underline transition-all"
          style={{ color: "var(--primary)" }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
