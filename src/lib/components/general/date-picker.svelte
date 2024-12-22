<script lang="ts">
  import CalendarIcon from 'lucide-svelte/icons/calendar';
  import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date';
  import { cn } from '$lib/utils.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Calendar } from '$lib/components/ui/calendar/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  interface Props {
    selected: string;
  }

  let { selected = $bindable() }: Props = $props();

  const df = new DateFormatter('en-US', {
    dateStyle: 'long'
  });

  let value = $state<DateValue>();

  let open = $state(false);
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

<DropdownMenu.Root bind:open>
  <DropdownMenu.Trigger class="flex w-full items-center justify-start">
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
        {value ? df.format(value?.toDate(getLocalTimeZone())) : 'Pick a date'}
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-auto p-0">
    <Calendar
      bind:value
      onValueChange={(v) => {
        selected = String(v);
      }}
      type="single"
    />
  </DropdownMenu.Content>
</DropdownMenu.Root>
