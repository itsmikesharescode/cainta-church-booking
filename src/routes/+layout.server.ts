import type { LayoutServerLoad } from './$types';
import streamChurches from '$lib/db_calls/streamChurches';
import streamAccounts from '$lib/db_calls/streamAccounts';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin, supabase },
  cookies
}) => {
  const { session } = await safeGetSession();
  /* const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    'ef8410fe-ee17-48af-8744-03e913d01089',
    {
      user_metadata: {
        role: 'admin',
        firstname: 'Church',
        lastname: 'Admin',
        email: 'church_admin@gmail.com'
      }
    }
  );

  console.log(data, error?.message); */
  return {
    session,
    cookies: cookies.getAll(),
    getChurches: streamChurches(supabase),
    getAccounts: streamAccounts(supabase)
  };
};
