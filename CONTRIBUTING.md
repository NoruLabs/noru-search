# Contributing to Noru Search

Thank you for your interest in contributing. This document covers everything you need to get started.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Workflow](#workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Checklist](#pull-request-checklist)
- [Adding a New Dataset](#adding-a-new-dataset)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Code of Conduct](#code-of-conduct)

---

## Getting Started

1. **Fork** the repository on GitHub, then clone your fork:
   ```bash
   git clone https://github.com/<your-username>/noru-search.git
   cd noru-search
   npm install
   ```

2. **Create `.env.local`** in the project root:
   ```env
   NASA_API_KEY=your_api_key_here
   ```
   Free key at [api.nasa.gov](https://api.nasa.gov). `DEMO_KEY` works but has strict rate limits.

3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) and verify everything loads.

---

## Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # prefixes: feat/ fix/ docs/ refactor/
   ```

2. **Make focused commits.** One logical change per commit.

3. **Lint and build before pushing:**
   ```bash
   npm run lint
   npm run build
   ```

4. **Open a pull request** against `main`. Fill in the description and link any related issues.

---

## Coding Standards

### TypeScript
- Strict TypeScript. Avoid `any`; if unavoidable, leave a comment.
- All API response shapes go in `app/lib/types.ts`.
- Use named exports (components, hooks, utilities).

### React + Next.js
- Functional components only.
- Add `"use client"` only when the file needs hooks, event handlers, or browser APIs.
- All data fetching via **TanStack React Query** — one hook per dataset in `app/hooks/`.
- No inline styles. Use Tailwind CSS utility classes.

### File locations

| What | Where |
|------|-------|
| API route handlers | `app/api/nasa/<endpoint>/route.ts` |
| Dataset panel components | `app/components/datasets/` |
| Lightbox / detail views | `app/components/details/` |
| Chart components | `app/components/charts/` |
| Shared UI primitives | `app/components/ui/` |
| Data-fetching hooks | `app/hooks/` |
| Types and interfaces | `app/lib/types.ts` |
| Constants and config | `app/lib/constants.ts` |

**All NASA API calls must go through `app/api/nasa/`.** Never call NASA endpoints directly from client code.

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

| Type | Use for |
|------|---------|
| `feat` | New features |
| `fix` | Bug fixes |
| `docs` | Documentation only |
| `style` | Formatting / whitespace (no logic change) |
| `refactor` | Code restructuring without behavior change |
| `perf` | Performance improvements |
| `chore` | Build config, dependencies, tooling |

```
feat(apod): add date picker to APOD panel
fix(neo): correct date range in asteroid feed
docs: update dataset table in README
refactor(hooks): extract shared pagination logic
```

Keep summaries under 72 characters. Use imperative mood ("add", not "added").

---

## Pull Request Checklist

Before submitting:

- [ ] Dev server runs without errors.
- [ ] `npm run build` succeeds.
- [ ] `npm run lint` reports no errors.
- [ ] Changes render correctly on mobile and desktop.
- [ ] New environment variables are documented in `README.md`.
- [ ] New TypeScript types are added to `app/lib/types.ts`.

---

## Adding a New Dataset

1. **API route** → `app/api/nasa/<name>/route.ts` — accept query params, call the external API server-side, return JSON.
2. **Types** → `app/lib/types.ts` — define interfaces for the response shape.
3. **Hook** → `app/hooks/use<Name>.ts` — use TanStack React Query. Follow `useApod.ts` / `useNeo.ts` as reference.
4. **Panel** → `app/components/datasets/<Name>Panel.tsx` — import your hook, render the data.
5. **Register** — add an entry to `TAB_CONFIG` in `app/lib/constants.ts` and extend `DatasetTab` in `app/lib/types.ts`.
6. **Wire up** — add the panel to the `PANELS` record in `app/page.tsx`.
7. **Update the README** datasets table.

---

## Reporting Bugs

Open a GitHub issue with:

- **Summary** — one-sentence description.
- **Steps to reproduce** — exact actions to trigger the bug.
- **Expected vs. actual behavior.**
- **Environment** — browser, OS, screen size (if relevant).
- **Screenshots or console errors** — if applicable.

---

## Requesting Features

Open a GitHub issue with:

- **Problem statement** — what limitation does this address?
- **Proposed solution** — how you envision it working.
- **Alternatives considered** — other approaches you thought of.

---

## Code of Conduct

Be respectful, constructive, and inclusive. Harassment and personal attacks are not tolerated. Maintainers reserve the right to remove contributions that violate these standards.

---

## Questions

Open a GitHub issue or start a discussion. We're happy to help.
