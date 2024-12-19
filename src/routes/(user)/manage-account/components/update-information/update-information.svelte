<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { toast } from 'svelte-sonner';
  import { updateInformationSchema, type UpdateInformationSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { page } from '$app/state';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';

  interface Props {
    updateInformationForm: SuperValidated<Infer<UpdateInformationSchema>>;
  }

  const { updateInformationForm }: Props = $props();

  const form = superForm(updateInformationForm, {
    validators: zodClient(updateInformationSchema),
    id: 'update-information-form',
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

  $effect(() => {
    if (page.url.searchParams.get('switch') === 'information' && page.data.user) {
      $formData.firstname = page.data.user?.user_metadata.firstname;
      $formData.lastname = page.data.user?.user_metadata.lastname;
      $formData.mobile_number = page.data.user?.user_metadata.mobile_number;
    }

    return () => {
      form.reset();
    };
  });
</script>

<div class="flex max-w-lg flex-col gap-2.5">
  <form method="POST" action="?/updateInfoEvent" use:enhance>
    <div class="grid gap-2.5 md:grid-cols-2">
      <Form.Field {form} name="firstname">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>First Name</Form.Label>

            <Input
              {...props}
              bind:value={$formData.firstname}
              placeholder="Enter your first name"
            />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="lastname">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Last Name</Form.Label>

            <Input {...props} bind:value={$formData.lastname} placeholder="Enter your last name" />
          {/snippet}
        </Form.Control>

        <Form.FieldErrors />
      </Form.Field>
    </div>

    <Form.Field {form} name="mobile_number">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Mobile Number</Form.Label>

          <Input
            {...props}
            bind:value={$formData.mobile_number}
            placeholder="Enter your mobile number 0905..."
          />
        {/snippet}
      </Form.Control>

      <Form.FieldErrors />
    </Form.Field>

    <div class="flex justify-end">
      <Form.Button size="sm" disabled={$submitting} class="relative">
        {#if $submitting}
          <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
            <LoaderCircle class="size-4 animate-spin" />
          </div>
        {/if}
        Update Information
      </Form.Button>
    </div>
  </form>
</div>
