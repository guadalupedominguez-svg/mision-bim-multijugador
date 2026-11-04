# BIM: Construye tu misión

Prototipo de una actividad multijugador posterior a una plática sobre BIM. Cada participante avanza a su ritmo, elige un personaje original y construye un edificio propio. Las decisiones muestran consecuencias entre diseño, construcción y operación. No se presentan respuestas incorrectas: cada opción implica una cantidad de retrabajo y una forma distinta de avanzar el proyecto.

Cada avatar tiene una imagen panorámica original de su propio edificio en construcción, mostrada como fondo y revelada por etapas. Incluye un perfil para amantes de los bloques de construcción, con una ciudad modular colorida. El estilo de aventura usa paneles oscuros, tipografía cálida y una escena amplia.

Las cinco preguntas también cambian según el avatar. La situación y las opciones usan su mundo (deporte, carrera, bloques, fantasía, etc.) para representar procesos de planificación, coordinación, control de cambios y entrega de información. Las decisiones incluyen presión de tiempo, información incompleta y frentes de trabajo que no pueden detenerse por completo. El orden de las tres respuestas cambia en cada partida. En la tercera misión, una prueba limitada y reversible puede evitar más retrabajo que detener todo el frente. Si una solución improvisada deja incertidumbre y la siguiente decisión depende de una verificación parcial, se suma un retrabajo por arrastre. Tras cada decisión, el juego explica su efecto en la obra sin mostrar aún el puntaje de retrabajo.

El catálogo completo para revisión está en `PREGUNTAS_POR_PERFIL.md`. Si se editan las preguntas o las reglas, se actualiza con `node scripts/export-questions.js`.

## Ejecutar

Requiere Node.js 20 o posterior. En PowerShell, dentro de esta carpeta, ejecutar `node server.js` y abrir `http://localhost:3000`. Para usar otros dispositivos de la misma red, abrir `http://IP_DEL_EQUIPO:3000` (el firewall debe permitir la conexión). No hace falta crear una sala ni coordinar el inicio.

Cada persona elige nombre y avatar, responde cinco misiones (incluida una sobre coordinación de planos) y ve una escena propia del edificio de su avatar revelarse por etapas. Cada pregunta tiene 75 segundos de límite para leer las decisiones con sus restricciones. Si se agota el tiempo, la pregunta se registra como «Tiempo agotado» y genera 2 puntos de retrabajo. Se puede cambiar la duración al iniciar con la variable de entorno `QUESTION_SECONDS` (mínimo 5 segundos). El retrabajo individual y el resultado final se muestran cuando la persona termina las cinco misiones. La pantalla final muestra el retrabajo por etapa, la opción con menos retrabajo en cada etapa donde hubo ajustes y el concepto BIM que ilustra, además de un botón para iniciar otra misión. Las opciones también se pueden elegir con las teclas A, B y C. Durante el juego, las posiciones provisionales se basan solo en etapas completadas. Los empates en retrabajo comparten lugar.

El servidor imprime una URL privada de host al iniciar. Ábrela en el navegador del host para observar en tiempo real nombres, avatares, etapa, tiempo restante y participantes finalizados. La URL contiene una clave de acceso; compártela solo con quien deba ver ese tablero. Desde esa vista también puedes ver el resultado final y el retrabajo del grupo por etapa, proyectar un podio a pantalla completa, descargar los resultados en CSV (decisión y retrabajo de cada etapa por participante) y reiniciar la sesión para borrar las partidas antes de un nuevo grupo. Si reinicias el servidor, cambia la clave y se pierden las partidas en memoria.

## Alcance

Las partidas y el marcador se guardan solo en memoria y se pierden al reiniciar el servidor. Los puntos de retrabajo son reglas ilustrativas del juego; no equivalen a horas o costos reales ni constituyen una evaluación validada de conocimientos BIM. Antes de usar el juego para investigación formal, habría que revisar los escenarios y validar la medición.
# Versión para compartir como un solo HTML

Ejecuta `npm run export:html` desde la carpeta del proyecto. Esto crea `BIM-Mision-Individual.html`, que incluye las nueve escenas y se puede compartir y abrir con doble clic, sin instalar Node.js. Cada equipo guarda su partida en su propio navegador.

Esta versión es individual: no sincroniza clasificaciones ni alimenta la vista del host.

## Publicación del juego multijugador

El repositorio de GitHub contiene el código y las escenas, pero GitHub Pages no ejecuta `server.js`. Para que jugadores de distintas redes compartan el mismo marcador, despliega el repositorio como **Web Service** en Render. El archivo `render.yaml` configura el servicio Node, su comprobación de salud y una clave privada para el host. Comparte la dirección `https://...onrender.com/` con los participantes. La dirección del host es la misma con `/host.html?key=...`; la clave se consulta en los registros de inicio del servicio y debe mantenerse privada.

En el plan gratuito, Render puede suspender el servicio después de 15 minutos sin visitas y reiniciarlo cuando llegue una nueva; un reinicio borra las partidas que están en memoria. Abre el juego antes de la exposición y mantén la actividad continua durante la competencia. Para una sesión que deba conservar resultados ante reinicios, se necesita almacenamiento persistente.

## Competencia con participantes en redes distintas

En la computadora de la presentación, haz doble clic en `Iniciar-presentacion.cmd` o ejecuta `node scripts/start-presentation.js`. La ventana imprimirá dos direcciones HTTPS: **PARTICIPANTES**, que se comparte con todos, y **HOST (privado)**, que solo abre quien presenta. La vista del host también tiene un botón para copiar el enlace de participantes. Cada persona puede empezar cuando quiera; el servidor reúne sus avances y resultados.

Mantén abierta la ventana y la computadora conectada a internet durante la actividad. Pulsa Ctrl+C al terminar. El enlace público cambia en cada inicio y las partidas se pierden si se cierra el servidor. Este modo usa un túnel temporal de Cloudflare y requiere `tools/cloudflared.exe` en la carpeta del proyecto. `BIM-Mision-Individual.html` sigue disponible para práctica individual sin conexión.

