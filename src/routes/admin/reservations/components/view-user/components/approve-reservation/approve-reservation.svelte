<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { adminApproveResSchema, type AdminApproveResSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { page } from '$app/state';
  import { useTableState } from '../../../table/tableState.svelte';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';

  interface Props {
    adminApproveReservationForm: SuperValidated<Infer<AdminApproveResSchema>>;
  }

  const { adminApproveReservationForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(adminApproveReservationForm, {
    validators: zodClient(adminApproveResSchema),
    id: 'update-reservation-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success(data.msg);
          await goto('/admin/reservations');
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  const dependency = $derived(page.url.searchParams.get('modal') === 'view-user');

  $effect(() => {
    if (dependency) {
      $formData.id = tableState.getActiveRow()?.id ?? 0;
      $formData.price = Number(tableState.getActiveRow()?.event_name.split('/')[1]) ?? 0;
      $formData.email = tableState.getActiveRow()?.users_tb.user_meta_data.email ?? '';
    }
  });

  // TODO: Implement functionality to update the reservation status from pending to accepted. The user will also update it to paid when payment is made. Additionally, hide the approval form when the status is already approved or paid.
</script>

<form method="POST" action="?/approveReservationEvent" use:enhance>
  <input type="hidden" name="id" bind:value={$formData.id} />
  <input type="hidden" name="email" bind:value={$formData.email} />
  <Form.Field {form} name="price">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Price</Form.Label>
        <Input type="number" {...props} bind:value={$formData.price} />
      {/snippet}
    </Form.Control>
    <Form.Description>
      By clicking "Approve," this will update the status to "Accepted" with a price.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <div class="flex justify-end">
    <Form.Button size="sm" disabled={$submitting} class="relative">
      {#if $submitting}
        <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
          <LoaderCircle class="size-4 animate-spin" />
        </div>
      {/if}
      Approve
    </Form.Button>
  </div>
</form>
