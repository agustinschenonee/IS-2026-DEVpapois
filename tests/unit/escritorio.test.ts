import { describe, it, expect } from 'vitest';
import { Escritorio } from '../../src/app/services/Escritorio'; // Ajusta la ruta según tu carpeta

describe('Pruebas Unitarias - Clase Escritorio (B1)', () => {

  it('Caso 28: Debería retornar detalles correctos cuando tiene un ID asignado', () => {
    const escritorio = new Escritorio('Puesto Ventana', 1, true, 'ESCRITORIO', '', 505);
    const detalles = escritorio.obtenerDetalles();
    
    expect(detalles).toContain('ESCRITORIO: Puesto Ventana');
    expect(detalles).toContain('Capacidad: 1');
    expect(detalles).toContain('Puesto ID: 505');
  });

  it('Caso 29: Debería mostrar "Nuevo" si no tiene ID asignado (Límite)', () => {
    const escritorio = new Escritorio('Puesto Central', 1);
    const detalles = escritorio.obtenerDetalles();
    
    expect(detalles).toContain('Puesto ID: Nuevo');
  });

  it('Caso 30: Debería inicializar con el tipo "ESCRITORIO" por defecto', () => {
    const escritorio = new Escritorio('Puesto Pasillo', 1);
    
    expect(escritorio.tipo).toBe('ESCRITORIO');
    expect(escritorio.disponible).toBe(true);
  });
});