**Nombre del grupo:** DEVpapois

**Nombre del proyecto:** Sistema de reservas para espacio de coworking

| Nombre              | Rol                   | GitHub                        |
|---------------------|-----------------------|-------------------------------|
| Agustin Schenone    | Scrum Master          | @agustinschenone@outlook.com  |
| Priscila Galeano    | Dev Lead              | @priiscigaleano@gmail.com     |
| Valentina Carabajal | Dev Lead & QA Lead    | @vcarabajal94@gmail.com       |
| Luciano Grasiozetti | QA Lead               | @lucianograsiozetti@gmail.com |
| Nicolás Aguilera    | UX Lead               | @nicolasaguilera7914@gmail.com|

**Descripción del proyecto:**
Sistema de gestión de coworking orientado a la optimización de espacios físicos, que centraliza la reserva de salas y escritorios mediante un motor de disponibilidad en tiempo real.

Links:
- Tablero Kanvan: https://github.com/users/agustinschenonee/projects/1/views/1 
- Reporte Semanal:

**Patrones seleccionados:**

- _Observer:_ Lo utilizaremos debido a que le permite al codigo mantenerse actualizado en situaciones donde se necesita una reaccion en tiempo real. El caso de uso por el que lo elegimos es para actualizar la tabla del calendario cuando se realice un cambio en la base de datos de los turnos.

- _Factory:_ Lo utilizaremos porque nos aporta una flexibilidad al crear y asignar valores a las salas. El caso de uso mas importante es el de la creacion de salas, asignando correctamente la capacidad y el tamaño a la sala.
