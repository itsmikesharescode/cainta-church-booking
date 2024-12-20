<script lang="ts" module>
  export type PickerSelections = {
    id: string;
    value: string;
    label: string;
  };
</script>

<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';

  interface Props {
    selected: string;
    selections: PickerSelections[];
    hasLabel?: boolean;
    placeholder?: string;
  }

  let { selected = $bindable(), selections, hasLabel, placeholder }: Props = $props();
</script>

<!--@component
  Mike's select picker; it only returns a selections[0].value, and you have the option to show a label.

  Example usage:
  ```svelte
  <SelectPicker 
    bind:selected={selectedValue} 
    selections={[
      { id: '1', label: 'Svelte is fun', value: 'svelte' },
      { id: '2', label: 'React is meh', value: 'react' }
    ]}
    hasLabel={true}
    placeholder="Select an option"
    
  />
  ```
-->

<Select.Root
  type="single"
  onValueChange={(v) => {
    selected = v;
  }}
>
  <Select.Trigger>
    <span class={selected ? '' : 'text-muted-foreground'}>{selected || placeholder}</span>
  </Select.Trigger>
  <Select.Content>
    {#each selections as selection}
      <Select.Item id={selection.id} value={selection.value}>
        {#if hasLabel}
          <div class="flex flex-col">
            <span>{selection.value}</span>
            <span class="font-light text-muted-foreground">{selection.label}</span>
          </div>
        {:else}
          <span>{selection.value}</span>
        {/if}
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
