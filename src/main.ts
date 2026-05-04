import { Usuario } from './logic/Usuario';
import { supabase } from './supabase';

// 1. Referencias al HTML
const btnRegistrar = document.getElementById('btn-registrar') as HTMLButtonElement;
const inputNombre = document.getElementById('reg-nombre') as HTMLInputElement;
const inputDni = document.getElementById('reg-dni') as HTMLInputElement;
const inputEmail = document.getElementById('reg-email') as HTMLInputElement;
const inputPass = document.getElementById('reg-password') as HTMLInputElement;
const txtMensaje = document.getElementById('reg-mensaje') as HTMLParagraphElement;

// 2. Acción al hacer clic
btnRegistrar?.addEventListener('click', async () => {
    
    // Validamos usando tu lógica de la Tarjeta #19
    const userLogica = new Usuario(null, inputNombre.value, inputEmail.value, inputPass.value);

    // Verificamos: Nombre (min 2), Clave (min 4) y que el DNI no esté vacío
    if (userLogica.validarRegistro() && inputDni.value.trim() !== "") {
        txtMensaje.innerText = "⏳ Guardando en la base de la UCP...";
        txtMensaje.style.color = "blue";

        // 3. INSERCIÓN: Usamos los nombres exactos de image_c56034.png
        const { error } = await supabase.from('usuarios').insert([{
            "nombre": inputNombre.value,
            "DNI": inputDni.value,                 // Mayúsculas como en la tabla
            "Correo electrónico": inputEmail.value, // Espacio y acento como en la tabla
            "contraseña": inputPass.value,         // Minúscula
            "rol": 'cliente',
            "teléfono": "3764000000"               // Valor por defecto para evitar errores
        }]);

        if (error) {
            console.error("Detalle del error:", error);
            txtMensaje.innerText = "❌ Error: " + error.message;
            txtMensaje.style.color = "red";
        } else {
            txtMensaje.innerText = "✅ ¡Registro exitoso en DEVpapois!";
            txtMensaje.style.color = "green";
            limpiarCampos();
        }
    } else {
        txtMensaje.innerText = "⚠️ Datos inválidos: Nombre (min 2), Clave (min 4) y DNI obligatorio.";
        txtMensaje.style.color = "orange";
    }
});

function limpiarCampos() {
    inputNombre.value = "";
    inputDni.value = "";
    inputEmail.value = "";
    inputPass.value = "";
}
