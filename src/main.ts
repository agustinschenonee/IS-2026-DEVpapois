import { Usuario } from './logic/Usuario';
import { supabase } from './supabase';

// 1. Referencias a la Interfaz
const btnRegistrar = document.getElementById('btn-registrar') as HTMLButtonElement;
const inputNombre = document.getElementById('reg-nombre') as HTMLInputElement;
const inputDni = document.getElementById('reg-dni') as HTMLInputElement;
const inputEmail = document.getElementById('reg-email') as HTMLInputElement;
const inputPass = document.getElementById('reg-password') as HTMLInputElement;
const txtMensaje = document.getElementById('reg-mensaje') as HTMLParagraphElement;
const contenedorUsuarios = document.getElementById('lista-usuarios') as HTMLDivElement;

// 2. Función para Cargar Usuarios (Igual que obtenerCalendario en turnos)
async function actualizarListaUsuarios() {
    const { data, error } = await supabase
        .from('Usuarios')
        .select('nombre, dni, email, rol')
        .order('id', { ascending: false });

    if (error) {
        console.error("Error al cargar lista:", error);
        return;
    }

    if (data) {
        contenedorUsuarios.innerHTML = '';
        if (data.length === 0) {
            contenedorUsuarios.innerHTML = '<p>No hay usuarios registrados.</p>';
            return;
        }

        data.forEach(u => {
            contenedorUsuarios.innerHTML += `
                <div class="user-item">
                    <div class="user-info">
                        <strong>${u.nombre}</strong><br>
                        <span>DNI: ${u.dni} | ${u.email}</span>
                    </div>
                    <div style="font-size: 0.8rem; background: #e2e8f0; padding: 4px 8px; border-radius: 5px;">
                        ${u.rol.toUpperCase()}
                    </div>
                </div>
            `;
        });
    }
}

// 3. Evento de Registro
btnRegistrar?.addEventListener('click', async () => {
    // Validamos con la lógica de la Tarjeta #19
    const userLogica = new Usuario(null, inputNombre.value, inputEmail.value, inputPass.value);

    if (userLogica.validarRegistro() && inputDni.value.trim() !== "") {
        txtMensaje.innerText = "⏳ Guardando...";
        txtMensaje.style.color = "blue";

        const { error } = await supabase.from('Usuarios').insert([{
            dni: inputDni.value,
            nombre: inputNombre.value,
            email: inputEmail.value,
            password: inputPass.value,
            rol: 'cliente'
        }]);

        if (error) {
            txtMensaje.innerText = "❌ Error: " + error.message;
            txtMensaje.style.color = "red";
        } else {
            txtMensaje.innerText = "✅ ¡Usuario registrado!";
            txtMensaje.style.color = "green";
            
            // Limpiar y ACTUALIZAR LA LISTA (Como en turnos)
            [inputNombre, inputDni, inputEmail, inputPass].forEach(i => i.value = "");
            actualizarListaUsuarios();
        }
    } else {
        txtMensaje.innerText = "⚠️ Datos inválidos (Nombre min 2, Clave min 4).";
        txtMensaje.style.color = "orange";
    }
});

// Carga inicial al abrir la web
actualizarListaUsuarios();
