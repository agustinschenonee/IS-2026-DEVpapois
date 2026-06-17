import { supabase } from './supabase';

export async function verificarDisponibilidad(
    recursoId: number,
    fecha: string,
    horaInicio: string,
    horaFin: string
): Promise<boolean> {

    // 1. Turnos activos del recurso en esa fecha
    const { data: turnos, error: errorTurnos } = await supabase
        .from('turnos')
        .select('hora_inicio, hora_fin, estado')
        .eq('recurso_id', recursoId)
        .eq('fecha', fecha);

    if (errorTurnos) throw new Error("Error al consultar disponibilidad en Supabase");

    const hayConflicto = turnos
        .filter(t => t.estado === 'active')
        .some(t => (horaInicio < t.hora_fin) && (horaFin > t.hora_inicio));

    if (hayConflicto) return false;

    // 2. Bloqueos del admin para ese recurso (o bloqueos generales con recurso_id null)
    const { data: bloqueos, error: errorBloqueos } = await supabase
        .from('bloqueos')
        .select('id')
        .eq('fecha', fecha)
        .or(`recurso_id.eq.${recursoId},recurso_id.is.null`);

    if (errorBloqueos) throw new Error("Error al consultar bloqueos en Supabase");

    return bloqueos.length === 0;
}
