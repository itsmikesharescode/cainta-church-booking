import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { DashboardPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';

export const columns: ColumnDef<DashboardPageTable, unknown>[] = [
  {
    accessorKey: 'name',
    id: 'name',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DashboardPageTable, unknown>, {
        column,
        title: 'Church Name'
      });
    },
    cell: ({ row }) => {
      const churchNameSnippet = createRawSnippet<[string]>((getName) => {
        return {
          render: () => `<div class="w-full">${getName()}</div>`
        };
      });

      return renderSnippet(churchNameSnippet, row.getValue('name'));
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
        title: 'Available Events'
      });
    },
    cell: ({ row }) => {
      const eventsSnippet = createRawSnippet<[string]>((getEvents) => {
        return {
          render: () => `<div class="w-full">${getEvents()}</div>`
        };
      });

      return renderSnippet(eventsSnippet, row.getValue('events'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'certs',
    id: 'certs',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DashboardPageTable, unknown>, {
        column,
        title: 'Available Certificates'
      });
    },
    cell: ({ row }) => {
      const certificatesSnippet = createRawSnippet<[string]>((getCertificates) => {
        return {
          render: () => `<div class="w-full">${getCertificates()}</div>`
        };
      });

      return renderSnippet(certificatesSnippet, row.getValue('certs'));
    },
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
          render: () => `<div class="w-full truncate">${getOpenTime()}</div>`
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
          render: () => `<div class="w-full">${getCloseTime()}</div>`
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
          render: () => `<div class="w-full">${getCreatedAt()}</div>`
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
