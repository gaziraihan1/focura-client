export function FilterSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T | "";
  onChange: (v: T | "") => void;
  options: { value: T | ""; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T | "")}
      className="text-sm bg-background border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring shadow-sm transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}