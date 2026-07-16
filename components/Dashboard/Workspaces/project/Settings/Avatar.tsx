// Thin wrapper over the shared Avatar primitive, preserving the custom `color`
// fallback background used by the project members tab.
import { Avatar as SharedAvatar } from '@/components/Shared/Avatar';

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
  return (
    <SharedAvatar
      name={name}
      image={image}
      size={size}
      color={color}
      twoLetterInitials
      className="font-bold"
    />
  );
}
