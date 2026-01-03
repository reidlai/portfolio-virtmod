# Feature Specification: Install SvelteKit Tooling

**Feature Branch**: `feature/003-install-sveltekit`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "Need to install SvelteKit for svelte/ language stack in this project"

## Clarifications

### Session 2026-01-03

- Q: Which SvelteKit adapter should be used? -> A: **Library + Dev Preview**: Use `@sveltejs/package` for build, and `adapter-auto` for dev.

## User Scenarios & Testing

### User Story 1 - Automated Type Generation (Priority: P1)

As a developer working on the `svelte` module, I want the system to automatically generate TypeScript definitions for SvelteKit virtual modules (like `$app/navigation`) so that I don't have to manually maintain conflicting declarations in `ambient.d.ts` and `app.d.ts`.

**Why this priority**: It resolves current type conflicts and reduces maintenance burden.

**Independent Test**: Can be tested by running `svelte-kit sync` and verifying that `$app/navigation` is correctly typed in VS Code without manual declaration files.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repo, **When** I run `pnpm install`, **Then** SvelteKit types are generated automatically (via postinstall).
2. **Given** I use `$app/navigation` in a component, **When** I check types, **Then** it resolves to the official SvelteKit definition.

---

### User Story 2 - Standard Library Packaging (Priority: P2)

As a developer, I want to build the module using standard Svelte packaging (`@sveltejs/package`) so that the output preserves component structure and allows for better tree-shaking when consumed by parent apps.

**Why this priority**: The user requested to "simplify code" and follow standard practices.

**Independent Test**: Build the project and inspect the `dist` folder to see discrete `.svelte` files and `index.d.ts`.

**Acceptance Scenarios**:

1. **Given** the source code, **When** I run `pnpm build`, **Then** the output contains a valid Svelte package structure (not a single bundled JS file).

---

## Requirements

### Functional Requirements

- **FR-001**: The system MUST detect SvelteKit configuration in `svelte.config.js`.
- **FR-002**: The build process MUST use `@sveltejs/package` to generate distributable library artifacts (`dist/` folder with preserved structure).
- **FR-003**: The development environment MUST support SvelteKit virtual modules via `vite-plugin-sveltekit`.
- **FR-004**: The system MUST NOT bundle SvelteKit runtime code into the library output; it should treat it as a peer dependency or development-only environment.
- **FR-005**: The project MUST use standard `.svelte-kit` generated types in `tsconfig.json`.
- **FR-006**: The development environment MUST use `adapter-auto` to allow developers to run `npm run dev` for visual component testing/preview.
- **FR-003**: The development environment MUST support SvelteKit virtual modules via `vite-plugin-sveltekit`.
- **FR-004**: The system MUST NOT bundle SvelteKit runtime code into the library output; it should treat it as a peer dependency or development-only environment.
- **FR-005**: The project MUST use standard `.svelte-kit` generated types in `tsconfig.json`.

### Key Entities

- **dist/**: The output directory containing standard Svelte package format.
- **.svelte-kit/**: The generated directory containing type definitions.

## Success Criteria

### Measurable Outcomes

- **SC-001**: `app.d.ts` and `ambient.d.ts` contain NO manual declarations for `$app/navigation`.
- **SC-002**: `svelte-check` passes with zero errors.
- **SC-003**: Build output contains individual `.svelte` component files in `dist/`.
