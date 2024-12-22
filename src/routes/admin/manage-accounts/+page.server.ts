import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createAccountSchema } from './components/create-account/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    createAccountForm: await superValidate(zod(createAccountSchema))
  };
};

export const actions: Actions = {
  createAccountEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(createAccountSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};
