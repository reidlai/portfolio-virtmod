<script lang="ts">
    import * as Card from "@ui/card";
    import { goto } from "$app/navigation";

    // FR-006: Props for DI
    interface Valuation {
        balance: number;
        currency: string;
        trendPercent: number;
        trendDirection: "up" | "down" | "flat";
    }

    export let valuation: Valuation = {
        balance: 1250.0,
        currency: "USD",
        trendPercent: 12.5,
        trendDirection: "up",
    };

    export let onNavigate: (() => void) | undefined = undefined;

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
        if (onNavigate) {
            onNavigate();
        } else {
            goto("/portfolio");
        }
    }
</script>

<!-- FR-006: Container queries handled via parent or intrinsic sizing.
     Using a button-like div for interactivity (FR-004) -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="@container w-full h-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
    on:click={handleClick}
>
    <!-- FR-001, T016: ShadCN Card Component -->
    <Card.Root
        class="h-full flex flex-col justify-between border-l-4 border-l-primary"
    >
        <Card.Header class="pb-2">
            <Card.Description>Total Valuation</Card.Description>
            <Card.Title class="text-3xl font-bold tracking-tight">
                {formatCurrency(valuation.balance, valuation.currency)}
            </Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="flex items-center space-x-2">
                <span
                    class="{valuation.trendDirection === 'up'
                        ? 'text-green-500'
                        : 'text-red-500'} font-semibold text-sm"
                >
                    {formatPercent(valuation.trendPercent)}
                </span>
                <span class="text-sm text-muted-foreground">
                    from last month
                </span>
            </div>
        </Card.Content>
    </Card.Root>
</div>
