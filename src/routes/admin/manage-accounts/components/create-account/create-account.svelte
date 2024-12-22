<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import Button from '$lib/components/ui/button/button.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import PhotoUploader from '$lib/components/general/photo-uploader.svelte';
  import ComboBox from '$lib/components/general/combo-box.svelte';
  import { createTimeRange } from '$lib/utils';
  import { createAccountSchema, type CreateAccountSchema } from './schema';

  interface Props {
    createAccountForm: SuperValidated<Infer<CreateAccountSchema>>;
  }

  const { createAccountForm }: Props = $props();

  const form = superForm(createAccountForm, {
    validators: zodClient(createAccountSchema),
    id: 'create-account-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          await goto('/admin/manage-accounts');
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  let open = $derived(page.url.searchParams.get('modal') === 'create-account');
</script>

<Button onclick={() => goto('?modal=create-church')}>Add Church</Button>

<Dialog.Root
  onOpenChange={() => {
    form.reset();
    goto('/admin/manage-accounts', { noScroll: true });
  }}
  {open}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Account</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/createAccountEvent" use:enhance>
      <Form.Field {form} name="email">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Email</Form.Label>
            <Input {...props} bind:value={$formData.email} placeholder="Enter email" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="firstname">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>First Name</Form.Label>
            <Input {...props} bind:value={$formData.firstname} placeholder="Enter first name" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="lastname">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Last Name</Form.Label>
            <Input {...props} bind:value={$formData.lastname} placeholder="Enter last name" />
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
              placeholder="Enter mobile number"
            />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="password">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Password</Form.Label>
            <Input
              type="password"
              {...props}
              bind:value={$formData.password}
              placeholder="Enter password"
            />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="confirmPassword">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Confirm Password</Form.Label>
            <Input
              type="password"
              {...props}
              bind:value={$formData.confirmPassword}
              placeholder="Confirm password"
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
          Create Account
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
