package design

import (
	. "goa.design/goa/v3/dsl"
)

var Insight = Type("Insight", func() {
	Attribute("symbol", String, "Stock Symbol")
	Attribute("sentiment", String, "Market Sentiment", func() {
		Enum("bullish", "bearish", "neutral")
	})
	Attribute("summary", String, "Analysis Summary")
	Attribute("action", String, "Recommended Action")
	Required("symbol", "sentiment", "summary", "action")
})

var SummaryObj = Type("Summary", func() {
	Attribute("balance", Float64, "Total Balance")
	Attribute("currency", String, "Currency Code")
	Attribute("trend_percent", Float64, "Trend Percentage")
	Attribute("trend_direction", String, "Trend Direction", func() {
		Enum("up", "down", "neutral")
	})
	Required("balance", "currency", "trend_percent", "trend_direction")
})

var _ = Service("portfolio", func() {
	Description("Provide AI insights")

	Method("list", func() {
		Payload(func() {
			Attribute("user_id", String, "User ID")
			Required("user_id")
		})
		Result(ArrayOf(Insight))
		HTTP(func() {
			GET("/portfolio")
			Header("user_id:X-User-ID")
			Response(StatusOK)
		})
	})

	Method("summary", func() {
		Payload(func() {
			Attribute("user_id", String, "User ID")
			Required("user_id")
		})
		Result(SummaryObj)
		HTTP(func() {
			GET("/portfolio/summary")
			Header("user_id:X-User-ID")
			Response(StatusOK)
		})
	})
})
