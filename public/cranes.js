// Grúas animadas por escena. Coordenadas en píxeles de la imagen original.
// axis: x del mástil (eje de giro). parts: piezas que giran (pluma y contrapluma) con el desplazamiento
// de donde se toma el relleno del hueco (fill = [dx,dy]). hooks: gancho que se desplaza con la pluma;
// anchors: puntos fijos de la carga a los que se dibujan las eslingas. light: baliza en la punta.
window.CRANES = {
  gol: [
    { axis: 398, amp: .16, period: 14, phase: 0, light: [782, 64],
      parts: [ { poly: [[470,76],[784,56],[784,100],[470,164]], fill: [330,0] } ],
      hooks: [ { x: 670, rect: [656,104,688,178], fill: [40,0], from: [670,176], anchors: [[628,218],[672,220],[716,218]] } ],
      erase: [ { poly: [[670,172],[622,219],[722,219]], fill: [120,0] } ] },
    { axis: 1131, amp: .22, period: 11, phase: 2, light: [978, 268],
      parts: [
        { poly: [[1128,214],[1122,264],[975,282],[975,254]], fill: [0,-48] },
        { poly: [[1134,214],[1214,232],[1214,272],[1140,264]], fill: [0,-48] } ],
      hooks: [ { x: 1094, rect: [1087,264,1102,322], fill: [16,0] } ] }
  ]
};
