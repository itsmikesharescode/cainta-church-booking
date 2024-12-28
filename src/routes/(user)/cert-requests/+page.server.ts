import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { cancelRequestSchema } from './components/cancel-request/schema';
import { fail } from '@sveltejs/kit';
import { proceedPaymentSchema } from './components/proceed-payment/schema';
import type { CreateInvoiceRequest } from 'xendit-node/invoice/models';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  const getRequests = async () => {
    const { data, error } = await supabase
      .from('cert_requests_tb')
      .select('*')
      .eq('user_id', user?.id ?? '')
      .order('created_at');

    if (error) return null;
    return data;
  };

  return {
    proceedPaymentForm: await superValidate(zod(proceedPaymentSchema)),
    cancelRequestForm: await superValidate(zod(cancelRequestSchema)),
    myRequests: getRequests()
  };
};

export const actions: Actions = {
  cancelRequest: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(cancelRequestSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('cert_requests_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });
    return { form, msg: 'You have successfully cancel the request.' };
  },

  processPayment: async ({ locals: { user, xenditClient }, request, url }) => {
    const form = await superValidate(request, zod(proceedPaymentSchema));
    if (!form.valid) return fail(400, { form });
    if (!user) return fail(401, { form, msg: 'User not found' });

    const invoice: CreateInvoiceRequest = {
      externalId: `${user.id}/cert_id=${form.data.activeRow?.id}/${form.data.activeRow?.church_id}`,
      description: `Paying certificate for ${form.data.activeRow?.name} `,
      amount: form.data.activeRow?.price ?? 0,
      currency: 'PHP',
      customer: {
        givenNames: user?.user_metadata.firstname,
        surname: user?.user_metadata.lastname,
        email: user?.email,
        mobileNumber: user?.user_metadata.mobile_number
      },
      customerNotificationPreference: {
        invoicePaid: ['email', 'whatsapp', 'viber']
      },
      successRedirectUrl: `${url.origin}/payments`,
      failureRedirectUrl: `${url.origin}/cert-requests`
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
