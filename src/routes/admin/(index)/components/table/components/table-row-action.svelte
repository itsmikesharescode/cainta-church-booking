<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import Ellipsis from 'lucide-svelte/icons/ellipsis';
  import FilePenLine from 'lucide-svelte/icons/file-pen-line';
  import FileX from 'lucide-svelte/icons/file-x';
  import type { Row } from '@tanstack/table-core';
  import { type DashboardPageTable } from '../data/schemas';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import Button from '$lib/components/ui/button/button.svelte';
  import { useTableState } from '../tableState.svelte';
  import { goto } from '$app/navigation';

  let { row }: { row: Row<DashboardPageTable> } = $props();

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
        goto('?modal=update-church');
      }}
    >
      <FilePenLine />
      Update
    </DropdownMenu.Item>
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        goto('?modal=delete-church');
      }}
    >
      <FileX />
      Delete
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
