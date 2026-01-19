<script lang="ts">
  let className: string | undefined = undefined;
  export { className as class };
</script>

<p class={className}>
  <slot />
</p>
