# Portfolio Virtual Module

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![CI](https://github.com/reidlai/portfolio-virtmod/actions/workflows/ci.yml/badge.svg)

**Repo**: `github.com/reidlai/portfolio-virtmod`

A polyglot module (Go, Svelte, TypeScript) designed for integration into `ta-workspace`.

## Documentation

- [Architecture](./docs/VIRTUAL-MODULE-ARCHITECTURE.md) (Reference: `docs/APPSHELL-ARCHITECTURE.md`)
- [CI Pipeline](./docs/CI-PIPELINE.md)
- [DevSecOps](./docs/DEVSECOPS.md) (Pre-commit hooks, Security scanning)
- [Functional Documentation](./docs/FUNCTIONAL-DOCUMENTATION.md)
- [Developer Reference](./docs/DEVELOPER-REFERENCE.md) (SOLID, Guidelines)
- [License](./LICENSE)

## Quick Start

### Prerequisites

- **Node.js**: v20.18.0+ (Required for `moon` and `prettier`)
- **Go**: v1.24+ (Required for `govulncheck`, `gosec`, and build)
- **Python**: 3.10+ (Required for `pre-commit`, `pytm`, and `semgrep`)
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

### Integration

To add this module to `ta-workspace`:

```bash
npx @moonrepo/cli run :add-module -- https://github.com/reidlai/portfolio-virtmod --name portfolio
```

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
