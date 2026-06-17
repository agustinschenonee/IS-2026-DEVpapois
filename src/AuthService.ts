import { supabase } from './supabase';

export class AuthService {
    // Verificamos por ID (uuid de supabase auth), no por email
    static async esAdmin(userId: string): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('rol')
                .eq('id', userId)
                .single();

            if (error || !data) return false;
            return data.rol === 'admin';
        } catch (err) {
            return false;
        }
    }

    // Registro: alta en supabase.auth + perfil en tabla 'usuarios' (mismo id, sin password en texto plano)
    static async registrarEnDB(usuario: { nombre: string; email: string; password: string; rol?: string }) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: usuario.email,
            password: usuario.password,
        });

        if (authError || !authData.user) return { error: authError };

        const { data, error } = await supabase
            .from('usuarios')
            .insert([
                {
                    id: authData.user.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol || 'cliente'
                }
            ])
            .select();

        return { data, error };
    }

    static async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) return { success: false, error };

        const { data: perfil } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', data.user.id)
            .single();

        return { success: true, user: data.user, perfil };
    }

    static async logout() {
        return supabase.auth.signOut();
    }

    static async usuarioActual() {
        const { data } = await supabase.auth.getSession();
        return data.session?.user ?? null;
    }
}

