import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { supabaseAdmin }, request }) => {
  const body = await request.json();
  console.log(body);
  if (body.status === 'PAID') {
    /* const { error } = await supabaseAdmin.rpc('xendit_cb', {
      xendit_callback_c: body,
      user_id_c: body.external_id.split('/')[0],
      booking_id_c: body.external_id.split('/')[1]
    });

    if (error) console.log(error); */
  }

  return json({ status: 'success' });
};
