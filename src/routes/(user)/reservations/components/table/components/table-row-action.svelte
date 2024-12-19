<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import Ellipsis from 'lucide-svelte/icons/ellipsis';
  import FileMinus from 'lucide-svelte/icons/file-minus';
  import Delete from 'lucide-svelte/icons/delete';
  import NotebookPen from 'lucide-svelte/icons/notebook-pen';
  import Pen from 'lucide-svelte/icons/pen';
  import Check from 'lucide-svelte/icons/check';
  import type { Row } from '@tanstack/table-core';
  import { type ReservationsPageTable } from '../data/schemas';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import Button from '$lib/components/ui/button/button.svelte';
  import { useTableState } from '../tableState.svelte';

  let { row }: { row: Row<ReservationsPageTable> } = $props();

  const tableState = useTableState();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
        <Ellipsis />
        <span class="sr-only">Open Menu</span>
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-fit" align="end">
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        tableState.setShowUpdateStatus(true);
      }}
    >
      <NotebookPen />
      Update Status
    </DropdownMenu.Item>
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        tableState.setShowUpdate(true);
      }}
    >
      <NotebookPen />
      Modify
    </DropdownMenu.Item>
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        tableState.setShowDelete(true);
      }}
    >
      <Delete />
      Remove
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
