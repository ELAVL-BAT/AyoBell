-- =============================================
-- AyoBell Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Schools table
create table if not exists public.schools (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  logo_url text,
  created_at timestamptz default now()
);

-- 2. Bell schedules table
create table if not exists public.bell_schedules (
  id uuid default gen_random_uuid() primary key,
  school_id uuid references public.schools(id) on delete cascade not null,
  day_of_week int not null check (day_of_week between 0 and 6),
  time time not null,
  title text not null,
  sound_url text,
  created_at timestamptz default now()
);

-- 3. Bell sounds table
create table if not exists public.bell_sounds (
  id uuid default gen_random_uuid() primary key,
  school_id uuid references public.schools(id) on delete cascade not null,
  name text not null,
  file_url text not null,
  created_at timestamptz default now()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

alter table public.schools enable row level security;
alter table public.bell_schedules enable row level security;
alter table public.bell_sounds enable row level security;

-- Schools policies
create policy "Users can view own schools" on public.schools
  for select using (auth.uid() = user_id);

create policy "Users can create schools" on public.schools
  for insert with check (auth.uid() = user_id);

create policy "Users can update own schools" on public.schools
  for update using (auth.uid() = user_id);

create policy "Users can delete own schools" on public.schools
  for delete using (auth.uid() = user_id);

create policy "Public can view schools by slug" on public.schools
  for select using (true);

-- Bell schedules policies
create policy "Users can manage own schedules" on public.bell_schedules
  for all using (
    school_id in (select id from public.schools where user_id = auth.uid())
  );

create policy "Public can view schedules" on public.bell_schedules
  for select using (true);

-- Bell sounds policies
create policy "Users can manage own sounds" on public.bell_sounds
  for all using (
    school_id in (select id from public.schools where user_id = auth.uid())
  );

create policy "Public can view sounds" on public.bell_sounds
  for select using (true);

-- =============================================
-- Storage Buckets (create these manually in dashboard)
-- =============================================
-- 1. Create bucket "bell-sounds" (public)
-- 2. Create bucket "school-logos" (public)

-- Storage policies for bell-sounds bucket
-- (Run after creating the bucket)
create policy "Anyone can view bell sounds" on storage.objects
  for select using (bucket_id = 'bell-sounds');

create policy "Authenticated users can upload bell sounds" on storage.objects
  for insert with check (bucket_id = 'bell-sounds' and auth.role() = 'authenticated');

create policy "Users can delete own bell sounds" on storage.objects
  for delete using (bucket_id = 'bell-sounds' and auth.role() = 'authenticated');

-- Storage policies for school-logos bucket
create policy "Anyone can view school logos" on storage.objects
  for select using (bucket_id = 'school-logos');

create policy "Authenticated users can upload school logos" on storage.objects
  for insert with check (bucket_id = 'school-logos' and auth.role() = 'authenticated');

create policy "Users can update own school logos" on storage.objects
  for update using (bucket_id = 'school-logos' and auth.role() = 'authenticated');

create policy "Users can delete own school logos" on storage.objects
  for delete using (bucket_id = 'school-logos' and auth.role() = 'authenticated');
