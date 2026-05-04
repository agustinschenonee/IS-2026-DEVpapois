import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificadorEmail } from '../../src/Notificadores'; // Ajusta la ruta

describe('Pruebas Unitarias - Notificadores (Observer Pattern)', () => {

  beforeEach(() => {
    // Limpiamos los mocks de la consola antes de cada test
    vi.restoreAllMocks();
  });

  it('Caso 26: Debería imprimir el mensaje con el formato correcto', () => {
    // Creamos un spy para la consola
    const logSpy = vi.spyOn(console, 'log');
    const notificador = new NotificadorEmail();
    const mensajeTest = "Tu reserva ha sido confirmada";

    notificador.actualizar(mensajeTest);

    // Verificamos que se llamó a la consola con el prefijo correcto
    expect(logSpy).toHaveBeenCalledWith(`[NOTIFICACIÓN] ${mensajeTest}`);
  });

  it('Caso 27: Debería manejar mensajes vacíos sin romperse (Límite)', () => {
    const logSpy = vi.spyOn(console, 'log');
    const notificador = new NotificadorEmail();

    notificador.actualizar("");

    expect(logSpy).toHaveBeenCalledWith("[NOTIFICACIÓN] ");
  });
});