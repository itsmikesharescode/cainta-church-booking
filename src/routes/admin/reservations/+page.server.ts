import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { adminDeleteReservationSchema } from './components/delete-reservation/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const getReservations = async () => {
    const { data, error } = await supabase
      .from('reservations_tb')
      .select('*, users_tb(*)')
      .order('created_at');

    if (error) return null;
    return data;
  };

  return {
    adminDeleteReservationForm: await superValidate(zod(adminDeleteReservationSchema)),
    reservations: getReservations()
  };
};

export const actions: Actions = {
  deleteReservationEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(adminDeleteReservationSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('reservations_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Sucessfully deleted a reservation.' };
  }
};
