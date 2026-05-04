import { Usuario } from './logic/Usuario';
import { supabase } from './supabase';

// 1. Selección de elementos de la interfaz
const btnRegistrar = document.getElementById('btn-registrar') as HTMLButtonElement;
const inputNombre = document.getElementById('reg-nombre') as HTMLInputElement;
const inputDni = document.getElementById('reg-dni') as HTMLInputElement;
const inputEmail = document.getElementById('reg-email') as HTMLInputElement;
const inputPass = document.getElementById('reg-password') as HTMLInputElement;
const txtMensaje = document.getElementById('reg-mensaje') as HTMLParagraphElement;

// 2. Controlador del evento de Registro
btnRegistrar?.addEventListener('click', async () => {
    
    // Instanciamos la lógica (Tarjeta #19)
    const userLogica = new Usuario(
        null, 
        inputNombre.value, 
        inputEmail.value, 
        inputPass.value
    );

    // 3. Validación: Requisitos mínimos y DNI presente
    if (userLogica.validarRegistro() && inputDni.value.trim() !== "") {
        txtMensaje.innerText = "⏳ Registrando en el sistema...";
        txtMensaje.style.color = "#004a99";

        // 4. Inserción en la nueva tabla 'Usuarios'
        // Los nombres de las propiedades coinciden exactamente con las columnas SQL
        const { error } = await supabase.from('Usuarios').insert([{
            dni: inputDni.value,
            nombre: inputNombre.value,
            email: inputEmail.value,
            password: inputPass.value,
            rol: 'cliente'
        }]);

        if (error) {
            console.error("Error de Supabase:", error);
            txtMensaje.innerText = "❌ Error: " + error.message;
            txtMensaje.style.color = "red";
        } else {
            txtMensaje.innerText = "✅ ¡Registro exitoso! Ya podés iniciar sesión.";
            txtMensaje.style.color = "green";
            limpiarFormulario();
        }
    } else {
        txtMensaje.innerText = "⚠️ Datos inválidos: Revisá el DNI, Nombre (min 2) y Clave (min 4).";
        txtMensaje.style.color = "orange";
    }
});

/**
 * Limpia los campos de texto después de un registro exitoso.
 */
function limpiarFormulario() {
    [inputNombre, inputDni, inputEmail, inputPass].forEach(input => {
        input.value = "";
    });
}
