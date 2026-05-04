import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminService } from '../../src/AdminService';
import { AuthService } from '../../src/AuthService';
import { supabase } from '../../src/supabase';

// 1. Mockeamos AuthService para controlar el rol del usuario
vi.mock('../../src/AuthService', () => ({
  AuthService: {
    esAdmin: vi.fn()
  }
}));

// 2. Mockeamos Supabase para la inserción
vi.mock('../../src/supabase', () => ({
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
    // Simulamos que NO es admin
    vi.mocked(AuthService.esAdmin).mockResolvedValue(false);

    const resultado = await AdminService.crearNuevaSala(99, { nombre: 'Sala VIP' });

    expect(resultado.success).toBe(false);
    expect(resultado.error).toContain("Permisos insuficientes");
  });

  it('Caso 18: Debería crear la sala exitosamente si es admin', async () => {
    // Simulamos que SÍ es admin
    vi.mocked(AuthService.esAdmin).mockResolvedValue(true);

    const datosSala = { nombre: 'Sala de Juntas', capacidad: 10, mantenimiento: false };
    const resultado = await AdminService.crearNuevaSala(1, datosSala);

    expect(resultado.success).toBe(true);
    expect(resultado.sala.nombre).toBe('Sala de Test'); // Viene del mock de Supabase
  });

  it('Caso 19: Debería capturar errores si falla Supabase', async () => {
    vi.mocked(AuthService.esAdmin).mockResolvedValue(true);
    
    // Forzamos un error en la base de datos
    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: () => ({
        select: () => Promise.resolve({ data: null, error: { message: 'Error de DB' } })
      })
    } as any);

    const resultado = await AdminService.crearNuevaSala(1, { nombre: 'Error' });

    expect(resultado.success).toBe(false);
    expect(resultado.error).toBe('Error de DB');
  });
});