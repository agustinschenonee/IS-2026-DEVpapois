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
# Estrategia de Testing - DevPapois

Este documento consolida la estrategia de aseguramiento de calidad aplicada al sistema de reservas de coworking y la mitigación de los riesgos analizados por el equipo en el foro.

## 1. Tabla de herramientas
Se seleccionaron herramientas que optimizan el rendimiento y garantizan el control sobre el sistema:

| Categoría | Herramienta | Justificación |
| :--- | :--- | :--- |
| **Pruebas Unitarias** | **Vitest** | Ejecución casi instantánea y compatibilidad nativa con TypeScript, ideal para nuestro entorno Node. |
| **CI / CD** | **GitHub Actions** | Automatiza la ejecución en cada `push` o `pull request`, garantizando que no se integren errores a la rama principal. |
| **Dobles de Prueba** | **Sinon.js** | Librería agnóstica para crear Mocks y Stubs con control total (Sandboxes y Fake Timers). |

## 2. Casos de prueba de ejemplo
Diseñamos casos aplicando técnicas de caja negra para proteger la lógica crítica y evitar el riesgo de **Inconsistencia de la disponibilidad** debatido en el foro (donde el sistema podría mostrar salas ocupadas como disponibles):
* **Partición de Equivalencia y Valor Límite:** En la entidad `Turno`, nos aseguramos de que `validarRecurso()` rechace IDs inválidos (Ej. 0 o negativos) y `validarUsuario()` exija nombres mayores a 3 caracteres.
* **Lógica de Traslapes:** Pruebas estrictas sobre `verificarDisponibilidad` (Casos 08 a 11) para garantizar que los horarios no se pisen y el patrón Observer actualice la agenda con información real.

## 3. Plan de mocks
Para las futuras pruebas de integración sin depender de servicios externos:
* **Base de Datos (Supabase):** Implementaremos un **Mock** de la librería cliente. Interceptaremos métodos como `.insert()` para verificar que enviamos los datos correctos sin generar registros basura en la nube.
* **Servicio de Notificaciones:** Utilizaremos un **Stub** que devuelva respuestas predefinidas (Ej. "OK") para garantizar que el flujo principal de reserva no se caiga si el servicio de correos falla.

## 4. Flujo E2E básico
Para validar el "Happy Path" completo y mitigar el **Fallo de privilegios** analizado en el foro (donde un usuario común podría alterar reservas ajenas o modificar salas), definimos este flujo:
1. **Autenticación:** El usuario ingresa credenciales. El sistema valida el token y asigna los permisos estrictos (Usuario o Administrador).
2. **Exploración:** El usuario visualiza únicamente las salas y horarios permitidos según su rol y la disponibilidad real.
3. **Reserva:** Se selecciona un horario y se envía el formulario.
4. **Confirmación:** El sistema procesa, muestra mensaje de éxito y actualiza la vista.

## 5. Estrategia de regresión
Para asegurar que el código nuevo no rompa las validaciones ya logradas:
* **Automatización Continua:** El archivo `.github/workflows/test.yml` dispara la suite de pruebas automáticamente al subir código.
* **Bloqueo Restrictivo:** Si un test falla (por ejemplo, si alguien rompe la validación de roles), el pipeline actúa como barrera y rechaza la integración a la rama `main`.
* **Velocidad Local:** Vitest corre los 16 casos en ~1 segundo, permitiendo a los desarrolladores testear constantemente antes de hacer un commit.

## 6. Plan de estrés futuro
Este plan se ejecutará en el trabajo integrador final para resolver directamente la **Colisión de reservas** identificada en el foro:
* **Objetivo:** Evaluar la resistencia de la base de datos (Supabase) ante concurrencia extrema.
* **Escenario:** Simulación masiva donde 2 o más usuarios intentan confirmar la reserva de una misma sala en el mismo milisegundo exacto.
* **Métrica de Éxito:** El sistema debe manejar los bloqueos transaccionales (locks), registrando el turno para el primer usuario y devolviendo un error claro al segundo, evitando absolutamente las dobles reservas en la base de datos o las confirmaciones falsas en pantalla.

---
**Documentación a cargo de:** Priscila Avril Itati Galeano
