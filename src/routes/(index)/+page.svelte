<script lang="ts">
  import { page } from '$app/state';
  import ForgotPassword from './components/forgot-password/forgot-password.svelte';
  import Login from './components/login/login.svelte';
  import Products from './components/products/products.svelte';
  import Register from './components/register/register.svelte';

  const { data } = $props();
</script>

<main class="container min-h-screen py-10">
  <Products />
</main>

{#if !page.data.user}
  <Login loginForm={data.loginForm} />
  <Register registerForm={data.registerForm} />
  <ForgotPassword forgotPasswordForm={data.forgotPasswordForm} />
{/if}
