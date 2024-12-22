<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { deleteChurchSchema, type DeleteChurchSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import EyeClosed from 'lucide-svelte/icons/eye-closed';
  import Eye from 'lucide-svelte/icons/eye';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import Button from '$lib/components/ui/button/button.svelte';
  import { useTableState } from '../table/tableState.svelte';

  interface Props {
    deleteChurchForm: SuperValidated<Infer<DeleteChurchSchema>>;
  }

  const { deleteChurchForm }: Props = $props();

  const tableState = useTableState();
  const activeRow = $derived(tableState.getActiveRow());

  const form = superForm(deleteChurchForm, {
    validators: zodClient(deleteChurchSchema),
    id: 'delete-church-form',
    onUpdate: ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.setActiveRow(null);
          tableState.setShowDelete(false);
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  let showPwd = $state(false);

  const { form: formData, enhance, submitting } = form;

  $effect(() => {
    if (tableState.getShowDelete()) {
      $formData.id = activeRow?.id ?? 0;
      $formData.image_path = activeRow?.photo_link ?? '';
      return () => {
        form.reset();
        tableState.setActiveRow(null);
        tableState.setShowDelete(false);
      };
    }
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={(alwaysFalse) => {
    form.reset();
    tableState.setActiveRow(null);
    tableState.setShowDelete(alwaysFalse);
  }}
  open={tableState.getShowDelete()}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Delete Church</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/deleteChurchEvent" use:enhance>
      <input type="hidden" name="id" bind:value={$formData.id} />
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
