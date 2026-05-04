# Parte A – Diseño de Interfaz Centrado en el Usuario (Eje 3)
## A1. Prototipado en Figma
Se desarrolló un prototipo de interfaz para el sistema de reservas de coworking "DevPapois", el cual permite a los usuarios visualizar disponibilidad y realizar reservas de salas de manera sencilla.
El prototipo incluye las siguientes pantallas principales:
- Pantalla de calendario y selección de día
- Pantalla de selección de sala y horario
- Pantalla de confirmación de reserva

El flujo es completamente navegable, permitiendo al usuario avanzar paso a paso desde la selección del día hasta la confirmación final de la reserva. Se implementó un enfoque progresivo, donde las opciones se presentan de manera ordenada para evitar sobrecarga de información.
Se incorporaron elementos visuales como colores (verde para disponible, rojo para ocupado) y feedback en cada interacción, con el objetivo de mejorar la claridad y reducir errores.

El prototipo se encuentra disponible en el siguiente enlace:

https://www.figma.com/make/itjXDT5kbrv3J2XP8AtpBt/Sistema-de-reservas-coworking?t=qDr0WH88r1Fs9Leq-20&fullscreen=1

## A2. Análisis de usuario, tarea y contexto
El sistema está dirigido principalmente a miembros de un espacio de coworking que necesitan reservar salas o escritorios de manera rápida y eficiente. También contempla un perfil de administrador, encargado de gestionar los recursos disponibles, como salas, horarios y disponibilidad.

Los usuarios principales realizan tareas como consultar la disponibilidad de espacios, seleccionar un día y horario, y confirmar una reserva. Estas acciones son frecuentes y requieren ser simples e intuitivas, ya que los usuarios buscan completar el proceso con rapidez y sin cometer errores.

El sistema está diseñado para ser utilizado tanto desde computadoras como dispositivos móviles, en contextos cotidianos de trabajo o estudio. Los usuarios pueden necesitar realizar reservas en momentos de poco tiempo disponible, por lo que la interfaz debe facilitar una interacción ágil.

En este contexto, resulta fundamental minimizar errores, proporcionar feedback claro y permitir completar las tareas principales con la menor cantidad de pasos posibles, garantizando una experiencia de usuario satisfactoria.

## A3. Auditoría de usabilidad según ISO 9241-11

### Criterio 1: Eficiencia

**Métrica definida:**

Tiempo necesario para completar una reserva correctamente.

**¿Cómo se evaluaría en el prototipo actual?**

Se simula que un usuario realiza una reserva utilizando el prototipo. El proceso consiste en seleccionar un día disponible, elegir una sala y finalmente un horario. Gracias al flujo progresivo y la organización por etapas, el usuario puede completar la tarea en pocos pasos y sin necesidad de repetir acciones. 

**Problema detectado:**

Se observa que, si el usuario no visualiza claramente su selección actual, podría generar dudas o realizar acciones innecesarias, afectando la eficiencia.

**Mejora propuesta:**

Se incorpora un resumen en tiempo real de la selección (día, sala y horario), permitiendo al usuario confirmar rápidamente sus elecciones y reducir el esfuerzo cognitivo.

### Criterio 2: Satisfacción

**Métrica definida:**

Nivel de satisfacción percibido del usuario al completar una reserva, medido mediante una escala simple (por ejemplo, de 1 a 5).

**¿Cómo se evaluaría en el prototipo actual?**

Se simula que un usuario completa una reserva en el sistema. Durante el proceso, recibe feedback visual en cada paso, como la selección destacada de opciones y el uso de colores para indicar disponibilidad. Al finalizar, se muestra un mensaje claro de confirmación, lo que genera una sensación de cierre y seguridad. 

**Problema detectado:**

La falta de mensajes claros ante acciones inválidas (por ejemplo, seleccionar un horario ocupado) podría generar confusión o frustración en el usuario.

**Mejora propuesta:**

Se incorporan mensajes de feedback ante acciones inválidas (por ejemplo, “Este horario ya está reservado”) y una confirmación explícita de éxito al finalizar la reserva, mejorando la experiencia general del usuario.

**Relación con ISO 13407 (Diseño Centrado en el Usuario)**

El proceso de diseño del sistema se alinea con los principios de la norma ISO 13407, que propone un enfoque centrado en el usuario.

En primer lugar, se identificaron las necesidades y el contexto de uso de los usuarios del sistema. Luego, se definieron los requisitos de la interfaz en función de dichas necesidades. A partir de esto, se desarrolló un prototipo interactivo en Figma, el cual fue evaluado desde el punto de vista de la usabilidad mediante criterios como eficiencia y satisfacción.

Finalmente, se propusieron mejoras basadas en la evaluación realizada, lo que refleja un proceso iterativo de diseño centrado en el usuario.

Este enfoque permite desarrollar un sistema más intuitivo, eficiente y alineado con las expectativas de los usuarios.

