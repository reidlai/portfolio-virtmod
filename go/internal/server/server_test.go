package server

import (
	"context"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"sync"
	"testing"
	"time"

	portfolioGen "github.com/reidlai/ta-workspace/modules/portfolio/go/goa_gen/gen/portfolio"
	portfolioPkg "github.com/reidlai/ta-workspace/modules/portfolio/go/pkg/portfolio"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// GetFreePort asks the kernel for a free open port that is ready to use.
func GetFreePort() (int, error) {
	addr, err := net.ResolveTCPAddr("tcp", "localhost:0")
	if err != nil {
		return 0, err
	}

	l, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return 0, err
	}
	defer l.Close()
	return l.Addr().(*net.TCPAddr).Port, nil
}

func TestHandleHTTPServer(t *testing.T) {
	// 1. Setup
	port, err := GetFreePort()
	require.NoError(t, err)

	cfg := &Config{
		Host:     "localhost",
		Port:     fmt.Sprintf("%d", port),
		LogLevel: "ERROR", // Keep logs quiet during test
		Debug:    true,
	}

	logger := slog.New(slog.NewTextHandler(os.Stderr, nil))
	svc := portfolioPkg.NewPortfolioService(logger)
	endpoints := portfolioGen.NewEndpoints(svc)

	errc := make(chan error, 1)
	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 2. Start Server
	// Note: handleHTTPServer starts its own goroutine for the server loop
	handleHTTPServer(ctx, cfg, endpoints, &wg, errc, logger)

	// Wait for server to be up
	serverURL := fmt.Sprintf("http://localhost:%d/portfolio/summary", port)
	assert.Eventually(t, func() bool {
		req, _ := http.NewRequest("GET", serverURL, nil)
		req.Header.Set("X-User-ID", "test-user")
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return false
		}
		defer resp.Body.Close()
		return resp.StatusCode == http.StatusOK
	}, 5*time.Second, 100*time.Millisecond, "Server failed to start in time")

	// 3. Verify Health/Response
	req, _ := http.NewRequest("GET", serverURL, nil)
	req.Header.Set("X-User-ID", "test-user")
	resp, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	defer resp.Body.Close()
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// 4. Shutdown
	cancel()

	// Wait for graceful shutdown completion
	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()

	select {
	case <-done:
		// success
	case <-time.After(5 * time.Second):
		t.Fatal("Timeout waiting for server shutdown")
	case err := <-errc:
		t.Fatalf("Unexpected error from server: %v", err)
	}
}
