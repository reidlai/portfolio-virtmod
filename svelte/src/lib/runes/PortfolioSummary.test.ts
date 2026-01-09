import { describe, it, expect, vi, beforeEach } from 'vitest';

// We avoid importing external modules inside the factory to prevent Vitest/Vite resolution issues.
vi.mock('@modules/portfolio-ts', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@modules/portfolio-ts')>();

    let _value = {
        balance: 0,
        currency: 'USD',
        trend_percent: 0,
        trend_direction: 'neutral' as 'neutral'
    };

    // Simple observable-like implementation
    const subscribers = new Set<(val: any) => void>();

    return {
        ...actual,
        portfolioService: {
            updateSummary: (data: any) => {
                _value = data;
                subscribers.forEach(cb => cb(data));
            },
            summary$: {
                subscribe: (cb: (val: any) => void) => {
                    subscribers.add(cb);
                    cb(_value); // Emit current value immediately
                    return { unsubscribe: () => subscribers.delete(cb) };
                }
            },
            setConfig: vi.fn(),
            getSummary: () => _value
        }
    };
});

import { portfolioService } from '@modules/portfolio-ts';
import { portfolioSummaryState } from './PortfolioSummary.svelte';

describe('PortfolioSummary (Runes)', () => {
    // Helper to reset service state
    const resetState = () => {
        portfolioService.updateSummary({
            balance: 0,
            currency: 'USD',
            trend_percent: 0,
            trend_direction: 'neutral'
        });
    };

    beforeEach(() => {
        resetState();
    });

    it('should initialize with default/service values', () => {
        // Depending on timing, it might be the default or the simulated update
        // We assert based on the resetState() we forced
        expect(portfolioSummaryState.balance).toBe(0);
        expect(portfolioSummaryState.currency).toBe('USD');
    });

    it('should update state when service emits new summary', () => {
        portfolioService.updateSummary({
            balance: 5000.00,
            currency: 'EUR',
            trend_percent: 5.5,
            trend_direction: 'up'
        });

        expect(portfolioSummaryState.balance).toBe(5000.00);
        expect(portfolioSummaryState.currency).toBe('EUR');
        expect(portfolioSummaryState.trendPercent).toBe(5.5);
        expect(portfolioSummaryState.trendDirection).toBe('up');
    });

    it('should log error and NOT update state for invalid schema', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Initial valid state
        portfolioService.updateSummary({
            balance: 100,
            currency: 'USD',
            trend_percent: 0,
            trend_direction: 'neutral'
        });

        // Force invalid update (bypass TS for testing)
        // @ts-ignore
        portfolioService.updateSummary({
            balance: "invalid-number" as any, // Zod expects number
            currency: 'USD',
            trend_percent: 0,
            trend_direction: 'neutral'
        });

        expect(consoleSpy).toHaveBeenCalledWith("Invalid portfolio summary update:", expect.any(Error));

        // State should remain at the last valid value
        expect(portfolioSummaryState.balance).toBe(100);

        consoleSpy.mockRestore();
    });
});
