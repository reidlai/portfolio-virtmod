<script lang="ts">
    import type { IPortfolioSummaryWidgetStory } from "./PortfolioSummaryWidget.types";
    import * as Card from "$lib/components/ui/card";
    import { portfolioSummaryState } from "../runes/PortfolioSummaryState.svelte";
    import { goto } from "$app/navigation";

    /**
     * PROPS INTEGRATION: Bridging Nested API/RxJS Data with Flattened Storybook Controls
     *
     * This component accepts BOTH formats simultaneously:
     * 1. FLATTENED props (currency, balance, changePercent) - for Storybook controls
     * 2. NESTED props (summary object) - for backward compatibility and RxJS integration
     *
     * Type Intersection: IPortfolioSummaryState & { currency?, balance?, changePercent? }
     * - IPortfolioSummaryState provides: summary?, loading?, error?
     * - Inline type provides: currency?, balance?, changePercent?
     *
     * Destructuring with Renaming: { currency: currencyProp }
     * - Left side (currency): property name in incoming props
     * - Right side (currencyProp): variable name used in this component
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
        /**
         * TYPE INTERSECTION EXPLAINED: Why use & { ... } here?
         *
         * The & operator creates an INTERSECTION TYPE that combines two types:
         *
         * IPortfolioSummaryState & { currency?: string; balance?: number; changePercent?: number }
         *
         * This means the props object has ALL properties from BOTH types:
         *
         * From IPortfolioSummaryState:          From inline type:
         * - summary?: IPortfolioSummary         - currency?: string
         * - loading?: boolean                   - balance?: number
         * - error?: string | null               - changePercent?: number
         *
         * Why not just modify IPortfolioSummaryState?
         * - IPortfolioSummaryState represents the PRODUCTION data structure (nested summary object)
         * - The flattened props (currency, balance, changePercent) are ONLY for Storybook convenience
         * - We don't want to pollute the production interface with Storybook-specific props
         * - Using & keeps the concerns separated while allowing both formats
         *
         * Alternative would be IPortfolioSummaryWidgetProps, but that would REPLACE the nested format
         * With &, we COMBINE both formats, allowing maximum flexibility
         */
    }: IPortfolioSummaryWidgetStory & {
        currency?: string;
        balance?: number;
        changePercent?: number;
        usingMockData?: boolean;
    } = $props();

    /**
     * GLOBAL STATE: RxJS Observable Integration
     *
     * This reads from portfolioSummaryState.summary, which is populated by:
     * 1. API call returns nested object: { currency, balance, changePercent }
     * 2. Zod schema validates: schemas.PortfolioSummaryZSchema.parse(value)
     * 3. RxJS BehaviorSubject emits: portfolioRxService.summary$
     * 4. Svelte rune subscribes and stores: portfolioSummaryState.summary
     *
     * This 'summary' is a LOCAL VARIABLE (not a prop), containing the nested object from RxJS
     */
    let summary = $derived(portfolioSummaryState.summary);

    /**
     * DERIVED VALUES: The Bridge Between Nested and Flattened
     *
     * These extract individual properties with a fallback chain:
     * Priority 1: Flattened prop (currencyProp) - from Storybook controls
     * Priority 2: Nested prop (summaryProp?.currency) - from manual component usage
     * Priority 3: Global RxJS state (summary?.currency) - from API/production
     * Priority 4: Default value ("USD", 0, etc.)
     *
     * This is the KEY that makes everything work together:
     * - In Storybook: Uses currencyProp (flat)
     * - In Production: Extracts from summary (nested from RxJS)
     * - Manual Override: Uses summaryProp (nested)
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

    $effect(() => {
        // Synchronize prop value to the global rune/service state
        // This ensures that if the prop changes (e.g. from Storybook), the service is updated
        if (usingMockDataProp !== undefined) {
            portfolioSummaryState.init({ usingMockData: usingMockDataProp });
        }
    });

    // Reactivity Source: When you write let { changePercent } = $props(), Svelte's compiler interprets changePercent as a reactive value (conceptually, it's like a
    // signal getter).
    // Dependency Tracking: The $derived(...) rune automatically "watches" any reactive values used inside it. Since getChangeColor(changePercent) reads
    // changePercent, a dependency is established.
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
    class="@container w-full h-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
    onclick={handleCardClick}
>
    <!-- Fix applied: Single line props with prettier-ignore -->
    <Card.Root class="h-full">
        <Card.Header class="pb-2">
            <Card.Description>Total Balance</Card.Description>
            <div class="text-2xl font-bold">
                {currency}
                {balance.toFixed(2)}
            </div>
            <!-- <p class="text-xs text-muted-foreground">
                {trendDirection === "up" ? "+" : ""}{trendPercent}% from last month
            </p> -->
        </Card.Header>
        <Card.Content>
            {#if loading}
                <div
                    class="flex items-center space-x-2 text-sm text-muted-foreground"
                >
                    <span>Loading...</span>
                </div>
            {:else if error}
                <div class="flex items-center space-x-2 text-sm text-red-500">
                    <span>Error: {error}</span>
                </div>
            {:else}
                <div class="flex items-center space-x-2 text-sm">
                    <span class="{changeColor} font-medium">
                        {changeSign}{changePercent}% from last month
                    </span>
                </div>
            {/if}
        </Card.Content>
    </Card.Root>
</div>
