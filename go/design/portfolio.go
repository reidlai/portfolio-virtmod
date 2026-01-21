package design

import (
	. "goa.design/goa/v3/dsl"
)

var PortfolioSummarySchema = Type("PortfolioSummary", func() { // Type "PortfolioSummary" will be found in OpenAPI components.schemas section

	// Match Zod schema defined in ts/src/schema/portfolio.ts
	// export const PortfolioSummarySchema = z.object({
	//   balance: z.number(),
	//   currency: z.string(),
	//   changePercent: z.number(),
	// });
	Attribute("balance", Float64, "Total Balance")
	Attribute("currency", String, "Currency Code")
	Attribute("change_percent", Float64, "Change Percentage")

	// Required attribute list
	Required("balance", "currency", "change_percent")
})

// Match zodios API defined in zod schema file ts/src/schema/portfolio.ts as baseline. Security schema, Error schema, and HTTP schema are revised here. Benefit of converting zod schema to Goa DSL is that it can be used to generate client and server stubs together with future MCP extensions.
var _ = Service("portfolio", func() {
	Description("Portfolio API")
	Error("unauthorized", String, "Missing or invalid token")
	Error("not_found", String, "Portfolio not found for user")
	Method("getPortfolioSummary", func() {
		Result(PortfolioSummarySchema)
		HTTP(func() {
			GET("/portfolio/summary")
			Response(StatusOK)
		})
	})
})
