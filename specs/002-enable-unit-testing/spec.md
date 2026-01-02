# Feature Specification: Provide Unit Testing Infrastructure

**Feature Branch**: `002-enable-unit-testing`
**Created**: 2026-01-02
**Status**: Draft
**Input**: User description: "Implement unit tests for go/, svelte/, and ts/. For sveltekit, ts and reactivex, please use vitest as testframwork , for go, please use testify"

## Clarifications

### Session 2026-01-02

- Q: Where should test files be located relative to source files? -> A: **Co-located**: Test files sit directly next to the source file they test (e.g., `service_test.go` next to `service_go`).
- Q: What constitutes sufficient coverage for this task? -> A: **Infrastructure + Smoke Verification**: Configure runners and add 1 passing unit test per language. **Critical**: These tests must demonstrate testing the virtual module in isolation by mocking host dependencies (runtime, DB, auth), as the module cannot run standalone.
- Q: Which mocking tools/strategies should be used? -> A: **Standard Lib Mocks**: Use `testify/mock` for Go and `vi.fn()` (`vitest`) for TS/Svelte.
- Q: Does the current codebase support this mocking strategy? -> A: **Refactor for DI Required**: The current implementation lacks necessary interfaces (Go) and prop injection (Svelte). Refactoring existing code to inject dependencies via interfaces/props is a prerequisite for adding tests.
- Q: Where should this architecture be documented? -> A: **Update Documentation**: `docs/DEVELOPER-REFERENCE.md` AND `docs/VIRTUAL-MODULE-ARCHITECTURE.md` MUST be updated with clear guides on the required DI and Mocking patterns.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Run Go Unit Tests (Priority: P1)

Developers must be able to write and run unit tests for Go services using `testify` to ensure backend logic correctness.

**Why this priority**: Backend stability is critical, and `testify` is the requested standard.

**Independent Test**: Can be tested by creating a sample test file in a Go module and running it via `go test` and `moon`.

**Acceptance Scenarios**:

1. **Given** a Go module with `testify` installed, **When** I run `go test ./...`, **Then** the tests execute and report status.
2. **Given** the monorepo, **When** I run `moon run :test` on a Go project, **Then** the tests execute successfully.

---

### User Story 2 - Run Frontend Unit Tests (Priority: P1)

Developers must be able to write and run unit tests for Svelte, TypeScript, and ReactiveX code using `vitest` to ensure frontend reliability.

**Why this priority**: Frontend logic (state management, UI components) needs verification.

**Independent Test**: Can be tested by creating a sample `.test.ts` file in a Svelte module and running it via `vitest` and `moon`.

**Acceptance Scenarios**:

1. **Given** a Svelte/TS module with `vitest` configured, **When** I run `npx vitest run`, **Then** the tests execute and report status.
2. **Given** the monorepo, **When** I run `moon run :test` on a frontend project, **Then** the tests execute successfully.

---

### Edge Cases

- What happens when a module has no tests? -> The test runner should ideally pass (exit 0) or suggest adding tests, but not fail the build pipeline.
- How does the system handle mixed language repos? -> `moon` should delegate to the correct runner (`go test` or `vitest`) based on the project.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-000**: Test files MUST be co-located with the source files they test.
- **FR-001**: All Go modules MUST have `github.com/stretchr/testify` available as a dependency.
- **FR-002**: All Svelte/TypeScript modules MUST have `vitest` configured as the test runner.
- **FR-003**: The `moon` build system MUST be configured to run tests for all modified projects via `moon run :test`.
- **FR-004**: Example unit tests MUST be provided for at least one Go service and one Svelte component to demonstrate the pattern.
- **FR-005**: `RxJS` (reactivex) logic MUST be testable via `vitest`.
- **FR-006**: Code MUST be refactored to support Dependency Injection (DI) to enable isolation from the host runtime during testing.
  - Go: Replace struct dependencies with Interfaces.
  - Svelte: Replace direct imports with prop/context injection where applicable.
- **FR-007**: `docs/DEVELOPER-REFERENCE.md` MUST be updated with explicit guidelines and examples for:
  - Implementing Dependency Injection in Go (structs -> interfaces).
  - Implementing Dependency Injection in Svelte (imports -> props/context).
  - Creating and using mocks with `testify` and `vitest`.
- **FR-008**: `docs/VIRTUAL-MODULE-ARCHITECTURE.md` MUST be updated to enforce Mock ability and DI as a core architectural constraint for all virtual modules.

### Key Entities

- **Test Runner**: The tool executing the tests (Go Test, Vitest).
- **Test Suite**: Collection of unit tests.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: `moon run :test` executes successfully (exit code 0) for all target modules.
- **SC-002**: At least one passing test case exists for Go and one for Svelte/TS.
- **SC-003**: Developers can run tests locally with a single command per project.
