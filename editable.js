const cfg=await fetch('/__content.json').then(r=>r.json());
let applying=false;
function apply(){ if(applying)return; applying=true;
 for(const x of cfg.texts||[]){document.querySelectorAll(x.selector).forEach(el=>{if(el.textContent.trim()!==x.text) el.textContent=x.text})}
 for(const x of cfg.images||[]){document.querySelectorAll(x.selector).forEach(el=>{if(el.tagName==='IMG'){if(x.src&&el.src!==x.src)el.src=x.src;if(x.alt!=null)el.alt=x.alt}})}
 for(const x of cfg.sections||[]){document.querySelectorAll(x.selector).forEach(el=>el.style.display=x.hidden?'none':'')}
 let st=document.getElementById('__editable_styles'); if(!st){st=document.createElement('style');st.id='__editable_styles';document.head.appendChild(st)}
 st.textContent=(cfg.styles?.fontFamily?`html,body,*{font-family:${cfg.styles.fontFamily}!important}`:'')+'\n'+(cfg.styles?.customCSS||''); applying=false;
}
apply(); new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{subtree:true,childList:true});
