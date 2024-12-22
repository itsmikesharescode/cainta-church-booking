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
  import CreateEvents from './create-events/create-events.svelte';
  import CreateCerts from './create-certs/create-certs.svelte';

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

  const { form: formData, enhance, submitting } = form;

  let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Add Church</Button>

<Dialog.Root
  onOpenChange={() => {
    form.reset();
  }}
  bind:open
>
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
            <CreateEvents bind:stringValue={$formData.events} />
            <input type="hidden" name={props.name} bind:value={$formData.events} />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="certs">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label class="flex items-center justify-between">Certificates</Form.Label>
            <CreateCerts bind:stringValue={$formData.certs} />
            <input type="hidden" name={props.name} bind:value={$formData.certs} />
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
