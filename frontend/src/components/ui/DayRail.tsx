"use client";

interface DayRailProps {
  checkInAt?: string;
  checkOutAt?: string;
  officeStart?: string;
  graceMinutes?: number;
  status?: string;
  size?: "sm" | "lg";
}

const statusColors: Record<string, string> = {
  present: "var(--st-present-fg)",
  late: "var(--st-late-fg)",
  half_day: "var(--st-half-fg)",
  absent: "var(--st-absent-fg)",
  on_leave: "var(--st-leave-fg)",
  missing_checkout: "var(--st-missing-fg)",
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function DayRail({
  checkInAt,
  checkOutAt,
  officeStart = "09:00",
  graceMinutes = 15,
  status = "present",
  size = "lg",
}: DayRailProps) {
  const dayStart = 8 * 60; // 08:00
  const dayEnd = 20 * 60;  // 20:00
  const totalMinutes = dayEnd - dayStart;
  const officeStartMin = timeToMinutes(officeStart);
  const graceEndMin = officeStartMin + graceMinutes;

  const toPercent = (min: number) => ((min - dayStart) / totalMinutes) * 100;

  const graceLeft = toPercent(officeStartMin);
  const graceWidth = toPercent(graceEndMin) - graceLeft;

  const checkInMin = checkInAt ? timeToMinutes(checkInAt) : null;
  const checkOutMin = checkOutAt ? timeToMinutes(checkOutAt) : null;

  const workedLeft = checkInMin !== null ? toPercent(Math.max(checkInMin, dayStart)) : 0;
  const workedRight = checkOutMin !== null ? toPercent(Math.min(checkOutMin, dayEnd)) : 0;
  const workedWidth = checkInMin !== null ? (checkOutMin !== null ? workedRight - workedLeft : 50 - workedLeft) : 0;

  const isSmall = size === "sm";
  const trackH = isSmall ? "h-1.5" : "h-2.5";
  const dotSize = isSmall ? 8 : 12;

  return (
    <div
      className={`relative ${isSmall ? "w-[120px]" : "w-full"}`}
      role="img"
      aria-label={
        checkInAt
          ? `Checked in ${formatTime(checkInAt)}${checkOutAt ? `, checked out ${formatTime(checkOutAt)}` : ""}, ${status}`
          : "Not checked in"
      }
    >
      {/* Track */}
      <div
        className={`${trackH} rounded-full relative overflow-hidden`}
        style={{ background: "var(--sunken)" }}
      >
        {/* Grace window */}
        <div
          className="absolute top-0 bottom-0 rounded-full"
          style={{
            left: `${graceLeft}%`,
            width: `${graceWidth}%`,
            background: "var(--highlight-soft)",
          }}
        />
        {/* Worked time */}
        {checkInMin !== null && (
          <div
            className="absolute top-0 bottom-0 rounded-full"
            style={{
              left: `${workedLeft}%`,
              width: `${Math.max(workedWidth, 1)}%`,
              background: "var(--primary)",
            }}
          />
        )}
      </div>
      {/* Check-in dot */}
      {checkInMin !== null && (
        <div
          className="absolute rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            left: `${workedLeft}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: statusColors[status] || "var(--primary)",
          }}
        />
      )}
      {/* Labels (lg only) */}
      {!isSmall && (
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] font-mono tabular-nums" style={{ color: "var(--ink-3)" }}>
            {checkInAt ? formatTime(checkInAt) : "Not checked in"}
          </span>
          {checkOutAt && (
            <span className="text-[11px] font-mono tabular-nums" style={{ color: "var(--ink-3)" }}>
              {formatTime(checkOutAt)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

