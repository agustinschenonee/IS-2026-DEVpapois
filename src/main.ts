import { supabase } from './supabase';

console.log("🚀 Sistema DEVpapois iniciado");

const btn = document.getElementById('btn-registrar');
const msg = document.getElementById('mensaje');

btn?.addEventListener('click', async () => {
    // 1. Capturamos los datos
    const nombreVal = (document.getElementById('reg-nombre') as HTMLInputElement).value;
    const dniVal = (document.getElementById('reg-dni') as HTMLInputElement).value;
    const emailVal = (document.getElementById('reg-email') as HTMLInputElement).value;
    const passVal = (document.getElementById('reg-pass') as HTMLInputElement).value;

    // 2. Validación básica de campos vacíos
    if (!nombreVal || !dniVal || !emailVal || !passVal) {
        if (msg) {
            msg.innerText = "⚠️ Por favor, completá todos los campos.";
            msg.style.color = "orange";
        }
        return;
    }

    if (msg) msg.innerText = "⏳ Guardando datos...";

    // 3. INSERCIÓN: Mapeo exacto a las columnas de la imagen
    // Usamos comillas para "Correo electrónico" y "contraseña"
    const { error } = await supabase.from('Usuarios').insert([{
        "nombre": nombreVal,
        "DNI": dniVal,
        "Correo electrónico": emailVal,
        "contraseña": passVal
    }]);

    if (error) {
        console.error("Error detallado:", error);
        if (msg) {
            msg.innerText = "❌ Error: " + error.message;
            msg.style.color = "red";
        }
    } else {
        if (msg) {
            msg.innerText = "✅ ¡Registro exitoso!";
            msg.style.color = "green";
        }
        // Limpiamos los campos
        (document.getElementById('reg-nombre') as HTMLInputElement).value = "";
        (document.getElementById('reg-dni') as HTMLInputElement).value = "";
        (document.getElementById('reg-email') as HTMLInputElement).value = "";
        (document.getElementById('reg-pass') as HTMLInputElement).value = "";
    }
});
