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