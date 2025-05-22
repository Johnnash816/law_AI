-- Extension to perform http request e.g GET/POST within postgres
create extension if not exists pg_net with schema extensions;
-- Create pg vector extension, unlock vector datatype etc
create extension if not exists vector with schema extensions;

create table judgements (
  id bigint primary key generated always as identity,
  name text not null,
  storage_object_id uuid not null references storage.objects (id),
  created_by uuid not null references auth.users (id) default auth.uid(),
  created_at timestamp with time zone not null default now()
);

-- Create a view with the documents and corresponding storage path
create view judgements_with_storage_path
-- security_invoker=true: allow the view to be used in the security policy
-- without this the caller will have admin permissions ignoring all RLS policies
with (security_invoker=true)
as
  select judgements.*, storage.objects.name as storage_object_path
  from judgements
  join storage.objects
    on storage.objects.id = judgements.storage_object_id;

create table judgements_sections (
  id bigint primary key generated always as identity,
  judgement_id bigint not null references judgements (id) on delete cascade on update cascade,
  content text not null,
  embedding vector (1024) not null,
);

-- HNSW is better than IVFFlat because it can be created imeediately on empty tables
-- IVFFlat needs to have sufficient data in table when you create it to be useful
-- We use inner dot product over cosine distance because embeddings are normalised(same length)
create index on judgements_sections using hnsw (embedding vector_ip_ops);


-- For tables we need to enable RLS and then create policies, didn't need for bucket
alter table judgements enable row level security;
alter table judgements_sections enable row level security;

-- Judgements RLS policies
create policy "Admin users can insert judgements"
on judgements for insert to authenticated with check (
  owner = auth.uid()
  and exists (
    select 1 from user_profile 
    where id = auth.uid() 
    and role = 'admin'
  )
);

create policy "Any users can query any judgements"
on judgements for select to authenticated using (
  true
);

create policy "Admin users can update any judgements"
on judgements for update to authenticated using (
  exists (
    select 1 from user_profile 
    where id = auth.uid() 
    and role = 'admin'
  )
);

create policy "Admin users can delete any judgements"
on judgements for delete to authenticated using (
  exists (
    select 1 from user_profile 
    where id = auth.uid() 
    and role = 'admin'
  )
);

-- Judgements sections RLS policies
create policy "Admin Users can insert judgements sections"
on judgements_sections for insert to authenticated with check (
  judgement_id in (
    select id
    from judgements
    where created_by = auth.uid()
  )
);

create policy "Users can update any judgements sections"
on judgements_sections for update to authenticated using (
  exists (
    select 1 from user_profile 
    where id = auth.uid() 
    and role = 'admin'
  )
);

create policy "Users can query any judgements sections"
on judgements_sections for select to authenticated using (
  true
);

create policy "Admin Users can delete any judgements sections"
on judgements_sections for delete to authenticated using (
  exists (
    select 1 from user_profile 
    where id = auth.uid() 
    and role = 'admin'
  )
);