// Grúas animadas por escena. Coordenadas en píxeles de la imagen original de cada escena.
//
// Grúa torre: axis = x del mástil. La pluma gira y se ve más corta (amp > 0) o más larga (amp < 0,
//   para plumas que salen del cuadro) en perspectiva.
// Grúa de pluma inclinada: luff = { pivot, deg }. La pluma sube y baja girando sobre su base.
// parts: piezas que se mueven con la pluma. hooks: gancho (y carga, si cuelga libre) que sigue a la
//   pluma desde su punto `top`, con balanceo (`swing`, grados) y subida y bajada (`bob`, píxeles).
//   anchors: puntos fijos de la carga a los que se dibujan las eslingas desde `from`.
// fill: de dónde se toma el relleno del hueco: [dx, dy] (copia desplazada) o 'interp' (interpolado).
// erase: zonas extra que solo se rellenan (eslingas originales). light: baliza roja en la punta.
window.CRANES = {
  gol: [
    { axis: 398, amp: .16, period: 14, phase: 0, light: [782, 64],
      parts: [ { poly: [[470,76],[784,56],[784,100],[470,164]], fill: 'interp' } ],
      hooks: [ { poly: [[656,104],[688,104],[688,178],[656,178]], top: [670,104], fill: 'interp', from: [670,176], anchors: [[628,218],[672,220],[716,218]] } ],
      erase: [ { poly: [[670,172],[622,219],[722,219]], fill: 'interp' } ] },
    { axis: 1131, amp: .22, period: 11, phase: 2, light: [978, 268],
      parts: [
        { poly: [[1128,214],[1122,264],[975,282],[975,254]], fill: 'interp' },
        { poly: [[1134,214],[1214,232],[1214,272],[1140,264]], fill: 'interp' } ],
      hooks: [ { poly: [[1087,264],[1102,264],[1102,322],[1087,322]], top: [1094,264], fill: 'interp', swing: 1.5 } ] }
  ],
  yardas: [
    { axis: 596, amp: .15, period: 13, phase: .5, light: [962, 8],
      parts: [ { poly: [[640,22],[990,-6],[990,28],[640,68]], fill: 'interp' } ],
      hooks: [ { poly: [[778,50],[798,50],[798,100],[778,100]], top: [787,50], fill: 'interp', from: [787,97], anchors: [[733,152],[780,146],[833,148]] } ],
      erase: [ { poly: [[787,95],[726,151],[842,151]], fill: 'interp' } ] },
    { luff: { pivot: [1682,226], deg: 2.2 }, period: 10, phase: 1.2, light: [1544, 22],
      parts: [ { poly: [[1526,8],[1566,4],[1718,152],[1704,228],[1662,234]], fill: 'interp' } ],
      hooks: [ { poly: [[1520,24],[1546,24],[1562,95],[1584,150],[1584,206],[1484,206],[1484,150],[1520,95]], top: [1533,24], swing: 1.6, bob: 2,
        fill: 'interp' } ] }
  ],
  pista: [
    { axis: 528, amp: .17, period: 12, phase: 0, light: [836, 58],
      parts: [
        { poly: [[545,104],[700,92],[840,44],[840,76],[552,174]], fill: 'interp' },
        { poly: [[526,106],[436,164],[436,206],[520,200]], fill: 'interp' } ],
      hooks: [ { poly: [[694,118],[714,118],[714,192],[694,192]], top: [704,118], fill: 'interp', from: [704,190], anchors: [[668,238],[692,245],[716,247],[746,254]] } ],
      erase: [ { poly: [[704,186],[662,238],[750,254]], fill: 'interp' } ] },
    { axis: 968, amp: .2, period: 10, phase: 2.4, light: [1048, 212],
      parts: [ { poly: [[972,134],[1052,206],[1046,222],[976,172]], fill: 'interp' } ],
      hooks: [ { poly: [[1028,218],[1038,218],[1038,300],[1066,304],[1066,350],[1006,350],[1006,304],[1028,300]], top: [1033,218], fill: 'interp', swing: 2.2 } ] }
  ],
  guardian: [
    { axis: 336, amp: 0, period: 9, phase: .8,
      hooks: [ { poly: [[322,26],[350,26],[350,105],[380,215],[380,400],[245,400],[245,250],[322,105]], top: [336,26], fill: 'interp', swing: 2.4, bob: 3 } ] },
    { axis: 1035, amp: .2, period: 12, phase: 2, light: [822, 318],
      parts: [
        { poly: [[1030,186],[1022,288],[818,334],[818,304]], fill: 'interp' },
        { poly: [[1040,186],[1170,190],[1170,250],[1040,262]], fill: 'interp' } ],
      hooks: [ { poly: [[916,306],[932,306],[932,418],[916,418]], top: [924,306], fill: 'interp', swing: 1.5 } ] }
  ],
  rosa: [
    { axis: 1539, amp: 0, period: 8, phase: 0,
      hooks: [ { poly: [[1524,0],[1556,0],[1556,95],[1600,205],[1600,275],[1466,275],[1466,215],[1524,95]], top: [1539,0], fill: 'interp', swing: 2, bob: 3 } ] }
  ],
  samurai: [
    { axis: 190, amp: .15, period: 13, phase: 1, light: [426, 394],
      parts: [
        { poly: [[196,238],[428,384],[428,404],[210,350]], fill: 'interp' },
        { poly: [[188,238],[15,252],[15,320],[185,325]], fill: 'interp' } ],
      hooks: [ { poly: [[306,362],[328,362],[328,452],[306,452]], top: [317,362], fill: 'interp', swing: 1.5 } ] },
    { axis: 1479, amp: -.12, period: 15, phase: 3,
      parts: [
        { poly: [[1488,84],[1600,84],[1600,150],[1500,170],[1488,160]], fill: 'interp' },
        { poly: [[1474,86],[1268,205],[1268,262],[1345,262],[1430,212],[1430,170],[1474,150]], fill: 'interp' } ] }
  ],
  bloques: [
    { axis: 1020, amp: -.12, period: 13, phase: .4, light: [700, 10],
      parts: [
        { poly: [[1028,50],[1020,146],[696,24],[696,-2]], fill: 'interp' },
        { poly: [[1024,50],[1138,135],[1138,200],[1050,200],[1050,130]], fill: 'interp' } ],
      hooks: [ { poly: [[738,22],[760,22],[760,110],[812,150],[812,216],[688,216],[688,150],[738,110]], top: [749,22], fill: 'interp', swing: 2, bob: 3 } ],
      erase: [ { poly: [[688,194],[812,194],[812,216],[688,216]], fill: [150,0] } ] },
    { axis: 123, amp: .2, period: 9, phase: 2.2, light: [258, 168],
      parts: [
        { poly: [[126,172],[262,160],[262,182],[130,215]], fill: 'interp' },
        { poly: [[122,172],[56,218],[56,240],[110,240],[120,215]], fill: 'interp' } ],
      hooks: [ { poly: [[228,180],[244,180],[244,214],[228,214]], top: [236,180], fill: 'interp', swing: 1.5 } ] }
  ]
};
