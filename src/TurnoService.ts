import { supabase } from './supabase';
import { verificarDisponibilidad } from './ValidadorOcupacion';

export class TurnoService {

    static async obtenerCalendario(recursoId: number, fecha: string) {
        const { data, error } = await supabase
            .from('turnos')
            .select('id, hora_inicio, hora_fin, estado, usuarios(nombre)')
            .eq('recurso_id', recursoId)
            .eq('fecha', fecha)
            .eq('estado', 'active')
            .order('hora_inicio', { ascending: true });

        if (error) throw error;
        return data;
    }

    static async listarPorUsuario(usuarioId: string) {
        const { data, error } = await supabase
            .from('turnos')
            .select('*, recursos(nombre, tipo, imagen_url)')
            .eq('usuario_id', usuarioId)
            .order('fecha', { ascending: true });

        if (error) throw error;
        return data;
    }

    static async reservarTurno(uId: string, rId: number, fecha: string, inicio: string, fin: string, notas?: string) {
        const libre = await verificarDisponibilidad(rId, fecha, inicio, fin);

        if (!libre) {
            return { success: false, message: "El horario ya no está disponible." };
        }

        const { data, error } = await supabase
            .from('turnos')
            .insert([{
                usuario_id: uId,
                recurso_id: rId,
                fecha,
                hora_inicio: inicio,
                hora_fin: fin,
                estado: 'active',
                notas: notas || null
            }])
            .select();

        if (error) return { success: false, message: error.message };

        return { success: true, data: data[0] };
    }

    static async cancelarTurno(turnoId: number, usuarioId: string) {
        const { data, error } = await supabase
            .from('turnos')
            .update({ estado: 'cancelled' })
            .eq('id', turnoId)
            .eq('usuario_id', usuarioId)
            .select();

        if (error) return { success: false, message: error.message };
        return { success: true, data: data[0] };
    }
}

