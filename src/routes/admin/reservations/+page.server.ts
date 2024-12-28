import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { adminDeleteReservationSchema } from './components/delete-reservation/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { adminApproveResSchema } from './components/view-user/components/approve-reservation/schema';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const getReservations = async () => {
    const { data, error } = await supabase
      .from('reservations_tb')
      .select('*, users_tb(*), churches_tb(*)')
      .order('created_at');

    if (error) return null;
    return data;
  };

  return {
    adminApproveReservationForm: await superValidate(zod(adminApproveResSchema)),
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
  },

  approveReservationEvent: async ({ locals: { supabase, sendEmail }, request }) => {
    const form = await superValidate(request, zod(adminApproveResSchema));

    if (!form.valid) return fail(400, { form });
    const { success } = await sendEmail({
      to: form.data.email,
      subject: 'Reservation Approved',
      html: `<p>Your Reservation has been approved. The price is ₱ ${form.data.price.toLocaleString()}. kindly visit <a href="https://cainta-church-booking.vercel.app">https://cainta-church-booking.vercel.app</a> to view your booking.</p>`
    });

    if (!success) return fail(401, { form, msg: 'There is something wrong with mailer.' });

    const { error } = await supabase
      .from('reservations_tb')
      .update({
        status: 'approved',
        price: form.data.price
      })
      .eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Reservation approved.' };
  }
};
