// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/svelte";
import PortfolioSummaryWidget from "./PortfolioSummaryWidget.svelte";

// Mock dependencies
const { mockGoto } = vi.hoisted(() => ({
  mockGoto: vi.fn(),
}));

vi.mock("$app/navigation", () => ({
  goto: mockGoto,
}));

// Mock the Rune State directly
vi.mock("../runes/PortfolioSummaryState.svelte", () => ({
  portfolioSummaryState: {
    summary: {
      balance: 1000,
      currency: "USD",
      changePercent: 5,
    },
    loading: false,
    error: null,
    getPortfolioSummary: vi.fn(),
    init: vi.fn(),
  },
}));

import { portfolioSummaryState } from "../runes/PortfolioSummaryState.svelte";

describe("PortfolioSummaryWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock state
    // @ts-ignore
    portfolioSummaryState.loading = false;
    // @ts-ignore
    portfolioSummaryState.error = null;
  });

  it("should render and show balance from state", () => {
    const { getByText } = render(PortfolioSummaryWidget);
    // Balance is 1000 from mock initial state
    expect(getByText(/1000/)).toBeTruthy();
    expect(getByText(/USD/)).toBeTruthy();
  });

  it("should display loading state", () => {
    // @ts-ignore
    portfolioSummaryState.loading = true;
    const { getByText } = render(PortfolioSummaryWidget);
    expect(getByText(/Loading.../)).toBeTruthy();
  });
});
