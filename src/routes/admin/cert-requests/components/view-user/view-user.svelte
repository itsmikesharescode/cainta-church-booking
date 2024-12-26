<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { useTableState } from '../table/tableState.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { PUBLIC_SUPABASE_STORAGE } from '$env/static/public';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import type { AdminApproveCertSchema } from './components/approve-request/schema';
  import ApproveRequest from './components/approve-request/approve-request.svelte';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { format24hrTo12hrAMPM } from '$lib/utils';

  interface Props {
    adminApproveCertForm: SuperValidated<Infer<AdminApproveCertSchema>>;
  }

  const { adminApproveCertForm }: Props = $props();

  const tableState = useTableState();
  const activeRow = $derived(tableState.getActiveRow());

  const open = $derived(page.url.searchParams.get('modal') === 'view-user');
</script>

{#if activeRow}
  <Dialog.Root
    controlledOpen
    onOpenChange={() => {
      tableState.setActiveRow(null);
      goto('/admin/cert-requests');
    }}
    {open}
  >
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Viewing User Information</Dialog.Title>
      </Dialog.Header>

      <div class="flex items-center gap-2.5">
        <Avatar.Root class="size-24">
          <Avatar.Image
            src="{PUBLIC_SUPABASE_STORAGE}/{activeRow?.users_tb.user_meta_data.avatar_link}"
            alt="@shadcn"
          />
          <Avatar.Fallback>
            {activeRow?.users_tb.user_meta_data.firstname[0].toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>

        <div class="flex flex-col">
          <span>
            {activeRow?.users_tb.user_meta_data.firstname}
            {activeRow?.users_tb.user_meta_data.lastname}
          </span>
          <span class="text-muted-foreground">{activeRow?.users_tb.user_meta_data.email}</span>
          <span class="text-muted-foreground">{activeRow?.user_id}</span>
        </div>
      </div>

      <Separator />
      {#if activeRow.status === 'pending'}
        <div class="">
          <span class="text-sm text-muted-foreground">
            The user wants to request a certificate at
            <i class="underline">
              {format24hrTo12hrAMPM(activeRow?.initial_time ?? '')} -
              {format24hrTo12hrAMPM(activeRow?.final_time ?? '')} @
              {activeRow?.date}
            </i>
          </span>
          <span class="text-sm text-muted-foreground">
            With certificate name of
            <i class="underline">{activeRow?.name.split('/')[0]}</i>
            at price of ₱
            <i class="underline">{Number(activeRow?.name.split('/')[1]).toLocaleString()}</i>
          </span>
        </div>

        <div class="">
          <ApproveRequest {adminApproveCertForm} />
        </div>
      {:else}
        <span class="text-base text-muted-foreground">
          This certificate request is already
          <span class="font-semibold italic">{activeRow.status}</span>.
        </span>
      {/if}
    </Dialog.Content>
  </Dialog.Root>
{/if}
