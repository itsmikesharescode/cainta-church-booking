import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './components/login/schema';
import { fail } from '@sveltejs/kit';
import { registerSchema } from './components/register/schema';
import { forgotPasswordSchema } from './components/forgot-password/schema';

export const load: PageServerLoad = async () => {
  return {
    loginForm: await superValidate(zod(loginSchema)),
    registerForm: await superValidate(zod(registerSchema)),
    forgotPasswordForm: await superValidate(zod(forgotPasswordSchema))
  };
};

export const actions: Actions = {
  loginEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) return fail(400, { form });

    const {
      data: { user },
      error
    } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: `Welcome back! ${user?.user_metadata.firstname}` };
  },

  registerEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(registerSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.auth.signUp({
      email: form.data.email,
      password: form.data.password,
      options: {
        data: {
          role: 'user',
          email: form.data.email,
          firstname: form.data.firstname,
          lastname: form.data.lastname,
          mobile_number: form.data.mobile_number
        }
      }
    });

    if (error) return fail(401, { msg: error.message });
    return { form, msg: `Please check your email ${form.data.email} for a verification link.` };
  },

  forgotPasswordEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(forgotPasswordSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.auth.resetPasswordForEmail(form.data.email);

    if (error)
      return fail(401, {
        form,
        msg: error.message
      });

    return {
      form,
      msg: 'An email containing the password reset link has been sent to your email.'
    };
  }
};
