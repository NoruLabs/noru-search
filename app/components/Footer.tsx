import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="border-t border-border/40" />
        <div className="flex flex-col items-center justify-between gap-3 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/noru-icon.png"
              alt="Noru Search logo"
              width={20}
              height={20}
            />
            <span className="text-sm font-semibold text-text-primary">noru</span>
            <span className="text-sm font-light text-text-muted">search</span>
          </div>

          <p className="text-center text-xs text-text-muted">
            Powered by{" "}
            <a
              href="https://api.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary transition-colors hover:text-text-primary"
            >
              NASA Open APIs
            </a>
            {" "}&middot;{" "}
            <a
              href="https://github.com/NoruLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary transition-colors hover:text-text-primary"
            >
              Noru Labs
            </a>
          </p>

          <p className="text-xs text-text-muted/60">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
