<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { toast } from 'svelte-sonner';
  import { adminDeleteReservationSchema, type AdminDeleteReservationSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { useTableState } from '../table/tableState.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  interface Props {
    adminDeleteReservationForm: SuperValidated<Infer<AdminDeleteReservationSchema>>;
  }

  const { adminDeleteReservationForm }: Props = $props();

  const tableState = useTableState();
  const activeRow = $derived(tableState.getActiveRow());

  const form = superForm(adminDeleteReservationForm, {
    validators: zodClient(adminDeleteReservationSchema),
    id: 'cancel-reservation-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.setActiveRow(null);
          await goto('/admin/reservations');
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  const open = $derived(page.url.searchParams.get('modal') === 'delete-reservation');

  $effect(() => {
    if (open) {
      $formData.id = activeRow?.id ?? 0;

      return () => {
        form.reset();
        tableState.setActiveRow(null);
      };
    }
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={() => {
    form.reset();
    tableState.setActiveRow(null);
    goto('/admin/reservations');
  }}
  {open}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Delete Reservation</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/deleteReservationEvent" use:enhance>
      <input type="hidden" name="id" bind:value={$formData.id} />

      <div class=" flex items-center justify-end">
        <Form.Button size="sm" disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <LoaderCircle class="size-4 animate-spin" />
            </div>
          {/if}
          Delete
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
