<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { updateEmailSchema, type UpdateEmailSchema } from './schema';
  import { useTableState } from '../../table/tableState.svelte';

  interface Props {
    updateEmailForm: SuperValidated<Infer<UpdateEmailSchema>>;
  }

  const { updateEmailForm }: Props = $props();
  const tableState = useTableState();

  const form = superForm(updateEmailForm, {
    validators: zodClient(updateEmailSchema),
    id: 'update-email-form',
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
      $formData.email = activeRow?.email ?? '';

      return () => {
        form.reset();
      };
    }
  });
</script>

<form method="POST" action="?/updateEmailEvent" use:enhance>
  <input type="hidden" name="user_id" bind:value={$formData.user_id} />
  <Form.Field {form} name="email">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <div class="flex items-center gap-2.5">
          <Input {...props} bind:value={$formData.email} placeholder="Enter new email" />
          <Form.Button size="sm" disabled={$submitting} class="relative">
            {#if $submitting}
              <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
                <LoaderCircle class="size-4 animate-spin" />
              </div>
            {/if}
            Update Email
          </Form.Button>
        </div>
      {/snippet}
    </Form.Control>

    <Form.FieldErrors />
  </Form.Field>
</form>
