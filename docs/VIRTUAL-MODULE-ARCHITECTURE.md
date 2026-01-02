# Virtual Module Architecture

**Reference**: [`ta-workspace/docs/APPSHELL-ARCHITECTURE.md`](https://github.com/reidlai/ta-workspace/blob/main/docs/APPSHELL-ARCHITECTURE.md)

## Overview

The Portfolio Module is a **polyglot Virtual Module** designed to be embedded into the [ta-workspace](https://github.com/reidlai/ta-workspace) appshell. It follows the modular monolith pattern where components are developed independently but deployed as part of the host application.

### Module Structure

```
portfolio-virtmod/
├── go/                    # Backend Services (Goa)
│   ├── pkg/              # Service implementations
│   ├── gen/              # Generated Goa code
│   └── design/           # Goa API design
├── svelte/               # UI Widgets (SvelteKit)
│   └── src/
│       ├── widgets/      # Reusable UI components
│       └── lib/          # Shared utilities
├── ts/                   # Shared TypeScript
│   └── src/
│       └── types/        # Frontend-backend contracts
└── threat_modelling/     # Security models (PyTM)
```

## Integration Model

### NOT a Standalone Service

This module is **NOT** designed to run independently. It has:

- ❌ No main entry point
- ❌ No independent HTTP server
- ❌ No database ownership
- ❌ No authentication system

Instead, it provides **embeddable components** that are:

- ✅ Compiled into the host app's binary (Go services)
- ✅ Bundled into the host app's frontend (Svelte widgets)
- ✅ Registered at runtime via the host's service registry

### Integration Workflow

1. **Module Addition**:

   ```bash
   cd ta-workspace
   npx @moonrepo/cli run :add-module -- \
     https://github.com/reidlai/portfolio-virtmod --name portfolio
   ```

2. **Automatic Configuration**:
   - Git submodule added to `modules/portfolio/`
   - Workspace configs updated (`pnpm-workspace.yaml`, `go.work`, `moon.yml`)
   - Dependencies linked via workspace protocols

3. **Build Integration**:
   - Go: Imported as `github.com/reidlai/ta-workspace/modules/portfolio/go/pkg`
   - Svelte: Imported as `@modules/portfolio` (via tsconfig paths)
   - TypeScript: Shared types via `@core/types`

## Component Boundaries

### Backend (Go)

**Pattern**: Service Provider

```go
// Module exposes service factory
func NewPortfolioService(logger *slog.Logger, db *sql.DB) portfolio.Service {
    return &portfolioService{
        logger: logger,
        db:     db, // Injected by host
    }
}

// Host app registers the service
portfolioSvc := portfoliopkg.NewPortfolioService(logger, db)
portfolioEndpoints := portfolio.NewEndpoints(portfolioSvc)
portfolioServer := portfoliosvr.New(portfolioEndpoints, mux, dec, enc, eh, nil)
```

**Boundaries**:

- **State**: Uses host's DB connection (no schema ownership)
- **Auth**: Receives authenticated context from host middleware
- **Lifecycle**: Managed by host's service container

### Frontend (Svelte)

**Pattern**: Widget Registry

```typescript
// Module exports widgets
export { PortfolioSummaryWidget } from "./widgets/PortfolioSummaryWidget.svelte";

// Host app registers widgets
import { PortfolioSummaryWidget } from "@modules/portfolio";
Registry.register("portfolio-summary", PortfolioSummaryWidget);
```

**Boundaries**:

- **Routing**: No routes - rendered into host's layout slots
- **State**: Uses host's stores (no independent state management)
- **Auth**: Reads session from host's auth store

### Shared Types (TypeScript)

**Pattern**: Contract Definition

```typescript
// Shared interface between frontend and backend
export interface PortfolioSummary {
  totalValue: number;
  positions: Position[];
  lastUpdated: string;
}
```

**Boundaries**:

- **Versioning**: Follows host app's type versioning
- **Breaking Changes**: Coordinated with host app releases

## Dependency Management

### Go Dependencies

```go
// go.mod
module github.com/reidlai/ta-workspace/modules/portfolio/go

require (
    goa.design/goa/v3 v3.23.4
    // Host app provides: logger, DB, config
)
```

**Pattern**: Dependency Injection

- Module declares interfaces
- Host app provides implementations

### Node Dependencies

```json
// svelte/package.json
{
  "dependencies": {
    "@core/types": "workspace:*" // From host
  }
}
```

**Pattern**: Workspace Protocol

- Shared types via monorepo workspace
- No version conflicts

## Security Model

### Threat Surface

The module inherits the host app's security posture:

- **Authentication**: Host's session middleware
- **Authorization**: Host's RBAC policies
- **Data Access**: Host's DB connection pool
- **Network**: Host's TLS termination

### Threat Modeling

See `threat_modelling/tm.py` for PyTM model:

- Assumes trusted host environment
- No direct external exposure
- Data flows through host's API gateway

## App Architecture Constraints (Updates)

### 1. Mockability

**Rule**: All external dependencies (Host APIs, DBs, Auth) MUST be mockable.

- **Go**: Structs must accept Interfaces.
- **Svelte**: Components must accept Props or use Context.

### 2. Dependency Injection

**Rule**: No hardcoded instantiations of infra clients.

- Use Service Factories (`NewPortfolioService(deps...)`).

## Testing Strategy

### Unit Tests

```bash
# Test module in isolation
npx @moonrepo/cli run portfolio:test
```

### Integration Tests

```bash
# Test within host context (run from ta-workspace)
npx @moonrepo/cli run :test
```

**Boundaries**:

- Unit tests: Mock host dependencies (DB, logger)
- Integration tests: Use host's test fixtures

## Deployment

### Build Artifacts

The module produces **no independent artifacts**. It's compiled into:

- `ta-server` binary (Go services embedded)
- `sv-appshell` bundle (Svelte widgets bundled)

### Release Process

1. Module changes are committed to `portfolio-virtmod`
2. Host app updates submodule reference
3. Host app's CI rebuilds with new module code
4. Single deployment of host app includes module changes

## Migration Considerations

### From Standalone to Virtual Module

If migrating an existing service:

1. Remove main entry point
2. Convert to service factory pattern
3. Remove DB schema ownership (use host's)
4. Remove auth middleware (use host's)
5. Export widgets instead of routes

### Future Extraction

If module needs to become standalone:

1. Add main entry point
2. Add HTTP server setup
3. Add database migrations
4. Add auth middleware
5. Convert widgets to API-driven pages
