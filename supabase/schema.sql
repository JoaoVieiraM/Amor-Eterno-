-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security!
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for Pets
create table pets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  type text, -- 'dog', 'cat', etc.
  photo_url text
);

alter table pets enable row level security;

create policy "Users can view their own pets." on pets
  for select using (auth.uid() = user_id);

create policy "Users can insert their own pets." on pets
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own pets." on pets
  for update using (auth.uid() = user_id);

create policy "Users can delete their own pets." on pets
  for delete using (auth.uid() = user_id);

-- Create a table for Homenagens (Tributes)
create table homenagens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  pet_id uuid references pets on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  theme text not null,
  original_photo_url text,
  generated_image_url text, -- The AI generated image
  prompt_used text,
  is_public boolean default false
);

alter table homenagens enable row level security;

create policy "Users can view their own homenagens." on homenagens
  for select using (auth.uid() = user_id);

create policy "Public homenagens are viewable by everyone." on homenagens
  for select using (is_public = true);

create policy "Users can insert their own homenagens." on homenagens
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own homenagens." on homenagens
  for update using (auth.uid() = user_id);

-- Storage Bucket Setup (You might need to create this manually in dashboard if this SQL fails)
insert into storage.buckets (id, name, public) 
values ('homenagens', 'homenagens', true)
on conflict (id) do nothing;

create policy "Public Access to Homenagens" on storage.objects
  for select using ( bucket_id = 'homenagens' );

create policy "Authenticated users can upload homenagens" on storage.objects
  for insert with check (
    bucket_id = 'homenagens' and
    auth.role() = 'authenticated'
  );
