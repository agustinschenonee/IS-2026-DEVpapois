import { describe, it, expect } from 'vitest';
import { Turno } from '../../src/logic/Turno';

describe('B1. Pruebas Unitarias para Clase Turno', () => {

  describe('validarUsuario()', () => {
    it('Caso 01: Debe aceptar un nombre válido (Equivalencia Válida)', () => {
      const turno = new Turno(1, 100, 'AgustinSch', '2026-05-10');
      expect(turno.validarUsuario()).toBe(true);
    });

    it('Caso 02: Debe rechazar un nombre muy corto (Valor Límite)', () => {
      const turno = new Turno(2, 100, 'Ag', '2026-05-10');
      expect(turno.validarUsuario()).toBe(false);
    });

    it('Caso 03: Debe rechazar un nombre vacío (Equivalencia Inválida)', () => {
      const turno = new Turno(3, 100, '', '2026-05-10');
      expect(turno.validarUsuario()).toBe(false);
    });
  });

  describe('validarRecurso()', () => {
    it('Caso 04: Debe aceptar un ID de recurso igual a 1 (Valor Límite Mínimo)', () => {
      const turno = new Turno(4, 1, 'Julian', '2026-05-10');
      expect(turno.validarRecurso()).toBe(true);
    });

    it('Caso 05: Debe rechazar un ID de recurso igual a 0 (Valor Límite)', () => {
      const turno = new Turno(5, 0, 'Julian', '2026-05-10');
      expect(turno.validarRecurso()).toBe(false);
    });

    it('Caso 06: Debe rechazar un ID de recurso negativo (Equivalencia Inválida)', () => {
      const turno = new Turno(6, -5, 'Julian', '2026-05-10');
      expect(turno.validarRecurso()).toBe(false);
    });
  });
});