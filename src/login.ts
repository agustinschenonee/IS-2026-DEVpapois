import { supabase } from './supabase'; 

const btnLogin = document.getElementById('btn-login');
const txtMensajeLogin = document.getElementById('mensaje-login');

btnLogin?.addEventListener('click', async () => {
    const emailVal = (document.getElementById('login-email') as HTMLInputElement).value.trim();
    const passVal = (document.getElementById('login-pass') as HTMLInputElement).value.trim();

    if (!emailVal || !passVal) {
        if (txtMensajeLogin) {
            txtMensajeLogin.innerText = "⚠️ Completá los datos.";
            txtMensajeLogin.style.color = "orange";
        }
        return;
    }

    if (txtMensajeLogin) txtMensajeLogin.innerText = "⏳ Verificando...";

    // 1. Intentamos en la tabla administracion
    const { data: admin } = await supabase
        .from('administracion') 
        .select('*')
        .eq('email', emailVal)
        .eq('password', passVal)
        .maybeSingle();

    if (admin) {
        loguear(admin.nombre, 'admin');
        return;
    }

    // 2. Si no es admin, intentamos en usuarios
    const { data: usuario } = await supabase
        .from('usuarios') 
        .select('*')
        .eq('email', emailVal)
        .eq('password', passVal)
        .maybeSingle();

    if (usuario) {
        loguear(usuario.nombre, 'usuario');
    } else {
        if (txtMensajeLogin) {
            txtMensajeLogin.innerText = "❌ Datos incorrectos.";
            txtMensajeLogin.style.color = "red";
        }
    }
});

function loguear(nombre: string, rol: string) {
    if (txtMensajeLogin) {
        txtMensajeLogin.innerText = `✅ ¡Hola ${nombre}! Entrando...`;
        txtMensajeLogin.style.color = "green";
        localStorage.setItem('usuario_nombre', nombre);
        localStorage.setItem('rol', rol);
        setTimeout(() => { window.location.href = "panel.html"; }, 1000);
    }
}
