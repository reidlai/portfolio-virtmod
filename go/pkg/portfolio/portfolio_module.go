package portfolio

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/jirenius/go-res"
	portfoliosvr "github.com/reidlai/ta-workspace/modules/portfolio/go/goa_gen/gen/http/portfolio/server"
	genportfolio "github.com/reidlai/ta-workspace/modules/portfolio/go/goa_gen/gen/portfolio"
	"github.com/reidlai/virtual-module-core/go/pkg/module"
	"goa.design/clue/debug"
	goahttp "goa.design/goa/v3/http"
)

// PortfolioModule implements HTTP and RES registration for portfolio
type PortfolioModule struct {
	module.Module
	endpoints *genportfolio.Endpoints
}

// NewModule creates a new portfolio module with initialized endpoints
func NewModule(logger *slog.Logger) *PortfolioModule {
	svc := NewPortfolio(logger)
	endpoints := genportfolio.NewEndpoints(svc)
	endpoints.Use(debug.LogPayloads())

	return &PortfolioModule{
		Module:    module.NewModule("portfolio"),
		endpoints: endpoints,
	}
}

// RegisterHTTP implements Registrar interface
func (m *PortfolioModule) RegisterHTTP(
	mux goahttp.Muxer,
	dec func(*http.Request) goahttp.Decoder,
	enc func(context.Context, http.ResponseWriter) goahttp.Encoder,
	eh func(context.Context, http.ResponseWriter, error),
) []module.MountPoint {
	srv := portfoliosvr.New(m.endpoints, mux, dec, enc, eh, nil)
	portfoliosvr.Mount(mux, srv)

	// Convert Goa mount points to our generic format
	result := make([]module.MountPoint, len(srv.Mounts))
	for i, mp := range srv.Mounts {
		result[i] = module.MountPoint{
			Method:  mp.Method,
			Verb:    mp.Verb,
			Pattern: mp.Pattern,
		}
	}
	return result
}

// RegisterRES implements Registrar interface
func (m *PortfolioModule) RegisterRES(resSvc *res.Service) {
	// TODO: When module-level RES handlers are implemented, register them here
	// Example: portfoliores.NewHandler(m.endpoints).Register(resSvc)
}
