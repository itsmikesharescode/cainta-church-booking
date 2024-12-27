import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { PaymentPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';

export const columns: ColumnDef<PaymentPageTable, unknown>[] = [
  {
    accessorKey: 'payment_channel',
    id: 'payment_channel',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<PaymentPageTable, unknown>, {
        column,
        title: 'Payment Channel'
      });
    },
    cell: ({ row }) => {
      const paymentChannelSnippet = createRawSnippet<[string]>((getPaymentChannel) => {
        return {
          render: () => `<div class="w-full">${getPaymentChannel()}</div>`
        };
      });

      return renderSnippet(paymentChannelSnippet, row.getValue('payment_channel'));
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
