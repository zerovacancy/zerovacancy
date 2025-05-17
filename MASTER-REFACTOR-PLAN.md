# Master Refactor Plan

## Branching
- **Main refactor branch:** `main-refactor-overhaul`  
- **Sub-branches** will be created per phase off of `main-refactor-overhaul` (e.g. `main-refactor-overhaul/phase1-secure-stabilize`, etc.) as you progress.

## Overview
This document is both a README and a live checklist for the full refactor of this codebase. Each phase is laid out with duration, goals, and actionable tasks. Mark each task complete (`[x]`) as your terminal AI or team wraps it up.

---

## Phase 1: Secure & Stabilize  
**Duration:** 1 week  
**Goals:** Lock down secrets, clean dependencies, enforce React hook rules.

**Tasks:**  
- [x] Move all Supabase URLs / API keys / redirect bases into `import.meta.env` and remove hard-coded values.  
- [x] Delete the secondary lockfile (e.g. `bun.lockb` or `package-lock.json`), choose one package manager, update `.gitignore`.  
- [x] Run `npm ls react react-dom` to confirm a single React version; add a Vite alias or `resolutions` if duplicates remain.  
- [x] Enable ESLint's `react-hooks` rules and autofix; manually resolve any remaining "Invalid hook call" errors.  

---

## Phase 2: Test & Environment  
**Duration:** 2 weeks  
**Goals:** Establish a reliable CI pipeline, test coverage, and consistent environment setup.

**Tasks:**  
- [x] Standardize on Vitest as test runner; configure in `vite.config.ts` under `test`.  
- [x] Add coverage thresholds (e.g., 80%+ branches) and fail CI on regressions.  
- [x] Integrate MSW (Mock Service Worker) to stub Supabase and other external APIs in tests.  
- [x] Create a `.env.example` with all required variables documented.  
- [x] Update CI (GitHub Actions / your CI) to run lint, tests, and coverage checks on every PR.  

---

## Phase 3: Core Refactoring  
**Duration:** 3 weeks  
**Goals:** Simplify build config, enforce best practices in components and hooks, tighten types.

**Tasks:**  
- [ ] Remove invalid Vite options (e.g. `historyApiFallback`), re-enable CSS code-splitting with hashed filenames.  
- [ ] Simplify `manualChunks` to only group very large dependencies; remove duplicate plugins.  
- [ ] Lift all hook calls to top level; extract repeated logic into custom hooks (e.g. `useViewportHeight`, `useAuthSession`).  
- [ ] Replace all `any` types with strict interfaces; enable `strictNullChecks` and `noImplicitAny` in `tsconfig.json`.  
- [ ] Wrap pure, heavy components in `React.memo`; use `useMemo`/`useCallback` where needed.  

---

## Phase 4: Performance & Assets  
**Duration:** 2 weeks  
**Goals:** Optimize bundle size, eliminate layout shifts, automate asset handling.

**Tasks:**  
- [ ] Extract critical above-the-fold CSS inline at build time; lazy-load the rest.  
- [ ] Integrate `vite-plugin-imagetools` or `vite-imagemin` to generate WebP/AVIF and optimize images.  
- [ ] Self-host critical fonts via `@fontsource`, add `<link rel="preload">`, consolidate FOUC prevention into a single hook or plugin.  
- [ ] Purge archived/unused assets via a CI-run plugin (`vite-plugin-clean` or similar).  

---

## Phase 5: Future-Proofing  
**Duration:** 4+ weeks  
**Goals:** Add end-to-end & visual tests, pilot SSR/SSG, standardize your UI layer.

**Tasks:**  
- [ ] Write end-to-end tests (Cypress or Playwright) for core user flows (login, dashboard, key CRUD).  
- [ ] Add visual-regression testing (e.g. Cypress Image Snapshot).  
- [ ] Pilot SSR or partial hydration (Next.js or Vite SSR) on one critical page.  
- [ ] Migrate bespoke UI components into a shared library (ShadCN/Radix + CVA); publish versioned package.  
- [ ] Document design tokens, component APIs, and add usage examples.  

---

## Progress Tracking  
Use this file as the single source of truth. As each task completes, replace its checkbox:

```diff
- [ ] Task description
+ [x] Task description
```

## Current Status
- Phase: 2 - Test & Environment ✅ COMPLETED
- Next phase: Phase 3 - Core Refactoring
- Last updated: 2025-05-06

### Phase 2 Summary
- Set up Vitest as test runner with JSDOM environment
- Configured test coverage thresholds (70% lines, functions, statements, 60% branches)
- Added MSW for API mocking, particularly for Supabase endpoints
- Created reusable test utilities for component testing
- Set up GitHub Actions CI workflow for linting, type checking, and testing
- Added sample tests for Button component and AuthContext

### Phase 1 Summary
- Moved all Supabase API keys and URLs to environment variables
- Created .env.example for documentation of required environment variables
- Standardized on npm by removing bun.lockb and updating .gitignore
- Verified React dependencies are properly deduped (all using v18.2.0)
- Fixed hook rule violations in use-optimized-render.ts and web-vitals.ts
- Updated ESLint config to enforce strict React hooks rules