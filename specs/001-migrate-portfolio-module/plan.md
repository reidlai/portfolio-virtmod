# Implementation Plan: Portfolio Module Migration

**Branch**: `001-migrate-portfolio-module` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-migrate-portfolio-module/spec.md`

## Summary

Migrate the portfolio module (`go/`, `svelte/`, `ts/`) to a standalone remote repository `github.com/reidlai/portfolio-virtmod`. Use a single root `moon.yml` to manage the polyglot stack as a monolithic unit. Enable integration via `moon :add-module` global task in parent workspaces and support self-contained CI.

## Technical Context

**Language/Version**: Go 1.22+, Node.js v20 (LTS), Svelte 5, TypeScript ES2022
**Primary Dependencies**: Moonrepo, SvelteKit v2, TailwindCSS, RxJS v7, Go modules
**Storage**: N/A (Module logic only, no stated persistence layer in spec)
**Testing**: Go `testing`, Vitest (TS/Svelte), Playwright (Integration)
**Target Platform**: Linux/Windows (Cross-platform dev), Containerized prod
**Project Type**: Polyglot Module (Library + UI Components + Service)
**Performance Goals**: N/A
**Constraints**: Must work as standalone AND submodule; 12-factor config
**Scale/Scope**: ~3 distinct language components tightly coupled

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Branching**: Using issue branch `001-migrate-portfolio-module` (derived from SPEC).
- [x] **Environments**: Config via env vars (12-Factor).
- [x] **Containers**: N/A for this phase (module migration), but future build must use distroless.
- [x] **Secrets**: No secrets in repo; CI secret scan required.
- [x] **Dependencies**: Permissive licenses only.
- [x] **Testing**: BDD-first; Unit tests isolated.
- [x] **DevSecOps**: CI setup required (SCA, Lint, SAST, Secrets).
- [x] **Architecture**: Moonrepo authority; Go/Svelte/TS stack authorized.

## Project Structure

### Documentation (this feature)

```text
specs/001-migrate-portfolio-module/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
# Single Monolithic Project (per Clarification Q3)
.
├── moon.yml             # Root project config
├── package.json         # Root node dependencies (workspaces or single)
├── go.work              # Root go workspace
├── go.mod               # Shared go mod if applicable, or per-service
├── go/                  # Go backend code
│   ├── src/
│   └── go.mod
├── svelte/              # SvelteKit frontend
│   ├── src/
│   ├── package.json
│   └── svelte.config.js
├── ts/                  # Shared TypeScript logic
│   ├── src/
│   └── package.json
├── .github/
│   └── workflows/       # Self-contained CI
└── README.md            # Root documentation
```

**Structure Decision**: Single root project managing `go/`, `svelte/`, and `ts/` subdirectories.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |
