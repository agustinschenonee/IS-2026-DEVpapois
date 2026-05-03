export class Turno {
    constructor(
        public id: number,
        public recursoId: number,
        public usuario: string,
        public fecha: string, 
        public estado: string = 'CONFIRMADO'
    ) {}

    // Función A: Valida el nombre de usuario
    validarUsuario(): boolean {
        if (!this.usuario) return false;
        const nombreLimpio = this.usuario.trim();
        return nombreLimpio.length >= 3 && nombreLimpio.length <= 20;
    }

    // Función B: Valida el ID del recurso
    validarRecurso(): boolean {
        return Number.isInteger(this.recursoId) && this.recursoId > 0;
    }
}