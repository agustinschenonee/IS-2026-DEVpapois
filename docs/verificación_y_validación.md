Actividad 16/05

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

