// Subí el número de versión cada vez que cambies cualquier archivo de la app
const V='informe-planta-v4';
const FILES=['./','index.html','style.css','app.js','brand.js','config.js','jspdf.umd.min.js','manifest.json','icon-192.png','icon-512.png','logo.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
