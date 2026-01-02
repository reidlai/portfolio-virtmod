# Developer Reference

## Development Standards

### SOLID Principles

- **Single Responsibility (SRP)**: Each Go service / Svelte component handles one domain concern.
- **Open/Closed (OCP)**: Extend behavior via Interfaces (Go) and Slots (Svelte), do not modify internals.
- **Liskov Substitution (LSP)**: Shared TS interfaces must hold true for all implementers.
- **Interface Segregation (ISP)**: API contracts (Goa) are split by business capability.
- **Dependency Inversion (DIP)**: Depend on abstractions (Interfaces), not concrete implementations.

### 12-Factor App Compliance

- **Config**: Strict Env Var usage.
- **Backing Services**: Treated as attached resources (Host App checks).
- **Build/Release/Run**: Strict separation via Moonrepo tasks and Release workflow.

## Guidelines

1.  **Commit Messages**: Use Conventional Commits (`feat:`, `fix:`, `docs:`).
2.  **Linting**: Run `moon run lint` before push.
3.  **Tests**: Write unit tests for all business logic.
