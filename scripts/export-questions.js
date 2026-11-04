const fs = require('node:fs');
const path = require('node:path');
const { avatars, missions, avatarTitles, stories, dilemmas } = require('../server');

const lines = [
  '# Preguntas y respuestas por perfil',
  '',
  'Documento de revisión para el equipo organizador. Contiene las cinco misiones de cada uno de los nueve perfiles.',
  '',
  '**Cómo leerlo:** las opciones A, B y C aparecen aquí en el orden de edición; en el juego se mezclan para cada participante. Los puntos son retrabajo base y permanecen ocultos durante la partida. Si la decisión anterior improvisó y la siguiente usa una verificación parcial, se añade 1 punto por incertidumbre arrastrada. Cuando se agota el tiempo, se registran 2 puntos.',
  '',
  '**Criterio de diseño:** ninguna opción se presenta como incorrecta. Cada una tiene una ventaja inmediata y un costo o riesgo para el trabajo posterior. Estos valores son reglas exploratorias del juego, pendientes de validación con especialistas.',
  '',
  '**Caso compartido de fútbol, NFL y F1:** remodelación ficticia de un estadio con fecha contractual de entrega. Los perfiles de fútbol y NFL deciden como dueños; el de F1 dirige la estrategia contra reloj como team principal.',
  ''
];

for (const avatar of avatars) {
  lines.push(`## ${avatar.icon} ${avatar.name} — ${avatar.building}`, '');
  for (let round = 0; round < missions.length; round++) {
    const story = stories[avatar.id][round];
    const options = dilemmas.choices(avatar.id, round);
    lines.push(`### ${round + 1}. ${avatarTitles[avatar.id][round]}`, '');
    lines.push(`**Pregunta:** ${story[0]} ${dilemmas.pressure[round]}`, '');
    for (let i = 0; i < options.length; i++) {
      const rule = missions[round].options[i];
      lines.push(`**${'ABC'[i]}.** ${options[i]}`, '');
      lines.push(`- **Retrabajo base:** ${rule.work}`);
      lines.push(`- **Consecuencia en la obra:** ${rule.effect}`, '');
    }
  }
}

const destination = path.join(__dirname, '..', 'PREGUNTAS_POR_PERFIL.md');
fs.writeFileSync(destination, lines.join('\n') + '\n', 'utf8');
console.log(destination);
