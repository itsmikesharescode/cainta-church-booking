<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import Ellipsis from 'lucide-svelte/icons/ellipsis';
  import X from 'lucide-svelte/icons/x';
  import ScanSearch from 'lucide-svelte/icons/scan-search';
  import type { Row } from '@tanstack/table-core';
  import { type AdminCertRequestsPageTable } from '../data/schemas';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import Button from '$lib/components/ui/button/button.svelte';
  import { useTableState } from '../tableState.svelte';
  import { goto } from '$app/navigation';

  let { row }: { row: Row<AdminCertRequestsPageTable> } = $props();

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
        goto('?modal=view-user');
      }}
    >
      <ScanSearch />
      View User
    </DropdownMenu.Item>
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        goto('?modal=delete-certificate');
      }}
    >
      <X />
      Delete
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
