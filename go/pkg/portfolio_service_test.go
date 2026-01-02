package pkg

import (
	"context"
	"testing"

	portfolio "github.com/reidlai/ta-workspace/modules/portfolio/go/gen/portfolio"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockLogger is a testify mock for the Logger interface
type MockLogger struct {
	mock.Mock
}

func (m *MockLogger) Info(msg string, args ...any) {
	m.Called(msg, args)
}

func (m *MockLogger) Error(msg string, args ...any) {
	m.Called(msg, args)
}

func (m *MockLogger) Debug(msg string, args ...any) {
	m.Called(msg, args)
}

func (m *MockLogger) Warn(msg string, args ...any) {
	m.Called(msg, args)
}

func (m *MockLogger) InfoContext(ctx context.Context, msg string, args ...any) {
	m.Called(ctx, msg, args)
}

func TestPortfolioList(t *testing.T) {
	// Arrange
	mockLogger := new(MockLogger)
	// Expect InfoContext with specific args.
	// Note: args... matches as a slice.
	mockLogger.On("InfoContext", mock.Anything, "portfolio.list", mock.Anything).Return()

	ctx := context.Background()
	svc := NewPortfolio(mockLogger)

	// Act
	res, err := svc.List(ctx, &portfolio.ListPayload{UserID: "user-123"})

	// Assert
	assert.NoError(t, err)
	assert.NotEmpty(t, res)
	assert.Equal(t, "AAPL", res[0].Symbol)

	// Verify mock was called
	mockLogger.AssertExpectations(t)
}
