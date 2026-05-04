import { Usuario } from './logic/Usuario'; // La clase que ya tiene los 19 verdes
import { supabase } from './supabase';    // Tu conexión a la base

// 1. Capturamos los elementos del HTML
const btnRegistrar = document.getElementById('btn-registrar') as HTMLButtonElement;
const inputNombre = document.getElementById('reg-nombre') as HTMLInputElement;
const inputEmail = document.getElementById('reg-email') as HTMLInputElement;
const inputPass = document.getElementById('reg-password') as HTMLInputElement;
const txtMensaje = document.getElementById('reg-mensaje') as HTMLParagraphElement;

// 

// 2. Escuchamos el clic del botón
btnRegistrar?.addEventListener('click', async () => {
    
    // Creamos el objeto con lo que Priscila (o el usuario) escribió
    const nuevoUsuario = new Usuario(
        null, 
        inputNombre.value, 
        inputEmail.value, 
        inputPass.value
    );

    // 3. Validamos con la lógica de la Tarjeta #19 (2 letras nombre, 4 clave)
    if (nuevoUsuario.validarRegistro()) {
        txtMensaje.innerText = "⏳ Procesando registro en DEVpapois...";
        txtMensaje.style.color = "blue";

        // 4. Mandamos a la base de datos real
        const { error } = await supabase.from('usuarios').insert([{
            nombre: nuevoUsuario.nombre,
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
        txtMensaje.innerText = "⚠️ Datos inválidos: Nombre (min 2) y Clave (min 4).";
        txtMensaje.style.color = "red";
    }
});

function limpiarCampos() {
    inputNombre.value = "";
    inputEmail.value = "";
    inputPass.value = "";
}
