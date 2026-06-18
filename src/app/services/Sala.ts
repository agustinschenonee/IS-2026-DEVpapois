import { Recurso } from './Recurso';

export class Sala implements Recurso {
    constructor(
        public nombre: string,
        public capacidad: number,
        public disponible: boolean = true,
        public tipo: string = 'SALA',
        public imagen_url?: string,
        public mantenimiento?: string,
        public id?: number,
        public horario_disponible?: string,
        public descripcion?: string,
        public amenities: string[] = []
    ) {}

    obtenerDetalles(): string {
        return `SALA: ${this.nombre} | Capacidad: ${this.capacidad} | Horario: ${this.horario_disponible || 'No definido'}`;
    }
}
