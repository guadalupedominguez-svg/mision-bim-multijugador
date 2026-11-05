"""Piezas móviles de cada escena (coordenadas en píxeles de public/assets/<escena>.png).

Cada pieza:
  id      nombre corto (también nombre de archivo)
  poly    polígono que contiene la pieza (con algo de margen)
  mask    'sky'    -> la pieza se separa del cielo por contraste (grúas, cables, cargas en el aire)
          'object' -> GrabCut dentro del polígono (objetos sobre fondos con textura)
          'poly'   -> el polígono es la pieza
  sub     polígonos que se quitan de la máscara (p. ej. una persona delante de la carga)
  motion  movimiento que aplica el juego (ver drawPieces en public/app.js):
     slew   grúa torre: la pluma gira y se ve acortarse/alargarse en perspectiva (axis, amp)
     luff   pluma inclinada que sube y baja girando sobre pivot (deg)
     hang   gancho y carga: sigue el punto `top` de la pieza `follow`, con balanceo (swing) y bob
     rotate gira sobre pivot (deg); `parent` hace que herede el movimiento de otra pieza
     glide  se desliza de ida y vuelta en la dirección `vec` (px) con flote perpendicular `float`
     bob    flota: desplazamiento `amp` [dx,dy] y giro `rot` (grados)
     drive  vehículo que avanza y retrocede `dx` px con leve vaivén
     erase  solo se borra del fondo (no se dibuja); se usa para eslingas que se redibujan
     static se dibuja encima sin moverse (algo que debe quedar delante de una pieza móvil)
"""

def rect(x0, y0, x1, y1):
    return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

