const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const tunnelExe = path.join(root, 'tools', 'cloudflared.exe');
if (!fs.existsSync(tunnelExe)) {
  console.error('Falta tools\\cloudflared.exe. Descárgalo desde https://developers.cloudflare.com/tunnel/downloads/');
  process.exit(1);
}

const port = 3000;
let game, tunnel, hostKey, publicUrl, stopped = false;
function stop(code = 0) {
  if (stopped) return;
  stopped = true;
  tunnel?.kill();
  game?.kill();
  process.exitCode = code;
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());

console.log('Iniciando juego multijugador...');
game = spawn(process.execPath, ['server.js'], { cwd: root, env: { ...process.env, PORT: String(port) }, windowsHide: true });
game.stdout.setEncoding('utf8');
game.stderr.setEncoding('utf8');
game.stdout.on('data', chunk => {
  const match = chunk.match(/host\.html\?key=([^\s]+)/);
  if (match && !hostKey) {
    hostKey = match[1];
    console.log('Juego local listo. Creando enlace público...');
    startTunnel();
  }
});
game.stderr.on('data', chunk => console.error(chunk.trim()));
game.on('exit', code => {
  if (!stopped) {
    console.error(`El juego se cerró (código ${code}). Comprueba que el puerto ${port} esté libre.`);
    stop(1);
  }
});

function startTunnel() {
  tunnel = spawn(tunnelExe, ['tunnel', '--url', `http://localhost:${port}`], { cwd: root, windowsHide: true });
  tunnel.stderr.setEncoding('utf8');
  tunnel.stdout.setEncoding('utf8');
  const read = chunk => {
    const match = chunk.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
    if (match && !publicUrl) {
      publicUrl = match[0];
      console.log(`\nPARTICIPANTES: ${publicUrl}`);
      console.log(`HOST (privado): ${publicUrl}/host.html?key=${hostKey}`);
      console.log('\nComparte solo el enlace PARTICIPANTES. Mantén esta ventana abierta durante la actividad.');
      console.log('Pulsa Ctrl+C para cerrar la sesión al terminar.\n');
    }
  };
  tunnel.stderr.on('data', read);
  tunnel.stdout.on('data', read);
  tunnel.on('error', error => { console.error(`No se pudo iniciar el túnel: ${error.message}`); stop(1); });
  tunnel.on('exit', code => { if (!stopped) { console.error(`El enlace público se cerró (código ${code}).`); stop(1); } });
  setTimeout(() => { if (!publicUrl && !stopped) { console.error('No se obtuvo un enlace público en 45 segundos. Revisa la conexión a internet.'); stop(1); } }, 45000).unref();
}
