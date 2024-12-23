<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { reservationSchema, type ReservationSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import Button from '$lib/components/ui/button/button.svelte';
  import ComboBox from '$lib/components/general/combo-box.svelte';
  import DatePicker from '$lib/components/general/date-picker.svelte';
  import { createTimeRange } from '$lib/utils';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import type { Database } from '$lib/database.types';

  interface Props {
    reservationForm: SuperValidated<Infer<ReservationSchema>>;
    churchData: Database['public']['Tables']['churches_tb']['Row'];
  }

  const { reservationForm, churchData }: Props = $props();

  const form = superForm(reservationForm, {
    validators: zodClient(reservationSchema),
    id: 'reservation-form',
    onUpdate: ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" action="?/loginEvent" use:enhance>
  <Form.Field {form} name="event_name">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Event</Form.Label>
        <ComboBox
          placeholder="Search event offerings"
          searchPlaceholder="Search something..."
          emptySeachMsg="No item found"
          hasLabel={true}
          contentStyle="w-[300px] p-0"
          bind:selected={$formData.event_name}
          selections={(churchData.events as any)?.map((item: any) => ({
            label: item.name,
            value: item.price
          }))}
        />
        <input type="hidden" name={props.name} bind:value={$formData.event_name} />
      {/snippet}
    </Form.Control>

    <Form.FieldErrors />
  </Form.Field>

  <div class="grid gap-2.5 md:grid-cols-2">
    <Form.Field {form} name="date">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Reservation Date</Form.Label>
          <DatePicker bind:selected={$formData.date} />
          <input type="hidden" name={props.name} bind:value={$formData.date} />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="number_of_guest">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Number Of Guest</Form.Label>
          <Input
            type="number"
            {...props}
            bind:value={$formData.number_of_guest}
            placeholder="Enter number of guest"
          />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>
  </div>

  <div class="grid gap-2.5 md:grid-cols-2">
    <Form.Field {form} name="initial_time">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Start Time</Form.Label>
          <ComboBox
            placeholder="Select start time"
            searchPlaceholder="Search your time..."
            emptySeachMsg="No available time found"
            contentStyle="w-[300px] p-0"
            bind:selected={$formData.initial_time}
            selections={createTimeRange('10:00:00', '14:00:00')}
          />
          <input type="hidden" name={props.name} bind:value={$formData.initial_time} />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="final_time">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>End Time</Form.Label>
          <ComboBox
            placeholder="Select end time"
            searchPlaceholder="Search your time..."
            emptySeachMsg="No available time found"
            contentStyle="w-[300px] p-0"
            bind:selected={$formData.final_time}
            selections={createTimeRange('10:00:00', '14:00:00')}
          />
          <input type="hidden" name={props.name} bind:value={$formData.final_time} />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>
  </div>

  <Form.Field {form} name="message">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Message</Form.Label>

        <Textarea bind:value={$formData.message} placeholder="Enter your message ..." />
      {/snippet}
    </Form.Control>

    <Form.FieldErrors />
  </Form.Field>

  <div class=" flex items-center justify-end">
    <Form.Button size="sm" disabled={$submitting} class="relative">
      {#if $submitting}
        <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
          <LoaderCircle class="size-4 animate-spin" />
        </div>
      {/if}
      Create Reservation
    </Form.Button>
  </div>
</form>
