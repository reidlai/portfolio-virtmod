package pkg

import (
	"context"
	"log/slog"
	"math/rand"

	portfolio "github.com/reidlai/ta-workspace/modules/portfolio/go/gen/portfolio"
)

// portfolio service implementation.
type portfoliosrvc struct {
	logger *slog.Logger
}

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

func randomSentiment() string {
	r := rand.Intn(3)
	switch r {
	case 0:
		return "bullish"
	case 1:
		return "bearish"
	default:
		return "neutral"
	}
}
