create or replace function is_admin() returns boolean as $$
begin
    return exists(
        select * from roles_tb where user_id = auth.uid() and role = 'admin'
    );
end;
$$ language plpgsql security definer;