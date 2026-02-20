# Contributing to Noru Search

Thank you for your interest in contributing. This document explains the process for submitting changes, the standards we follow, and how to set up the project for local development.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Adding a New Dataset](#adding-a-new-dataset)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

Be respectful, constructive, and inclusive. Harassment, discrimination, and personal attacks are not tolerated. Maintainers reserve the right to remove comments, commits, or contributions that violate these standards.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/noru-search.git
   cd noru-search
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables.** Create a `.env.local` file:
   ```
   NASA_API_KEY=your_api_key_here
   ```
   Get a free key at [api.nasa.gov](https://api.nasa.gov/). The `DEMO_KEY` works but has strict rate limits.
5. **Start the dev server:**
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) and verify everything loads.

---

## How to Contribute

- **Bug fixes** -- Find an open issue labeled `bug` or report a new one.
- **New features** -- Open an issue first to discuss the idea before writing code.
- **Documentation** -- Improvements to README, inline comments, or this file are always welcome.
- **Refactors** -- If you see a way to simplify or improve existing code, open an issue or PR with a clear explanation of the change.

---

## Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
   Use a descriptive branch name. Prefix with `feat/`, `fix/`, `docs/`, or `refactor/` as appropriate.

2. **Make your changes.** Keep each commit focused on a single logical change.

3. **Lint your code** before committing:
   ```bash
   npm run lint
   ```
   Fix any errors. Do not disable ESLint rules without a strong justification.

4. **Test locally.** Run `npm run build` to ensure the production build succeeds. Manually verify your changes in the browser.

5. **Push** your branch and open a pull request against `main`.

---

## Coding Standards

### TypeScript

- Use strict TypeScript. Do not use `any` unless absolutely necessary, and leave a comment explaining why.
- Define interfaces for all API response shapes in `app/lib/types.ts`.
- Prefer named exports over default exports (components, hooks, utilities).

### React and Next.js

- Use functional components exclusively.
- Place `"use client"` at the top of files that require client-side features (hooks, event handlers, browser APIs). Keep server components as the default wherever possible.
- Use TanStack React Query for all data fetching. Each dataset should have a dedicated hook in `app/hooks/`.
- Avoid inline styles. Use Tailwind CSS utility classes.

### File Organization

| Type | Location |
|------|----------|
| API route handlers | `app/api/nasa/<endpoint>/route.ts` |
| Dataset panel components | `app/components/datasets/` |
| Detail/lightbox views | `app/components/details/` |
| Chart components | `app/components/charts/` |
| Shared UI primitives | `app/components/ui/` |
| Data-fetching hooks | `app/hooks/` |
| Types and interfaces | `app/lib/types.ts` |
| Constants and config | `app/lib/constants.ts` |

### API Routes

All NASA API calls go through server-side route handlers in `app/api/nasa/`. Never call NASA endpoints directly from client code. This keeps the API key on the server and provides a single place to handle errors and rate limiting.

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short summary>
```

**Types:**

| Type | Use for |
|------|---------|
| `feat` | New features |
| `fix` | Bug fixes |
| `docs` | Documentation-only changes |
| `style` | Formatting, whitespace (no logic changes) |
| `refactor` | Code restructuring without behavior changes |
| `perf` | Performance improvements |
| `chore` | Build config, dependencies, tooling |

**Examples:**

```
feat(mars): add camera filter to rover photo panel
fix(neo): correct date range validation for asteroid feed
docs: update README with new dataset table
refactor(hooks): extract shared pagination logic
```

Keep the summary under 72 characters. Use the imperative mood ("add", not "added" or "adds").

---

## Pull Request Process

1. **Fill in the PR description.** Describe what changes you made and why. Link any related issues.
2. **Keep PRs focused.** One feature or fix per pull request. Large PRs are harder to review and more likely to stall.
3. **Ensure the build passes.** Run `npm run build` and `npm run lint` locally before pushing.
4. **Respond to review feedback** promptly. Maintainers may request changes before merging.
5. **Squash commits** if your PR has many small fixup commits. A clean history is easier to maintain.

### PR Checklist

Before submitting, verify:

- [ ] The development server runs without errors.
- [ ] `npm run build` succeeds.
- [ ] `npm run lint` reports no errors.
- [ ] New or changed components render correctly on mobile and desktop.
- [ ] Any new environment variables are documented in the README.
- [ ] New TypeScript types are added to `app/lib/types.ts`.

---

## Adding a New Dataset

If you want to integrate a new NASA API or data source, follow this pattern:

1. **Create an API route** at `app/api/nasa/<name>/route.ts`. The handler should accept query parameters, call the external API with the server-side key, and return JSON.

2. **Define types** in `app/lib/types.ts` for the API response shape.

3. **Create a hook** at `app/hooks/use<Name>.ts` using TanStack React Query. Follow the pattern established by existing hooks (e.g., `useApod.ts`, `useNeo.ts`).

4. **Build a panel component** at `app/components/datasets/<Name>Panel.tsx`. Import and use your hook for data fetching.

5. **Register the tab** in `app/lib/constants.ts` by adding an entry to `TAB_CONFIG` and extending the `DatasetTab` union in `app/lib/types.ts`.

6. **Wire it into the main page** by adding the panel to the `PANELS` record in `app/page.tsx`.

7. **Update the README** datasets table.

---

## Reporting Bugs

Open a GitHub issue with the following information:

- **Summary** -- A clear, one-sentence description of the bug.
- **Steps to reproduce** -- The exact actions to trigger the problem.
- **Expected behavior** -- What should happen.
- **Actual behavior** -- What happens instead.
- **Environment** -- Browser, OS, and screen size if relevant.
- **Screenshots or console errors** -- If applicable.

---

## Requesting Features

Open a GitHub issue with:

- **Problem statement** -- What limitation or need does this address?
- **Proposed solution** -- How you envision it working.
- **Alternatives considered** -- Other approaches you thought of.

Feature requests are not guaranteed to be implemented, but well-reasoned proposals with clear use cases are more likely to be accepted.

---

## Questions

If you have questions that are not covered here, open a GitHub issue or start a discussion. We are happy to help.
