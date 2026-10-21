const C='mf-v1',F=['./','index.html','app.js','style.css','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('mf-')&&x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
const p=n=>String(n).padStart(2,'0'),ds=d=>`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
async function check(fresh){const r=await(await caches.open('cfg')).match('cfg');if(!r)return;const c=await r.json();if(!c.on)return;
const d=new Date(),m=d.getHours()*60+d.getMinutes(),today=ds(d),tom=ds(new Date(+d+864e5));
const due=(c.due||[]).filter(x=>x.d<=tom).map(x=>`${x.n} (RD$${x.a}${x.d<today?', vencido':x.d===today?', hoy':', mañana'})`);
for(const t of c.times){const[h,mi]=t.split(':'),s=h*60+ +mi;if(m>=s&&m<s+(fresh?3:90))await self.registration.showNotification('Mis Finanzas',{body:'Anota lo que gastaste hoy.'+(due.length?' Pagos pendientes: '+due.join(', '):''),tag:'rec-'+today+'-'+t,icon:'icon-192.png',badge:'icon-192.png'})}}
self.addEventListener('periodicsync',e=>{if(e.tag==='recordatorios')e.waitUntil(check(false))});
self.addEventListener('message',e=>{if(e.data&&e.data.fresh)e.waitUntil(check(true))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('./')))});
