// Cada fila contiene: situación del avatar y tres decisiones equivalentes
// a coordinar, comunicar parcialmente e improvisar en campo.
module.exports = {
  gol: [
    ['Eres dueño de un estadio en remodelación y tienes una fecha contractual de entrega. Arquitectura y estructura entregan planos distintos para la zona de vestidores; cada día de espera presiona el calendario.', []],
    ['Como dueño, revisas el acceso de jugadores: una instalación y la ruta prevista ocupan el mismo espacio. Obra necesita saber qué tramo puede iniciar.', []],
    ['Para mejorar la experiencia de los equipos propones cambiar la distribución de vestidores. La nueva posición afecta instalaciones que ya tienen cuadrillas asignadas.', []],
    ['Una decisión sobre butacas y pantallas llega cuando el proveedor reserva su turno de fabricación. Diseño y obra aún deben confirmar medidas.', []],
    ['Se acerca la apertura del estadio. Como dueño, necesitas entregar a operación la ubicación real de equipos, garantías y cambios ejecutados.', []]
  ],
  yardas: [
    ['Eres dueño de un estadio en remodelación. Dos versiones del playbook de obra muestran dimensiones distintas para un acceso de público y la fecha contractual de entrega se acerca.', []],
    ['El avance hacia la zona de anotación depende de que las rutas de evacuación y las instalaciones se coordinen. Una de las rutas previstas cruza el espacio de otra especialidad.', []],
    ['Una nueva jugada permitiría abrir antes una zona de gradas, pero cambia la secuencia de montaje y el espacio reservado para otro equipo.', []],
    ['El proveedor de señalización y butacas pide medidas definitivas hoy. Como dueño, debes decidir qué liberar antes de que se cierre la ventana de fabricación.', []],
    ['El marcador final será la apertura del estadio. Operación necesita ubicar equipos y comprender los ajustes realizados durante la remodelación.', []]
  ],
  pista: [
    ['Eres el team principal de una remodelación contra reloj: el estadio debe entregarse en la fecha contractual. Ingeniería y obra presentan dos versiones de los planos para el área de servicio.', []],
    ['Como en una entrada a boxes, cada equipo necesita una ruta libre. Un tendido de instalaciones cruza el acceso de servicio que usará la operación del estadio.', []],
    ['Una parada estratégica permitiría adelantar el montaje de pantallas. Ese cambio mueve cuadrillas y ocupa el espacio reservado para otra instalación.', []],
    ['Antes de la bandera a cuadros, el fabricante pide las dimensiones finales de pantallas y soportes. Un dato de campo sigue pendiente de confirmar.', []],
    ['La obra llega a la meta y el siguiente equipo operará el estadio. Necesita localizar equipos y conocer qué cambió durante la carrera de remodelación.', []]
  ],
  guardian: [
    ['Dos mapas de la ciudad sitúan la base de tu torre en puntos diferentes. El equipo está listo para iniciar.', ['Comparo mapas con los especialistas y publico la ubicación acordada.', 'Marco la diferencia y programo una revisión posterior.', 'Envío ambos mapas y dejo que el equipo decida al llegar.']],
    ['Una ruta de energía atraviesa el núcleo de la torre. ¿Cómo proteges la misión?', ['Reúno a los responsables y coordino una ruta segura.', 'Mando un croquis provisional sin actualizar el mapa central.', 'Dejo que el equipo esquive el núcleo durante la instalación.']],
    ['Aparece una amenaza y propones mover un conducto para ganar tiempo. Otro equipo usa ese espacio.', ['Consulto a los equipos y registro el nuevo recorrido.', 'Pido aprobación por radio y guardo evidencia para después.', 'Hago el cambio de inmediato y aviso al terminar.']],
    ['La ciudad pide cambiar las ventanas de la torre cuando están por fabricarse.', ['Confirmo el cambio y distribuyo planos actualizados.', 'Aviso al taller y actualizo el registro más tarde.', 'Lo comento en la reunión y confío en que todos se adapten.']],
    ['La torre queda lista. El siguiente guardián debe conocer todos sus sistemas.', ['Verifico los sistemas y dejo un mapa completo de lo instalado.', 'Entrego fotos y notas para que las relacionen.', 'Entrego el mapa original y atiendo dudas futuras.']]
  ],
  magia: [
    ['Dos pergaminos ubican la primera columna de la academia en lugares distintos. Los constructores esperan tu señal.', ['Comparo los pergaminos con ambos maestros y sello una versión única.', 'Anoto la diferencia y dejo el pergamino definitivo para después.', 'Entrego los dos pergaminos y dejo que el equipo elija en el sitio.']],
    ['Un conducto de energía mágica atraviesa una viga de la academia.', ['Reúno a las dos órdenes y dibujo un recorrido coordinado.', 'Mando un croquis encantado y actualizo el gran plano después.', 'Pido a los constructores que rodeen la viga como puedan.']],
    ['Descubres un pasaje más corto, pero ocupa el espacio reservado para otra sala.', ['Consulto a los maestros y registro el pasaje nuevo.', 'Solicito permiso verbal y documento el cambio al final.', 'Abro el pasaje ahora y aviso cuando esté terminado.']],
    ['El consejo cambia las ventanas de la torre cuando sus piezas están por fabricarse.', ['Actualizo los pergaminos y confirmo la nueva medida con todos.', 'Aviso al artesano y corrijo los pergaminos después.', 'Doy la medida en voz alta y dejo que cada taller se ajuste.']],
    ['La academia abre sus puertas. La próxima generación debe encontrar equipos y cambios.', ['Verifico cada sala y entrego un mapa de lo realmente construido.', 'Entrego fotos y listas separadas de los cambios.', 'Entrego el pergamino original y respondo dudas cuando surjan.']]
  ],
  rosa: [
    ['Tu casa de los sueños tiene dos bocetos con la escalera en lugares distintos. El equipo está por construir.', ['Comparo bocetos con diseño y obra y apruebo uno solo.', 'Marco la diferencia en una nota y actualizo el boceto después.', 'Entrego ambos bocetos y elijo la posición durante el montaje.']],
    ['El recorrido de iluminación choca con una viga de la casa.', ['Coordino a quienes diseñan estructura e iluminación.', 'Envío un dibujo rápido y actualizo el plan más tarde.', 'Dejo que el instalador busque una ruta al llegar.']],
    ['En obra descubres una ubicación más vistosa para una instalación, pero otra especialidad la necesita.', ['Consulto al equipo y registro el cambio antes de instalar.', 'Lo apruebo por teléfono y guardo fotos para después.', 'Lo cambio de inmediato y aviso cuando quede instalado.']],
    ['Cambias el tamaño de las ventanas cuando ya se prepara su fabricación.', ['Actualizo medidas y confirmo la nueva versión con taller y obra.', 'Aviso solo al taller y actualizo el modelo después.', 'Lo explico en una reunión y dejo que el equipo lo resuelva.']],
    ['La casa está lista para recibir visitas. Quien la opere necesitará ubicar sus equipos.', ['Verifico lo construido y entrego un registro completo.', 'Entrego fotos, garantías y notas separadas.', 'Entrego los bocetos iniciales y contesto dudas después.']]
  ],
  samurai: [
    ['Dos planos del dojo ubican el pilar central en posiciones distintas. El equipo espera tu instrucción.', ['Comparo planos con los maestros de cada disciplina y fijo una versión.', 'Señalo la diferencia y actualizo el plano al terminar la etapa.', 'Entrego ambos planos y dejo la decisión al equipo de campo.']],
    ['Un conducto del dojo atraviesa una viga que sostiene el techo.', ['Coordino estructura e instalaciones para hallar otra ruta.', 'Mando una indicación provisional sin actualizar el plano maestro.', 'Pido al instalador que encuentre una ruta durante el montaje.']],
    ['Encuentras un camino más corto para los servicios, pero invade el área de entrenamiento.', ['Consulto a los equipos y registro la nueva ruta.', 'Lo acuerdo verbalmente y documento después.', 'Cambio la ruta sin consultar para mantener el ritmo.']],
    ['La escuela modifica el tamaño de las ventanas antes de fabricar los paneles.', ['Actualizo los planos y distribuyo una versión única.', 'Aviso al taller y corrijo el modelo al cierre.', 'Lo explico en persona y dejo que cada equipo adapte sus piezas.']],
    ['El dojo abre. El siguiente maestro necesita saber dónde quedó cada sistema.', ['Verifico lo construido y entrego un mapa completo.', 'Dejo fotos y una lista de cambios separada.', 'Entrego el diseño inicial y respondo consultas más tarde.']]
  ],
  cosmos: [
    ['Dos mapas de la base estelar ubican el soporte de lanzamiento en lugares distintos. El equipo se prepara para construir.', ['Cruzo los mapas con ingeniería y libero una coordenada compartida.', 'Marco la diferencia y dejo la revisión completa para después.', 'Envío ambos mapas y pido que decidan al aterrizar.']],
    ['Una tubería de oxígeno atraviesa una viga del módulo principal.', ['Coordino ambos sistemas y publico una nueva ruta.', 'Mando un croquis rápido y actualizo el modelo después.', 'Dejo que la tripulación adapte la tubería durante el montaje.']],
    ['Un sensor detecta una ruta más corta para un cable, pero otro módulo la usará.', ['Consulto a ambos equipos y registro la ruta nueva.', 'Lo confirmo por radio y guardo el cambio para el informe.', 'Instalo el cable ya y aviso al terminar.']],
    ['Cambia el tamaño de las ventanas de observación cuando están por fabricarse.', ['Actualizo medidas y verifico la versión con todos los módulos.', 'Aviso a fábrica y actualizo los planos después.', 'Transmito el cambio por radio y dejo que cada grupo se ajuste.']],
    ['La base entra en operación. La siguiente tripulación necesita localizar equipos y modificaciones.', ['Verifico la base real y entrego un registro completo.', 'Entrego imágenes y notas separadas del modelo.', 'Entrego el plano inicial y atiendo preguntas cuando surjan.']]
  ],
  bloques: [
    ['Tienes dos instrucciones para ensamblar la base de tu ciudad de bloques, cada una pone el mismo soporte en otra posición.', ['Comparo piezas e instrucciones con el equipo y dejo una sola guía.', 'Marco la diferencia en la hoja y actualizo el manual después.', 'Reparto ambas guías y dejo que cada constructor elija.']],
    ['Una pieza larga de instalaciones no encaja porque atraviesa una viga de bloques.', ['Reviso los módulos con ambos equipos y ajusto el ensamble.', 'Mando un dibujo rápido sin cambiar el manual completo.', 'Pido que corten o muevan piezas al llegar a esa sección.']],
    ['Descubres una forma más rápida de ensamblar un módulo, pero ocupa conectores de otro.', ['Pruebo el nuevo ensamble con ambos equipos y registro los cambios.', 'Lo apruebo de palabra y anoto piezas usadas después.', 'Cambio el módulo ya y aviso cuando el otro equipo lo necesite.']],
    ['El cliente quiere ventanas más grandes cuando las piezas de fachada ya están separadas.', ['Actualizo la lista de piezas y las instrucciones para todos.', 'Aviso al equipo de ventanas y corrijo el manual después.', 'Lo comento en voz alta y dejo que cada constructor ajuste piezas.']],
    ['La ciudad de bloques está lista. Otra persona tendrá que desmontar, mantener o ampliar el modelo.', ['Verifico cada módulo y dejo instrucciones de cómo quedó armado.', 'Entrego fotos y una bolsa de piezas sobrantes con notas.', 'Entrego el manual original y explico cambios si preguntan.']]
  ]
};
