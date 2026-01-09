import type { Meta, StoryObj } from '@storybook/svelte';
import PortfolioSummaryWidget from './PortfolioSummaryWidget.svelte';

const meta = {
    title: 'Widgets/PortfolioSummaryWidget',
    component: PortfolioSummaryWidget,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<PortfolioSummaryWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
