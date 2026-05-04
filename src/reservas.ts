import { supabase } from './supabase';

declare global {
  interface Window {
    reservarTurno: (idTurno: number) => Promise<void>;
  }
}

// 1. Función para saludar
function mostrarBienvenida() {
    const nombreGuardado = localStorage.getItem('usuario_nombre');
    const elementoSaludo = document.getElementById('saludo-usuario');
    
    if (elementoSaludo && nombreGuardado) {
        elementoSaludo.innerText = `¡Hola, ${nombreGuardado}! 👋`;
    }
}

// 2. Función para traer los turnos de Supabase
async function cargarTurnosDisponibles() {
    const { data, error } = await supabase
        .from('turnos')
        .select('*')
        .eq('esta_reservado', false);

    if (error) {
        console.error("Error al traer los turnos:", error.message);
        return;
    }

    const contenedor = document.getElementById('lista-turnos');
    if (contenedor && data) {
        contenedor.innerHTML = ""; 
        data.forEach(turno => {
            const card = document.createElement('div');
            card.style.border = "1px solid #444";
            card.style.padding = "15px";
            card.style.marginBottom = "10px";
            card.style.borderRadius = "10px";
            card.style.backgroundColor = "#f9f9f9";

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0; color: #333;">📅 Fecha: ${turno.fecha}</h4>
                        <p style="margin: 5px 0; font-size: 0.9em;">
                            ⏰ <strong>Horario:</strong> ${turno.hora_inicio} a ${turno.hora_fin || 'Fin no pactado'}<br>
                            👥 <strong>Capacidad:</strong> ${turno.cantidad_personas || 1} personas
                        </p>
                    </div>
                    <button onclick="reservarTurno(${turno.id})" 
                            style="background-color: #004a99; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        Reservar
                    </button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    }
}

// 3. Ejecutar todo al cargar la página (UN SOLO LISTENER)
document.addEventListener('DOMContentLoaded', () => {
    mostrarBienvenida();
    cargarTurnosDisponibles();
});

// 4. Lógica para el botón Reservar
window.reservarTurno = async (idTurno: number) => {
    // 1. Recuperamos el mail que guardamos en el Login
    const emailUsuario = localStorage.getItem('usuario_email');

    if (!emailUsuario) {
        alert("⚠️ No se encontró tu sesión. Por favor, volvé a ingresar.");
        window.location.href = "index/login-prueba.html";
        return;
    }

    const confirmacion = confirm("¿Estás seguro que querés reservar este turno?");
    
    if (confirmacion) {
        
        const { data, error } = await supabase
            .from('turnos')
            .update({ 
                esta_reservado: true,
                confirmado: true,
                usuario_email: emailUsuario // <--- ACÁ VINCULAMOS LA IDENTIDAD
            })
            .eq('id', idTurno);

        if (error) {
            alert("Error al reservar: " + error.message);
        } else {
            alert(`¡Turno reservado con éxito para ${emailUsuario}! 🎉`);
            location.reload();
        }
    }
};
