create or replace function reservation(
    p_church_id numeric,
    p_reference_id text,
    p_event_name text,
    p_number_of_guest numeric,
    p_date date,
    p_initial_time time,
    p_final_time time,
    p_message text
) returns void as $$
begin
    -- Check for existing reservations in the same time range for the same church
    if exists (
        select 1 
        from reservations_tb
        where church_id = p_church_id
        and date = p_date
        and (
            (initial_time, final_time) OVERLAPS (p_initial_time, p_final_time)
        )
    ) then
        raise exception 'Time slot is already taken for the selected date at this church';
    end if;

    -- If no collision, insert the new reservation
    insert into reservations_tb (
        user_id,
        church_id,
        reference_id,
        event_name,
        number_of_guest,
        date,
        initial_time,
        final_time,
        message
    ) values (
        auth.uid(),
        p_church_id,
        p_reference_id,
        p_event_name,
        p_number_of_guest,
        p_date,
        p_initial_time,
        p_final_time,
        p_message    
    );
end;
$$ language plpgsql;