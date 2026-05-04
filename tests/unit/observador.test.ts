import { describe, it, expect, vi } from 'vitest';
import { Observador } from '../../src/Observador';

// Creamos una clase de prueba que implementa la interfaz
class MockObservador implements Observador {
    public mensajeRecibido: string = "";
    public llamado: boolean = false;

    actualizar(mensaje: string): void {
        this.mensajeRecibido = mensaje;
        this.llamado = true;
    }
}

describe('Pruebas Unitarias - Interfaz Observador (Contrato)', () => {

    it('Caso 31: Debería permitir que una clase implemente y ejecute actualizar', () => {
        const observador = new MockObservador();
        const mensaje = "Cambio de estado en sala";
        
        observador.actualizar(mensaje);
        
        expect(observador.llamado).toBe(true);
        expect(observador.mensajeRecibido).toBe(mensaje);
    });

    it('Caso 32: Debería registrar el último mensaje recibido en múltiples actualizaciones', () => {
        const observador = new MockObservador();
        
        observador.actualizar("Primer mensaje");
        observador.actualizar("Segundo mensaje");
        
        expect(observador.mensajeRecibido).toBe("Segundo mensaje");
    });

    it('Caso 33: Debería aceptar strings con formatos complejos o emojis (Límite)', () => {
        const observador = new MockObservador();
        const mensajeComplejo = "📅 Reserva #123 - ✅ Confirmada";
        
        observador.actualizar(mensajeComplejo);
        
        expect(observador.mensajeRecibido).toBe(mensajeComplejo);
    });
});