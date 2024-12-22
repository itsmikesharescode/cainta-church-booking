<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { toast } from 'svelte-sonner';
  import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { useTableState } from '../table/tableState.svelte';
  import UpdateEmail from './update-email/update-email.svelte';
  import type { UpdateEmailSchema } from './update-email/schema';
  import UpdateInfo from './update-info/update-info.svelte';
  import type { UpdateInfoSchema } from './update-info/schema';
  import UpdatePassword from './update-password/update-password.svelte';
  import type { UpdatePasswordSchema } from './update-password/schema';

  interface Props {
    updateEmailForm: SuperValidated<Infer<UpdateEmailSchema>>;
    updateInfoForm: SuperValidated<Infer<UpdateInfoSchema>>;
    updatePasswordForm: SuperValidated<Infer<UpdatePasswordSchema>>;
  }

  const { updateEmailForm, updateInfoForm, updatePasswordForm }: Props = $props();

  const tableState = useTableState();

  const activeRow = $derived(tableState.getActiveRow());

  $effect(() => {
    if (tableState.getShowUpdate()) {
      return () => {
        tableState.setActiveRow(null);
        tableState.setShowUpdate(false);
      };
    }
  });
</script>

<Dialog.Root
  onOpenChange={(alwaysFalse) => {
    tableState.setActiveRow(null);
    tableState.setShowUpdate(alwaysFalse);
  }}
  open={tableState.getShowUpdate()}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Update Account</Dialog.Title>
    </Dialog.Header>

    <section>
      <UpdateEmail {updateEmailForm} />
      <UpdateInfo {updateInfoForm} />
      <UpdatePassword {updatePasswordForm} />
    </section>
  </Dialog.Content>
</Dialog.Root>
