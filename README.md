# Portfolio Virtual Module

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![CI](https://github.com/reidlai/portfolio-virtmod/actions/workflows/ci.yml/badge.svg)

**Repo**: `github.com/reidlai/portfolio-virtmod`

## Introduction

The **Portfolio Virtual Module** is a reference implementation of the virtual module pattern for the [ta-workspace](https://github.com/reidlai/ta-workspace) AppShell.

This project demonstrates how to **distribute full-stack development effort** across autonomous teams while maintaining a cohesive application architecture. It serves as a blueprint for implementing SOLID principles and achieving end-to-end delivery through standardized integration patterns.

### Why this project?

As applications grow, managing coding complexity and coordinating multiple teams becomes critical. The **Virtual Module** concept addresses this by:

- **Distributed Development**: allowing distinct full-stack teams to own features from backend to frontend.
- **Reduced Complexity**: breaking down the application into manageable, self-contained units.
- **Standardized Integration**: decoupling modules using ReactiveX (RxJS) for robust, end-to-end data flow.
- **Feature Injection**: utilizing Dependency Injection (DI) to seamlessly plug new or updated capabilities into the host AppShell without tight coupling.

## Highlights

- **Polyglot Design**: Seamlessly combines Go (backend logic), Svelte (UI widgets), and TypeScript (shared types/logic).
- **SOLID Architecture**: Enforces strict boundaries via Dependency Injection (Go) and Interface Contracts (TypeScript).
- **End-to-End Delivery**: Autonomous build and deployment lifecycle that integrates into the host AppShell via standard protocols.
- **DevSecOps Native**: Built-in 6-stage security pipeline (SCA, SAST, Threat Modeling) ensuring enterprise-grade compliance.

## Documentation

- [Architecture](./docs/VIRTUAL-MODULE-ARCHITECTURE.md) (Reference: `docs/APPSHELL-ARCHITECTURE.md`)
- [DevSecOps Pipeline](./docs/DEVSECOPS.md)

- [Functional Documentation](./docs/FUNCTIONAL-DOCUMENTATION.md)
- [Developer Reference](./docs/DEVELOPER-REFERENCE.md) (SOLID, Guidelines)
- [License](./LICENSE)

## Quick Start

### Prerequisites

- **Node.js**: v20.18.0+ (Required for `moon` and `prettier`)
- **Go**: v1.24.11+ (Required for `govulncheck`, `gosec`, and build)
- **Python**: 3.10+ (Required for `pre-commit`, `pytm`, and `semgrep`)
- **pnpm**: 9.x (Required for package management)
- **Pre-commit**: (`pip install pre-commit pytm semgrep`)

### Standalone Development

1.  **Setup**:

    ```bash
    git clone https://github.com/reidlai/portfolio-virtmod
    cd portfolio-virtmod
    npx @moonrepo/cli setup
    ```

2.  **Build**:

    ```bash
    npx @moonrepo/cli run :build
    ```

3.  **Test**:

    ```bash
    npx @moonrepo/cli run :test
    ```

### Quality Gates (Pre-commit & DevSecOps)

This repository implements a comprehensive DevSecOps pipeline using [pre-commit](https://pre-commit.com) with 15 automated checks across 6 stages. See [DevSecOps Documentation](./docs/DEVSECOPS.md) for details.

| Stage           | Checks                     | Tools                                       |
| --------------- | -------------------------- | ------------------------------------------- |
| 1. SCA          | Dependency vulnerabilities | `govulncheck`, `pnpm audit`                 |
| 2. Lint/Format  | Code style                 | `go fmt`, `prettier`, `trailing-whitespace` |
| 3. Code Quality | Static analysis            | `go vet`, `moon lint`, `check-yaml`         |
| 4. Unit Tests   | Test execution             | `moon test`                                 |
| 5. SAST         | Security scanning          | `gosec`, `semgrep`                          |
| 6. Threat Model | Architecture risks         | `pytm`                                      |

**Quick Start**:

```bash
# Install pre-commit and dependencies
pip install pre-commit pytm semgrep

# Setup hooks
pre-commit install

# Run all checks
pre-commit run --all-files
```

**Local DevSecOps Script**:

```bash
./local-devsecops.sh
```

### Integration with TA Workspace

This is a **Virtual Module** designed to integrate into the main [ta-workspace](https://github.com/reidlai/ta-workspace) appshell. See [VIRTUAL-MODULE-ARCHITECTURE.md](./docs/VIRTUAL-MODULE-ARCHITECTURE.md) for the integration model.

#### Architecture Overview

**Reference**: [`ta-workspace/docs/APPSHELL-ARCHITECTURE.md`](https://github.com/reidlai/ta-workspace/blob/main/docs/APPSHELL-ARCHITECTURE.md)

This module follows the **Virtual Module** pattern:

- **NOT a standalone service** - designed to be embedded into the host application
- **Polyglot components**: Go backend services + Svelte UI widgets + TypeScript contracts
- **Zero infrastructure** - no persistent state, inherits host app's DB/auth/routing

#### Integration Steps

1. **Add Module to Workspace**:

   ```bash
   cd ta-workspace
   npx @moonrepo/cli run :add-module -- https://github.com/reidlai/portfolio-virtmod --name portfolio
   ```

2. **Automatic Configuration**:
   The `add-module` workflow automatically:
   - Adds submodule to `modules/portfolio/`
   - Updates `pnpm-workspace.yaml` with `modules/portfolio/svelte` and `modules/portfolio/ts`
   - Updates `go.work` with `modules/portfolio/go`
   - Registers tasks in `moon.yml`

3. **Backend Integration** (Go):

   ```go
   // In ta-workspace/apps/ta-server/cmd/api-server.go
   import portfoliopkg "github.com/reidlai/ta-workspace/modules/portfolio/go/pkg"

   // Register service with Goa
   portfolioSvc := portfoliopkg.NewPortfolioService(logger, db)
   portfolioEndpoints := portfolio.NewEndpoints(portfolioSvc)
   ```

4. **Frontend Integration** (Svelte):

   ```typescript
   // In ta-workspace/apps/sv-appshell/src/lib/registry.ts
   import { PortfolioSummaryWidget } from "@modules/portfolio";

   Registry.register("portfolio-summary", PortfolioSummaryWidget);
   ```

5. **Verify Integration**:

   ```bash
   # Build all components
   npx @moonrepo/cli run :build

   # Run tests
   npx @moonrepo/cli run :test
   ```

#### Module Boundaries

- **State**: No database ownership - uses host app's DB connection
- **Auth**: Inherits session context from host app
- **UI**: Renders into slots provided by appshell layout
- **API**: Exposes Goa services that are mounted by host app's HTTP server

See [VIRTUAL-MODULE-ARCHITECTURE.md](./docs/VIRTUAL-MODULE-ARCHITECTURE.md) for detailed integration patterns.

## Troubleshooting

### Moonrepo "Cannot find module '@moonrepo/core-linux-x64-gnu'" in WSL

**Symptom**: Running `npx @moonrepo/cli run :build` in WSL fails with:

```
Error: Cannot find module '@moonrepo/core-linux-x64-gnu/package.json'
```

**Cause**: The `node_modules` directory was installed from Windows (e.g., via PowerShell or CMD), which downloads the Windows-specific binary (`@moonrepo/core-windows-x64-msvc`) instead of the Linux binary required by WSL.

**Solution**: Reinstall dependencies from within WSL using pnpm:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

This ensures the correct platform-specific binary (`@moonrepo/core-linux-x64-gnu`) is installed.

**Note**: If pnpm encounters `EACCES` permission errors on the `/mnt/c` filesystem (NTFS), you have two options:

1. **Recommended**: Clone the repository to a native Linux filesystem path (e.g., `~/projects/` instead of `/mnt/c/...`) for better performance and compatibility.
2. **Fallback**: Use npm temporarily: `rm -rf node_modules && npm install`
