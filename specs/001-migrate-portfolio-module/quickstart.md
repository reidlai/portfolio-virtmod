# Quick Start: Portfolio Module

**Feature**: [001-migrate-portfolio-module](./spec.md)

## 1. Adding to a Workspace

To integrate this module into `ta-workspace` (or any Moonrepo workspace):

```bash
# In ta-workspace root
moon run :add-module -- https://github.com/reidlai/portfolio-virtmod --name portfolio
```

This will:

1. Clone the repo into `modules/portfolio`.
2. Configure it as a workspace project.

## 2. Local Development (Standalone)

To develop this module in isolation:

### Prerequisites

- Moonrepo (`npm install -g @moonrepo/cli`)
- Git

### Setup

```bash
git clone https://github.com/reidlai/portfolio-virtmod
cd portfolio-virtmod
moon setup # Installs Node.js, Go, and deps
```

### Running Tasks

- **Build All**:

  ```bash
  moon run build
  ```

- **Test All**:

  ```bash
  moon run test
  ```

- **Run Svelte Dev Server**:

  ```bash
  moon run svelte:dev
  ```

- **Run Go Tests**:
  ```bash
  moon run go:test
  ```
