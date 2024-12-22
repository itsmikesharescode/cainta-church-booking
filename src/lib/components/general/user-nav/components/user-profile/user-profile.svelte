<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import Logout from '$lib/components/general/logout.svelte';
  import { page } from '$app/state';
  import { PUBLIC_SUPABASE_STORAGE } from '$env/static/public';
</script>

<Popover.Root>
  <Popover.Trigger class="group flex items-center gap-2.5">
    <Avatar.Root>
      <Avatar.Image
        src={`${PUBLIC_SUPABASE_STORAGE}/${page.data.user?.user_metadata.avatar_link}`}
        alt="profile photo"
      />
      <Avatar.Fallback class="border-2 border-muted-foreground"
        >{page.data.user?.user_metadata.firstname[0].toUpperCase()}</Avatar.Fallback
      >
    </Avatar.Root>

    <div class="">
      <span class="line-clamp-1 max-w-52 text-sm">
        Hello,
        {page.data.user?.user_metadata.firstname}
        {page.data.user?.user_metadata.lastname}
      </span>
    </div>
  </Popover.Trigger>
  <Popover.Content class="w-fit">
    <div class="flex items-center gap-2.5">
      <Avatar.Root class="size-28">
        <Avatar.Image
          src={`${PUBLIC_SUPABASE_STORAGE}/${page.data.user?.user_metadata.avatar_link}`}
          alt="profile photo"
        />
        <Avatar.Fallback class="border-2 border-muted-foreground"
          >{page.data.user?.user_metadata.firstname[0].toUpperCase()}</Avatar.Fallback
        >
      </Avatar.Root>

      <div class="flex flex-col gap-2.5">
        <div class="text-sm">
          <span class="line-clamp-1">
            {page.data.user?.user_metadata.firstname}
            {page.data.user?.user_metadata.lastname}
          </span>
          <span class="line-clamp-1 text-muted-foreground">
            {page.data.user?.email}
          </span>
        </div>
        <Logout />
      </div>
    </div>
  </Popover.Content>
</Popover.Root>
