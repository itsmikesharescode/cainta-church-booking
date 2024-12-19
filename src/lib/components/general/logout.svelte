<script lang="ts">
  import { page } from '$app/state';
  import { toast } from 'svelte-sonner';
  import Button from '../ui/button/button.svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { invalidateAll } from '$app/navigation';

  let loader = $state(false);

  const handleLogout = async () => {
    if (!page.data.supabase) return;
    loader = true;
    const { error } = await page.data.supabase.auth.signOut();
    loader = false;
    if (error) return toast.error(error.message);

    toast.success('Thank you! comeback again.');
    await invalidateAll();
    return;
  };

  let open = $state(false);
</script>

<Button size="sm" onclick={() => (open = true)}>Log out</Button>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Confirm Logout?</AlertDialog.Title>
      <AlertDialog.Description>
        Are you sure you want to log out? You will need to log in again to access your account.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <Button onclick={() => (open = false)} size="sm" variant="outline">No</Button>
      <Button size="sm" onclick={handleLogout} disabled={loader} class="relative">
        {#if loader}
          <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
            <LoaderCircle class="size-4 animate-spin" />
          </div>
        {/if}
        Yes, please
      </Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
