<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { useTableState } from '../table/tableState.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { PUBLIC_SUPABASE_STORAGE } from '$env/static/public';
  import { format24hrTo12hrAMPM } from '$lib/utils';

  const tableState = useTableState();
  const activeRow = $derived(tableState.getActiveRow());

  const open = $derived(page.url.searchParams.get('modal') === 'view-church');

  const getChurch = async () => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('churches_tb')
      .select('*')
      .eq('id', activeRow?.church_id ?? 0)
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
      <Dialog.Title>Viewing Church Record</Dialog.Title>
      <Dialog.Description>Payment Record for <i>{activeRow?.reference_id}</i></Dialog.Description>

      {#await getChurch()}
        <div class="flex items-center justify-center">
          <LoaderCircle class="size-4 animate-spin" />
        </div>
      {:then church}
        <div class="flex items-center gap-5">
          <Avatar.Root class="size-40 rounded-lg">
            <Avatar.Image src={`${PUBLIC_SUPABASE_STORAGE}/${church?.photo_link}`} alt="@shadcn" />
            <Avatar.Fallback class="rounded-lg">{church?.name.charAt(0)}</Avatar.Fallback>
          </Avatar.Root>

          <div class="flex flex-col">
            <span class="line-clamp-1 text-lg font-medium">{church?.name}</span>
            <span class="text-sm text-muted-foreground">
              {format24hrTo12hrAMPM(church?.open_time ?? '')} - {format24hrTo12hrAMPM(
                church?.close_time ?? ''
              )}
            </span>
          </div>
        </div>
        <span class="line-clamp-1 text-lg font-medium">{church?.description}</span>
      {/await}
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
