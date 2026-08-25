import { SettingsCard } from "./SettingsCard";

export function SettingsSection({
  title,
  description,
  items,
  onItemClick,
}: {
  title: string;
  description: string;
  items: {
    title: string;
    description: string;
    icon: React.ElementType;
    active?: boolean;
  }[];
  onItemClick?: (title: string) => void;
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <SettingsCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            active={item.active}
            onClick={item.active ? () => onItemClick?.(item.title) : undefined}
          />
        ))}
      </div>
    </section>
  );
}