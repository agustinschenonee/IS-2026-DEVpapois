// tests/unit/usuario.test.ts
describe('Pruebas de Registro de Usuario - DEVpapois', () => {
  it('Debe validar un registro con nombre de 2 letras y clave de 4', () => {
    const user = new Usuario(null, 'Pr', 'pri@ucp.edu.ar', '1234');
    expect(user.validarRegistro()).toBe(true); // Ahora esto debe pasar
  });

  it('Debe rechazar un nombre de menos de 2 caracteres', () => {
    const user = new Usuario(null, 'A', 'avril@test.com', '1234');
    expect(user.validarRegistro()).toBe(false); // Falla por nombre corto
  });

  it('Debe rechazar una contraseña de menos de 4 caracteres', () => {
    const user = new Usuario(null, 'Itati', 'itati@test.com', '123');
    expect(user.validarRegistro()).toBe(false); // Falla por clave corta
  });
});
