<script lang="ts">
    import type { IPortfolioSummaryWidgetStory } from "./PortfolioSummaryWidget.types";
    import * as Card from "../components/ui/card/index";
    import { portfolioSummaryState } from "../runes/PortfolioSummaryState.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    /**
     * PROPS INTEGRATION: Bridging Nested API/RxJS Data with Flattened Storybook Controls
     */
    let {
        // Flattened props (used by Storybook for individual controls)
        currency: currencyProp,
        balance: balanceProp,
        changePercent: changePercentProp,

        // Nested props (used by production code and backward compatibility)
        summary: summaryProp,
        loading: loadingProp,
        error: errorProp,
        usingMockData: usingMockDataProp,
    }: IPortfolioSummaryWidgetStory & {
        currency?: string;
        balance?: number;
        changePercent?: number;
        usingMockData?: boolean;
    } = $props();

    onMount(() => {
        portfolioSummaryState.init({
            usingMockData: usingMockDataProp,
            useSubscriptions: true,
        });
    });

    /**
     * GLOBAL STATE: RxJS Observable Integration
     */
    let summary = $derived(portfolioSummaryState.summary);

    /**
     * DERIVED VALUES: The Bridge Between Nested and Flattened
     */
    let currency = $derived(
        currencyProp ?? summaryProp?.currency ?? summary?.currency ?? "USD",
    );
    let balance = $derived(
        balanceProp ?? summaryProp?.balance ?? summary?.balance ?? 0,
    );
    let changePercent = $derived(
        changePercentProp ??
            summaryProp?.changePercent ??
            summary?.changePercent ??
            0,
    );

    let loading = $derived(loadingProp ?? portfolioSummaryState.loading);
    let error = $derived(errorProp ?? portfolioSummaryState.error ?? "");

    let changeColor = $derived(getChangeColor(changePercent));
    let changeSign = $derived(getChangeSign(changePercent));

    function handleCardClick() {
        goto("/portfolio");
    }

    function getChangeColor(changePercent: number): string {
        if (changePercent > 0.0) {
            return "text-green-500";
        } else if (changePercent < 0.0) {
            return "text-red-500";
        }
        return "text-muted-foreground";
    }

    function getChangeSign(changePercent: number): string {
        if (changePercent > 0.0) {
            return "+";
        }
        return " ";
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    role="button"
    tabindex="0"
    class="@container w-full h-full p-4 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
    onclick={handleCardClick}
>
    <Card.Root class="w-full h-full">
        <Card.Header class="pb-2">
            <Card.Description>Total Balance</Card.Description>
            <!-- <Card.Title class="text-3xl font-bold tracking-tight">
                {currency}
                {balance.toFixed(2)}
            </Card.Title> -->
            {#if loading}
                <div class="flex items-center space-x-2">
                    <div
                        class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"
                    ></div>
                    <span class="text-sm text-muted-foreground">Loading...</span
                    >
                </div>
            {:else if error}
                <div class="text-sm text-red-500 text-destructive">{error}</div>
            {:else}
                <Card.Title class="text-3xl font-bold tracking-tight">
                    {currency}
                    {balance.toFixed(2)}
                </Card.Title>
            {/if}
        </Card.Header>
        <Card.Content>
            <!-- <div class="flex items-center space-x-2 text-sm">
                <span class="{changeColor} font-medium">
                    {changeSign}{changePercent}% from last month
                </span>
            </div> -->
            {#if !loading && !error}
                <p class="text-sm text-muted-foreground {changeColor}">
                    {changeSign}{changePercent.toFixed(2)}% from last month
                </p>
            {/if}
        </Card.Content>
    </Card.Root>
</div>
