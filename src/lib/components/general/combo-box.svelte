<script lang="ts" module>
  export type ComboSelections = {
    id: string;
    value: string;
    label: string;
  };
</script>

<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import Check from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import { tick } from 'svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';
  import type { ClassValue } from 'clsx';

  interface Props {
    selected: string;
    selections: ComboSelections[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptySeachMsg?: string;
    hasLabel?: boolean;
    contentStyle?: ClassValue;
  }

  let {
    selected = $bindable(),
    selections,
    placeholder = 'Search and select',
    searchPlaceholder = 'Search something...',
    emptySeachMsg = 'No item found',
    hasLabel,
    contentStyle
  }: Props = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(selections.find((f) => f.value === selected));

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<!--@component
  Mike's combo-box; it only returns a selections[0].value.

  Example usage:
  ```svelte
  <ComboBox 
    placeholder = 'Search and select'
    searchPlaceholder="Search something..."
    emptySeachMsg = 'No item found'
    hasLabel={true}
    contentStyle="w-[200px] p-0"
    bind:selected={selectedValue} 
    selections={[
      { id: '1', label: 'Svelte is fun', value: 'svelte' },
      { id: '2', label: 'React is meh', value: 'react' }
    ]}
  />
  ```
-->

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full justify-between"
        {...props}
        role="combobox"
        aria-expanded={open}
      >
        <span class={selectedValue ? '' : 'text-muted-foreground'}
          >{selectedValue?.label || placeholder}</span
        >
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class={cn('w-[200px] p-0', contentStyle)}>
    <Command.Root>
      <Command.Input placeholder={searchPlaceholder} />
      <Command.List>
        <Command.Empty>{emptySeachMsg}</Command.Empty>
        <Command.Group>
          {#each selections as selection}
            <Command.Item
              id={selection.id}
              value={selection.label}
              onSelect={() => {
                if (selected === selection.value) {
                  selected = '';
                } else {
                  selected = selection.value;
                }

                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn('mr-2 size-4', selected !== selection.value && 'text-transparent')}
              />
              {#if hasLabel}
                <div class="flex flex-col">
                  <span>{selection.label}</span>
                  <span class="font-light text-muted-foreground">{selection.value}</span>
                </div>
              {:else}
                <span>{selection.label}</span>
              {/if}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </DropdownMenu.Content>
</DropdownMenu.Root>
