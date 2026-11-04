// Tres estrategias plausibles por etapa. El orden se mezcla por jugador en el servidor.
// Los índices internos conservan la misma regla de retrabajo para todos los avatares.
const elements = {
  gol: ['planos de vestidores','ruta de acceso de jugadores','nueva distribución de vestidores','butacas y pantallas','equipos del estadio'],
  yardas: ['planos del acceso de público','rutas de evacuación','montaje de gradas','señalización y butacas','sistemas del estadio'],
  pista: ['planos del área de servicio','ruta de servicio','montaje de pantallas','soportes y pantallas','equipos del estadio'],
  guardian: ['mapa de la torre','ruta de energía','nuevo recorrido','ventanas de la torre','sistemas de la torre'],
  magia: ['pergaminos de la academia','conducto encantado','pasaje nuevo','ventanas de la torre','salas de la academia'],
  rosa: ['bocetos de la casa','ruta de iluminación','nueva ubicación','ventanas de la casa','equipos de la casa'],
  samurai: ['planos del dojo','ruta del conducto','camino alternativo','paneles del dojo','sistemas del dojo'],
  cosmos: ['mapas de la base','tubería de oxígeno','ruta del cable','ventanas de observación','equipos de la base'],
  bloques: ['instrucciones de ensamble','pieza de instalaciones','módulo alternativo','piezas de fachada','módulos de la ciudad']
};
const pressure = [
  'Una revisión completa detendría la obra hoy.',
  'El montaje empieza esta tarde.',
  'Las cuadrillas esperan tu instrucción.',
  'El proveedor necesita la orden hoy.',
  'La fecha de entrega es fija.'
];
function choices(avatar, round) {
  const x = (elements[avatar] || elements.gol)[round];
  return [
    [
      `Reviso solo la zona en conflicto de «${x}» con ambos responsables y emito una versión común.`,
      `Libero «${x}» con una condición: verificar antes de ejecutar la parte afectada.`,
      `Uso la versión más reciente de «${x}» y dejo la diferencia para mañana.`
    ],
    [
      `Aparto la zona de «${x}», coordino a ambas especialidades y libero el resto.`,
      `Autorizo un tramo de «${x}» hasta un punto de espera; la ruta final se confirma después.`,
      `Dejo que el equipo ajuste «${x}» en el montaje y lo documento al final.`
    ],
    [
      `Detengo todo el frente de «${x}» hasta reunir a todas las especialidades.`,
      `Pruebo «${x}» en un tramo pequeño y reversible; confirmo antes de extenderlo.`,
      `Hago «${x}» en todo el frente y aviso en el reporte del día.`
    ],
    [
      `Congelo solo las piezas de «${x}» que cambian, confirmo medidas y libero versión nueva.`,
      `Fabrico las piezas de «${x}» que no cambian; el resto espera verificación mañana.`,
      `Confirmo «${x}» por llamada y actualizo los documentos cuando lleguen las piezas.`
    ],
    [
      `Verifico los elementos críticos de «${x}» y los vinculo al registro final.`,
      `Entrego «${x}» con fotos y una lista de pendientes por conciliar.`,
      `Entrego los últimos planos aprobados de «${x}» y atiendo diferencias después.`
    ]
  ][round];
}
module.exports = { pressure, choices };
