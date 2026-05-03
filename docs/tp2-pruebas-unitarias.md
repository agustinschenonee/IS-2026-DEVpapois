### B0. Investigación previa

**1. ¿Qué es una clase de equivalencia y cómo se aplica para diseñar casos de prueba?**

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

**2. ¿Qué es un *valor límite*?**

El *AVL (Análisis de valores límite)* es una técnica de diseño de casos de prueba que complementa a la de particiones de equivalencia. 

La experiencia indica que los casos de prueba que exploran las condiciones límite de un programa producen un mejor resultado para detectar defectos.

La principal diferencia se encuentra en el tratamiento que tienen las clases de equivalencia de rango de valores y de número finito y consecutivo de valores. Ahora la prueba se realizará sobre los valores límite de los rangos.

| Ejemplo del Proyecto | Clase de Equivalencia | Valores Límite (AVL) |
| :--- | :--- | :--- |
| **Capacidad de una Sala de Reunión** (Rango permitido: 1 a 20 personas) | **Clases Válidas:**<br>Cualquier valor entre 1 - 20 (Ej: 10)<br><br>**Clases no válidas:**<br>Menor a 1 (Ej: -5)<br>Mayor a 20 (Ej: 25) | **Casos Válidos:**<br>1 (Mínimo)<br>20 (Máximo)<br><br>**Casos Inválidos:**<br>0 (Justo debajo del mín)<br>21 (Justo encima del máx) |
| **Duración de Reserva de Escritorio** (Valores enteros permitidos: 1, 2, 3, 4 horas) | **Clases Válidas:**<br>Cualquier valor del conjunto {1, 2, 3, 4} (Ej: 2)<br><br>**Clases no válidas:**<br>Menor a 1 (Ej: -2)<br>Mayor a 4 (Ej: 6) | **Casos Válidos:**<br>1 (Límite inferior)<br>4 (Límite superior)<br><br>**Casos Inválidos:**<br>0 (Valor anterior)<br>5 (Valor posterior) |

---

### Análisis de Aplicación Técnica

En nuestro proyecto desarrollado en **TypeScript**, la aplicación de estas técnicas varía según el tipo de dato:

**Valores Reales (Float/Number):**
Si estuviéramos validando el precio de una reserva con descuento donde `x > 5.0`, los valores límite serían `4.99` (inválido) y `5.01` (válido). Esto es crítico para asegurar que los cálculos de impuestos y descuentos no fallen por decimales.

**Valores Enteros (Integer):**
Para la asignación de escritorios en un sector (ej. ID de escritorio entre 1 y 50), los valores límite según la experiencia son los que tienen mayor probabilidad de éxito para encontrar defectos. Probaremos:
    * **Fuera de rango:** `0` y `51`.
    * **En el borde:** `1` y `50`.
    * **Dentro del borde:** `2` y `49`.
ID,Método bajo prueba,Técnica aplicada,Datos de entrada,Resultado esperado
01,validarUsuario(),Partición de Equivalencia,"usuario: ""AgustinSch""",true (Aceptado)
02,validarUsuario(),Valor Límite (Mínimo),"usuario: ""Ag""",false (Rechazado)
03,validarUsuario(),Partición de Equivalencia,"usuario: """"",false (Rechazado)
04,validarRecurso(),Valor Límite (Mínimo),recursoId: 1,true (Aceptado)
05,validarRecurso(),Valor Límite (Borde),recursoId: 0,false (Rechazado)
06,validarRecurso(),Partición de Equivalencia,recursoId: -5,false (Rechazado) 
