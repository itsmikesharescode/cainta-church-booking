import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { supabaseAdmin }, request }) => {
  const body = await request.json();

  const { data, error } = await supabaseAdmin.rpc('process_payment', {
    external_id: body.external_id,
    xendit_callback: body
  });

  console.log(data, error);

  return json({ status: 'success' });
};
