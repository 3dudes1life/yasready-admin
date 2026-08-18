(function(){'use strict';
const MODULE=document.documentElement.dataset.yrModule||document.body?.dataset.yrModule||'';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function css(){const st=document.createElement('style');st.textContent=`
#yrPlatformBar{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));z-index:99980;font:700 12px Inter,-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif}
#yrPlatformButton{display:flex;align-items:center;gap:8px;max-width:min(330px,calc(100vw - 28px));height:42px;padding:0 11px;border:1px solid rgba(127,127,140,.24);border-radius:13px;background:rgba(255,255,255,.94);color:#171719;box-shadow:0 10px 30px rgba(20,20,30,.14);backdrop-filter:blur(18px);cursor:pointer}
html[data-theme="dark"] #yrPlatformButton,html[data-theme="dark"] #yrPlatformMenu{background:rgba(24,24,27,.96);color:#f7f7f8;border-color:#35353b}
#yrPlatformButton .yrDot{width:8px;height:8px;flex:0 0 auto;border-radius:50%;background:#9ee53d;box-shadow:0 0 0 3px rgba(158,229,61,.12)}
#yrPlatformButton b{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#yrPlatformButton small{color:#77777f;font-weight:650;white-space:nowrap}
#yrPlatformMenu{display:none;position:absolute;right:0;bottom:48px;width:min(340px,calc(100vw - 28px));padding:10px;border:1px solid #e1e1e6;border-radius:16px;background:#fff;color:#171719;box-shadow:0 20px 60px rgba(20,20,30,.20)}
#yrPlatformBar.open #yrPlatformMenu{display:block}.yrPMUser{padding:9px 9px 10px;border-bottom:1px solid rgba(127,127,140,.16);margin-bottom:7px}.yrPMUser b,.yrPMUser small{display:block}.yrPMUser small{margin-top:3px;color:#7b7b83;overflow:hidden;text-overflow:ellipsis}
#yrBusinessSelect{width:100%;height:42px;border:1px solid rgba(127,127,140,.22);border-radius:11px;padding:0 10px;background:transparent;color:inherit;font:inherit;margin:4px 0 9px}
.yrProductGrid{display:grid;grid-template-columns:1fr 1fr;gap:6px}.yrProductGrid a{padding:10px;border-radius:10px;text-decoration:none;color:inherit;background:rgba(127,127,140,.07);font-weight:800}.yrProductGrid a.active{background:#171719;color:#fff}html[data-theme="dark"] .yrProductGrid a.active{background:#f5f5f7;color:#171719}
.yrPMMeta{margin-top:8px;padding:8px 9px;border-radius:10px;background:rgba(127,127,140,.06);color:#77777f;font-size:10px;line-height:1.4}
@media(max-width:720px){#yrPlatformBar{right:max(9px,env(safe-area-inset-right));bottom:max(10px,env(safe-area-inset-bottom))}#yrPlatformButton{height:40px;max-width:210px}#yrPlatformButton small{display:none}#yrPlatformButton b{max-width:145px}.yrProductGrid{grid-template-columns:1fr 1fr}}
`;document.head.appendChild(st)}
async function init(){
 css();let sess;try{sess=await YasReadyCloud.session()}catch(e){console.warn('YasReady shared shell',e);return}
 const active=YasReadyCloud.activeBusiness(sess);const bar=document.createElement('div');bar.id='yrPlatformBar';
 bar.innerHTML=`<button id="yrPlatformButton" type="button" aria-expanded="false" aria-label="Switch business or YasReady product"><span class="yrDot"></span><b>${esc(active?.name||'Choose business')}</b><small>${esc(MODULE||'YasReady')}</small><span>⌃</span></button>
 <div id="yrPlatformMenu"><div class="yrPMUser"><b>${esc(sess.user?.displayName||sess.user?.email||'YasReady user')}</b><small>${esc(sess.user?.email||'')}</small></div>
 <select id="yrBusinessSelect" aria-label="Active business">${(sess.businesses||[]).map(b=>`<option value="${esc(b.id)}" ${b.id===active?.id?'selected':''}>${esc(b.name)} · ${esc(b.role)}</option>`).join('')}</select>
 <div class="yrProductGrid">${[['business','Business'],['studio','Studio'],['events','Events'],['admin','Admin']].map(([k,label])=>`<a class="${MODULE===k?'active':''}" href="${esc(YasReadyCloud.productUrl(k))}">${label}</a>`).join('')}</div>
 <div class="yrPMMeta">${active?`Active business: <b>${esc(active.name)}</b><br>Business context follows you across YasReady.`:'Create or join a business in YasReady Business first.'}</div></div>`;
 document.body.appendChild(bar);const button=$('#yrPlatformButton');
 button.onclick=()=>{bar.classList.toggle('open');button.setAttribute('aria-expanded',bar.classList.contains('open')?'true':'false')};
 document.addEventListener('click',e=>{if(!bar.contains(e.target)){bar.classList.remove('open');button.setAttribute('aria-expanded','false')}});
 $('#yrBusinessSelect').onchange=async e=>{const btn=e.currentTarget;btn.disabled=true;try{await YasReadyCloud.setActiveBusiness(btn.value);location.reload()}catch(err){alert(err.message||'Could not switch business');btn.disabled=false}};
 window.__yrCloudSession=sess;window.__yrActiveBusiness=active;
 window.dispatchEvent(new CustomEvent('yasready:platform-ready',{detail:{session:sess,business:active,module:MODULE}}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();