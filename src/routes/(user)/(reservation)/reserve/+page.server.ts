import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { reservationSchema } from './reservation-form/schema';
import { fail } from '@sveltejs/kit';
import { requestSchema } from './request-form/schema';
import { createRefID, format24hrTo12hrAMPM } from '$lib/utils';

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
  reservationEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(reservationSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.rpc('reservation', {
      p_church_id: form.data.church_id,
      p_reference_id: createRefID(8),
      p_event_name: form.data.event_name,
      p_number_of_guest: form.data.number_of_guest,
      p_date: form.data.date,
      p_initial_time: form.data.initial_time,
      p_final_time: form.data.final_time,
      p_message: form.data.message
    });

    if (error) return fail(401, { form, msg: error.message });

    return {
      form,
      msg: `Successfully reserve ${form.data.event_name} at ${format24hrTo12hrAMPM(form.data.initial_time)} - ${format24hrTo12hrAMPM(form.data.final_time)} ${form.data.date}`
    };
  },

  requestEvent: async ({ locals: { supabase, user }, request }) => {
    const form = await superValidate(request, zod(requestSchema));

    if (!form.valid) return fail(400, { form });

    console.log(`${supabase}, ${user}`);
  }
};
