import { Usuario } from './logic/Usuario';
import { supabase } from './supabase';

console.log("🚀 main.ts cargado correctamente");

const btnRegistrar = document.getElementById('btn-registrar');

if (!btnRegistrar) {
    console.error("❌ ERROR: No se encontró el botón con ID 'btn-registrar'");
}

btnRegistrar?.addEventListener('click', async () => {
    console.log("🖱️ Clic detectado en el botón");

    const inputNombre = document.getElementById('reg-nombre') as HTMLInputElement;
    const inputDni = document.getElementById('reg-dni') as HTMLInputElement;
    const inputEmail = document.getElementById('reg-email') as HTMLInputElement;
    const inputPass = document.getElementById('reg-password') as HTMLInputElement;
    const txtMensaje = document.getElementById('reg-mensaje') as HTMLParagraphElement;

    const userLogica = new Usuario(null, inputNombre.value, inputEmail.value, inputPass.value);

    if (userLogica.validarRegistro() && inputDni.value.trim() !== "") {
        console.log("✅ Validación lógica pasada. Intentando insertar...");
        txtMensaje.innerText = "⏳ Conectando...";

        const { data, error } = await supabase.from('Usuarios').insert([{
            dni: inputDni.value,
            nombre: inputNombre.value,
            email: inputEmail.value,
            password: inputPass.value,
            rol: 'cliente'
        }]);

        if (error) {
            console.error("❌ ERROR DE SUPABASE:", error);
            txtMensaje.innerText = "Error: " + error.message;
        } else {
            console.log("🎉 Éxito:", data);
            txtMensaje.innerText = "✅ ¡Registrado!";
        }
    } else {
        console.warn("⚠️ Validación fallida: revisá los campos");
        txtMensaje.innerText = "⚠️ Datos inválidos";
    }
});
