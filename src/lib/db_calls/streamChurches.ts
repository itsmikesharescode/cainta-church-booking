import type { Database } from '$lib/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

const streamChurches = async (supabase: SupabaseClient<Database>) => {
  if (!supabase) return null;

  const { data, error } = await supabase.from('churches_tb').select('*').order('created_at');

  if (error) return null;
  return data;
};

export default streamChurches;
