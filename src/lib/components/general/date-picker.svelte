<script lang="ts">
  import CalendarIcon from 'lucide-svelte/icons/calendar';
  import { DateFormatter } from '@internationalized/date';
  import { cn } from '$lib/utils.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Calendar } from '$lib/components/ui/calendar/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';

  interface Props {
    selected: string;
  }

  let { selected = $bindable() }: Props = $props();

  const df = new DateFormatter('en-US', {
    dateStyle: 'long'
  });
</script>

<!--@component
  Mike's date picker; it only returns a selected in string

  Example usage:
  ```svelte
  <DatePicker 
    bind:selected={value}
  />
  ```
-->

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class={cn(
          'w-[240px] justify-start text-left font-normal',
          !selected && 'text-muted-foreground'
        )}
        {...props}
      >
        <CalendarIcon />
        {selected ? df.format(new Date(selected)) : 'Pick a date'}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0" align="start">
    <Calendar
      onValueChange={(v) => {
        selected = String(v);
      }}
      type="single"
    />
  </Popover.Content>
</Popover.Root>
