import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { adminDeletePaymentSchema } from './components/delete-payment/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const getAllPayments = async () => {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('finished_payments_tb')
      .select('*')
      .order('created_at');

    if (error) return null;

    return data;
  };

  return {
    deletePaymentForm: await superValidate(zod(adminDeletePaymentSchema)),
    allPayments: getAllPayments()
  };
};

export const actions = {
  deletePaymentEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(adminDeletePaymentSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('finished_payments_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Payment deleted successfully' };
  }
};
