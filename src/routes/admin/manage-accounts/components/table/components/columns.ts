import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ManageAccountPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions, TableDisplayFullname } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';
import { format24hrTo12hrAMPM } from '$lib/utils';

export const columns: ColumnDef<ManageAccountPageTable, unknown>[] = [
  {
    accessorKey: 'fullname',
    id: 'fullname',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ManageAccountPageTable, unknown>, {
        column,
        title: 'Full Name'
      });
    },
    cell: ({ row }) => renderComponent(TableDisplayFullname<ManageAccountPageTable>, { row }),
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'email',
    id: 'email',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ManageAccountPageTable, unknown>, {
        column,
        title: 'Email'
      });
    },
    cell: ({ row }) => {
      const openTimeSnippet = createRawSnippet<[string]>((getEmail) => {
        return {
          render: () => `<div class="w-full truncate">${getEmail()}</div>`
        };
      });

      return renderSnippet(openTimeSnippet, row.getValue('email'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'mobile_number',
    id: 'mobile_number',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ManageAccountPageTable, unknown>, {
        column,
        title: 'Mobile Number'
      });
    },
    cell: ({ row }) => {
      const toTimeSnippet = createRawSnippet<[string]>((getMobileNumber) => {
        return {
          render: () => `<div class="w-full">${format24hrTo12hrAMPM(getMobileNumber())}</div>`
        };
      });

      return renderSnippet(toTimeSnippet, row.getValue('mobile_number'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ManageAccountPageTable, unknown>, {
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
    cell: ({ row }) => renderComponent(TableRowActions<ManageAccountPageTable>, { row })
  }
];
