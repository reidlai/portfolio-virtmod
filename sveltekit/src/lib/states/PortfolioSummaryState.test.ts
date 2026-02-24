// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PortfolioSummaryState } from "./PortfolioSummaryState.svelte";

// Mock schemas from local api-client, createApiClient not needed since we inject
vi.mock("../api-client/index", () => {
  return {
    schemas: {
      PortfolioSummary: {
        parse: vi.fn().mockImplementation((val) => {
          return val;
        }),
      },
    },
  };
});

// Mock logger to prevent hangs and verify calls
vi.mock("../utils/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("PortfolioSummaryState", () => {
  let mockApi: any;
  let portfolioSummaryState: PortfolioSummaryState;

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { get: vi.fn() };
    portfolioSummaryState = PortfolioSummaryState.getInstance({ apiClient: mockApi });
    portfolioSummaryState.reset();
  });

  it("should initialize with default state", () => {
    expect(portfolioSummaryState.summary).toBe(null);
    expect(portfolioSummaryState.loading).toBe(false);
    expect(portfolioSummaryState.error).toBe(null);
  });

  it("should update usingMockData when init is called", () => {
    PortfolioSummaryState.getInstance({ usingMockData: true });
    expect(portfolioSummaryState.usingMockData).toBe(true);
  });

  it("should fetch summary when watchPortfolioSummary is called", async () => {
    const mockData = { balance: 500, changePercent: 1, currency: "EUR" };
    mockApi.get.mockResolvedValueOnce(mockData);

    await portfolioSummaryState.watchPortfolioSummary();
    expect(mockApi.get).toHaveBeenCalledWith(
      "/portfolio/summary",
      expect.any(Object),
    );
    expect(portfolioSummaryState.summary).toEqual(mockData);
  });

  it("should fetch summary when getPortfolioSummary is called", async () => {
    const mockData = { balance: 500, changePercent: 1, currency: "EUR" };
    mockApi.get.mockResolvedValueOnce(mockData);

    await portfolioSummaryState.getPortfolioSummary();
    expect(mockApi.get).toHaveBeenCalledWith(
      "/portfolio/summary",
      expect.any(Object),
    );
    expect(portfolioSummaryState.summary).toEqual(mockData);
  });

  it("should handle error when API call fails", async () => {
    mockApi.get.mockRejectedValueOnce(new Error("API Error"));

    await expect(portfolioSummaryState.getPortfolioSummary()).rejects.toThrow("API Error");
    expect(portfolioSummaryState.error).toBe("API Error");
    expect(portfolioSummaryState.loading).toBe(false);
  });
});
