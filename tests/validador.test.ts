import { describe, test, expect } from 'vitest';

describe('Pruebas unitarias de DEVpapois', () => {
  test('Verificar que el entorno de CI/CD reconoce TypeScript con Vitest', () => {
    const proyecto: string = "DEVpapois";
    expect(proyecto).toBe("DEVpapois");
  });
});
