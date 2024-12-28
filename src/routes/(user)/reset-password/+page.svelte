<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import EyeClosed from 'lucide-svelte/icons/eye-closed';
  import Eye from 'lucide-svelte/icons/eye';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { goto } from '$app/navigation';
  import { resetPasswordSchema, type ResetPasswordSchema } from './schema';

  const { data } = $props();

  const form = superForm(data.resetPasswordForm, {
    validators: zodClient(resetPasswordSchema),
    id: 'reset-password-form',
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

  let showPwd = $state(false);

  const { form: formData, enhance, submitting } = form;
</script>

<main class="grid min-h-screen grid-cols-[2fr,1fr] gap-4">
  <section class="flex flex-col items-center justify-center gap-2.5 border-r-[1px]">
    <span class="text-center text-4xl font-bold">Cainta Booking System</span>
    <span class="text-center text-base text-muted-foreground">
      Please never share your password to anyone.
    </span>
  </section>

  <section class="flex items-center justify-center">
    <form method="POST" action="?/resetPasswordEvent" use:enhance class="w-[310px]">
      <div class="my-10 flex flex-col">
        <span class="text-2xl font-bold">Update Password</span>
        <span class="text-sm text-muted-foreground"
          >Reloading this website will lose your progress.</span
        >
      </div>
      <Form.Field {form} name="password">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Password</Form.Label>
            <div class="relative flex items-center">
              <Input
                type={showPwd ? 'text' : 'password'}
                {...props}
                bind:value={$formData.password}
                placeholder="Enter new your password"
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
                placeholder="Confirm new your password"
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
        <Form.Button size="sm" disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <LoaderCircle class="size-4 animate-spin" />
            </div>
          {/if}
          Reset Password
        </Form.Button>
      </div>
    </form>
  </section>
</main>
