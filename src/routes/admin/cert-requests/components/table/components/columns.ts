import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { AdminCertRequestsPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';
import { format24hrTo12hrAMPM } from '$lib/utils';

export const columns: ColumnDef<AdminCertRequestsPageTable, unknown>[] = [
  {
    accessorKey: 'reference_id',
    id: 'reference_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminCertRequestsPageTable, unknown>, {
        column,
        title: 'Reference ID'
      });
    },
    cell: ({ row }) => {
      const referenceIdSnippet = createRawSnippet<[string]>((getReferenceID) => {
        return {
          render: () => `<div class="w-full">${getReferenceID()}</div>`
        };
      });

      return renderSnippet(referenceIdSnippet, row.getValue('reference_id'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'name',
    id: 'name',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminCertRequestsPageTable, unknown>, {
        column,
        title: 'Certificate Name'
      });
    },
    cell: ({ row }) => {
      const nameSnippet = createRawSnippet<[string]>((getName) => {
        return {
          render: () => `<div class="w-full">${getName()}</div>`
        };
      });

      return renderSnippet(nameSnippet, row.getValue('name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'status',
    id: 'status',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminCertRequestsPageTable, unknown>, {
        column,
        title: 'Status'
      });
    },
    cell: ({ row }) => {
      const statusSnippet = createRawSnippet<[string]>((getStatus) => {
        const detectColor = (v: string) => {
          if (v === 'pending') return 'text-red-500';
          if (v === 'accepted') return 'text-yellow-500';
          return 'text-green-500';
        };

        return {
          render: () => `<div class="w-full ${detectColor(getStatus())}">${getStatus()}</div>`
        };
      });

      return renderSnippet(statusSnippet, row.getValue('status'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'price',
    id: 'price',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminCertRequestsPageTable, unknown>, {
        column,
        title: 'Price'
      });
    },
    cell: ({ row }) => {
      const priceSnippet = createRawSnippet<[string]>((getPrice) => {
        return {
          render: () =>
            `<div class="w-full">${getPrice() ? `₱ ${Number(getPrice()).toLocaleString()}` : 'Not available'}</div>`
        };
      });

      return renderSnippet(priceSnippet, row.getValue('price'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'date',
    id: 'date',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminCertRequestsPageTable, unknown>, {
        column,
        title: 'Date'
      });
    },
    cell: ({ row }) => {
      const dateSnippet = createRawSnippet<[string]>((getDate) => {
        return {
          render: () => `<div class="w-full">${getDate()}</div>`
        };
      });

      return renderSnippet(dateSnippet, row.getValue('date'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'initial_time',
    id: 'initial_time',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminCertRequestsPageTable, unknown>, {
        column,
        title: 'From'
      });
    },
    cell: ({ row }) => {
      const initialTimeSnippet = createRawSnippet<[string]>((getInitialTime) => {
        return {
          render: () =>
            `<div class="w-full truncate">${format24hrTo12hrAMPM(getInitialTime())}</div>`
        };
      });

      return renderSnippet(initialTimeSnippet, row.getValue('initial_time'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'final_time',
    id: 'final_time',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminCertRequestsPageTable, unknown>, {
        column,
        title: 'To'
      });
    },
    cell: ({ row }) => {
      const finalTimeSnippet = createRawSnippet<[string]>((getFinalTime) => {
        return {
          render: () => `<div class="w-full">${format24hrTo12hrAMPM(getFinalTime())}</div>`
        };
      });

      return renderSnippet(finalTimeSnippet, row.getValue('final_time'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminCertRequestsPageTable, unknown>, {
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
    cell: ({ row }) => renderComponent(TableRowActions<AdminCertRequestsPageTable>, { row })
  }
];
