<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import CalendarCheck from 'lucide-svelte/icons/calendar-check';
  import FileCheck2 from 'lucide-svelte/icons/file-check-2';
</script>

<section class="grid grid-cols-2 gap-x-5 gap-y-10">
  {#each Array(10) as _}
    <section class="flex flex-col gap-5">
      <div class="relative min-h-[300px] w-full rounded-lg bg-red-500"></div>
      <div class="flex flex-col gap-2.5">
        <div class="flex flex-col">
          <span class="text-xl">Lorem ipsum dolor sit amet consectetur</span>
          <span class="line-clamp-3 text-muted-foreground"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis numquam maxime placeat?
            Minus itaque ut sequi dolores, dolore error provident quibusdam ducimus eaque
            perspiciatis placeat veritatis pariatur at expedita officiis!</span
          >
        </div>

        <div class="flex items-center justify-end gap-2.5">
          <Button size="sm">
            <CalendarCheck />
            Reveserve Now!
          </Button>
          <Button size="sm">
            <FileCheck2 />
            Request Certificate
          </Button>
        </div>
      </div>
    </section>
  {/each}
</section>
