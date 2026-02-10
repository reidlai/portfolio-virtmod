import { BehaviorSubject } from "rxjs";
import { z } from "zod";
import { schemas, createApiClient, api } from "../lib/api-client";
import { mockGetPortfolioSummarySuccessfulResponse } from "./mocks/portfolioMocks";
import { logger } from "../utils/logger";

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
    currency: "USD",
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
  constructor(
    config: PortfolioRxServiceConfig = {
      apiBaseUrl: "http://localhost:8000",
      usingMockData: false,
    },
  ) {
    this.setConfig(config);
  }

  public static getInstance(): PortfolioRxService {
    if (!PortfolioRxService.instance) {
      PortfolioRxService.instance = new PortfolioRxService();
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
    this._error$.next(value);
  }

  public get usingMockData(): boolean | null {
    return this._using_mock_data$.getValue();
  }

  public set usingMockData(value: boolean) {
    this._using_mock_data$.next(value);
  }

  /**
   * Actual API call
   */

  public async getPortfolioSummary(): Promise<PortfolioSummaryType> {
    this._error$.next(null);

    if (this.usingMockData) {
      // Mock data is for local test without API integration

      this.summary = schemas.PortfolioSummary.parse(
        mockGetPortfolioSummarySuccessfulResponse,
      );
      return this.summary;
    } else {
      // When API server is ready

      try {
        const summary = await this.apiClient.get("/portfolio/summary", {
          headers: { "X-User-ID": "test-user" },
        });

        // Update summary if no schema check error
        this.summary = summary;
        return this.summary;
      } catch (e: unknown) {
        // Use 'unknown' because anything can be thrown in JS; this forces us to verify the type safely (e.g. instanceof Error) rather than assuming 'any'
        logger.error({ err: e }, "Failed to fetch portfolio summary");
        const errorMessage =
          e instanceof Error
            ? e.message
            : "Failed to fetch or parse portfolio summary";
        this.error = errorMessage;
        throw new Error(errorMessage);
      }
    }
  }

  public async watchPortfolioSummary(): Promise<PortfolioSummaryType> {
    this._error$.next(null);

    if (this.usingMockData) {
      this.summary = schemas.PortfolioSummary.parse(
        mockGetPortfolioSummarySuccessfulResponse,
      );
      return this.summary;
    }

    return new Promise((resolve, reject) => {
      // Construct WebSocket URL. Assumes apiBaseUrl is http/https and replaces with ws/wss
      // @ts-ignore - zodios internal baseURL access might differ, but assuming standard config passed in constructor
      const wsUrl = this.apiClient.baseURL.replace(/^http/, "ws") + "/portfolio/summary/watch";

      try {
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          // This callback is triggered once the WebSocket connection is successfully established with the server.
          // Flow:
          // 1. Client initiates connection to ws://.../portfolio/summary/watch
          // 2. Server accepts and upgrades the connection.
          // 3. 'open' event fires here.
          // 4. Client can now send messages (socket.send) or listen for incoming data.
          logger.info("Portfolio WebSocket connected");
        };

        socket.onmessage = (event) => {
          // This callback is triggered when the server sends a message to the client.
          // Flow:
          // 1. Server pushes new portfolio data (e.g., updated balance, change percentage).
          // 2. 'message' event fires here.
          // 3. event.data contains the raw message (usually JSON string).
          // 4. We parse it and update our state.
          try {
            const data = JSON.parse(event.data);
            const summary = schemas.PortfolioSummary.parse(data);
            this.summary = summary;

            // Resolve the promise once we have the first valid message, 
            // but the socket stays open for updates.
            // Note: In a real RxJS stream, we wouldn't return a Promise that resolves once, 
            // but this matches the existing method signature.
            // Subsequent updates just update the subject.
            resolve(this.summary);
          } catch (e: unknown) {
            logger.error({ err: e, data: event.data }, "Failed to parse websocket message");
          }
        };

        socket.onerror = (error) => {
          // This callback is triggered when an error occurs with the WebSocket connection.
          // Flow:
          // 1. Network issue, server down, or protocol error.
          // 2. 'error' event fires here.
          // 3. We log the error and update our state.
          // 4. 'onclose' will likely fire immediately after.
          logger.error({ err: error }, "Portfolio WebSocket error");
          const errorMessage = "Portfolio WebSocket connection failed";
          this.error = errorMessage;
          // Only reject if we haven't resolved yet (initial connection failed)
          // Ideally we should track connection state
          reject(new Error(errorMessage));
        };

        socket.onclose = () => {
          // This callback is triggered when the WebSocket connection is closed.
          // Flow:
          // 1. Server closes connection (e.g., after timeout, maintenance).
          // 2. Client closes connection (e.g., user navigates away).
          // 3. Network issue severs the connection.
          // 4. 'close' event fires here.
          // 5. We log the event. The connection is no longer usable.
          // 6. For a real-time app, we might want to implement auto-reconnection logic here.
          logger.info("Portfolio WebSocket closed");
        };

      } catch (e: unknown) {
        // This catch block handles errors that occur during the WebSocket initialization itself,
        // before the connection is even established (e.g., invalid URL, network issues preventing connection attempt).
        logger.error({ err: e }, "Failed to initiate WebSocket connection");
        const errorMessage = e instanceof Error ? e.message : "WebSocket init failed";
        this.error = errorMessage;
        reject(new Error(errorMessage));
      }
    });
  }
}

export const portfolioRxService = PortfolioRxService.getInstance();
