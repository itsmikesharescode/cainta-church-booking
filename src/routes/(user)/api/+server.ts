import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { supabaseAdmin }, request }) => {
  const body = await request.json();

  if (body.status === 'PAID') {
    const parts = body.external_id.split('/');

    let reservationId: string | null = null;
    let certRequestId: string | null = null;
    const churchId = parts[2].split(':')[1] as string;
    const userId = parts[0].split(':')[1] as string;

    console.log(churchId, userId, reservationId, certRequestId);

    if (parts.length > 2) {
      if (parts[2].split(':')[0] === 'reservation_id') {
        reservationId = parts[2].split(':')[1] as string;
      } else if (parts[2].split(':')[0] === 'cert_id') {
        certRequestId = parts[2].split(':')[1] as string;
      }
    } else {
      console.log('Invalid external_id format:', body.external_id);
    }

    const { error } = await supabaseAdmin.rpc('process_payment', {
      user_id: userId,
      church_id: Number(churchId),
      reservation_id: reservationId ? Number(reservationId) : undefined,
      cert_request_id: certRequestId ? Number(certRequestId) : undefined,
      xendit_callback: body
    });

    if (error) console.log(error);
  }

  return json({ status: 'success' });
};
