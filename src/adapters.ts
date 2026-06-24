// Adaptadores entre las filas de Supabase y los tipos que consume el AppContext del front

export function recursoToResource(row: any) {
    return {
        id: String(row.id),
        name: row.nombre,
        type: row.tipo === 'SALA' ? 'room' : 'desk',
        capacity: row.capacidad,
        isActive: row.disponible,
        imageUrl: row.imagen_url || '',
        amenities: row.amenities || [],
        description: row.descripcion || '',
    };
}

export function resourceToRecursoInsert(resource: any) {
    return {
        nombre: resource.name,
        tipo: resource.type === 'room' ? 'SALA' : 'ESCRITORIO',
        capacidad: resource.capacity,
        disponible: resource.isActive,
        imagen_url: resource.imageUrl,
        amenities: resource.amenities,
        descripcion: resource.description,
    };
}

export function turnoToReservation(row: any) {
    return {
        id: String(row.id),
        resourceId: String(row.recurso_id),
        date: row.fecha,
        startTime: row.hora_inicio,
        endTime: row.hora_fin,
        status: row.estado,
        notes: row.notas || undefined,
    };
}

export function bloqueoToBlock(row: any) {
    return {
        id: String(row.id),
        resourceId: row.recurso_id ? String(row.recurso_id) : 'all',
        date: row.fecha,
        reason: row.motivo,
    };
}
