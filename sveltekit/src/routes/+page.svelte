<script lang="ts">
  // Simple test harness to preview widgets
  import PortfolioSummaryWidget from "../lib/widgets/PortfolioSummaryWidget.svelte";
</script>

<div class="p-8 space-y-8">
  <h1 class="text-2xl font-bold">Portfolio Module Dev Preview</h1>

  <section>
    <h2 class="text-xl mb-4">Portfolio Summary</h2>
    <div class="max-w-md">
      <PortfolioSummaryWidget />
    </div>
  </section>
</div>
