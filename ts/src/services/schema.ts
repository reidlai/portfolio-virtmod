import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const Insight = z
  .object({
    action: z.string(),
    sentiment: z.enum(["bullish", "bearish", "neutral"]),
    summary: z.string(),
    symbol: z.string(),
  })
  .passthrough();
const Summary = z
  .object({
    balance: z.number(),
    currency: z.string(),
    trend_direction: z.enum(["up", "down", "neutral"]),
    trend_percent: z.number(),
  })
  .passthrough();

export const schemas = {
  Insight,
  Summary,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/portfolio",
    alias: "portfolio#list",
    requestFormat: "json",
    parameters: [
      {
        name: "X-User-ID",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: z.array(Insight),
  },
  {
    method: "get",
    path: "/portfolio/summary",
    alias: "portfolio#summary",
    requestFormat: "json",
    parameters: [
      {
        name: "X-User-ID",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: Summary,
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
