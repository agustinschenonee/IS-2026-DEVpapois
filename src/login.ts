import { supabase } from './supabase'; 

const btnLogin = document.getElementById('btn-login');
const txtMensajeLogin = document.getElementById('mensaje-login');

btnLogin?.addEventListener('click', async () => {
    // 1. Capturamos y limpiamos espacios
    const emailVal = (document.getElementById('login-email') as HTMLInputElement).value.trim();
    const passVal = (document.getElementById('login-pass') as HTMLInputElement).value.trim();

    if (!emailVal || !passVal) {
        if (txtMensajeLogin) {
            txtMensajeLogin.innerText = "⚠️ Por favor, ingresá tu correo y contraseña.";
            txtMensajeLogin.style.color = "orange";
        }
        return;
    }

    if (txtMensajeLogin) {
        txtMensajeLogin.innerText = "⏳ Verificando credenciales...";
        txtMensajeLogin.style.color = "blue";
    }

    // 2. BUSCAMOS EN LA TABLA DE ADMINISTRACIÓN (Con los nombres nuevos)
    const { data: admin, error: errorAdmin } = await supabase
        .from('administracion') 
        .select('*')
        .eq('email', emailVal)
        .eq('password', passVal)
        .maybeSingle(); // Usamos maybeSingle para que no explote si no hay datos

    if (admin) {
        localStorage.setItem('usuario_nombre', admin.nombre);
        localStorage.setItem('usuario_email', emailVal);
        localStorage.setItem('rol', 'admin'); 
        irAlPanel(admin.nombre);
        return;
    }

    // 3. SI NO ES ADMIN, BUSCAMOS EN USUARIOS (Ajustá los nombres de columnas si hace falta)
    const { data: usuario } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', emailVal) // Si en Usuarios también se llama distinto, cambialo acá
        .eq('password', passVal)
        .maybeSingle();

    if (usuario) {
        localStorage.setItem('usuario_nombre', usuario.nombre);
        localStorage.setItem('usuario_email', emailVal);
        localStorage.setItem('rol', 'usuario');
        irAlPanel(usuario.nombre);
    } else {
        if (txtMensajeLogin) {
            txtMensajeLogin.innerText = "❌ Los datos no coinciden. Revisá e intentá de nuevo.";
            txtMensajeLogin.style.color = "red";
        }
    }
});

function irAlPanel(nombre: string) {
    if (txtMensajeLogin) {
        txtMensajeLogin.innerText = `✅ ¡Hola ${nombre}! Entrando al sistema...`;
        txtMensajeLogin.style.color = "green";
        
        setTimeout(() => {
            window.location.href = "panel.html";
        }, 1000);
    }
}
