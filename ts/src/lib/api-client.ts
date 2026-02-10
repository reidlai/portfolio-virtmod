import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const PortfolioSummary = z
  .object({
    balance: z.number(),
    change_percent: z.number(),
    currency: z.string(),
  })
  .passthrough();

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
  {
    method: "get",
    path: "/portfolio/summary/watch",
    alias: "portfolio#watchPortfolioSummary",
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 101,
        description: `Switching Protocols response.`,
        schema: PortfolioSummary,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
