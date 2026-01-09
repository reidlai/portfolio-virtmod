package server

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	portfolioGen "github.com/reidlai/ta-workspace/modules/portfolio/go/gen/portfolio"
	portfolioSvr "github.com/reidlai/ta-workspace/modules/portfolio/go/gen/http/portfolio/server"
	portfolioPkg "github.com/reidlai/ta-workspace/modules/portfolio/go/pkg"
	goahttp "goa.design/goa/v3/http"
	httpmdlwr "goa.design/goa/v3/http/middleware"
	"goa.design/goa/v3/middleware"
)

type Config struct {
	Host     string
	Port     string
	Debug    bool
	LogLevel string
}

// adapter implements middleware.Logger interface by writing to slog
type adapter struct {
	logger *slog.Logger
	ctx    context.Context
}

func (a *adapter) Log(keyvals ...interface{}) error {
	a.logger.InfoContext(a.ctx, "http", keyvals...)
	return nil
}

func Run(cfg *Config) error {
	// Setup logger
	// In a real app we might configure level based on cfg.LogLevel
	logger := slog.New(slog.NewTextHandler(os.Stderr, nil))

	// Initialize the service
	portfolioSvc := portfolioPkg.NewPortfolio(logger)

	// Wrap the service with Goa endpoints
	endpoints := portfolioGen.NewEndpoints(portfolioSvc)

	// Create channel used by both the signal handler and server goroutines
	errc := make(chan error)

	// Support graceful shutdown
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, syscall.SIGINT, syscall.SIGTERM)
		errc <- fmt.Errorf("%s", <-c)
	}()

	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(context.Background())

	// Start HTTP Server
	handleHTTPServer(ctx, cfg, endpoints, &wg, errc, logger)

	// Wait for signal
	logger.InfoContext(ctx, "exiting", "reasons", <-errc)

	// Send cancellation signal to the goroutines
	cancel()

	// Wait for the servers to shutdown
	wg.Wait()
	logger.Info("exited")
	return nil
}

func handleHTTPServer(ctx context.Context, cfg *Config, endpoints *portfolioGen.Endpoints, wg *sync.WaitGroup, errc chan error, logger *slog.Logger) {
	// Setup goa log adapter for the middleware
	var (
		mdlwrAdapter middleware.Logger
	)
	{
		mdlwrAdapter = &adapter{logger: logger, ctx: ctx}
	}

	var (
		dec = goahttp.RequestDecoder
		enc = goahttp.ResponseEncoder
	)

	var mux goahttp.Muxer
	{
		mux = goahttp.NewMuxer()
	}

	var (
		portfolioServer *portfolioSvr.Server
	)
	{
		portfolioServer = portfolioSvr.New(endpoints, mux, dec, enc, nil, nil)
		if cfg.Debug {
			portfolioServer.Use(httpmdlwr.Debug(mux, os.Stdout))
		}
	}

	portfolioSvr.Mount(mux, portfolioServer)

	var handler http.Handler = mux
	{
		handler = httpmdlwr.Log(mdlwrAdapter)(handler)       //nolint:staticcheck // Deprecated but sufficient for dev server
		handler = httpmdlwr.RequestID()(handler) //nolint:staticcheck // Deprecated but sufficient for dev server
	}

	addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	svr := &http.Server{Addr: addr, Handler: handler}

	wg.Add(1)
	go func() {
		defer wg.Done()

		go func() {
			logger.Info("HTTP server listening", "addr", addr)
			if err := svr.ListenAndServe(); err != http.ErrServerClosed {
				errc <- err
			}
		}()

		<-ctx.Done()
		logger.Info("shutting down HTTP server")

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		if err := svr.Shutdown(ctx); err != nil {
			logger.Error("failed to shutdown", "error", err)
		}
	}()
}
