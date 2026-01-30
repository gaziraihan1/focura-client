interface KanbanCardTitleProps {
  title: string;
  description?: string | null;
}

export function KanbanCardTitle({
  title,
  description,
}: KanbanCardTitleProps) {
  return (
    <>
      <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {title}
      </h4>

      {description && (
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>
      )}
    </>
  );
}