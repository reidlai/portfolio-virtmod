# How to Create a Virtual Module

**Goal**: Create a new polyglot Virtual Module (Go, Svelte, TypeScript) that integrates into the TA Workspace AppShell.

## Prerequisites

- **Moonrepo**: Installed via `npm install -g @moonrepo/cli`
- **Go**: v1.22+
- **Goa**: `go install goa.design/goa/v3/cmd/goa@latest`
- **Node.js**: v20+

## 1. Scaffold Directory Structure

Create a new directory for your module (e.g., `modules/my-feature`).

```bash
mkdir -p modules/my-feature/{go/pkg,svelte/src,ts/src,threat_modelling}
```

Standard Layout:

- `go/`: Backend services (Goa)
- `svelte/`: UI Widgets (SvelteKit Library)
- `ts/`: Shared Business Logic (RxJS)
- `threat_modelling/`: PyTM models

## 2. Shared Logic (The Bridge)

Start with the TypeScript layer that bridges Backend and Frontend.

**File**: `modules/my-feature/ts/package.json`

```json
{
  "name": "@modules/my-feature-ts",
  "version": "0.0.1",
  "type": "module",
  "main": "./src/index.ts",
  "dependencies": {
    "rxjs": "^7.8.1"
  }
}
```

**File**: `modules/my-feature/ts/src/store.ts`

```typescript
import { BehaviorSubject } from "rxjs";

// Define State
export const featureStore = new BehaviorSubject<string>("Initial State");

// Define Logic
export const updateState = (val: string) => featureStore.next(val);
```

## 3. Backend Service (Go + Goa)

**File**: `modules/my-feature/go/go.mod`

```bash
cd modules/my-feature/go
go mod init github.com/reidlai/ta-workspace/modules/my-feature/go
go get goa.design/goa/v3
go get github.com/goa-ai/goa-mcp
```

**File**: `modules/my-feature/go/design/design.go`

```go
package design

import (
    . "goa.design/goa/v3/dsl"
    _ "github.com/goa-ai/goa-mcp/design" // Integration with MCP
)

var _ = Service("my-feature", func() {
    Description("My new virtual module service")

    Method("get_data", func() {
        Description("Retrieves feature data")
        Result(String)
        HTTP(func() {
            GET("/feature/data")
        })
    })
})
```

**Generate Code**:

```bash
goa gen github.com/reidlai/ta-workspace/modules/my-feature/go/design
```

**Implement Service**: Create `pkg/service.go` implementing the generated interface.

## 4. MCP Server (AI Integration)

The `goa-mcp` plugin automatically generates an MCP server from your design.

**Generate MCP Server**:
The previous `goa gen` command already generated `gen/mcp/server.go`.

**Verify**:
Check `modules/my-feature/go/gen/mcp/` for `server.go` and `tool.go`.

## 5. Frontend UI (SvelteKit)

We will use the official Svelte CLI to scaffold a Skeleton Library project.

### Step 5.1: Scaffold Project

Run the following commands inside your module directory (`modules/my-feature/`):

```bash
# 1. Initialize SvelteKit (select 'Skeleton project' and 'TypeScript')
npm create svelte@latest svelte

# 2. Enter directory
cd svelte

# 3. Install dependencies
pnpm install

# 4. Install Bridge Dependencies
pnpm add -D @sveltejs/package @sveltejs/adapter-auto
pnpm add @modules/my-feature-ts@workspace:*
```

### Step 5.2: Configure for Library Mode

Update `package.json` to define it as a library (using `svelte-package`).

**File**: `modules/my-feature/svelte/package.json`

```json
{
  "name": "@modules/my-feature",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "svelte-package"
  },
  "peerDependencies": {
    "svelte": "^5.0.0",
    "@sveltejs/kit": "^2.0.0"
  },
  "dependencies": {
    "@modules/my-feature-ts": "workspace:*"
  }
}
```

