<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { updateInfoSchema, type UpdateInfoSchema } from './schema';
  import { useTableState } from '../../table/tableState.svelte';

  interface Props {
    updateInfoForm: SuperValidated<Infer<UpdateInfoSchema>>;
  }

  const { updateInfoForm }: Props = $props();
  const tableState = useTableState();

  const form = superForm(updateInfoForm, {
    validators: zodClient(updateInfoSchema),
    id: 'update-info-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.setActiveRow(null);
          tableState.setShowUpdate(false);
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  const activeRow = $derived(tableState.getActiveRow());

  $effect(() => {
    if (tableState.getShowUpdate()) {
      $formData.user_id = activeRow?.user_id ?? '';
      $formData.firstname = activeRow?.user_meta_data.firstname ?? '';
      $formData.lastname = activeRow?.user_meta_data.lastname ?? '';
      $formData.mobile_number = activeRow?.mobile_number ?? '';

      return () => {
        form.reset();
      };
    }
  });
</script>

<form method="POST" action="?/updateInfoEvent" use:enhance>
  <input type="hidden" name="user_id" bind:value={$formData.user_id} />
  <Form.Field {form} name="firstname">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>First Name</Form.Label>

        <Input {...props} bind:value={$formData.firstname} placeholder="Enter new first name" />
      {/snippet}
    </Form.Control>

    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="lastname">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Last Name</Form.Label>

        <Input {...props} bind:value={$formData.lastname} placeholder="Enter new last name" />
      {/snippet}
    </Form.Control>

    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="mobile_number">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Mobile Number</Form.Label>

        <Input
          {...props}
          bind:value={$formData.mobile_number}
          placeholder="Enter new mobile number"
        />
      {/snippet}
    </Form.Control>

    <Form.FieldErrors />
  </Form.Field>

  <div class="flex justify-end">
    <Form.Button size="sm" disabled={$submitting} class="relative">
      {#if $submitting}
        <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
          <LoaderCircle class="size-4 animate-spin" />
        </div>
      {/if}
      Update Information
    </Form.Button>
  </div>
</form>
