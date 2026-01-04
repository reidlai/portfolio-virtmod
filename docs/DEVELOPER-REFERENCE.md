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
- **Backing Services**: Treated as attached resources (Host App checks).
- **Build/Release/Run**: Strict separation via Moonrepo tasks and Release workflow.

## Testing Strategy (New)

### 1. Unit Testing

- **Goal**: Verify logic in isolation (checking "infra-only" behavior is fine for start).
- **Go**: Use `testify/assert` and `testify/mock`.
- **Svelte**: Use `vitest` and `@testing-library/svelte`.
- **Mocking**: MANDATORY. Never connect to real DBs or APIs in unit tests.

### 2. Dependency Injection (DI)

- **Go**: Always define interfaces for dependencies in `pkg/interfaces.go` (e.g. `Logger`, `Database`).
- **Svelte**: Use Props for data injection (`export let data: Type`). Avoid internal data fetching in widgets.

This section provides quick copy-paste patterns for integrating the Virtual Module into the AppShell architecture.

### 1. Backend Integration (Go)

The module exposes a **Service Factory** pattern. It does not run its own server.

**Location**: `modules/<module>/go/pkg/service.go`

```go
package portfoliopkg

import (
    "database/sql"
    "log/slog"
    "github.com/reidlai/ta-workspace/modules/portfolio/go/gen/portfolio"
)

// Service Factory
// Receives infrastructure dependencies from the Host App (Dependency Injection)
func NewPortfolioService(logger *slog.Logger, db *sql.DB) portfolio.Service {
    return &portfolioService{
        logger: logger,
        db:     db,
    }
}
```

**Host Integration (ta-server)**:

```go
// apps/ta-server/cmd/api-server.go
import portfoliopkg "github.com/reidlai/ta-workspace/modules/portfolio/go/pkg"

// 1. Inject Dependencies (Core Module)
logger := slog.Default()
db := database.GetConnection()

// 2. Initialize Module Service
portfolioSvc := portfoliopkg.NewPortfolioService(logger, db)

// 3. Mount to HTTP Server (Goa)
portfolioEndpoints := portfolio.NewEndpoints(portfolioSvc)
```

#### API Design (Goa DSL)

We use **Goa** to define our APIs. This strict DSL generates both the Go boilerplate (interface, transport) and the **OpenAPI 3.0 specification** needed for frontend and AI clients.

**Location**: `modules/<module>/go/design/design.go`

```go
package design

import . "goa.design/goa/v3/dsl"

var _ = Service("portfolio", func() {
    Description("Portfolio management service")

    Method("get_summary", func() {
        Description("Get portfolio summary metrics")

        // 1. Define Request/Response
        Result(PortfolioSummary)
        HTTP(func() {
            GET("/portfolio/summary")
            Response(StatusOK)
        })
    })

    // 2. Define Types
    var PortfolioSummary = Type("PortfolioSummary", func() {
        Attribute("total_value", Float64)
        Required("total_value")
    })
})
```

**Artifacts Generated**:

- `gen/http/openapi3.json`: OpenAPI spec (fed to LLMs/Agents).
- `gen/portfolio/service.go`: Service interface to implement.

#### MCP Server Integration (Goa-AI)

We use the **Goa-AI** framework (`github.com/goa-ai/goa-mcp`) to automatically generate **Model Context Protocol (MCP)** servers from our existing design. This ensures that the AI Tool definitions always match the API stricture.

**1. Update Design (DSL)**

Import the `goa-mcp` plugin in your design file. No code changes are needed if you want to expose all methods, but you can use `MCPServer` to group tools.

**Location**: `modules/<module>/go/design/design.go`

```go
package design

import (
    . "goa.design/goa/v3/dsl"
    _ "github.com/goa-ai/goa-mcp/design" // 1. Import Plugin
)

var _ = Service("portfolio", func() {
    // ... existing method definitions ...

    Method("get_summary", func() {
        Description("Get portfolio summary metrics")
        // ... existing DSL ...
    })
})
```

**2. Generate Artifacts**

Run the generator. The plugin will create a standard MCP server implementation.

```bash
cd go
goa gen github.com/reidlai/ta-workspace/modules/portfolio/go/design
```

**Artifacts Generated**:

- `gen/mcp/server.go`: The generated MCP server logic.
- `gen/mcp/tool.go`: Type-safe tool definitions.

**3. Host Integration**

Mount the generated MCP server in your agent entry point.

```go
// apps/mcp-server/cmd/agent/main.go
import (
    "github.com/mark3labs/mcp-go/mcp"
    portfoliomcp "github.com/reidlai/ta-workspace/modules/portfolio/go/gen/mcp"
)

// 1. Initialize Service
portfolioSvc := portfoliopkg.NewPortfolioService(logger, db)

// 2. Create MCP Server
server := mcp.NewServer("ta-agent", "1.0.0")

// 3. Register Generated Tools (Goa-AI)
// The generated package provides a helper to register all service methods
portfoliomcp.RegisterTools(server, portfolioSvc)
```

