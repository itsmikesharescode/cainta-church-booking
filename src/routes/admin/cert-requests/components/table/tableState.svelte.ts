import { getContext, setContext } from 'svelte';
import type { AdminCertRequestsPageTable } from './data/schemas';

class TableState {
  #activeRow = $state<AdminCertRequestsPageTable | null>(null);

  setActiveRow(row: AdminCertRequestsPageTable | null) {
    this.#activeRow = row;
  }

  getActiveRow() {
    return this.#activeRow;
  }
}

const TableKey = Symbol('ItemsTableState');

export const initTableState = () => {
  return setContext(TableKey, new TableState());
};

export const useTableState = () => {
  return getContext<ReturnType<typeof initTableState>>(TableKey);
};
