<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { columns } from './components/table/components/columns';
</script>

<main class="container min-h-screen py-10">
  <Table data={[]} {columns} />
</main>
