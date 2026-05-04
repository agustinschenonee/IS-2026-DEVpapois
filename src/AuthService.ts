import { supabase } from '../lib/supabase';

export const registrarEnDB = async (usuario: Usuario) => {
  if (!usuario.validarRegistro()) throw new Error("Datos inválidos");

  const { data, error } = await supabase.auth.signUp({
    email: usuario.email,
    password: usuario.password,
    options: {
      data: { nombre_completo: usuario.nombre, rol: usuario.rol }
    }
  });
  return { data, error };
};
