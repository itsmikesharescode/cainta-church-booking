<script lang="ts">
  import { page } from '$app/state';
  import UpdateEmail from './components/update-email/update-email.svelte';
  import UpdateInformation from './components/update-information/update-information.svelte';
  import UpdatePassword from './components/update-password/update-password.svelte';
  const { data } = $props();

  const selections = [
    {
      id: null,
      url: '/manage-account',
      name: 'Email'
    },
    {
      id: 'information',
      url: '/manage-account?switch=information',
      name: 'Information'
    },
    {
      id: 'password',
      url: '/manage-account?switch=password',
      name: 'Password'
    }
  ];
</script>

<main class="container flex min-h-screen flex-col gap-10 py-10 md:grid md:grid-cols-[1fr,4fr]">
  <section class="flex gap-2 md:flex-col">
    {#each selections as selection}
      <a
        href={selection.url}
        class="rounded-lg px-4 py-2 text-sm {page.url.searchParams.get('switch') === selection.id
          ? 'bg-secondary'
          : ''} ">{selection.name}</a
      >
    {/each}
  </section>

  <section>
    {#if page.url.searchParams.get('switch') === 'information'}
      <UpdateInformation updateInformationForm={data.updateInformationForm} />
    {:else if page.url.searchParams.get('switch') === 'password'}
      <UpdatePassword updatePasswordForm={data.updatePasswordForm} />
    {:else}
      <UpdateEmail updateEmailForm={data.updateEmailForm} />
    {/if}
  </section>
</main>
