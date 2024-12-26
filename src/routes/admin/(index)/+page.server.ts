import { superValidate, withFiles } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createChurchSchema } from './components/create-church/schema';
import { fail } from '@sveltejs/kit';
import { updateChurchSchema } from './components/update-church/schema';
import { deleteChurchSchema } from './components/delete-church/schema';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const getDashboardCounts = async () => {
    const { data, error } = (await supabase.rpc(
      'get_admin_dashboard_counts'
    )) as PostgrestSingleResponse<
      {
        date: string;
        total_reservations: number;
        total_cert_requests: number;
      }[]
    >;

    if (error) return null;

    return data;
  };

  return {
    adminDashboardCounts: getDashboardCounts(),
    createChurchForm: await superValidate(zod(createChurchSchema)),
    updateChurchForm: await superValidate(zod(updateChurchSchema)),
    deleteChurchForm: await superValidate(zod(deleteChurchSchema))
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
      .upload(uuid, transformRes, { cacheControl: '3600', upsert: false });

    if (uploadErr) return fail(401, withFiles({ form, msg: uploadErr.message }));

    const { error: insertErr } = await supabase.from('churches_tb').insert({
      name: form.data.name,
      description: form.data.description,
      events: JSON.parse(form.data.events),
      certs: JSON.parse(form.data.certs),
      photo_link: uploadedObj.fullPath,
      address: form.data.address,
      open_time: form.data.open_time,
      close_time: form.data.close_time
    });

    if (insertErr) return fail(401, withFiles({ form, msg: insertErr.message }));

    return withFiles({ form, msg: 'Church successfully uploaded.' });
  },

  updateChurchEvent: async ({ locals: { supabase, transformImage }, request }) => {
    const form = await superValidate(request, zod(updateChurchSchema));

    if (!form.valid) return fail(400, withFiles({ form }));
    const transformRes = await transformImage(form.data.image);

    if (!transformRes)
      return fail(401, withFiles({ form, msg: 'There is an error optimizing your photo.' }));

    const { data: uploadedObj, error: uploadErr } = await supabase.storage
      .from('church_bucket')
      .update(form.data.image_path.split('/')[1], transformRes); // extract the value in name/value;

    if (uploadErr) return fail(401, withFiles({ form, msg: uploadErr.message }));

    const { error: updateErr } = await supabase
      .from('churches_tb')
      .update({
        name: form.data.name,
        description: form.data.description,
        events: JSON.parse(form.data.events),
        certs: JSON.parse(form.data.certs),
        photo_link: uploadedObj.fullPath,
        address: form.data.address,
        open_time: form.data.open_time,
        close_time: form.data.close_time
      })
      .eq('id', form.data.id);

    if (updateErr) return fail(401, withFiles({ form, msg: updateErr.message }));

    return withFiles({ form, msg: 'Church successfully updated.' });
  },

  deleteChurchEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(deleteChurchSchema));

    if (!form.valid) return fail(400, { form });

    // Run both operations in parallel
    const [deleteStorageResult, deleteDbResult] = await Promise.all([
      supabase.storage.from('church_bucket').remove([form.data.image_path.split('/')[1]]),
      supabase.from('churches_tb').delete().eq('id', form.data.id)
    ]);

    // Check for errors in storage deletion
    if (deleteStorageResult.error) {
      return fail(401, { msg: deleteStorageResult.error.message });
    }

    // Check for errors in database deletion
    if (deleteDbResult.error) {
      return fail(401, { msg: deleteDbResult.error.message });
    }

    return { form, msg: 'Church successfully deleted.' };
  }
};
