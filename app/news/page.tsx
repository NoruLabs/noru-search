"use client";

import { SpaceNewsPanel } from "./SpaceNewsPanel";

export default function SpaceNewsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <SpaceNewsPanel limit={6} />
    </main>
  );
}

