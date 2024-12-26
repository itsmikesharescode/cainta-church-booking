<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { toast } from 'svelte-sonner';
  import { requestSchema, type RequestSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import ComboBox from '$lib/components/general/combo-box.svelte';
  import type { Database } from '$lib/database.types';
  import { goto } from '$app/navigation';
  import DatePicker from '$lib/components/general/date-picker.svelte';
  import { createTimeRange } from '$lib/utils';

  interface Props {
    requestForm: SuperValidated<Infer<RequestSchema>>;
    churchData: Database['public']['Tables']['churches_tb']['Row'];
  }

  const { requestForm, churchData }: Props = $props();

  const form = superForm(requestForm, {
    validators: zodClient(requestSchema),
    id: 'request-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          await goto('/cert-requests');
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" action="?/requestEvent" use:enhance>
  <input type="hidden" name="church_id" value={churchData.id} />
  <div class="grid grid-cols-2 gap-2.5">
    <Form.Field {form} name="name">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Certificate Name</Form.Label>
          <!--Must update types soon-->
          <ComboBox
            placeholder="Select certificate"
            searchPlaceholder="Search something..."
            emptySeachMsg="No item found"
            hasLabel={true}
            contentStyle="w-[300px] sm:w-[450px] p-0"
            bind:selected={$formData.name}
            selections={(churchData.certs as any)?.map((item: any) => ({
              label: item.name,
              value: `${item.name}/${item.price}`
            }))}
          />
          <input type="hidden" name={props.name} bind:value={$formData.name} />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="date">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Request Date</Form.Label>
          <!--Must update types soon-->
          <DatePicker bind:selected={$formData.date} />
          <input type="hidden" name={props.name} bind:value={$formData.date} />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>
  </div>

  <div class="grid grid-cols-2 gap-2.5">
    <Form.Field {form} name="initial_time">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Initial Time</Form.Label>
          <!--Must update types soon-->
          <ComboBox
            placeholder="Select initial time"
            searchPlaceholder="Search your time..."
            emptySeachMsg="No time found"
            contentStyle="w-[300px] p-0"
            bind:selected={$formData.initial_time}
            selections={createTimeRange(churchData.open_time, churchData.close_time)}
          />
          <input type="hidden" name={props.name} bind:value={$formData.initial_time} />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="final_time">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Final Time</Form.Label>
          <!--Must update types soon-->
          <ComboBox
            placeholder="Select final time"
            searchPlaceholder="Search your time..."
            emptySeachMsg="No time found"
            contentStyle="w-[300px] p-0"
            bind:selected={$formData.final_time}
            selections={createTimeRange(churchData.open_time, churchData.close_time)}
          />
          <input type="hidden" name={props.name} bind:value={$formData.final_time} />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>
  </div>

  <div class=" flex items-center justify-end">
    <Form.Button size="sm" disabled={$submitting} class="relative">
      {#if $submitting}
        <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
          <LoaderCircle class="size-4 animate-spin" />
        </div>
      {/if}
      Create Request
    </Form.Button>
  </div>
</form>
