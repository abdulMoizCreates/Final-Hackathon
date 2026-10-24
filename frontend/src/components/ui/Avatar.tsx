"use client";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };

export default function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-medium shrink-0`}
      style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
    >
      {initials}
    </div>
  );
}

