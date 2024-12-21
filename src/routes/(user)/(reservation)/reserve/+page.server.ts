import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { reservationSchema } from './reservation-form/schema';
import { fail } from '@sveltejs/kit';
import { requestSchema } from './request-form/schema';

export const load: PageServerLoad = async () => {
  return {
    reservationForm: await superValidate(zod(reservationSchema)),
    requestForm: await superValidate(zod(requestSchema))
  };
};

export const actions: Actions = {
  reservationEvent: async ({ locals: { supabase, user }, request }) => {
    const form = await superValidate(request, zod(reservationSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  },

  requestEvent: async ({ locals: { supabase, user }, request }) => {
    const form = await superValidate(request, zod(requestSchema));

    if (!form.valid) return fail(400, { form });

    console.log(form.data);
  }
};
