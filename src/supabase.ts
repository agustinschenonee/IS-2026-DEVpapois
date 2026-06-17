import { createClient } from '@supabase/supabase-js';

// Las credenciales ahora vienen de variables de entorno (.env en la raíz del proyecto Vite)
// VITE_SUPABASE_URL=https://wybiblrhcphwuhrmgkhv.supabase.co
// VITE_SUPABASE_ANON_KEY=sb_publishable_tP0l_3gGWpQYnxci-Dn_-w_wdbl5AhM
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);
