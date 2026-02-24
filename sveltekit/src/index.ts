import type { ModuleInit } from "virtual-module-core/types";
import { SvelteKitAdapter } from "virtual-module-core";
import PortfolioSummaryWidget from "./lib/widgets/PortfolioSummaryWidget.svelte";
import { createApiClient } from "./lib/api-client/index";
import { PortfolioSummaryState } from "./lib/states/PortfolioSummaryState.svelte";

/**
 * Portfolio Virtual Module
 */
export class PortfolioModule {
  private adapter: SvelteKitAdapter;

  constructor() {
    this.adapter = new SvelteKitAdapter();
  }

  /**
   * Initialize the portfolio module.
   * Discovers routes dynamically and returns the module bundle.
   */
  async init(context: any): Promise<any> {

    // @ts-ignore
    const sharedAxios = typeof context.getService === 'function'
      ? context.getService("apiClient")
      : (context as any).resolve ? (context as any).resolve("apiClient") : undefined;

    if (sharedAxios) {
      // @ts-ignore
      const baseURL = sharedAxios.defaults?.baseURL || "/";
      const portfolioApi = createApiClient(baseURL, { axiosInstance: sharedAxios });
      PortfolioSummaryState.getInstance().apiClient = portfolioApi;
    }

    // 2. Discover SvelteKit routes dynamically
    const routes = import.meta.glob("./routes/**/+*.{svelte,ts}", {
      eager: true,
    });

    // 3. Parse using adapter to get routes mapping
    const bundle = await this.adapter.parse(routes);

    // 3. Decorate bundle with module-specific metadata and widgets
    bundle.id = "portfolio-module";
    bundle.widgets = [
      {
        id: "portfolio-summary",
        title: "Portfolio Summary",
        component: PortfolioSummaryWidget,
        location: "dashboard",
        size: "small",
      },
    ];

    return bundle;
  }
}

// Instantiate the module
const portfolioModule = new PortfolioModule();

/**
 * Default export as the module instance.
 * ModuleLoader can access .init on this instance.
 */
export default portfolioModule;

/**
 * Named export for explicit initialization if needed.
 */
export const init: ModuleInit = async (context: any) => {
  return portfolioModule.init(context);
};

export { PortfolioSummaryWidget };
