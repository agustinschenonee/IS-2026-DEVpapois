import { createClient } from '@supabase/supabase-js';

// Archivo: src/supabase.ts
const supabaseUrl = 'https://wybiblrhcphwuhrmgkhv.supabase.co'; 
const supabaseKey = 'sb_publishable_tP0l_3gGWpQYnxci-Dn_-w_wdbl5AhM'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
