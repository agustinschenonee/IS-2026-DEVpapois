import { describe, it, expect } from 'vitest';
import { Recurso } from '../../src/app/services/Recurso';

// Creamos una implementación mínima para testear el contrato de la interfaz
class MockRecurso implements Recurso {
    constructor(
        public nombre: string,
        public capacidad: number,
        public tipo: string,
        public disponible: boolean
    ) {}

    obtenerDetalles(): string {
        return `${this.tipo}: ${this.nombre}`;
    }
}

describe('Pruebas Unitarias - Interfaz Recurso (Contrato)', () => {

    it('Caso 34: Debería permitir ejecutar obtenerDetalles desde cualquier implementación', () => {
        const recurso: Recurso = new MockRecurso('Sala de Estar', 4, 'SALA', true);
        expect(recurso.obtenerDetalles()).toBe('SALA: Sala de Estar');
    });

    it('Caso 35: Debería validar que las propiedades obligatorias están presentes', () => {
        const recurso: Recurso = {
            nombre: 'Escritorio 1',
            capacidad: 1,
            tipo: 'ESCRITORIO',
            disponible: true,
            obtenerDetalles: () => 'Detalles'
        };

        expect(recurso.nombre).toBeDefined();
        expect(recurso.capacidad).toBeGreaterThan(0);
        expect(recurso.disponible).toBe(true);
    });

    it('Caso 36: Debería ser funcional sin las propiedades opcionales (Límite)', () => {
        const recurso: Recurso = new MockRecurso('Puesto 5', 1, 'PUESTO', true);
        
        // Verificamos que las opcionales sean undefined pero el objeto sea válido
        expect(recurso.imagen_url).toBeUndefined();
        expect(recurso.mantenimiento).toBeUndefined();
        expect(recurso.horario_disponible).toBeUndefined();
    });
});