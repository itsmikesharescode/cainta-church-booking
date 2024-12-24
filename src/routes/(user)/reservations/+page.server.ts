import type { PageServerLoad } from './$types';

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
    myReservations: getReservations()
  };
};
