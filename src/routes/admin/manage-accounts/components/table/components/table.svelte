<script lang="ts" module>
  type TData = unknown;
  type TValue = unknown;
</script>

<script lang="ts" generics="TData, TValue">
  import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel
  } from '@tanstack/table-core';
  import TableToolbar from './table-toolbar.svelte';
  import TablePagination from './table-pagination.svelte';
  import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte';
  import FlexRender from '$lib/components/ui/data-table/flex-render.svelte';
  import * as Table from '$lib/components/ui/table/index';
  import type { ManageAccountPageTable } from '../data/schemas';

  interface Props {
    columns: ColumnDef<ManageAccountPageTable, unknown>[];
    data: ManageAccountPageTable[];
  }

  let { columns, data }: Props = $props();

  let rowSelection = $state<RowSelectionState>({});
  let columnVisibility = $state<VisibilityState>({});
  let columnFilters = $state<ColumnFiltersState>([]);
  let sorting = $state<SortingState>([]);
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const table = createSvelteTable({
    get data() {
      return data;
    },
    state: {
      get sorting() {
        return sorting;
      },
      get columnVisibility() {
        return columnVisibility;
      },
      get rowSelection() {
        return rowSelection;
      },
      get columnFilters() {
        return columnFilters;
      },
      get pagination() {
        return pagination;
      }
    },
    columns,
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      if (typeof updater === 'function') {
        rowSelection = updater(rowSelection);
      } else {
        rowSelection = updater;
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
    },
    onColumnVisibilityChange: (updater) => {
      if (typeof updater === 'function') {
        columnVisibility = updater(columnVisibility);
      } else {
        columnVisibility = updater;
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });
</script>

<div class="space-y-4">
  <TableToolbar {table} />

  <TablePagination {table} />

  <div class="min-h-screen">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head colspan={header.colSpan}>
                {#if !header.isPlaceholder}
                  <FlexRender
                    content={header.column.columnDef.header as any}
                    context={header.getContext() as any}
                  />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row data-state={row.getIsSelected() && 'selected'}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell>
                <FlexRender
                  content={cell.column.columnDef.cell as any}
                  context={cell.getContext() as any}
                />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>

  {#if table.getRowModel().rows.length > 11}
    <TablePagination {table} />
  {/if}
</div>
