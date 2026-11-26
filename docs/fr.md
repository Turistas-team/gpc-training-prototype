# Requisitos funcionales

## Secciones del estudiante

### Pantallas

#### Entrar

- RF01: El sistema debe permitir iniciar sesion con correo o handle de Coderforces y Contrasena
- RF02: El sistema debe permitir recibir la solicitud de recuperacion de contrasena con su correo
- RF03: El sistema debe notificar al profesor/admin sobre la solicitud de de recuperacion de contrasena de una cuenta verificada
- RF04: El sistema debe verificar que la solicitud de recuperacoin de contrasena es de un usuario existente

#### Crea tu cuenta

- RF05: El sistema debe permitir crear una cuenta con correo, nombre, apellido y contrasena
- RF06: El sistema debe validar que la contrasena contenga al menos 8 digitos
- RF07: El sistema debe verificar que el correo sea unico
- RF08: El sistema debe validar que los campos del formulario de registro no esten vacios
- RF09: El sistema debe registrar el handle de codeforces y relacionarlo a una cuenta recientemente creada
- RF10: El sistema debe validar que exista el handle de codeforces
- RF11: El sistema debe validar si el handle de codeforces ya esta ligado a otra cuenta
- RF12: El sistema debe notificar que el handle de codeforces colocado existe y se encuentra disponible
- RF13: El sistema debe crear un token para validar la cuenta de codeforces en un tiempo de maximo de 5 minutos
- RF14: El sistema debe ser capaz de detectar que el problema de codeforces presente un "Compilation error" en el intervalo de tiempo dado para dar validez al token de creacion
- RF15: El sistema debe obtener los datos de rating y rango, problemas resueltos, historial de contests y preparar temas
- RF16: El sistema debe crear la cuenta como beginner por defecto, y debe permitir el cambio manual a junior o senior

#### Guía y Práctica

- RF17: El sistema debe dividir los temas en los 3 niveles del grupo (beginner, junior y senior)
- RF18: El sistema debe dividir los temas en subtemas
- RF19: El sistema debe validar si un usuario ha completado manualmente un problema esencial y verificar la proporcion completada personal
- RF20: El sistema debe verificar los estados de los problemas de los subtemas de codeforces
- RF21: El sistema debe validar si un usuario ha completado manualmente un problema extra
- RF22: El sistema debe guardar links de recursos relacionados con el subtema

#### Estadísticas

- RF23: El sistema debe calcular los días con soluciones, cantidad de problemas resuletos y subtemas trabajados en intervalo de 7 días, mes actual y total
- RF24: El sistema debe calcular la cantidad máxima y mínima de problemas resueltos en un intervalo de 20 semanas, además de calcular la cantidad de problemas de cada día.
- RF25: El sistema debe calcular la cantidad de problemas resueltos por mes
- RF26: El sistema debe calcular la cantidad de problemas resueltos por subtema de los 3 niveles de estudio (beginner, junior, y senior)
- RF27: El sistema debe calcular la cantidad de problemas verificados resueltos por subtema.
- RF28: El sistema debe calcular el total de problemas verificados de cada nivel
- RF29: El sistema debe calcular el total de problemas del día resuletos por mes, junto a la racha del usuario y su mejor racha.
- RF30: El sistema debe calcular la cantidad de duelos en sus 3 posibles resultados (Victorias, Empates, Derrotas)
- RF31: El sistema debe calcular el performance de las simulaciones según la categoría
- RF32: El sistema debe calcular el promedio del performance de las 10 ultimas simulaciones según la categoría
- RF33: El sistema debe calcular el maximo de performance de las soluciones según la categoría
- RF34: El sistema debe categorizar el performance según la categoría (Todos, rápida, normal y div. 2)
- RF35: El sistema debe guardar la fecha, formato, nivel, cantidad de problemas resueltos, tiempo y performance de cada solución

#### Ranking

- RF36: El sistema debe clasificar a los usuario por orden según la cantidad de problemas y días activos durante un rango de inicio y final (ciclos de universidad).
- RF37: El sistema debe comparar el cambio de la posición del miembro con la anterior semana.
- RF38: El sistema debe clasificar de manera generar y por nivel.

#### Logros

- RF39: El sistema debe permitir la asignación de logros de manera manual.
- RF40: El sistema debe conectar con Codeforces para la verificación de logros específicos.
- RF41: El sistema debe clasificar los logros en obtenidos y pendientes.

#### Perfil

- RF42: El sistema debe almacenar los problemas resueltos en el ciclo, los días activos, la racha actual de días y el mejor performance con modo y fecha.
- RF24 - RF26
- RF43: El sistema debe filtrar las últimas 4 simulaciones con fecha, formato, cantidad de problemas resueltos y performance.
- RF44: El sistema debe obtener el rating actual, nivel, cantidad de problemas resueltos en total, cantidad de problemas resueltos en el año, cantidad de contests en las que se participaron y mejor puesto en un contest. Todos los datos de codeforces
- RF45: El sistema debe obtener el rating máximo junto a la fecha, de Codeforces.
- RF46: El sistema debe obtener los datos históricos de los contests (fecha) y cambio de rating, de Codeforces.
- RF47: El sistema debe obtener la cantidad máxima y mínima de problemas resueltos en el último año, de Codeforces.
- RF48: El sistema debe obtener la cantidad de problemas resueltos por día en el último año, de Codeforces.
- RF49: El sistema debe obtener la cantidad de problemas resuletos en el último mes, la racha máxima de días, la racha máxima del año y la racha máxima del mes, de Codeforces.
- RF50: El sistema debe obtener el mayor rating de los problemas resueltos por día durante el último año, de Codeforces.
- RF51: El sistema debe obtener el rating de todos los problemas resueltos que pertecen a un contest de codeforces.
- RF52: El sistema debe obtener la letra de los problemas resueltos de un contest de Codeforces.
- RF53: El sistema debe calcular el promedio de rating para todos los problemas resueltos con rating de codeforces.
- RF54: El sistema debe obtener el máximo y mínimo delta del rating provocado por un contest con fecha, de Codeforces.
- RF55: El sistema debe obtener la fecha del primer AC en codeforces.
- RF56: El sistema debe obtener la cantidad de problemas resueltos por tema, de Codeforces.
- RF57: El sistema debe obtener cantidad de envíos por estado, de Codeforces.
- RF58: El sistema debe guardar el registro de los últimos 8 contests, con fecha, nombre del contest (con link), puesto, diferencia de rating y rating final, de Codeforces.
- RF59: El sistema debe obtener el rating máximo, problemas resueltos, envíos (con estados), problema más dífícil, rating promedio, contests normales y contests virtuales de la semana, de Codeforces.
- RF60: El sistema debe guardar los problemas con envíos y sin AC, de Codeforces (con número, letra y link).
- RF61: El sistema debe guardar el puesto en el nivel del gpc, puesto general y fecha de entrada al grupo de estudio.

#### General

- RF62: El sistema debe asignar rangos de rating a nivel de Codeforces