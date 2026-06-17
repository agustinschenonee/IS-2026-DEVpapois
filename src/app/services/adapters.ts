import type { Resource, ResourceType, Reservation, Block } from '../context/AppContext';

export interface DbRecurso {
  id: number;
  nombre: string;
  tipo: 'SALA' | 'ESCRITORIO';
  capacidad: number;
  imagen_url: string | null;
  descripcion: string | null;
  amenities: string[] | null;
  disponible: boolean;
  mantenimiento: string | null;
  horario_disponible: string | null;
}

export interface DbTurno {
  id: number;
  recurso_id: number;
  usuario_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'active' | 'cancelled' | 'completed';
  notas: string | null;
  recursos?: { nombre: string; tipo: 'SALA' | 'ESCRITORIO'; imagen_url: string | null } | null;
}

export interface DbBloqueo {
  id: number;
  recurso_id: number | null;
  fecha: string;
  motivo: string;
}

export interface DbOcupacion {
  recurso_id: number;
  hora_inicio: string;
  hora_fin: string;
}

export interface OccupiedSlot {
  resourceId: string;
  startTime: string;
  endTime: string;
}

export function tipoToResourceType(tipo: 'SALA' | 'ESCRITORIO'): ResourceType {
  return tipo === 'SALA' ? 'room' : 'desk';
}

export function resourceTypeToTipo(type: ResourceType): 'SALA' | 'ESCRITORIO' {
  return type === 'room' ? 'SALA' : 'ESCRITORIO';
}

function recortarHora(hora: string): string {
  return (hora || '').slice(0, 5);
}

export function dbRecursoToResource(row: DbRecurso): Resource {
  return {
    id: String(row.id),
    name: row.nombre,
    type: tipoToResourceType(row.tipo),
    capacity: row.capacidad,
    isActive: row.disponible,
    imageUrl: row.imagen_url || '',
    amenities: row.amenities || [],
    description: row.descripcion || '',
  };
}

export function dbTurnoToReservation(row: DbTurno): Reservation {
  return {
    id: String(row.id),
    resourceId: String(row.recurso_id),
    date: row.fecha,
    startTime: recortarHora(row.hora_inicio),
    endTime: recortarHora(row.hora_fin),
    status: row.estado,
    notes: row.notas || undefined,
  };
}

export function dbBloqueoToBlock(row: DbBloqueo): Block {
  return {
    id: String(row.id),
    resourceId: row.recurso_id === null ? 'all' : String(row.recurso_id),
    date: row.fecha,
    reason: row.motivo,
  };
}

export function dbOcupacionToSlot(row: DbOcupacion): OccupiedSlot {
  return {
    resourceId: String(row.recurso_id),
    startTime: recortarHora(row.hora_inicio),
    endTime: recortarHora(row.hora_fin),
  };
}

export function resourceToDbInsert(res: Omit<Resource, 'id'>) {
  return {
    tipo: resourceTypeToTipo(res.type) as 'SALA' | 'ESCRITORIO',
    datos: {
      nombre: res.name,
      capacidad: res.capacity,
      imagen_url: res.imageUrl,
      descripcion: res.description,
      amenities: res.amenities,
      disponible: res.isActive,
    },
  };
}

export function resourceToDbUpdate(data: Partial<Resource>) {
  const cambios: Record<string, any> = {};
  if (data.name !== undefined) cambios.nombre = data.name;
  if (data.type !== undefined) cambios.tipo = resourceTypeToTipo(data.type);
  if (data.capacity !== undefined) cambios.capacidad = data.capacity;
  if (data.isActive !== undefined) cambios.disponible = data.isActive;
  if (data.imageUrl !== undefined) cambios.imagen_url = data.imageUrl;
  if (data.amenities !== undefined) cambios.amenities = data.amenities;
  if (data.description !== undefined) cambios.descripcion = data.description;
  return cambios;
}

export function blockToDbInsert(block: Omit<Block, 'id'>) {
  return {
    recursoId: block.resourceId === 'all' ? null : Number(block.resourceId),
    fecha: block.date,
    motivo: block.reason,
  };
}
