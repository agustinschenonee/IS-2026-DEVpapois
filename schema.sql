-- Tabla de perfiles (id = mismo uuid que auth.users)
create table if not exists usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  email text not null unique,
  rol text not null default 'cliente' check (rol in ('admin', 'cliente'))
);

-- Tabla de recursos (salas y escritorios)
create table if not exists recursos (
  id bigint generated always as identity primary key,
  nombre text not null,
  tipo text not null check (tipo in ('SALA', 'ESCRITORIO')),
  capacidad int not null,
  imagen_url text,
  descripcion text,
  amenities text[] default '{}',
  disponible boolean not null default true,
  mantenimiento text,
  horario_disponible text
);

-- Tabla de turnos (reservas)
create table if not exists turnos (
  id bigint generated always as identity primary key,
  recurso_id bigint not null references recursos(id) on delete cascade,
  usuario_id uuid not null references usuarios(id) on delete cascade,
  fecha date not null,
  hora_inicio time not null,
  hora_fin time not null,
  estado text not null default 'active' check (estado in ('active', 'cancelled', 'completed')),
  notas text,
  constraint turnos_horario_valido check (hora_fin > hora_inicio)
);

-- Tabla de bloqueos
create table if not exists bloqueos (
  id bigint generated always as identity primary key,
  recurso_id bigint references recursos(id) on delete cascade, -- null = bloquea todos los recursos
  fecha date not null,
  motivo text not null
);

-- ============================================================
-- Anti doble-reserva a nivel de base de datos (no depende del front)
-- ============================================================
create extension if not exists btree_gist;

alter table turnos add column if not exists franja tsrange
  generated always as (tsrange((fecha + hora_inicio), (fecha + hora_fin), '[)')) stored;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'turnos_sin_solapamiento') then
    alter table turnos add constraint turnos_sin_solapamiento
      exclude using gist (
        recurso_id with =,
        franja with &&
      )
      where (estado = 'active');
  end if;
end $$;

-- ============================================================
-- Alta automática de perfil al registrarse (auth.users -> usuarios)
-- El rol SIEMPRE se fuerza a 'cliente' acá: nunca confiar en metadata
-- que mande el cliente para asignar 'admin'.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuarios (id, nombre, email, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    new.email,
    'cliente'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Ocupación pública (para pintar horarios tomados sin exponer quién reservó)
-- ============================================================
create or replace function public.obtener_ocupacion(p_fecha date)
returns table (recurso_id bigint, hora_inicio time, hora_fin time)
language sql
security definer
set search_path = public
as $$
  select recurso_id, hora_inicio, hora_fin
  from turnos
  where fecha = p_fecha and estado = 'active';
$$;

grant execute on function public.obtener_ocupacion(date) to anon, authenticated;

-- ============================================================
-- RLS
-- ============================================================
alter table usuarios enable row level security;
alter table recursos enable row level security;
alter table turnos enable row level security;
alter table bloqueos enable row level security;

drop policy if exists "usuarios_select_propio" on usuarios;
create policy "usuarios_select_propio" on usuarios for select using (auth.uid() = id);

drop policy if exists "usuarios_insert_propio" on usuarios;
create policy "usuarios_insert_propio" on usuarios for insert with check (auth.uid() = id);

drop policy if exists "recursos_select_publico" on recursos;
create policy "recursos_select_publico" on recursos for select using (true);

drop policy if exists "recursos_write_admin" on recursos;
create policy "recursos_write_admin" on recursos for all using (
  exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'admin')
);

drop policy if exists "turnos_select_propio_o_admin" on turnos;
create policy "turnos_select_propio_o_admin" on turnos for select using (
  usuario_id = auth.uid() or exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'admin')
);

drop policy if exists "turnos_insert_propio" on turnos;
create policy "turnos_insert_propio" on turnos for insert with check (usuario_id = auth.uid());

drop policy if exists "turnos_update_propio_o_admin" on turnos;
create policy "turnos_update_propio_o_admin" on turnos for update using (
  usuario_id = auth.uid() or exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'admin')
);

drop policy if exists "bloqueos_select_publico" on bloqueos;
create policy "bloqueos_select_publico" on bloqueos for select using (true);

drop policy if exists "bloqueos_write_admin" on bloqueos;
create policy "bloqueos_write_admin" on bloqueos for all using (
  exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'admin')
);