**Developer Benefit**:

- **No Interface Adaptors**: You do not write manual `pkg/mcp.go` files.
- **Single Source of Truth**: The `Description()` in your DSL becomes the AI Tool description.
- **Type Safety**: Input/Output mapping is handled by the generated code.

### 2. Reactive Data Layer (RxJS)

Business logic and state management live in the **TypeScript Module** (`ts/`), completely decoupled from the UI framework. This allows "Write Once, Run Anywhere" (Svelte, React, etc.).

**Location**: `modules/<module>/ts/src/portfolio.service.ts`

```typescript
import { BehaviorSubject, Observable, map } from "rxjs";
import { type PortfolioItem } from "./types"; // Shared Types

export class PortfolioStore {
  // 1. Internal State (BehaviorSubject)
  private _items$ = new BehaviorSubject<PortfolioItem[]>([]);

  // 2. Public Read-Only Stream (Observable)
  public items$: Observable<PortfolioItem[]> = this._items$.asObservable();

  constructor(private apiClient: any) {}

  // 3. Action (Updates State)
  async fetchItems() {
    const data = await this.apiClient.get("/api/portfolio");
    this._items$.next(data);
  }

  // 4. Derived State (Computed)
  public totalValue$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((acc, item) => acc + item.value, 0)),
  );
}
```

### 3. Frontend Integration (SvelteKit)

Svelte components consume the RxJS service directly. Svelte's `$` syntax auto-subscribes/unsubscribes to Observables.

**Location**: `modules/<module>/svelte/src/widgets/SummaryWidget.svelte`

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { watchlistService } from '@modules/watchlist-ts'; // Real example from watchlist module

  // The service uses RxJS BehaviorSubject internally and exposes:
  // 1. Observable streams (tickers$)
  // 2. Svelte-compatible subscribe method
  // 3. Action methods (fetchTickers, addTicker, removeTicker)

  onMount(() => {
    // Service auto-fetches on initialization
    // Manual refresh if needed:
    watchlistService.fetchTickers();
  });
</script>

<!-- Svelte auto-subscribes to the service using $ prefix -->
<div class="card">
  <h3>My Watchlist</h3>

  <ul>
    {#each $watchlistService as ticker}
      <li>{ticker.symbol} - {ticker.on_hand ? 'Owned' : 'Watching'}</li>
    {/each}
  </ul>
</div>
```

**How it works** (see `modules/watchlist/ts/src/services/WatchlistService.ts`):

```typescript
export class WatchlistService {
  private _tickers$ = new BehaviorSubject<TickerItem[]>([]);
  public readonly tickers$ = this._tickers$.asObservable();

  // Svelte-compatible subscribe method
  public subscribe(run: (value: TickerItem[]) => void): () => void {
    const subscription = this._tickers$.subscribe(run);
    return () => subscription.unsubscribe();
  }

  public async fetchTickers(): Promise<void> {
    const res = await fetch("/api/watchlist", {
      headers: { "X-User-ID": this.userId },
    });
    if (res.ok) {
      const data = await res.json();
      this._tickers$.next(data); // Update RxJS state
    }
  }
}
```

### 4. Frontend Integration (NextJS / React)

The **SAME** RxJS service can be used in NextJS/React using a simple hook. This proves the architecture's portability.

**Location**: `apps/nextjs-dashboard/components/SummaryWidget.tsx`

```tsx
import { useEffect } from "react";
import { useObservable } from "rxjs-hooks"; // or custom hook
import { PortfolioStore } from "@modules/portfolio-ts";
import { apiClient } from "@modules/core";

// 1. Initialize Service (Singleton or Context)
const store = new PortfolioStore(apiClient);

export const SummaryWidget = () => {
  // 2. Consume Observables
  const items = useObservable(() => store.items$, []);
  const total = useObservable(() => store.totalValue$, 0);

  useEffect(() => {
    store.fetchItems();
  }, []);

  // 3. Render
  return (
    <div className="card">
      <h3>Total Value: {total}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.symbol}>
            {item.symbol}: {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### 5. Dependency Injection (Core Module)

The `modules/core` provides the infrastructure interfaces used by virtual modules.

- **Backend**: `*sql.DB`, `*slog.Logger`, `http.Client`
- **Frontend**: `ApiClient`, `AuthStore`, `NotificationService`

**Rules**:

1.  **Never hardcode implementations** (e.g., specific HTTP implementations) inside the virtual module.
2.  **Accept interfaces** in constructors.
3.  **Let the Host App** inject the concrete implementation at runtime.

## Guidelines

1.  **Commit Messages**: Use Conventional Commits (`feat:`, `fix:`, `docs:`).
2.  **Linting**: Run `moon run lint` before push.
3.  **Tests**: Write unit tests for all business logic.
