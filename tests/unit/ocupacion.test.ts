import { describe, it, expect, vi } from 'vitest';
import { verificarDisponibilidad } from '../../src/app/services/ValidadorOcupacion';
import { supabase } from '../../src/app/services/supabase';

function mockSupabase(turnos: any[], bloqueos: any[] = []) {
  vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
    if (table === 'turnos') {
      return {
        select: () => ({
          eq: () => ({
            eq: () => Promise.resolve({ data: turnos, error: null })
          })
        })
      } as any;
    }
    return {
      select: () => ({
        eq: () => ({
          or: () => Promise.resolve({ data: bloqueos, error: null })
        })
      })
    } as any;
  });
}

describe('Pruebas Unitarias - Validador de Ocupación (B1)', () => {

  it('Caso 07: Debería estar disponible si el horario es posterior (Equivalencia)', async () => {
    mockSupabase([{ hora_inicio: '10:00', hora_fin: '11:00', estado: 'active' }]);
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '12:00', '13:00');
    expect(disponible).toBe(true);
  });

  it('Caso 08: Debería estar disponible si empieza justo cuando el otro termina (Valor Límite)', async () => {
    mockSupabase([{ hora_inicio: '10:00', hora_fin: '11:00', estado: 'active' }]);
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '11:00', '12:00');
    expect(disponible).toBe(true);
  });

  it('Caso 09: No debería estar disponible si se traslapa al final', async () => {
    mockSupabase([{ hora_inicio: '10:00', hora_fin: '11:00', estado: 'active' }]);
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '10:30', '11:30');
    expect(disponible).toBe(false);
  });

  it('Caso 10: No debería estar disponible si la nueva reserva contiene a la anterior (Equivalencia)', async () => {
    mockSupabase([{ hora_inicio: '10:00', hora_fin: '11:00', estado: 'active' }]);
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '09:00', '12:00');
    expect(disponible).toBe(false);
  });

  it('Caso 11: No debería estar disponible si el horario es idéntico (Valor Límite)', async () => {
    mockSupabase([{ hora_inicio: '10:00', hora_fin: '11:00', estado: 'active' }]);
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '10:00', '11:00');
    expect(disponible).toBe(false);
  });

  it('Caso 12: Debería fallar si Supabase devuelve un error al consultar turnos', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ data: null, error: new Error('Simulated Error') })
        })
      })
    } as any);

    await expect(verificarDisponibilidad(1, '2024-10-10', '15:00', '16:00'))
      .rejects.toThrow('Error al consultar disponibilidad en Supabase');
  });

  it('Caso 12b: Debería fallar si Supabase devuelve un error al consultar bloqueos', async () => {
    vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'turnos') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => Promise.resolve({ data: [], error: null })
            })
          })
        } as any;
      }
      return {
        select: () => ({
          eq: () => ({
            or: () => Promise.resolve({ data: null, error: new Error('Simulated Error') })
          })
        })
      } as any;
    });

    await expect(verificarDisponibilidad(1, '2024-10-10', '15:00', '16:00'))
      .rejects.toThrow('Error al consultar bloqueos en Supabase');
  });

  it('Caso 12c: No debería estar disponible si hay un bloqueo activo para esa fecha/recurso', async () => {
    mockSupabase([], [{ id: 1 }]);
    const disponible = await verificarDisponibilidad(1, '2024-10-10', '15:00', '16:00');
    expect(disponible).toBe(false);
  });
});
