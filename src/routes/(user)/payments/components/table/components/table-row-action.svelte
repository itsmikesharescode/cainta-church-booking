<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import Ellipsis from 'lucide-svelte/icons/ellipsis';
  import Delete from 'lucide-svelte/icons/delete';
  import SearchCheck from 'lucide-svelte/icons/search-check';
  import type { Row } from '@tanstack/table-core';
  import { type PaymentPageTable } from '../data/schemas';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import Button from '$lib/components/ui/button/button.svelte';
  import { useTableState } from '../tableState.svelte';
  import { goto } from '$app/navigation';

  let { row }: { row: Row<PaymentPageTable> } = $props();

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
    {#if row.original.reservation_id}
      <DropdownMenu.Item
        onclick={() => {
          tableState.setActiveRow(row.original);
          goto(`?modal=view-reservation`);
        }}
      >
        <SearchCheck />
        Reservation Record
      </DropdownMenu.Item>
    {:else if row.original.cert_request_id}
      <DropdownMenu.Item
        onclick={() => {
          tableState.setActiveRow(row.original);
          goto(`?modal=view-certificate`);
        }}
      >
        <SearchCheck />
        Certificate Record
      </DropdownMenu.Item>
    {/if}
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        goto(`?modal=view-church`);
      }}
    >
      <SearchCheck />
      Church Record
    </DropdownMenu.Item>
    <!-- <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        goto(`?modal=delete-payment`);
      }}
    >
      <Delete />
      Delete
    </DropdownMenu.Item> -->
  </DropdownMenu.Content>
</DropdownMenu.Root>
