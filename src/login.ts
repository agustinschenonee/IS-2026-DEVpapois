import { supabase } from './supabase'; // Ajustá la ruta según dónde tengas este archivo

// Asumimos que tu compañero va a crear estos IDs en el HTML del login
const btnLogin = document.getElementById('btn-login');
const txtMensajeLogin = document.getElementById('mensaje-login');

btnLogin?.addEventListener('click', async () => {
    // 1. Capturamos lo que el usuario escribió
    const emailVal = (document.getElementById('login-email') as HTMLInputElement).value;
    const passVal = (document.getElementById('login-pass') as HTMLInputElement).value;

    // Validación rápida
    if (!emailVal || !passVal) {
        if (txtMensajeLogin) {
            txtMensajeLogin.innerText = "⚠️ Por favor, ingresá tu correo y contraseña.";
            txtMensajeLogin.style.color = "orange";
        }
        return;
    }

    if (txtMensajeLogin) {
        txtMensajeLogin.innerText = "⏳ Verificando datos...";
        txtMensajeLogin.style.color = "blue";
    }

    // 2. La consulta a la base de datos (Acá ocurre la magia de verdad)
    const { data, error } = await supabase
        .from('Usuarios')
        .select('*') // Traemos toda la info de ese usuario
        .eq('Correo electrónico', emailVal) // Filtramos por el mail que escribió...
        .eq('contraseña', passVal)          // ...Y que la contraseña coincida
        .single(); // single() nos asegura que traiga un solo registro o tire error si no existe

    // 3. Manejamos la puerta: ¿Pasa o no pasa?
    if (error || !data) {
        // Si Supabase devuelve error, es porque no encontró esa combinación
        console.error("Intento fallido:", error?.message);
        if (txtMensajeLogin) {
            txtMensajeLogin.innerText = "❌ Correo o contraseña incorrectos.";
            txtMensajeLogin.style.color = "red";
        }
    } else {
        // Si hay 'data', el usuario es real y los datos están bien
        console.log("¡Usuario logueado exitosamente!", data);
        if (txtMensajeLogin) {
            // Usamos data.nombre para saludarlo por su nombre
            txtMensajeLogin.innerText = `✅ ¡Bienvenido de nuevo, ${data.nombre}! Entrando a DEVpapois...`;
            txtMensajeLogin.style.color = "green";
            
            // LA MAGIA: Esperamos 1 segundo para que lea el mensaje, y lo mandamos al panel
            setTimeout(() => {
                window.location.href = "panel.html";
            }, 1000);
        }
    }
});
