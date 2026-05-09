# B0. Investigación previa

## 1. ¿Qué es una clase de equivalencia y cómo se aplica para diseñar casos de prueba?

La técnica de clases de equivalencia es un tipo de prueba funcional, donde en cada caso de prueba se agrupa el mayor número de entradas posibles. A partir de ahí, se asume que la prueba de un valor representativo de cada clase permite suponer que el resultado que se obtiene con él será el mismo que con cualquier otro valor de la clase.

Los pasos a seguir para identificar las clases de equivalencia son:

Identificar las condiciones de las entradas del programa, es decir, restricciones de formato o contenido de los datos de entrada.

A partir de ellas, identificar clases de equivalencia que pueden ser:

* **De datos válidos:** Entradas que el sistema debe procesar normalmente.

* **De datos no válidos o erróneos:** Entradas que deben ser rechazadas o generar un error controlado.

**Ejemplo aplicado al proyecto:**

Para la función cancelarReserva(horasAntelacion), si la regla de negocio exige más de 24 horas para cancelar:
    
* **Clase Válida:** Horas ≥ 25 (Ejemplo: 48 horas).
    
* **Clase Inválida:** Horas entre 0 y 24 (Ejemplo: 10 horas).

Existen algunas reglas que ayudan a identificar las clases:

| Tipo de dato | Ejemplo | Clases de equivalencia |
| :--- | :--- | :--- |
| **Rango de valores de entrada** (Una válida y dos no válidas) | La edad de acceso a un evento está comprendida entre 18 y 100 años. | **Válida:** Entre 18 - 100.<br>**No válidas:** Menor de 18, Mayor de 100. |
| **Número finito y consecutivo** (Una válida y dos no válidas) | Una encuesta puede ser valorada con los valores 0, 1, 2, 3. | **Válida:** Cualquiera de los valores 0, 1, 2, 3.<br>**No válidas:** Menor de 0, Mayor de 3. |
| **Condición verdadero/falso** | Una persona tiene la condición de ser mayor de edad. | **Válida:** Edad >= 18.<br>**No válida:** Edad < 18. |
| **Conjunto de valores admitidos** (Una válida por valor y una no válida) | Una opción de menú acepta 'A' (altas), 'B' (bajas) y 'S' (salir). | **Válidas:** Opción 'A', 'B' o 'S'.<br>**No válida:** Opción 'J'. |

En cualquier caso, si se sospecha que ciertos elementos de una clase no se tratan igual que el resto de la misma, deben dividirse en clases menores.

---

## 2. ¿Qué es un *valor límite*?

El *AVL (Análisis de valores límite)* es una técnica de diseño de casos de prueba que complementa a la de particiones de equivalencia. 

La experiencia indica que los casos de prueba que exploran las condiciones límite de un programa producen un mejor resultado para detectar defectos.

La principal diferencia se encuentra en el tratamiento que tienen las clases de equivalencia de rango de valores y de número finito y consecutivo de valores. Ahora la prueba se realizará sobre los valores límite de los rangos.

| Ejemplo del Proyecto | Clase de Equivalencia | Valores Límite (AVL) |
| :--- | :--- | :--- |
| **Capacidad de una Sala de Reunión** (Rango permitido: 1 a 20 personas) | **Clases Válidas:**<br>Cualquier valor entre 1 - 20 (Ej: 10)<br><br>**Clases no válidas:**<br>Menor a 1 (Ej: -5)<br>Mayor a 20 (Ej: 25) | **Casos Válidos:**<br>1 (Mínimo)<br>20 (Máximo)<br><br>**Casos Inválidos:**<br>0 (Justo debajo del mín)<br>21 (Justo encima del máx) |
| **Duración de Reserva de Escritorio** (Valores enteros permitidos: 1, 2, 3, 4 horas) | **Clases Válidas:**<br>Cualquier valor del conjunto {1, 2, 3, 4} (Ej: 2)<br><br>**Clases no válidas:**<br>Menor a 1 (Ej: -2)<br>Mayor a 4 (Ej: 6) | **Casos Válidos:**<br>1 (Límite inferior)<br>4 (Límite superior)<br><br>**Casos Inválidos:**<br>0 (Valor anterior)<br>5 (Valor posterior) |

---


# B1. Pruebas unitarias con TDD

## Diseño de Casos de Prueba - Turno.ts

La clase bajo prueba es Turno, la cual representa la entidad principal de reserva.

Elegimos realizar pruebas unitarias sobre los métodos de validación de la clase Turno para asegurar la integridad de los datos antes de su persistencia.

* **validarUsuario():** Se encarga de asegurar que el nombre del cliente cumpla con una longitud mínima de 3 caracteres para garantizar datos de contacto válidos.

