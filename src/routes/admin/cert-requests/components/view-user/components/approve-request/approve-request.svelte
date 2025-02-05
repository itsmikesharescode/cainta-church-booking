<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { adminApproveCertSchema, type AdminApproveCertSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { page } from '$app/state';
  import { useTableState } from '../../../table/tableState.svelte';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import ComboBox from '$lib/components/general/combo-box.svelte';
  import DatePicker from '$lib/components/general/date-picker.svelte';
  import { createTimeRange } from '$lib/utils';

  interface Props {
    adminApproveCertForm: SuperValidated<Infer<AdminApproveCertSchema>>;
  }

  const { adminApproveCertForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(adminApproveCertForm, {
    validators: zodClient(adminApproveCertSchema),
    id: 'update-cert-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success(data.msg);
          await goto('/admin/cert-requests');
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  const dependency = $derived(page.url.searchParams.get('modal') === 'view-user');

  const activeRow = tableState.getActiveRow();

  $effect(() => {
    if (dependency) {
      $formData.id = activeRow?.id ?? 0;
      $formData.price = Number(activeRow?.name.split('/')[1]) ?? 0;
      $formData.email = activeRow?.users_tb.user_meta_data.email ?? '';
      $formData.date = activeRow?.date ?? '';
      $formData.initial_time = activeRow?.initial_time ?? '';
      $formData.final_time = activeRow?.final_time ?? '';
    }
  });

  // TODO: Implement functionality to update the reservation status from pending to accepted. The user will also update it to paid when payment is made. Additionally, hide the approval form when the status is already approved or paid.
</script>

<form method="POST" action="?/approveCertEvent" use:enhance>
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

  <Form.Field {form} name="date">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Request Date</Form.Label>
        <!--Must update types soon-->
        <DatePicker bind:selected={$formData.date} />
        <input type="hidden" name={props.name} bind:value={$formData.date} />
      {/snippet}
    </Form.Control>

    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="initial_time">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Initial Time</Form.Label>

        <ComboBox
          placeholder="Select initial time"
          searchPlaceholder="Search your time..."
          emptySeachMsg="No time found"
          contentStyle="w-[300px] p-0"
          bind:selected={$formData.initial_time}
          selections={createTimeRange(
            activeRow?.churches_tb.open_time ?? '',
            activeRow?.churches_tb.close_time ?? ''
          )}
        />
        <input type="hidden" name={props.name} bind:value={$formData.initial_time} />
      {/snippet}
    </Form.Control>
  </Form.Field>

  <Form.Field {form} name="final_time">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Initial Time</Form.Label>

        <ComboBox
          placeholder="Select final time"
          searchPlaceholder="Search your time..."
          emptySeachMsg="No time found"
          contentStyle="w-[300px] p-0"
          bind:selected={$formData.final_time}
          selections={createTimeRange(
            activeRow?.churches_tb.open_time ?? '',
            activeRow?.churches_tb.close_time ?? ''
          )}
        />
        <input type="hidden" name={props.name} bind:value={$formData.final_time} />
      {/snippet}
    </Form.Control>
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
