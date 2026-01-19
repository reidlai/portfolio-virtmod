/**
 * Flattened props interface for Storybook controls
 * This allows individual controls for each summary attribute
 */
export interface IPortfolioSummaryWidgetStory {
    currency?: string;
    balance?: number;
    changePercent?: number;
    loading?: boolean;
    error?: string | null;
    summary?: IPortfolioSummary | null;
    usingMockData?: boolean;
}

/**
 * Define additional interfaces to match rune structure
 */

export interface IPortfolioSummary {
    currency: string;
    balance: number;
    changePercent: number;
}

export interface IPortfolioSummaryState {
    summary?: IPortfolioSummary | null;
    loading?: boolean;
    error?: string | null;
    usingMockData?: boolean;
}

