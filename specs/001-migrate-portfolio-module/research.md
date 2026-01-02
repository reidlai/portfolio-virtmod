# Research: Portfolio Module Migration

**Feature**: [001-migrate-portfolio-module](./spec.md)

## Decisions and Findings

### 1. Existing Repository Structure (Current State)

- **Status**: Analyzed
- **Finding**: The repository currently contains `go/`, `svelte/`, and `ts/` directories at the root.
  - `go/`: Contains `go.mod` (Go module).
  - `svelte/`: Contains `package.json` (SvelteKit app/lib).
  - `ts/`: Contains `package.json` (TypeScript lib).
- **Missing**:
  - Root `moon.yml` (Moonrepo project config).
  - Root `package.json` (Workspace root).
  - `.moon/` directory (Moonrepo workspace config).

### 2. Moonrepo Project Strategy

- **Decision**: Single Monolithic Project (per Spec Clarification Q3).
- **Rationale**: The user explicitly requested a "Single Root Project" structure.
- **Implementation**:
  - A single `moon.yml` at the root will define tasks for all sub-components (`go`, `svelte`, `ts`).
  - Tasks will use `fileGroups` or explicit command paths (e.g., `cd go && go build`) to target subdirectories.
  - This deviates from the standard "one project per folder" Moonrepo pattern but fulfills the user's specific "tight integration" requirement.

### 3. CI/CD Strategy

- **Decision**: Self-Contained GitHub Actions.
- **Rationale**: To verify the module independently of the parent workspace.
- **Implementation**:
  - `.github/workflows/ci.yml` will be created.
  - It will install Moonrepo and run `moon run test` (or equivalent root task).
  - It must set up both Go and Node.js toolchains.

### 4. Toolchain Configuration

- **Decision**: Managed via Moonrepo.
- **Implementation**:
  - Root `package.json` will define `packageManager` (likely `pnpm`).
  - `.moon/toolchain.yml` will pin Node.js and Go versions (Go 1.22+, Node v20).
  - This ensures `EC-003` (Missing Toolchains) is handled.
