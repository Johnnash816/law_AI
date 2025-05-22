-- Create private schema, public schema is accessable on client side
-- private schema is accessable on server side only
create schema private;

-- Create bucket for files
insert into storage.buckets (id, name)
values ('judgements', 'judgements')
on conflict do nothing;

-- Function for checking if the text is a valid uuid
create or replace function private.uuid_or_null(str text)
returns uuid
language plpgsql
as $$
begin
  return str::uuid;
  exception when invalid_text_representation then
    return null;
  end;
$$;

create policy "Admin Users can upload files to judgements with owner as their uuid"
on storage.objects for insert to authenticated with check (
  bucket_id = 'judgements' 
  and owner = auth.uid()
  and exists (
    select 1 from user_profile 
    where id = auth.uid() 
    and role = 'admin'
  )
  -- Check if the first path token is a valid uuid
  -- Postgres SQL array indexing starts at 1
  and private.uuid_or_null(path_tokens[2]) is not null
);

create policy "Users can update files to judgements bucket if they are admin"
on storage.objects for update to authenticated using  (
  bucket_id = 'judgements' 
  and exists (
    select 1 from user_profile 
    where id = auth.uid() 
    and role = 'admin'
  )
);

create policy "Users can delete files from judgements bucket if they are admin"
on storage.objects for delete to authenticated using (
  bucket_id = 'judgements' 
  and exists (
    select 1 from user_profile 
    where id = auth.uid() 
    and role = 'admin'
  )
);

create policy "Authenticated users can view all files from judgements bucket"
on storage.objects for select to authenticated using (
  bucket_id = 'judgements'
);
