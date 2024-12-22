import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
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
    cookies: cookies.getAll()
  };
};
