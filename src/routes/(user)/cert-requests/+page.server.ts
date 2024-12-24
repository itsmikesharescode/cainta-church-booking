import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { cancelRequestSchema } from './components/cancel-request/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  const getRequests = async () => {
    const { data, error } = await supabase
      .from('cert_requests_tb')
      .select('*')
      .eq('user_id', user?.id ?? '')
      .order('created_at');

    if (error) return null;
    return data;
  };

  return {
    cancelRequestForm: await superValidate(zod(cancelRequestSchema)),
    myRequests: getRequests()
  };
};

export const actions: Actions = {
  cancelRequest: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(cancelRequestSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('cert_requests_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });
    return { form, msg: 'You have successfully cancel the request.' };
  }
};
