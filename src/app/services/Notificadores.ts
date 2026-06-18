import { Observador } from './Observador';
import { supabase } from './supabase';

export class NotificadorEmail implements Observador {
    constructor(
        private destinatario?: string,
        private asunto: string = "Notificación de DevPapois"
    ) {}

    // "mensaje" acá ya viene como HTML completo y armado
    // (ver EmailTemplate.ts / generarHtmlReserva).
    actualizar(mensaje: string): void {
        console.log(`[NOTIFICACIÓN] enviando mail a ${this.destinatario}`);

        if (!this.destinatario) return;

        this.enviarEmail(mensaje).catch(err => {
            console.error("No se pudo enviar el email de notificación:", err);
        });
    }

    private async enviarEmail(html: string): Promise<void> {
        await supabase.functions.invoke('enviar-notificacion', {
            body: {
                to: this.destinatario,
                subject: this.asunto,
                html
            }
        });
    }
}