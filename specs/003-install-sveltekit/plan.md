# Implementation Plan: Install SvelteKit Tooling

**Branch**: `feature/003-install-sveltekit` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-install-sveltekit/spec.md`

## Summary

Migrate the existing vanilla Svelte module (`modules/portfolio/svelte`) to a standard SvelteKit Library structure. This involves installing `@sveltejs/kit` (for virtual modules and automated types) and `@sveltejs/package` (for library building), while using `adapter-auto` to enable local unified development (`npm run dev`).

## Technical Context

**Language/Version**: Svelte 5 (latest), TypeScript ES2022
**Primary Dependencies**: `@sveltejs/kit`, `@sveltejs/package`, `@sveltejs/adapter-auto`
**Storage**: N/A
**Testing**: `vitest` (unit), `svelte-check` (types)
**Target Platform**: Submodule Library embedded in SvelteKit Host App
**Project Type**: Module/Library
**Performance Goals**: N/A (Build-time capability)
**Constraints**: Must not bundle SvelteKit runtime in `dist/` (Peer Dependency).

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Rule 1 (Branching)**: Working on `feature/003-...`.
- [x] **Rule 5 (Dependencies)**: `@sveltejs/kit` and `@sveltejs/package` are MIT licensed (Permissive).
- [x] **Rule 9 (Directories)**: Project lives in `modules/portfolio/svelte/src`.
- [x] **Rule 11 (Project Types)**: Identified as "Module/Library Project". No CD pipeline required (CI only).
- [x] **Moonrepo Governance**: Tasks will be mapped in `moon.yml` (e.g., `build` -> `svelte-package`).

## Project Structure

### Documentation (this feature)

```text
specs/003-install-sveltekit/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # N/A (Tooling change)
├── quickstart.md        # N/A
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
modules/portfolio/svelte/
├── .svelte-kit/         # [NEW] Generated types (gitignored)
├── dist/                # [NEW] Build output
├── src/
│   ├── lib/             # Source components
│   └── routes/          # [NEW] Dev-only routes for preview
├── package.json         # Updated scripts & deps
├── svelte.config.js     # Updated for Kit
├── tsconfig.json        # Updated to extend Kit
└── vite.config.ts       # Updated to use sveltekit()
```

**Structure Decision**: Standard SvelteKit Library structure.

## Complexity Tracking

N/A - Standard tooling alignment.
