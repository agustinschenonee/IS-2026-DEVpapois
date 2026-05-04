import { supabase } from './supabase';
declare global {
  interface Window {
    reservarTurno: (idTurno: number) => Promise<void>;
  }
}
async function cargarTurnosDisponibles() {
    // 1. Consultamos la tabla 'turnos' usando tus nombres exactos de columna
    const { data, error } = await supabase
        .from('turnos')
        .select('*')
        .eq('esta_reservado', false); // Solo los que están libres

    if (error) {
        console.error("Error al traer los turnos de la DB:", error.message);
        return;
    }

    const contenedor = document.getElementById('lista-turnos');
    
    if (contenedor && data) {
        contenedor.innerHTML = ""; 

        data.forEach(turno => {
            const card = document.createElement('div');
            // Un poco de estilo rápido para que no quede amontonado
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

// Ejecutamos al cargar
document.addEventListener('DOMContentLoaded', cargarTurnosDisponibles);
window.reservarTurno = async (idTurno: number) => {
    const confirmacion = confirm("¿Estás seguro que querés reservar este turno?");
    
    if (confirmacion) {
        const { data, error } = await supabase
            .from('turnos')
            .update({ 
                esta_reservado: true,
                confirmado: true 
            })
            .eq('id', idTurno);

        if (error) {
            alert("Error al reservar: " + error.message);
        } else {
            alert("¡Turno reservado con éxito! 🎉");
            location.reload();
        }
    }
};
