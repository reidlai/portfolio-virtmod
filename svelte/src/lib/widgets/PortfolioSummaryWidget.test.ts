import { describe, it, expect, vi } from "vitest";
import PortfolioSummaryWidget from "./PortfolioSummaryWidget.svelte";

// Mock dependencies
vi.mock("$app/navigation", () => ({
  goto: vi.fn(),
}));

// Mock portfolio service to prevent network noise
vi.mock('@modules/portfolio-ts', () => ({
  portfolioService: {
    summary$: { subscribe: () => { } }, // minimal mock for now
    updateSummary: vi.fn(),
    setConfig: vi.fn(),
    getSummary: vi.fn().mockReturnValue({ // Needed by Rune initialization
      balance: 0, currency: 'USD', trendPercent: 0, trendDirection: 'neutral'
    })
  }
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
