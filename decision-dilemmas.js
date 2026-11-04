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
  'Hay personal y materiales reservados para hoy. Una revisión completa detendría el frente; una decisión rápida puede trasladar la incertidumbre a quien construye.',
  'La instalación inicia esta tarde y liberar todo el frente retrasaría a dos equipos. Necesitas decidir qué se puede ejecutar y qué debe quedar en espera.',
  'El cambio promete ahorrar tiempo ahora, pero otras especialidades ya tienen espacio y recursos asignados.',
  'El proveedor necesita una instrucción hoy para mantener su turno de fabricación. Todavía falta confirmar un detalle con obra.',
  'La entrega tiene fecha fija. El cliente necesita información utilizable y el equipo no puede verificar cada elemento con el mismo detalle.'
];
function choices(avatar, round) {
  const x = (elements[avatar] || elements.gol)[round];
  return [
    [
      `Reviso con los dos responsables solo la zona conflictiva relacionada con «${x}»; libero el resto y emito una versión común para esa zona.`,
      `Libero la información de «${x}» con una condición y un punto de verificación antes de ejecutar la parte afectada; el equipo de campo conserva el control.`,
      `Uso la versión más reciente de «${x}» para no perder la jornada y dejo la discrepancia para la reunión de mañana.`
    ],
    [
      `Separo el frente afectado por «${x}», coordino a las dos especialidades y libero el resto con una ruta revisada.`,
      `Autorizo un tramo reversible de «${x}» hasta un punto de espera; confirmaremos la ruta definitiva antes de cerrar.`,
      `Permito que el equipo ajuste «${x}» durante el montaje y documento la solución al terminar el turno.`
    ],
    [
      `Detengo todo el frente relacionado con «${x}» hasta reunir a todas las especialidades; rehago la secuencia de montaje antes de ejecutar.`,
      `Pruebo «${x}» en un tramo limitado y reversible; confirmo con el otro equipo antes de extenderlo al resto.`,
      `Ejecuto «${x}» en todo el frente para aprovechar la oportunidad y comunico el cambio en el reporte del día.`
    ],
    [
      `Congelo solo las piezas afectadas en «${x}»; confirmo medidas y libero una versión nueva para fabricación.`,
      `Inicio las piezas de «${x}» que no cambian y dejo las restantes sujetas a una verificación de campo mañana.`,
      `Confirmo «${x}» por llamada para conservar el turno de fábrica y actualizo los documentos cuando lleguen las piezas.`
    ],
    [
      `Priorizo los elementos críticos de «${x}», verifico su ubicación real y vinculo sus datos al registro final antes de entregar.`,
      `Entrego la información de «${x}» con fotografías y una lista de excepciones asignadas para conciliar después de la apertura.`,
      `Uso los últimos documentos aprobados para «${x}» como registro final y atiendo diferencias cuando operación las detecte.`
    ]
  ][round];
}
module.exports = { pressure, choices };
