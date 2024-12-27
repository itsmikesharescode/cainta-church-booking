<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { columns } from './components/table/components/columns';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { initTableState } from './components/table/tableState.svelte';
  import CancelReservation from './components/cancel-reservation/cancel-reservation.svelte';
  import ProceedPayment from './components/proceed-payment/proceed-payment.svelte';
  const { data } = $props();

  initTableState();
</script>

<main class="container min-h-screen py-10">
  {#await data.myReservations}
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
  {:then reservations}
    <Table
      data={reservations?.map((res) => ({
        id: res.id ?? 0,
        church_id: res.church_id ?? 0,
        created_at: res.created_at ?? '',
        reference_id: res.reference_id ?? '',
        event_name: res.event_name ?? '',
        number_of_guest: res.number_of_guest ?? 0,
        date: res.date ?? '',
        initial_time: res.initial_time ?? '',
        final_time: res.final_time ?? '',
        price: res.price ?? 0,
        status: res.status ?? '',
        message: res.message ?? ''
      })) ?? []}
      {columns}
    />
  {/await}
</main>

<CancelReservation cancelReservationForm={data.cancelReservationForm} />
<ProceedPayment proceedPaymentForm={data.proceedPaymentForm} />
