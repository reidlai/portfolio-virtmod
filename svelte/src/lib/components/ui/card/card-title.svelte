<script lang="ts">
  let className: string | undefined = undefined;
  export { className as class };
</script>

<h3 class={className}>
  <slot />
</h3>
