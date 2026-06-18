import { supabase } from './supabase';
import { verificarDisponibilidad } from './ValidadorOcupacion';
import { NotificadorEmail } from './Notificadores';
import { generarHtmlReserva } from './EmailTemplate';

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
        return data || [];
    }

    static async obtenerOcupacionPorFecha(fecha: string): Promise<{ recurso_id: number; hora_inicio: string; hora_fin: string }[]> {
        const { data, error } = await supabase.rpc('obtener_ocupacion', { p_fecha: fecha });
        if (error) throw error;
        return data || [];
    }

    static async listarPorUsuario(usuarioId: string) {
        const { data, error } = await supabase
            .from('turnos')
            .select('*, recursos(nombre, tipo, imagen_url)')
            .eq('usuario_id', usuarioId)
            .order('fecha', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    static async listarTodos() {
        const { data, error } = await supabase
            .from('turnos')
            .select('*, recursos(nombre, tipo, imagen_url)')
            .order('fecha', { ascending: false })
            .order('hora_inicio', { ascending: false });

        if (error) throw error;
        return data || [];
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

        if (error) {
            if ((error as any).code === '23P01') {
                return { success: false, message: "El horario ya no está disponible." };
            }
            return { success: false, message: error.message };
        }

        // Disparamos el mail de confirmación sin esperar a que termine
        // (si la Edge Function todavía no está deployada, esto no rompe nada:
        // queda atrapado en el try/catch interno de notificar()).
        TurnoService.notificar(uId, rId, fecha, inicio, fin, 'reservada');

        return { success: true, data: data ? data[0] : null };
    }

    static async cancelarTurno(turnoId: number) {
        const { data, error } = await supabase
            .from('turnos')
            .update({ estado: 'cancelled' })
            .eq('id', turnoId)
            .select();

        if (error) return { success: false, message: error.message };

        if (!data || data.length === 0) {
            return { success: false, message: "No se pudo cancelar: turno no encontrado o sin permisos." };
        }

        const turno = data[0];
        TurnoService.notificar(turno.usuario_id, turno.recurso_id, turno.fecha, turno.hora_inicio, turno.hora_fin, 'cancelada');

        return { success: true, data: turno };
    }

    static async listarTodosConUsuarios() {
            const { data, error } = await supabase
                .from('turnos')
                .select('*, recursos(nombre), usuarios(nombre)')
                .order('fecha', { ascending: true });
            if (error) throw error;
            return data || [];
        }



    // Busca el mail del usuario y el nombre del recurso, y le pasa el HTML
    // ya armado al NotificadorEmail (patrón Observer) para que lo envíe.
    // Todo queda envuelto en try/catch a propósito: si falla (por ejemplo,
    // porque la Edge Function todavía no está deployada), reservar o cancelar
    // un turno NUNCA debe fallar por culpa del mail.
    private static async notificar(
        usuarioId: string,
        recursoId: number,
        fecha: string,
        inicio: string,
        fin: string,
        accion: 'reservada' | 'cancelada'
    ) {
        try {
            const [{ data: usuario }, { data: recurso }] = await Promise.all([
                supabase.from('usuarios').select('email, nombre').eq('id', usuarioId).single(),
                supabase.from('recursos').select('nombre').eq('id', recursoId).single()
            ]);

            if (!usuario?.email) return;

            const html = generarHtmlReserva({
                nombreUsuario: usuario.nombre || '',
                nombreRecurso: recurso?.nombre || 'un espacio',
                fecha,
                horaInicio: inicio,
                horaFin: fin,
                accion
            });

            const asunto = accion === 'reservada' ? 'Reserva confirmada - DevPapois' : 'Reserva cancelada - DevPapois';

            new NotificadorEmail(usuario.email, asunto).actualizar(html);
        } catch (e) {
            console.error('No se pudo enviar la notificación:', e);
        }
    }
}