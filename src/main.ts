import { Usuario } from './logic/Usuario';
import { supabase } from './supabase';

// 1. Seleccionamos los elementos del HTML
const btnRegistrar = document.getElementById('btn-registrar') as HTMLButtonElement;
const inputNombre = document.getElementById('reg-nombre') as HTMLInputElement;
const inputDni = document.getElementById('reg-dni') as HTMLInputElement; // Captura el DNI
const inputEmail = document.getElementById('reg-email') as HTMLInputElement;
const inputPass = document.getElementById('reg-password') as HTMLInputElement;
const txtMensaje = document.getElementById('reg-mensaje') as HTMLParagraphElement;

// 2. Escuchamos el evento de clic en el botón de registro
btnRegistrar?.addEventListener('click', async () => {
    
    // Creamos la instancia del usuario con los datos ingresados
    const nuevoUsuario = new Usuario(
        null, 
        inputNombre.value, 
        inputEmail.value, 
        inputPass.value
    );

    // 3. Validamos (Nombre min 2, Clave min 4 y que el DNI no esté vacío)
    if (nuevoUsuario.validarRegistro() && inputDni.value.trim() !== "") {
        txtMensaje.innerText = "⏳ Procesando registro en DEVpapois...";
        txtMensaje.style.color = "blue";

        // 4. Inserción en Supabase incluyendo la columna 'dni' para evitar el error de restricción NOT NULL
        const { error } = await supabase.from('usuarios').insert([{
            nombre: nuevoUsuario.nombre,
            dni: inputDni.value, // <--- Solución al error de "null value in column dni"
            email: nuevoUsuario.email,
            password: nuevoUsuario.password,
            rol: 'cliente'
        }]);

        if (error) {
            txtMensaje.innerText = "❌ Error de base de datos: " + error.message;
            txtMensaje.style.color = "red";
        } else {
            txtMensaje.innerText = "✅ ¡Usuario creado! Ya podés reservar sala.";
            txtMensaje.style.color = "green";
            limpiarCampos();
        }
    } else {
        // Mensaje de error si la validación local falla
        txtMensaje.innerText = "⚠️ Datos inválidos: DNI obligatorio, Nombre (min 2) y Clave (min 4).";
        txtMensaje.style.color = "red";
    }
});

/**
 * Limpia los campos del formulario tras un registro exitoso.
 */
function limpiarCampos() {
    inputNombre.value = "";
    inputDni.value = "";
    inputEmail.value = "";
    inputPass.value = "";
}
