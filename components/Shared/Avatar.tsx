"use client";

import Image from "next/image";
import React from "react";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarUser {
  name?: string | null;
  image?: string | null;
}

interface AvatarProps {
  /** Direct props (existing callers). */
  image?: string | null;
  name?: string | null;
  /** Tailwind size class pair, default md (w-9 h-9). */
  size?: AvatarSize;
  /**
   * Optional custom background colour (hex/rgb/css) used for the initials
   * fallback instead of the deterministic hash palette. Honoured only when
   * there is no image.
   */
  color?: string;
  /**
   * Accept a user object ({ name, image }) instead of separate props.
   * Used by callers that already hold a user entity.
   */
  user?: AvatarUser;
  /**
   * Visual style of the fallback:
   * - "hash"  (default): deterministic coloured ring from the name.
   * - "muted": neutral bg-muted + border (matches legacy MemberAvatar).
   * - "gray": bg-gray-200/700 neutral (matches legacy ActivityList UserAvatar).
   */
  variant?: "hash" | "muted" | "gray";
  /** Render up to two initials from the name instead of just the first letter. */
  twoLetterInitials?: boolean;
  /** Extra classes merged onto the root element. */
  className?: string;
}

const SIZE_MAP: Record<AvatarSize, string> = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

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

function getInitials(name: string, twoLetter: boolean): string {
  if (!name) return "?";
  if (twoLetter) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return name[0].toUpperCase();
}

export function Avatar({
  image,
  name,
  size = "md",
  color,
  user,
  variant = "hash",
  twoLetterInitials = false,
  className = "",
}: AvatarProps) {
  const resolvedName = name ?? user?.name ?? undefined;
  const resolvedImage = image ?? user?.image ?? null;
  const sizeClass = SIZE_MAP[size];
  const initial = getInitials(resolvedName ?? "?", twoLetterInitials);

  if (resolvedImage) {
    return (
      <Image
        width={28}
        height={28}
        src={resolvedImage}
        alt={resolvedName ?? ""}
        className={`${sizeClass} ${className} rounded-full object-cover ring-2 ring-background`}
      />
    );
  }

  const fallbackBg =
    color !== undefined
      ? undefined
      : variant === "muted"
        ? "bg-muted text-muted-foreground"
        : variant === "gray"
          ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          : hashColor(resolvedName ?? "?");

  const style = color !== undefined ? { backgroundColor: color } : undefined;

  const rootClass = [
    sizeClass,
    className,
    "inline-flex items-center justify-center rounded-full font-semibold shrink-0 overflow-hidden",
    variant === "muted" ? "border border-border" : "ring-2 ring-background",
    fallbackBg ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={rootClass} style={style}>
      {initial}
    </span>
  );
}
