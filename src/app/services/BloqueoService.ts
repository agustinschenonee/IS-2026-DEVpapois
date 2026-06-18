import { supabase } from './supabase';
import { AuthService } from './AuthService';

export class BloqueoService {

    static async crearBloqueo(adminId: string, datos: { recursoId: number | null; fecha: string; motivo: string }) {
        const autorizado = await AuthService.esAdmin(adminId);
        if (!autorizado) {
            return { success: false, error: "Permisos insuficientes. Se requiere rol de Administrador." };
        }

        const { data, error } = await supabase
            .from('bloqueos')
            .insert([{
                recurso_id: datos.recursoId,
                fecha: datos.fecha,
                motivo: datos.motivo
            }])
            .select();

        if (error) return { success: false, error: error.message };
        return { success: true, bloqueo: data[0] };
    }

    static async listarBloqueos() {
        const { data, error } = await supabase
            .from('bloqueos')
            .select('*')
            .order('fecha', { ascending: true });

        if (error) throw error;
        return data;
    }

    static async eliminarBloqueo(adminId: string, bloqueoId: number) {
        const autorizado = await AuthService.esAdmin(adminId);
        if (!autorizado) {
            return { success: false, error: "Permisos insuficientes. Se requiere rol de Administrador." };
        }

        const { error } = await supabase
            .from('bloqueos')
            .delete()
            .eq('id', bloqueoId);

        if (error) return { success: false, error: error.message };
        return { success: true };
    }
}
