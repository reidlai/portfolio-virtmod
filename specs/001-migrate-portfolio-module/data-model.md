# Data Model: Portfolio Module Structure

**Feature**: [001-migrate-portfolio-module](./spec.md)

## Conceptual Model

The "Module" is defined by its file structure and strict boundaries managed by Moonrepo.

### Entities

#### 1. Repository Root (Workspace)

- **Identity**: `github.com/reidlai/portfolio-virtmod`
- **Configuration**: `moon.yml`, `package.json`, `go.work` (Source of Truth)
- **Role**: Manages the toolchain and executes tasks across the monolithic stack.

#### 2. Backend Component (`go/`)

- **Type**: Go Module
- **Path**: `./go`
- **Artifacts**: `bin/server` (conceptual)
- **Dependencies**: Managed via `go.mod`

#### 3. Frontend Component (`svelte/`)

- **Type**: SvelteKit Application
- **Path**: `./svelte`
- **Artifacts**: `.svelte-kit/output`
- **Dependencies**: Managed via `package.json` (pnpm)

#### 4. Shared Logic (`ts/`)

- **Type**: TypeScript Library
- **Path**: `./ts`
- **Artifacts**: `dist/` (JS/D.TS)
- **Dependencies**: Managed via `package.json` (pnpm)

## Relationships

- **Root -> Components**: Root `moon.yml` defines the graph.
- **Frontend -> Shared**: Svelte app likely imports from `ts/`.
- **Backend -> Shared**: No direct code dependency (distinct languages), but conceptually coupled in business logic.
