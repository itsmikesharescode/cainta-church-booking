import { getContext, setContext } from 'svelte';
import type { AdminPaymentPageTable } from './data/schemas';

class TableState {
  #activeRow = $state<AdminPaymentPageTable | null>(null);

  setActiveRow(row: AdminPaymentPageTable | null) {
    this.#activeRow = row;
  }

  getActiveRow() {
    return this.#activeRow;
  }

  #showDelete = $state(false);

  setShowDelete(show: boolean) {
    this.#showDelete = show;
  }

  getShowDelete() {
    return this.#showDelete;
  }
}

const TableKey = Symbol('ItemsTableState');

export const initTableState = () => {
  return setContext(TableKey, new TableState());
};

export const useTableState = () => {
  return getContext<ReturnType<typeof initTableState>>(TableKey);
};
