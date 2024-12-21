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
    import { superForm, fileProxy } from 'sveltekit-superforms'
    import { zodClient } from 'sveltekit-superforms/adapters'
    import { schema } from './schema.js'

    let { data } = $props();

    const { form, enhance, errors } = superForm(data.form, {
        validators: zodClient(schema)
    })

    const file = fileProxy(form, 'image')
    </script>

    <form method="POST" enctype="multipart/form-data" use:enhance>
        <PhotoUploader 
            bind:singleFile={$file}
        />
        {#if $errors.image}<span>{$errors.image}</span>{/if}
        <button>Submit</button>
    </form>
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
  {#if singleFile}
    <div class="relative flex flex-col items-center justify-center">
      <button
        onclick={() => (open = true)}
        class="absolute w-32 rounded-lg bg-secondary/50 text-center text-xs ring-red-500/50 hover:ring-2"
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
