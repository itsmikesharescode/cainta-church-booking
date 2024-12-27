create or replace function process_payment(
    external_id text,
    xendit_callback jsonb
) returns void as $$
declare
    user_id uuid;
    reservation_id numeric;
    cert_request_id numeric;
    church_id numeric;
    id_part text;
begin
    -- Extract user_id and church_id from external_id
    user_id := split_part(external_id, '/', 1)::uuid;
    id_part := split_part(external_id, '/', 2);
    church_id := split_part(external_id, '/', 3)::numeric;

    -- Check if it's a reservation or certificate request
    if position('res_id=' in id_part) > 0 then
        reservation_id := replace(id_part, 'res_id=', '')::numeric;
        cert_request_id := null;
    elsif position('cert_id=' in id_part) > 0 then
        cert_request_id := replace(id_part, 'cert_id=', '')::numeric;
        reservation_id := null;
    end if;
    
    if cert_request_id is not null then
        insert into finished_payments_tb (user_id, church_id, cert_request_id, xendit_callback)
        values (user_id, church_id, cert_request_id, xendit_callback);
        update cert_requests_tb
        set status = 'paid'
        where id = cert_request_id;
    elsif reservation_id is not null then
        insert into finished_payments_tb (user_id, church_id, reservation_id, xendit_callback)
        values (user_id, church_id, reservation_id, xendit_callback);
        update reservations_tb
        set status = 'paid'
        where id = reservation_id;
    end if;

    exception
        when others then
            raise notice 'Error processing payment: %', sqlerrm;
end;
$$ language plpgsql security definer;