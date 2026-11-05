const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const stories = require('./avatar-stories');
const dilemmas = require('./decision-dilemmas');
const avatarTitles = {
  gol:['Planos antes del silbatazo','El acceso a vestidores','Una nueva alineación de espacios','Gradas listas para el partido','La entrega del estadio'],
  yardas:['El playbook de obra','La ruta hacia la zona de anotación','Cambio de jugada en las gradas','La ventana de fabricación','El marcador final'],
  pista:['La estrategia del team principal','Entrada a boxes','Una parada anticipada','Piezas contra reloj','Bandera a cuadros'],
  guardian:['Dos mapas de la ciudad','La energía de la torre','Una ruta urgente','Ventanas de la torre','El relevo del guardián'],
  magia:['Los dos pergaminos','El conducto encantado','El pasaje secreto','El cambio del consejo','Abrir la academia'],
  rosa:['Dos bocetos de la casa','La iluminación','Un cambio vistoso','Ventanas a medida','La casa terminada'],
  samurai:['El plano del dojo','La viga y el conducto','El camino más corto','Los paneles nuevos','El siguiente maestro'],
  cosmos:['Coordenadas de lanzamiento','Oxígeno y estructura','El cable más corto','Ventanas de observación','El relevo de tripulación'],
  bloques:['Instrucciones de ensamble','Una pieza que no encaja','El módulo más rápido','Ventanas de bloques','El manual final']
};
const PORT = Number(process.env.PORT || 3000);
const QUESTION_MS = Math.max(5, Number(process.env.QUESTION_SECONDS) || 75) * 1000;
const HOST_KEY = process.env.HOST_KEY || crypto.randomBytes(16).toString('hex');
const players = new Map();
const avatars = [
  { id:'gol', name:'Estrella del balón', building:'Arena deportiva', color:'#57d7a4', accent:'#f5d76f', icon:'⚽' },
  { id:'yardas', name:'Titán del emparrillado', building:'Estadio de campeones', color:'#fa9a5d', accent:'#d8e9ff', icon:'🏈' },
  { id:'pista', name:'As del circuito', building:'Centro de velocidad', color:'#ff666b', accent:'#fafafa', icon:'🏎️' },
  { id:'guardian', name:'Guardián de la ciudad', building:'Torre de la alianza', color:'#9b8cff', accent:'#6ee8db', icon:'⚡' },
  { id:'magia', name:'Aprendiz de hechizos', building:'Academia encantada', color:'#bc8ae8', accent:'#f4d57b', icon:'🧙' },
  { id:'rosa', name:'Constructor brillante', building:'Casa de los sueños', color:'#f489b9', accent:'#ffe7a8', icon:'🛠️' },
  { id:'samurai', name:'Explorador del anime', building:'Dojo del futuro', color:'#65c9ee', accent:'#ffbd70', icon:'🧑' },
  { id:'cosmos', name:'Viajero espacial', building:'Base estelar', color:'#7bafff', accent:'#c7fbff', icon:'🚀' },
  { id:'bloques', name:'Maestro de bloques', building:'Ciudad de bloques', color:'#f5c447', accent:'#e95b4f', icon:'🧱' }
];
const missions = [
  { title:'Planos que no coinciden', phase:'Diseño → Construcción', stage:'Planos', lesson:'Coordinación entre disciplinas y una sola fuente de verdad: cuando arquitectura y estructura publican versiones distintas, la duda viaja a obra. Un entorno común de datos (CDE) con versiones aprobadas evita replantear dos veces.', prompt:'Antes de iniciar la cimentación, el plano estructural y el arquitectónico muestran posiciones distintas para una columna. ¿Cómo liberas los planos para obra?', options:[
    {text:'Comparo versiones, coordino la posición con ambas disciplinas y emito planos revisados.',work:0,effect:'Construcción recibe una referencia única y puede replantear la columna.',build:'El proyecto arranca con planos coordinados.'},
    {text:'Marco la diferencia en una nota de plano y programo la revisión formal para después.',work:1,effect:'Construcción debe confirmar la posición antes de ejecutar.',build:'El replanteo comienza con una aclaración pendiente.'},
    {text:'Entrego ambos planos y pido que obra decida la ubicación en campo.',work:3,effect:'Construcción replantea dos veces y ajusta trabajos ya preparados.',build:'La cimentación arranca con una discrepancia por resolver.'}
  ]},
  { title:'La ruta del ducto', phase:'Diseño → Construcción', stage:'Estructura', lesson:'Detección de interferencias: resolver el choque entre instalaciones y estructura en el modelo cuesta minutos; resolverlo en campo implica detener cuadrillas y rehacer trabajo.', prompt:'El modelo muestra que un ducto cruza una viga. ¿Cómo entregas la información a construcción?', options:[
    {text:'Coordino ambas disciplinas y publico una revisión del modelo.',work:0,effect:'Obra recibe una ruta coordinada y puede instalar sin correcciones.',build:'La estructura se levanta con una ruta libre para las instalaciones.'},
    {text:'Comparto un croquis y actualizo el modelo después.',work:1,effect:'Obra debe verificar en campo qué versión corresponde.',build:'La estructura avanza con una anotación pendiente.'},
    {text:'Pido a obra que ajuste el ducto al llegar a ese punto.',work:3,effect:'Obra detiene la instalación y modifica trabajo preparado.',build:'La estructura se levanta con una interferencia por resolver.'}
  ]},
  { title:'Una ruta distinta en campo', phase:'Construcción → Diseño', stage:'Instalaciones', lesson:'Gestión de cambios en campo: no todo cambio exige detener el frente. Una prueba limitada y reversible, confirmada con las otras especialidades, protege el espacio de los demás sin frenar la obra.', prompt:'Aparece una ruta más corta para la tubería. ¿Qué haces antes de construirla?', options:[
    {text:'Documento el cambio, consulto a diseño y actualizo lo ejecutado.',work:1,effect:'La revisión general detiene el frente y obliga a repetir la preparación del montaje. Diseño recibe una ruta verificada.',build:'Las instalaciones se integran con información coordinada, tras reprogramar el montaje.'},
    {text:'Confirmo el cambio por llamada y guardo fotografías.',work:0,effect:'La prueba limitada confirma la nueva ruta antes de extenderla. Diseño recibe una decisión verificada sin detener los demás frentes.',build:'Las instalaciones avanzan por tramos con una ruta comprobada.'},
    {text:'Instalo la ruta más corta y aviso al terminar.',work:2,effect:'Diseño descubre el cambio cuando otra especialidad necesita ese espacio.',build:'Las instalaciones funcionan, aunque se produce un conflicto de espacio.'}
  ]},
  { title:'Preparar la fachada', phase:'Diseño → Construcción', stage:'Fachada', lesson:'Control de versiones antes de fabricar: lo que sale a fábrica con medidas desactualizadas regresa como piezas corregidas. Modelo, planos y cantidades deben cambiar juntos.', prompt:'El cliente cambia el tamaño de las ventanas antes de fabricar la fachada. ¿Cómo comunicas la modificación?', options:[
    {text:'Actualizo modelo, planos y cantidades; notifico la nueva versión.',work:0,effect:'Obra recibe medidas consistentes antes de fabricar.',build:'La fachada toma forma con ventanas alineadas al cambio.'},
    {text:'Envío medidas al fabricante y actualizo el modelo al cierre.',work:1,effect:'Obra debe conciliar documentos de distintas versiones.',build:'La fachada se monta con un ajuste pendiente en la información.'},
    {text:'Comunico el cambio en reunión y dejo que obra lo resuelva.',work:3,effect:'Llegan componentes con medidas anteriores y se modifican.',build:'La fachada se instala después de corregir piezas.'}
  ]},
  { title:'Entregar lo construido', phase:'Construcción → Operación', stage:'Entrega', lesson:'Información para operación (as-built): un modelo verificado y vinculado a equipos y garantías ahorra a operación reconstruir datos cada vez que necesita intervenir el edificio.', prompt:'El cliente necesita localizar equipos, garantías y cambios realizados. ¿Qué entregas?', options:[
    {text:'Verifico en campo y vinculo equipos, garantías y cambios al modelo.',work:0,effect:'Operación recibe información localizable y confiable.',build:'El edificio queda listo para operar con un registro completo.'},
    {text:'Entrego fotografías, garantías y lista de cambios junto al modelo.',work:1,effect:'Operación debe relacionar los documentos manualmente.',build:'El edificio abre con documentación que requiere organización.'},
    {text:'Entrego planos finales y respondo consultas cuando aparezcan.',work:2,effect:'Operación reconstruye información al necesitar cada equipo.',build:'El edificio abre, con trabajo documental pendiente.'}
  ]}
];
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
function body(req){return new Promise((resolve,reject)=>{let raw='';req.on('data',c=>{raw+=c;if(raw.length>10000)reject(new Error('Solicitud demasiado grande'));});req.on('end',()=>{try{resolve(JSON.parse(raw||'{}'));}catch{reject(new Error('JSON inválido'));}});});}
function score(p){return p.history.reduce((n,h)=>n+h.work,0);}
function themedMissionAt(avatar,index){const m=missions[index];if(!m)return null;const story=stories[avatar]?.[index];const labels=dilemmas.choices(avatar,index);return {...m,title:avatarTitles[avatar]?.[index]||m.title,prompt:`${story?.[0]||m.prompt} ${dilemmas.pressure[index]}`,options:m.options.map((o,i)=>({...o,text:labels[i]}))};}
function themedMission(p){return themedMissionAt(p.avatar,p.history.length);}
function bestOption(avatar,index){const m=themedMissionAt(avatar,index);return m.options.reduce((a,b)=>b.work<a.work?b:a);}
function optionOrder(p){const bytes=crypto.createHash('sha256').update(`${p.id}:${p.history.length}`).digest();const order=[0,1,2];for(let i=2;i>0;i--){const j=bytes[2-i]%(i+1);[order[i],order[j]]=[order[j],order[i]];}return order;}
function advance(p,choice){const m=themedMission(p);if(!m)return;const o=choice===null?{text:'Tiempo agotado',work:2,effect:'El siguiente equipo recibe información sin una decisión definida y debe revisar el alcance.',build:'El proyecto avanza con una revisión pendiente.'}:m.options[choice];const carryover=p.history.at(-1)?.choiceIndex===2&&choice===1?1:0;const effect=o.effect+(carryover?' La incertidumbre de la etapa anterior obliga además a verificar y rehacer parte del trabajo.':'');p.history.push({title:m.title,phase:m.phase,choice:o.text,choiceIndex:choice,work:o.work+carryover,carryover,effect,build:o.build});if(p.history.length===missions.length){p.finishedAt=Date.now();p.deadline=null;}else p.deadline=Date.now()+QUESTION_MS;}
function expire(p){while(p.deadline&&Date.now()>=p.deadline)advance(p,null);}
function standings(){const list=[...players.values()];list.forEach(expire);list.sort((a,b)=>b.history.length-a.history.length||(a.finishedAt||0)-(b.finishedAt||0));let place=0,prior=-1;return list.map((p,i)=>{if(p.history.length!==prior)place=i+1;prior=p.history.length;return {id:p.id,name:p.name,avatar:p.avatar,progress:p.history.length,finished:!!p.finishedAt,place};});}
function state(p){expire(p);const m=themedMission(p);const finished=!m;return {id:p.id,name:p.name,avatar:avatars.find(a=>a.id===p.avatar),history:p.history.map((h,i)=>({title:h.title,phase:h.phase,choice:h.choice,choiceIndex:h.choiceIndex,effect:h.effect,build:h.build,...(finished?{work:h.work,carryover:h.carryover,lesson:missions[i].lesson,best:bestOption(p.avatar,i).text}:{})})),...(finished?{rework:score(p)}:{}),total:missions.length,stages:missions.map(m=>m.stage),finished,deadline:p.deadline,questionMs:QUESTION_MS,mission:m&&{title:m.title,phase:m.phase,prompt:m.prompt,options:optionOrder(p).map(i=>m.options[i].text)},standings:standings().map(({id,...rest})=>rest),...(finished?ranking(p):{leaderboard:[]})};}
function ranking(p){const list=[...players.values()].filter(x=>x.finishedAt).map(x=>({id:x.id,name:x.name,avatar:x.avatar,rework:score(x),finishedAt:x.finishedAt})).sort((a,b)=>a.rework-b.rework||a.finishedAt-b.finishedAt);let place=0,prior=-1,myPlace=null;const leaderboard=list.map((x,i)=>{if(x.rework!==prior)place=i+1;prior=x.rework;if(x.id===p.id)myPlace=place;return {name:x.name,avatar:x.avatar,rework:x.rework,place,me:x.id===p.id};});return {leaderboard,myPlace,finishedCount:list.length,playerCount:players.size};}
const server=http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,`http://${req.headers.host}`);
  if(req.method==='GET'&&url.pathname==='/healthz')return send(res,200,{ok:true});
  if(req.method==='GET'&&url.pathname==='/api/avatars')return send(res,200,avatars);
  if(req.method==='POST'&&url.pathname==='/api/start'){const x=await body(req);const name=String(x.name||'').trim().slice(0,40);if(!name||!avatars.some(a=>a.id===x.avatar))return send(res,400,{error:'Elige un nombre y un personaje.'});const id=crypto.randomUUID();const p={id,name,avatar:x.avatar,history:[],finishedAt:null,deadline:Date.now()+QUESTION_MS};players.set(id,p);return send(res,200,state(p));}
  if(req.method==='GET'&&url.pathname==='/api/state'){const p=players.get(url.searchParams.get('id'));return p?send(res,200,state(p)):send(res,404,{error:'Partida no encontrada. Inicia una nueva.'});}
  if(req.method==='POST'&&url.pathname==='/api/answer'){const x=await body(req);const p=players.get(x.id);if(!p)return send(res,404,{error:'Partida no encontrada.'});expire(p);const m=missions[p.history.length];if(!m)return send(res,409,{error:'La misión ya terminó.'});if(x.round!==p.history.length)return send(res,409,{error:'El tiempo terminó. Se abrió la siguiente pregunta.'});if(!Number.isInteger(x.choice)||x.choice<0||x.choice>=m.options.length)return send(res,400,{error:'Opción inválida.'});advance(p,optionOrder(p)[x.choice]);return send(res,200,state(p));}
  if(url.pathname.startsWith('/api/host')&&url.searchParams.get('key')!==HOST_KEY)return send(res,403,{error:'Acceso de host no autorizado.'});
  if(req.method==='GET'&&url.pathname==='/api/host'){const avatarName=id=>avatars.find(a=>a.id===id)?.name||id;const finished=[...players.values()].filter(x=>x.finishedAt).map(x=>({name:x.name,avatar:x.avatar,avatarName:avatarName(x.avatar),rework:score(x),finishedAt:x.finishedAt})).sort((a,b)=>a.rework-b.rework||a.finishedAt-b.finishedAt);let place=0,prior=-1;const leaderboard=finished.map((x,i)=>{if(x.rework!==prior)place=i+1;prior=x.rework;return {place,name:x.name,avatar:x.avatar,avatarName:x.avatarName,rework:x.rework};});return send(res,200,{players:standings().map(({id,...p})=>({...p,avatarName:avatarName(p.avatar),rework:p.finished?score(players.get(id)):null,remainingMs:p.finished?0:Math.max(0,players.get(id).deadline-Date.now())})),leaderboard,stages:missions.map(m=>m.stage),reworkByStage:missions.map((_,i)=>[...players.values()].reduce((n,x)=>n+(x.finishedAt?x.history[i].work:0),0)),total:missions.length,questionMs:QUESTION_MS});}
  if(req.method==='GET'&&url.pathname==='/api/host/export'){const csvCell=v=>{const t=String(v??'');return /[",\n;]/.test(t)?`"${t.replace(/"/g,'""')}"`:t;};const head=['Nombre','Personaje','Etapas completadas','Terminó','Retrabajo total',...missions.flatMap(m=>[`${m.stage}: decisión`,`${m.stage}: retrabajo`])];const rows=[...players.values()].map(x=>{expire(x);return [x.name,avatars.find(a=>a.id===x.avatar)?.name||x.avatar,x.history.length,x.finishedAt?'Sí':'No',x.finishedAt?score(x):'',...missions.flatMap((_,i)=>x.history[i]?[x.history[i].choice,x.history[i].work]:['',''])];});const csv='\ufeff'+[head,...rows].map(r=>r.map(csvCell).join(',')).join('\r\n');res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="mision-bim-resultados-${new Date().toISOString().slice(0,10)}.csv"`,'Cache-Control':'no-store'});return res.end(csv);}
  if(req.method==='POST'&&url.pathname==='/api/host/reset'){const removed=players.size;players.clear();return send(res,200,{ok:true,removed});}
  if(req.method==='GET'&&url.pathname.startsWith('/assets/anim/')){const name=url.pathname.slice('/assets/anim/'.length);if(!/^[a-z0-9-]+\.webp$/.test(name)||!fs.existsSync(path.join(__dirname,'public','assets','anim',name)))return send(res,404,{error:'No encontrado.'});res.writeHead(200,{'Content-Type':'image/webp','Cache-Control':'public, max-age=3600'});return fs.createReadStream(path.join(__dirname,'public','assets','anim',name)).pipe(res);}
  if(req.method==='GET'&&url.pathname.startsWith('/assets/')){const name=url.pathname.slice('/assets/'.length);if(!avatars.some(a=>`${a.id}.png`===name))return send(res,404,{error:'No encontrado.'});res.writeHead(200,{'Content-Type':'image/png','Cache-Control':'no-cache'});return fs.createReadStream(path.join(__dirname,'public','assets',name)).pipe(res);}
  if(req.method==='GET'&&['/','/index.html','/style.css','/app.js','/scene-anim.js','/host.html','/host.js'].includes(url.pathname)){const file=path.join(__dirname,'public',url.pathname==='/'?'index.html':url.pathname.slice(1));res.writeHead(200,{'Content-Type':`${file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html'}; charset=utf-8`});return fs.createReadStream(file).pipe(res);}
  send(res,404,{error:'No encontrado.'});
}catch(e){send(res,400,{error:e.message});}});
if(require.main===module){
  server.listen(PORT,'0.0.0.0',()=>{console.log(`BIM Obra Compartida: http://localhost:${PORT}`);console.log(`Vista privada del host: http://localhost:${PORT}/host.html?key=${encodeURIComponent(HOST_KEY)}`);});
  setInterval(()=>{for(const p of players.values())expire(p);},1000).unref();
}
module.exports={avatars,missions,avatarTitles,stories,dilemmas};
