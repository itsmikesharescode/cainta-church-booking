<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { toast } from 'svelte-sonner';
  import { deleteAccountSchema, type DeleteAccountSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { useTableState } from '../table/tableState.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  interface Props {
    deleteAccountForm: SuperValidated<Infer<DeleteAccountSchema>>;
  }

  const { deleteAccountForm }: Props = $props();

  const tableState = useTableState();
  const activeRow = $derived(tableState.getActiveRow());

  const form = superForm(deleteAccountForm, {
    validators: zodClient(deleteAccountSchema),
    id: 'delete-account-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.setActiveRow(null);
          await goto('/admin/manage-accounts');
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  const open = $derived(page.url.searchParams.get('modal') === 'delete-account');

  $effect(() => {
    if (open) {
      $formData.user_id = activeRow?.user_id ?? '';
      $formData.image_path = activeRow?.user_meta_data.avatar_link ?? '';

      return () => {
        form.reset();
        tableState.setActiveRow(null);
      };
    }
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={(alwaysFalse) => {
    form.reset();
    tableState.setActiveRow(null);
    goto('/admin/manage-accounts');
  }}
  {open}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Delete Account</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/deleteAccountEvent" use:enhance>
      <input type="hidden" name="user_id" bind:value={$formData.user_id} />
      <input type="hidden" name="image_path" bind:value={$formData.image_path} />
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
