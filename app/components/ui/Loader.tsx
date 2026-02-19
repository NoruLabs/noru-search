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
