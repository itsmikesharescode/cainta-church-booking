import { superValidate, withFiles } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updateInformationSchema } from './components/update-information/schema';
import { updateEmailSchema } from './components/update-email/schema';
import { updatePasswordSchema } from './components/update-password/schema';
import { fail, redirect } from '@sveltejs/kit';
import { updateProfileSchema } from './components/update-profile/schema';

export const load: PageServerLoad = async () => {
  return {
    updateProfileForm: await superValidate(zod(updateProfileSchema)),
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
  },
  updateProfileEvent: async ({ locals: { supabase, user, transformImage }, request }) => {
    const form = await superValidate(request, zod(updateProfileSchema));

    if (!form.valid) return fail(400, withFiles({ form }));
    if (!user) redirect(303, '/');

    const transformRes = await transformImage(form.data.image);

    if (!transformRes)
      return fail(401, withFiles({ form, msg: 'There is an error optimizing your photo.' }));

    const { data: uploadedObj, error: uploadErr } = await supabase.storage
      .from('profile_bucket')
      .upload(user.id, transformRes, { cacheControl: '3600', upsert: true });

    if (uploadErr) return fail(401, withFiles({ form, msg: uploadErr.message }));

    const { error: updateErr } = await supabase.auth.updateUser({
      data: {
        avatar_link: uploadedObj.fullPath
      }
    });

    if (updateErr) return fail(401, withFiles({ form, msg: updateErr.message }));

    return withFiles({ form, msg: 'Profile Successfully uploaded.' });
  }
};
