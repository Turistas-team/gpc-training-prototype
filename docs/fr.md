# Requisitos funcionales

## Secciones del estudiante

### Pantallas

#### Entrar

- El sistema debe permitir iniciar sesion con correo o handle de Coderforces y Contrasena
- El sistema debe permitir recibir la solicitud de recuperacion de contrasena con su correo
- El sistema debe notificar al profesor/admin sobre la solicitud de de recuperacion de contrasena de una cuenta verificada
- El sistema debe verificar que la solicitud de recuperacoin de contrasena es de un usuario existente

#### Crea tu cuenta

- El sistema debe permitir crear una cuenta con correo, nombre, apellido y contrasena
- El sistema debe validar que la contrasena contenga al menos 8 digitos
- El sistema debe verificar que el correo sea unico
- El sistema debe validar que los campos del formulario de registro no esten vacios
- El sistema debe registrar el handle de codeforces y relacionarlo a una cuenta recientemente creada
- El sistema debe validar que exista el handle de codeforces
- El sistema debe validar si el handle de codeforces ya esta ligado a otra cuenta
- El sistema debe notificar que el handle de codeforces colocado existe y se encuentra disponible
- El sistema debe crear un token para validar la cuenta de codeforces en un tiempo de maximo de 5 minutos
- El sistema debe ser capaz de detectar que el problema de codeforces presente un "Compilation error" en el intervalo de tiempo dado para dar validez al token de creacion
- El sistema debe obtener los datos de rating y rango, problemas resueltos, historial de contests y preparar temas
- El sistema debe crear la cuenta como beginner por defecto, y debe permitir el cambio manual a junior o senior

#### Guía y Práctica

- El sistema debe dividir los temas en los 3 niveles del grupo (beginner, junior y senior)
- El sistema debe dividir los temas en subtemas
- El sistema debe validar si un usuario ha completado manualmente un problema esencial y verificar la proporcion completada personal
- El sistema debe verificar los estados de los problemas de los subtemas de codeforces
- El sistema debe validar si un usuario ha completado manualmente un problema extra
- El sistema debe guardar links de recursos relacionados con el subtema

#### Estadísticas

- El sistema debe calcular los días con soluciones, cantidad de problemas resuletos y subtemas trabajados en intervalo de 7 días, mes actual y total
- El sistema debe calcular la cantidad máxima y mínima de problemas resueltos en un intervalo de 20 semanas, además de calcular la cantidad de problemas de cada día.
- El sistema debe calcular la cantidad de problemas resueltos por mes
- El sistema debe calcular la cantidad de problemas resueltos por subtema de los 3 niveles de estudio (beginner, junior, y senior)
- El sistema debe calcular la cantidad de problemas verificados resueltos por subtema.
- El sistema debe calcular el total de problemas verificados de cada nivel
- El sistema debe calcular el total de problemas del día resuletos por mes, junto a la racha del usuario y su mejor racha.
- El sistema debe calcular la cantidad de duelos en sus 3 posibles resultados (Victorias, Empates, Derrotas)
- El sistema debe calcular el performance de las simulaciones según la categoría
- El sistema debe calcular el promedio del performance de las 10 ultimas simulaciones según la categoría
- El sistema debe calcular el maximo de performance de las soluciones según la categoría
- El sistema debe categorizar el performance según la categoría (Todos, rápida, normal y div. 2)
- El sistema debe guardar la fecha, formato, nivel, cantidad de problemas resueltos, tiempo y performance de cada solución