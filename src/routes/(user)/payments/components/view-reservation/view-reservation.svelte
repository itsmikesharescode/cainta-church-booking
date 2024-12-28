<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { useTableState } from '../table/tableState.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { format24hrTo12hrAMPM } from '$lib/utils';

  const tableState = useTableState();
  const activeRow = $derived(tableState.getActiveRow());

  const open = $derived(page.url.searchParams.get('modal') === 'view-reservation');

  const getReservation = async () => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('reservations_tb')
      .select('*')
      .eq('id', activeRow?.reservation_id ?? 0)
      .single();

    if (error) return null;

    return data;
  };

  $effect(() => {
    if (open) {
      return () => {
        tableState.setActiveRow(null);
      };
    }
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={() => {
    tableState.setActiveRow(null);
    goto('/payments');
  }}
  {open}
>
  <Dialog.Content class="">
    <Dialog.Header>
      <Dialog.Title>Viewing Reservation Record</Dialog.Title>
      <Dialog.Description>Payment Record for <i>{activeRow?.reference_id}</i></Dialog.Description>

      {#await getReservation()}
        <div class="flex items-center justify-center">
          <LoaderCircle class="size-4 animate-spin" />
        </div>
      {:then reservation}
        <div class="flex items-center gap-5">
          <div class="flex flex-col">
            <span class="line-clamp-1 text-lg font-medium">{reservation?.event_name}</span>
            <span class="text-sm text-muted-foreground">
              {format24hrTo12hrAMPM(reservation?.initial_time ?? '')} - {format24hrTo12hrAMPM(
                reservation?.final_time ?? ''
              )}
            </span>
          </div>
        </div>
        <span class="line-clamp-1 text-lg font-medium">{reservation?.message}</span>
      {/await}
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
