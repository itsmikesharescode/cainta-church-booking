import type { PageServerLoad } from './$types';

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
    myPayments: getPayments()
  };
};
