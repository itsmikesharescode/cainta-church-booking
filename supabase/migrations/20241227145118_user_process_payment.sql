create or replace function process_payment(
    user_id uuid,
    church_id numeric,
    reservation_id numeric,
    cert_request_id numeric,
    xendit_callback jsonb
) returns void as $$
begin
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
$$ language plpgsql;
