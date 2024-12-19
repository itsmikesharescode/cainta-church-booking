import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updateInformationSchema } from './components/update-information/schema';
import { updateEmailSchema } from './components/update-email/schema';
import { updatePasswordSchema } from './components/update-password/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    updateInformationForm: await superValidate(zod(updateInformationSchema)),
    updateEmailForm: await superValidate(zod(updateEmailSchema)),
    updatePasswordForm: await superValidate(zod(updatePasswordSchema))
  };
};

export const actions: Actions = {
  updateInfoEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(updateInformationSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.auth.updateUser({
      data: {
        firstname: form.data.firstname,
        lastname: form.data.lastname,
        mobile_number: form.data.mobile_number
      }
    });

    if (error) return fail(401, { msg: error.message });
    return { form, msg: 'Information updated successfully.' };
  },

  updateEmailEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(updateEmailSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.auth.updateUser({
      email: form.data.email
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'A confirmation email has been sent to your email please confirm.' };
  },

  updatePassEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(updatePasswordSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.auth.updateUser({
      password: form.data.password
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Password updated successfully.' };
  }
};
