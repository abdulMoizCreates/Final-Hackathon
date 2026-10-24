"use client";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Could not load data. Check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <p className="text-sm" style={{ color: "var(--st-absent-fg)" }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "var(--sunken)", color: "var(--ink)" }}
        >
          Try again
        </button>
      )}
    </div>
  );
}

