export function Loader({ text = "Loading data..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="text-sm text-text-muted">{text}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-bg-card p-5">
      <div className="mb-3 h-4 w-2/3 rounded bg-border" />
      <div className="mb-2 h-3 w-full rounded bg-border" />
      <div className="mb-2 h-3 w-5/6 rounded bg-border" />
      <div className="h-3 w-1/2 rounded bg-border" />
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-bg-card p-3">
            <div className="h-9 w-9 rounded-lg bg-border" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-10 rounded bg-border" />
              <div className="h-3 w-20 rounded bg-border" />
            </div>
          </div>
        ))}
      </div>

      {/* APOD skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-48 rounded bg-border" />
        <div className="rounded-lg border border-border bg-bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="h-48 w-full shrink-0 rounded-lg bg-border sm:w-64" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-3/4 rounded bg-border" />
              <div className="h-3 w-32 rounded bg-border" />
              <div className="h-3 w-full rounded bg-border" />
              <div className="h-3 w-5/6 rounded bg-border" />
              <div className="h-3 w-2/3 rounded bg-border" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-36 rounded bg-border" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
