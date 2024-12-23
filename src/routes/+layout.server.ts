import type { LayoutServerLoad } from './$types';
import streamChurches from '$lib/db_calls/streamChurches';
import streamAccounts from '$lib/db_calls/streamAccounts';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin, supabase },
  cookies
}) => {
  const { session } = await safeGetSession();
  /* const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    'b4551a95-1341-44ad-ae96-09f43a798741',
    {
      user_metadata: {
        role: 'admin',
        firstname: 'Mike John',
        lastname: 'Eviota',
        email: 'localadmin@gmail.com'
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
