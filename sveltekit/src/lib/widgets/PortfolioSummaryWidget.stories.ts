import type { Meta, StoryObj } from '@storybook/svelte';
import PortfolioSummaryWidget from '$lib/widgets/PortfolioSummaryWidget.svelte';
import type { IPortfolioSummaryWidgetStory } from '$lib/widgets/PortfolioSummaryWidget.types';
import { portfolioRxService } from '@modules/portfolio-ts';

const meta = {
    title: 'Widgets/PortfolioSummaryWidget',
    component: PortfolioSummaryWidget,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        currency: {
            control: "text",
            description: "Currency code (e.g., USD, EUR, HKD)",
        },
        balance: {
            control: "number",
            description: "Portfolio balance amount",
        },
        changePercent: {
            control: "number",
            description: "Percentage change from last period",
        },
        loading: {
            control: "boolean",
            description: "Loading state",
        },
        error: {
            control: "text",
            description: "Error message (if any)",
        },
        summary: {
            table: {
                disable: true,
            }
        },
        usingMockData: {
            control: "boolean",
            description: "Use mock data from service",
        }
    },
    decorators: [
        (story, { args }) => {
            if (args.usingMockData !== undefined) {
                portfolioRxService.usingMockData = args.usingMockData;
            }
            return story();
        }
    ]
} satisfies Meta<IPortfolioSummaryWidgetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        currency: 'USD',
        balance: 12345.67,
        changePercent: 5.2,
        loading: false,
        error: "",
        usingMockData: true,
    }
};

export const NegativeBalance: Story = {
    args: {
        currency: 'HKD',
        balance: 12345.67,
        changePercent: -1.3,
        loading: false,
        error: "",
        usingMockData: true,        
    }
};

