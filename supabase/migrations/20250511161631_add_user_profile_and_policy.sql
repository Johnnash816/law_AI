-- Create user_profile table that is linked to auth.users

create table "public"."user_profile" (
    "id" uuid not null default auth.uid(),
    "username" text not null default ''::text,
    "email" text not null default ''::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."user_profile" enable row level security;

CREATE UNIQUE INDEX user_profile_email_key ON public.user_profile USING btree (email);

CREATE UNIQUE INDEX user_profile_pkey ON public.user_profile USING btree (id);

alter table "public"."user_profile" add constraint "user_profile_pkey" PRIMARY KEY using index "user_profile_pkey";

alter table "public"."user_profile" add constraint "user_profile_email_key" UNIQUE using index "user_profile_email_key";

alter table "public"."user_profile" add constraint "user_profile_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_profile" validate constraint "user_profile_id_fkey";

grant delete on table "public"."user_profile" to "anon";

grant insert on table "public"."user_profile" to "anon";

grant references on table "public"."user_profile" to "anon";

grant select on table "public"."user_profile" to "anon";

grant trigger on table "public"."user_profile" to "anon";

grant truncate on table "public"."user_profile" to "anon";

grant update on table "public"."user_profile" to "anon";

grant delete on table "public"."user_profile" to "authenticated";

grant insert on table "public"."user_profile" to "authenticated";

grant references on table "public"."user_profile" to "authenticated";

grant select on table "public"."user_profile" to "authenticated";

grant trigger on table "public"."user_profile" to "authenticated";

grant truncate on table "public"."user_profile" to "authenticated";

grant update on table "public"."user_profile" to "authenticated";

grant delete on table "public"."user_profile" to "service_role";

grant insert on table "public"."user_profile" to "service_role";

grant references on table "public"."user_profile" to "service_role";

grant select on table "public"."user_profile" to "service_role";

grant trigger on table "public"."user_profile" to "service_role";

grant truncate on table "public"."user_profile" to "service_role";

grant update on table "public"."user_profile" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."user_profile"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."user_profile"
as permissive
for select
to public
using (true);



