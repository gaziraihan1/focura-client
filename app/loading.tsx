export default function HomeLoading() {
  const bar = "animate-pulse rounded bg-muted";

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero skeleton ─────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
        <div className={`${bar} h-6 w-32 mb-6`} />
        <div className={`${bar} h-12 w-96 max-w-full mb-4`} />
        <div className={`${bar} h-12 w-80 max-w-full mb-6`} />
        <div className={`${bar} h-5 w-[28rem] max-w-full mb-2`} />
        <div className={`${bar} h-5 w-72 max-w-full mb-10`} />
        <div className="flex gap-4">
          <div className={`${bar} h-11 w-36 rounded-lg`} />
          <div className={`${bar} h-11 w-36 rounded-lg`} />
        </div>
      </section>

      {/* ── Logos / integrations strip ───────────── */}
      <section className="py-12 px-4">
        <div className="flex items-center justify-center gap-8 flex-wrap max-w-5xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${bar} h-8 w-24 rounded`} />
          ))}
        </div>
      </section>

      {/* ── Feature showcase ─────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-6">
        <div className={`${bar} h-8 w-64 mx-auto`} />
        <div className={`${bar} h-4 w-96 max-w-full mx-auto`} />
        <div className={`${bar} h-64 w-full rounded-2xl`} />
      </section>

      {/* ── Value props grid ─────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className={`${bar} h-8 w-56 mx-auto mb-4`} />
        <div className={`${bar} h-4 w-80 mx-auto mb-12`} />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className={`${bar} h-10 w-10 rounded-lg`} />
              <div className={`${bar} h-5 w-3/4`} />
              <div className={`${bar} h-3 w-full`} />
              <div className={`${bar} h-3 w-2/3`} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Steps ────────────────────────────────── */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className={`${bar} h-8 w-48 mx-auto mb-12`} />
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className={`${bar} h-12 w-12 rounded-full shrink-0`} />
              <div className="flex-1 space-y-2">
                <div className={`${bar} h-5 w-48`} />
                <div className={`${bar} h-3 w-72 max-w-full`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className={`${bar} h-8 w-40 mx-auto mb-12`} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-8 space-y-4">
              <div className={`${bar} h-5 w-24`} />
              <div className={`${bar} h-9 w-28`} />
              <div className={`${bar} h-3 w-full`} />
              <div className={`${bar} h-3 w-full`} />
              <div className={`${bar} h-10 w-full rounded-lg`} />
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section className="py-20 px-4 max-w-3xl mx-auto space-y-4">
        <div className={`${bar} h-8 w-48 mx-auto mb-8`} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className={`${bar} h-4 w-3/4`} />
          </div>
        ))}
      </section>
    </div>
  );
}