* **validarRecurso():** Verifica que el identificador del recurso (sala o escritorio) sea un número entero positivo mayor a cero, asegurando la integridad referencial con la base de datos.

| ID | Método bajo prueba | Técnica aplicada | Datos de entrada (Nueva Reserva vs Existente) | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `validarUsuario()` | Partición de Equivalencia | usuario: "AgustinSch" | **true** (Aceptado). |
| **02** | `validarUsuario()` | Valor Límite (Mínimo) | usuario: "Ag" | **false** (Rechazado). |
| **03** | `validarUsuario()` | Partición de Equivalencia | usuario: "" | **false** (Rechazado). |
| **04** | `validarRecurso()` | Valor Límite (Mínimo) | recursoId: 1 | **true** (Aceptado). |
| **05** | `validarRecurso()` | Valor Límite (Borde) | recursoId: 0 | **false** (Rechazado). |
| **06** | `validarRecurso()` | Partición de Equivalencia | recursoId: -5 | **false** (Rechazado). |

## Diseño de Casos de Prueba - ValidadorOcupacion.ts

La función bajo prueba es verificarDisponibilidad, la cual se encarga de detectar traslapes de horarios para un recurso específico en una fecha determinada. El algoritmo utiliza la lógica: (A_inicio < B_fin) Y (A_fin > B_inicio).

| ID | Método bajo prueba | Técnica aplicada | Datos de entrada (Nueva Reserva vs Existente) | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| **07** | `verificarDisponibilidad` | Clase Equivalencia Válida | **Entrada:** 12:00 - 13:00 <br> **Existente:** 10:00 - 11:00 | **True** (Disponible: el horario es posterior y no hay choque). |
| **08** | `verificarDisponibilidad` | Valor Límite (AVL) | **Entrada:** 11:00 - 12:00 <br> **Existente:** 10:00 - 11:00 | **True** (Disponible: empieza justo cuando el anterior termina). |
| **09** | `verificarDisponibilidad` | Clase Equivalencia Inválida | **Entrada:** 10:30 - 11:30 <br> **Existente:** 10:00 - 11:00 | **False** (Ocupado: hay un traslape parcial al final). |
| **10** | `verificarDisponibilidad` | Clase Equivalencia Inválida | **Entrada:** 09:00 - 12:00 <br> **Existente:** 10:00 - 11:00 | **False** (Ocupado: la nueva reserva engloba totalmente a la existente). |
| **11** | `verificarDisponibilidad` | Valor Límite (AVL) | **Entrada:** 10:00 - 11:00 <br> **Existente:** 10:00 - 11:00 | **False** (Ocupado: los horarios son idénticos). |
| **12** | `verificarDisponibilidad` | Clase Equivalencia Válida | **Entrada:** 15:00 - 16:00 <br> **Existente:** (Sin turnos previos) | **True** (Disponible: la lista de turnos en esa fecha está vacía). |

## B2. Framework de pruebas y automatización CI/CD

### Justificación del Framework
Se seleccionó **Vitest** como framework de pruebas unitarias debido a su alto rendimiento y compatibilidad con TypeScript. Originalmente consideramos Jest, pero Vitest ofrece una ejecución casi instantánea y una configuración simplificada al no requerir "traductores" externos como `ts-jest`. Esto optimiza el uso de recursos y facilita el flujo de trabajo colaborativo en la etapa actual de DevPapois.

### Automatización mediante Pipeline (CI/CD)
Para garantizar la integridad del código, configuramos un Pipeline usando **GitHub Actions** mediante el archivo `.github/workflows/test.yml`.
* **Disparador:** El robot se ejecuta automáticamente en cada `push` y `pull request`.
* **Entorno:** Instala Node.js (v24 LTS), descarga las librerías con `npm install` y ejecuta la validación con `npm test`.
* **Bloqueo:** Si algún test falla, el pipeline muestra una cruz roja e impide que el código roto se fusione con la rama principal.

### Evidencias de Ejecución

**1. Capturas del Workflow en GitHub Actions:**
<img width="1157" height="543" alt="image" src="https://github.com/user-attachments/assets/f6137081-2b93-41fe-be55-ad643aba39cb" />

<img width="1163" height="491" alt="image" src="https://github.com/user-attachments/assets/3e7aa257-f8cc-45f4-a527-a13c4bba1ac5" />

**2. Evidencia Audiovisual (Ejecución local en Terminal/IDE):**
En el siguiente video se demuestra la ejecución local de las pruebas directamente desde la terminal, comprobando cómo los casos de prueba pasan correctamente en verde:
▶️ **Video de ejecución:** https://www.youtube.com/watch?v=rA6t-v-fnac. 
