import { createClient } from '@supabase/supabase-js';

// URL de DEVpapois
const supabaseUrl = 'https://wybiblrhcphwuhrmgkhv.supabase.co';

// Usamos la nueva clave publishable (es la versión moderna de la 'anon' key)
const supabaseKey = 'sb_publishable_tP0l_3gGWpQYnxci-Dn_-w_wdbl5AhM';

export const supabase = createClient(supabaseUrl, supabaseKey);
