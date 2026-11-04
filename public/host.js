const $=id=>document.getElementById(id);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=new URLSearchParams(location.search).get('key');
const playerUrl=`${location.origin}/`;
const withKey=path=>`${path}?key=${encodeURIComponent(key||'')}`;
let last=null;
$('playerLink').href=playerUrl;
$('playerLink').textContent=playerUrl;
$('exportCsv').href=withKey('/api/host/export');
$('copyPlayerLink').onclick=async()=>{try{await navigator.clipboard.writeText(playerUrl);$('copyPlayerLink').textContent='Enlace copiado';}catch{$('copyPlayerLink').textContent='Selecciona y copia el enlace de arriba';}setTimeout(()=>{$('copyPlayerLink').textContent='Copiar enlace';},2500);};
$('resetSession').onclick=async()=>{
  const n=last?.players.length||0;
  if(!confirm(`¿Borrar ${n} partida(s) y empezar una sesión nueva? Esta acción no se puede deshacer. Descarga el CSV antes si quieres conservar los resultados.`))return;
  try{const r=await fetch(withKey('/api/host/reset'),{method:'POST'});const d=await r.json();if(!r.ok)throw Error(d.error||'No se pudo reiniciar.');$('hostMessage').textContent=`Sesión reiniciada: se borraron ${d.removed} partida(s).`;refresh();}catch(e){$('hostMessage').textContent=e.message;}
};
$('present').onclick=()=>{$('presentation').hidden=false;document.documentElement.requestFullscreen?.().catch(()=>{});renderPresentation();};
$('closePresent').onclick=()=>{$('presentation').hidden=true;if(document.fullscreenElement)document.exitFullscreen();};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('presentation').hidden=true;});
function boardRows(list){return list.map(p=>`<div class="rank"><strong>#${p.place}</strong><span>${esc(p.name)}<small>${esc(p.avatarName)}</small></span><b>${p.rework}</b></div>`).join('');}
function renderPresentation(){
  if(!last||$('presentation').hidden)return;
  const b=last.leaderboard;
  const medals=['🥇','🥈','🥉'];
  $('podium').innerHTML=b.length?b.slice(0,3).map((p,i)=>`<div class="podium-spot p${i+1}"><span>${medals[i]}</span><strong>${esc(p.name)}</strong><small>${esc(p.avatarName)}</small><b>${p.rework} retrabajo(s)</b></div>`).join(''):'<p class="muted">Aún nadie ha terminado.</p>';
  $('presentList').innerHTML=b.length>3?boardRows(b.slice(3)):'';
}
async function refresh(){
  try{
    const r=await fetch(withKey('/api/host'));
    const data=await r.json();
    if(!r.ok)throw Error(data.error||'No se pudo cargar el tablero.');
    last=data;
    const finished=data.players.filter(p=>p.finished);
    $('totalPlayers').textContent=data.players.length;
    $('finishedPlayers').textContent=finished.length;
    $('activePlayers').textContent=data.players.length-finished.length;
    $('avgRework').textContent=finished.length?(finished.reduce((n,p)=>n+p.rework,0)/finished.length).toFixed(1):'–';
    $('hostPlayers').innerHTML=data.players.length?data.players.map(p=>`<div class="host-row"><strong>#${p.place}</strong><span class="host-name">${esc(p.name)}<small>${esc(p.avatarName||p.avatar)}</small></span><div class="progress"><i style="width:${100*p.progress/data.total}%"></i></div><span>${p.progress}/${data.total}</span><span>${p.finished?`Finalizó · ${p.rework} retrabajo(s)`:`Pregunta ${p.progress+1} · ${Math.ceil(p.remainingMs/1000)} s`}</span></div>`).join(''):'<p class="muted">Aún no hay participantes.</p>';
    $('hostBoard').innerHTML=data.leaderboard.length?boardRows(data.leaderboard):'<p class="muted">Aparece cuando alguien termina.</p>';
    const max=Math.max(1,...data.reworkByStage);
    const top=data.reworkByStage.indexOf(Math.max(...data.reworkByStage));
    $('stageBars').innerHTML=data.stages.map((s,i)=>`<div class="bar-row ${finished.length&&i===top&&data.reworkByStage[i]>0?'top':''}"><span>${esc(s)}</span><div class="bar"><i style="width:${100*data.reworkByStage[i]/max}%"></i></div><b>${data.reworkByStage[i]}</b></div>`).join('');
    renderPresentation();
  }catch(e){$('hostMessage').textContent=e.message;}
}
refresh();setInterval(refresh,2000);
