import type { Meta, StoryObj } from "@storybook/svelte";
import PortfolioSummaryWidget from "./PortfolioSummaryWidget.svelte";
// import { portfolioRxService } from "@modules/portfolio-ts";

const meta: Meta<typeof PortfolioSummaryWidget> = {
  title: "Widgets/PortfolioSummaryWidget",
  component: PortfolioSummaryWidget,
  tags: ["autodocs"],
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
      },
    },
    usingMockData: {
      control: "boolean",
      description: "Use mock data from service",
    },
  },
  // decorators: [
  //   (story, { args }) => {
  //     if (args.usingMockData !== undefined) {
  //       portfolioRxService.usingMockData = args.usingMockData;
  //     }
  //     return story();
  //   },
  // ],
};

export default meta;
type Story = StoryObj<typeof PortfolioSummaryWidget>;

export const Default: Story = {
  args: {
    currency: "USD",
    balance: 12345.67,
    changePercent: 5.2,
    loading: false,
    error: "",
    usingMockData: true,
  },
};

export const NegativeBalance: Story = {
  args: {
    currency: "HKD",
    balance: 12345.67,
    changePercent: -1.3,
    loading: false,
    error: "",
    usingMockData: true,
  },
};