**File**: `modules/my-feature/svelte/vite.config.ts`

```typescript
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
});
```

**File**: `modules/my-feature/svelte/src/lib/Widget.svelte`

```svelte
<script lang="ts">
  import { featureStore } from '@modules/my-feature-ts';
</script>

<h1>{$featureStore}</h1>
```

**Virtual Module Config**:
Ensure `.gitignore` includes `.svelte-kit/` and `dist/`.

## 6. Workspace Integration

To enable build and test automation, you must register your module in the root `moon.yml` (or create a new `moon.yml` inside your module directory).

**File**: `modules/my-feature/moon.yml`

```yaml
# https://moonrepo.dev/docs/config/project
language: "unknown" # Mixed/Polyglot

fileGroups:
  go: ["go/**/*"]
  svelte: ["svelte/**/*"]
  ts: ["ts/**/*"]

tasks:
  # --- Go Backend ---
  go-build:
    command: "go build -v ./go/..."
    inputs: ["go/**/*"]
    platform: "system"

  go-test:
    command: "go test -v ./go/..."
    inputs: ["go/**/*"]
    platform: "system"

  # --- TypeScript Shared Lib ---
  ts-build:
    command: "pnpm --dir ts build"
    inputs: ["ts/**/*"]
    platform: "node"

  ts-test:
    command: "pnpm --dir ts run test"
    inputs: ["ts/**/*"]
    platform: "node"

  # --- Svelte Frontend ---
  svelte-dev:
    command: "pnpm --dir svelte dev"
    local: true
    platform: "node"

  svelte-build:
    command: "pnpm --dir svelte build"
    inputs: ["svelte/**/*", "ts/**/*"]
    deps: ["ts-build"] # Depends on shared lib
    platform: "node"

  # --- Composite Tasks ---
  build:
    command: 'echo "Building all components"'
    deps: ["go-build", "svelte-build", "ts-build"]
    platform: "system"

  test:
    command: 'echo "Testing all components"'
    deps: ["go-test", "svelte-test", "ts-test"]
    platform: "system"
```

### Workspace Registration

1.  **PNPM**: Add typescript/svelte folders to `pnpm-workspace.yaml`.

    ```yaml
    packages:
      - "modules/my-feature/svelte"
      - "modules/my-feature/ts"
    ```

2.  **Go Workspace**: Register the module in the root `go.work` file.

    You can use the CLI command:

    ```bash
    go work use ./modules/my-feature/go
    ```

    Or manually edit `go.work` to add the `use` directive:

    ```go
    use ./modules/my-feature/go
    ```

    _(Note: This goes in `go.work`, NOT `go.mod`)_

## 7. Verify Integration

Once configured, verify that all components "tightly integrate" by running the workspace tasks.

### Step 7.1: Install & Sync

Ensure all dependencies across the polyglot stack are installed.

```bash
# Root of workspace
pnpm install
go work sync
```

### Step 7.2: Build All Components

Run the composite build task defined in `moon.yml`. This confirms that Go, Svelte, and TypeScript components compile together.

```bash
npx @moonrepo/cli run :build
```

**Success Criteria**:

- Go backend builds (`go build`)
- TypeScript shared lib builds (`tsc`)
- SvelteKit library builds (`svelte-package`)
- No type errors or missing dependencies

### Step 7.3: Run Test Suite

Verify that all unit tests pass.

```bash
npx @moonrepo/cli run :test
```

### Step 7.4: Verify Host Integration

To confirm the module is correctly wired into the Host App (AppShell):

1.  **Backend**: Check `apps/ta-server/cmd/api-server.go` imports your module.
2.  **Frontend**: Check `apps/ta-web/src/lib/modules.ts` (or equivalent registry) loads your module.
3.  **Runtime**: Start the host app and check logs.

```bash
# Start Host App (Example)
npx @moonrepo/cli run ta-server:dev
```

Look for initialization logs:
`[INFO] Service 'my-feature' registered.`
