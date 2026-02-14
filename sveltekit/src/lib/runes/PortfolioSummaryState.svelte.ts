import {
  type IPortfolioSummary,
  type IPortfolioSummaryState,
} from "../widgets/PortfolioSummaryWidget.types";
import { portfolioRxService } from "@modules/portfolio-ts";
import { schemas } from "@modules/portfolio-ts";

/**
 * PortfolioSummaryStub
 * Reactive bridge between PortfolioService (RxJS) and Svelte 5 UI.
 */
class PortfolioSummaryRune {
  /*
   * Use types to define local state
   */

  // summary local state has been replaced by RxJS observable
  // summary = $state<IPortfolioSummary | null>(null);
  summary = $state<IPortfolioSummary | null>(null);

  loading = $state<IPortfolioSummaryState["loading"]>(false);
  error = $state<IPortfolioSummaryState["error"]>(null);
  usingMockData = $state<IPortfolioSummaryState["usingMockData"]>(false);

  /**
   * Establishes subscriptions to server-side observables to ensure
   * reactive state synchronization with the service layer.
   */
  constructor() {
    // Constructor no longer automatically subscribes to prevent test hangs on import
  }

  private isInitialized = false;
  private subscriptions: any[] = [];

  public init(config: { usingMockData?: boolean; useSubscriptions?: boolean }) {
    if (config.usingMockData !== undefined) {
      portfolioRxService.usingMockData = config.usingMockData;
    }

    if (config.useSubscriptions && !this.isInitialized) {
      this.startSubscriptions();
      this.isInitialized = true;
    }
  }

  public dispose() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.isInitialized = false;
  }

  private startSubscriptions() {
    // Subscribe to live updates
    this.subscriptions.push(
      portfolioRxService.summary$.subscribe((value) => {
        if (!value) return;
        try {
          // Validate incoming data
          schemas.PortfolioSummary.parse(value);
          const { change_percent: changePercent, ...rest } = value;
          this.summary = { ...rest, changePercent };
        } catch (e) {
          console.error("Invalid portfolio summary update:", e);
          this.error = "Invalid data received";
        }
      }),
    );

    this.subscriptions.push(
      portfolioRxService.error$.subscribe((value) => {
        this.error = value;
      }),
    );

    this.subscriptions.push(
      portfolioRxService.usingMockData$.subscribe((value) => {
        this.usingMockData = value;
      }),
    );
  }

  /**
   * Fetch portfolio summary from API
   * This method exposes the RxJS service's getPortfolioSummary through the rune abstraction
   *
   * Usage:
   * - Call on component mount: onMount(() => portfolioSummaryState.getPortfolioSummary())
   * - Call on user action: <button onclick={() => portfolioSummaryState.getPortfolioSummary()}>Refresh</button>
   */
  public async getPortfolioSummary() {
    this.loading = true;

    await portfolioRxService.watchPortfolioSummary();

    this.loading = false;

    if (this.error) {
      throw new Error(this.error);
    }
  }
}

export const portfolioSummaryState = new PortfolioSummaryRune();
