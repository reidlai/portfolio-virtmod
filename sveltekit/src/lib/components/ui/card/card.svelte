<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../../utils"; // Assuming I create this or use proper cn

  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  class={cn("bg-card text-card-foreground rounded-xl border shadow", className)}
  {...rest}
>
  {@render children?.()}
</div>
