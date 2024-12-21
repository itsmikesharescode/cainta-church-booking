<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import X from 'lucide-svelte/icons/x';
  import type { Table } from '@tanstack/table-core';
  import { TableViewOptions } from './index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Input } from '$lib/components/ui/input/index';
  import type { DashboardPageTable } from '../data/schemas.js';

  interface Props {
    table: Table<DashboardPageTable>;
  }

  let { table }: Props = $props();

  const isFiltered = $derived(table.getState().columnFilters.length > 0);
</script>

<div class="flex items-center justify-end gap-2">
  <div class="flex items-center gap-2">
    <div class="flex items-center space-x-2">
      <Input
        placeholder="Search by church name"
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        oninput={(e) => {
          table.getColumn('name')?.setFilterValue(e.currentTarget.value);
        }}
        onchange={(e) => {
          table.getColumn('name')?.setFilterValue(e.currentTarget.value);
        }}
        class="h-8 w-[150px] lg:w-[250px]"
      />

      {#if isFiltered}
        <Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 lg:px-3">
          Clear
          <X />
        </Button>
      {/if}
    </div>
    <div class="">
      <TableViewOptions {table} />
    </div>
  </div>
</div>
