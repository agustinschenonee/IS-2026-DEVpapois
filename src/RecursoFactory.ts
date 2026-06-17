import { Sala } from './Sala';
import { Escritorio } from './Escritorio';
import { Recurso } from './Recurso';

export class RecursoFactory {
    static crearRecurso(tipo: string, datos: any): Recurso {
        switch (tipo.toUpperCase()) {
            case 'SALA':
                return new Sala(
                    datos.nombre,
                    datos.capacidad,
                    datos.disponible,
                    'SALA',
                    datos.imagen_url,
                    datos.mantenimiento,
                    datos.id,
                    datos.horario_disponible,
                    datos.descripcion,
                    datos.amenities || []
                );
            case 'ESCRITORIO':
                return new Escritorio(
                    datos.nombre,
                    datos.capacidad,
                    datos.disponible,
                    'ESCRITORIO',
                    datos.imagen_url,
                    datos.id,
                    datos.descripcion,
                    datos.amenities || []
                );
            default:
                throw new Error("Tipo de recurso no reconocido.");
        }
    }
}
