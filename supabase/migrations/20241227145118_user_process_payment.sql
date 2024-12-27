create or replace function process_payment(
    external_id text,
    xendit_callback jsonb
) returns void as $$
declare
    user_id uuid;
    reservation_id numeric;
    church_id numeric;
begin
    -- Extract user_id, reservation_id, and church_id from external_id
    user_id := split_part(external_id, '/', 1)::uuid;
    reservation_id := split_part(external_id, '/', 2)::numeric;
    church_id := split_part(external_id, '/', 3)::numeric;

    insert into finished_payments_tb (user_id, church_id, reservation_id, cert_request_id, xendit_callback)
    values (user_id, church_id, reservation_id, cert_request_id, xendit_callback);
    
    if(cert_request_id is not null) then
        update cert_requests_tb
        set status = 'paid'
        where id = cert_request_id;
    elsif(reservation_id is not null) then
        update reservations_tb
        set status = 'paid'
        where id = reservation_id;
    end if;

    exception
        when others then
            raise notice 'Error processing payment: %', sqlerrm;
end;
$$ language plpgsql security definer;