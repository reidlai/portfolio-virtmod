# Tasks: Enable Unit Testing Infrastructure

**Input**: Design documents from `/specs/002-enable-unit-testing/`
**Prerequisites**: plan.md (required), spec.md (required)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T000 [P] Upgrade Go modules to v1.24.11+ (Security Mandate)
- [x] T001 [P] Promote `testify` to direct dependency in `go/go.mod`
- [ ] T002 [P] Install `vitest`, `jsdom`, `@testing-library/svelte` in `svelte/package.json`
- [x] T003 [P] Configure `moon` to run tests for Go and Svelte projects

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

_(None for this feature - Infrastructure is the feature)_

## Phase 3: User Story 1 - Run Go Unit Tests (Priority: P1) 🎯 MVP

**Goal**: Developers must be able to write and run unit tests for Go services using `testify`.

**Independent Test**: Create a sample test file in a Go module and run it via `go test`.

### Implementation for User Story 1

- [x] T004 [US1] Define interfaces in `go/pkg/interfaces.go` for `slog.Logger` or other future deps
- [x] T005 [US1] Refactor `pkg.NewPortfolio` in `go/pkg/portfolio_service.go` to accept interfaces (DI)
- [x] T006 [US1] Create `go/pkg/portfolio_service_test.go` with 1 passing smoke test using `testify/mock` or `testify/assert`
- [x] T007 [US1] Verify `moon run portfolio-go:test` passes

## Phase 4: User Story 2 - Run Frontend Unit Tests (Priority: P1)

**Goal**: Developers must be able to write and run unit tests for Svelte/TS using `vitest`.

**Independent Test**: Create a sample `.test.ts` file in a Svelte module and run it via `vitest`.

### Implementation for User Story 2

- [x] T008 [US2] Refactor `svelte/src/widgets/PortfolioSummaryWidget.svelte` to accept `valuation` and `handleClick` as props (DI)
- [x] T009 [US2] Create `svelte/src/widgets/PortfolioSummaryWidget.test.ts` with 1 passing test mocking `$app/navigation` and asserting props
- [x] T010 [US2] Verify `moon run portfolio-web:test` passes

- [ ] T014 [US3] Configure `ts-test` in `moon.yml` and install vitest in `ts/package.json`
- [ ] T015 [US3] Create `ts/src/portfolio.service.test.ts` smoke test for ReactiveX logic
- [ ] T016 [US3] Verify `moon run portfolio-ts:test` passes

## Phase 4.5: User Story 3 - Run TypeScript Unit Tests (ReactiveX)

**Goal**: Developers must be able to write and run unit tests for shared TypeScript logic (`ts/`) using `vitest`.

- [x] T014 [US3] Configure `ts-test` in `moon.yml` and install vitest in `ts/`
- [x] T015 [US3] Create `ts/src/portfolio_logic.test.ts` smoke test
- [x] T016 [US3] Verify `moon run portfolio-ts:test` passest

## Phase 5: Documentation & Polish

**Purpose**: Improvements that affect multiple user stories

- [x] T011 [P] Update `docs/DEVELOPER-REFERENCE.md` with DI/Mock/Testing guides
- [x] T012 [P] Update `docs/VIRTUAL-MODULE-ARCHITECTURE.md` with mocking constraints
- [x] T013 [P] Verify `specs/002-enable-unit-testing/quickstart.md` instructions work
