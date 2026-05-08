# Estrategia de Testing - DevPapois

Este documento consolida la estrategia de aseguramiento de calidad aplicada al sistema de reservas de coworking y la mitigación de los riesgos analizados por el equipo en el foro.

## 1. Situaciones Críticas Identificadas (Análisis del Foro)
Nuestra estrategia se fundamenta en mitigar las siguientes tres fallas críticas que alterarían por completo el funcionamiento del sistema:
* **Colisión de reservas:** Falla concurrente cuando 2 usuarios reservan el mismo espacio al mismo tiempo.
* **Inconsistencia de la disponibilidad:** Falla visual donde se muestran salas disponibles que en realidad están ocupadas.
* **Fallo de privilegios:** Asignación de roles inconsistente que permite a un usuario común ver/modificar reservas ajenas.

## 2. Tabla de Herramientas
Se seleccionaron herramientas que optimizan el rendimiento y garantizan el control sobre el sistema:

| Categoría | Herramienta | Justificación |
| :--- | :--- | :--- |
| **Pruebas Unitarias** | **Vitest** | Ejecución casi instantánea y compatibilidad nativa con TypeScript, ideal para nuestro entorno Node. |
| **CI / CD** | **GitHub Actions** | Automatiza la ejecución en cada `push` o `pull request`, garantizando que no se integren errores a la rama principal. |
| **Dobles de Prueba** | **Sinon.js** | Librería agnóstica para crear Mocks y Stubs con control total (Sandboxes y Fake Timers). |

## 3. Casos de Prueba de Ejemplo
Diseñamos casos aplicando técnicas de caja negra para proteger la lógica crítica:
* **Partición de Equivalencia y Valor Límite:** En la entidad `Turno`, nos aseguramos de que `validarRecurso()` rechace IDs inválidos (Ej. 0 o negativos) y `validarUsuario()` exija nombres mayores a 3 caracteres.
* **Lógica de Traslapes:** Pruebas estrictas sobre `verificarDisponibilidad` para garantizar que los horarios no se pisen y actualizar la agenda con información real.

## 4. Diseño Conceptual de Pruebas de Integración (Mocks y Stubs)
Para asegurar la robustez del sistema, identificamos dependencias externas que requieren **dobles de prueba** para evitar fallos por latencia de red.

| Dependencia | Técnica | Razón Técnica |
| :--- | :--- | :--- |
| **Base de Datos (Supabase)** | **Mocking** | Verificamos la interacción. Aseguramos que el código llame a `.insert()` con la fecha y sala correctos sin alterar la nube. |
| **Servicio Email / Push** | **Stubbing** | Usamos un Stub con respuestas enlatadas ("OK") para que el sistema continúe el flujo sin bloqueos. |

### Ejemplo de Flujo de Prueba de Integración
**Caso:** Validación de la lógica de negocio con persistencia simulada.
```typescript
// Pseudocódigo de integración para Sistema de Coworking
test('Debe integrar la lógica de reserva con el mock de base de datos', async () => {
    // 1. ARRANGUE (Setup)
    // Creamos un Mock que simula el comportamiento del cliente de Supabase
    const dbMock = {
        from: () => ({
            insert: vi.fn().mockResolvedValue({ 
                status: 201, 
                data: { id: 'reserva_123' } 
            })
        })
    };

    // 2. ACTUAR (Execute)
    // El 'ReservaService' procesa la lógica y se comunica con el doble de la DB
    const resultado = await ReservaService.confirmarReserva(dbMock, { 
        salaId: 10, 
        usuarioId: 5 
    });

    // 3. AFIRMAR (Assert/Verify)
    // Verificamos que la comunicación con la DB fue correcta y la respuesta es la esperada
    expect(dbMock.from).toHaveBeenCalledWith('reservas');
    expect(resultado.mensaje).toBe("Reserva confirmada exitosamente");
});
