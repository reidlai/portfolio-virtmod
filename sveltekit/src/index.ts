// /// <reference types="vite/client" />
// import type { ModuleInit } from "virtual-module-core/types";
// import { SvelteKitAdapter } from "virtual-module-core";
// import PortfolioSummaryWidget from "./lib/widgets/PortfolioSummaryWidget.svelte";

// // Create adapter instance
// const adapter = new SvelteKitAdapter();

// export const init: ModuleInit = async (_context) => {
//   // 1. Discover SvelteKit routes
//   const modules = import.meta.glob("./routes/**/+page.svelte", { eager: true });

//   // 2. Parse using adapter to get routes
//   const bundle = await adapter.parse(modules);

//   // 3. Decorate bundle with module-specific metadata and widgets
//   bundle.id = "portfolio-module";
//   bundle.widgets = [
//     {
//       id: "portfolio-summary",
//       title: "Portfolio Summary",
//       component: PortfolioSummaryWidget,
//       location: "dashboard",
//       size: "large",
//     },
//   ];

//   return bundle;
// };

// export { PortfolioSummaryWidget };

import type { IModuleBundle } from "virtual-module-core/types";
import PortfolioSummaryWidget from "./lib/widgets/PortfolioSummaryWidget.svelte";
import PortfolioPage from "./routes/+page.svelte";
/**
 * Portfolio Virtual Module Bundle
 *
 * This module provides widgets for viewing watchlist summary and browsing exchanges.
 * All widgets integrate with RxJS services backed by Go APIs.
 *
 * Routes are now handled by SvelteKit 2 routing in src/routes/
 */
const bundle: IModuleBundle = {
  id: "portfolio-module",
  widgets: [
    {
      id: "portfolio-summary",
      title: "Portfolio Summary",
      component: PortfolioSummaryWidget,
      location: "dashboard",
      size: "small",
    },
  ],
  routes: [
    {
      path: "/portfolio",
      type: "page",
      component: PortfolioPage,
    },
  ],

};

export const init = async (_context: any): Promise<IModuleBundle> => {
  return bundle;
};
