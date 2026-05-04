import { Usuario } from './logic/Usuario';
import { supabase } from './supabase';

// Elementos de la interfaz
const btnRegistrar = document.getElementById('btn-registrar') as HTMLButtonElement;
const inputNombre = document.getElementById('reg-nombre') as HTMLInputElement;
const inputDni = document.getElementById('reg-dni') as HTMLInputElement;
const inputEmail = document.getElementById('reg-email') as HTMLInputElement;
const inputPass = document.getElementById('reg-password') as HTMLInputElement;
const txtMensaje = document.getElementById('reg-mensaje') as HTMLParagraphElement;
const contenedorUsuarios = document.getElementById('lista-usuarios') as HTMLDivElement;

// 1. FUNCIÓN PARA CARGAR LA LISTA (Igual que en turnos)
async function actualizarListaUsuarios() {
    try {
        const { data, error } = await supabase
            .from('Usuarios') // Verificá que en Supabase empiece con Mayúscula
            .select('nombre, dni, email, rol')
            .order('id', { ascending: false });

        if (error) throw error;

        if (data) {
            contenedorUsuarios.innerHTML = '';
            if (data.length === 0) {
                contenedorUsuarios.innerHTML = '<p style="color: gray;">No hay usuarios todavía.</p>';
            } else {
                data.forEach(u => {
                    contenedorUsuarios.innerHTML += `
                        <div style="background: white; margin-bottom: 8px; padding: 10px; border-radius: 8px; border-left: 4px solid #3ecf8e; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <strong>${u.nombre}</strong> <span style="font-size: 0.8rem; color: #64748b;">(DNI: ${u.dni})</span><br>
                            <small>${u.email}</small>
                        </div>
                    `;
                });
            }
        }
    } catch (err: any) {
        contenedorUsuarios.innerHTML = `<p style="color: red;">❌ Error de conexión: ${err.message}</p>`;
    }
}

// 2. EVENTO REGISTRAR
btnRegistrar?.addEventListener('click', async () => {
    const logica = new Usuario(null, inputNombre.value, inputEmail.value, inputPass.value);

    if (logica.validarRegistro() && inputDni.value.trim() !== "") {
        txtMensaje.innerText = "⏳ Registrando...";
        
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
            txtMensaje.innerText = "✅ ¡Registrado con éxito!";
            txtMensaje.style.color = "green";
            // Limpiar campos
            [inputNombre, inputDni, inputEmail, inputPass].forEach(i => i.value = "");
            // Refrescar lista automáticamente
            actualizarListaUsuarios();
        }
    } else {
        txtMensaje.innerText = "⚠️ Datos inválidos (Nombre min 2, Clave min 4)";
        txtMensaje.style.color = "orange";
    }
});

// Carga inicial
actualizarListaUsuarios();
