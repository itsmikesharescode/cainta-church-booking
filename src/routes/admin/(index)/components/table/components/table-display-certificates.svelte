<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import type { Row } from '@tanstack/table-core';
  import { type DashboardPageTable } from '../data/schemas';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import Badge from '$lib/components/ui/badge/badge.svelte';

  let { row }: { row: Row<DashboardPageTable> } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="underline">View Contents</DropdownMenu.Trigger>
  <DropdownMenu.Content class="flex max-w-[300px] flex-wrap items-center gap-2.5 p-2">
    {#each row.original.certs as cert}
      <div class="">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Badge>{cert.name}</Badge>
            </Tooltip.Trigger>
            <Tooltip.Content class="flex flex-col">
              <span class="text-sm text-muted-foreground">
                ₱ {Number(cert.price).toLocaleString()}
              </span>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
