# Quickstart: Running Unit Tests

This guide explains how to run the newly added unit tests for the Portfolio module.

## Prerequisites

- Go 1.22+
- Node.js 20+
- `moon` CLI

## Running Tests

### Entire Module

To run all tests (Go and Frontend):

```bash
moon run portfolio:test
```

### Go Service Tests

To run only the backend tests:

```bash
cd go
go test ./...
# OR via moon
moon run portfolio-go:test
```

### Frontend Tests

To run assertions for the Svelte widgets:

```bash
cd svelte
npx vitest run
# OR via moon
moon run portfolio-web:test
```

## Adding New Tests

1. **Go**: Create a file ending in `_test.go` next to your source file. Use `testify/assert`.
2. **Svelte**: Create a file ending in `.test.ts` next to your component. Use `vitest` import.

## Mocking

- **Go**: Use `testify/mock`. See `go/pkg/interfaces.go` for available interfaces.
- **Svelte**: Use `vi.mock()`. See `PortfolioSummaryWidget.test.ts` for an example of mocking `$app/navigation`.
