import { createClient } from '@supabase/supabase-js';

// URL confirmada por tu captura
const supabaseUrl = 'https://wybiblrhcphwuhrmgkhv.supabase.co';

// Usá la clave que empieza con sb_publishable
const supabaseKey = 'sb_publishable_tP0l_3gGWpQYnxci-Dn_-w_wdbl5AhM';

export const supabase = createClient(supabaseUrl, supabaseKey);
