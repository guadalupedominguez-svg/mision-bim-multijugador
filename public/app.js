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
const DEFAULT_STAGES=['Planos','Estructura','Instalaciones','Fachada','Entrega'];
let expiredFor=null;
function stageLabels(){return state.stages&&state.stages.length===state.total?state.stages:DEFAULT_STAGES.slice(0,state.total);}
function fitHeight(){const t=document.querySelector('#game .topline');if(t&&t.offsetHeight)document.documentElement.style.setProperty('--topH',t.offsetHeight+'px');}
window.addEventListener('resize',fitHeight);
function newGame(){localStorage.removeItem('bim-player-id');location.reload();}
function sceneSrc(a){return '/assets/'+a.id+'.png';}

// ---------- Simulación de construcción ----------
// La escena de cada proyecto se divide en bloques. Sin construir se ve como plano (líneas azules);
// el frente de trabajo aparece como obra gris con andamios, y lo terminado se revela a color.
const Scene=(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let box,canvas,ctx,img,key=null,W=0,H=0,dpr=1,layers=null,tiles=[],cols=0,rows=0;
  let progress=0,total=5,finished=false,accent='#f2d59e',built=0,framed=0,celebrate=0,particles=[],ro=null,running=false,born=0;
  const ease=t=>t<=0?0:t>=1?1:1-Math.pow(1-t,3);
  const rand=seed=>{let x=seed>>>0||1;return()=>((x=(x*1664525+1013904223)>>>0)/4294967296);};
  function mount(container,a,p,t,done){
    total=t;finished=done;accent=a.color||accent;
    if(key!==a.id||!canvas||!container.contains(canvas)){
      key=a.id;box=container;container.querySelector('canvas')?.remove();
      canvas=document.createElement('canvas');canvas.className='scene-canvas';canvas.setAttribute('aria-hidden','true');container.prepend(canvas);
      ctx=canvas.getContext('2d');layers=null;tiles=[];built=framed=0;born=performance.now();
      img=new Image();img.onload=()=>{resize();set(p,true);};img.src=sceneSrc(a);
      ro?.disconnect();ro=new ResizeObserver(()=>{if(resize())set(progress,true);});ro.observe(container);
      if(!running){running=true;requestAnimationFrame(frame);}
    }
    set(p,false);
  }
  function resize(){
    if(!img||!img.complete||!img.naturalWidth)return false;
    const r=box.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);
    const w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);if(!w||!h||(w===W&&h===H&&layers))return false;
    W=canvas.width=w;H=canvas.height=h;buildLayers();buildTiles();return true;
  }
  function layer(){const c=document.createElement('canvas');c.width=W;c.height=H;return c;}
  function buildLayers(){
    const color=layer(),cx=color.getContext('2d');
    const s=Math.max(W/img.naturalWidth,H/img.naturalHeight),dw=img.naturalWidth*s,dh=img.naturalHeight*s;
    cx.drawImage(img,(W-dw)/2,(H-dh)/2,dw,dh);
    const blue=layer(),grey=layer();
    try{
      const src=cx.getImageData(0,0,W,H).data,n=W*H,lum=new Float32Array(n);
      for(let i=0;i<n;i++)lum[i]=.299*src[i*4]+.587*src[i*4+1]+.114*src[i*4+2];
      const b=blue.getContext('2d').createImageData(W,H),g=grey.getContext('2d').createImageData(W,H),bd=b.data,gd=g.data;
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        const i=y*W+x,l=lum[i];
        let e=0;if(x>0&&y>0&&x<W-1&&y<H-1){const gx=lum[i+1]-lum[i-1]+(lum[i-W+1]-lum[i-W-1]+lum[i+W+1]-lum[i+W-1])/2,gy=lum[i+W]-lum[i-W]+(lum[i+W-1]-lum[i-W-1]+lum[i+W+1]-lum[i-W+1])/2;e=Math.min(1,Math.hypot(gx,gy)/140);}
        const o=i*4;
        bd[o]=10+l*.05+e*120;bd[o+1]=34+l*.12+e*190;bd[o+2]=62+l*.2+e*230;bd[o+3]=255;
        const v=48+l*.62;gd[o]=v;gd[o+1]=v*.98;gd[o+2]=v*.95;gd[o+3]=255;
      }
      blue.getContext('2d').putImageData(b,0,0);grey.getContext('2d').putImageData(g,0,0);
    }catch{
      const bc=blue.getContext('2d');bc.filter='grayscale(1) brightness(.45) sepia(1) hue-rotate(170deg) saturate(2.5)';bc.drawImage(color,0,0);
      const gc=grey.getContext('2d');gc.filter='grayscale(1) contrast(.8) brightness(1.1)';gc.drawImage(color,0,0);
    }
    layers={color,blue,grey};
  }
  function buildTiles(){
    const cell=46*dpr;cols=Math.max(8,Math.round(W/cell));rows=Math.max(5,Math.round(H/cell));
    const r=rand(key.split('').reduce((n,c)=>n*31+c.charCodeAt(0),7));
    const prev=tiles;tiles=[];
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const x0=Math.round(x*W/cols),x1=Math.round((x+1)*W/cols),y0=Math.round(y*H/rows),y1=Math.round((y+1)*H/rows);
      tiles.push({x0,y0,w:x1-x0,h:y1-y0,rank:(rows-1-y)+r()*1.7+Math.abs(x-(cols-1)/2)/cols*.8,frame:Infinity,build:Infinity});
    }
    tiles.sort((a,b)=>a.rank-b.rank);
    if(prev.length){built=framed=0;}
  }
  function set(p,instant){
    progress=p;if(!tiles.length)return;
    const N=tiles.length,now=performance.now();
    const targetBuilt=finished?N:Math.round(N*p/total);
    const targetFrame=finished?N:Math.min(N,targetBuilt+Math.ceil(N/total*.55));
    const quick=instant||reduce,first=quick?0:now+250;
    const span=(from,to)=>Math.max(1,to-from);
    if(targetFrame>framed){const k=span(framed,targetFrame),step=quick?(instant&&!reduce?Math.min(6,900/k):0):Math.min(28,1100/k);for(let i=framed;i<targetFrame;i++)tiles[i].frame=(quick&&!instant?now-1e4:first)+(i-framed)*step;framed=targetFrame;}
    if(targetBuilt>built){const k=span(built,targetBuilt),step=quick?(instant&&!reduce?Math.min(6,900/k):0):Math.min(40,2200/k);const base=quick?first:now+700;for(let i=built;i<targetBuilt;i++)tiles[i].build=(quick&&!instant?now-1e4:base)+(i-built)*step;built=targetBuilt;if(finished&&!quick)celebrate=base+k*step+300;}
  }
  function slice(src,t,dy,alpha){ctx.globalAlpha=alpha;ctx.drawImage(src,t.x0,t.y0,t.w,t.h,t.x0,t.y0+dy,t.w,t.h);ctx.globalAlpha=1;}
  function spark(x,y,kind){if(reduce||particles.length>220)return;const n=kind==='dust'?5:3;for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*(kind==='dust'?1.2:2.4)*dpr,vy:-(Math.random()*(kind==='dust'?.6:2.2)+.3)*dpr,life:0,max:kind==='dust'?700:550,kind});}
  function frame(now){
    requestAnimationFrame(frame);
    if(!layers||!ctx||document.hidden)return;
    const {color,blue,grey}=layers;
    ctx.drawImage(blue,0,0);
    // retícula del plano que se dibuja al inicio
    const drawn=reduce?1:ease((now-born)/1600);
    ctx.strokeStyle='rgba(140,210,255,.13)';ctx.lineWidth=1;ctx.beginPath();
    for(let x=0;x<=cols;x++){const px=Math.round(x*W/cols)+.5;ctx.moveTo(px,H);ctx.lineTo(px,H-H*drawn);}
    for(let y=0;y<=rows;y++){const py=Math.round(y*H/rows)+.5;ctx.moveTo(0,py);ctx.lineTo(W*drawn,py);}
    ctx.stroke();
    const t=now/1000;
    for(const tile of tiles){
      const fa=ease((now-tile.frame)/450),ba=ease((now-tile.build)/600);
      if(fa>0&&ba<1){
        slice(grey,tile,-(1-fa)*6*dpr,fa*(1-ba)*.92);
        if(ba===0&&fa>=1){
          ctx.strokeStyle='rgba(242,190,92,.55)';ctx.lineWidth=dpr;ctx.setLineDash([4*dpr,3*dpr]);ctx.strokeRect(tile.x0+1.5*dpr,tile.y0+1.5*dpr,tile.w-3*dpr,tile.h-3*dpr);ctx.setLineDash([]);
          const blink=.5+.5*Math.sin(t*3+tile.rank*7);ctx.fillStyle=`rgba(255,196,90,${.25+.6*blink})`;ctx.fillRect(tile.x0+3*dpr,tile.y0+3*dpr,2.5*dpr,2.5*dpr);
          if(Math.random()<.0025)spark(tile.x0+tile.w*Math.random(),tile.y0+tile.h*.4,'spark');
        }
      }
      if(ba>0){
        if(ba<1&&!tile.dusted){tile.dusted=true;spark(tile.x0+tile.w/2,tile.y0+tile.h,'dust');}
        slice(color,tile,-(1-ba)*12*dpr,ba);
      }
    }
    // línea de avance de obra
    if(!finished&&framed<tiles.length){
      const front=tiles.slice(built,framed);if(front.length){const top=Math.min(...front.map(x=>x.y0));ctx.fillStyle='rgba(242,190,92,.08)';ctx.fillRect(0,top,W,2*dpr);}
    }
    // partículas: chispas de soldadura y polvo
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life+=16;p.x+=p.vx;p.y+=p.vy;p.vy+=(p.kind==='dust'?.01:.09)*dpr;const k=1-p.life/p.max;if(k<=0){particles.splice(i,1);continue;}ctx.fillStyle=p.kind==='dust'?`rgba(220,205,180,${k*.35})`:`rgba(255,${190+Math.random()*60|0},90,${k})`;const r=(p.kind==='dust'?3.5:1.4)*dpr*(p.kind==='dust'?1.6-k:1);ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill();}
    // destello final al terminar el edificio
    if(celebrate&&now>celebrate){const k=(now-celebrate)/1600;if(k<1){const x=-W*.3+k*W*1.6,g=ctx.createLinearGradient(x-W*.15,0,x+W*.15,0);g.addColorStop(0,'rgba(255,240,200,0)');g.addColorStop(.5,'rgba(255,240,200,.35)');g.addColorStop(1,'rgba(255,240,200,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}else celebrate=0;}
  }
  return {mount};
})();

