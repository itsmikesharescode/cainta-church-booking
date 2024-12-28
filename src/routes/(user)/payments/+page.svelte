<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { columns } from './components/table/components/columns';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { initTableState } from './components/table/tableState.svelte';

  const { data } = $props();
  initTableState();
</script>

<main class="container min-h-screen py-10">
  {#await data.myPayments}
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
  {:then payments}
    <Table
      data={payments?.map((p) => ({
        id: p.id ?? 0,
        created_at: p.created_at ?? '',
        church_id: Number(p.church_id) ?? 0,
        reservation_id: Number(p.reservation_id) ?? 0,
        cert_request_id: Number(p.cert_request_id) ?? 0,
        xendit_callback: p.xendit_callback ?? {},
        payment_channel: p.xendit_callback.payment_channel ?? '',
        price: p.xendit_callback.amount ?? 0,
        reference_id: p.xendit_callback.payment_id ?? ''
      })) ?? []}
      {columns}
    />
  {/await}
</main>
