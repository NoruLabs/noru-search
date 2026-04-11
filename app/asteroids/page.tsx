import { AsteroidsPanel } from "./AsteroidsPanelClient";

export default function AsteroidsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Near Earth Asteroids</h1>
        <p className="text-text-secondary text-sm mt-1">Live tracking of asteroids passing close to Earth within the next 7 days.</p>
      </div>

      <AsteroidsPanel />
    </div>
  );
}
