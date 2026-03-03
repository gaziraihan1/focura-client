"use client";

import Image from "next/image";

interface UserAvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md";
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-indigo-500",
];

export function UserAvatar({ name, image, size = "sm" }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // px values must match the Tailwind size classes below
  const px = size === "sm" ? 32 : 40;

  // sm → w-8 h-8 (32px), md → w-10 h-10 (40px)
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={px}
        height={px}
        className={`${sizeClass} rounded-full object-cover shrink-0`}
      />
    );
  }

  const colorClass = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
}