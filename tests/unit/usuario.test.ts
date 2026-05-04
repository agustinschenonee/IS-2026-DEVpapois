import { describe, it, expect } from 'vitest';
import { Usuario } from '../../src/logic/Usuario';

describe('Pruebas de Registro de Usuario', () => {
  it('Debe validar un registro correcto', () => {
    const user = new Usuario(null, 'Priscila', 'pri@ucp.edu.ar', 'password123');
    expect(user.validarRegistro()).toBe(true);
  });

  it('Debe rechazar un email inválido', () => {
    const user = new Usuario(null, 'Avril', 'email-sin-arroba', '12345678');
    expect(user.validarRegistro()).toBe(false);
  });

  it('Debe rechazar contraseñas muy cortas', () => {
    const user = new Usuario(null, 'Itati', 'test@test.com', '123');
    expect(user.validarRegistro()).toBe(false);
  });
});
