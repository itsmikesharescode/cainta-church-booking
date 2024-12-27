

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_admin_dashboard_counts"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."get_admin_dashboard_counts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
    return exists(
        select * from roles_tb where user_id = auth.uid() and role = 'admin'
    );
end;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_user"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
    return exists(
        select * from roles_tb where user_id = auth.uid() and role = 'user'
    );
end;
$$;


ALTER FUNCTION "public"."is_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_auth_user_created"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  role text;
begin
  role = new.raw_user_meta_data ->> 'role'; 

  insert into public.users_tb (user_id, user_meta_data)
  values (
    new.id,
    new.raw_user_meta_data
  );
  insert into public.roles_tb (user_id, role) values(new.id, role);
  return new;

end;
$$;


ALTER FUNCTION "public"."on_auth_user_created"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_auth_user_updated"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin

  update public.users_tb
  set user_meta_data = new.raw_user_meta_data
  where user_id = new.id;
  return new;

  update public.roles_tb
  set role = new.raw_user_meta_data ->> 'role'
  where user_id = new.id;
  return new;

end;
$$;


ALTER FUNCTION "public"."on_auth_user_updated"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reservation"("p_church_id" numeric, "p_reference_id" "text", "p_event_name" "text", "p_number_of_guest" numeric, "p_date" "date", "p_initial_time" time without time zone, "p_final_time" time without time zone, "p_message" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."reservation"("p_church_id" numeric, "p_reference_id" "text", "p_event_name" "text", "p_number_of_guest" numeric, "p_date" "date", "p_initial_time" time without time zone, "p_final_time" time without time zone, "p_message" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."cert_requests_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "price" numeric,
    "church_id" bigint NOT NULL,
    "reference_id" "text" NOT NULL,
    "date" "date" NOT NULL,
    "initial_time" time without time zone NOT NULL,
    "final_time" time without time zone NOT NULL,
    "status" character varying DEFAULT 'pending'::character varying NOT NULL
);


ALTER TABLE "public"."cert_requests_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."cert_requests_tb" IS 'list of requests';



ALTER TABLE "public"."cert_requests_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."cert_requests_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."churches_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "events" "jsonb" NOT NULL,
    "photo_link" "text" NOT NULL,
    "address" "text" NOT NULL,
    "open_time" time without time zone NOT NULL,
    "close_time" time without time zone NOT NULL,
    "certs" "jsonb" NOT NULL,
    "description" "text" NOT NULL
);


ALTER TABLE "public"."churches_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."churches_tb" IS 'list of church';



ALTER TABLE "public"."churches_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."churches_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."finished_payments_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "church_id" "uuid" NOT NULL,
    "reservation_id" "uuid",
    "xendit_callback" "jsonb" NOT NULL,
    "cert_request_id" "uuid"
);


ALTER TABLE "public"."finished_payments_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."finished_payments_tb" IS 'list of completed payments';



ALTER TABLE "public"."finished_payments_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."finished_payments_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."reservations_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "event_name" "text" NOT NULL,
    "number_of_guest" numeric NOT NULL,
    "date" "date" NOT NULL,
    "initial_time" time without time zone NOT NULL,
    "final_time" time without time zone NOT NULL,
    "reference_id" character varying NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" character varying DEFAULT 'pending'::character varying NOT NULL,
    "price" numeric,
    "church_id" bigint NOT NULL,
    "message" "text" NOT NULL
);


ALTER TABLE "public"."reservations_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."reservations_tb" IS 'list of reservation';



ALTER TABLE "public"."reservations_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."reservations_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."roles_tb" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role" character varying NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."roles_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."roles_tb" IS 'list of roles';



CREATE TABLE IF NOT EXISTS "public"."users_tb" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_meta_data" "jsonb" NOT NULL
);


ALTER TABLE "public"."users_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."users_tb" IS 'list of users';



