# DevSecOps Pipeline

This document describes the DevSecOps pipeline implemented in this repository using pre-commit hooks and security scanning tools.

## Overview

The pipeline consists of **15 automated checks** across **6 stages**, ensuring code quality, security, and compliance before code is committed.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DevSecOps Pipeline                              │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────────────────┤
│ Stage 1 │ Stage 2 │ Stage 3 │ Stage 4 │ Stage 5 │      Stage 6        │
│   SCA   │  Lint   │ Quality │  Test   │  SAST   │   Threat Model      │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────────────────┤
│govuln   │go-fmt   │go-vet   │moon-test│gosec    │pytm                 │
│pnpm-aud │prettier │moon-lint│         │semgrep  │                     │
│         │trailing │check-yml│         │         │                     │
│         │end-file │lg-files │         │         │                     │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────────────────┘
```

## Prerequisites

| Tool    | Version   | Purpose                             |
| ------- | --------- | ----------------------------------- |
| Node.js | v20.18.0+ | Moonrepo, Prettier, ESLint          |
| Go      | v1.24.11+ | Go toolchain, govulncheck, gosec    |
| Python  | 3.10+     | pre-commit, pytm, semgrep           |
| pnpm    | 9.x       | Package management                  |
| gvm     | latest    | Go version management (recommended) |

### Installation

```bash
# Python tools
pip install pre-commit pytm semgrep

# Setup pre-commit hooks
pre-commit install

# Verify Go version (requires 1.24.11+)
go version
```

## Pipeline Stages

### Stage 1: Software Composition Analysis (SCA)

Scans dependencies for known vulnerabilities.

| Hook          | Tool              | Description                                          |
| ------------- | ----------------- | ---------------------------------------------------- |
| `govulncheck` | golang.org/x/vuln | Scans Go dependencies against vulnerability database |
| `pnpm-audit`  | pnpm audit        | Scans npm dependencies (high severity only)          |

**Configuration Notes:**

- `govulncheck` requires Go 1.24.11+ (configured via gvm)
- `pnpm-audit` uses `--audit-level=high` to avoid false positives from moderate advisories

### Stage 2: Linting & Formatting

Enforces consistent code style across all languages.

| Hook                  | Tool        | Files         | Description                    |
| --------------------- | ----------- | ------------- | ------------------------------ |
| `trailing-whitespace` | pre-commit  | all           | Removes trailing whitespace    |
| `end-of-file-fixer`   | pre-commit  | all           | Ensures files end with newline |
| `go-mod-tidy`         | go mod tidy | go.mod        | Cleans Go module dependencies  |
| `go-fmt`              | go fmt      | \*.go         | Formats Go source code         |
| `prettier`            | prettier    | JS/TS/YAML/MD | Standardizes formatting        |

### Stage 3: Code Quality

Static analysis and validation checks.

| Hook                      | Tool              | Files   | Description                   |
| ------------------------- | ----------------- | ------- | ----------------------------- |
| `check-yaml`              | pre-commit        | \*.yaml | Validates YAML syntax         |
| `check-added-large-files` | pre-commit        | all     | Prevents large file commits   |
| `moon-lint`               | moonrepo + eslint | TS/JS   | TypeScript/JavaScript linting |
| `go-vet`                  | go vet            | \*.go   | Go static analysis            |

### Stage 4: Unit Tests

Runs test suites across all components.

| Hook        | Tool     | Scope | Description                      |
| ----------- | -------- | ----- | -------------------------------- |
| `moon-test` | moonrepo | all   | Executes Go tests, Svelte checks |

### Stage 5: Static Application Security Testing (SAST)

Security-focused static analysis.

| Hook      | Tool           | Languages | Description                                     |
| --------- | -------------- | --------- | ----------------------------------------------- |
| `gosec`   | securego/gosec | Go        | Go security scanner (OWASP rules)               |
| `semgrep` | semgrep        | Polyglot  | Multi-language SAST with security-audit ruleset |

**Semgrep Configuration:**

- Uses `p/security-audit` ruleset
- Runs with `--error` flag (fails on findings)

### Stage 6: Threat Modelling

Architecture-level security analysis.

| Hook   | Tool | Output   | Description                                          |
| ------ | ---- | -------- | ---------------------------------------------------- |
| `pytm` | pytm | reports/ | Generates threat model from `threat_modelling/tm.py` |

## Configuration Details

### Go Version Management (gvm)

All Go hooks are configured to use Go 1.24.11 via gvm to ensure compatibility:

```yaml
entry: bash -c 'source ~/.gvm/scripts/gvm && gvm use go1.24.11 && cd go && go vet ./...'
```

This ensures consistent Go version regardless of shell environment.

### Working Directory

Go commands run from the `go/` subdirectory:

```yaml
entry: bash -c 'cd go && go fmt ./...'
```

### Pass Filenames

Most hooks use `pass_filenames: false` to run on the entire codebase rather than individual files:

```yaml
- id: go-vet
  pass_filenames: false
```

## Running the Pipeline

### Automatic (on commit)

```bash
git commit -m "Your message"
# Pre-commit hooks run automatically
```

### Manual (all files)

```bash
pre-commit run --all-files
```

### Specific hook

```bash
pre-commit run semgrep --all-files
pre-commit run govulncheck --all-files
```

### Skip hooks (emergency only)

```bash
git commit --no-verify -m "Emergency fix"
```

## Troubleshooting

### Go version mismatch

**Symptom:** `package requires newer Go version go1.24`

**Solution:** Ensure gvm is configured with Go 1.24.11+:

```bash
gvm install go1.24.11
gvm use go1.24.11 --default
```

### Semgrep not found

**Symptom:** `Executable 'semgrep' not found`

**Solution:** Install semgrep via pip:

```bash
pip install semgrep
```

### pytm module not found

**Symptom:** `ModuleNotFoundError: No module named 'pytm'`

**Solution:** Install pytm:

```bash
pip install pytm
# Or with --break-system-packages on newer systems
pip install --break-system-packages pytm
```

### pnpm audit false positives

**Symptom:** Audit fails on moderate vulnerabilities for already-patched packages

**Solution:** The hook uses `--audit-level=high` to ignore moderate severity. If needed, update `package.json`:

```json
{
  "pnpm": {
    "auditConfig": {
      "ignoreCves": ["GHSA-xxxx-xxxx-xxxx"]
    }
  }
}
```

### Pre-commit environment issues

**Symptom:** Hooks fail in pre-commit but work in terminal

**Solution:** Pre-commit runs in isolated environment. Ensure tools are in PATH and gvm is sourced in hooks.

## Security Findings

When security tools detect issues:

1. **CRITICAL/HIGH:** Must be fixed before commit
2. **MEDIUM:** Review and fix or document exception
3. **LOW:** Fix in next iteration

### Suppressing False Positives

**Semgrep:** Add inline comment:

```go
// nosemgrep: go.lang.security.audit.crypto.math_random.math-random-used
```

**Gosec:** Add inline comment:

```go
// #nosec G404
```

## CI/CD Integration

The same checks run in GitHub Actions CI:

```yaml
# .github/workflows/ci.yml
- name: Run pre-commit
  run: pre-commit run --all-files
```

See [CI Pipeline](./CI-PIPELINE.md) for full CI/CD documentation.

## References

- [pre-commit](https://pre-commit.com/)
- [govulncheck](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck)
- [gosec](https://github.com/securego/gosec)
- [semgrep](https://semgrep.dev/)
- [pytm](https://github.com/izar/pytm)
