import { Recurso } from './Recurso';

export class Escritorio implements Recurso {
    constructor(
        public nombre: string,
        public capacidad: number,
        public disponible: boolean = true,
        public tipo: string = 'ESCRITORIO',
        public imagen_url?: string,
        public id?: number,
        public descripcion?: string,
        public amenities: string[] = []
    ) {}

    obtenerDetalles(): string {
        return `ESCRITORIO: ${this.nombre} | Capacidad: ${this.capacidad} | Puesto ID: ${this.id || 'Nuevo'}`;
    }
}
