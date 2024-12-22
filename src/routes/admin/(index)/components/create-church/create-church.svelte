<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { createChurchSchema, type CreateChurchSchema } from './schema';
  import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import Button from '$lib/components/ui/button/button.svelte';
  import CreateEvents from './create-events/create-events.svelte';
  import CreateCerts from './create-certs/create-certs.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import PhotoUploader from '$lib/components/general/photo-uploader.svelte';
  import ComboBox from '$lib/components/general/combo-box.svelte';
  import { createTimeRange } from '$lib/utils';

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

  let open = $derived(page.url.searchParams.get('modal') === 'create-church');

  const file = fileProxy(form, 'image');
</script>

<Button onclick={() => goto('?modal=create-church')}>Add Church</Button>

<Dialog.Root
  onOpenChange={() => {
    form.reset();
    goto('/admin', { noScroll: true });
  }}
  {open}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Church</Dialog.Title>
      <Dialog.Description>
        Please enter your credentials to log in to your account.
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" enctype="multipart/form-data" action="?/createChurchEvent" use:enhance>
      <Form.Field {form} name="image">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Church Photo</Form.Label>
            <PhotoUploader bind:singleFile={$formData.image} />
            <input name={props.name} type="file" bind:files={$file} class="hidden" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Church Name</Form.Label>
            <Input {...props} bind:value={$formData.name} placeholder="Enter church name" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

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

      <Form.Field {form} name="address">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Address</Form.Label>
            <Input {...props} bind:value={$formData.address} placeholder="Enter church address" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="open_time">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Open Time</Form.Label>
            <ComboBox
              placeholder="Select opening time"
              searchPlaceholder="Search time..."
              emptySeachMsg="No time found"
              contentStyle="w-[300px] p-0"
              bind:selected={$formData.open_time}
              selections={createTimeRange('00:00:00', '24:00:00')}
            />
            <input type="hidden" name={props.name} bind:value={$formData.open_time} />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="close_time">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Closing Time</Form.Label>
            <ComboBox
              placeholder="Select closing time"
              searchPlaceholder="Search time..."
              emptySeachMsg="No time found"
              contentStyle="w-[300px] p-0"
              bind:selected={$formData.close_time}
              selections={createTimeRange('00:00:00', '24:00:00')}
            />
            <input type="hidden" name={props.name} bind:value={$formData.close_time} />
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
          Add Church
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
