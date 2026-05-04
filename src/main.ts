import { Usuario } from './logic/Usuario';
import { supabase } from './supabase';

// 1. "Enchufamos" los elementos del HTML al código
const btnRegistrar = document.getElementById('btn-registrar') as HTMLButtonElement;
const inputNombre = document.getElementById('reg-nombre') as HTMLInputElement;
const inputDni = document.getElementById('reg-dni') as HTMLInputElement; // <--- Nuevo: Captura el DNI
const inputEmail = document.getElementById('reg-email') as HTMLInputElement;
const inputPass = document.getElementById('reg-password') as HTMLInputElement;
const txtMensaje = document.getElementById('reg-mensaje') as HTMLParagraphElement;

// 2. Escuchamos el clic para registrar
btnRegistrar?.addEventListener('click', async () => {
    
    // Creamos el objeto Usuario con la lógica de la Tarjeta #19
    const nuevoUsuario = new Usuario(
        null, 
        inputNombre.value, 
        inputEmail.value, 
        inputPass.value
    );

    // 3. Validamos: Nombre (min 2), Clave (min 4) y que el DNI no esté vacío
    if (nuevoUsuario.validarRegistro() && inputDni.value.trim() !== "") {
        txtMensaje.innerText = "⏳ Guardando en la base de datos...";
        txtMensaje.style.color = "blue";

        // 4. MANDAMOS A SUPABASE (Incluyendo la columna 'dni')
        const { error } = await supabase.from('usuarios').insert([{
            nombre: nuevoUsuario.nombre,
            dni: inputDni.value, // <--- Esto soluciona el error de "null value"
            email: nuevoUsuario.email,
            password: nuevoUsuario.password,
            rol: 'cliente'
        }]);

        if (error) {
            txtMensaje.innerText = "❌ Error de Supabase: " + error.message;
            txtMensaje.style.color = "red";
        } else {
            txtMensaje.innerText = "✅ ¡Usuario creado con éxito!";
            txtMensaje.style.color = "green";
            limpiarCampos();
        }
    } else {
        txtMensaje.innerText = "⚠️ Datos incompletos: Nombre (min 2), Clave (min 4) y DNI son obligatorios.";
        txtMensaje.style.color = "red";
    }
});

// Función para limpiar el formulario
function limpiarCampos() {
    inputNombre.value = "";
    inputDni.value = "";
    inputEmail.value = "";
    inputPass.value = "";
}
