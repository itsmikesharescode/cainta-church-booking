<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { loginSchema, type LoginSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import EyeClosed from 'lucide-svelte/icons/eye-closed';
  import Eye from 'lucide-svelte/icons/eye';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import Button from '$lib/components/ui/button/button.svelte';

  interface Props {
    loginForm: SuperValidated<Infer<LoginSchema>>;
  }

  const { loginForm }: Props = $props();

  const form = superForm(loginForm, {
    validators: zodClient(loginSchema),
    id: 'login-form',
    onUpdate: ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  let showPwd = $state(false);

  const { form: formData, enhance, submitting } = form;

  let open = $derived.by(() => {
    return page.url.searchParams.get('auth') === 'login';
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
      <Dialog.Title>Log in your account</Dialog.Title>
      <Dialog.Description>
        Please enter your credentials to log in to your account.
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/loginEvent" use:enhance>
      <Form.Field {form} name="email">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Email</Form.Label>
            <Input {...props} bind:value={$formData.email} placeholder="Enter your email" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="password">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label class="flex items-center justify-between">
              <span>Password</span>
              <Button variant="link" href="/?auth=forgot-password">Forgot Password</Button>
            </Form.Label>
            <div class="relative flex items-center">
              <Input
                type={showPwd ? 'text' : 'password'}
                {...props}
                bind:value={$formData.password}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onclick={() => (showPwd = !showPwd)}
                class="absolute right-2 p-1"
              >
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

      <div class=" flex items-center justify-end">
        <Button onclick={() => form.reset()} variant="link" href="/?auth=register"
          >Sign Up Free</Button
        >
        <Form.Button size="sm" disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <LoaderCircle class="size-4 animate-spin" />
            </div>
          {/if}
          Log in
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
