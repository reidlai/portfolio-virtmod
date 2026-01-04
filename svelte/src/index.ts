import type { IModuleBundle } from "virtual-module-core/types";
import PortfolioSummaryWidget from "./lib/widgets/PortfolioSummaryWidget.svelte";
export { PortfolioSummaryWidget };
import PortfolioPage from "./lib/pages/PortfolioPage.svelte";

const bundle: IModuleBundle = {
  id: "portfolio-module",
  routes: [{ path: "/portfolio", component: PortfolioPage }],
  widgets: [
    {
      id: "portfolio-summary",
      title: "Portfolio Summary",
      component: PortfolioSummaryWidget,
      location: "dashboard",
      size: "large",
    },
  ],
};

export const init = async (_context: any): Promise<IModuleBundle> => {
  return bundle;
};
