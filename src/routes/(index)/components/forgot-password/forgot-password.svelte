<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { forgotPasswordSchema, type ForgotPasswordSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import Button from '$lib/components/ui/button/button.svelte';

  interface Props {
    forgotPasswordForm: SuperValidated<Infer<ForgotPasswordSchema>>;
  }

  const { forgotPasswordForm }: Props = $props();

  const form = superForm(forgotPasswordForm, {
    validators: zodClient(forgotPasswordSchema),
    id: 'forgot-password-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          await goto('/');
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  let open = $derived.by(() => {
    return page.url.searchParams.get('auth') === 'forgot-password';
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={() => {
    form.reset();
    goto('/');
  }}
  {open}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Forgot Password</Dialog.Title>
      <Dialog.Description>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium, dolores.
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/forgotPasswordEvent" use:enhance>
      <Form.Field {form} name="email">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Email</Form.Label>
            <Input {...props} bind:value={$formData.email} placeholder="Enter your email" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <div class=" flex items-center justify-end">
        <Button onclick={() => form.reset()} variant="link" href="/?auth=login">Log in here</Button>
        <Form.Button size="sm" disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <LoaderCircle class="size-4 animate-spin" />
            </div>
          {/if}
          Send Reset Link
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
