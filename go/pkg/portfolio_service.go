package pkg

import (
	"context"
	"log/slog"

	genportfolio "github.com/reidlai/ta-workspace/modules/portfolio/go/goa_gen/gen/portfolio"
)

// portfolio service implementation.
type portfoliosrvc struct {
	logger *slog.Logger
}

// Verify that portfoliosrvc implements portfolio.Service.
// This line tells the compiler: "Please fail the build immediately if *portfoliosrvc does not strictly satisfy the
// portfolio.Service interface." This is the "bridge" that ensures your struct implementation stays in sync with your interface definition.
var _ genportfolio.Service = (*portfoliosrvc)(nil)

// NewPortfolio returns the portfolio service implementation.
func NewPortfolio(logger *slog.Logger) genportfolio.Service {
	return &portfoliosrvc{
		logger: logger,
	}
}

// Get portfolio summary
// Get portfolio summary
func (s *portfoliosrvc) GetPortfolioSummary(ctx context.Context) (res *genportfolio.PortfolioSummary, err error) {
	s.logger.InfoContext(ctx, "portfolio.getPortfolioSummary")

	// Mock data for now, matching the frontend simulation
	res = &genportfolio.PortfolioSummary{
		Balance:       12500.50,
		Currency:      "USD",
		ChangePercent: 12.5,
	}
	return
}
