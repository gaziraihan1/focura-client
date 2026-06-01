function initials(name?: string | null) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}
export function Avatar({
  name,
  image,
  size = "md",
  color,
}: {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  color?: string;
}) {
  const dim =
    size === "sm" ? "w-7 h-7 text-[10px]" :
    size === "lg" ? "w-12 h-12 text-base"  :
                    "w-9 h-9 text-xs";

  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden ring-1 ring-border`}
      style={{ backgroundColor: image ? undefined : (color ?? "var(--muted)") }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name ?? ""} className="w-full h-full object-cover" />
      ) : (
        <span className="text-foreground/70">{initials(name)}</span>
      )}
    </div>
  );
}
