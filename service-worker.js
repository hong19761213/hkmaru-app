const CACHE='hkmaru-v4.91';
const CORE=['./','./index.html','./sign.html'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('hkmaru-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;e.respondWith((async()=>{try{const r=await fetch(e.request,{cache:'no-store'});const c=await caches.open(CACHE);if(r&&r.ok)c.put(e.request,r.clone()).catch(()=>{});return r;}catch(err){return (await caches.match(e.request))||(await caches.match('./index.html'));}})());});
