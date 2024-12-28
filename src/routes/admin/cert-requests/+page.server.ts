import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { adminDeleteCertSchema } from './components/delete-certificate/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { adminApproveCertSchema } from './components/view-user/components/approve-request/schema';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const getCertRequests = async () => {
    const { data, error } = await supabase
      .from('cert_requests_tb')
      .select('*, users_tb(*), churches_tb(*)')
      .order('created_at');

    if (error) return null;
    return data;
  };

  return {
    adminApproveCertForm: await superValidate(zod(adminApproveCertSchema)),
    adminDeleteCertForm: await superValidate(zod(adminDeleteCertSchema)),
    certRequests: getCertRequests()
  };
};

export const actions: Actions = {
  deleteCertEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(adminDeleteCertSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('cert_requests_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Sucessfully deleted a certificate request.' };
  },

  approveCertEvent: async ({ locals: { supabase, sendEmail }, request }) => {
    const form = await superValidate(request, zod(adminApproveCertSchema));

    if (!form.valid) return fail(400, { form });
    const { success } = await sendEmail({
      to: form.data.email,
      subject: 'Certificate Approved',
      html: `<p>Your Certificate has been approved. The price is ₱ ${form.data.price.toLocaleString()}. kindly visit <a href="https://cainta-church-booking.vercel.app">https://cainta-church-booking.vercel.app</a> to view your booking.</p>`
    });
    if (!success) return fail(401, { form, msg: 'There is something wrong with mailer.' });

    const { error } = await supabase
      .from('cert_requests_tb')
      .update({
        status: 'approved',
        price: form.data.price
      })
      .eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Certificate request approved.' };
  }
};
