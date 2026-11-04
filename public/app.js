const $=id=>document.getElementById(id);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function avatarIcon(a){
  if(!a)return '🏗️';
  if(a.id==='magia')return '<svg class="custom-avatar-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3 9 32c8 5 22 5 30 0L24 3Z" fill="#7248b3" stroke="#e9cb82" stroke-width="2"/><path d="M16 20c8 4 14 3 19 0l4 12c-8 5-22 5-30 0l7-12Z" fill="#9468cf"/><path d="M11 29c8 5 18 6 28 1" fill="none" stroke="#f3d77e" stroke-width="4"/><ellipse cx="24" cy="37" rx="22" ry="6" fill="#513382" stroke="#e9cb82" stroke-width="2"/><path d="m28 26 1.2 2.4 2.6.3-1.9 1.8.5 2.6-2.4-1.2-2.3 1.2.4-2.6-1.9-1.8 2.6-.3Z" fill="#ffe59b"/></svg>';
  if(a.id==='samurai')return '<svg class="custom-avatar-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M7 23C7 11 14 5 24 5s17 7 17 18v8H7Z" fill="#273654"/><path d="M11 26c0-11 6-17 13-17s13 6 13 17v5c0 9-6 15-13 15s-13-6-13-15Z" fill="#f0c7a8"/><path d="M7 24 13 8l9-5 8 3 8 5 4 13-9-8-6 7-3-7-7 8-3-5Z" fill="#25334f"/><path d="M15 27c2-3 6-4 9-1M24 26c3-3 7-2 9 1" fill="none" stroke="#25334f" stroke-width="2"/><ellipse cx="19" cy="30" rx="3.7" ry="5" fill="white"/><ellipse cx="29" cy="30" rx="3.7" ry="5" fill="white"/><ellipse cx="19.5" cy="31" rx="2" ry="3.3" fill="#2b77a6"/><ellipse cx="28.5" cy="31" rx="2" ry="3.3" fill="#2b77a6"/><circle cx="20" cy="29.5" r=".8" fill="white"/><circle cx="29" cy="29.5" r=".8" fill="white"/><path d="M20 39q4 3 8 0" fill="none" stroke="#a75f66" stroke-width="1.5" stroke-linecap="round"/></svg>';
  return esc(a.icon);
}
let avatars=[],selected=null,state=null,id=localStorage.getItem('bim-player-id');
async function api(path,data){const r=await fetch(path,data?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{});const x=await r.json();if(!r.ok)throw Error(x.error||'Error de conexión');return x;}
function msg(x){$('message').textContent=x;const entryMessage=$('entryMessage');if(entryMessage){entryMessage.textContent=x;entryMessage.hidden=!x;}}
function drawBuilding(){
  const a=state.avatar,n=state.history.length;
  $('buildingName').textContent=a.building;
  $('projectStage').textContent=`${n} / ${state.total} etapas`;
  $('projectVisual').innerHTML=`<div class="project-scene" role="img" aria-label="${esc(a.building)} en construcción" style="--scene:url('/assets/${a.id}.png')"><div class="scene-reveal" style="clip-path:inset(0 ${100-Math.max(18,100*n/state.total)}% 0 0)"></div><span class="scene-caption">${avatarIcon(a)} ${esc(a.building)}</span></div>`;
  $('projectStatus').innerHTML=['Planos','Estructura','Instalaciones','Fachada','Entrega'].map((label,i)=>`<div class="stage ${i<n?'built':''}"><span class="stage-dot" style="${i<n?`background:${a.color}`:''}"></span>${label}<small>${i<n?state.finished?state.history[i].work?`${state.history[i].work} retrabajo(s)`:'Sin retrabajo':'Etapa construida':'Pendiente'}</small></div>`).join('');
}
function clock(){if(!state)return;const seconds=Math.ceil(Math.max(0,state.deadline-Date.now())/1000);$('timer').textContent=state.finished?'Finalizada':`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function render(){
  if(!state)return;
  $('entry').hidden=true;$('game').hidden=false;
  document.body.dataset.avatar=state.avatar.id;
  document.body.style.setProperty('--avatar-color',state.avatar.color);
  document.body.style.setProperty('--avatar-accent',state.avatar.accent);
  document.body.style.setProperty('--avatar-scene',`url('/assets/${state.avatar.id}.png')`);
  $('identity').innerHTML=`<span class="avatar-icon">${avatarIcon(state.avatar)}</span><strong>${esc(state.name)}</strong><small>${esc(state.avatar.name)}</small>`;
  clock();drawBuilding();
  $('historyCard').hidden=!state.finished;
  $('history').innerHTML=state.finished?state.history.map((h,i)=>`<article class="history-item"><h3>${i+1}. ${esc(h.title)}</h3><p>${esc(h.choice)}</p><p>${esc(h.build)}</p><p class="hint">Efecto para el siguiente equipo: ${esc(h.effect)}</p><strong>${h.work} retrabajo(s)</strong>${h.carryover?'<p class="hint">Incluye 1 retrabajo por una incertidumbre arrastrada desde la etapa anterior.</p>':''}</article>`).join(''):'';
  $('standings').innerHTML=state.standings.length?state.standings.map(p=>`<div class="rank"><strong>#${p.place}</strong><span>${avatarIcon(avatars.find(a=>a.id===p.avatar))} ${esc(p.name)}</span><b>${p.progress}/${state.total}</b></div>`).join(''):'<p class="muted">Aún no hay participantes.</p>';
  $('leaderboardCard').hidden=!state.finished;
  let place=0,previous=-1;
  $('leaderboard').innerHTML=state.finished?state.leaderboard.map((p,i)=>{if(p.rework!==previous)place=i+1;previous=p.rework;const a=avatars.find(x=>x.id===p.avatar);return `<div class="rank"><strong>#${place}</strong><span>${avatarIcon(a)} ${esc(p.name)}</span><b>${p.rework}</b></div>`}).join(''):'';
  if(state.finished){$('scenario').innerHTML=`<span class="eyebrow">MISIÓN COMPLETADA</span><h2>Tu edificio está terminado</h2><p>Generaste <strong>${state.rework} retrabajo(s)</strong>. Revisa qué decisiones produjeron ajustes y compara tu resultado con los demás.</p>`;return;}
  const m=state.mission;
  const lastDecision=state.history.at(-1);
  const caseNote=['gol','yardas','pista'].includes(state.avatar.id)?'<p class="hint">Misión: remodelar el estadio y cumplir la fecha contractual de entrega.</p>':'';
  $('scenario').innerHTML=`${lastDecision?`<div class="mission-feedback"><span class="eyebrow">LO QUE PASÓ EN LA OBRA</span><p>${esc(lastDecision.effect)}</p><small>${esc(lastDecision.build)}</small></div>`:''}<span class="eyebrow">MISIÓN ${state.history.length+1} DE ${state.total}</span><h2>${esc(m.title)}</h2>${caseNote}<p>${esc(m.prompt)}</p><p class="hint">No hay respuestas incorrectas. Cada opción construye el proyecto de una forma distinta.</p>${m.options.map((o,i)=>`<button class="option" data-choice="${i}">${esc(o)}</button>`).join('')}`;
  document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=async()=>{try{document.querySelectorAll('[data-choice]').forEach(x=>x.disabled=true);state=await api('/api/answer',{id,choice:Number(b.dataset.choice),round:state.history.length});msg('');render();}catch(e){msg(e.message);state=await api(`/api/state?id=${encodeURIComponent(id)}`);render();}});
}
async function init(){try{avatars=await api('/api/avatars');$('avatars').innerHTML=avatars.map(a=>`<button class="avatar-card" data-avatar="${a.id}" type="button" style="--card-scene:url('/assets/${a.id}.png')"><span>${avatarIcon(a)}</span><strong>${esc(a.name)}</strong><small>${esc(a.building)}</small></button>`).join('');document.querySelectorAll('[data-avatar]').forEach(b=>b.onclick=()=>{selected=b.dataset.avatar;document.querySelectorAll('[data-avatar]').forEach(x=>x.classList.toggle('selected',x===b));});if(id){try{state=await api(`/api/state?id=${encodeURIComponent(id)}`);render();}catch{localStorage.removeItem('bim-player-id');id=null;}}}catch(e){msg(e.message);}}
$('start').onclick=async()=>{if(!$('name').value.trim()){msg('Escribe tu nombre para comenzar.');$('name').focus();return;}if(!selected){msg('Elige un personaje para comenzar.');$('avatars').scrollIntoView({block:'nearest'});return;}try{state=await api('/api/start',{name:$('name').value,avatar:selected});id=state.id;localStorage.setItem('bim-player-id',id);msg('');render();}catch(e){msg(e.message);}};
init();
setInterval(clock,250);
setInterval(async()=>{if(!state)return;try{const next=await api(`/api/state?id=${encodeURIComponent(id)}`);const changed=next.history.length!==state.history.length||JSON.stringify(next.standings)!==JSON.stringify(state.standings)||JSON.stringify(next.leaderboard)!==JSON.stringify(state.leaderboard);state=next;if(changed)render();}catch{}},2500);
