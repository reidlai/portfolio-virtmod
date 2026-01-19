import { describe, it, expect, vi, beforeEach } from "vitest";
import { portfolioSummaryState } from "./PortfolioSummaryState.svelte";
import { portfolioRxService } from "@modules/portfolio-ts";

// Mock the service
vi.mock("@modules/portfolio-ts", async () => {
    const { BehaviorSubject, of } = await import("rxjs");
    const mockSummary$ = new BehaviorSubject(null);
    const mockError$ = new BehaviorSubject(null);

    return {
        portfolioRxService: {
            summary$: mockSummary$,
            error$: mockError$,
            usingMockData$: new BehaviorSubject(false),
            getPortfolioSummary: vi.fn().mockReturnValue(of(undefined)),
            set usingMockData(value: boolean) { this.usingMockData$.next(value); },
        },
        schemas: {
            PortfolioSummary: {
                parse: vi.fn(),
            }
        }
    };
});
// Mock SvelteKit environment
// vi.mock("$env/static/public") handled by vitest alias

describe("PortfolioSummaryState Rune", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset subjects if needed, though mostly we test state reflection
    });

    it("should initialize with default state", () => {
        // initial state depends on the behavior subject's initial value (null)
        expect(portfolioSummaryState.summary).toBe(null);
        expect(portfolioSummaryState.loading).toBe(false);
        expect(portfolioSummaryState.error).toBe(null);
    });

    it("should update usingMockData when init is called", () => {
        portfolioSummaryState.init({ usingMockData: true });
        expect(portfolioSummaryState.usingMockData).toBe(true);
    });

    it("should fetch summary when getPortfolioSummary is called", async () => {
        await portfolioSummaryState.getPortfolioSummary();
        expect(portfolioRxService.getPortfolioSummary).toHaveBeenCalled();
    });

    // Note: Testing full reactivity in Node environment without Svelte context might be limited.
    // For unit logic, we verify the integration points.
});
