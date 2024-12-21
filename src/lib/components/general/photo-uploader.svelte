<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import X from 'lucide-svelte/icons/x';
  import Images from 'lucide-svelte/icons/images';
  import Fullscreen from 'lucide-svelte/icons/fullscreen';

  interface Props {
    singleFile: File | undefined;
  }

  let { singleFile = $bindable() }: Props = $props();

  let singlePreview = $state<string | null>(null);

  const readSingleImage = () => {
    const reader = new FileReader();
    if (singleFile) {
      reader.onload = () => {
        singlePreview = reader.result as string;
      };

      reader.readAsDataURL(singleFile);
    }
  };

  $effect(() => {
    return () => {
      singleFile = undefined;
      singlePreview = null;
    };
  });

  let open = $state(false);
</script>

<!--@component
  Mike's photo uploader; it only returns a file object. You can use proxy of superforms
  https://superforms.rocks/concepts/files#file-uploads

  

  Example usage:
  ```svelte
  <script lang="ts">
    import * as Form from '$lib/components/ui/form/index.js';
    import { toast } from 'svelte-sonner';
    import { updateProfileSchema, type UpdateProfileSchema } from './schema';
    import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';
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

  ```
-->

<label
  class="group relative flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg border-2 border-dashed p-5 transition-all hover:border-black"
>
  <span class="absolute left-2 top-2 text-sm text-muted-foreground">Single Upload</span>
  <input
    disabled={!!singlePreview}
    onchange={readSingleImage}
    oninput={(e) => (singleFile = e.currentTarget.files?.item(0) as File)}
    type="file"
    class="hidden"
    accept="image/*"
  />
  {#if singleFile && !!singlePreview}
    <div class="relative flex flex-col items-center justify-center">
      <button
        onclick={() => (open = true)}
        class="absolute w-32 rounded-lg bg-secondary/50 text-center text-xs ring-red-500/50 hover:ring-2"
        type="button"
      >
        View Your Photo
      </button>
      <Fullscreen class="size-16 transition-all" />
    </div>

    <button
      onclick={() => {
        singleFile = undefined;
        singlePreview = null;
      }}
      type="button"
      class="flex items-center gap-1"
    >
      <span
        class="text-muted-foreground transition-all group-hover:underline group-active:scale-95"
      >
        Remove
      </span>
      <X class="size-5 text-muted-foreground" />
    </button>
  {:else}
    <Images class="size-16 transition-all group-active:scale-105" />
    <span class="text-muted-foreground transition-all group-hover:underline group-active:scale-95">
      Upload Image
    </span>
  {/if}
</label>

{#if !!singleFile}
  <Dialog.Root bind:open>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title
          >Viewing <span class="text-muted-foreground">{singleFile.name}</span></Dialog.Title
        >
        <Dialog.Description>
          Size: {singleFile.size}
          Type: {singleFile.type}
        </Dialog.Description>
      </Dialog.Header>

      <img src={singlePreview} alt={singleFile.name} />
    </Dialog.Content>
  </Dialog.Root>
{/if}