function drawBuilding(){
  const a=state.avatar,n=state.history.length,labels=stageLabels();
  $('buildingName').textContent=a.building;
  $('projectStage').textContent=`${n} / ${state.total} etapas`;
  if(!$('sceneStage')){$('projectVisual').innerHTML=`<div class="scene-stage" id="sceneStage" role="img"><span class="scene-phase" id="scenePhase"></span><span class="scene-caption" id="sceneCaption"></span></div>`;}
  $('sceneStage').setAttribute('aria-label',`${a.building}: ${n} de ${state.total} etapas construidas`);
  $('scenePhase').innerHTML=state.finished?'Obra terminada':`<i></i>En obra: ${esc(labels[n]||'')}`;
  $('sceneCaption').innerHTML=`${avatarIcon(a)} ${esc(a.building)}`;
  Scene.mount($('sceneStage'),a,n,state.total,state.finished);
  $('projectStatus').style.setProperty('--stages',state.total);
  $('projectStatus').innerHTML=labels.map((label,i)=>`<div class="stage ${i<n?'built':''} ${i===n&&!state.finished?'current':''}"><span class="stage-dot" style="${i<n?`background:${a.color}`:''}"></span>${esc(label)}<small>${i<n?state.finished?state.history[i].work?`${state.history[i].work} retrabajo(s)`:'Sin retrabajo':'Etapa construida':i===n&&!state.finished?'En decisión':'Pendiente'}</small></div>`).join('');
}
function clock(){
  if(!state)return;
  const timer=$('timer'),box=timer.closest('.timer');
  if(state.finished){timer.textContent='Finalizada';box.classList.remove('urgent');return;}
  const seconds=Math.ceil(Math.max(0,state.deadline-Date.now())/1000);
  timer.textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  box.classList.toggle('urgent',seconds<=15);
  if(seconds===0&&expiredFor!==state.deadline){expiredFor=state.deadline;setTimeout(()=>refresh(true),600);}
}
async function refresh(force){
  if(!state)return;
  try{
    const next=await api(`/api/state?id=${encodeURIComponent(id)}`);
    const changed=force||next.history.length!==state.history.length||next.finished!==state.finished||JSON.stringify(next.leaderboard)!==JSON.stringify(state.leaderboard)||next.playerCount!==state.playerCount;
    const timedOut=next.history.length>state.history.length&&next.history.at(-1).choiceIndex===null;
    state=next;
    if(changed)render();
    if(timedOut)msg('Se agotó el tiempo: la etapa se registró sin una decisión definida.');
  }catch(e){
    if(/no encontrada/i.test(e.message)){localStorage.removeItem('bim-player-id');id=null;state=null;$('game').hidden=true;$('entry').hidden=false;document.body.classList.remove('in-game');msg('La partida ya no existe en el servidor. Inicia una nueva misión.');}
  }
}
function finishedView(){
  const max=Math.max(3,...state.history.map(h=>h.work||0));
  const bars=state.history.map((h,i)=>`<div class="bar-row"><span>${esc(stageLabels()[i])}</span><div class="bar"><i style="width:${100*(h.work||0)/max}%"></i></div><b>${h.work||0}</b></div>`).join('');
  const clean=state.history.filter(h=>!h.work).length;
  return `<span class="eyebrow">MISIÓN COMPLETADA</span><h2>Tu edificio está terminado</h2><div class="final-score"><strong>${state.rework}</strong><span>retrabajo(s)<br><small>${clean} de ${state.total} etapas sin retrabajo</small></span></div><div class="bars" aria-label="Retrabajo por etapa">${bars}</div><p class="hint">Abajo de la escena está el detalle de cada etapa y qué decisión lo habría evitado.</p><button id="again" type="button">Iniciar otra misión</button>`;
}
function historyItem(h,i){
  const best=h.best&&h.work>0&&h.best!==h.choice?`<p class="best"><span>Opción con menos retrabajo en esta etapa</span>${esc(h.best)}</p>`:'';
  return `<article class="history-item ${h.work?'has-work':'no-work'}"><h3>${i+1}. ${esc(h.title)}</h3><p><b>Tu decisión:</b> ${esc(h.choice)}</p><p>${esc(h.build)}</p><p class="hint">Efecto para el siguiente equipo: ${esc(h.effect)}</p><strong>${h.work} retrabajo(s)</strong>${h.carryover?'<p class="hint">Incluye 1 retrabajo por una incertidumbre arrastrada desde la etapa anterior.</p>':''}${best}${h.lesson?`<p class="lesson"><span>Concepto BIM</span>${esc(h.lesson)}</p>`:''}</article>`;
}
function feedbackView(){
  const last=state.history.at(-1);
  if(!last)return `<span class="eyebrow">LO QUE PASÓ EN LA OBRA</span><div class="feedback-empty" data-empty><span>🏗️</span><p>Aquí verás cómo tu decisión afecta a la obra y al siguiente equipo.</p></div>`;
  return `<span class="eyebrow">LO QUE PASÓ EN LA OBRA</span><h3 class="feedback-title">${esc(last.title)}</h3><p class="feedback-effect">${esc(last.effect)}</p><p class="feedback-build">${esc(last.build)}</p>`;
}
function resultView(){
  const ord=n=>`${n}<sup>º</sup>`;
  const head=state.myPlace?`<div class="my-place"><span>Quedaste en</span><strong>${ord(state.myPlace)}</strong><span>lugar de ${state.finishedCount} ${state.finishedCount===1?'participante que ha terminado':'participantes que han terminado'}</span></div>`:'';
  const pending=(state.playerCount||0)-(state.finishedCount||0);
  const rows=state.leaderboard.map(p=>{const a=avatars.find(x=>x.id===p.avatar);return `<div class="rank ${p.me?'me':''}"><strong>#${p.place}</strong><span>${avatarIcon(a)} ${esc(p.name)}</span><b>${p.rework}</b></div>`}).join('');
  return `<span class="eyebrow">RESULTADO FINAL</span>${head}<div class="rank-head"><span>Participante</span><span>Retrabajo</span></div><div class="rank-list">${rows}</div>${pending>0?`<p class="hint">${pending} ${pending===1?'persona sigue':'personas siguen'} jugando; la tabla se actualiza sola.</p>`:''}`;
}
function render(){
  if(!state)return;
  $('entry').hidden=true;$('game').hidden=false;document.body.classList.add('in-game');
  document.body.dataset.avatar=state.avatar.id;
  document.body.style.setProperty('--avatar-color',state.avatar.color);
  document.body.style.setProperty('--avatar-accent',state.avatar.accent);
  document.body.style.setProperty('--avatar-scene',`url('${sceneSrc(state.avatar)}')`);
  $('identity').innerHTML=`<span class="avatar-icon">${avatarIcon(state.avatar)}</span><strong>${esc(state.name)}</strong><small>${esc(state.avatar.name)}</small>`;
  clock();fitHeight();drawBuilding();
  $('historyCard').hidden=!state.finished;
  $('history').innerHTML=state.finished?state.history.map(historyItem).join(''):'';
  const side=$('sideCard'),html=state.finished?resultView():feedbackView();
  if(side.dataset.html!==html){side.innerHTML=html;side.dataset.html=html;side.classList.remove('flash');void side.offsetWidth;side.classList.add('flash');}
  side.classList.toggle('result',state.finished);side.classList.toggle('empty',!state.finished&&!state.history.length);
  if(state.finished){$('scenario').innerHTML=finishedView();$('again').onclick=newGame;return;}
  const m=state.mission;
  $('scenario').innerHTML=`<span class="eyebrow">MISIÓN ${state.history.length+1} DE ${state.total}${m.phase?` · ${esc(m.phase)}`:''}</span><h2>${esc(m.title)}</h2><p class="prompt">${esc(m.prompt)}</p><p class="hint">Sin respuestas incorrectas: cada opción construye distinto.</p>${m.options.map((o,i)=>`<button class="option" data-choice="${i}"><span class="option-key">${'ABC'[i]||i+1}</span>${esc(o)}</button>`).join('')}`;
  document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.choice)));
}
async function answer(choice){
  const buttons=document.querySelectorAll('[data-choice]');
  buttons.forEach(x=>{x.disabled=true;x.classList.toggle('selected',Number(x.dataset.choice)===choice);});
  try{state=await api('/api/answer',{id,choice,round:state.history.length});msg('');render();}
  catch(e){
    msg(e.message);
    try{state=await api(`/api/state?id=${encodeURIComponent(id)}`);render();}
    catch{buttons.forEach(x=>x.disabled=false);msg('No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.');}
  }
}
function selectAvatar(b){selected=b.dataset.avatar;document.querySelectorAll('[data-avatar]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b);});}
async function init(){try{avatars=await api('/api/avatars');$('avatars').innerHTML=avatars.map(a=>`<button class="avatar-card" data-avatar="${a.id}" type="button" aria-pressed="false" style="--card-scene:url('${sceneSrc(a)}')"><span>${avatarIcon(a)}</span><strong>${esc(a.name)}</strong><small>${esc(a.building)}</small></button>`).join('');document.querySelectorAll('[data-avatar]').forEach(b=>b.onclick=()=>selectAvatar(b));if(id){try{state=await api(`/api/state?id=${encodeURIComponent(id)}`);render();}catch{localStorage.removeItem('bim-player-id');id=null;}}}catch(e){msg(e.message);}}
async function start(){if(!$('name').value.trim()){msg('Escribe tu nombre para comenzar.');$('name').focus();return;}if(!selected){msg('Elige un personaje para comenzar.');$('avatars').scrollIntoView({block:'nearest'});return;}$('start').disabled=true;try{state=await api('/api/start',{name:$('name').value,avatar:selected});id=state.id;localStorage.setItem('bim-player-id',id);msg('');render();window.scrollTo({top:0});}catch(e){msg(e.message);}finally{$('start').disabled=false;}}
$('start').onclick=start;
$('name').addEventListener('keydown',e=>{if(e.key==='Enter')start();});
document.addEventListener('keydown',e=>{if(!state||state.finished||e.target.tagName==='INPUT')return;const i='abc'.indexOf(e.key.toLowerCase());const b=document.querySelector(`[data-choice="${i}"]`);if(i>=0&&b&&!b.disabled)b.click();});
init();
setInterval(clock,250);
setInterval(()=>refresh(false),2500);
