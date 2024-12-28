<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { columns } from './components/table/components/columns';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { initTableState } from './components/table/tableState.svelte';
  import ViewChurch from './components/view-church/view-church.svelte';
  import ViewCertificate from './components/view-certificate/view-certicate.svelte';
  import ViewReservation from './components/view-reservation/view-reservation.svelte';
  import ViewUser from './components/view-user/view-user.svelte';

  const { data } = $props();
  initTableState();
</script>

<main class="container min-h-screen py-10">
  {#await data.allPayments}
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
        id: p.id,
        user_id: p.user_id,
        church_id: Number(p.church_id),
        reservation_id: Number(p.reservation_id),
        cert_request_id: Number(p.cert_request_id),
        reference_id: p.xendit_callback.payment_id,
        created_at: p.created_at,
        xendit_callback: p.xendit_callback,
        payment_channel: p.xendit_callback.payment_channel,
        price: p.xendit_callback.amount,
        type: p.reservation_id ? 'Reservation' : 'Certificate'
      })) ?? []}
      {columns}
    />
  {/await}
</main>

<ViewChurch />
<ViewCertificate />
<ViewReservation />
<ViewUser />
