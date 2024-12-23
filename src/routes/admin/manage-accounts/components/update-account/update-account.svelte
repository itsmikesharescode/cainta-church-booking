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
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  interface Props {
    updateEmailForm: SuperValidated<Infer<UpdateEmailSchema>>;
    updateInfoForm: SuperValidated<Infer<UpdateInfoSchema>>;
    updatePasswordForm: SuperValidated<Infer<UpdatePasswordSchema>>;
  }

  const { updateEmailForm, updateInfoForm, updatePasswordForm }: Props = $props();

  const tableState = useTableState();

  $effect(() => {
    if (tableState.getShowUpdate()) {
      return () => {
        tableState.setActiveRow(null);
      };
    }
  });

  const open = $derived(page.url.searchParams.get('modal') === 'update-account');
</script>

<Dialog.Root
  onOpenChange={() => {
    tableState.setActiveRow(null);
    goto('/admin/manage-accounts');
  }}
  {open}
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
