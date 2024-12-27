import { getContext, setContext } from 'svelte';
import type { PaymentPageTable } from './data/schemas';

class TableState {
  #activeRow = $state<PaymentPageTable | null>(null);

  setActiveRow(row: PaymentPageTable | null) {
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
