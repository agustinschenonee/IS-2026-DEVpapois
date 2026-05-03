import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TurnoService } from '../src/TurnoService';
import * as Validador from '../src/ValidadorOcupacion';
import { supabase } from '../src/supabase';

// 1. Mockeamos el validador
vi.mock('../src/ValidadorOcupacion', () => ({
  verificarDisponibilidad: vi.fn()
}));

// 2. Mockeamos Supabase con todas las funciones encadenadas
vi.mock('../src/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      // Simulamos la resolución de la promesa al final de la cadena
      then: (onFullfilled: any) => onFullfilled({ 
        data: [{ id: 1, usuario_id: 1 }], 
        error: null 
      })
    }))
  }
}));

describe('Pruebas Unitarias - TurnoService (B1/B3)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Caso 13: Debería rechazar la reserva si el validador dice que está ocupado', async () => {
    vi.spyOn(Validador, 'verificarDisponibilidad').mockResolvedValue(false);

    const resultado = await TurnoService.reservarTurno(1, 10, '2024-12-01', '09:00', '10:00');

    expect(resultado.success).toBe(false);
    expect(resultado.message).toBe("El horario ya no está disponible.");
  });

  it('Caso 14: Debería crear la reserva exitosamente si está libre', async () => {
    vi.spyOn(Validador, 'verificarDisponibilidad').mockResolvedValue(true);

    // Mockeamos la respuesta específica del insert
    const insertSpy = vi.spyOn(supabase, 'from').mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null })
    } as any);

    const resultado = await TurnoService.reservarTurno(1, 10, '2024-12-01', '14:00', '15:00');

    expect(resultado.success).toBe(true);
    expect(resultado.data).toBeDefined();
    expect(resultado.data.id).toBe(1);
  });

  it('Caso 15: obtenerCalendario debería devolver lista vacía si no hay turnos (Límite)', async () => {
    // Mockeamos respuesta vacía para el calendario
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    } as any);

    const data = await TurnoService.obtenerCalendario(10, '2024-12-01');
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });
});
