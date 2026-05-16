1. Verificación vs Validación: Con sus palabras, ¿cuál es la diferencia clave? Pongan un ejemplo de cada una en su proyecto. 
La diferencia 
Verificación: Es revisar si el sistema está bien construido a nivel técnico. ¿Cumple con las reglas y el diseño?
Validación: Es revisar si el sistema le sirve al usuario real. ¿Hace lo que el cliente necesita?
Ejemplos en nuestro proyecto
Ejemplo de Verificación: Ejecutar los tests unitarios o controlar que las tablas usuarios y turnos estén bien conectadas con sus Foreign Keys en Supabase. Revisamos que el código no tenga errores técnicos.
Ejemplo de Validación: Probar que un usuario pueda entrar a la interfaz, loguearse con su cuenta y reservar una sala de juntas con éxito. Confirmamos que la app le funciona y le es útil.
2. Planificación de V&V: Si tuvieran que planificar la verificación y validación para el próximo sprint (1 semana), ¿qué dos actividades concretas incluirían?
   Incluiríamos dos actividades enfocadas en la estabilización del sistema. Para asegurar la verificación técnica incluiríamos la automatización de pruebas de integración, incorporando nuevas      herramientas de testing como Sinon.js para el manejo de dobles de prueba (Mocks y Stubs), aislando la lógica del sistema de dependencias externas. Para la validación complementamos con el diseño y ejecución de pruebas de aceptación asegurando que el comportamiento del sistema responda a las necesidades reales del usuario.

4. Inspecciones de software: ¿En qué se diferencia una inspección de código de una prueba automática? ¿Cuándo conviene más una que la otra?:
Una inspección de código es una revisión manual y estática realizada por personas para evaluar la estructura, calidad y mantenibilidad del diseño, mientras que una prueba automática es una validación dinámica ejecutada por una máquina para asegurar el funcionamiento correcto del sistema; conviniendo la primera para prevenir malas prácticas o problemas de arquitectura, y la segunda para garantizar rápidamente que los nuevos cambios no rompan funcionalidades existentes.

5. Análisis estático automatizado: Nombre una herramienta que conozcan (SonarQube, ESLint, Pylint, etc.) y digan qué tipo de error podría encontrar en su código sin ejecutarlo. 
 Una herramienta de Análisis Estático automatizado que podríamos utilizar es “ESLint”. Este tipo de herramientas analiza el código sin ejecutarlo y permite detectar errores de sintaxis (llaves mal cerradas, formatos incorrectos), variables no utilizadas o posibles malas prácticas. En nuestro proyecto podría ayudarnos a identificar problemas con el uso de JavaScript y a mantener una estructura limpia y consistente.

6. Métodos formales de verificación: ¿Para qué tipo de sistemas son imprescindibles? ¿Por qué no se usan siempre?
 Los métodos formales de verificación son imprescindibles en sistemas críticos, como sistemas médicos, aeronáuticos o industriales, donde un error puede generar consecuencias muy graves. Estos métodos utilizan modelos matemáticos y lógicos para demostrar que el sistema cumple correctamente con ciertas propiedades. No se utilizan siempre porque son complejos, requieren de mucho tiempo y de especialistas capacitados, además de tener un costo elevado. En proyectos más pequeños o no críticos, normalmente se utilizan pruebas automatizadas tradicionales en lugar de verificación formal completa. Algunos ejemplos de métodos formales son el model checking, la verificación de teoremas y las máquinas de estados formales. Estos métodos permiten modelar y demostrar matemáticamente que un sistema cumple determinadas reglas o comportamientos esperados. 

7. Reuniones de validación en Scrum/XP: ¿Qué rol cumple el Product Owner en una Sprint Review? ¿Cómo se relaciona con las pruebas automatizadas? 
En la Sprint Review, el Product Owner actúa como la voz del cliente para validar con honestidad el incremento del producto frente a los criterios de aceptación, aprobando el trabajo o rechazando la funcionalidad si hubo errores o no se cumplió la Definition of Done. En este contexto, el PO se apoya ciegamente en las pruebas automatizadas porque estas actúan como una red de seguridad técnica previa a la reunión; garantizan que el software integrado funciona correctamente, permitiéndole concentrarse de lleno en evaluar el valor de negocio y la experiencia del usuario sin tener que preocuparse por buscar bugs.


--- 

## SECCIÓN 1: Verificación vs Validación (2 ítems) 
1. Escribir una frase que describa UNA verificación que ya hacen en su proyecto (ej: pruebas unitarias).(Probablemente ya lo hayan hecho)
2. Escribir una frase que describa UNA validación que planean hacer con el Product Owner.

