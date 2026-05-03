describe('Pruebas unitarias de DEVpapois', () => {
  test('Verificar que el entorno de CI/CD reconoce TypeScript', () => {
    const proyecto: string = "DEVpapois";
    expect(proyecto).toBe("DEVpapois");
  });
});
