import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { PortfolioRxService } from "./PortfolioRxService";
import { api, schemas } from "../lib/api-client";
import { logger } from "../utils/logger";

// Mock response data
import { mockGetPortfolioSummarySuccessfulResponse } from "./mocks/portfolioMocks";

describe("PortfolioService (Unit)", () => {
  let service: PortfolioRxService;
  let mockClient: { get: Mock };

  beforeEach(() => {
    // Create a mock Zodios client
    mockClient = {
      get: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should not fetch summary automatically on initialization", async () => {
    service = new PortfolioRxService({
      apiBaseUrl: "http://test-api.com",
      apiClient: mockClient as unknown as typeof api,
    });

    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should fetch summary when called using injected client", async () => {
    const transformedMock = schemas.PortfolioSummary.parse(
      mockGetPortfolioSummarySuccessfulResponse,
    );
    mockClient.get.mockResolvedValue(transformedMock);

    service = new PortfolioRxService({
      apiBaseUrl: "http://test-api.com",
      apiClient: mockClient as unknown as typeof api,
    });

    await service.getPortfolioSummary();

    expect(mockClient.get).toHaveBeenCalledWith("/portfolio/summary", {
      headers: { "X-User-ID": "test-user" },
    });
  });

  it("should update state with data from API", async () => {
    // Mock the transformed response because the client is expected to return the transformed type
    const transformedMock = schemas.PortfolioSummary.parse(
      mockGetPortfolioSummarySuccessfulResponse,
    );
    mockClient.get.mockResolvedValue(transformedMock);

    service = new PortfolioRxService({
      apiBaseUrl: "http://test",
      apiClient: mockClient as unknown as typeof api,
    });

    await service.getPortfolioSummary();

    // Test synchronous getter
    expect(service.summary.balance).toBe(
      mockGetPortfolioSummarySuccessfulResponse.balance,
    );
    expect(service.summary.currency).toBe(
      mockGetPortfolioSummarySuccessfulResponse.currency,
    );
    expect(service.summary.change_percent).toBe(
      mockGetPortfolioSummarySuccessfulResponse.change_percent,
    );
  });

  it("should allow setting summary via property", () => {
    service = new PortfolioRxService({
      apiBaseUrl: "http://test",
      apiClient: mockClient as unknown as typeof api,
    });
    const newSummary = { balance: 100, currency: "USD", change_percent: 5 };
    service.summary = newSummary;

    expect(service.summary).toEqual(newSummary);
  });

  it("should handle fetch errors gracefully", async () => {
    const error = new Error("Network error");
    mockClient.get.mockRejectedValue(error);
    const loggerSpy = vi.spyOn(logger, "error").mockImplementation(() => {});

    service = new PortfolioRxService({
      apiBaseUrl: "http://test",
      apiClient: mockClient as unknown as typeof api,
    });
    await expect(service.getPortfolioSummary()).rejects.toThrow(
      "Network error",
    );

    expect(loggerSpy).toHaveBeenCalledWith(
      { err: error },
      "Failed to fetch portfolio summary",
    );

    // Initial state should preserve or go to error state
    // Check error state
    service.error$.subscribe((err: string | null) => {
      if (err) expect(err).toBe("Network error");
    });
  });
});
