# Tasks: Portfolio Module Migration

**Feature**: [001-migrate-portfolio-module](./spec.md)
**Plan**: [plan.md](./plan.md)

## Phase 1: Setup

> **Goal**: Initialize the standalone Moonrepo workspace and toolchain configuration.

- [x] T001 Create `.moon/workspace.yml` using `setup-toolchain` preset in `.moon/workspace.yml`
- [x] T002 Create `.moon/toolchain.yml` configuring Node v20/pnpm and Go 1.22 in `.moon/toolchain.yml`
- [x] T003 Create root `package.json` to manage toolchain and `devDependencies` in `package.json`
- [x] T004 Create root `moon.yml` to define the monolithic project structure in `moon.yml`

## Phase 2: Foundational

> **Goal**: Establish usage of self-contained CI/CD for independent validation and enforce DevSecOps gates.

- [x] T005 [P] Create GitHub Actions CI workflow in `.github/workflows/ci.yml` including:
  - `moon run test` (Unit Tests)
  - `moon run lint` (Formatting/Linting)
  - SCA (Source Composition Analysis)
  - Secret Scanning
  - SAST/Threat Modeling (producing `threat_modelling/reports/pr-threats.json`)
- [x] T005a Create root `pre-commit-config.yaml` for local hooks in `pre-commit-config.yaml`
- [x] T005b Create `local-devsecops.sh` script for compliance validation in `local-devsecops.sh`
- [x] T005c Scaffold `threat_modelling/` directory and `reports/` subdirectory in `threat_modelling/README.md`
- [x] T005d Create `release-plz` or semantic release GitHub Action for automated tagging/publishing in `.github/workflows/release.yml`

## Phase 3: Module Migration & Integration [US1]

> **Goal**: Integrate Go, Svelte, and TS components and verify `moon :add-module` readiness.
> **Independent Test**: `moon run build` and `moon run test` check all sub-components.

- [x] T006 [US1] Configure Go backend tasks (build, test) targeting `go/` in `moon.yml`
- [x] T007 [US1] Configure Svelte frontend tasks (dev, build, check) targeting `svelte/` in `moon.yml`
- [x] T008 [US1] Configure TypeScript shared lib tasks (build, lint) targeting `ts/` in `moon.yml`
- [x] T009 [US1] Verify and update `go.work` and root `go.mod` for workspace cohesion in `go.work`

## Phase 4: Developer Onboarding [US2]

> **Goal**: Provide comprehensive documentation for module usage and architecture.
> **Independent Test**: New developer can follow README to start environment.

- [x] T010 [US2] Create root `README.md` with Overview and Quick Start in `README.md`
- [x] T010a [US2] Create `docs/CI-PIPELINE.md` detailing the CI workflow and Release process in `docs/CI-PIPELINE.md`
- [x] T010b [US2] Create `docs/VIRTUAL-MODULE-ARCHITECTURE.md` describing internal structure in `docs/VIRTUAL-MODULE-ARCHITECTURE.md`
- [x] T010c [US2] Create `docs/FUNCTIONAL-DOCUMENTATION.md` describing module capabilities in `docs/FUNCTIONAL-DOCUMENTATION.md`
- [x] T010d [US2] Create `docs/DEVELOPER-REFERENCE.md` with SOLID principles and dev guidelines in `docs/DEVELOPER-REFERENCE.md`
- [x] T012 [P] [US2] Create or verify `LICENSE` file in `LICENSE`

## Phase 5: Polish

- [x] T013 Verify full workspace build and test execution via `moon run :test` in terminal

## Dependencies

- Phase 1 (Setup) blocks all other phases.
- Phase 2 (CI) is independent of code logic but blocks merge.
- Phase 3 (US1) is technically independent of Phase 4 (US2), but Phase 4 relies on Phase 3 working to document it accurately.

## Implementation Strategy

1.  **Initialize Workspace**: Set up Moonrepo first to handle toolchain.
2.  **Wire Components**: Connect existing folders to Moonrepo tasks.
3.  **Document**: Write the manual once the system works.
4.  **CI**: Enforce quality gates.
