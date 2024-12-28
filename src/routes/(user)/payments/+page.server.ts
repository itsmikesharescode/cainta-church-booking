import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { deletePaymentSchema } from './components/delete-payment/schema';
import { fail, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  const getPayments = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('finished_payments_tb')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at');

    if (error) return null;

    return data;
  };

  return {
    deletePaymentForm: await superValidate(zod(deletePaymentSchema)),
    myPayments: getPayments()
  };
};

export const actions: Actions = {
  deletePaymentEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deletePaymentSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('finished_payments_tb').delete().eq('id', form.data.id);

    if (error) return fail(400, { form });

    return { form, msg: 'Payment deleted successfully' };
  }
};
