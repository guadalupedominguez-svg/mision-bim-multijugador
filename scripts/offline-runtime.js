const SAVE_KEY = 'bim-offline-game';
let game = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
function persist(){localStorage.setItem(SAVE_KEY, JSON.stringify(game))}
function order(round){const indices=[0,1,2];let seed=round+7;for(let i=2;i>0;i--){seed=(seed*1664525+1013904223)>>>0;const j=seed%(i+1);[indices[i],indices[j]]=[indices[j],indices[i]]}return indices}
function current(){
  const n=game.history.length;if(n>=OFFLINE.missions.length)return null;
  const base=OFFLINE.missions[n], id=game.avatar;
  return {title:OFFLINE.avatarTitles[id][n],phase:base.phase,prompt:`${OFFLINE.stories[id][n][0]} ${OFFLINE.pressure[n]}`,options:OFFLINE.elements[id][n]};
}
function advance(choice){
  const n=game.history.length,m=current();if(!m)return;
  const base=OFFLINE.missions[n];
  const chosen=choice===null?{text:'Tiempo agotado',work:2,effect:'El siguiente equipo recibe información sin una decisión definida y debe revisar el alcance.',build:'El proyecto avanza con una revisión pendiente.'}:{...base.options[choice],text:m.options[choice]};
  const carryover=game.history.at(-1)?.choiceIndex===2&&choice===1?1:0;
  game.history.push({title:m.title,phase:m.phase,choice:chosen.text,choiceIndex:choice,work:chosen.work+carryover,carryover,effect:chosen.effect+(carryover?' La incertidumbre de la etapa anterior obliga además a verificar y rehacer parte del trabajo.':''),build:chosen.build});
  game.deadline=game.history.length===OFFLINE.missions.length?null:Date.now()+75000;persist();
}
function expire(){while(game?.deadline&&Date.now()>=game.deadline)advance(null)}
function gameState(){
  expire();const m=current(),finished=!m,work=game.history.reduce((sum,h)=>sum+h.work,0);
  return {id:game.id,name:game.name,avatar:OFFLINE.avatars.find(a=>a.id===game.avatar),history:game.history.map(h=>({...h,...(!finished?{work:undefined,carryover:undefined}:{})})),...(finished?{rework:work}:{}),total:OFFLINE.missions.length,finished,deadline:game.deadline,questionMs:75000,mission:m&&{title:m.title,phase:m.phase,prompt:m.prompt,options:order(game.history.length).map(i=>m.options[i])},standings:[{name:game.name,avatar:game.avatar,progress:game.history.length,finished,place:1}],leaderboard:finished?[{name:game.name,avatar:game.avatar,rework:work}]:[]};
}
async function offlineApi(path,data){
  if(path==='/api/avatars')return OFFLINE.avatars;
  if(path==='/api/start'){
    const name=String(data.name||'').trim().slice(0,40);
    if(!name||!OFFLINE.avatars.some(a=>a.id===data.avatar))throw Error('Elige un nombre y un personaje.');
    game={id:`local-${Date.now()}`,name,avatar:data.avatar,history:[],deadline:Date.now()+75000};persist();return gameState();
  }
  if(!game||!path.includes(game.id)&&data?.id!==game.id)throw Error('Partida no encontrada. Inicia una nueva.');
  if(path.startsWith('/api/state'))return gameState();
  if(path==='/api/answer'){
    expire();if(data.round!==game.history.length)throw Error('El tiempo terminó. Se abrió la siguiente pregunta.');
    if(!Number.isInteger(data.choice)||data.choice<0||data.choice>2)throw Error('Opción inválida.');
    advance(order(game.history.length)[data.choice]);return gameState();
  }
  throw Error('Solicitud desconocida.');
}
