## Diseño conceptual de pruebas de integración 

Para asegurar la robustez del sistema, identificamox las dependencias externas que requieren una estrategia de **dobles de prueba**. El objetivo es validar la interacción entre unidades de software sin depender de servicios reales, evitando fallos por latencia de red o caídas de servidores externos.

### 1. Identificación de Dependencias Externas
* **Base de Datos (Supabase):** Utilizada para persistir reservas, usuarios y disponibilidad de salas. Es la dependencia más crítica del sistema.
* **Servicio de Notificaciones:** En un entorno real, el sistema se conectaría a servicios como SendGrid o Mailtrap para enviar confirmaciones de reserva vía Email o Push.

### 2. Estrategia de Mocking y Stubbing

| Dependencia | Técnica | Razón Técnica |
| :--- | :--- | :--- |
| **Base de Datos (Supabase)** | **Mocking** | Utilizamos un Mock de la librería cliente para verificar la **interacción**. No solo esperamos un retorno, sino que aseguramos que el código llame a `.insert()` con el formato de fecha y ID de sala correctos. |
| **Servicio de Notificaciones** | **Stubbing** | Utilizamos un Stub con respuestas "enlatadas" (ej: "OK"). El sistema solo necesita saber que el mensaje fue recibido por el servicio para continuar el flujo sin bloqueos. |

### 3. Herramienta recomendada= Sinon.js

Sinon.js es recomendable como herramienta principal para la creación de estos dobles de prueba. A diferencia de las utilidades integradas en los frameworks de ejecución, Sinon es una librería agnóstica y especializada que ofrece un control superior mediante Sandboxes (que aseguran la limpieza automática de mocks entre tests) y Fake Timers (fundamentales para testear lógicas de expiración de reservas en tiempo real). Su uso garantiza que la arquitectura de pruebas sea robusta, escalable y totalmente independiente del motor de tests utilizado. 

Esta herramienta es fundamental para realizar testeos específicos, permitiéndonos elegir el nivel de control exacto para cada integración:
- Spies (Espías): Para observar el comportamiento del sistema de login sin alterarlo, registrando argumentos y retornos.
- Stubs (Sustitutos): Para reemplazar la conexión a Supabase, evitando llamadas reales a la nube y forzando respuestas inmediatas (éxitos o errores controlados).
- Mocks (Simulacros): Para definir expectativas estrictas sobre la base de datos antes de ejecutar el test, asegurando que la comunicación ocurra exactamente como fue diseñada.


### 4. Ejemplo de Flujo de Prueba de Integración
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
});


    expect(resultado.mensaje).toBe("Reserva confirmada exitosamente");
});
