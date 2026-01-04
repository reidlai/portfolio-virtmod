# Tasks: Install SvelteKit Tooling

**Branch**: `feature/003-install-sveltekit` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Phase 1: Setup

- [x] T001 Install SvelteKit dependencies in `modules/portfolio/svelte/package.json`
- [x] T002 Update `modules/portfolio/svelte/package.json` scripts (`build` -> `svelte-kit package`)
- [x] T003 Create `.svelte-kit` entry in `.gitignore`

## Phase 2: Foundation (Configuration)

- [x] T004 Update `svelte.config.js` to use `@sveltejs/adapter-auto`
- [x] T005 Update `vite.config.ts` to use `sveltekit()` plugin instead of `svelte()`
- [x] T006 Update `tsconfig.json` to extend `./.svelte-kit/tsconfig.json`
- [x] T007 [P] Create `src/routes/+page.svelte` test harness to enable `vite dev` preview

## Phase 3: User Story 1 - Automated Type Generation

**Goal**: Automatically generate TS definitions for virtual modules like `$app/navigation`.
**Independent Test**: Run `npx svelte-kit sync` and verify `.svelte-kit/tsconfig.json` exists and types resolve.

- [x] T008 [US1] Run `npx svelte-kit sync` to generate initial types
- [x] T009 [US1] Remove `$app/navigation` declaration from `src/ambient.d.ts`
- [x] T010 [US1] Remove `$app/*` declarations from `src/app.d.ts`
- [x] T011 [US1] Run `npx svelte-check` to verify no type regressions

## Phase 4: User Story 2 - Standard Library Packaging

**Goal**: Build the module using `@sveltejs/package` for standard output structure.
**Independent Test**: Run `pnpm build` and verify `dist/` contains `.svelte` files not just a bundle.

- [x] T012 [US2] Update `package.json` exports to point to `dist/index.js` (or `dist/index.svelte`)
- [x] T013 [US2] Run `pnpm build` and verify `dist` folder structure
- [x] T014 [US2] Verify `dist/package.json` is generated correctly

## Phase 5: Final Polish

- [x] T015 Run full lint/format check
- [x] T016 Verify `npm run dev` launches the test harness successfully
- [x] T017 Update main `tasks.md` to mark this feature complete
- [x] T018 Update README.md with correct integration instructions

## Dependencies

- Phase 1 & 2 blocks all other phases.
- Phase 3 & 4 can run in parallel (but better sequential for easier debugging).
