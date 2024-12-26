create or replace function get_admin_dashboard_counts() returns jsonb as $$
begin
  return (
    select jsonb_agg(result)
    from (
      select 
        r.date,
        count(r.id) as total_reservations,
        count(c.id) as total_cert_requests
      from 
        reservations_tb r
      full outer join 
        cert_requests_tb c on r.date = c.date
      where 
        r.date >= date_trunc('month', current_date) and r.date < date_trunc('month', current_date) + interval '1 month'
      group by 
        r.date
      order by 
        r.date
    ) as result
  );
end;
$$ language plpgsql;