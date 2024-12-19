<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { updateEmailSchema, type UpdateEmailSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { page } from '$app/state';

  import LoaderCircle from 'lucide-svelte/icons/loader-circle';

  interface Props {
    updateEmailForm: SuperValidated<Infer<UpdateEmailSchema>>;
  }

  const { updateEmailForm }: Props = $props();

  const form = superForm(updateEmailForm, {
    validators: zodClient(updateEmailSchema),
    id: 'update-email-form',
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

  const { form: formData, enhance, submitting } = form;

  $effect(() => {
    if (page.url.searchParams.get('switch') === null && page.data.user?.email) {
      $formData.email = page.data.user?.email;
    }

    return () => {
      form.reset();
    };
  });
</script>

<div class="flex max-w-lg flex-col gap-2.5">
  <form method="POST" action="?/updateEmailEvent" use:enhance>
    <Form.Field {form} name="email">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Email</Form.Label>
          <div class="flex items-center gap-2.5">
            <Input {...props} bind:value={$formData.email} placeholder="Enter your new email" />
            <Form.Button size="sm" disabled={$submitting} class="relative">
              {#if $submitting}
                <div
                  class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary"
                >
                  <LoaderCircle class="size-4 animate-spin" />
                </div>
              {/if}
              Update Email
            </Form.Button>
          </div>
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>
  </form>

  <span class="text-sm text-muted-foreground"
    >An email confirmation of changing will be sent to your new email.</span
  >
</div>
