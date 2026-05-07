import { supabase } from './supabase'; 

const btnLogin = document.getElementById('btn-login');
const txtMensajeLogin = document.getElementById('mensaje-login');

btnLogin?.addEventListener('click', async () => {
    // 1. Capturamos lo que escribiste
    const emailVal = (document.getElementById('login-email') as HTMLInputElement).value.trim();
    const passVal = (document.getElementById('login-pass') as HTMLInputElement).value.trim();

    if (!emailVal || !passVal) {
        if (txtMensajeLogin) {
            txtMensajeLogin.innerText = "⚠️ Por favor, ingresá tu correo y contraseña.";
            txtMensajeLogin.style.color = "orange";
        }
        return;
    }

    // --- SECCIÓN DE CONTROL (Para ver en F12) ---
    console.log("Intentando entrar con Email:", emailVal);
    console.log("Intentando entrar con Pass:", passVal);

    if (txtMensajeLogin) {
        txtMensajeLogin.innerText = "⏳ Verificando en la base de datos...";
        txtMensajeLogin.style.color = "blue";
    }

    // 2. BUSCAMOS EN LA TABLA DE ADMINISTRACIÓN (La de tu foto)
    // Probamos primero con esta porque sos la admin
    const { data: admin, error: errorAdmin } = await supabase
        .from('Administración') 
        .select('*')
        .eq('Correo electrónico', emailVal)
        .eq('contraseña', passVal)
        .single();

    // --- SECCIÓN DE DEBUG ---
    if (errorAdmin) {
        console.warn("Aviso en tabla Administración:", errorAdmin.message);
    }
    console.log("Datos encontrados en Administración:", admin);

    if (admin) {
        localStorage.setItem('usuario_nombre', admin.nombre);
        localStorage.setItem('usuario_email', emailVal);
        localStorage.setItem('rol', 'admin'); 
        irAlPanel(admin.nombre);
        return; // Si te encontró acá, ya no busca en la otra
    }

    // 3. SI NO SOS ADMIN, BUSCAMOS EN LA TABLA DE USUARIOS
    let { data: usuario, error: errorUser } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('Correo electrónico', emailVal)
        .eq('contraseña', passVal)
        .single();

    if (usuario) {
        localStorage.setItem('usuario_nombre', usuario.nombre);
        localStorage.setItem('usuario_email', emailVal);
        localStorage.setItem('rol', 'usuario');
        irAlPanel(usuario.nombre);
    } else {
        if (txtMensajeLogin) {
            txtMensajeLogin.innerText = "❌ Correo o contraseña incorrectos.";
            txtMensajeLogin.style.color = "red";
        }
    }
});

function irAlPanel(nombre: string) {
    if (txtMensajeLogin) {
        txtMensajeLogin.innerText = `✅ ¡Hola ${nombre}! Entrando...`;
        txtMensajeLogin.style.color = "green";
        
        setTimeout(() => {
            window.location.href = "panel.html";
        }, 1000);
    }
}
