package pkg

import (
	"context"
	"io"
	"log/slog"
	"testing"

	portfolio "github.com/reidlai/ta-workspace/modules/portfolio/go/gen/portfolio"
	"github.com/stretchr/testify/assert"
)

func TestPortfolioList(t *testing.T) {
	// Arrange
	// Use a discard logger for testing since we don't need to assert on logs
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))

	ctx := context.Background()
	svc := NewPortfolio(logger)

	// Act
	res, err := svc.List(ctx, &portfolio.ListPayload{UserID: "user-123"})

	// Assert
	assert.NoError(t, err)
	assert.NotEmpty(t, res)
	assert.Equal(t, "AAPL", res[0].Symbol)
}
