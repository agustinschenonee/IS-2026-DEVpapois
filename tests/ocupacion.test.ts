import { describe, it, expect, vi } from 'vitest';
import { verificarDisponibilidad } from '../../src/ValidadorOcupacion';
import { supabase } from '../../src/supabase';

// Mockeamos el cliente de Supabase
vi.mock('../../src/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ 
            data: [
              { hora_inicio: '10:00', hora_fin: '11:00' } // Turno de referencia para los tests
            ], 
            error: null 
          }))
        }))
      }))
    }))
  }
}));

describe('Pruebas Unitarias - Validador de Ocupación (B1)', () => {

  it('Caso 07: Debería estar disponible si el horario es posterior (Equivalencia)', async () => {
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '12:00', '13:00');
    expect(disponible).toBe(true);
  });

  it('Caso 08: Debería estar disponible si empieza justo cuando el otro termina (Valor Límite)', async () => {
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '11:00', '12:00');
    expect(disponible).toBe(true);
  });

  it('Caso 09: No debería estar disponible si se traslapa al final (Equivalencia Inválida)', async () => {
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '10:30', '11:30');
    expect(disponible).toBe(false);
  });

  it('Caso 10: No debería estar disponible si la nueva reserva contiene a la anterior (Equivalencia)', async () => {
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '09:00', '12:00');
    expect(disponible).toBe(false);
  });

  it('Caso 11: No debería estar disponible si el horario es idéntico (Valor Límite)', async () => {
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '10:00', '11:00');
    expect(disponible).toBe(false);
  });

  it('Caso 12: Debería fallar si Supabase devuelve un error (Manejo de excepciones)', async () => {
    // Cambiamos el mock solo para este test para simular un error
    // @ts-ignore
    supabase.from().select().eq().eq.mockReturnValueOnce(Promise.resolve({ data: null, error: true }));
    
    await expect(verificarDisponibilidad(1, '2024-10-10', '15:00', '16:00'))
      .rejects.toThrow("Error al consultar disponibilidad en Supabase");
  });
});
