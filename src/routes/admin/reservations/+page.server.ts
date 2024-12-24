import type { PageServerLoad } from './$types';

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
    reservations: getReservations()
  };
};
