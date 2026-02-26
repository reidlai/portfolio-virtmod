import {
  type IPortfolioSummary,
  type IPortfolioSummaryState,
} from "../widgets/PortfolioSummaryWidget.types";
import { mockGetPortfolioSummarySuccessfulResponse } from "./mocks/portfolioMocks";
import { schemas, createApiClient } from "../api-client/index";
import { logger } from "../utils/logger";

type ApiClient = ReturnType<typeof createApiClient>;

/**
 * PortfolioSummaryState
 * Svelte 5 state management for the portfolio summary.
 */
export class PortfolioSummaryState {
  private static instance: PortfolioSummaryState;

  summary = $state<IPortfolioSummary | null>(null);
  loading = $state<IPortfolioSummaryState["loading"]>(false);
  error = $state<IPortfolioSummaryState["error"]>(null);
  usingMockData = $state<IPortfolioSummaryState["usingMockData"]>(false);

  public apiClient!: ApiClient;

  private constructor(config?: { usingMockData?: boolean; apiClient?: ApiClient }) {
    if (config?.usingMockData !== undefined) {
      this.usingMockData = config.usingMockData;
    }
    if (config?.apiClient) {
      this.apiClient = config.apiClient;
    }
  }

  /**
   * Returns the Singleton instance of the state, optionally initializing it with config.
   */
  public static getInstance(config?: {
    usingMockData?: boolean;
    apiClient?: ApiClient;
  }): PortfolioSummaryState {
    if (!PortfolioSummaryState.instance) {
      PortfolioSummaryState.instance = new PortfolioSummaryState(config);
    } else if (config) {
      if (config.usingMockData !== undefined) {
        PortfolioSummaryState.instance.usingMockData = config.usingMockData;
      }
      if (config.apiClient) {
        PortfolioSummaryState.instance.apiClient = config.apiClient;
      }
    }
    return PortfolioSummaryState.instance;
  }

  /** FOR TESTING ONLY: Resets the singleton state */
  public reset() {
    this.summary = null;
    this.loading = false;
    this.error = null;
    this.usingMockData = false;
  }

  /**
   * Fetch portfolio summary from API.
   * This previously used ResClient for watching but now uses standard REST.
   */
  public async watchPortfolioSummary() {
    return this.getPortfolioSummary();
  }

  /**
   * Fetch portfolio summary from API via REST
   */
  public async getPortfolioSummary() {
    this.loading = true;
    this.error = null;

    try {
      if (this.usingMockData) {
        this.summary = schemas.PortfolioSummary.parse(
          mockGetPortfolioSummarySuccessfulResponse,
        );
      } else {
        const summary = await this.apiClient.get("/portfolio/summary", {
          headers: { "X-User-ID": "test-user" },
        });
        this.summary = summary;
      }
      logger.info({ "summary": this.summary })
    } catch (e: unknown) {
      logger.error({ e }, "Failed to fetch portfolio summary");
      const errorMessage =
        e instanceof Error
          ? e.message
          : "Failed to fetch or parse portfolio summary";
      this.error = errorMessage;
      throw new Error(errorMessage);
    } finally {
      this.loading = false;
    }

    if (this.error) {
      throw new Error(this.error);
    }
  }
}
