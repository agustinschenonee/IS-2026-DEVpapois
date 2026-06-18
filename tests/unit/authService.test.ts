import { describe, it, expect, vi, beforeEach } from 'vitest';
// Usamos llaves para asegurar la exportación nombrada
import { AuthService } from '../../src/app/services/AuthService';
import { supabase } from '../../src/app/services/supabase';

// MOCK: Solo mockeamos Supabase. NO mockeamos AuthService.
vi.mock('../../src/app/services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }
}));

describe('Pruebas Unitarias - AuthService (B1/B3)', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('Caso 23: Debería retornar true si el usuario tiene rol admin', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: { rol: 'admin' }, error: null })
        })
      })
    } as any);

    const resultado = await AuthService.esAdmin(1);
    expect(resultado).toBe(true);
  });

  it('Caso 24: Debería retornar false si el usuario tiene otro rol', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: { rol: 'user' }, error: null })
        })
      })
    } as any);

    const resultado = await AuthService.esAdmin(2);
    expect(resultado).toBe(false);
  });

  it('Caso 25: Debería retornar false si el usuario no existe o hay error', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Not found' } })
        })
      })
    } as any);

    const resultado = await AuthService.esAdmin(999);
    expect(resultado).toBe(false);
  });
});