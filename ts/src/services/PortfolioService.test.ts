import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { PortfolioService } from './PortfolioService';

// Mock response data
const mockApiResponse = {
  balance: 9999.99,
  currency: 'GBP',
  trend_percent: 25.5,
  trend_direction: 'up'
};

const createFetchResponse = (ok: boolean, data: unknown) => {
  return {
    ok,
    json: () => Promise.resolve(data)
  } as Response;
}

describe('PortfolioService (Unit)', () => {
  let service: PortfolioService;
  let mockFetch: Mock;

  beforeEach(() => {
    // Create a dedicated mock function (Stub) for the API
    mockFetch = vi.fn().mockImplementation(() =>
      Promise.resolve(createFetchResponse(true, mockApiResponse))
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not fetch summary automatically on initialization', async () => {
    service = new PortfolioService({
      fetcher: mockFetch,
      apiBaseUrl: 'http://test-api.com'
    });

    // API CALL VERIFICATION - should not happen automatically
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should fetch summary when called using injected fetcher (Stub)', async () => {
    service = new PortfolioService({
      fetcher: mockFetch,
      apiBaseUrl: 'http://test-api.com'
    });

    // FETCH EXPLICITLY
    await service.fetchSummary();

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-api.com/portfolio/summary',
      expect.objectContaining({
        headers: { 'X-User-ID': 'demo-user' }
      })
    );
  });

  it('should update state with data from API', async () => {
    service = new PortfolioService({ fetcher: mockFetch, apiBaseUrl: 'http://test' });
    await service.fetchSummary();

    const state = service.getSummary();

    expect(state.balance).toBe(mockApiResponse.balance);
    expect(state.currency).toBe(mockApiResponse.currency);
    expect(state.trend_percent).toBe(mockApiResponse.trend_percent);
    expect(state.trend_direction).toBe(mockApiResponse.trend_direction);
  });

  it('should handle fetch errors gracefully', async () => {
    const errorFetch = vi.fn().mockResolvedValue(createFetchResponse(false, null));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    service = new PortfolioService({ fetcher: errorFetch, apiBaseUrl: 'http://test' });
    await service.fetchSummary();

    expect(consoleSpy).toHaveBeenCalledWith(
      'PortfolioService fetch error:',
      expect.anything()
    );
  });
});
