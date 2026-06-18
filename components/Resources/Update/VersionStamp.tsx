type VersionStampProps = {
  version: string;
};

export function VersionStamp({ version }: VersionStampProps) {
  return (
    <span className="inline-flex -rotate-3 items-center rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 font-mono text-sm font-semibold tracking-tight text-primary">
      v{version}
    </span>
  );
}