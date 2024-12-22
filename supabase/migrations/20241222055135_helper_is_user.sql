create or replace function is_user() returns boolean as $$
begin
    return exists(
        select * from roles_tb where user_id = auth.uid() and role = 'user'
    );
end;
$$ language plpgsql security definer;