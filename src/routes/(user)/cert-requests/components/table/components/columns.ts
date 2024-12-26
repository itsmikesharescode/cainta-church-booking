import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { CertRequestsPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';
import { format24hrTo12hrAMPM } from '$lib/utils';

export const columns: ColumnDef<CertRequestsPageTable, unknown>[] = [
  {
    accessorKey: 'reference_id',
    id: 'reference_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<CertRequestsPageTable, unknown>, {
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
      return renderComponent(TableColumnHeader<CertRequestsPageTable, unknown>, {
        column,
        title: 'Requested Certificate'
      });
    },
    cell: ({ row }) => {
      const certNameSnippet = createRawSnippet<[string]>((getCertName) => {
        return {
          render: () => `<div class="w-full">${getCertName()}</div>`
        };
      });

      return renderSnippet(certNameSnippet, row.getValue('name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'status',
    id: 'status',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<CertRequestsPageTable, unknown>, {
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
      return renderComponent(TableColumnHeader<CertRequestsPageTable, unknown>, {
        column,
        title: 'Price'
      });
    },
    cell: ({ row }) => {
      const priceSnippet = createRawSnippet<[string]>((getPrice) => {
        return {
          render: () => `<div class="w-full">${getPrice() || 'Not available'}</div>`
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
      return renderComponent(TableColumnHeader<CertRequestsPageTable, unknown>, {
        column,
        title: 'Requested Date'
      });
    },
    cell: ({ row }) => {
      const dateSnippet = createRawSnippet<[string]>((getDate) => {
        return {
          render: () => `<div class="w-full">${getDate() || 'Not available'}</div>`
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
      return renderComponent(TableColumnHeader<CertRequestsPageTable, unknown>, {
        column,
        title: 'From'
      });
    },
    cell: ({ row }) => {
      const fromTimeSnippet = createRawSnippet<[string]>((getInitialTime) => {
        return {
          render: () =>
            `<div class="w-full truncate">${getInitialTime() ? format24hrTo12hrAMPM(getInitialTime()) : 'Not available'}</div>`
        };
      });

      return renderSnippet(fromTimeSnippet, row.getValue('initial_time'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'final_time',
    id: 'final_time',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<CertRequestsPageTable, unknown>, {
        column,
        title: 'To'
      });
    },
    cell: ({ row }) => {
      const toTimeSnippet = createRawSnippet<[string]>((getFinalTime) => {
        return {
          render: () =>
            `<div class="w-full">${getFinalTime() ? format24hrTo12hrAMPM(getFinalTime()) : 'Not available'}</div>`
        };
      });

      return renderSnippet(toTimeSnippet, row.getValue('final_time'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<CertRequestsPageTable, unknown>, {
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
    cell: ({ row }) => renderComponent(TableRowActions<CertRequestsPageTable>, { row })
  }
];
