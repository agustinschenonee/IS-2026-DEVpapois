# AI_LOG.md — Registro de uso de herramientas de IA

**Grupo:** Dev Papois

**Proyecto:** [Sistema de gestión de coworking]

**Materia:** Ingeniería de Software II · UCP · 2026

---

## Cómo completar este archivo

Cada vez que el grupo use una herramienta de IA (Claude, GitHub Copilot, ChatGPT, Gemini u otra) tienen que agregar una entrada en este archivo **antes de hacer el commit** con ese código o artefacto.

**Una entrada por uso, no por semana.** Si en una sesión usaron IA tres veces para tres cosas distintas, son tres entradas.

El archivo se revisa en el coloquio del TP1, TP2 e Integrador. Cualquier integrante puede ser preguntado sobre cualquier entrada. Si no podés explicar lo que figura acá, afecta tu nota individual.

---

## Formato de cada entrada

```
## Entrada 1 — Semana X

**Fecha:** DD/MM/AAAA
**Herramienta:** [Claude / GitHub Copilot / ChatGPT / Gemini / otra]
**Responsable:** [Rol] — [Nombre y apellido]
**Eje temático:** [Eje 1 / Eje 2 / Eje 3 / Eje 4 / Eje 5]

**¿Para qué se usó?**
[Descripción breve de la tarea o problema]

**¿Qué generó la IA?**
[Descripción de lo que produjo: código, diagrama, texto, casos de prueba, etc.]

**¿Qué aceptamos tal cual?**
[Lo que se usó sin modificar, o "Nada" si todo fue modificado]

**¿Qué modificamos y por qué?**
- [Cambio 1]: [Justificación técnica]
- [Cambio 2]: [Justificación técnica]

**¿Qué descartamos y por qué?**
[Lo que la IA generó pero el grupo decidió no usar, con justificación]
```

---

## Entradas

---

## Entrada 001 — Semana 1

**Fecha:** 19/03/2026

**Herramienta:** Gemini 

**Responsable:** Scrum Master (Agustín Schenone) / QA Lead 

**Eje temático:** Eje 1

**¿Para qué se usó?**

Clarificar las responsabilidades del rol de Scrum Master y de los demás integrantes del equipo para el Sprint 0.

Configurar la estructura técnica del repositorio y las columnas obligatorias del tablero Kanban.

Redactar el Contrato de Proyecto cumpliendo con la extensión mínima de 5 líneas por sección y los temas solicitados.

Entender el flujo de trabajo colaborativo en GitHub (Pull, Commit, Push) y la gestión de visibilidad de los proyectos.

**¿Qué generó la IA?**

Una guía detallada sobre las obligaciones de gestión (Scrum Master) frente a las técnicas (Dev Lead, QA Lead, UX Lead).

La lista de las 8 tarjetas iniciales requeridas para el Backlog con sus respectivos ejes temáticos y responsables.

Una propuesta de redacción para las cuatro secciones del Contrato de Proyecto basada en el escenario de la Opción C (Coworking).

Instrucciones paso a paso para la creación de etiquetas (Labels) y la visibilidad de campos en GitHub Projects.

**¿Qué aceptamos tal cual?**

Nada

**¿Qué modificamos y por qué?**

Se ajustaron los títulos de las tarjetas del tablero para incluir la semana objetivo y el eje programático dentro del texto para mayor claridad visual.

Se validó que el nombre del repositorio respetara el formato estricto de minúsculas y guiones requerido por la guía.

Se filtró la información sobre permisos de "Solo lectura" en GitHub para adaptarla a las limitaciones reales de las cuentas personales de los alumnos.

Se verificó que el contenido del contrato reflejara fielmente los acuerdos internos de comunicación (WhatsApp/Discord) definidos por el grupo.

**¿Qué descartamos y por qué?**

Nada

---
# Registro de Uso de IA 

**Herramienta utilizada:** Gemini (Google).

### Partes generadas con IA:
* Estructura base de los patrones Factory y Observer en TypeScript.
* Configuración inicial de interfaces y moldes de clases (`Recurso`, `Sala`, `Escritorio`).
* Scripts de resolución de errores de entorno (políticas de ejecución de PowerShell y configuración de `tsx`).

### Modificaciones realizadas por el equipo:
* Adaptación de los campos de las interfaces para que coincidan con la tabla de Supabase (id, imagen_url, mantenimiento).
* Corrección de rutas de importación y extensiones de archivo (`.ts`) para compatibilidad con Node.js ESM.
* Personalización de los mensajes de salida en consola para el contexto de DEVpapois.

### Justificación de uso:
Se utilizó la IA para acelerar la configuración del entorno de desarrollo y generar el código "boilerplate" (repetitivo), permitiendo al equipo enfocarse en la lógica de negocio y en la arquitectura de los patrones de diseño.

