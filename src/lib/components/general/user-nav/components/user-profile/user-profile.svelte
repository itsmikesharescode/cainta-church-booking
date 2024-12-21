<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import Logout from '$lib/components/general/logout.svelte';
  import { page } from '$app/state';
</script>

<Popover.Root>
  <Popover.Trigger class="group flex items-center gap-2.5">
    <Avatar.Root>
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
      <Avatar.Fallback>CN</Avatar.Fallback>
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
        <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
        <Avatar.Fallback>CN</Avatar.Fallback>
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
