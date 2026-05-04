import { supabase } from './supabase';

export class AuthService {
    // Esta es la función que los tests están buscando
    static async esAdmin(usuarioId: number): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('rol')
                .eq('id', usuarioId)
                .single();

            if (error || !data) return false;
            return data.rol === 'admin';
        } catch (err) {
            return false;
        }
    }

    // Tu función original de registro
    static async registrarEnDB(usuario: any) {
        if (!usuario.validarRegistro()) throw new Error("Datos inválidos");

        const { data, error } = await supabase.auth.signUp({
            email: usuario.email,
            password: usuario.password,
            options: {
                data: { nombre_completo: usuario.nombre, rol: usuario.rol }
            }
        });
        return { data, error };
    }
}
