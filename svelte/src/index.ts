import type { IModuleBundle } from '@core/types';
import PortfolioSummaryWidget from './widgets/PortfolioSummaryWidget.svelte';
import PortfolioPage from './pages/PortfolioPage.svelte';

const bundle: IModuleBundle = {
    id: 'portfolio-module',
    routes: [
        { path: '/portfolio', component: PortfolioPage }
    ],
    widgets: [
        {
            id: 'portfolio-summary',
            title: 'Portfolio Summary',
            component: PortfolioSummaryWidget,
            location: 'dashboard',
            size: 'large'
        }
    ]
};

export const init = async (context: any): Promise<IModuleBundle> => {
    return bundle;
};
