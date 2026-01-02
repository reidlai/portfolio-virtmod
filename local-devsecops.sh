#!/bin/bash
set -e

echo "Running Local DevSecOps Gates..."

echo "1. Formatting & Linting..."
moon run lint

echo "2. Unit Tests..."
moon run test

echo "3. Secret Scanning (Trivy)..."
# Assumes trivy is installed
if command -v trivy &> /dev/null; then
    trivy fs --scanners secret .
else
    echo "Warning: Trivy not found, skipping secret scan."
fi

echo "All Gates Passed."
