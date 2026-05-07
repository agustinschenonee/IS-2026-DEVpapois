import { supabase } from './supabase'; 

const btnLogin = document.getElementById('btn-login');
const txtMensajeLogin = document.getElementById('mensaje-login');

btnLogin?.addEventListener('click', async () => {
    // 1. Capturamos lo que escribió el usuario
    const emailVal = (document.getElementById('login-email') as HTMLInputElement).value;
    const passVal = (document.getElementById('login-pass') as HTMLInputElement).value;

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

    // 2. BUSCAMOS EN LA TABLA DE USUARIOS COMUNES
    let { data: usuario, error: errorUser } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('Correo electrónico', emailVal)
        .eq('contraseña', passVal)
        .single();

    if (usuario) {
        // Encontrado en Usuarios
        localStorage.setItem('usuario_nombre', usuario.nombre);
        localStorage.setItem('usuario_email', emailVal);
        localStorage.setItem('rol', 'usuario');
        irAlPanel(usuario.nombre);
        return;
    }

    // 3. BUSCAMOS EN LA TABLA DE ADMINISTRACIÓN (La de tu foto)
    let { data: admin, error: errorAdmin } = await supabase
        .from('Administración') 
        .select('*')
        .eq('Correo electrónico', emailVal)
        .eq('contraseña', passVal)
        .single();

    if (admin) {
        // Encontrado en Administración
        localStorage.setItem('usuario_nombre', admin.nombre);
        localStorage.setItem('usuario_email', emailVal);
        localStorage.setItem('rol', 'admin'); 
        irAlPanel(admin.nombre);
    } else {
        // No está en ninguna tabla
        if (txtMensajeLogin) {
            txtMensajeLogin.innerText = "❌ Correo o contraseña incorrectos.";
            txtMensajeLogin.style.color = "red";
        }
    }
});

// Función para mostrar el saludo y redireccionar
function irAlPanel(nombre: string) {
    if (txtMensajeLogin) {
        txtMensajeLogin.innerText = `✅ ¡Hola ${nombre}! Entrando...`;
        txtMensajeLogin.style.color = "green";
        
        setTimeout(() => {
            window.location.href = "panel.html";
        }, 1000);
    }
}
