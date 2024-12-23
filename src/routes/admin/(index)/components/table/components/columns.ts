import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { DashboardPageTable } from '../data/schemas';
import {
  TableColumnHeader,
  TableRowActions,
  TableDisplayChurchName,
  TableDispplayEvents,
  TableDisplayCerts
} from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';
import { format24hrTo12hrAMPM } from '$lib/utils';

export const columns: ColumnDef<DashboardPageTable, unknown>[] = [
  {
    accessorKey: 'name',
    id: 'name',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DashboardPageTable, unknown>, {
        column,
        title: 'Name'
      });
    },
    cell: ({ row }) => renderComponent(TableDisplayChurchName<DashboardPageTable>, { row }),
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'description',
    id: 'description',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DashboardPageTable, unknown>, {
        column,
        title: 'Description'
      });
    },
    cell: ({ row }) => {
      const descriptionSnippet = createRawSnippet<[string]>((getDescription) => {
        return {
          render: () =>
            `<div title=${getDescription()} class="w-full line-clamp-2">${getDescription()}</div>`
        };
      });

      return renderSnippet(descriptionSnippet, row.getValue('description'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'events',
    id: 'events',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DashboardPageTable, unknown>, {
        column,
        title: 'Events'
      });
    },
    cell: ({ row }) => renderComponent(TableDispplayEvents<DashboardPageTable>, { row }),
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'certs',
    id: 'certs',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DashboardPageTable, unknown>, {
        column,
        title: 'Certificates'
      });
    },
    cell: ({ row }) => renderComponent(TableDisplayCerts<DashboardPageTable>, { row }),
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'address',
    id: 'address',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DashboardPageTable, unknown>, {
        column,
        title: 'Address'
      });
    },
    cell: ({ row }) => {
      const addressSnippet = createRawSnippet<[string]>((getAddress) => {
        return {
          render: () => `<div class="w-full">${getAddress()}</div>`
        };
      });

      return renderSnippet(addressSnippet, row.getValue('address'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'open_time',
    id: 'open_time',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DashboardPageTable, unknown>, {
        column,
        title: 'Open Time'
      });
    },
    cell: ({ row }) => {
      const openTimeSnippet = createRawSnippet<[string]>((getOpenTime) => {
        return {
          render: () => `<div class="w-full truncate">${format24hrTo12hrAMPM(getOpenTime())}</div>`
        };
      });

      return renderSnippet(openTimeSnippet, row.getValue('open_time'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'close_time',
    id: 'close_time',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DashboardPageTable, unknown>, {
        column,
        title: 'Close Time'
      });
    },
    cell: ({ row }) => {
      const toTimeSnippet = createRawSnippet<[string]>((getCloseTime) => {
        return {
          render: () => `<div class="w-full">${format24hrTo12hrAMPM(getCloseTime())}</div>`
        };
      });

      return renderSnippet(toTimeSnippet, row.getValue('close_time'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DashboardPageTable, unknown>, {
        column,
        title: 'Created At'
      });
    },
    cell: ({ row }) => {
      const createdAtSnippet = createRawSnippet<[string]>((getCreatedAt) => {
        return {
          render: () =>
            `<div class="w-full">${new Date(getCreatedAt()).toLocaleDateString()} @ ${new Date(getCreatedAt()).toLocaleTimeString()}</div>`
        };
      });

      return renderSnippet(createdAtSnippet, row.getValue('created_at'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    id: 'actions',
    cell: ({ row }) => renderComponent(TableRowActions<DashboardPageTable>, { row })
  }
];
