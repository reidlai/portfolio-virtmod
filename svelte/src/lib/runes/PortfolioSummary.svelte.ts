import { portfolioService, type PortfolioSummary, PortfolioSummarySchema } from '@modules/portfolio-ts';

/**
 * PortfolioSummaryStub
 * Reactive bridge between PortfolioService (RxJS) and Svelte 5 UI.
 */
class PortfolioSummaryStub {
    balance = $state(0);
    currency = $state('USD');
    trendPercent = $state(0);
    trendDirection: 'up' | 'down' | 'neutral' = $state('neutral');

    constructor() {
        // Hydrate initial state synchronously if possible, or wait for subscription
        const initial = portfolioService.getSummary();
        if (initial) {
            this.updateState(initial);
        }

        // Subscribe to live updates
        portfolioService.summary$.subscribe((value) => {
            try {
                // Validate incoming data
                PortfolioSummarySchema.parse(value);
                this.updateState(value);
            } catch (e) {
                console.error("Invalid portfolio summary update:", e);
            }
        });
    }

    private updateState(data: PortfolioSummary) {
        this.balance = data.balance;
        this.currency = data.currency;
        this.trendPercent = data.trend_percent;
        this.trendDirection = data.trend_direction;
    }
}

export const portfolioSummaryState = new PortfolioSummaryStub();
