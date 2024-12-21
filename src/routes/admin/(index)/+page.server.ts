import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createChurchSchema } from './components/create-church/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    createChurchForm: await superValidate(zod(createChurchSchema))
  };
};

export const actions: Actions = {
  createChurchEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(createChurchSchema));

    if (!form.valid) return fail(400, { form });
    console.log(form.data);
  }
};
