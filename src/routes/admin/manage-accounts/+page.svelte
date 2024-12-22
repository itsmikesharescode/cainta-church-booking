<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import CreateAccount from './components/create-account/create-account.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { z } from 'zod';

  const { data } = $props();

  initTableState();
</script>

<main class="container min-h-screen py-10">
  {#await data.getAccounts}
    <div class="flex flex-col gap-2">
      <div class="flex justify-between">
        <Skeleton class="h-9 w-[110px]" />
        <div class="flex items-center gap-2.5">
          <Skeleton class="h-9 w-[300px]" />
          <Skeleton class="h-9 w-[110px]" />
        </div>
      </div>

      <div class="flex justify-end">
        <Skeleton class="h-9 w-[450px]" />
      </div>

      <Skeleton class="h-9 w-full" />
    </div>
  {:then accounts}
    <Table
      data={accounts?.map((acc) => ({
        user_id: acc.user_id,
        created_at: acc.created_at,
        user_meta_data: acc.user_meta_data,
        email: acc.user_meta_data.email,
        fullname: `${acc.user_meta_data.firstname} ${acc.user_meta_data.lastname}`,
        mobile_number: acc.user_meta_data.mobile_number
      })) ?? []}
      {columns}
    />
  {/await}
</main>

<CreateAccount createAccountForm={data.createAccountForm} />
