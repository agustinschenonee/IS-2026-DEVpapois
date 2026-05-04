import { describe, it, expect } from 'vitest';
import { Sala } from '../../src/Sala'; // Ajusta la ruta según tu carpeta

describe('Pruebas Unitarias - Clase Sala (B1)', () => {

  it('Caso 20: Debería retornar detalles completos cuando tiene horario', () => {
    const sala = new Sala('Sala Alpha', 10, true, 'SALA', '', '', 1, '08:00-20:00');
    const detalles = sala.obtenerDetalles();
    
    expect(detalles).toContain('SALA: Sala Alpha');
    expect(detalles).toContain('Capacidad: 10');
    expect(detalles).toContain('Horario: 08:00-20:00');
  });

  it('Caso 21: Debería mostrar "No definido" si el horario es nulo o vacío (Límite)', () => {
    const sala = new Sala('Sala Beta', 5);
    const detalles = sala.obtenerDetalles();
    
    expect(detalles).toContain('Horario: No definido');
  });

  it('Caso 22: Debería tener el estado disponible por defecto', () => {
    const sala = new Sala('Sala Gamma', 8);
    
    expect(sala.disponible).toBe(true);
    expect(sala.tipo).toBe('SALA');
  });
});