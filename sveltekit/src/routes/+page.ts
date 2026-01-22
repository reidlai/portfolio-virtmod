import type { PageLoad } from "./$types";
import { portfolioSummaryState } from "../lib/runes/PortfolioSummaryState.svelte";

export const load: PageLoad = async ({ data }) => {
  // Initialize the singleton state with proper SSR support
  // This runs on the server (during SSR) and the client (during hydration)
  portfolioSummaryState.init({ usingMockData: data?.usingMockData });

  return {
    ...(data ?? {}),
  };
};
