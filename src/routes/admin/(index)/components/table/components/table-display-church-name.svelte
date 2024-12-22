<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import type { Row } from '@tanstack/table-core';
  import { type DashboardPageTable } from '../data/schemas';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { PUBLIC_SUPABASE_STORAGE } from '$env/static/public';

  let { row }: { row: Row<DashboardPageTable> } = $props();
</script>

<section class="flex items-center gap-2.5">
  <Avatar.Root>
    <Avatar.Image
      src={`${PUBLIC_SUPABASE_STORAGE}/${row.original.photo_link}`}
      alt="church photo"
    />
    <Avatar.Fallback>{row.original.name[0].toUpperCase()}</Avatar.Fallback>
  </Avatar.Root>
  <span class="line-clamp-2">{row.original.name}</span>
</section>
