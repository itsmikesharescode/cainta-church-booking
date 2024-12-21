<script lang="ts">
  import PhotoUploader from '$lib/components/general/photo-uploader.svelte';

  let file = $state<File>();
</script>

<main class="min-h-screen">
  <div class="mx-auto max-w-[600px] p-10">
    <PhotoUploader bind:singleFile={file} />
  </div>
</main>
