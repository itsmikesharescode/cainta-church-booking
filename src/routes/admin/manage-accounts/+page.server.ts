import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createAccountSchema } from './components/create-account/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    createAccountForm: await superValidate(zod(createAccountSchema))
  };
};

export const actions: Actions = {
  createAccountEvent: async ({ locals: { supabaseAdmin }, request }) => {
    const form = await superValidate(request, zod(createAccountSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email_confirm: true,
      email: form.data.email,
      password: form.data.password,
      user_metadata: {
        role: 'user',
        email: form.data.email,
        firstname: form.data.firstname,
        lastname: form.data.lastname,
        mobile_number: form.data.mobile_number
      }
    });

    if (error) return fail(401, { form, msg: error.message });
    return {
      form,
      msg: `Account for ${form.data.firstname} ${form.data.lastname} successfully created.`
    };
  }
};
