# CI Pipeline & Release Process

## Overview

This module uses Moonrepo's `verify` workflow (`moon run :test`, `moon run :lint`) orchestrated by GitHub Actions.

## CI Gates (Blocking)

All PRs targeting `main` must pass:

1.  **Unit Tests**: `moon run test` (Go, Vitest)
2.  **Linting**: `moon run lint` (ESLint, Go Vet)
3.  **Secret Scanning**: Trivy filesystem scan
4.  **SCA**: Dependency analysis
5.  **SAST**: Threat modeling check

## Release Process

This module follows Semantic Versioning (SemVer) and Release-Please Automation.

1.  **Trigger**: Merge to `main`.
2.  **Action**: `release-please` analyzes commits (Conventional Commits).
3.  **Output**: Creates a new GitHub Release tag (e.g., `v1.0.1`) and updates `CHANGELOG.md`.

## Integration

Use the release tag in `go.mod` (backend) or `package.json` (frontend) of consuming workspaces.
