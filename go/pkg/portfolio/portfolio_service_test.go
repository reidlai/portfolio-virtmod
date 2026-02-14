package portfolio

import (
	"context"
	"io"
	"log/slog"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPortfolioGetPortfolioSummary(t *testing.T) {
	// Arrange
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))

	ctx := context.Background()
	svc := NewPortfolioService(logger)

	// Act
	res, err := svc.GetPortfolioSummary(ctx)

	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, res)
	assert.Equal(t, 12500.50, res.Balance)
	assert.Equal(t, "USD", res.Currency)
	assert.Equal(t, 12.5, res.ChangePercent)
}
