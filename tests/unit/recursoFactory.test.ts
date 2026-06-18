import { describe, it, expect } from 'vitest';
import { RecursoFactory } from '../../src/app/services/RecursoFactory';
import { Sala } from '../../src/app/services/Sala';
import { Escritorio } from '../../src/app/services/Escritorio';

describe('Pruebas Unitarias - RecursoFactory (B1)', () => {

  it('Caso 37: Debería crear una instancia de Sala correctamente', () => {
    const datos = { nombre: 'Sala de Video', capacidad: 6, disponible: true };
    const recurso = RecursoFactory.crearRecurso('SALA', datos);

    expect(recurso).toBeInstanceOf(Sala);
    expect(recurso.nombre).toBe('Sala de Video');
    expect(recurso.tipo).toBe('SALA');
  });

  it('Caso 38: Debería crear una instancia de Escritorio correctamente', () => {
    const datos = { nombre: 'Puesto 01', capacidad: 1, disponible: true };
    const recurso = RecursoFactory.crearRecurso('ESCRITORIO', datos);

    expect(recurso).toBeInstanceOf(Escritorio);
    expect(recurso.nombre).toBe('Puesto 01');
    expect(recurso.tipo).toBe('ESCRITORIO');
  });

  it('Caso 39: Debería lanzar un error si el tipo no es reconocido (Límite)', () => {
    const datos = { nombre: 'Test', capacidad: 1 };
    
    // Verificamos que lance la excepción configurada en el switch default
    expect(() => {
      RecursoFactory.crearRecurso('SILLON', datos);
    }).toThrow("Tipo de recurso no reconocido.");
  });
});