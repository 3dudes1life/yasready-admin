(function(){'use strict';
const KEY='yr-guided-setup-v1';
const host=location.hostname;
const product=host.startsWith('studio.')?'studio':host.startsWith('events.')?'events':host.startsWith('admin.')?'admin':'business';
const defs={
 business:[
  ['Welcome to YasReady','This little guide stays with you until your setup is done. You never have to guess where to go next.','Start setup'],
  ['Add your business basics','Tell YasReady the business name, what it does, who it serves, website and email. You can leave anything you do not know yet blank.','Open Business Workspace','workspace'],
  ['Give YasReady a goal','Add at least one goal so YasReady can start telling you what deserves attention instead of showing generic advice.','Open Goals','workspace'],
  ['Choose how you will use YasReady','Your business is the parent. Studio projects and Events projects can live underneath it as brands, shows, or event programs.','Review my business','saasHome'],
  ['Look at your next move','Open Today. This is where YasReady should turn what you entered into the next useful action.','Open Today','today'],
  ['Setup complete','You know the core flow now. The guide stays available from “How to” whenever you need it.','Finish setup']
 ],
 studio:[
  ['Welcome to YasReady Studio','Studio is for the shows, podcasts and content projects your business runs. This guide will keep the next step visible.','Start Studio setup'],
  ['Create or confirm your Studio project','Start with the show or content brand you actually manage. It does not have to have the same name as the parent business.','Open Studio setup','setup.html'],
  ['Add the people','Add the hosts, producers, guests or collaborators the project needs.','Open People','people.html'],
  ['Build the production workflow','Use the control room and templates to shape how an episode moves from idea to published.','Open Control Room','control-room.html'],
  ['Check your Studio home','Come back to Studio home and make sure the next production action makes sense.','Open Studio home','index.html'],
  ['Studio setup complete','Your Studio project is ready to use. You can reopen this guide any time from How to.','Finish setup']
 ],
 events:[
  ['Welcome to YasReady Events','Events can be a brand or program underneath your business. We will set up the first real event without making you learn the whole system first.','Start Events setup'],
  ['Confirm the event brand','Make sure the business selector is on the parent business that owns this event work.','Got it'],
  ['Create or choose the real event','Use your actual event or program instead of demo data. Start with the next event you need to operate.','Open Events home','index.html'],
  ['Work the next action','Use the action board and priorities. YasReady should tell you what is due, waiting, or at risk.','Open Events home','index.html'],
  ['Check production readiness','Review readiness and exceptions so the dashboard reflects the real event, not a checklist you have to memorize.','Review readiness','index.html'],
  ['Events setup complete','Your Events workspace is ready to use. The How to guide stays available whenever you need it.','Finish setup']
 ],
 admin:[
  ['YasReady Admin guide','Admin is the company control room. Customer onboarding happens in the customer products; this guide explains what to watch here.','Show me'],
  ['Customers & businesses','Use Customers for people/accounts and Businesses for the organizations they manage. One user can manage more than one business.','Next'],
  ['Tester feedback','Founding Alpha bug reports land here. Close resolved reports or delete test/noise reports.','Next'],
  ['System health','Use System Health and Operations when something looks wrong across YasReady.','Next'],
  ['Customer success','As real testers arrive, this is where support and account signals belong.','Next'],
  ['Admin tour complete','You can reopen this explanation from How to at any time.','Finish']
 ]
};
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
function state(){const all=load();return all[product]||{step:0,complete:false}}
function setState(s){const all=load();all[product]=s;save(all)}
function go(target){if(!target)return;if(target.endsWith('.html')){location.href=target;return}const el=document.querySelector('[data-nav="'+target+'"]');if(el){el.click();setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),80)}}
function pct(s){return s.complete?100:Math.round((s.step/(defs[product].length-1))*100)}
function render(){let s=state(), steps=defs[product], i=Math.min(s.step,steps.length-1), d=steps[i];
 const box=document.getElementById('yrGuideBox'); if(!box)return;
 box.innerHTML='<button class="yrgClose" aria-label="Close">×</button><div class="yrgEyebrow">'+(s.complete?'YASREADY GUIDE':'START HERE · '+pct(s)+'%')+'</div><div class="yrgProgress"><i style="width:'+pct(s)+'%"></i></div><h2>'+d[0]+'</h2><p>'+d[1]+'</p><div class="yrgWhy"><strong>Why this matters</strong><span>'+why(i)+'</span></div><div class="yrgActions"><button class="yrgPrimary">'+d[2]+'</button>'+(i>0&&!s.complete?'<button class="yrgBack">Back</button>':'')+(!s.complete&&i>0&&i<steps.length-1?'<button class="yrgSkip">Skip for now</button>':'')+'</div><button class="yrgAll">See all steps / How to use YasReady</button>';
 box.querySelector('.yrgClose').onclick=close;
 box.querySelector('.yrgPrimary').onclick=()=>{ if(s.complete){showAll();return} if(d[3])go(d[3]); if(i>=steps.length-1){s.complete=true;setState(s);close();updateChip();}else{s.step=i+1;setState(s);render();updateChip();} };
 box.querySelector('.yrgBack')?.addEventListener('click',()=>{s.step=Math.max(0,i-1);setState(s);render();updateChip()});
 box.querySelector('.yrgSkip')?.addEventListener('click',()=>{s.step=Math.min(steps.length-1,i+1);setState(s);render();updateChip()});
 box.querySelector('.yrgAll').onclick=showAll;
}
function why(i){const w={business:['You only need to learn one next action at a time.','Everything else in YasReady uses this profile.','Goals let the dashboard prioritize instead of guessing.','Projects can belong to the business without pretending they are the business.','Today is designed to answer “what do I do now?”','You can use YasReady normally now.'],studio:['You should not need production software experience to start.','The project is the show/brand; the business remains its owner.','The workflow gets clearer when YasReady knows who does what.','A repeatable workflow removes “what happens next?” confusion.','Home should summarize the work, not make you hunt for it.','The guide is still here if you get stuck.'],events:['You only need the next useful action.','This keeps event work attached to the correct business.','Real data makes readiness useful.','The action board replaces mental checklists.','Exceptions show what needs attention before event day.','You can now work from the dashboard.'],admin:['Admin is different from the customer setup flow.','Accounts and businesses are intentionally different things.','Feedback should become actionable work, not permanent clutter.','This is your operational safety view.','This becomes more useful as alpha usage grows.','The guide remains available.']};return w[product][i]||'This keeps YasReady focused on the next useful move.'}
function open(){document.getElementById('yrGuideOverlay').classList.add('open');render()}
function close(){document.getElementById('yrGuideOverlay').classList.remove('open')}
function showAll(){const steps=defs[product],s=state();document.getElementById('yrGuideBox').innerHTML='<button class="yrgClose" aria-label="Close">×</button><div class="yrgEyebrow">HOW TO USE '+product.toUpperCase()+'</div><h2>Your YasReady guide</h2><p>Come back here whenever you are not sure what to do next.</p><div class="yrgList">'+steps.map((x,i)=>'<button data-i="'+i+'"><b>'+(i+1)+'</b><span><strong>'+x[0]+'</strong><small>'+x[1]+'</small></span></button>').join('')+'</div><div class="yrgActions"><button class="yrgPrimary" id="yrgResume">'+(s.complete?'Review from the beginning':'Resume my next step')+'</button></div>';document.querySelector('.yrgClose').onclick=close;document.querySelectorAll('.yrgList button').forEach(b=>b.onclick=()=>{let q=state();q.step=Number(b.dataset.i);q.complete=false;setState(q);render();updateChip()});document.getElementById('yrgResume').onclick=()=>{if(s.complete){s.step=0;s.complete=false;setState(s)}render();updateChip()}}
function updateChip(){const s=state(),chip=document.getElementById('yrGuideChip');if(!chip)return;chip.innerHTML=s.complete?'? <span>How to</span>':'✨ <span>Next step · '+pct(s)+'%</span>';chip.classList.toggle('done',s.complete)}
function mount(){if(document.getElementById('yrGuideChip'))return;const chip=document.createElement('button');chip.id='yrGuideChip';chip.onclick=open;document.body.appendChild(chip);const ov=document.createElement('div');ov.id='yrGuideOverlay';ov.innerHTML='<div class="yrgBackdrop"></div><section id="yrGuideBox" role="dialog" aria-modal="true"></section>';document.body.appendChild(ov);ov.querySelector('.yrgBackdrop').onclick=close;updateChip();const s=state();if(!s.complete&&s.step===0)setTimeout(open,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();