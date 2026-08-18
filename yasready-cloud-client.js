(function(){'use strict';
const cfg=()=>window.YR_CLOUD_CONFIG||{};let sessionCache=null,revisions={};
const isLocal=()=>/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
let yrExchangePromise=null;
async function bootstrapYasReadySession(){
  if(yrExchangePromise)return yrExchangePromise;
  yrExchangePromise=(async()=>{
    const tokenResponse=await fetch('/api/yr-access-token',{method:'GET',credentials:'same-origin',cache:'no-store'});
    let tokenData={};try{tokenData=await tokenResponse.json()}catch{}
    if(!tokenResponse.ok||!tokenData.token){
      const e=new Error(tokenData.message||'Cloudflare Access session is unavailable on this YasReady page.');
      e.status=tokenResponse.status;
      throw e;
    }
    const c=cfg();
    const exchange=await fetch(String(c.apiBase||'').replace(/\/$/,'')+'/v1/session/exchange',{
      method:'POST',
      headers:{'Content-Type':'application/json','X-YR-Access-Token':tokenData.token},
      credentials:'include',
      body:'{}',
      cache:'no-store'
    });
    let data={};try{data=await exchange.json()}catch{}
    if(!exchange.ok){
      const e=new Error(data.message||data.error||('YasReady session exchange failed ('+exchange.status+')'));
      e.status=exchange.status;e.data=data;throw e;
    }
    return data;
  })().finally(()=>{yrExchangePromise=null});
  return yrExchangePromise;
}
async function api(path,opt={}){
  const c=cfg(),headers={'Content-Type':'application/json',...(opt.headers||{})};
  if(isLocal()&&c.devEmail)headers['X-YR-Dev-Email']=c.devEmail;
  const make=()=>fetch(String(c.apiBase||'').replace(/\/$/,'')+path,{method:opt.method||'GET',headers,credentials:'include',body:opt.body===undefined?undefined:JSON.stringify(opt.body),cache:'no-store'});
  let r=await make(),d={};try{d=await r.clone().json()}catch{}
  if(r.status===401&&!opt.noRedirect&&!isLocal()&&path!=='/v1/session/exchange'){
    await bootstrapYasReadySession();
    r=await make();d={};try{d=await r.clone().json()}catch{}
  }
  if(!r.ok){const e=new Error(d.message||d.error||('YasReady Core '+r.status));e.status=r.status;e.data=d;throw e}
  return d;
}
async function session(force=false){if(sessionCache&&!force)return sessionCache;sessionCache=await api('/v1/session');return sessionCache}
async function setActiveBusiness(id){await api('/v1/active-business',{method:'POST',body:{businessId:id}});sessionCache=null;localStorage.setItem('yr-cloud-active-business-id',id);return session(true)}
function activeBusiness(s){s=s||sessionCache;if(!s)return null;const preferred=localStorage.getItem('yr-cloud-active-business-id')||s.activeBusinessId;return s.businesses?.find(b=>b.id===preferred)||s.businesses?.[0]||null}
async function loadState(module,businessId){const d=await api(`/v1/state/${encodeURIComponent(module)}?business_id=${encodeURIComponent(businessId)}`);revisions[module+':'+businessId]=d.revision||0;return d}
async function saveState(module,businessId,state){const k=module+':'+businessId,revision=revisions[k]??0;try{const d=await api(`/v1/state/${encodeURIComponent(module)}`,{method:'PUT',body:{businessId,revision,state}});revisions[k]=d.revision;return d}catch(e){if(e.status===409){const latest=await loadState(module,businessId);throw Object.assign(new Error('cloud_conflict'),{latest})}throw e}}
function enabled(b,module){return Boolean(b?.modules?.[module]?.enabled)}
function productUrl(product){const c=cfg();return ({home:c.homeUrl,business:c.businessUrl,studio:c.studioUrl,events:c.eventsUrl,admin:c.adminUrl})[product]||c.homeUrl}
window.YasReadyCloud={VERSION:'0.3.2',api,session,setActiveBusiness,activeBusiness,loadState,saveState,enabled,productUrl,config:cfg,isLocal};
})();