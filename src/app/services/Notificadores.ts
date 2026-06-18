import { Observador } from './Observador';

export class NotificadorEmail implements Observador {
    actualizar(mensaje: string): void {
        console.log(`[NOTIFICACIÓN] ${mensaje}`);
    }
}
