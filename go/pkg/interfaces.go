package pkg

import "context"

// Logger abstracts the structured logging interface to enable mocking.
type Logger interface {
	Info(msg string, args ...any)
	Error(msg string, args ...any)
	Debug(msg string, args ...any)
	Warn(msg string, args ...any)
	InfoContext(ctx context.Context, msg string, args ...any)
}

// PortfolioService defines the interface for the business logic (if needed internally).
// For now, it matches gen/portfolio.Service.
type PortfolioService interface {
	Get(ctx context.Context, id string) (any, error) // Placeholder based on current logic
}
