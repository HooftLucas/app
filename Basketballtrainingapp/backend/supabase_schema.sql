-- Run this in Supabase SQL editor to create the 'oefeningen' table

create table if not exists oefeningen (
  id bigint generated always as identity primary key,
  titel text not null,
  doelgroep text not null,
  duur integer,
  categorie text,
  topics jsonb default '[]'::jsonb,
  positions jsonb default '[]'::jsonb,
  teaching_points jsonb default '[]'::jsonb,
  beschrijving text,
  diagram jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Optional: create index for faster lookups
create index if not exists idx_oefeningen_titel on oefeningen using gin (to_tsvector('simple', coalesce(titel, '')));
