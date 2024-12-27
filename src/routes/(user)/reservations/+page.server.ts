import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { cancelReservationSchema } from './components/cancel-reservation/schema';
import { proceedPaymentSchema } from './components/proceed-payment/schema';
import { fail } from '@sveltejs/kit';
import type { CreateInvoiceRequest } from 'xendit-node/invoice/models';

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
    proceedPaymentForm: await superValidate(zod(proceedPaymentSchema)),
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
  },

  processPayment: async ({ locals: { user, xenditClient }, request, url }) => {
    const form = await superValidate(request, zod(proceedPaymentSchema));
    if (!form.valid) return fail(400, { form });
    if (!user) return fail(401, { form, msg: 'User not found' });

    const invoice: CreateInvoiceRequest = {
      externalId: `user_id:${user.id}/reservation_id=${form.data.activeRow?.id}/church_id:${form.data.activeRow?.church_id}`,
      description: `Paying reservation for ${form.data.activeRow?.event_name.split('/')[0]} `,
      amount: form.data.activeRow?.price ?? 0,
      currency: 'PHP',
      customer: {
        givenNames: user?.user_metadata.firstname,
        surname: user?.user_metadata.lastname,
        email: user?.email,
        mobileNumber: user?.user_metadata.mobile_number
      },
      customerNotificationPreference: {
        invoicePaid: ['email', 'whatsapp']
      },
      successRedirectUrl: `${url.origin}/payments`,
      failureRedirectUrl: `${url.origin}/reservations`
    };

    try {
      const res = await xenditClient.Invoice.createInvoice({ data: invoice });
      return { form, msg: 'Please wait for the payment to be processed.', res };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return fail(401, { form, msg: 'Something went wrong.' });
    }
  }
};
