import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { reservationSchema } from './reservation-form/schema';
import { fail } from '@sveltejs/kit';
import { requestSchema } from './request-form/schema';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const params = url.searchParams.get('id');

  const getChurch = async () => {
    const { data, error } = await supabase
      .from('churches_tb')
      .select('*')
      .eq('id', Number(params))
      .order('created_at')
      .single();

    if (error) return null;

    return data;
  };

  return {
    reservationForm: await superValidate(zod(reservationSchema)),
    requestForm: await superValidate(zod(requestSchema)),
    getChurch: await getChurch()
  };
};

export const actions: Actions = {
  reservationEvent: async ({ locals: { supabase, user }, request }) => {
    const form = await superValidate(request, zod(reservationSchema));

    if (!form.valid) return fail(400, { form });

    console.log(`${supabase}, ${user}`);
  },

  requestEvent: async ({ locals: { supabase, user }, request }) => {
    const form = await superValidate(request, zod(requestSchema));

    if (!form.valid) return fail(400, { form });

    console.log(`${supabase}, ${user}`);
  }
};
