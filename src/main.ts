import { Usuario } from './logic/Usuario';
import { supabase } from './supabase';

// 1. Capturamos los elementos del HTML
const btnRegistrar = document.getElementById('btn-registrar') as HTMLButtonElement;
const inputNombre = document.getElementById('reg-nombre') as HTMLInputElement;
const inputDni = document.getElementById('reg-dni') as HTMLInputElement; // <--- Línea clave
const inputEmail = document.getElementById('reg-email') as HTMLInputElement;
const inputPass = document.getElementById('reg-password') as HTMLInputElement;
const txtMensaje = document.getElementById('reg-mensaje') as HTMLParagraphElement;

// 2. Escuchamos el clic
btnRegistrar?.addEventListener('click', async () => {
    
    // Usamos la lógica de la Tarjeta #19 (Nombre min 2, Clave min 4)
    const nuevoUsuario = new Usuario(
        null, 
        inputNombre.value, 
        inputEmail.value, 
        inputPass.value
    );

    // Validamos localmente antes de gastar internet en Supabase
    if (nuevoUsuario.validarRegistro() && inputDni.value.trim() !== "") {
        txtMensaje.innerText = "⏳ Guardando en DEVpapois...";
        txtMensaje.style.color = "blue";

        // 3. MANDAMOS A SUPABASE (Ahora sí con el DNI incluido)
        const { error } = await supabase.from('usuarios').insert([{
            nombre: nuevoUsuario.nombre,
            dni: inputDni.value, // <--- Esto soluciona el error de "null value"
            email: nuevoUsuario.email,
            password: nuevoUsuario.password,
            rol: 'cliente'
        }]);

        if (error) {
            txtMensaje.innerText = "❌ Error de BD: " + error.message;
            txtMensaje.style.color = "red";
        } else {
            txtMensaje.innerText = "✅ ¡Usuario creado con éxito!";
            txtMensaje.style.color = "green";
            limpiarCampos();
        }
    } else {
        txtMensaje.innerText = "⚠️ Falta el DNI o los datos no cumplen el mínimo (Nombre 2, Clave 4).";
        txtMensaje.style.color = "red";
    }
});

function limpiarCampos() {
    inputNombre.value = "";
    inputDni.value = "";
    inputEmail.value = "";
    inputPass.value = "";
}
