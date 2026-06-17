/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Usamos el ? para que no explote si import.meta.env no existe en GitHub Actions
// Y le pasamos strings falsos de "mock" por si está corriendo pruebas automatizadas sin el .env
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://proyecto-prueba.supabase.co';
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'llave-falsa-para-tests';

export const supabase = createClient(supabaseUrl as string, supabaseKey as string);
