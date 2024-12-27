import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { supabaseAdmin }, request }) => {
  const body = await request.json();

  const { error } = await supabaseAdmin.rpc('process_payment', {
    external_id: body.external_id,
    xendit_callback: body
  });

  if (error) console.log(error);

  return json({ status: 'success' });
};
