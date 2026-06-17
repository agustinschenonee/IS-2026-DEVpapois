import { RecursoFactory } from './RecursoFactory';
import { supabase } from './supabase';
import { AuthService } from './AuthService';

export class AdminService {

    static async crearNuevoRecurso(adminId: string, tipo: 'SALA' | 'ESCRITORIO', datos: any) {
        const autorizado = await AuthService.esAdmin(adminId);

        if (!autorizado) {
            return { success: false, error: "Permisos insuficientes. Se requiere rol de Administrador." };
        }

        try {
            const nuevoRecurso = RecursoFactory.crearRecurso(tipo, { ...datos, disponible: datos.disponible ?? true });

            const { data, error } = await supabase
                .from('recursos')
                .insert([{
                    nombre: nuevoRecurso.nombre,
                    capacidad: nuevoRecurso.capacidad,
                    tipo,
                    imagen_url: datos.imagen_url,
                    descripcion: datos.descripcion,
                    amenities: datos.amenities || [],
                    mantenimiento: nuevoRecurso.mantenimiento,
                    horario_disponible: datos.horario_disponible,
                    disponible: true
                }])
                .select();

            if (error) throw error;
            return { success: true, recurso: data[0] };

        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    static async listarRecursos() {
        const { data, error } = await supabase
            .from('recursos')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;
        return data;
    }

    static async actualizarRecurso(adminId: string, recursoId: number, cambios: any) {
        const autorizado = await AuthService.esAdmin(adminId);
        if (!autorizado) {
            return { success: false, error: "Permisos insuficientes. Se requiere rol de Administrador." };
        }

        const { data, error } = await supabase
            .from('recursos')
            .update(cambios)
            .eq('id', recursoId)
            .select();

        if (error) return { success: false, error: error.message };
        return { success: true, recurso: data[0] };
    }

    static async eliminarRecurso(adminId: string, recursoId: number) {
        const autorizado = await AuthService.esAdmin(adminId);
        if (!autorizado) {
            return { success: false, error: "Permisos insuficientes. Se requiere rol de Administrador." };
        }

        const { error } = await supabase
            .from('recursos')
            .delete()
            .eq('id', recursoId);

        if (error) return { success: false, error: error.message };
        return { success: true };
    }
}
