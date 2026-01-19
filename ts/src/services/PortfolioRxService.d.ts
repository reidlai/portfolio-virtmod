import { z } from 'zod';
import { schemas, api } from '../lib/api-client';
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
export declare class PortfolioRxService {
    private static instance;
    /**
     * Initialize RxJS BehaviorSubject based on zod schema
     */
    private _summary$;
    private _error$;
    private _using_mock_data$;
    /**
     * Initialize RxJS Observable based on zod schema
     */
    /**
     * Initialize RxJS Observable with translation map
     */
    summary$: import("rxjs").Observable<z.objectOutputType<{
        balance: z.ZodNumber;
        change_percent: z.ZodNumber;
        currency: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
    error$: import("rxjs").Observable<string | null>;
    usingMockData$: import("rxjs").Observable<boolean>;
    /**
     * Local variables declaration
     */
    private apiClient;
    /**
     * Contructor
     * @param config: PortfolioRxServiceConfig
     */
    constructor(config?: PortfolioRxServiceConfig);
    static getInstance(): PortfolioRxService;
    setConfig(config: PortfolioRxServiceConfig): void;
    /**
     * Getter and Setter
     */
    get summary(): PortfolioSummaryType;
    set summary(value: PortfolioSummaryType);
    get error(): string | null;
    set error(value: string);
    get usingMockData(): boolean | null;
    set usingMockData(value: boolean);
    /**
     * Actual API call
     */
    getPortfolioSummary(): Promise<PortfolioSummaryType>;
}
export declare const portfolioRxService: PortfolioRxService;
export {};
