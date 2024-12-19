import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ReservationsPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';

export const columns: ColumnDef<ReservationsPageTable, unknown>[] = [
  {
    accessorKey: 'reference_id',
    id: 'reference_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
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
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
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
    accessorKey: 'number_of_guest',
    id: 'number_of_guest',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
        column,
        title: 'Number Of Guest'
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
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
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
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
        column,
        title: 'Initial Time'
      });
    },
    cell: ({ row }) => {
      const initialTimeSnippet = createRawSnippet<[string]>((getInitialTime) => {
        return {
          render: () => `<div class="w-full truncate">${getInitialTime()}</div>`
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
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
        column,
        title: 'Final Time'
      });
    },
    cell: ({ row }) => {
      const finalTimeSnippet = createRawSnippet<[string]>((getFinalTime) => {
        return {
          render: () => `<div class="w-full">${getFinalTime()}</div>`
        };
      });

      return renderSnippet(finalTimeSnippet, row.getValue('room'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
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
    cell: ({ row }) => renderComponent(TableRowActions<ReservationsPageTable>, { row })
  }
];