ALTER TABLE ONLY "public"."cert_requests_tb"
    ADD CONSTRAINT "cert_requests_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."churches_tb"
    ADD CONSTRAINT "churches_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."finished_payments_tb"
    ADD CONSTRAINT "finished_payments_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reservations_tb"
    ADD CONSTRAINT "reservations_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles_tb"
    ADD CONSTRAINT "roles_tb_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."cert_requests_tb"
    ADD CONSTRAINT "cert_requests_tb_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cert_requests_tb"
    ADD CONSTRAINT "cert_requests_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_tb"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reservations_tb"
    ADD CONSTRAINT "reservations_tb_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reservations_tb"
    ADD CONSTRAINT "reservations_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_tb"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."roles_tb"
    ADD CONSTRAINT "roles_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow all if admin" ON "public"."cert_requests_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."finished_payments_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."reservations_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow delete if auth and exist" ON "public"."cert_requests_tb" FOR DELETE TO "authenticated" USING (("public"."is_user"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Allow delete if auth and exist" ON "public"."reservations_tb" FOR DELETE TO "authenticated" USING (("public"."is_user"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Allow insert if auth" ON "public"."cert_requests_tb" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_user"());



CREATE POLICY "Allow insert if auth" ON "public"."reservations_tb" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_user"());



CREATE POLICY "Allow select if admin" ON "public"."users_tb" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Allow select if auth and exist" ON "public"."cert_requests_tb" FOR SELECT TO "authenticated" USING (("public"."is_user"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Allow select if auth and exist" ON "public"."finished_payments_tb" FOR SELECT TO "authenticated" USING (("public"."is_user"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Allow update if auth and exist" ON "public"."cert_requests_tb" FOR UPDATE TO "authenticated" USING (("public"."is_user"() AND ("auth"."uid"() = "user_id"))) WITH CHECK (("public"."is_user"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Allow update if auth and exist" ON "public"."reservations_tb" FOR UPDATE TO "authenticated" USING (("public"."is_user"() AND ("auth"."uid"() = "user_id"))) WITH CHECK (("public"."is_user"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Select for all" ON "public"."churches_tb" FOR SELECT USING (true);



CREATE POLICY "Select for auth and exist" ON "public"."reservations_tb" FOR SELECT TO "authenticated" USING (("public"."is_user"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "allow all if admin" ON "public"."churches_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



ALTER TABLE "public"."cert_requests_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."churches_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."finished_payments_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reservations_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users_tb" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."get_admin_dashboard_counts"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_admin_dashboard_counts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_admin_dashboard_counts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "service_role";



GRANT ALL ON FUNCTION "public"."reservation"("p_church_id" numeric, "p_reference_id" "text", "p_event_name" "text", "p_number_of_guest" numeric, "p_date" "date", "p_initial_time" time without time zone, "p_final_time" time without time zone, "p_message" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."reservation"("p_church_id" numeric, "p_reference_id" "text", "p_event_name" "text", "p_number_of_guest" numeric, "p_date" "date", "p_initial_time" time without time zone, "p_final_time" time without time zone, "p_message" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."reservation"("p_church_id" numeric, "p_reference_id" "text", "p_event_name" "text", "p_number_of_guest" numeric, "p_date" "date", "p_initial_time" time without time zone, "p_final_time" time without time zone, "p_message" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."cert_requests_tb" TO "anon";
GRANT ALL ON TABLE "public"."cert_requests_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."cert_requests_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cert_requests_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cert_requests_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cert_requests_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."churches_tb" TO "anon";
GRANT ALL ON TABLE "public"."churches_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."churches_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."churches_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."churches_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."churches_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."finished_payments_tb" TO "anon";
GRANT ALL ON TABLE "public"."finished_payments_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."finished_payments_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."finished_payments_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."finished_payments_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."finished_payments_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."reservations_tb" TO "anon";
GRANT ALL ON TABLE "public"."reservations_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."reservations_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."reservations_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reservations_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reservations_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."roles_tb" TO "anon";
GRANT ALL ON TABLE "public"."roles_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."roles_tb" TO "service_role";



GRANT ALL ON TABLE "public"."users_tb" TO "anon";
GRANT ALL ON TABLE "public"."users_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."users_tb" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
