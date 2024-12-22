<script lang="ts">
  import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
  import type { Checkbox as CheckboxPrimitive, WithoutChildrenOrChild } from 'bits-ui';

  let { checked, ...restProps }: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<Checkbox {checked} controlledChecked {...restProps} />
