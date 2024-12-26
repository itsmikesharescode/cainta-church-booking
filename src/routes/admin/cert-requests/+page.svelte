<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { columns } from './components/table/components/columns';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { initTableState } from './components/table/tableState.svelte';
  import DeleteCertificate from './components/delete-certificate/delete-certificate.svelte';
  import ViewUser from './components/view-user/view-user.svelte';

  const { data } = $props();

  initTableState();
</script>

<main class="container min-h-screen py-10">
  {#await data.certRequests}
    <div class="flex flex-col gap-2">
      <div class="flex justify-end">
        <div class="flex items-center gap-2.5">
          <Skeleton class="h-9 w-[300px]" />
          <Skeleton class="h-9 w-[110px]" />
        </div>
      </div>

      <div class="flex justify-end">
        <Skeleton class="h-9 w-[450px]" />
      </div>

      <Skeleton class="h-9 w-full" />
    </div>
  {:then certRequests}
    <Table data={certRequests ?? []} {columns} />
  {/await}
</main>

<ViewUser adminApproveCertForm={data.adminApproveCertForm} />
<DeleteCertificate adminDeleteCertForm={data.adminDeleteCertForm} />