## Entrada 002 — Semana 3

**Fecha:** 02/04/2026

**Herramienta:** ChatGPT

**Responsable:** Dev Lead — [Galeano Priscila, Carabajal Valentina]

**Eje temático:** Eje 1

**¿Para qué se usó?**

Se utilizó la IA para proponer un diseño inicial de base de datos relacional y generar los primeros scripts SQL necesarios para persistir la información del sistema en PostgreSQL.

**¿Qué generó la IA?**

Scripts SQL para la creación de las tablas recursos, usuarios y turnos, incluyendo definición de claves primarias, foráneas y tipos de datos compatibles con PostgreSQL.

**¿Qué aceptamos tal cual?**

La estructura general de las tablas y las relaciones entre usuarios, recursos y turnos mediante claves foráneas.

**¿Qué modificamos y por qué?**

Se agregaron restricciones UNIQUE en los campos DNI y Email de la tabla usuarios para evitar registros duplicados.
Se ajustaron algunos tipos de datos propuestos por la IA para alinearlos con las reglas de negocio del sistema (por ejemplo, uso de TIMESTAMP para los turnos).

**¿Qué descartamos y por qué?**

Se descartaron valores por defecto sugeridos por la IA que no coincidían con el comportamiento esperado del sistema y podían generar datos inconsistentes.

## Entrada 003 — Semana 3

**Fecha:** 03/04/2026

**Herramienta:** ChatGPT

**Responsable:** Dev Lead — [Galeano Priscila, Carabajal Valentina]

**Eje temático:** Eje 1

**¿Para qué se usó?**

Se utilizó la IA para comprender cómo aplicar el patrón creacional Factory en el sistema, con el objetivo de centralizar la creación de distintos tipos de espacios de trabajo (oficinas, salas de conferencia y puestos individuales).

**¿Qué generó la IA?**

La estructura base de la clase SalaFactory, con métodos encargados de instanciar cada tipo de espacio según sus características.

**¿Qué aceptamos tal cual?**

La idea de centralizar la creación de objetos en una única clase Factory y la estructura general de los métodos de instanciación.

**¿Qué modificamos y por qué?**

Se adaptaron los nombres de clases y métodos a las convenciones del proyecto.
Se agregó lógica adicional para manejar atributos como capacidad máxima y dimensiones físicas, que la propuesta original no contemplaba.
Se ajustó la forma en que se reciben los parámetros para que coincidan con el modelo de datos definido previamente.

**¿Qué descartamos y por qué?**

Se descartaron ejemplos genéricos de instanciación que no representaban los tipos de espacios definidos en el sistema y podían generar confusión en la implementación.

## Entrada 004 — Semana 3

**Fecha:** 03/04/2026

**Herramienta:** ChatGPT

**Responsable:** Dev Lead — [Galeano Priscila, Carabajal Valentina]

**Eje temático:** Eje 1

**¿Para qué se usó?**

Se utilizó la IA para configurar correctamente los permisos de acceso a la base de datos desde el frontend y definir políticas de seguridad adecuadas utilizando Supabase.

**¿Qué generó la IA?**

Ejemplos de implementación de políticas RLS (Row Level Security) y habilitación de permisos de lectura y actualización sobre las tablas del sistema.

**¿Qué aceptamos tal cual?**

La estructura base de las políticas RLS propuestas para restringir el acceso a los datos según el usuario autenticado.

**¿Qué modificamos y por qué?**

Se ajustaron las condiciones de las políticas para que coincidan con los roles y reglas del sistema.
Se corrigieron manualmente los parámetros de conexión del cliente Supabase debido a errores de URL malformada en el entorno local.

**¿Qué descartamos y por qué?**

Se descartaron configuraciones demasiado permisivas sugeridas por la IA que podían comprometer la seguridad de los datos.

---

## Entrada 005 — Semana 4
**Fecha: 09/04/2026**
**Herramienta: Gemini**
**Responsable: Dev Lead — [Carabajal Valentina, Galeano Priscila]**
**Eje temático: Eje 2 / Eje 3**