- Una verificación que ya hacen en su proyecto:
Ejecutamos pruebas unitarias automatizadas con Vitest para verificar que las funciones de reserva no permitan la colisión de horarios y que la base de datos relacione correctamente las tablas de usuarios y espacios.

- Una validación que planean hacer con el Product Owner:
Planeamos hacer una sesión de "User Testing" con el Product Owner para validar que la interfaz de reserva sea intuitiva, rápida y que realmente le sirva a los miembros para agendar un espacio de coworking en menos de tres clics.


## SECCIÓN 2: Planificación de V&V (tabla) 
Completar para los próximos 2 sprints (cada sprint = 1 semana real):

| Sprint | Actividad de V&V | Técnica | Responsable | Herramienta |
|--------|------------------|---------|-------------|--------------|
| Actual | (ej: revisar API) | Inspección | QA Lead | Checklist |
| Próximo | (ej: probar carga) | Estrés automático | Dev Lead | JMeter |


| Sprint | Actividad de V&V | Técnica | Responsable | Herramienta |
| :--- | :--- | :--- | :--- | :--- |
| **Actual** | Verificar la consistencia de las tablas de Supabase y corregir las rutas de registro/login. | Inspección de Código y Pruebas Unitarias | Priscila / Valentina (Dev Leads) | VS Code y Supabase |
| **Próximo** | Validar el flujo completo de reservas y la experiencia del usuario final en la interfaz. | Pruebas de Aceptación y Usabilidad (User Testing) | Nicolás (UX Lead) / Luciano (QA Lead) | Navegador Web y Figma |

## SECCIÓN 3: Inspección y análisis estático 
a) ¿Qué archivo o módulo de su proyecto inspeccionarían primero? ¿Por qué?
El primer módulo que inspeccionaríamos sería ValidadorOcupacion.ts, ya que es una parte crítica del sistema encargada de verificar la disponibilidad de salas y escritorios antes de realizar una reserva. Un error en esta lógica podría provocar conflictos como dobles reservas o asignaciones inválidas de horarios. Además, al tratarse de una funcionalidad central del sistema, resulta importante revisar tanto la lógica implementada como el manejo correcto de los datos recibidos. 


b) Elijan una herramienta de análisis estático y digan qué regla aplicarían primero.
Como herramienta de análisis estático utilizaríamos ESLint, ya que permite analizar el código TypeScript/JavaScript sin ejecutarlo y detectar posibles errores o malas prácticas, de esta forma, complementamos también a las pruebas unitarias. Una de las primeras reglas que aplicaríamos sería la detección de variables no utilizadas (no-unused-vars), debido a que ayuda a mantener el código más limpio, evitar confusiones y mejorar la mantenibilidad del proyecto. También resulta útil para detectar errores de sintaxis y problemas comunes en el desarrollo frontend. 



## SECCIÓN 4: Método formal conceptual 
a) Describan un invariante para una clase o función importante de su sistema.
   Ejemplo: “En la clase Reserva, el campo fecha_fin siempre es posterior a fecha_inicio”.

Una invariante es una regla o condición matemática que siempre debe cumplirse durante la ejecución del sistema, sin importar la acción que realice el usuario. Para nuestro sistema la invariante más importante del componente ValidadorOcupacion es: 
“Un recurso nunca puede tener dos reservas confirmadas y que sus intervalos de tiempo se superpongan o choquen entre sí.”
Esta invariante asegura la consistencia física, dos personas no pueden ocupar el mismo espacio al mismo tiempo. El sistema valida que no haya choques utilizando este componente.

b) Expliquen cómo lo probarían (con una prueba unitaria que verifique esa propiedad).

Para probarlo utilizaremos Vitest (nuestro framework de testing), respaldandose en la técnica de Análisis de Valores Límite (AVL). Específicamente en nuestro archivo de pruebas ocupacion.test.ts, probamos escenarios límite: garantizamos que la matemática del código que calcula la invariante no tenga errores de programación con los signos de mayor/menor estricto (> vs >=). Si la prueba de límite pasa, nos aseguramos de que el motor de reservas jamás permitirá un overbooking. 


## SECCIÓN 5: Reunión de validación (simulación) 
Escriban dos preguntas que le harían al Product Owner en la próxima Sprint Review para validar que el sistema resuelve el problema real.

1- ¿Hay algo en este flujo de reservas que sientas que no aporta valor real al cliente o que resulte más engorroso que su forma de trabajar actual?

2- Considerando los imprevistos diarios en la gestión de los espacios, ¿creés que el sistema maneja las excepciones y cancelaciones con la flexibilidad que realmente necesitan los administradores en la vida real, o nos estamos quedando cortos frente a la necesidad del negocio?
