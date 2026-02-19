export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-primary">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">noru</span>
          <span className="text-sm font-light text-text-muted">search</span>
        </div>

        <p className="text-center text-xs text-text-muted">
          Data powered by{" "}
          <a
            href="https://api.nasa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary transition-colors hover:text-text-primary"
          >
            NASA Open APIs
          </a>{" "}
          &middot; Built by{" "}
          <a
            href="https://github.com/NoruLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary transition-colors hover:text-text-primary"
          >
            Noru Labs
          </a>
        </p>

        <p className="text-xs text-text-muted">
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