**¿Para qué se usó?**
Implementar la seguridad por roles (Tarea #17) y el módulo de alta de salas para administradores (Tarea #18) integrando la lógica con Supabase.

**¿Qué generó la IA?**
Estructura de los servicios AuthService.ts y AdminService.ts, junto con scripts SQL para la creación de la columna de roles y restricciones (constraints) de integridad.

**¿Qué aceptamos tal cual?**
El script SQL para añadir la columna rol con valor por defecto 'usuario' y la lógica de validación booleana en el servicio de autenticación.

**¿Qué modificamos y por qué?**

Integración con Factory: Se modificó el AdminService para que la creación de objetos no sea directa, sino que invoque obligatoriamente a la RecursoFactory desarrollada en la semana 3, manteniendo la consistencia de los patrones de diseño.

Validación de Constraints: Se ajustó manualmente el script de SQL para incluir una restricción CHECK, garantizando que la base de datos solo acepte los strings 'admin' o 'usuario'.

**¿Qué descartamos y por qué?**
Se descartó una sugerencia de la IA de almacenar el rol en el almacenamiento local (localStorage) para validaciones; decidimos realizar la consulta siempre a la base de datos para evitar vulneraciones de seguridad en el cliente.

---
## Entrada 006 — Semana 4
**Fecha: 09/04/2026**
**Herramienta: Gemini**
**Responsable: Dev Lead — [Carabajal Valentina, Galeano Priscila]**
**Eje temático: Eje 2**

**¿Para qué se usó?**
Desarrollar el motor de validación de disponibilidad (Tarea #20) y el sistema de gestión de turnos y calendarios (Tarea #12).

**¿Qué generó la IA?**
El algoritmo de detección de solapamiento de rangos horarios y la estructura del archivo TurnoService.ts para gestionar la persistencia de reservas.

**¿Qué aceptamos tal cual?**
La lógica matemática para detectar traslapes: (inicioA < finB) && (finA > inicioB).

**¿Qué modificamos y por qué?**

*Optimización de consultas:* Se modificó la función de obtención de calendario para incluir un select relacional que traiga el nombre del usuario desde la tabla vinculada, permitiendo una visualización más clara en el "Calendario".

*Encapsulamiento de lógica:* Se movió la validación de disponibilidad dentro del método de reserva del TurnoService, asegurando que no se pueda persistir un turno sin haber pasado el control de ocupación.

**¿Qué descartamos y por qué?**
Se descartó el uso de una tabla temporal para el calendario. Optamos por realizar consultas dinámicas filtradas por fecha directamente sobre la tabla turnos para mantener la base de datos normalizada y con datos en tiempo real.

---

## Entrada 007 — Semana 4
**Fecha: 09/04/2026
Herramienta: Gemini
Responsable: Dev Lead — [Carabajal Valentina, Galeano Priscila]
Eje temático: Eje 2**

**¿Para qué se usó?**
Consolidar todas las tareas del sprint en un punto de entrada único (Main.ts) para simular el flujo completo del sistema.

**¿Qué generó la IA?**
Una propuesta de archivo Main.ts con funciones asíncronas para testear la creación de salas y la reserva de turnos de forma secuencial.

**¿Qué aceptamos tal cual?**
La estructura de la función autoejecutable (bootstrap) para iniciar las pruebas del sistema en la consola.

**¿Qué modificamos y por qué?**

*Orquestación de Servicios:* Se reemplazó la lógica directa de Supabase por llamadas a los servicios creados (AdminService, TurnoService), aplicando el principio de abstracción.

---

##Entrada 08 — Semana 6
**Fecha: 08/05/2026
Herramienta: Gemini
Responsable: QA Lead — [Carabajal Valentina, Grasiozetti Luciano]
Eje temático: Eje 3**

**¿Para qué se usó?** 
Generar y estructurar pruebas unitarias con Vitest para validar el comportamiento de los servicios, entidades y patrones implementados en el sistema.

**¿Qué generó la IA?** 
Una propuesta de múltiples archivos de testing automatizado para módulos como AuthService, AdminService, Escritorio, Notificadores y la interfaz Observador, incluyendo mocks de Supabase y simulaciones de distintos escenarios funcionales y de límite.

**¿Qué aceptamos tal cual?**
La estructura base de los tests con describe/it, el uso de mocks con Vitest y la organización de los casos de prueba siguiendo criterios de validación funcional y manejo de errores.

**¿Qué modificamos y por qué?**

Mocking de Servicios: Se ajustaron los mocks de Supabase y AuthService para adaptarlos a la arquitectura real del proyecto y asegurar compatibilidad con los servicios implementados.

Casos de Límite: Se agregaron pruebas adicionales para validar comportamientos extremos, como mensajes vacíos, usuarios inexistentes y objetos sin ID asignado, mejorando la cobertura del sistema.

Trazabilidad Académica: Se incorporó numeración de casos de prueba dentro de cada archivo para facilitar la revisión docente y la identificación de evidencias durante las correcciones.

**¿Qué descartamos y por qué?**
Se descartaron ejemplos genéricos de conexión directa a base de datos y lógica acoplada dentro de los tests, reemplazándolos por mocks para mantener independencia entre pruebas y evitar dependencias externas durante la ejecución.
