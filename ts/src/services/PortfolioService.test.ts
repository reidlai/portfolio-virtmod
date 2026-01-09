import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PortfolioService, IFetcher } from './PortfolioService';

// Mock response data
const mockApiResponse = {
  balance: 9999.99,
  currency: 'GBP',
  trend_percent: 25.5,
  trend_direction: 'up'
};

const createFetchResponse = (ok: boolean, data: any) => {
  return {
    ok,
    json: () => Promise.resolve(data)
  } as Response;
}

describe('PortfolioService (Unit)', () => {
  let service: PortfolioService;
  let mockFetch: any;

  beforeEach(() => {
    // Create a dedicated mock function (Stub) for the API
    mockFetch = vi.fn().mockImplementation(() =>
      Promise.resolve(createFetchResponse(true, mockApiResponse))
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fetch summary on initialization using injected fetcher (Stub)', async () => {
    // INJECTION: Pass the mock/stub via config
    service = new PortfolioService({
      fetcher: mockFetch,
      apiBaseUrl: 'http://test-api.com'
    });

    // API CALL VERIFICATION
    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-api.com/portfolio/summary',
      expect.objectContaining({
        headers: { 'X-User-ID': 'demo-user' }
      })
    );
  });

  it('should update state with data from API', async () => {
    service = new PortfolioService({ fetcher: mockFetch, apiBaseUrl: 'http://test' });

    // Wait a microtask for promise resolution
    await new Promise(resolve => setTimeout(resolve, 0));

    const state = service.getSummary();

    expect(state.balance).toBe(mockApiResponse.balance);
    expect(state.currency).toBe(mockApiResponse.currency);
    expect(state.trendPercent).toBe(mockApiResponse.trend_percent);
    expect(state.trendDirection).toBe(mockApiResponse.trend_direction);
  });

  it('should poll for updates periodically', async () => {
    vi.useFakeTimers();
    service = new PortfolioService({ fetcher: mockFetch, apiBaseUrl: 'http://test' });

    mockFetch.mockClear();

    // Fast-forward time to trigger the interval
    await vi.advanceTimersByTimeAsync(30001);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors gracefully', async () => {
    const errorFetch = vi.fn().mockResolvedValue(createFetchResponse(false, null));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    service = new PortfolioService({ fetcher: errorFetch, apiBaseUrl: 'http://test' });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(consoleSpy).toHaveBeenCalledWith(
      'PortfolioService fetch error:',
      expect.anything()
    );
  });
});
