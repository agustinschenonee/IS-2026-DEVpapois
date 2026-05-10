import { supabase } from './supabase';

export class AuthService {
    // Verificamos por EMAIL, que es lo que tenemos a mano al loguear
    static async esAdmin(email: string): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('rol')
                .eq('email', email)
                .single();

            if (error || !data) return false;
            return data.rol === 'admin';
        } catch (err) {
            return false;
        }
    }

    // Tu función de registro corregida
    static async registrarEnDB(usuario: any) {
        // 1. Registramos en la autenticación de Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: usuario.email,
            password: usuario.password,
        });

        if (authError) return { error: authError };

        // 2. ¡IMPORTANTE! Insertamos en nuestra tabla 'usuarios' 
        // para que aparezca en el Table Editor que estuvimos viendo
        const { data, error } = await supabase
            .from('usuarios')
            .insert([
                { 
                    nombre: usuario.nombre, 
                    email: usuario.email, 
                    password: usuario.password, // Solo si tu esquema lo pide, si no, sacalo
                    rol: usuario.rol || 'miembro' 
                }
            ]);

        return { data, error };
    }
}
