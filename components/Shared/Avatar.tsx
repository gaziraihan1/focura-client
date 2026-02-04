"use client";

import Image from "next/image";
import React from "react";

interface AvatarProps {
  image?: string | null;
  name: string;
  /** Tailwind size class pair, default w-9 h-9 */
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
} as const;

/** Deterministic colour from a string so the same user always gets the same ring */
function hashColor(str: string): string {
  const palette = [
    "bg-rose-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function Avatar({ image, name, size = "md" }: AvatarProps) {
  const initial = (name || "?")[0].toUpperCase();
  const sizeClass = SIZE_MAP[size];
  const colorClass = hashColor(name);

  if (image) {
    return (
      <Image
        width={28}
        height={28}
        src={image}
        alt={name}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-background`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} ${colorClass} inline-flex items-center justify-center rounded-full text-white font-semibold ring-2 ring-background`}
    >
      {initial}
    </span>
  );
}
