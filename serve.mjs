import http from 'node:http'; import fsp from 'node:fs/promises'; import path from 'node:path';
const ROOT=path.resolve('mirror'); const data=JSON.parse(await fsp.readFile(path.join(ROOT,'manifest.json'),'utf8')); const entries=data.entries; const target=new URL(data.target);
const inject=`<script type="module" src="/__editable.js"></script>`;
const server=http.createServer(async(req,res)=>{
 if(req.url==='/__content.json'){res.setHeader('content-type','application/json');return res.end(await fsp.readFile('content.json'));}
 if(req.url==='/__editable.js'){res.setHeader('content-type','text/javascript');return res.end(await fsp.readFile('editable.js'));}
 const original=new URL(req.url,target.origin).href; const e=entries[original]||entries[original.replace(/\/$/,'')];
 if(!e){res.statusCode=404;return res.end('Not captured: '+req.url)}
 const headers={...e.headers}; for(const h of ['content-encoding','content-length','content-security-policy','content-security-policy-report-only']) delete headers[h];
 let body=await fsp.readFile(path.join(ROOT,e.file)); const ct=headers['content-type']||'';
 if(ct.includes('text/html')){let s=body.toString('utf8'); s=s.replace(/<head([^>]*)>/i,`<head$1><base href="${target.origin}/">${inject}`); body=Buffer.from(s)}
 for(const [k,v] of Object.entries(headers)){try{res.setHeader(k,v)}catch{}} res.statusCode=e.status||200;res.end(body)
}); server.listen(4173,'127.0.0.1',()=>console.log('Editable mirror: http://127.0.0.1:4173/'));
