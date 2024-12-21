<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { toast } from 'svelte-sonner';
  import { updateProfileSchema, type UpdateProfileSchema } from './schema';
  import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { page } from '$app/state';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import PhotoUploader from '$lib/components/general/photo-uploader.svelte';

  interface Props {
    updateProfileForm: SuperValidated<Infer<UpdateProfileSchema>>;
  }

  const { updateProfileForm }: Props = $props();

  const form = superForm(updateProfileForm, {
    validators: zodClient(updateProfileSchema),
    id: 'update-profile-form',
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

  const file = fileProxy(form, 'image');
</script>

<div class="flex max-w-lg flex-col gap-2.5">
  <form method="POST" enctype="multipart/form-data" action="?/updateProfileEvent" use:enhance>
    <Form.Field {form} name="image">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Profile Picture</Form.Label>
          <PhotoUploader bind:singleFile={$formData.image} />
          <input name={props.name} type="file" bind:files={$file} class="hidden" />
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
        Upload Photo
      </Form.Button>
    </div>
  </form>
</div>
