export function Loader({ text = "Loading data..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
        <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-b-accent/30" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="text-sm text-text-muted">{text}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-3 h-4 w-2/3 skeleton" />
      <div className="mb-2 h-3 w-full skeleton" />
      <div className="mb-2 h-3 w-5/6 skeleton" />
      <div className="h-3 w-1/2 skeleton" />
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card flex items-center gap-3 rounded-xl p-3">
            <div className="h-10 w-10 rounded-xl skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-12 skeleton" />
              <div className="h-3 w-20 skeleton" />
            </div>
          </div>
        ))}
      </div>

      {/* APOD hero skeleton */}
      <div className="overflow-hidden rounded-2xl">
        <div className="h-72 w-full skeleton" />
      </div>

      {/* Cards skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-36 skeleton" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
