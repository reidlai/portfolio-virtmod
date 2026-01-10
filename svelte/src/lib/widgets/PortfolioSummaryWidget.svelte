<script lang="ts">
    import { portfolioSummaryState } from "../runes/PortfolioSummary.svelte";
    import { portfolioService } from "@modules/portfolio-ts";
    import * as Card from "../components/ui/card";
    import { goto } from "$app/navigation";

    // FR-006: Props for DI - Allow partial overrides, default to store state
    // In Svelte 5, we can use derived state or just use the store directly for this demo.
    // For simplicity and tight integration, we use the store directly.

    function formatCurrency(amount: number, currency: string) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount);
    }

    function formatPercent(percent: number) {
        return `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`;
    }

    function handleClick() {
        // Simple navigation for now, can add prop callback later if needed
        goto("/portfolio");
    }

    $effect(() => {
        portfolioService.fetchSummary();
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="@container w-full h-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
    onclick={handleClick}
>
    <Card.Root class="h-full">
        <Card.Header class="pb-2">
            <Card.Description>Total Balance</Card.Description>
            <Card.Title class="text-3xl font-bold tracking-tight">
                {formatCurrency(
                    portfolioSummaryState.balance,
                    portfolioSummaryState.currency,
                )}
            </Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="flex items-center space-x-2 text-sm">
                <span
                    class="{portfolioSummaryState.trendDirection === 'up'
                        ? 'text-green-500'
                        : portfolioSummaryState.trendDirection === 'down'
                          ? 'text-red-500'
                          : 'text-muted-foreground'} font-medium"
                >
                    {formatPercent(portfolioSummaryState.trendPercent)}
                </span>
                <span class="text-muted-foreground">from last month</span>
            </div>
        </Card.Content>
    </Card.Root>
</div>
