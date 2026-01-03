# Research: SvelteKit Library + Dev Preview

**Feature**: Install SvelteKit Tooling
**Date**: 2026-01-03

## Topic: Library Mode with Development Preview

### Problem

We want to build a clean Svelte library (using `@sveltejs/package`) but also have a local development environment (`npm run dev`) to preview widgets.

### Findings

1. **`@sveltejs/package` Behavior**:
   - By default, it **only** treats `src/lib` as the library source.
   - It ignores `src/routes`, `src/app.html`, etc.
   - This means we can safely add a `src/routes` folder for our "Dev Preview" app without polluting the distributed library.

2. **`adapter-auto` Role**:
   - The adapter is only used when running `vite build` (App Build).
   - Since our primary build artifact is the _library_ (produced by `svelte-kit package`), the adapter configuration in `svelte.config.js` mainly serves to allow `vite dev` to function correctly.
   - Using `adapter-auto` is safe; it won't affect the package output.

### Decision

**Adopt "Hybrid" Structure**:

- `src/lib`: Contains the actual code (Widgets, Types).
- `src/routes`: Contains a "Test Harness" app to render the widgets for local dev.
- `package.json`:
  - `scripts.dev`: `vite dev` (Runs the test harness)
  - `scripts.build`: `svelte-kit package` (Builds the library from `src/lib`)

### Alternatives Considered

- **Storybook**: Too heavy for this simple need.
- **Vite Library Mode (Current)**: Doesn't support SvelteKit virtual modules easily.
