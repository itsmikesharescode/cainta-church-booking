create or replace function get_user_church_reservations_data(
    church_id int8
) 
returns setof reservations_tb as $$
begin
    return query
    select *
    from reservations_tb r
    where r.church_id = get_user_church_reservations_data.church_id
    and r.date >= CURRENT_DATE
    order by r.date, r.initial_time;
end;
$$ language plpgsql;