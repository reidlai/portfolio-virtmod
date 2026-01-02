# Virtual Module Architecture

**Reference**: `github.com/reidlai/ta-workspace/docs/APPSHELL-ARCHITECTURE.md`

## Overview

The Portfolio Module is a polyglot "Virtual Module" containing:

- **Backend**: Go Microservice components (Services, Types) using Goa.
- **Frontend**: SvelteKit UI widgets (Cards, Tables) using ShadCN.
- **Shared**: TypeScript definitions for frontend-backend contracts.

## Integration Model

This module is **NOT** a standalone service. It is designed to be:

1.  **Migrated**: Added via `moon :add-module`.
2.  **Embedded**: Compiled into the host application's binary (Go) and bundle (Vite).

## Boundaries

- **State**: No persistent state ownership; relies on Host App for DB connections.
- **Auth**: Inherits Host App session context.
- **UI**: Renders into slots provided by Host App shell.
