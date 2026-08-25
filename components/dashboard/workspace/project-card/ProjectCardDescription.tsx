interface ProjectCardDescriptionProps {
  description?: string | null;
}

export function ProjectCardDescription({ description }: ProjectCardDescriptionProps) {
  if (!description) return null;

  return (
    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4">
      {description}
    </p>
  );
}