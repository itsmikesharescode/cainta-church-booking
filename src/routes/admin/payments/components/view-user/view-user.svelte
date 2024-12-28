<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { useTableState } from '../table/tableState.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { PUBLIC_SUPABASE_STORAGE } from '$env/static/public';

  const tableState = useTableState();
  const activeRow = $derived(tableState.getActiveRow());

  const open = $derived(page.url.searchParams.get('modal') === 'view-user');

  const getUser = async () => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('users_tb')
      .select('*')
      .eq('user_id', activeRow?.user_id ?? 0)
      .single();

    if (error) return null;

    return data;
  };

  $effect(() => {
    if (open) {
      return () => {
        tableState.setActiveRow(null);
      };
    }
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={() => {
    tableState.setActiveRow(null);
    goto('/admin/payments');
  }}
  {open}
>
  <Dialog.Content class="">
    <Dialog.Header>
      <Dialog.Title>Viewing User Record</Dialog.Title>

      <Dialog.Description>User Record for <i>{activeRow?.reference_id}</i></Dialog.Description>

      {#await getUser()}
        <div class="flex items-center justify-center">
          <LoaderCircle class="size-4 animate-spin" />
        </div>
      {:then user}
        <div class="flex items-center gap-5">
          <Avatar.Root class="size-40 ">
            <Avatar.Image
              src={`${PUBLIC_SUPABASE_STORAGE}/${user?.user_meta_data.avatar_link}`}
              alt={user?.user_meta_data.firstname}
            />
            <Avatar.Fallback class=""
              >{user?.user_meta_data.firstname[0].toUpperCase()}</Avatar.Fallback
            >
          </Avatar.Root>

          <div class="">
            <span class="line-clamp-1 text-lg font-medium">
              {user?.user_meta_data.firstname}
              {user?.user_meta_data.lastname}
            </span>
            <span class="text-sm text-muted-foreground">
              {user?.user_meta_data.email}
            </span>
            <span class="text-sm text-muted-foreground">
              {user?.user_meta_data.mobile_number}
            </span>
          </div>
        </div>
      {/await}
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
