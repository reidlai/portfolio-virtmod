package pkg

import (
	"context"
	"crypto/rand"
	"log/slog"
	"math/big"

	portfolio "github.com/reidlai/ta-workspace/modules/portfolio/go/gen/portfolio"
)

// portfolio service implementation.
type portfoliosrvc struct {
	logger *slog.Logger
}

// Verify that portfoliosrvc implements portfolio.Service.
// This line tells the compiler: "Please fail the build immediately if *portfoliosrvc does not strictly satisfy the 
// portfolio.Service interface." This is the "bridge" that ensures your struct implementation stays in sync with your interface definition.
var _ portfolio.Service = (*portfoliosrvc)(nil)

// NewPortfolio returns the portfolio service implementation.
func NewPortfolio(logger *slog.Logger) portfolio.Service {
	return &portfoliosrvc{logger: logger}
}

// Get portfolio for current watchlist
func (s *portfoliosrvc) List(ctx context.Context, p *portfolio.ListPayload) (res []*portfolio.Insight, err error) {
	s.logger.InfoContext(ctx, "portfolio.list", "user", p.UserID)

	demos := []string{"AAPL", "TSLA", "NVDA", "MSFT"}
	res = make([]*portfolio.Insight, 0)

	for _, sym := range demos {
		res = append(res, &portfolio.Insight{
			Symbol:    sym,
			Sentiment: randomSentiment(),
			Summary:   "AI generated summary for " + sym + ": Moving average indicates strong momentum.",
			Action:    "HOLD",
		})
	}
	return
}

// Get portfolio summary
func (s *portfoliosrvc) Summary(ctx context.Context, p *portfolio.SummaryPayload) (res *portfolio.Summary2, err error) {
	s.logger.InfoContext(ctx, "portfolio.summary", "user", p.UserID)

	// Mock data for now, matching the frontend simulation
	res = &portfolio.Summary2{
		Balance:        12500.50,
		Currency:       "USD",
		TrendPercent:   12.5,
		TrendDirection: "up",
	}
	return
}

func randomSentiment() string {
	n, err := rand.Int(rand.Reader, big.NewInt(3))
	if err != nil {
		return "neutral"
	}
	switch n.Int64() {
	case 0:
		return "bullish"
	case 1:
		return "bearish"
	default:
		return "neutral"
	}
}
