-- ========================================
-- CORE ENTITY TABLES
-- ========================================

create table services (
  slug text primary key,
  name text not null,
  icon text not null,
  category text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table service_tiers (
  slug text primary key,
  service_slug text not null references services(slug) on delete cascade,
  name text not null,
  price numeric(6,2) not null,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_service_tiers_service on service_tiers(service_slug);

create table carriers (
  slug text primary key,
  name text not null,
  price numeric(6,2),
  free_services text[] default '{}',
  perks boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table carrier_discounts (
  id serial primary key,
  carrier_slug text not null references carriers(slug) on delete cascade,
  service_tier_slug text not null,
  price numeric(6,2) not null,
  unique(carrier_slug, service_tier_slug)
);

create table cards (
  slug text primary key,
  name text not null,
  fee numeric(7,2) not null default 0,
  streaming_credit numeric(6,2),
  credit_services text[] default '{}',
  walmart_credit numeric(6,2),
  cashback_rate numeric(4,3),
  cashback_on text,
  disney_credit numeric(6,2),
  points_multiplier int,
  point_value numeric(5,4),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table verizon_perks (
  slug text primary key,
  name text not null,
  price numeric(6,2) not null,
  covers_services text[] default '{}',
  savings_vs_retail numeric(6,2) not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ========================================
-- MONITORING / AGENT SUPPORT TABLES
-- ========================================

create table data_sources (
  id serial primary key,
  name text not null,
  url text,
  entity_type text not null,
  entity_slug text not null,
  check_frequency_hours int default 168,
  last_checked_at timestamptz,
  last_changed_at timestamptz,
  status text default 'active',
  created_at timestamptz default now()
);

create table change_log (
  id serial primary key,
  data_source_id int references data_sources(id),
  entity_type text not null,
  entity_slug text not null,
  field_name text not null,
  old_value text,
  new_value text,
  change_type text not null,
  detected_at timestamptz default now(),
  applied boolean default false,
  applied_at timestamptz,
  notes text
);

create index idx_change_log_entity on change_log(entity_type, entity_slug);
create index idx_change_log_detected on change_log(detected_at desc);

-- ========================================
-- ROW LEVEL SECURITY
-- ========================================

alter table services enable row level security;
alter table service_tiers enable row level security;
alter table carriers enable row level security;
alter table carrier_discounts enable row level security;
alter table cards enable row level security;
alter table verizon_perks enable row level security;
alter table data_sources enable row level security;
alter table change_log enable row level security;

create policy "Public read services" on services for select using (true);
create policy "Public read service_tiers" on service_tiers for select using (true);
create policy "Public read carriers" on carriers for select using (true);
create policy "Public read carrier_discounts" on carrier_discounts for select using (true);
create policy "Public read cards" on cards for select using (true);
create policy "Public read verizon_perks" on verizon_perks for select using (true);

-- ========================================
-- AUTO-UPDATE TRIGGER
-- ========================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger services_updated_at before update on services
  for each row execute function update_updated_at();
create trigger service_tiers_updated_at before update on service_tiers
  for each row execute function update_updated_at();
create trigger carriers_updated_at before update on carriers
  for each row execute function update_updated_at();
create trigger cards_updated_at before update on cards
  for each row execute function update_updated_at();
create trigger verizon_perks_updated_at before update on verizon_perks
  for each row execute function update_updated_at();
