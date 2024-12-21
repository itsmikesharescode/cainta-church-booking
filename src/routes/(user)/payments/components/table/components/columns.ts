import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { PaymentPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';

export const columns: ColumnDef<PaymentPageTable, unknown>[] = [
  {
    accessorKey: 'reference_id',
    id: 'reference_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<PaymentPageTable, unknown>, {
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
      return renderComponent(TableColumnHeader<PaymentPageTable, unknown>, {
        column,
        title: 'Payment Channel'
      });
    },
    cell: ({ row }) => {
      const certNameSnippet = createRawSnippet<[string]>((getCertName) => {
        return {
          render: () => `<div class="w-full">${getCertName()}</div>`
        };
      });

      return renderSnippet(certNameSnippet, row.getValue('event_name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'price',
    id: 'price',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<PaymentPageTable, unknown>, {
        column,
        title: 'Price'
      });
    },
    cell: ({ row }) => {
      const priceSnippet = createRawSnippet<[string]>((getPrice) => {
        return {
          render: () => `<div class="w-full">${getPrice()}</div>`
        };
      });

      return renderSnippet(priceSnippet, row.getValue('price'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'date_available',
    id: 'date_available',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<PaymentPageTable, unknown>, {
        column,
        title: 'Date Available'
      });
    },
    cell: ({ row }) => {
      const dateSnippet = createRawSnippet<[string]>((getDateAvailable) => {
        return {
          render: () => `<div class="w-full">${getDateAvailable()}</div>`
        };
      });

      return renderSnippet(dateSnippet, row.getValue('date_available'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'time_available_start',
    id: 'time_available_start',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<PaymentPageTable, unknown>, {
        column,
        title: 'From'
      });
    },
    cell: ({ row }) => {
      const fromTimeSnippet = createRawSnippet<[string]>((getFromTime) => {
        return {
          render: () => `<div class="w-full truncate">${getFromTime()}</div>`
        };
      });

      return renderSnippet(fromTimeSnippet, row.getValue('time_available_start'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'time_available_end',
    id: 'time_available_end',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<PaymentPageTable, unknown>, {
        column,
        title: 'To'
      });
    },
    cell: ({ row }) => {
      const toTimeSnippet = createRawSnippet<[string]>((getToTime) => {
        return {
          render: () => `<div class="w-full">${getToTime()}</div>`
        };
      });

      return renderSnippet(toTimeSnippet, row.getValue('time_available_start'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<PaymentPageTable, unknown>, {
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
    cell: ({ row }) => renderComponent(TableRowActions<PaymentPageTable>, { row })
  }
];