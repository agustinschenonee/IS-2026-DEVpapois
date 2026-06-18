import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminService } from '../../src/app/services/AdminService';
import { AuthService } from '../../src/app/services/AuthService';
import { supabase } from '../../src/app/services/supabase';

vi.mock('../../src/app/services/AuthService', () => ({
  AuthService: {
    esAdmin: vi.fn()
  }
}));

vi.mock('../../src/app/services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({
          data: [{ id: 100, nombre: 'Sala de Test', tipo: 'SALA' }],
          error: null
        })
      }))
    }))
  }
}));

describe('Pruebas Unitarias - AdminService (B1/B3)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Caso 17: Debería rechazar la creación si el usuario no es admin', async () => {
    vi.mocked(AuthService.esAdmin).mockResolvedValue(false);

    const resultado = await AdminService.crearNuevoRecurso('user-99', 'SALA', { nombre: 'Sala VIP' });

    expect(resultado.success).toBe(false);
    expect(resultado.error).toContain("Permisos insuficientes");
  });

  it('Caso 18: Debería crear la sala exitosamente si es admin', async () => {
    vi.mocked(AuthService.esAdmin).mockResolvedValue(true);

    const datosSala = { nombre: 'Sala de Juntas', capacidad: 10, mantenimiento: false };
    const resultado = await AdminService.crearNuevoRecurso('admin-1', 'SALA', datosSala);

    expect(resultado.success).toBe(true);
    expect(resultado.recurso.nombre).toBe('Sala de Test');
  });

  it('Caso 19: Debería capturar errores si falla Supabase', async () => {
    vi.mocked(AuthService.esAdmin).mockResolvedValue(true);

    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: () => ({
        select: () => Promise.resolve({ data: null, error: { message: 'Error de DB' } })
      })
    } as any);

    const resultado = await AdminService.crearNuevoRecurso('admin-1', 'SALA', { nombre: 'Error' });

    expect(resultado.success).toBe(false);
    expect(resultado.error).toBe('Error de DB');
  });
});
