import { supabase } from './supabase'; // Asegurate de que la ruta coincida con donde tenés tu supabase.ts

// Capturamos el botón y el párrafo de mensaje del HTML
const btnRegistrar = document.getElementById('btn-registrar');
const txtMensaje = document.getElementById('mensaje');

btnRegistrar?.addEventListener('click', async () => {
    // 1. Capturamos lo que el usuario escribió en el formulario
    const nombreVal = (document.getElementById('reg-nombre') as HTMLInputElement).value;
    const dniVal = (document.getElementById('reg-dni') as HTMLInputElement).value;
    const emailVal = (document.getElementById('reg-email') as HTMLInputElement).value;
    const passVal = (document.getElementById('reg-pass') as HTMLInputElement).value;

    // 2. Validación rápida para que no manden datos en blanco
    if (!nombreVal || !dniVal || !emailVal || !passVal) {
        if (txtMensaje) {
            txtMensaje.innerText = "⚠️ Por favor, completá todos los campos.";
            txtMensaje.style.color = "orange";
        }
        return;
    }

    if (txtMensaje) {
        txtMensaje.innerText = "⏳ Registrando usuario...";
        txtMensaje.style.color = "blue";
    }

    // 3. Enviamos los datos a Supabase con los NOMBRES EXACTOS de tu tabla
    const { error } = await supabase.from('Usuarios').insert([{
        "nombre": nombreVal,
        "DNI": dniVal,
        "Correo electrónico": emailVal,
        "contraseña": passVal
    }]);

    // 4. Manejamos la respuesta (éxito o error)
    if (txtMensaje) {
        if (error) {
            console.error("Detalle del error:", error);
            txtMensaje.innerText = "❌ Error: " + error.message;
            txtMensaje.style.color = "red";
        } else {
            txtMensaje.innerText = "✅ ¡Usuario registrado con éxito en DEVpapois!";
            txtMensaje.style.color = "green";
            
            // Limpiamos los campos para dejar el formulario listo de nuevo
            (document.getElementById('reg-nombre') as HTMLInputElement).value = "";
            (document.getElementById('reg-dni') as HTMLInputElement).value = "";
            (document.getElementById('reg-email') as HTMLInputElement).value = "";
            (document.getElementById('reg-pass') as HTMLInputElement).value = "";
        }
    }
});
