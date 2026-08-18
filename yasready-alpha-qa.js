(function(){'use strict';
const broken=[];
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('a[href]').forEach(a=>{const h=a.getAttribute('href');if(!h||h==='#'||h.startsWith('javascript:'))return;if(/^https?:/.test(h))return;const u=new URL(h,location.href);if(u.origin===location.origin&&u.pathname===location.pathname&&h!=='#'){}});
 window.addEventListener('error',e=>console.warn('[YasReady Alpha UI error]',e.error||e.message));
 window.addEventListener('unhandledrejection',e=>console.warn('[YasReady Alpha promise error]',e.reason));
});
})();