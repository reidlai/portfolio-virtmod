import type { PageLoad } from "./$types";
import { PortfolioSummaryState } from "../lib/states/PortfolioSummaryState.svelte";

export const load: PageLoad = async ({ data }) => {
  // Initialize the singleton state with proper SSR support
  // This runs on the server (during SSR) and the client (during hydration)
  PortfolioSummaryState.getInstance({ usingMockData: data?.usingMockData });

  return {
    ...(data ?? {}),
  };
};
