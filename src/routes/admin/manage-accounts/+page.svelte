<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import CreateAccount from './components/create-account/create-account.svelte';

  const { data } = $props();

  initTableState();
</script>

<main class="container min-h-screen py-10">
  <Table data={[]} {columns} />
</main>

<CreateAccount createAccountForm={data.createAccountForm} />
