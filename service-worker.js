const VERSION='v4.56';
const C='hkmaru-v4.56';
const A=['./','./index.html','./manifest.json','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-192.png','./assets/icon-maskable-512.png','./assets/kc_mark.png'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil((async()=>{
    const cache=await caches.open(C);
    for(const url of A){
      try{
        const res=await fetch(url,{cache:'reload'});
        if(res&&res.ok)await cache.put(url,res.clone());
      }catch(_){}
    }
  })());
});

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('hkmaru-')&&k!==C).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  const isNav=req.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html');
  if(isNav){
    e.respondWith((async()=>{
      try{
        const res=await fetch(req,{cache:'no-store'});
        if(res&&res.ok){
          const cache=await caches.open(C);
          await cache.put('./index.html',res.clone());
        }
        return res;
      }catch(_){
        return (await caches.match('./index.html'))||(await caches.match('./'))||Response.error();
      }
    })());
    return;
  }
  e.respondWith((async()=>{
    try{
      const res=await fetch(req,{cache:'no-cache'});
      if(res&&res.ok){
        const cache=await caches.open(C);
        cache.put(req,res.clone()).catch(()=>{});
      }
      return res;
    }catch(_){
      return (await caches.match(req))||Response.error();
    }
  })());
});
