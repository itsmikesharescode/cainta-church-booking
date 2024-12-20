import { getContext, setContext } from 'svelte';
import type { CertRequestsPageTable } from './data/schemas';

class TableState {
  #activeRow = $state<CertRequestsPageTable | null>(null);

  setActiveRow(row: CertRequestsPageTable | null) {
    this.#activeRow = row;
  }

  getActiveRow() {
    return this.#activeRow;
  }

  #showUpdate = $state(false);

  setShowUpdate(show: boolean) {
    this.#showUpdate = show;
  }

  getShowUpdate() {
    return this.#showUpdate;
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
