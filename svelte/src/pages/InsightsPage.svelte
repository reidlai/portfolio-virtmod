<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<div class="container mx-auto p-8" in:fade>
    <h1 class="text-4xl font-bold mb-4">Strategy Insights</h1>
    <div class="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
        <p class="text-lg text-muted-foreground">
            Detailed strategy analysis and performance metrics coming soon.
        </p>
        <div class="mt-8 flex gap-4">
            <a href="/" class="text-primary hover:underline"
                >← Back to Dashboard</a
            >
        </div>
    </div>
</div>
