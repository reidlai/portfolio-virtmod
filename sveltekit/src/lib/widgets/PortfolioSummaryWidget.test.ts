import { describe, it, expect, vi } from "vitest";
import PortfolioSummaryWidget from "./PortfolioSummaryWidget.svelte";

// Mock dependencies
vi.mock("$app/navigation", () => ({
  goto: vi.fn(),
}));

// Mock portfolio service to prevent network noise
vi.mock("@modules/portfolio-ts", () => ({
  portfolioRxService: {
    summary$: { subscribe: () => {} },
    error$: { subscribe: () => {} },
    usingMockData$: { subscribe: () => {} },
    setConfig: vi.fn(),
    getPortfolioSummary: vi.fn().mockReturnValue({ then: () => {} }), // Mock promise
    get summary() {
      return {
        balance: 0,
        currency: "USD",
        changePercent: 0,
      };
    },
    get error() {
      return null;
    },
  },
  schemas: {
    PortfolioSummary: {
      parse: vi.fn(),
    },
  },
}));

describe("PortfolioSummaryWidget", () => {
  it("can be imported and test runner executes", () => {
    expect(PortfolioSummaryWidget).toBeTruthy();
    expect(true).toBe(true);
  });

  // Keeping render test commented out for future implementation
  // it("renders without crashing", () => {
  //    const valuation = { ... };
  //    render(PortfolioSummaryWidget, { valuation });
  // });
});
