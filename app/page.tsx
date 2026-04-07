"use client";

import { ApodPreview } from "./apod/ApodPreview";
import { SpaceNewsPanel } from "./news/SpaceNewsPanel";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 space-y-12">
      <div className="w-full">
        <ApodPreview />
      </div>
      <div className="w-full">
        <SpaceNewsPanel
          limit={3}
          showViewAll={true}
          layout="grid"
        />
      </div>
    </main>
  );
}
