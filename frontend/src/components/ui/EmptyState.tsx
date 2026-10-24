"use client";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="space-y-3 mb-4 w-full max-w-[240px]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-3 rounded"
            style={{ background: "var(--sunken)", opacity: 0.5, width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
      <h3 className="text-lg font-semibold mt-4" style={{ color: "var(--ink)" }}>
        {title}
      </h3>
      <p className="text-sm mt-1 max-w-[44ch]" style={{ color: "var(--ink-2)" }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

