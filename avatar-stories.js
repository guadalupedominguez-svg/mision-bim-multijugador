// Situación breve de cada misión por avatar (una o dos frases cortas).
// Las opciones se generan en decision-dilemmas.js; el segundo elemento se conserva vacío por compatibilidad.
module.exports = {
  gol: [
    ['Remodelas un estadio con fecha de entrega. Arquitectura y estructura muestran los vestidores distintos.', []],
    ['Una instalación choca con el acceso de jugadores.', []],
    ['Quieres mover los vestidores, pero esa zona ya tiene cuadrillas asignadas.', []],
    ['El proveedor de butacas y pantallas reserva turno, pero faltan medidas por confirmar.', []],
    ['Abre el estadio. Operación necesita saber dónde quedó cada equipo.', []]
  ],
  yardas: [
    ['Remodelas un estadio con fecha de entrega. Dos planos muestran distinto un acceso de público.', []],
    ['Una ruta de evacuación cruza el espacio de otra especialidad.', []],
    ['Puedes abrir antes unas gradas, pero cambia el montaje de otro equipo.', []],
    ['El proveedor de butacas pide las medidas finales.', []],
    ['Abre el estadio. Operación necesita ubicar equipos y cambios.', []]
  ],
  pista: [
    ['Diriges una remodelación contra reloj. Hay dos versiones de los planos del área de servicio.', []],
    ['Unas instalaciones cruzan el acceso de servicio.', []],
    ['Puedes adelantar las pantallas, pero ocupas el espacio de otra instalación.', []],
    ['El fabricante pide medidas finales de pantallas; falta un dato de campo.', []],
    ['Cruzas la meta. El equipo de operación necesita saber qué cambió.', []]
  ],
  guardian: [
    ['Dos mapas ubican la base de tu torre en puntos distintos.', []],
    ['Una ruta de energía atraviesa el núcleo de la torre.', []],
    ['Mover un conducto ahorra tiempo, pero otro equipo usa ese espacio.', []],
    ['La ciudad cambia las ventanas justo antes de fabricarlas.', []],
    ['La torre está lista. El siguiente guardián debe conocer sus sistemas.', []]
  ],
  magia: [
    ['Dos pergaminos ubican la primera columna en lugares distintos.', []],
    ['Un conducto mágico atraviesa una viga de la academia.', []],
    ['Hallas un pasaje más corto, pero ocupa el espacio de otra sala.', []],
    ['El consejo cambia las ventanas justo antes de fabricarlas.', []],
    ['La academia abre. La próxima generación debe encontrar equipos y cambios.', []]
  ],
  rosa: [
    ['Dos bocetos ponen la escalera en lugares distintos.', []],
    ['La iluminación choca con una viga de la casa.', []],
    ['Hay un lugar más vistoso para una instalación, pero otra especialidad lo necesita.', []],
    ['Cambias el tamaño de las ventanas cuando ya se van a fabricar.', []],
    ['La casa está lista. Quien la opere necesitará ubicar sus equipos.', []]
  ],
  samurai: [
    ['Dos planos ubican el pilar central del dojo en posiciones distintas.', []],
    ['Un conducto atraviesa la viga que sostiene el techo.', []],
    ['Hay un camino más corto para los servicios, pero invade el área de entrenamiento.', []],
    ['La escuela cambia las ventanas antes de fabricar los paneles.', []],
    ['El dojo abre. El siguiente maestro necesita saber dónde quedó cada sistema.', []]
  ],
  cosmos: [
    ['Dos mapas ubican el soporte de lanzamiento en lugares distintos.', []],
    ['Una tubería de oxígeno atraviesa una viga del módulo principal.', []],
    ['Hay una ruta más corta para un cable, pero otro módulo la usará.', []],
    ['Cambian las ventanas de observación justo antes de fabricarlas.', []],
    ['La base entra en operación. La nueva tripulación debe ubicar equipos y cambios.', []]
  ],
  bloques: [
    ['Dos instrucciones ponen el mismo soporte en posiciones distintas.', []],
    ['Una pieza de instalaciones no encaja: atraviesa una viga.', []],
    ['Hay un ensamble más rápido, pero usa conectores de otro módulo.', []],
    ['El cliente quiere ventanas más grandes cuando la fachada ya está separada.', []],
    ['La ciudad está lista. Alguien más tendrá que mantenerla o ampliarla.', []]
  ]
};
