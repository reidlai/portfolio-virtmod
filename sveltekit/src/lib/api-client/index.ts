import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const PortfolioSummary = z
  .object({
    balance: z.number(),
    change_percent: z.number(),
    currency: z.string(),
  })
  .passthrough()
  .transform((data) => ({
    balance: data.balance,
    changePercent: data.change_percent,
    currency: data.currency,
  }));

export const schemas = {
  PortfolioSummary,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/portfolio/summary",
    alias: "portfolio#getPortfolioSummary",
    requestFormat: "json",
    response: PortfolioSummary,
  },
]);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
