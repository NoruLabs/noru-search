import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft">
        <AlertCircle size={28} className="text-text-secondary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-text-primary mb-1">Something went wrong</p>
        <p className="max-w-md text-sm text-text-muted">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl border border-border/60 px-5 py-2.5 text-sm font-medium text-text-primary transition-all hover:border-border-hover hover:bg-bg-card-hover active:scale-95"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}
