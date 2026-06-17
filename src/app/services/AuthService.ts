import { supabase } from './supabase';

export class AuthService {
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

    static async registrarEnDB(usuario: { nombre: string; email: string; password: string }) {
        const { data, error } = await supabase.auth.signUp({
            email: usuario.email,
            password: usuario.password,
            options: {
                data: { nombre: usuario.nombre }
            }
        });

        if (error) return { success: false, error: error.message };
        return { success: true, user: data.user, session: data.session };
    }

    static async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) {
            return { success: false, error: error?.message || "Credenciales inválidas." };
        }

        const { data: perfil, error: errorPerfil } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (errorPerfil || !perfil) {
            return { success: false, error: "No se encontró el perfil del usuario." };
        }

        return { success: true, user: data.user, perfil };
    }

    static async logout() {
        return supabase.auth.signOut();
    }

    static async usuarioActual() {
        const { data } = await supabase.auth.getSession();
        return data.session?.user ?? null;
    }

    static async obtenerSesionCompleta() {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user ?? null;
        if (!user) return null;

        const { data: perfil, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error || !perfil) return null;
        return { user, perfil };
    }

    static onAuthStateChange(callback: (event: string, session: any) => void) {
        return supabase.auth.onAuthStateChange(callback);
    }
}
