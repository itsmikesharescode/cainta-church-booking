import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { supabaseAdmin }, request }) => {
  const body = await request.json();
  console.log(body);
  if (body.status === 'PAID') {
    const parts = body.external_id.split('/');

    let reservationId: string | null = null;
    let certRequestId: string | null = null;
    const churchId = parts[2].split(':')[1] as string;
    const userId = parts[0].split(':')[1] as string;

    if (parts[2].split(':')[0] === 'reservation_id') {
      reservationId = parts[2].split(':')[1] as string;
    } else if (parts[2].split(':')[0] === 'cert_id') {
      certRequestId = parts[2].split(':')[1] as string;
    }

    const { error } = await supabaseAdmin.from('finished_payments_tb').insert({
      user_id: userId,
      church_id: churchId,
      reservation_id: reservationId,
      xendit_callback: body,
      cert_request_id: certRequestId
    });

    if (error) console.log(error);
  }

  return json({ status: 'success' });
};
