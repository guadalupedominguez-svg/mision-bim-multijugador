// Situación breve de cada misión por avatar (una o dos frases cortas).
// Las opciones se generan en decision-dilemmas.js; el segundo elemento se conserva vacío por compatibilidad.
module.exports = {
  gol: [
    ['Remodelas un estadio con fecha de entrega. Arquitectura y estructura muestran los vestidores distintos.', []],
    ['Una bajante sanitaria queda al centro del acceso de jugadores.', []],
    ['Quieres modificar la posición de los vestidores, pero esa zona ya tiene cuadrillas asignadas.', []],
    ['El proveedor de butacas y pantallas reserva turno, pero faltan medidas por confirmar.', []],
    ['El estadio está por abrir. Operación necesita saber dónde quedó cada equipo de sonido instalado.', []]
  ],
  yardas: [
    ['Remodelas un estadio con fecha de entrega. Dos planos muestran distinto un acceso de público.', []],
    ['Una columna invade el espacio de la regadera.', []],
    ['Puedes entregar antes una sección de gradas, pero cambia el montaje de otro equipo.', []],
    ['El proveedor de butacas pide la cantidad final de butacas por colores para respetar los tiempos de entrega.', []],
    ['Abre el estadio. Operación necesita el modelo con los cambios de último momento.', []]
  ],
  pista: [
    ['Diriges una remodelación contra reloj. Hay dos versiones de los planos del área de servicio.', []],
    ['La entrada a boxes se ve obstruida por un par de registros.', []],
    ['Puedes adelantar la instalación de V y D, pero ocupas el espacio para cerrar el montaje de HVAC.', []],
    ['El fabricante pide medidas finales de las cortinas para el paddock; falta validar los vanos con construcción.', []],
    ['Previo al inicio de las pruebas libres. El equipo de operación necesita saber qué circuito controla las luces de arrancada.', []]
  ],
  guardian: [
    ['Dos planos ubican la acometida eléctrica de tu torre en puntos distintos.', []],
    ['Una ruta de energía atraviesa el núcleo de la torre.', []],
    ['Mover un ducto ahorra tiempo y genera valor, pero otro equipo usa ese espacio.', []],
    ['El material de las ventanas cambia justo antes de fabricarlas.', []],
    ['La torre está lista. El siguiente guardián debe conocer sus sistemas para programar el mantenimiento.', []]
  ],
  magia: [
    ['Dos pergaminos ubican la primera columna en lugares distintos.', []],
    ['Un ducto de HVAC atraviesa una viga de la academia.', []],
    ['Encuentras espacio para colocar las cámaras de calor que no estaban consideradas en el alcance, pero el espacio ya está ocupado por los detectores de pociones.', []],
    ['El consejo cambia las ventanas justo antes de fabricarlas.', []],
    ['La academia abre. La próxima generación debe encontrar equipos y cambios.', []]
  ],
  rosa: [
    ['Dos bocetos ponen la escalera en lugares distintos.', []],
    ['La iluminación choca con una viga de la casa.', []],
    ['Hay un lugar más factible para una instalación, pero otra especialidad lo necesita.', []],
    ['Cambias el diseño de las puertas cuando ya se van a fabricar.', []],
    ['La casa está lista. Quien la habite necesitará ubicar la posición de las válvulas de los servicios.', []]
  ],
  samurai: [
    ['Dos planos ubican la viga central del salón de sellos manuales en posiciones distintas.', []],
    ['Un ducto atraviesa la viga que sostiene el techo del dojo.', []],
    ['Se comienza con la instalación de las paredes acolchadas del salón de ninjutsu, pero se descubre que se puede mejorar la trayectoria de la red de audio que queda detrás de las paredes.', []],
    ['La escuela cambia algunos diseños de los paneles antes de fabricarlos.', []],
    ['El siguiente maestro necesita saber la ubicación de blancos para practicar su lanzamiento de kunáis.', []]
  ],
  cosmos: [
    ['Dos mapas ubican la plataforma de lanzamiento en lugares distintos.', []],
    ['Una tubería de oxígeno atraviesa una viga del módulo principal.', []],
    ['Hay una ruta más corta para un cable eléctrico, pero la usarán voz y datos.', []],
    ['Cambian las escotillas de acceso justo antes de fabricarlas.', []],
    ['La base entra en operación. La nueva tripulación debe ubicar las válvulas de presurización.', []]
  ],
  bloques: [
    ['Dos instrucciones marcan la misma pieza en posiciones distintas.', []],
    ['El cabezal de la red contraincendios no encaja: atraviesa una viga.', []],
    ['Hay un ensamble más rápido, pero usa conectores de otro módulo.', []],
    ['El cliente quiere ventanas más grandes cuando la fachada ya está en proceso de fabricación.', []],
    ['La ciudad está lista. Alguien más tendrá que saber dónde continuar la segunda etapa.', []]
  ]
};
