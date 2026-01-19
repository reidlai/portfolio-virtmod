import { BehaviorSubject } from 'rxjs';
import { z } from 'zod';
import { schemas, createApiClient, api } from '../lib/api-client';
import { mockGetPortfolioSummarySuccessfulResponse } from './mocks/portfolioMocks';
import { logger } from '../utils/logger';

export type PortfolioSummaryType = z.infer<typeof schemas.PortfolioSummary>;
type ApiClient = typeof api;

/**
 * Confugration Type
 */
export interface PortfolioRxServiceConfig {
    apiBaseUrl: string;
    apiClient?: ApiClient;
    usingMockData?: boolean;
}

/**
 * RxJS service class
 */
export class PortfolioRxService {
    private static instance: PortfolioRxService;

    /**
     * Initialize RxJS BehaviorSubject based on zod schema
     */
    private _summary$ = new BehaviorSubject<PortfolioSummaryType>({
        balance: 0,
        currency: 'USD',
        change_percent: 0,
    });
    private _error$ = new BehaviorSubject<string | null>(null);
    private _using_mock_data$ = new BehaviorSubject<boolean>(false);

    /**
     * Initialize RxJS Observable based on zod schema
     */
    /**
     * Initialize RxJS Observable with translation map
     */
    public summary$ = this._summary$.asObservable();
    public error$ = this._error$.asObservable();
    public usingMockData$ = this._using_mock_data$.asObservable();

    /**
     * Local variables declaration
     */

    // Declare API client
    private apiClient!: ApiClient;

    /**
     * Contructor
     * @param config: PortfolioRxServiceConfig
     */
    constructor(config: PortfolioRxServiceConfig = { apiBaseUrl: "http://localhost:8000", usingMockData: false }) {
        this.setConfig(config);
    }

    public static getInstance(): PortfolioRxService {
        if (!PortfolioRxService.instance) {
            PortfolioRxService.instance = new PortfolioRxService()
        }
        return PortfolioRxService.instance;
    }

    public setConfig(config: PortfolioRxServiceConfig) {
        if (config.apiClient) {
            this.apiClient = config.apiClient;
        } else {
            this.apiClient = createApiClient(config.apiBaseUrl);
        }

        this.usingMockData = !!config.usingMockData;
    }

    /**
     * Getter and Setter 
     */

    // Synchronous summary getter to access summary value
    public get summary(): PortfolioSummaryType {
        return this._summary$.getValue();
    }

    // Summery setter to change summary submit value
    public set summary(value: PortfolioSummaryType) {
        this._summary$.next(value);
    }

    public get error(): string | null {
        return this._error$.getValue();
    }

    public set error(value: string) {
        this._error$.next(value)
    }

    public get usingMockData(): boolean | null {
        return this._using_mock_data$.getValue();
    }

    public set usingMockData(value: boolean) {
        this._using_mock_data$.next(value)
    }

    /**  
     * Actual API call
     */

    public async getPortfolioSummary(): Promise<PortfolioSummaryType> {
        this._error$.next(null);

        if (this.usingMockData) { // Mock data is for local test without API integration

            this.summary = schemas.PortfolioSummary.parse(mockGetPortfolioSummarySuccessfulResponse);
            return this.summary;

        } else { // When API server is ready

            try {
                const summary = await this.apiClient.get("/portfolio/summary", { headers: { "X-User-ID": "test-user" } });

                // Update summary if no schema check error
                this.summary = summary;
                return this.summary;

            } catch (e: unknown) { // Use 'unknown' because anything can be thrown in JS; this forces us to verify the type safely (e.g. instanceof Error) rather than assuming 'any'
                logger.error({ err: e }, 'Failed to fetch portfolio summary');
                const errorMessage = e instanceof Error ? e.message : "Failed to fetch or parse portfolio summary";
                this.error = errorMessage;
                throw new Error(errorMessage);
            }

        }
    }

}

export const portfolioRxService = PortfolioRxService.getInstance();
