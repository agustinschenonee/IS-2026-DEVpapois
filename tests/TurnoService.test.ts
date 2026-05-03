import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TurnoService } from '../src/TurnoService'; // Verifica que la ruta sea correcta
import * as Validador from '../src/ValidadorOcupacion';
import { supabase } from '../src/supabase';

// 1. Mockeamos el validador externo
vi.mock('../src/ValidadorOcupacion', () => ({
  verificarDisponibilidad: vi.fn()
}));

// 2. Mockeamos Supabase de forma que Vitest reconozca las funciones
vi.mock('../src/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
            insert: vi.fn(() => ({
              select: vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null })
            }))
          }))
        }))
      }))
    }))
  }
}));

describe('Pruebas Unitarias - TurnoService (B1/B3)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Caso 13: Debería rechazar la reserva si el validador dice que está ocupado', async () => {
    // CORRECCIÓN: Usamos la función del módulo mockeado directamente
    const spy = vi.spyOn(Validador, 'verificarDisponibilidad');
    spy.mockResolvedValue(false);

    const resultado = await TurnoService.reservarTurno(1, 10, '2024-12-01', '09:00', '10:00');

    expect(resultado.success).toBe(false);
    expect(resultado.message).toBe("El horario ya no está disponible.");
  });

  it('Caso 14: Debería crear la reserva exitosamente si está libre', async () => {
    // CORRECCIÓN: Forzamos el valor de retorno para este caso positivo
    const spy = vi.spyOn(Validador, 'verificarDisponibilidad');
    spy.mockResolvedValue(true);

    const resultado = await TurnoService.reservarTurno(1, 10, '2024-12-01', '14:00', '15:00');

    expect(resultado.success).toBe(true);
    expect(resultado.data).toBeDefined();
    expect(resultado.data.id).toBe(1);
  });

  it('Caso 15: obtenerCalendario debería devolver lista vacía si no hay turnos (Límite)', async () => {
    const data = await TurnoService.obtenerCalendario(10, '2024-12-01');
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });
});
