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
  notas text
);

-- Tabla de bloqueos (no existía en el backend original)
create table if not exists bloqueos (
  id bigint generated always as identity primary key,
  recurso_id bigint references recursos(id) on delete cascade, -- null = bloquea todos los recursos
  fecha date not null,
  motivo text not null
);

-- RLS
alter table usuarios enable row level security;
alter table recursos enable row level security;
alter table turnos enable row level security;
alter table bloqueos enable row level security;

-- usuarios: cada uno ve/edita su propio perfil
create policy "usuarios_select_propio" on usuarios for select using (auth.uid() = id);
create policy "usuarios_insert_propio" on usuarios for insert with check (auth.uid() = id);

-- recursos: lectura pública, escritura solo admin
create policy "recursos_select_publico" on recursos for select using (true);
create policy "recursos_write_admin" on recursos for all using (
  exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'admin')
);

-- turnos: el usuario ve y crea los suyos, admin ve todos
create policy "turnos_select_propio_o_admin" on turnos for select using (
  usuario_id = auth.uid() or exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'admin')
);
create policy "turnos_insert_propio" on turnos for insert with check (usuario_id = auth.uid());
create policy "turnos_update_propio_o_admin" on turnos for update using (
  usuario_id = auth.uid() or exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'admin')
);

-- bloqueos: lectura pública, escritura solo admin
create policy "bloqueos_select_publico" on bloqueos for select using (true);
create policy "bloqueos_write_admin" on bloqueos for all using (
  exists (select 1 from usuarios u where u.id = auth.uid() and u.rol = 'admin')
);
