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
})
