import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <AlertCircle size={32} className="text-text-muted" />
      <p className="max-w-md text-center text-sm text-text-secondary">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-hover hover:bg-bg-card-hover"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}
