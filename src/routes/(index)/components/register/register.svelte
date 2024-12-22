<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { registerSchema, type RegisterSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import EyeClosed from 'lucide-svelte/icons/eye-closed';
  import Eye from 'lucide-svelte/icons/eye';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import Button from '$lib/components/ui/button/button.svelte';

  interface Props {
    registerForm: SuperValidated<Infer<RegisterSchema>>;
  }

  const { registerForm }: Props = $props();

  const form = superForm(registerForm, {
    validators: zodClient(registerSchema),
    id: 'register-form',
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
    return page.url.searchParams.get('auth') === 'register';
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
      <Dialog.Title>Register your account</Dialog.Title>
      <Dialog.Description>
        Please fill in the details below to create your account.
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/registerEvent" use:enhance>
      <div class="grid grid-cols-2 gap-2.5">
        <Form.Field {form} name="firstname">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>First Name</Form.Label>
              <Input
                {...props}
                bind:value={$formData.firstname}
                placeholder="Enter your first name"
              />
            {/snippet}
          </Form.Control>

          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="lastname">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Last Name</Form.Label>
              <Input
                {...props}
                bind:value={$formData.lastname}
                placeholder="Enter your last name"
              />
            {/snippet}
          </Form.Control>

          <Form.FieldErrors />
        </Form.Field>
      </div>
      <Form.Field {form} name="mobile_number">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Mobile Number</Form.Label>
            <Input
              {...props}
              bind:value={$formData.mobile_number}
              placeholder="Enter your mobile number 0905..."
            />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>
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
            <Form.Label>Password</Form.Label>
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

      <Form.Field {form} name="confirmPassword">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Confirm Password</Form.Label>
            <div class="relative flex items-center">
              <Input
                type={showPwd ? 'text' : 'password'}
                {...props}
                bind:value={$formData.confirmPassword}
                placeholder="Confirm your password"
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

      <div class="flex justify-end">
        <Button
          variant="link"
          href="/?auth=login"
          onclick={() => {
            form.reset();
          }}>Log in here</Button
        >
        <Form.Button disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <LoaderCircle class="size-4 animate-spin" />
            </div>
          {/if}
          Create Your Account
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
