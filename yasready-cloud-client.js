(function(){'use strict';
const cfg=()=>window.YR_CLOUD_CONFIG||{};let sessionCache=null,revisions={};
const isLocal=()=>/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
async function api(path,opt={}){
  const c=cfg(),headers={'Content-Type':'application/json',...(opt.headers||{})};
  if(isLocal()&&c.devEmail)headers['X-YR-Dev-Email']=c.devEmail;
  const r=await fetch(String(c.apiBase||'').replace(/\/$/,'')+path,{method:opt.method||'GET',headers,credentials:'include',body:opt.body===undefined?undefined:JSON.stringify(opt.body),cache:'no-store'});
  let d={};try{d=await r.json()}catch{}
  if(r.status===401&&!opt.noRedirect&&!isLocal()){
    location.href=String(c.authBase||'').replace(/\/$/,'')+'/session/start?return_to='+encodeURIComponent(location.href);
    throw new Error('Redirecting to YasReady sign-in');
  }
  if(!r.ok){const e=new Error(d.error||('YasReady Core '+r.status));e.status=r.status;e.data=d;throw e}
  return d;
}
async function session(force=false){if(sessionCache&&!force)return sessionCache;sessionCache=await api('/v1/session');return sessionCache}
async function setActiveBusiness(id){await api('/v1/active-business',{method:'POST',body:{businessId:id}});sessionCache=null;localStorage.setItem('yr-cloud-active-business-id',id);return session(true)}
function activeBusiness(s){s=s||sessionCache;if(!s)return null;const preferred=localStorage.getItem('yr-cloud-active-business-id')||s.activeBusinessId;return s.businesses?.find(b=>b.id===preferred)||s.businesses?.[0]||null}
async function loadState(module,businessId){const d=await api(`/v1/state/${encodeURIComponent(module)}?business_id=${encodeURIComponent(businessId)}`);revisions[module+':'+businessId]=d.revision||0;return d}
async function saveState(module,businessId,state){const k=module+':'+businessId,revision=revisions[k]??0;try{const d=await api(`/v1/state/${encodeURIComponent(module)}`,{method:'PUT',body:{businessId,revision,state}});revisions[k]=d.revision;return d}catch(e){if(e.status===409){const latest=await loadState(module,businessId);throw Object.assign(new Error('cloud_conflict'),{latest})}throw e}}
function enabled(b,module){return Boolean(b?.modules?.[module]?.enabled)}
function productUrl(product){const c=cfg();return ({home:c.homeUrl,business:c.businessUrl,studio:c.studioUrl,events:c.eventsUrl,admin:c.adminUrl})[product]||c.homeUrl}
window.YasReadyCloud={VERSION:'0.3.0',api,session,setActiveBusiness,activeBusiness,loadState,saveState,enabled,productUrl,config:cfg,isLocal};
})();