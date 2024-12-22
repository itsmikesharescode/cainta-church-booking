<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { updateChurchSchema, type UpdateChurchSchema } from './schema';
  import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import CreateEvents from './create-events/create-events.svelte';
  import CreateCerts from './create-certs/create-certs.svelte';
  import PhotoUploader from '$lib/components/general/photo-uploader.svelte';
  import ComboBox from '$lib/components/general/combo-box.svelte';
  import { createTimeRange } from '$lib/utils';
  import { useTableState } from '../table/tableState.svelte';

  interface Props {
    updateChurchForm: SuperValidated<Infer<UpdateChurchSchema>>;
  }

  const { updateChurchForm }: Props = $props();
  const tableState = useTableState();

  const form = superForm(updateChurchForm, {
    validators: zodClient(updateChurchSchema),
    id: 'update-church-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          tableState.setActiveRow(null);
          tableState.setShowUpdate(false);
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  const file = fileProxy(form, 'image');

  const activeRow = $derived(tableState.getActiveRow());

  $effect(() => {
    if (tableState.getShowUpdate()) {
      $formData.id = activeRow?.id ?? 0;
      $formData.image_path = activeRow?.photo_link ?? '';
      $formData.name = activeRow?.name ?? '';
      $formData.address = activeRow?.address ?? '';
      $formData.certs = JSON.stringify(activeRow?.certs ?? '');
      $formData.events = JSON.stringify(activeRow?.events ?? '');
      $formData.open_time = activeRow?.open_time ?? '';
      $formData.close_time = activeRow?.close_time ?? '';
      return () => {
        form.reset();
      };
    }
  });
</script>

<Dialog.Root
  onOpenChange={(alwaysFalse) => {
    form.reset();
    tableState.setActiveRow(null);
    tableState.setShowUpdate(alwaysFalse);
  }}
  open={tableState.getShowUpdate()}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Update Church</Dialog.Title>
    </Dialog.Header>

    <form method="POST" enctype="multipart/form-data" action="?/updateChurchEvent" use:enhance>
      <input type="hidden" name="id" bind:value={$formData.id} />
      <input type="hidden" name="image_path" bind:value={$formData.image_path} />
      <p class="text-center text-sm text-muted-foreground">
        Updating church image may take 3 minutes to reappear due to caching.
      </p>
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
          Update Church
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
