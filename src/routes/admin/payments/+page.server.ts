import type { PageServerLoad } from './$types';

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
    allPayments: getAllPayments()
  };
};
