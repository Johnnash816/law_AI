-- Add user role enum type column to user_profile

create type "public"."user_role" as enum ('admin', 'normal');

alter table "public"."user_profile" add column "role" user_role not null default 'normal'::user_role;


