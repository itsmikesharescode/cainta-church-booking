import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createAccountSchema } from './components/create-account/schema';
import { fail } from '@sveltejs/kit';
import { updateEmailSchema } from './components/update-account/update-email/schema';
import { updateInfoSchema } from './components/update-account/update-info/schema';
import { updatePasswordSchema } from './components/update-account/update-password/schema';
import { deleteAccountSchema } from './components/delete-account/schema';

export const load: PageServerLoad = async () => {
  return {
    createAccountForm: await superValidate(zod(createAccountSchema)),
    deleteAccountForm: await superValidate(zod(deleteAccountSchema)),
    updateEmailForm: await superValidate(zod(updateEmailSchema)),
    updateInfoForm: await superValidate(zod(updateInfoSchema)),
    updatePasswordForm: await superValidate(zod(updatePasswordSchema))
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
  },

  updateEmailEvent: async ({ locals: { supabaseAdmin }, request }) => {
    const form = await superValidate(request, zod(updateEmailSchema));
    if (!form.valid) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.user_id, {
      email: form.data.email,
      user_metadata: {
        email: form.data.email
      }
    });

    if (error) return fail(401, { form, msg: error.message });
    return { form, msg: 'An email has been sent to confirm the change.' };
  },

  updateInfoEvent: async ({ locals: { supabaseAdmin }, request }) => {
    const form = await superValidate(request, zod(updateInfoSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.user_id, {
      user_metadata: {
        firstname: form.data.firstname,
        lastname: form.data.lastname,
        mobile_number: form.data.mobile_number
      }
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Information successfully updated.' };
  },

  updatePasswordEvent: async ({ locals: { supabaseAdmin }, request }) => {
    const form = await superValidate(request, zod(updatePasswordSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.user_id, {
      password: form.data.password
    });

    if (error) return fail(401, { msg: error.message });

    return { form, msg: 'Password successfully updated.' };
  },

  deleteAccountEvent: async ({ locals: { supabaseAdmin }, request }) => {
    const form = await superValidate(request, zod(deleteAccountSchema));

    if (!form.valid) return fail(400, { form });

    const [deleteStorageResult, deleteUserResult] = await Promise.all([
      supabaseAdmin.storage.from('profile_bucket').remove([form.data.image_path.split('/')[1]]),
      supabaseAdmin.auth.admin.deleteUser(form.data.user_id)
    ]);

    if (deleteStorageResult.error) {
      return fail(401, { msg: deleteStorageResult.error.message });
    }

    if (deleteUserResult.error) {
      return fail(401, { msg: deleteUserResult.error.message });
    }

    return { form, msg: 'Account successfully deleted.' };
  }
};
