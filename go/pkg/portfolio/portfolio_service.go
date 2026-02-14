package portfolio

import (
	"context"
	"log/slog"
	"time"

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

// NewPortfolioService returns the portfolio service implementation.
func NewPortfolioService(logger *slog.Logger) genportfolio.Service {
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

// WatchPortfolioSummary implements watchPortfolioSummary.
func (s *portfoliosrvc) WatchPortfolioSummary(ctx context.Context, stream genportfolio.WatchPortfolioSummaryServerStream) (err error) {
	s.logger.InfoContext(ctx, "portfolio.watchPortfolioSummary: start streaming")

	// 1. Send initial data immediately
	initial := &genportfolio.PortfolioSummary{
		Balance:       12500.50,
		Currency:      "USD",
		ChangePercent: 12.5,
	}
	if err := stream.Send(initial); err != nil {
		s.logger.ErrorContext(ctx, "failed to send update", "error", err)
		return err
	}

	// 2. Setup a ticker to send updates every second
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			s.logger.InfoContext(ctx, "portfolio.watchPortfolioSummary: client disconnected")
			return nil
		case t := <-ticker.C:
			// Create some variation in the mock data
			// (In a real app, you'd fetch this from a DB or event bus)
			mockUpdate := &genportfolio.PortfolioSummary{
				Balance:       12500.50 + float64(t.Second()), // Just adding seconds to vary it
				Currency:      "USD",
				ChangePercent: 12.5 + (float64(t.Second()) / 10.0),
			}

			if err := stream.Send(mockUpdate); err != nil {
				s.logger.ErrorContext(ctx, "failed to send update", "error", err)
				return err
			}
		}
	}
}
