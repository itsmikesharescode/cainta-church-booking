import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { cancelReservationSchema } from './components/cancel-reservation/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  const getReservations = async () => {
    const { data, error } = await supabase
      .from('reservations_tb')
      .select('*')
      .eq('user_id', user?.id ?? '')
      .order('created_at');

    if (error) return null;
    return data;
  };

  return {
    cancelReservationForm: await superValidate(zod(cancelReservationSchema)),
    myReservations: getReservations()
  };
};

export const actions: Actions = {
  cancelReservation: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(cancelReservationSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('reservations_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });
    return { form, msg: 'You have successfully cancel the reservation.' };
  }
};
