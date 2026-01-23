<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../../utils";

  let {
    class: className,
    children,
    ...rest
  }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h3
  class={cn("text-2xl font-semibold leading-none tracking-tight", className)}
  {...rest}
>
  {@render children?.()}
</h3>
