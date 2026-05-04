export class Usuario {
  constructor(
    public id: string | null,
    public nombre: string,
    public email: string,
    public password: string,
    public rol: 'admin' | 'cliente' = 'cliente' // Por defecto son clientes
  ) {}

  // Acá van a ir las validaciones que el robot va a testear
  validarRegistro(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      this.nombre.length >= 3 && 
      emailRegex.test(this.email) && 
      this.password.length >= 8
    );
  }
}
