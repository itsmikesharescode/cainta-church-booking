import { superValidate, withFiles } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createChurchSchema } from './components/create-church/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    createChurchForm: await superValidate(zod(createChurchSchema))
  };
};

export const actions: Actions = {
  createChurchEvent: async ({ locals: { supabase, transformImage }, request }) => {
    const form = await superValidate(request, zod(createChurchSchema));

    if (!form.valid) return fail(400, { form });
    const uuid = crypto.randomUUID();
    const transformRes = await transformImage(form.data.image);

    if (!transformRes)
      return fail(401, withFiles({ form, msg: 'There is an error optimizing your photo.' }));

    const { data: uploadedObj, error: uploadErr } = await supabase.storage
      .from('church_bucket')
      .upload(uuid, transformRes, { cacheControl: '3600', upsert: true });

    if (uploadErr) return fail(401, withFiles({ form, msg: uploadErr.message }));

    const { error: insertErr } = await supabase.from('churches_tb').insert({
      name: form.data.name,
      events: JSON.parse(form.data.events),
      certs: JSON.parse(form.data.certs),
      photo_link: uploadedObj.fullPath,
      address: form.data.address,
      open_time: form.data.open_time,
      close_time: form.data.close_time
    });

    if (insertErr) return fail(401, withFiles({ form, msg: insertErr.message }));

    return withFiles({ form, msg: 'Church Successfully uploaded.' });
  }
};
