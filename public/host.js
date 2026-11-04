const $=id=>document.getElementById(id);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=new URLSearchParams(location.search).get('key');
const playerUrl=`${location.origin}/`;
$('playerLink').href=playerUrl;
$('playerLink').textContent=playerUrl;
$('copyPlayerLink').onclick=async()=>{try{await navigator.clipboard.writeText(playerUrl);$('copyPlayerLink').textContent='Enlace copiado';}catch{$('copyPlayerLink').textContent='Selecciona y copia el enlace de arriba';}};
async function refresh(){
  try{
    const r=await fetch(`/api/host?key=${encodeURIComponent(key||'')}`);
    const data=await r.json();
    if(!r.ok)throw Error(data.error||'No se pudo cargar el tablero.');
    $('hostMessage').textContent='';
    $('totalPlayers').textContent=data.players.length;
    $('finishedPlayers').textContent=data.players.filter(p=>p.finished).length;
    $('activePlayers').textContent=data.players.filter(p=>!p.finished).length;
    $('hostPlayers').innerHTML=data.players.length?data.players.map(p=>`<div class="host-row"><strong>#${p.place}</strong><span class="host-name">${esc(p.name)}<small>${esc(p.avatar)}</small></span><div class="progress"><i style="width:${100*p.progress/data.total}%"></i></div><span>${p.progress}/${data.total}</span><span>${p.finished?`Finalizó · ${p.rework} retrabajo(s)`:`Pregunta ${p.progress+1} · ${Math.ceil(p.remainingMs/1000)} s`}</span></div>`).join(''):'<p class="muted">Aún no hay participantes.</p>';
  }catch(e){$('hostMessage').textContent=e.message;}
}
refresh();setInterval(refresh,2000);
