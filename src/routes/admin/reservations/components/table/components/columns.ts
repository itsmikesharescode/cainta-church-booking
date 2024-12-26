import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { AdminReservationsPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';
import { format24hrTo12hrAMPM } from '$lib/utils';

export const columns: ColumnDef<AdminReservationsPageTable, unknown>[] = [
  {
    accessorKey: 'reference_id',
    id: 'reference_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminReservationsPageTable, unknown>, {
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
    accessorKey: 'event_name',
    id: 'event_name',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminReservationsPageTable, unknown>, {
        column,
        title: 'Event Name'
      });
    },
    cell: ({ row }) => {
      const eventNameSnippet = createRawSnippet<[string]>((getEventName) => {
        return {
          render: () => `<div class="w-full">${getEventName()}</div>`
        };
      });

      return renderSnippet(eventNameSnippet, row.getValue('event_name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'status',
    id: 'status',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminReservationsPageTable, unknown>, {
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
      return renderComponent(TableColumnHeader<AdminReservationsPageTable, unknown>, {
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
    accessorKey: 'number_of_guest',
    id: 'number_of_guest',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminReservationsPageTable, unknown>, {
        column,
        title: 'Guest'
      });
    },
    cell: ({ row }) => {
      const numberOfGuestSnippet = createRawSnippet<[string]>((getNumberOfGuest) => {
        return {
          render: () => `<div class="w-full">${getNumberOfGuest()}</div>`
        };
      });

      return renderSnippet(numberOfGuestSnippet, row.getValue('number_of_guest'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'date',
    id: 'date',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<AdminReservationsPageTable, unknown>, {
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
      return renderComponent(TableColumnHeader<AdminReservationsPageTable, unknown>, {
        column,
        title: 'Initial Time'
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
      return renderComponent(TableColumnHeader<AdminReservationsPageTable, unknown>, {
        column,
        title: 'Final Time'
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
      return renderComponent(TableColumnHeader<AdminReservationsPageTable, unknown>, {
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
    cell: ({ row }) => renderComponent(TableRowActions<AdminReservationsPageTable>, { row })
  }
];
