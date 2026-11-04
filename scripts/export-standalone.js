const fs = require('node:fs');
const path = require('node:path');
const { avatars, missions, avatarTitles, stories, dilemmas } = require('../server');

const root = path.join(__dirname, '..');
const images = Object.fromEntries(avatars.map(a => [a.id, `data:image/png;base64,${fs.readFileSync(path.join(root, 'public', 'assets', `${a.id}.png`)).toString('base64')}`]));
const data = { avatars, missions, avatarTitles, stories, elements: Object.fromEntries(avatars.map(a => [a.id, Array.from({length: missions.length}, (_, i) => dilemmas.choices(a.id, i))])), pressure: dilemmas.pressure, images };
const css = fs.readFileSync(path.join(root, 'public', 'style.css'), 'utf8');
let app = fs.readFileSync(path.join(root, 'public', 'app.js'), 'utf8');
app = app.replace("localStorage.getItem('bim-player-id')", "localStorage.getItem('bim-offline-player-id')")
  .replaceAll("localStorage.removeItem('bim-player-id')", "localStorage.removeItem('bim-offline-player-id')")
  .replaceAll("localStorage.setItem('bim-player-id',id)", "localStorage.setItem('bim-offline-player-id',id)")
  .replace(/async function api\(path,data\)\{.*?\}\nfunction msg/s, "async function api(path,data){return offlineApi(path,data)}\nfunction msg")
  .replaceAll("'/assets/${a.id}.png'", "'${OFFLINE.images[a.id]}'")
  .replaceAll("'/assets/${state.avatar.id}.png'", "'${OFFLINE.images[state.avatar.id]}'")
  .replace("$('scenario').innerHTML=`<span class=\"eyebrow\">MISIÓN COMPLETADA", "$('scenario').innerHTML=`<span class=\"eyebrow\">MISIÓN COMPLETADA")
  .replace("compara tu resultado con los demás.</p>`;return;", "compara tus decisiones al revisar el registro.</p><button id=\"again\" type=\"button\">Iniciar otra misión</button>`;$('again').onclick=()=>{localStorage.removeItem('bim-offline-player-id');localStorage.removeItem('bim-offline-game');location.reload()};return;");
let html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
html = html.replace('<link rel="stylesheet" href="/style.css">', `<style>${css}</style>`)
  .replace('Posiciones en vivo', 'Tu avance')
  .replace('Durante la misión se ordenan por etapas completadas. El retrabajo y el resultado final aparecen al terminar.', 'Esta copia funciona en tu equipo. El retrabajo aparece al terminar.')
  .replace('Resultado final', 'Resultado de tu misión')
  .replace('<script src="/app.js"></script>', `<script>const OFFLINE=${JSON.stringify(data).replaceAll('<','\\u003c')};</script><script>${fs.readFileSync(path.join(__dirname, 'offline-runtime.js'), 'utf8')}\n${app}</script>`);
const targets = [path.join(root, 'BIM-Mision-Individual.html'), path.join(root, 'BIM-Mision-Individual-actualizado.html')];
for (const target of targets) {
  fs.writeFileSync(target, html);
  console.log(`${target} (${(Buffer.byteLength(html)/1048576).toFixed(1)} MB)`);
}
