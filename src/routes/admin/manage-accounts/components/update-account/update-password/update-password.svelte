<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { updatePasswordSchema, type UpdatePasswordSchema } from './schema';
  import { useTableState } from '../../table/tableState.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import EyeClosed from 'lucide-svelte/icons/eye-closed';
  import Eye from 'lucide-svelte/icons/eye';

  interface Props {
    updatePasswordForm: SuperValidated<Infer<UpdatePasswordSchema>>;
  }

  const { updatePasswordForm }: Props = $props();
  const tableState = useTableState();

  const form = superForm(updatePasswordForm, {
    validators: zodClient(updatePasswordSchema),
    id: 'update-password-form',
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

  const dependencyCheck = $derived(page.url.searchParams.get('modal') === 'update-account');
  const activeRow = $derived(tableState.getActiveRow());

  let showPwd = $state(false);

  $effect(() => {
    if (dependencyCheck) {
      $formData.user_id = activeRow?.user_id ?? '';

      return () => {
        form.reset();
      };
    }
  });
</script>

<form method="POST" action="?/updatePasswordEvent" use:enhance>
  <input type="hidden" name="user_id" bind:value={$formData.user_id} />

  <Form.Field {form} name="password">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Password</Form.Label>
        <div class="relative flex items-center">
          <Input
            type={showPwd ? 'text' : 'password'}
            {...props}
            bind:value={$formData.password}
            placeholder="Enter password"
          />
          <button type="button" onclick={() => (showPwd = !showPwd)} class="absolute right-2 p-1">
            {#if showPwd}
              <Eye class="size-4" />
            {:else}
              <EyeClosed class="size-4" />
            {/if}
          </button>
        </div>
      {/snippet}
    </Form.Control>

    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="confirmPassword">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Confirm Password</Form.Label>
        <div class="relative flex items-center">
          <Input
            type={showPwd ? 'text' : 'password'}
            {...props}
            bind:value={$formData.confirmPassword}
            placeholder="Confirm password"
          />
          <button type="button" onclick={() => (showPwd = !showPwd)} class="absolute right-2 p-1">
            {#if showPwd}
              <Eye class="size-4" />
            {:else}
              <EyeClosed class="size-4" />
            {/if}
          </button>
        </div>
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
      Update Password
    </Form.Button>
  </div>
</form>