SCENES = {
  # ---------- grúas: 'poly'/'polys' ajustados a la estructura; 'add' = partes sólidas (cargas, contrapesos)
  'gol': {'pieces': [
    {'id': 'g1-pluma', 'poly': [[424,106],[792,60],[792,94],[424,160]],
     'motion': {'type': 'slew', 'axis': 398, 'amp': .035, 'period': 14, 'phase': 0, 'light': [782,64]}},
    # cable del gancho: se borra y se dibuja como línea entre el carro de la pluma y el gancho
    {'id': 'g1-cable', 'poly': rect(664,104,677,151),
     'motion': {'type': 'erase'}},
    # carga: gancho + eslingas + punta del arco de cubierta que se está colocando; gira sobre la unión
    {'id': 'g1-carga', 'poly': rect(661,149,680,168),
     'polys': [[[669,160],[612,226],[730,226],[673,160]],
               [[650,228],[700,214],[796,210],[796,238],[700,247],[650,253]]],
     'motion': {'type': 'rotate', 'pivot': [650,240], 'deg': 2.2, 'period': 9, 'phase': 0,
                'cable': {'on': 'g1-pluma', 'top': [670,105], 'bottom': [670,151]}}},
    {'id': 'g2-pluma', 'poly': [[1120,242],[972,260],[972,280],[1120,264]],
     'polys': [[[1132,214],[1016,254],[1020,264],[1134,222]]],
     'motion': {'type': 'slew', 'axis': 1131, 'amp': .2, 'period': 11, 'phase': 2, 'light': [978,268]}},
    {'id': 'g2-gancho', 'poly': [[1085,262],[1103,262],[1103,304],[1085,304]],
     'motion': {'type': 'hang', 'follow': 'g2-pluma', 'top': [1094,266], 'swing': 1.5, 'bob': 2}},
  ]},
  'yardas': {'pieces': [
    {'id': 'y1-pluma', 'poly': [[618,36],[1002,-8],[1002,16],[618,74]],
     'polys': [[[586,-4],[702,24],[702,34],[586,6]]],
     'motion': {'type': 'slew', 'axis': 594, 'amp': .08, 'period': 13, 'phase': .5, 'light': [962,8]}},
    {'id': 'y1-carga', 'poly': [[774,36],[804,36],[804,100],[774,100]],
     'polys': [[[782,96],[792,96],[886,152],[682,156]]],
     'add': [[[670,168],[684,150],[884,146],[890,165],[874,178],[680,188]]],
     'sub': [[[739,163],[747,162],[752,170],[754,182],[752,201],[735,202],[734,181]]],
     'motion': {'type': 'hang', 'follow': 'y1-pluma', 'top': [787,44], 'swing': 1.0, 'bob': 1.5}},
    {'id': 'y1-obrero', 'poly': [[739,163],[747,162],[752,170],[754,182],[752,201],[735,202],[734,181]], 'mask': 'poly',
     'motion': {'type': 'static'}},
    {'id': 'y1-obrero2', 'poly': [[654,168],[659,162],[663,164],[670,162],[672,168],[665,176],[666,199],[652,200],[653,178]], 'mask': 'poly',
     'motion': {'type': 'static'}},
    {'id': 'y2-pluma', 'poly': [[1522,12],[1560,8],[1692,212],[1666,224]],
     'polys': [[[1548,12],[1710,148],[1704,158],[1544,22]]],
     'motion': {'type': 'luff', 'pivot': [1676,218], 'deg': 2.0, 'period': 10, 'phase': 1.2, 'light': [1544,22]}},
    {'id': 'y2-carga', 'poly': [[1522,14],[1544,14],[1544,102],[1522,102]],
     'polys': [[[1526,98],[1542,98],[1584,160],[1484,160]]],
     'add': [rect(1486,156,1582,203)],
     'motion': {'type': 'hang', 'follow': 'y2-pluma', 'top': [1533,24], 'swing': 1.4, 'bob': 2}},
  ]},
  'pista': {'pieces': [
    {'id': 'p1-pluma', 'poly': [[546,96],[848,38],[848,78],[550,178]],
     'motion': {'type': 'slew', 'axis': 528, 'amp': .14, 'period': 12, 'phase': 0, 'light': [836,58]}},
    {'id': 'p1-carga', 'poly': [[694,100],[716,100],[716,180],[694,180]],
     'polys': [[[698,174],[712,174],[762,242],[602,252]]],
     'add': [[[602,250],[660,232],[758,254],[756,283],[606,267]]],
     'motion': {'type': 'hang', 'follow': 'p1-pluma', 'top': [704,112], 'swing': 1.6, 'bob': 2}},
    {'id': 'p2-pluma', 'poly': [[978,126],[994,128],[1054,208],[1044,224]],
     'motion': {'type': 'slew', 'axis': 966, 'amp': .05, 'period': 10, 'phase': 2.4, 'light': [1048,212]}},
    {'id': 'p2-carga', 'inpaint': 'telea', 'thr': 12, 'poly': [[1029,212],[1038,212],[1038,268],[1029,268]],
     'polys': [[[1028,258],[1039,258],[1058,306],[1016,309]]],
     'add': [[[1007,305],[1065,298],[1063,349],[1009,353]]],
     'motion': {'type': 'hang', 'follow': 'p2-pluma', 'top': [1033,218], 'swing': 1.2, 'bob': 1.5}},
  ]},
  'guardian': {'pieces': [
    {'id': 'g1-panel', 'poly': [[322,0],[349,0],[349,112],[322,112]],
     'polys': [[[331,106],[342,106],[370,222],[282,260]]],
     'add': [[[283,251],[366,212],[375,226],[333,373],[255,399],[247,388]]],
     'motion': {'type': 'hang', 'top': [335,0], 'swing': 2.0, 'bob': 3, 'period': 9, 'phase': .8}},
    {'id': 'g2-pluma', 'poly': [[1022,246],[816,306],[816,332],[1022,278]],
     'polys': [[[1032,186],[868,298],[874,308],[1038,196]], [[1032,186],[956,260],[962,268],[1038,196]]],
     'motion': {'type': 'slew', 'axis': 1036, 'amp': .2, 'period': 12, 'phase': 2, 'light': [822,318]}},
    {'id': 'g2-gancho', 'poly': [[914,294],[936,294],[936,416],[914,416]],
     'motion': {'type': 'hang', 'follow': 'g2-pluma', 'top': [924,302], 'swing': 1.5, 'bob': 2}},
  ]},
  'rosa': {'pieces': [
    {'id': 'carga', 'poly': [[1523,0],[1555,0],[1555,102],[1523,102]],
     'polys': [[[1534,94],[1546,94],[1602,214],[1468,224]]],
     'add': [[[1470,218],[1562,202],[1600,210],[1600,279],[1521,286],[1469,271]]],
     'motion': {'type': 'hang', 'top': [1539,0], 'swing': 2.0, 'bob': 3, 'period': 8, 'phase': 0}},
  ]},
  'samurai': {'pieces': [
    {'id': 's1-pluma', 'poly': [[202,312],[432,382],[430,404],[204,342]],
     'polys': [[[186,236],[196,236],[382,360],[376,372],[200,322]]],
     'motion': {'type': 'slew', 'axis': 186, 'amp': .15, 'period': 13, 'phase': 1, 'light': [426,394]}},
    {'id': 's1-gancho', 'poly': [[306,368],[330,368],[330,446],[306,446]],
     'motion': {'type': 'hang', 'follow': 's1-pluma', 'top': [317,372], 'swing': 1.5, 'bob': 2}},
    {'id': 's2-pluma', 'poly': [[1500,128],[1600,100],[1600,148],[1522,166]],
     'polys': [[[1468,84],[1600,82],[1600,96],[1468,98]]],
     'motion': {'type': 'slew', 'axis': 1478, 'amp': -.1, 'period': 15, 'phase': 3}},
  ]},
  'bloques': {'pieces': [
    {'id': 'b1-pluma', 'poly': [[686,-8],[1016,44],[1020,138],[686,34]],
     'motion': {'type': 'slew', 'axis': 1022, 'amp': -.1, 'period': 13, 'phase': .4, 'light': [700,10]}},
    {'id': 'b1-carga', 'poly': [[732,14],[766,14],[766,116],[732,116]],
     'polys': [[[740,110],[758,110],[804,154],[696,154]]],
     'add': [[[691,146],[809,150],[807,215],[693,201]]],
     'motion': {'type': 'hang', 'follow': 'b1-pluma', 'top': [749,22], 'swing': 2.0, 'bob': 3}},
    {'id': 'b2-pluma', 'poly': [[132,172],[263,160],[263,184],[134,212]],
     'motion': {'type': 'slew', 'axis': 121, 'amp': .2, 'period': 9, 'phase': 2.2, 'light': [258,168]}},
    {'id': 'b2-gancho', 'poly': [[227,177],[244,177],[244,223],[227,223]],
     'motion': {'type': 'hang', 'follow': 'b2-pluma', 'top': [236,184], 'swing': 1.5, 'bob': 1}},
  ]},
  'magia': { 'pieces': [
    # arcos flotantes de la torre: flotan arriba y abajo
    {'id': 'arco1', 'poly': rect(972,62,1020,156), 'mask': 'object',
     'motion': {'type': 'bob', 'amp': [0,-5], 'rot': .8, 'period': 7, 'phase': 0}},
    {'id': 'arco2', 'poly': rect(1022,28,1120,138), 'mask': 'object',
     'motion': {'type': 'bob', 'amp': [0,-5], 'rot': -.6, 'period': 8, 'phase': 1.3}},
    {'id': 'arco3', 'poly': rect(1290,22,1386,134), 'mask': 'object',
     'motion': {'type': 'bob', 'amp': [0,-5], 'rot': .6, 'period': 7.5, 'phase': 2.4}},
    {'id': 'arco4', 'poly': rect(1406,40,1464,148), 'mask': 'object',
     'motion': {'type': 'bob', 'amp': [0,-5], 'rot': -.8, 'period': 6.5, 'phase': 3.1}},
    {'id': 'arco5', 'poly': rect(1504,80,1706,262), 'mask': 'object',
     'motion': {'type': 'bob', 'amp': [0,-4], 'rot': .4, 'period': 9, 'phase': 4.0}},
    # bloques que vuelan por la corriente mágica hacia la torre
    {'id': 'flujo1', 'poly': rect(800,421,856,467), 'mask': 'object',
     'motion': {'type': 'glide', 'vec': [12,-7], 'float': 2, 'period': 6, 'phase': 0}},
    {'id': 'flujo2', 'poly': rect(768,400,814,439), 'mask': 'object',
     'motion': {'type': 'glide', 'vec': [12,-7], 'float': 2, 'period': 6, 'phase': .8}},
    {'id': 'flujo3', 'poly': rect(783,377,828,409), 'mask': 'object',
     'motion': {'type': 'glide', 'vec': [12,-7], 'float': 2, 'period': 6, 'phase': 1.6}},
    {'id': 'flujo4', 'poly': rect(826,361,855,389), 'mask': 'object',
     'motion': {'type': 'glide', 'vec': [10,-6], 'float': 2, 'period': 6, 'phase': 2.4}},
    {'id': 'flujo5', 'poly': rect(847,348,889,379), 'mask': 'object',
     'motion': {'type': 'glide', 'vec': [10,-6], 'float': 2, 'period': 6, 'phase': 3.2}},
    {'id': 'flujo6', 'poly': rect(887,326,944,361), 'mask': 'object',
     'motion': {'type': 'glide', 'vec': [10,-6], 'float': 2, 'period': 6, 'phase': 4.0}},
    # bloques grandes que avanzan por el puente
    {'id': 'puente1', 'poly': rect(1051,576,1187,663), 'mask': 'object',
     'motion': {'type': 'glide', 'vec': [10,-3], 'float': 2, 'period': 7, 'phase': 0}},
    {'id': 'puente2', 'poly': rect(1228,540,1368,603), 'mask': 'object',
     'motion': {'type': 'glide', 'vec': [10,-3], 'float': 2, 'period': 7, 'phase': 1.2}},
    {'id': 'puente3', 'poly': rect(1370,536,1442,584), 'mask': 'object',
     'motion': {'type': 'glide', 'vec': [8,-2], 'float': 2, 'period': 7, 'phase': 2.4}},
    {'id': 'puente4', 'poly': rect(1437,536,1475,572), 'mask': 'object',
     'motion': {'type': 'glide', 'vec': [8,-2], 'float': 2, 'period': 7, 'phase': 3.6}},
  ]},
  'cosmos': { 'pieces': [
    # brazo robótico izquierdo
    {'id': 'brazo1-sup', 'poly': [[276,396],[364,326],[388,346],[302,424]], 'mask': 'object',
     'motion': {'type': 'rotate', 'pivot': [287,410], 'deg': 2.5, 'period': 8, 'phase': 0}},
    {'id': 'brazo1-ant', 'poly': [[360,328],[386,326],[514,402],[516,438],[490,444],[358,360]], 'mask': 'object',
     'motion': {'type': 'rotate', 'parent': 'brazo1-sup', 'pivot': [373,344], 'deg': 5, 'period': 8, 'phase': .9}},
    # brazo robótico central
    {'id': 'brazo2-sup', 'poly': [[984,312],[1006,302],[1062,358],[1062,394],[1034,398],[994,336]], 'mask': 'object',
     'motion': {'type': 'rotate', 'pivot': [1042,374], 'deg': 2.5, 'period': 7, 'phase': 2}},
    {'id': 'brazo2-ant', 'poly': [[978,304],[1008,310],[1002,334],[960,360],[958,384],[906,388],[903,358],[944,336]], 'mask': 'object',
     'motion': {'type': 'rotate', 'parent': 'brazo2-sup', 'pivot': [994,320], 'deg': 6, 'period': 7, 'phase': 2.8}},
    # astronautas trabajando en la cúpula
    {'id': 'astro1', 'poly': [[361.7,154.9],[381.3,149.7],[392.2,154],[390.9,168],[404,174.6],[403.1,179],[387.9,179],[385.7,192],[387.9,200.8],[355.1,200.8],[359.5,185.5],[363,172.4]], 'mask': 'poly', 'feather': 1.3,
     'motion': {'type': 'bob', 'amp': [1,-2], 'rot': 2, 'period': 3.6, 'phase': 0}},
    {'id': 'astro2', 'poly': [[197.9,266.3],[211,260.6],[226.3,263.2],[228.5,272.8],[236.3,279.4],[232.8,285],[221.9,285.9],[211,299],[204.5,312.1],[191.4,312.1],[194.4,292.5],[197,279.4]], 'mask': 'poly', 'feather': 1.3,
     'motion': {'type': 'bob', 'amp': [1,-2], 'rot': -2, 'period': 4.2, 'phase': 1}},
    {'id': 'astro3', 'poly': [[532.4,133],[540,129.6],[549,131],[558,133],[566,143],[564,160],[570,169],[540,170],[538,160],[525,158],[523,154],[533,148],[532.4,140]], 'mask': 'poly', 'feather': 1.3,
     'motion': {'type': 'bob', 'amp': [-1,-2], 'rot': 2, 'period': 3.9, 'phase': 2}},
    {'id': 'astro4', 'poly': [[589,209],[596,205],[610,206],[623,214],[625,232],[638,240],[638,248],[610,248],[602,242],[592,238],[586,236],[589,228],[592,220]], 'mask': 'poly', 'feather': 1.3,
     'motion': {'type': 'bob', 'amp': [1,-2], 'rot': -2, 'period': 4.5, 'phase': 3}},
    {'id': 'astro5', 'poly': [[635,312],[642,309.6],[654,312],[668,320],[669,336],[666,358],[642,358],[638,340],[628,332],[624,328],[632,322]], 'mask': 'poly', 'feather': 1.3,
     'motion': {'type': 'bob', 'amp': [1,-2], 'rot': 2, 'period': 3.7, 'phase': 4}},
    # vehículos
    {'id': 'rover1', 'poly': rect(694,452,884,576), 'mask': 'object', 'core': rect(720,470,872,560), 'feather': 1.4,
     'motion': {'type': 'drive', 'dx': -16, 'period': 10, 'phase': 0}},
    {'id': 'rover2', 'poly': rect(1179,480,1296,537), 'mask': 'object', 'core': rect(1195,490,1280,528), 'feather': 1.3,
     'motion': {'type': 'drive', 'dx': -12, 'period': 9, 'phase': 2}},
    {'id': 'rover3', 'poly': rect(1441,478,1539,525), 'mask': 'object', 'core': rect(1455,486,1525,518), 'feather': 1.3,
     'motion': {'type': 'drive', 'dx': 12, 'period': 11, 'phase': 4}},
  ]},
}
