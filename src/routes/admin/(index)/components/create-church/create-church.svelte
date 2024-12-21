<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { createChurchSchema, type CreateChurchSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import Button from '$lib/components/ui/button/button.svelte';

  interface Props {
    createChurchForm: SuperValidated<Infer<CreateChurchSchema>>;
  }

  const { createChurchForm }: Props = $props();

  const form = superForm(createChurchForm, {
    validators: zodClient(createChurchSchema),
    id: 'create-church-form',
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

  let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Add Church</Button>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Church</Dialog.Title>
      <Dialog.Description>
        Please enter your credentials to log in to your account.
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/loginEvent" use:enhance>
      <Form.Field {form} name="events">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Events</Form.Label>
            <Input {...props} bind:value={$formData.events} placeholder="Enter your email" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="certs">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label class="flex items-center justify-between">Certificates</Form.Label>
            <Input {...props} bind:value={$formData.certs} placeholder="Enter your password" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Button size="sm" disabled={$submitting} class="relative">
        {#if $submitting}
          <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
            <LoaderCircle class="size-4 animate-spin" />
          </div>
        {/if}
        Add Church
      </Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
