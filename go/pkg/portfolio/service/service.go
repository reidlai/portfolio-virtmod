package service

import (
	"context"
	"log/slog"
	"sync"
	"time"

	genportfolio "github.com/reidlai/ta-workspace/modules/portfolio/go/goa_gen/gen/portfolio"
)

// PortfolioService implementation.
type PortfolioService struct {
	logger *slog.Logger
	mu     sync.RWMutex
	state  *genportfolio.PortfolioSummary
}

// NewPortfolioService returns the portfolio business service.
func NewPortfolioService(logger *slog.Logger) *PortfolioService {
	return &PortfolioService{
		logger: logger,
		state: &genportfolio.PortfolioSummary{
			Balance:       12500.50,
			Currency:      "USD",
			ChangePercent: 12.5,
		},
	}
}

// StartSimulation starts a background routine to simulate state changes.
func (s *PortfolioService) StartSimulation(ctx context.Context) {
	go func() {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				s.mu.Lock()
				// Mock variation: balance and change percent fluctuate slightly
				now := time.Now()
				s.state.Balance = 12500.50 + float64(now.Second())
				s.state.ChangePercent = 12.5 + (float64(now.Second()) / 10.0)
				s.mu.Unlock()
			}
		}
	}()
}

// GetPortfolioSummary returns the current portfolio summary.
func (s *PortfolioService) GetPortfolioSummary(ctx context.Context) (*genportfolio.PortfolioSummary, error) {
	s.logger.DebugContext(ctx, "portfolio.getPortfolioSummary")
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Return a copy to avoid external mutations affecting our internal state
	return &genportfolio.PortfolioSummary{
		Balance:       s.state.Balance,
		Currency:      s.state.Currency,
		ChangePercent: s.state.ChangePercent,
	}, nil
}
