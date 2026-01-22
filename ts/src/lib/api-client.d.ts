import { type ZodiosOptions } from "@zodios/core";
import { z } from "zod";
export declare const schemas: {
  PortfolioSummary: z.ZodObject<
    {
      balance: z.ZodNumber;
      change_percent: z.ZodNumber;
      currency: z.ZodString;
    },
    "passthrough",
    z.ZodTypeAny,
    z.objectOutputType<
      {
        balance: z.ZodNumber;
        change_percent: z.ZodNumber;
        currency: z.ZodString;
      },
      z.ZodTypeAny,
      "passthrough"
    >,
    z.objectInputType<
      {
        balance: z.ZodNumber;
        change_percent: z.ZodNumber;
        currency: z.ZodString;
      },
      z.ZodTypeAny,
      "passthrough"
    >
  >;
};
export declare const api: import("@zodios/core").ZodiosInstance<
  [
    {
      method: "get";
      path: "/portfolio/summary";
      alias: "portfolio#getPortfolioSummary";
      requestFormat: "json";
      response: z.ZodObject<
        {
          balance: z.ZodNumber;
          change_percent: z.ZodNumber;
          currency: z.ZodString;
        },
        "passthrough",
        z.ZodTypeAny,
        z.objectOutputType<
          {
            balance: z.ZodNumber;
            change_percent: z.ZodNumber;
            currency: z.ZodString;
          },
          z.ZodTypeAny,
          "passthrough"
        >,
        z.objectInputType<
          {
            balance: z.ZodNumber;
            change_percent: z.ZodNumber;
            currency: z.ZodString;
          },
          z.ZodTypeAny,
          "passthrough"
        >
      >;
    },
  ]
>;
export declare function createApiClient(
  baseUrl: string,
  options?: ZodiosOptions,
): import("@zodios/core").ZodiosInstance<
  [
    {
      method: "get";
      path: "/portfolio/summary";
      alias: "portfolio#getPortfolioSummary";
      requestFormat: "json";
      response: z.ZodObject<
        {
          balance: z.ZodNumber;
          change_percent: z.ZodNumber;
          currency: z.ZodString;
        },
        "passthrough",
        z.ZodTypeAny,
        z.objectOutputType<
          {
            balance: z.ZodNumber;
            change_percent: z.ZodNumber;
            currency: z.ZodString;
          },
          z.ZodTypeAny,
          "passthrough"
        >,
        z.objectInputType<
          {
            balance: z.ZodNumber;
            change_percent: z.ZodNumber;
            currency: z.ZodString;
          },
          z.ZodTypeAny,
          "passthrough"
        >
      >;
    },
  ]
>;
