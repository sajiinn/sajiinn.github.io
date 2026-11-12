/* Sajiin — penyajian data bergaya NVivo, SPSS, dan RapidMiner.
   Memakai variabel global dari index.html: ALL, META, current(), count, esc, nf, pct, SENT, STOP, sentCounts, dkey. */
(function(){
const PEN_CSS=`
.pv{--s1:#2a78d6;--s2:#eb6834;--s3:#1baf7a;--s4:#eda100;--pos:#2a78d6;--neu:#c3c2b7;--neg:#e34948;--ink:#0b0b0b;--ink2:#52514e;--ink3:#8a8982;--line:#e2e1da;
  background:#fff;border:1.5px solid var(--line);border-radius:12px;overflow:hidden;font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif;font-size:13px;color:#1b1b1b;line-height:1.45}
.pv *{box-sizing:border-box}
.pv-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:10px 14px;border-bottom:1px solid #d9d9d9}
.pv-bar b{font-size:14px;margin-right:auto}
.pv-btn{font:inherit;font-size:12.5px;border:1px solid #9a9a9a;background:#fff;border-radius:4px;padding:5px 10px;cursor:pointer}
.pv-btn:hover{background:#f0f0f0}
.pv-body{padding:16px}
.pv h5{font-size:14px;margin:22px 0 4px}
.pv h5:first-child{margin-top:0}
.pv .hint{color:#666;font-size:12px;margin:0 0 8px}
.pv table{border-collapse:collapse;font-size:12.5px;width:auto}
.pv td,.pv th{padding:4px 10px;border:1px solid #d0d0d0;text-align:left;font-weight:400;vertical-align:top}
.pv td.n,.pv th.n{text-align:right;font-variant-numeric:tabular-nums}
.pv .scroll{overflow-x:auto;max-width:100%}
.pv input[type=text],.pv select{font:inherit;font-size:12.5px;border:1px solid #9a9a9a;border-radius:4px;padding:4px 8px;background:#fff;width:auto}
.pv svg{display:block;width:100%;height:auto}
/* NVivo */
.pv-nv .pv-bar{background:#e9f0f8}
.pv-nv th{background:#eef1f5;font-weight:600}
.pv-nv tr.par td{font-weight:600;background:#fafbfc}
.pv-nv td.ind{padding-left:26px}
.pv-nv .two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:18px;align-items:start}
.pv-nv .kw{font-weight:700;background:#fff3b0}
.pv-nv td.l{text-align:right;color:#444;white-space:nowrap}
.pv-nv td.r{color:#444;white-space:nowrap}
/* SPSS */
.pv-sp .pv-bar{background:#f3f3f3}
.pv-sp .lay{display:grid;grid-template-columns:190px minmax(0,1fr)}
.pv-sp .out{border-right:1px solid #d9d9d9;padding:12px;font-size:12px;background:#fafafa}
.pv-sp .out div{padding:2px 0 2px 12px;cursor:pointer}
.pv-sp .out div.h{padding-left:0;font-weight:600}
.pv-sp .out div:hover{text-decoration:underline}
.pv-sp .res{padding:18px;font-family:Arial,Helvetica,sans-serif;min-width:0}
.pv-sp h5{font-size:16px;font-weight:700;margin:26px 0 10px}
.pv-sp .tt{font-weight:700;text-align:center;margin:14px 0 4px;font-size:12.5px}
.pv-sp .tw{display:inline-block;max-width:100%;overflow-x:auto;vertical-align:top}
.pv-sp table{border-top:2px solid #000;border-bottom:2px solid #000}
.pv-sp td,.pv-sp th{border:1px solid #aaa;border-left:0;border-right:0;padding:3px 12px}
.pv-sp td+td,.pv-sp th+th{border-left:1px solid #aaa}
.pv-sp th{vertical-align:bottom;text-align:center}
.pv-sp td{white-space:nowrap}
.exp{font:400 13.5px/1.6 "DM Sans",system-ui,sans-serif;color:#2b2a26;background:#fff8e0;border:1.5px solid #141414;border-left-width:6px;border-radius:6px;padding:10px 14px;margin:8px 0 16px;max-width:760px;white-space:normal}
.exp>b:first-child{display:block;font-size:11px;letter-spacing:.05em;text-transform:uppercase;margin-bottom:3px;color:#141414}
.exp.intro{background:#f3c9f4}
.exp i{font-style:normal;font-weight:700;background:#fff;border:1px solid #141414;border-radius:4px;padding:0 6px;white-space:nowrap}
.no-exp .exp{display:none}
@media print{.exp{display:none!important}}
.pv-sp .warn{font-size:12.5px;background:#fff4d6;border-left:3px solid #e0a100;padding:8px 10px;max-width:560px;margin:10px 0 0}
.pv .pick{padding:12px 16px;border-bottom:1px solid #d9d9d9;background:#fbfbfb;font-size:12.5px}
.pv .pick>b{display:block;font-size:13px;margin-bottom:4px}
.pv .pick>div{display:flex;flex-wrap:wrap;gap:4px 14px;align-items:center;padding:5px 0;border-top:1px dashed #e2e2e2}
.pv .pick>div>span{width:190px;font-weight:600;flex:none}
.pv .pick label{display:inline-flex;gap:4px;align-items:center;white-space:nowrap}
.pv-sp .fn{font-size:11.5px;margin:3px 0 0;max-width:520px}
/* RapidMiner */
.pv-rm .pv-bar{background:#fff4e8;border-bottom:2px solid #f47a20}
.pv-rm .tabs{display:flex;gap:2px;border-bottom:1px solid #cfcfcf;margin:18px 0 12px;flex-wrap:wrap}
.pv-rm .tabs button{font:inherit;font-size:12.5px;border:1px solid #cfcfcf;border-bottom:0;background:#f1f1f1;padding:6px 12px;border-radius:5px 5px 0 0;cursor:pointer}
.pv-rm .tabs button.on{background:#fff;font-weight:600;border-top:2px solid #f47a20}
.pv-rm th{background:#f1f1f1;font-weight:600}
.pv-rm th.id,.pv-rm td.id{background:#dbeafe}
.pv-rm th.lb,.pv-rm td.lb{background:#dcfce7}
.pv-rm tr:nth-child(even) td:not(.id):not(.lb){background:#fafafa}
.pv-rm pre{font:12.5px/1.5 ui-monospace,Menlo,Consolas,monospace;background:#fafafa;border:1px solid #ddd;padding:10px 12px;margin:0 0 10px;white-space:pre-wrap}
@media (max-width:820px){.pv-nv .two{grid-template-columns:1fr}.pv-sp .lay{grid-template-columns:1fr}.pv-sp .out{display:none}.pv .pick>div>span{width:100%}}
@media print{.pv{border:0}.pv-bar .pv-btn,.noexp{display:none!important}.pv-sp .out{display:none}.pv-sp .lay{grid-template-columns:1fr}}
`;
document.head.insertAdjacentHTML('beforeend','<style id="pen-css">'+PEN_CSS+'</style>');

/* ---------- alat bantu ---------- */
const $=s=>document.querySelector(s);
const f1=x=>isFinite(x)?x.toFixed(1):'', f2=x=>isFinite(x)?x.toFixed(2):'', f3=x=>isFinite(x)?x.toFixed(3):'';
const csvCell=v=>{v=String(v??'');return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
const toCSV=rows=>rows.map(r=>r.map(csvCell).join(',')).join('\r\n')+'\r\n';
function dl(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:type||'text/plain;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),3000)}
const BOM='﻿';
const slug=()=>(META.title||'data').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'data';
function desc(a){const n=a.length;if(!n)return null;const m=a.reduce((x,y)=>x+y,0)/n;return {n,min:Math.min(...a),max:Math.max(...a),m,sd:n>1?Math.sqrt(a.reduce((x,y)=>x+(y-m)**2,0)/(n-1)):NaN}}
const oneLine=s=>String(s).replace(/\s+/g,' ').trim();
const xml=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const guid=()=>'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
const toks=t=>(t.toLowerCase().replace(/https?:\S+/g,' ').replace(/[@#][\w.À-ɏ]+/g,' ').match(/[a-zà-ÿ]{3,}/g)||[]).filter(w=>!STOP.has(w));
const EMO_ORDER=['Marah','Antisipasi','Senang','Sedih','Takut','Terkejut'];
const SENT_ORDER=['pos','neu','neg'];

'read more and for with from that this are was has have will his her its not but you who'.split(' ').forEach(w=>STOP.add(w));
const S={view:'ringkas',themes:null,kwic:'',k:4,rmTab:'data',meta:null};
window.PEN=S;
const exp=h=>`<div class="exp noexp"><b>Cara baca</b>${h}</div>`;
const intro=(t,h)=>`<div class="exp intro noexp"><b>${t}</b>${h}</div>`;
window.PENH={dl,toCSV,slug,oneLine,f1,f2,f3,BOM,S,exp,intro};

/* tema otomatis: kata yang cukup sering tapi tidak ada di hampir semua baris */
function autoThemes(rows){
  const n=rows.length||1;
  return count(rows,r=>r.words).filter(([w,c])=>c/n<=.5&&c>=Math.max(2,n*.01)).slice(0,8).map(x=>x[0]);
}
function themes(rows){return (S.themes&&S.themes.length?S.themes:autoThemes(rows))}
const RE_CACHE=new Map();
const wordRe=t=>{t=t.trim().toLowerCase();if(!RE_CACHE.has(t))RE_CACHE.set(t,new RegExp('(?<![\\p{L}\\d])'+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}\\d])','iu'));return RE_CACHE.get(t)};
const hasTheme=(r,t)=>wordRe(t).test(r.text);
const srcN=rows=>{if(!rows.length)return 0;const s=new Set(rows.map(r=>r.account?r.account.toLowerCase():null).filter(Boolean));return s.size||1};
const uni=p=>[...new Set(p.kids.flatMap(k=>k.rows))];

/* =====================================================================
   GAYA NVIVO
   ===================================================================== */
function codeTree(rows){
  const th=themes(rows);
  const mk=(name,sub)=>({name,rows:sub});
  return [
    {name:'Sentimen',kids:SENT_ORDER.map(k=>mk(SENT[k][0],rows.filter(r=>r.sent===k)))},
    {name:'Emosi',kids:EMO_ORDER.map(e=>mk(e,rows.filter(r=>r.emo===e))).filter(c=>c.rows.length)},
    {name:'Tema',kids:th.map(t=>mk(t,rows.filter(r=>hasTheme(r,t))))}
  ];
}
function treemap(items,x,y,w,h){
  if(!items.length)return [];
  if(items.length===1)return [{...items[0],x,y,w,h}];
  const tot=items.reduce((a,i)=>a+i.v,0);let acc=0,i=0;
  while(i<items.length-1&&acc+items[i].v<=tot/2){acc+=items[i].v;i++}
  if(i===0){acc=items[0].v;i=1}
  const a=items.slice(0,i),b=items.slice(i),f=acc/tot;
  return w>=h?[...treemap(a,x,y,w*f,h),...treemap(b,x+w*f,y,w*(1-f),h)]:[...treemap(a,x,y,w,h*f),...treemap(b,x,y+h*f,w,h*(1-f))];
}
function wordFreq(rows){
  const m=new Map();let tot=0;
  rows.forEach(r=>toks(r.text).forEach(w=>{m.set(w,(m.get(w)||0)+1);tot++}));
  return {list:[...m].sort((a,b)=>b[1]-a[1]),tot};
}
const CLOUD_COLORS=['#141414','#c44fc7','#d9730d','#178f86','#2a5bd7','#b07d00'];
function cloudSVG(list){
  const W=640,H=360,top=list.slice(0,50);if(!top.length)return '';
  const mx=top[0][1],mn=top[top.length-1][1],placed=[],out=[];
  top.forEach(([w,c],i)=>{
    const fs=11+57*((c-mn)/((mx-mn)||1)),bw=w.length*fs*.6+6,bh=fs*1.1;
    for(let t=0;t<900;t++){const a=t*.35,rad=2.2*a,cx=W/2+rad*Math.cos(a)*1.5,cy=H/2+rad*Math.sin(a)*.8;
      const b={x:cx-bw/2,y:cy-bh/2,w:bw,h:bh};
      if(b.x<2||b.y<2||b.x+b.w>W-2||b.y+b.h>H-2)continue;
      if(placed.some(p=>b.x<p.x+p.w&&p.x<b.x+b.w&&b.y<p.y+p.h&&p.y<b.y+b.h))continue;
      placed.push(b);out.push(`<text x="${cx.toFixed(1)}" y="${(cy+fs*.34).toFixed(1)}" text-anchor="middle" font-size="${fs.toFixed(1)}" font-weight="${fs>=26?700:fs>=16?600:500}" fill="${CLOUD_COLORS[i%CLOUD_COLORS.length]}"><title>${esc(w)}: ${c}</title>${esc(w)}</text>`);break}
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Awan kata">${out.join('')}</svg>`;
}
function matrix(rows){
  const th=themes(rows);
  return {th,cells:th.map(t=>{const rr=rows.filter(r=>hasTheme(r,t));return SENT_ORDER.map(k=>rr.filter(r=>r.sent===k).length)})};
}
function renderNV(rows){
  const el=$('#v-nvivo'),tree=codeTree(rows),wf=wordFreq(rows),mx=matrix(rows);
  if(!S.kwic)S.kwic=(mx.th[0]||(wf.list[0]||[''])[0]);
  const tm=treemap(tree[2].kids.map(k=>({n:k.name,v:k.rows.length})).filter(k=>k.v>0).sort((a,b)=>b.v-a.v),0,0,640,260);
  const tmax=Math.max(1,...tm.map(t=>t.v)),cmax=Math.max(1,...mx.cells.flat());
  const q=S.kwic.trim().toLowerCase();let hits=[];
  if(q){const re=wordRe(q);rows.forEach(r=>{const t=oneLine(r.text),m=re.exec(t);if(m){const i=m.index,n=m[0].length;hits.push([r.account||r.platform||'–',t.slice(Math.max(0,i-45),i),t.slice(i,i+n),t.slice(i+n,i+n+45)])}})}
  el.innerHTML=`<div class="pv-bar"><b>Gaya NVivo · analisis kualitatif</b>
      <button class="pv-btn" data-dl="nv-qdc">Codebook (.qdc)</button><button class="pv-btn" data-dl="nv-data">Dataset berkode (.csv)</button>
      <button class="pv-btn" data-dl="nv-wf">Word Frequency (.csv)</button><button class="pv-btn" data-dl="nv-mx">Matrix Coding (.csv)</button><button class="pv-btn" data-dl="html">Tampilan ini (.html)</button></div>
    <div class="pv-body">
    ${intro('Kapan pakai gaya NVivo?','Saat datamu berupa kata-kata: kutipan wawancara, jawaban terbuka, atau komentar. Gaya ini menjawab dua hal: tema apa yang dibicarakan orang, dan seberapa sering tema itu muncul.')}
    <h5>Codes</h5>${exp('Kode adalah label yang ditempelkan ke potongan teks yang membahas hal yang sama. Kolom References menghitung berapa potongan teks mendapat label itu. Kolom Files menghitung dari berapa sumber potongan itu berasal. Tema di sini dibentuk dari kata kunci; ganti kata kuncinya di kotak bawah supaya cocok dengan penelitianmu.'+(()=>{const k=[...tree[2].kids].sort((a,b)=>b.rows.length-a.rows.length)[0];return k&&k.rows.length?` <i>Di datamu</i> tema yang paling sering muncul adalah <b>${esc(k.name)}</b>, di ${k.rows.length} potongan teks.`:''})())}<p class="hint">Tiap baris teks dikode otomatis. Files = jumlah sumber berbeda (1 kalau data tanpa kolom sumber). References = jumlah potongan teks yang dikode. Baris induk menghitung gabungan anak-anaknya tanpa hitung ganda.</p>
    <p class="hint noexp">Kode tema (kata kunci, pisahkan dengan koma): <input type="text" id="nv-themes" size="48" value="${esc(mx.th.join(', '))}"> <button class="pv-btn" id="nv-themes-go">Terapkan</button> <button class="pv-btn" id="nv-themes-auto">Otomatis</button></p>
    <div class="two"><div class="scroll"><table><tr><th>Name</th><th class="n">Files</th><th class="n">References</th></tr>
      ${tree.map(p=>`<tr class="par"><td>▾ ${p.name}</td><td class="n">${nf(srcN(uni(p)))}</td><td class="n">${nf(uni(p).length)}</td></tr>`+
        p.kids.map(k=>`<tr><td class="ind">${esc(k.name)}</td><td class="n">${nf(srcN(k.rows))}</td><td class="n">${nf(k.rows.length)}</td></tr>`).join('')).join('')}</table></div>
    <div><svg viewBox="0 0 640 260" role="img" aria-label="Hierarchy chart kode tema">${tm.map(t=>`<g><title>${esc(t.n)}: ${t.v} references</title><rect x="${t.x+1}" y="${t.y+1}" width="${Math.max(0,t.w-2)}" height="${Math.max(0,t.h-2)}" rx="3" fill="${t.v/tmax>.66?'#256abf':t.v/tmax>.33?'#5598e7':'#9ec5f4'}"/>${t.w>60&&t.h>26?`<text x="${t.x+8}" y="${t.y+19}" font-size="13" font-weight="600" fill="${t.v/tmax>.33?'#fff':'#0b0b0b'}">${esc(t.n)}</text><text x="${t.x+8}" y="${t.y+35}" font-size="11.5" fill="${t.v/tmax>.33?'#fff':'#0b0b0b'}">${t.v}</text>`:''}</g>`).join('')}</svg>
      <p class="hint" style="margin-top:6px">Hierarchy Chart: luas kotak = jumlah references tiap kode tema.</p></div></div>

    <h5>Word Frequency Query</h5>${exp('Daftar kata yang paling sering dipakai di seluruh teks. Count adalah berapa kali kata itu muncul. Weighted Percentage adalah porsinya dari semua kata yang dihitung. Kata yang sering muncul memberi petunjuk awal soal topik yang ramai dibahas, tapi tetap baca kalimat aslinya sebelum menyimpulkan.'+(wf.list[0]?` <i>Di datamu</i> kata tersering adalah <b>${esc(wf.list[0][0])}</b>, muncul ${nf(wf.list[0][1])} kali.`:''))}<p class="hint">Kata minimal 3 huruf, di luar kata sambung. Weighted Percentage = porsi kata itu dari seluruh kata yang dihitung.</p>
    <div class="two"><div class="scroll"><table><tr><th>Word</th><th class="n">Length</th><th class="n">Count</th><th class="n">Weighted Percentage (%)</th></tr>
      ${wf.list.slice(0,20).map(([w,c])=>`<tr><td>${esc(w)}</td><td class="n">${w.length}</td><td class="n">${nf(c)}</td><td class="n">${f2(c/wf.tot*100)}</td></tr>`).join('')}</table></div>
      <div>${cloudSVG(wf.list)}<p class="hint" style="margin-top:6px;text-align:center">Makin sering sebuah kata muncul, makin besar hurufnya; ukurannya naik lurus mengikuti jumlah kemunculan. Arahkan kursor ke kata untuk melihat jumlahnya.</p></div></div>

    <h5>Matrix Coding Query</h5>${exp('Tabel ini mempertemukan tema dengan nada teksnya. Tiap sel berisi jumlah potongan teks yang membahas tema di baris itu dengan nada di kolom itu. Sel yang lebih gelap berarti jumlahnya lebih banyak. Pakai tabel ini untuk melihat tema mana yang banyak dikeluhkan dan tema mana yang banyak dipuji.'+(()=>{let bi=-1,bv=0;mx.cells.forEach((c,i)=>{if(c[2]>bv){bv=c[2];bi=i}});return bi>=0?` <i>Di datamu</i> tema dengan teks bernada negatif terbanyak adalah <b>${esc(mx.th[bi])}</b> (${bv} potongan).`:''})())}<p class="hint">Baris = kode tema, kolom = kode sentimen. Isi sel = jumlah references yang dikode keduanya.</p>
    <div class="scroll"><table><tr><th></th>${SENT_ORDER.map((k,i)=>`<th class="n">${'ABC'[i]} : ${SENT[k][0]}</th>`).join('')}</tr>
      ${mx.th.map((t,i)=>`<tr><td>${i+1} : ${esc(t)}</td>${mx.cells[i].map(c=>`<td class="n" style="background:rgba(42,120,214,${(c/cmax*.55).toFixed(2)})">${c}</td>`).join('')}</tr>`).join('')||'<tr><td colspan="4">Belum ada kode tema.</td></tr>'}</table></div>

    <h5>Text Search Query</h5>${exp('Ketik satu kata, lalu Sajiin menampilkan semua kalimat yang memuatnya, lengkap dengan kata-kata di kiri dan kanannya. Gunanya untuk membaca konteks: kata yang sama bisa dipakai untuk memuji atau mengeluh. Kalimat di sini juga bisa kamu jadikan kutipan langsung di laporan.')}<p class="hint noexp">Cari kata: <input type="text" id="nv-kwic" value="${esc(S.kwic)}"> <button class="pv-btn" id="nv-kwic-go">Cari</button></p>
    <p class="hint">“${esc(S.kwic)}” ditemukan di ${nf(hits.length)} dari ${nf(rows.length)} baris (dicocokkan sebagai kata utuh, huruf besar-kecil diabaikan). Ditampilkan ${Math.min(12,hits.length)} pertama, beserta konteksnya.</p>
    <div class="scroll"><table><tr><th>Sumber</th><th colspan="3">Konteks</th></tr>${hits.slice(0,12).map(h=>`<tr><td>${esc(h[0])}</td><td class="l">${esc(h[1])}</td><td class="kw">${esc(h[2])}</td><td class="r">${esc(h[3])}</td></tr>`).join('')}</table></div>
    </div>`;
  $('#nv-themes-go').onclick=()=>{S.themes=$('#nv-themes').value.split(',').map(s=>s.trim()).filter(Boolean).slice(0,20);S.kwic='';renderPenyajian()};
  $('#nv-themes-auto').onclick=()=>{S.themes=null;S.kwic='';renderPenyajian()};
  $('#nv-kwic-go').onclick=()=>{S.kwic=$('#nv-kwic').value;renderPenyajian()};
  $('#nv-kwic').onkeydown=e=>{if(e.key==='Enter')$('#nv-kwic-go').click()};
}
function nvDownloads(kind,rows){
  const tree=codeTree(rows),th=themes(rows);
  if(kind==='nv-qdc'){
    const code=(n,d,kids)=>`<Code guid="${guid()}" name="${xml(n)}" isCodable="true">${d?`<Description>${xml(d)}</Description>`:''}${kids||''}</Code>`;
    dl(slug()+'-codebook.qdc',`<?xml version="1.0" encoding="utf-8"?>\n<CodeBook xmlns="urn:QDA-XML:codebook:1.0" origin="Sajiin">\n<Codes>\n${tree.map(p=>code(p.name,'Kelompok kode '+p.name.toLowerCase(),p.kids.map(k=>code(k.name,p.name==='Tema'?'Teks yang memuat kata "'+k.name+'"':p.name+' '+k.name.toLowerCase()+' menurut kamus kata Sajiin')).join(''))).join('\n')}\n</Codes>\n</CodeBook>\n`,'application/xml');
  }
  if(kind==='nv-data')dl(slug()+'-nvivo-dataset.csv',BOM+toCSV([['ID','Sumber','Platform','Tanggal','Sentimen','Emosi','Tema','Teks'],...rows.map((r,i)=>[i+1,r.account||'',r.platform||'',r.date?dkey(r.date):'',SENT[r.sent][0],r.emo||'',th.filter(t=>hasTheme(r,t)).join('; '),oneLine(r.text)])]),'text/csv');
  if(kind==='nv-wf'){const wf=wordFreq(rows);dl(slug()+'-word-frequency.csv',BOM+toCSV([['Word','Length','Count','Weighted Percentage (%)'],...wf.list.slice(0,1000).map(([w,c])=>[w,w.length,c,f2(c/wf.tot*100)])]),'text/csv')}
  if(kind==='nv-mx'){const m=matrix(rows);dl(slug()+'-matrix-coding.csv',BOM+toCSV([['',...SENT_ORDER.map((k,i)=>'ABC'[i]+' : '+SENT[k][0])],...m.th.map((t,i)=>[(i+1)+' : '+t,...m.cells[i]])]),'text/csv')}
}

/* =====================================================================
   GAYA RAPIDMINER
   ===================================================================== */
const rmToks=t=>t.toLowerCase().split(/[^\p{L}]+/u).filter(w=>w.length>=3&&w.length<=25);
const rmHi=n=>Math.max(3,Math.round(n*.6));
function wordList(rows){
  const m=new Map();
  rows.forEach(r=>{const seen=new Set();rmToks(r.text).forEach(w=>{let o=m.get(w);if(!o){o={w,tot:0,doc:0,pos:0,neu:0,neg:0};m.set(w,o)}o.tot++;o[r.sent]++;if(!seen.has(w)){seen.add(w);o.doc++}})});
  const hi=rmHi(rows.length);
  return [...m.values()].filter(o=>o.doc>=2&&o.doc<=hi).sort((a,b)=>b.tot-a.tot);
}
function kmeans(rows,k){
  const stride=Math.max(1,Math.ceil(rows.length/2500)),docs=rows.filter((_,i)=>i%stride===0),n=docs.length;
  const tk=docs.map(r=>rmToks(r.text)),hi=rmHi(n);
  const vocab=count(tk,a=>[...new Set(a)]).filter(([w,c])=>c>=2&&c<=hi).slice(0,800),ix=new Map(vocab.map((v,i)=>[v[0],i])),T=vocab.length;
  if(n<k*2||T<k)return null;
  const idf=vocab.map(v=>Math.log(n/v[1]));
  const vecs=tk.map(a=>{const m=new Map();a.forEach(w=>{const j=ix.get(w);if(j!==undefined)m.set(j,(m.get(j)||0)+1)});const v=[...m].map(([j,c])=>[j,c*idf[j]]);const nm=Math.sqrt(v.reduce((s,x)=>s+x[1]*x[1],0))||1;return v.map(x=>[x[0],x[1]/nm])});
  const full=vecs.map((v,i)=>v.length?i:-1).filter(i=>i>=0);if(full.length<k)return null;
  let cen=[];for(let c=0;c<k;c++){const a=new Float64Array(T);vecs[full[Math.floor((c+.5)*full.length/k)]].forEach(([j,w])=>a[j]=w);cen.push(a)}
  let asg=new Int32Array(n);
  for(let it=0;it<15;it++){let ch=0;
    vecs.forEach((v,i)=>{let best=0,bs=-1;for(let c=0;c<k;c++){let s=0;for(const [j,w] of v)s+=w*cen[c][j];if(s>bs){bs=s;best=c}}if(asg[i]!==best){asg[i]=best;ch++}});
    cen=cen.map((_,c)=>{const a=new Float64Array(T);let m=0;vecs.forEach((v,i)=>{if(asg[i]===c){m++;for(const [j,w] of v)a[j]+=w}});if(m)for(let j=0;j<T;j++)a[j]/=m;return a});
    if(!ch&&it)break}
  const sizes=Array.from({length:k},(_,c)=>asg.filter(a=>a===c).length);
  const terms=cen.map(a=>[...a].map((w,j)=>[vocab[j][0],w]).sort((x,y)=>y[1]-x[1]).slice(0,7));
  const sent=Array.from({length:k},(_,c)=>sentCounts(docs.filter((_,i)=>asg[i]===c)));
  return {n,total:rows.length,sizes,terms,sent,T};
}
function processSVG(){
  const ops=[['Read CSV','#7cb5ec',['fil','out']],['Set Role','#b39ddb',['exa','exa']],['Nominal to Text','#b39ddb',['exa','exa']],['Process Documents','#f6c26b',['exa','exa · wor']],['Clustering','#8bc34a',['exa','clu']]];
  const W=760,H=170,bw=118,gap=(W-40-ops.length*bw)/(ops.length-1);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Diagram proses">`+ops.map((o,i)=>{const x=20+i*(bw+gap),y=28;
    return (i?`<path d="M${x-gap} ${y+36} C${x-gap/2} ${y+36} ${x-gap/2} ${y+36} ${x} ${y+36}" fill="none" stroke="#6b7280" stroke-width="2"/>`:'')+
      `<rect x="${x}" y="${y}" width="${bw}" height="72" rx="7" fill="#fff" stroke="#9ca3af"/><rect x="${x}" y="${y}" width="${bw}" height="20" rx="7" fill="${o[1]}"/><rect x="${x}" y="${y+12}" width="${bw}" height="8" fill="${o[1]}"/>
       <text x="${x+bw/2}" y="${y+15}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0b0b0b">${o[0]}</text>
       <text x="${x+6}" y="${y+41}" font-size="10.5" fill="#444">${o[2][0]}</text><text x="${x+bw-6}" y="${y+41}" text-anchor="end" font-size="10.5" fill="#444">${o[2][1]}</text>
       <circle cx="${x}" cy="${y+36}" r="4" fill="#fff" stroke="#6b7280"/><circle cx="${x+bw}" cy="${y+36}" r="4" fill="#fff" stroke="#6b7280"/>`+
      (i===3?`<text x="${x+bw/2}" y="${y+92}" text-anchor="middle" font-size="10.5" fill="#444">di dalamnya: Tokenize →</text><text x="${x+bw/2}" y="${y+106}" text-anchor="middle" font-size="10.5" fill="#444">Transform Cases →</text><text x="${x+bw/2}" y="${y+120}" text-anchor="middle" font-size="10.5" fill="#444">Filter Tokens (by Length)</text>`:'')+
      (i===4?`<text x="${x+bw/2}" y="${y+92}" text-anchor="middle" font-size="10.5" fill="#444">k-Means, k = ${S.k}</text>`:'')}).join('')+'</svg>';
}
function renderRM(rows){
  const el=$('#v-rapidminer'),N=rows.length,wl=wordList(rows),km=kmeans(rows,S.k);
  const sc=count(rows,r=>SENT[r.sent][0]);
  const tabs=[['data','ExampleSet (Data)'],['stat','ExampleSet (Statistics)'],['word','WordList'],['clus','Cluster Model']];
  let body='';
  if(S.rmTab==='data')body=`<p class="hint">ExampleSet (${nf(N)} examples, 2 special attributes, 1 regular attribute). Ditampilkan ${Math.min(40,N)} baris pertama.</p>
    <div class="scroll"><table><tr><th>Row No.</th><th class="id">id</th><th class="lb">sentimen</th><th>teks</th></tr>${rows.slice(0,40).map((r,i)=>`<tr><td class="n">${i+1}</td><td class="id n">${i+1}</td><td class="lb">${SENT[r.sent][0]}</td><td>${esc(oneLine(r.text).slice(0,160))}</td></tr>`).join('')}</table></div>`;
  if(S.rmTab==='stat'){const len=desc(rows.map(r=>r.text.length));
    body=`<div class="scroll"><table><tr><th>Name</th><th>Role</th><th>Type</th><th class="n">Missing</th><th>Statistics</th></tr>
    <tr><td>id</td><td class="id">id</td><td>Integer</td><td class="n">0</td><td>Min 1 · Max ${N} · Average ${f1((N+1)/2)}</td></tr>
    <tr><td>sentimen</td><td class="lb">label</td><td>Polynominal</td><td class="n">0</td><td>Least: ${esc(sc[sc.length-1][0])} (${sc[sc.length-1][1]}) · Most: ${esc(sc[0][0])} (${sc[0][1]}) · Values: ${sc.map(s=>esc(s[0])+' ('+s[1]+')').join(', ')}</td></tr>
    <tr><td>teks</td><td></td><td>Text</td><td class="n">0</td><td>Panjang rata-rata ${f1(len.m)} karakter · terpendek ${len.min} · terpanjang ${len.max}</td></tr></table></div>`}
  if(S.rmTab==='word')body=`<p class="hint">${nf(wl.length)} kata setelah pemangkasan. Ditampilkan 40 teratas. Tiga kolom terakhir = kemunculan per kelas label.</p><p class="hint">Langkahnya sama dengan file .rmp: Tokenize (pisah di setiap karakter bukan huruf), Transform Cases (huruf kecil), Filter Tokens by Length (3 sampai 25 huruf), lalu kata yang muncul di kurang dari 2 dokumen atau di lebih dari 60% dokumen dibuang. Tidak ada penyaring kata sambung, jadi kata seperti “yang” bisa muncul.</p>
    <div class="scroll"><table><tr><th>Word</th><th>Attribute Name</th><th class="n">Total Occurences</th><th class="n">Document Occurences</th>${SENT_ORDER.map(k=>`<th class="n">${SENT[k][0]}</th>`).join('')}</tr>
    ${wl.slice(0,40).map(o=>`<tr><td>${esc(o.w)}</td><td>${esc(o.w)}</td><td class="n">${o.tot}</td><td class="n">${o.doc}</td><td class="n">${o.pos}</td><td class="n">${o.neu}</td><td class="n">${o.neg}</td></tr>`).join('')}</table></div>`;
  if(S.rmTab==='clus')body=`<p class="hint noexp">Jumlah klaster (k): <select id="rm-k">${[2,3,4,5,6].map(k=>`<option${k===S.k?' selected':''}>${k}</option>`).join('')}</select></p>`+(km?
    `<pre>Cluster Model\n\n${km.sizes.map((s,i)=>`Cluster ${i}: ${s} items`).join('\n')}\nTotal number of items: ${km.n}</pre>
    <p class="hint">k-Means pada vektor TF-IDF (${km.T} kata)${km.n<km.total?`, memakai sampel ${nf(km.n)} dari ${nf(km.total)} baris`:''}. Kata di bawah adalah bobot tertinggi di pusat tiap klaster. Kemiripan diukur dengan kosinus. Di RapidMiner titik awal k-Means dipilih acak, jadi isi klaster di sana bisa berbeda dari tampilan ini.</p>
    <div class="scroll"><table><tr><th>Cluster</th><th class="n">Items</th><th>Kata penciri (bobot centroid)</th><th class="n">Positif</th><th class="n">Netral</th><th class="n">Negatif</th></tr>
    ${km.sizes.map((s,i)=>`<tr><td>cluster_${i}</td><td class="n">${s}</td><td>${km.terms[i].filter(t=>t[1]>0).map(t=>esc(t[0])+' ('+f2(t[1])+')').join(', ')}</td><td class="n">${km.sent[i].pos}</td><td class="n">${km.sent[i].neu}</td><td class="n">${km.sent[i].neg}</td></tr>`).join('')}</table></div>`
    :'<p class="hint">Data terlalu sedikit untuk dibagi menjadi klaster sebanyak itu.</p>');
  const RMX={
    data:'Ini datamu sesudah dibaca mesin. Tiap baris adalah satu teks. Kolom biru (id) adalah nomor urut. Kolom hijau (sentimen) adalah kelas teks itu, yang di RapidMiner disebut label.',
    stat:'Ringkasan tiap kolom: jenis datanya, berapa yang kosong, dan nilai apa yang paling banyak. Cek tabel ini dulu sebelum menganalisis, supaya kamu tahu datanya lengkap dan kelasnya tidak timpang.',
    word:'Daftar kata hasil pecahan teks. Total Occurences adalah berapa kali kata itu muncul. Document Occurences adalah di berapa teks kata itu muncul. Tiga kolom terakhir memperlihatkan di kelas mana kata itu paling banyak dipakai. Kata yang hanya ramai di kolom Negatif, misalnya, adalah ciri teks keluhan.'+(wl[0]?` <i>Di datamu</i> kata teratas adalah <b>${esc(wl[0].w)}</b>, muncul di ${wl[0].doc} teks.`:''),
    clus:'Mesin mengelompokkan teks yang kata-katanya mirip, tanpa diberi tahu temanya. Tiap kelompok disebut klaster. Mesin tidak memberi nama klaster; kamu yang menamainya setelah membaca kata pencirinya. Kolom Positif, Netral, dan Negatif membantu melihat nada tiap klaster.'+(km?(()=>{const i=km.sizes.indexOf(Math.max(...km.sizes));return ` <i>Di datamu</i> klaster terbesar adalah cluster_${i} dengan ${km.sizes[i]} teks, bercirikan kata ${km.terms[i].filter(t=>t[1]>0).slice(0,3).map(t=>'<b>'+esc(t[0])+'</b>').join(', ')}.`})():'')
  };
  el.innerHTML=`<div class="pv-bar"><b>Gaya RapidMiner · proses dan hasil</b>
      <button class="pv-btn" data-dl="rm-rmp">Process (.rmp)</button><button class="pv-btn" data-dl="rm-data">Data (.csv)</button><button class="pv-btn" data-dl="rm-wl">WordList (.csv)</button><button class="pv-btn" data-dl="html">Tampilan ini (.html)</button></div>
    <div class="pv-body">${intro('Kapan pakai gaya RapidMiner?','Saat teksmu banyak, ratusan sampai ribuan, sehingga tidak mungkin dibaca satu per satu. Gaya ini menjawab dua hal: kata apa yang khas di tiap kelompok teks, dan teks mana saja yang isinya mirip.')}<h5>Process</h5>${exp('Diagram ini adalah urutan kerja mesin, dari kiri ke kanan. Read CSV membaca file. Set Role menandai kolom mana yang jadi nomor dan mana yang jadi kelas. Process Documents memecah tiap teks menjadi kata-kata. Clustering mengelompokkan teks yang kata-katanya mirip.')}<div class="scroll">${processSVG()}</div>
    <div class="tabs noexp">${tabs.map(t=>`<button data-t="${t[0]}" class="${t[0]===S.rmTab?'on':''}">${t[1]}</button>`).join('')}</div>
    <h5 style="margin-top:0">${tabs.find(t=>t[0]===S.rmTab)[1]}</h5>${exp(RMX[S.rmTab])}${body}</div>`;
  el.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{S.rmTab=b.dataset.t;renderPenyajian()});
  if($('#rm-k'))$('#rm-k').onchange=e=>{S.k=+e.target.value;renderPenyajian()};
}
function rmDownloads(kind,rows){
  const base=slug()+'-rapidminer';
  if(kind==='rm-data')dl(base+'.csv',toCSV([['id','sentimen','teks'],...rows.map((r,i)=>[i+1,SENT[r.sent][0],oneLine(r.text)])]),'text/csv');
  if(kind==='rm-wl')dl(slug()+'-wordlist.csv',BOM+toCSV([['Word','Attribute Name','Total Occurences','Document Occurences','Positif','Netral','Negatif'],...wordList(rows).slice(0,5000).map(o=>[o.w,o.w,o.tot,o.doc,o.pos,o.neu,o.neg])]),'text/csv');
  if(kind==='rm-rmp'){
    const op=(cls,name,x,y,inner,compat)=>`<operator activated="true" class="${cls}" compatibility="${compat||'9.10.001'}" expanded="true" height="82" name="${name}" width="90" x="${x}" y="${y}">${inner||''}</operator>`;
    dl(base+'.rmp',`<?xml version="1.0" encoding="UTF-8"?><process version="9.10.001">
  <context><input/><output/><macros/></context>
  <operator activated="true" class="process" compatibility="9.10.001" expanded="true" name="Process">
    <process expanded="true">
      ${op('read_csv','Read CSV',45,34,`
        <parameter key="csv_file" value="${base}.csv"/>
        <parameter key="column_separators" value=","/>
        <parameter key="use_quotes" value="true"/>
        <parameter key="quotes_character" value="&quot;"/>
        <parameter key="first_row_as_names" value="true"/>
        <parameter key="encoding" value="UTF-8"/>
        <list key="annotations"/>
        <list key="data_set_meta_data_information"/>
      `)}
      ${op('set_role','Set Role',179,34,`
        <parameter key="attribute_name" value="id"/>
        <parameter key="target_role" value="id"/>
        <list key="set_additional_roles">
          <parameter key="sentimen" value="label"/>
        </list>
      `)}
      ${op('nominal_to_text','Nominal to Text',313,34,`
        <parameter key="attribute_filter_type" value="single"/>
        <parameter key="attribute" value="teks"/>
      `)}
      <operator activated="true" class="text:process_document_from_data" compatibility="9.4.000" expanded="true" height="82" name="Process Documents from Data" width="90" x="447" y="34">
        <parameter key="create_word_vector" value="true"/>
        <parameter key="vector_creation" value="TF-IDF"/>
        <parameter key="add_meta_information" value="true"/>
        <parameter key="keep_text" value="false"/>
        <parameter key="prune_method" value="absolute"/>
        <parameter key="prune_below_absolute" value="2"/>
        <parameter key="prune_above_absolute" value="${Math.max(3,Math.round(rows.length*.6))}"/>
        <list key="specify_weights"/>
        <process expanded="true">
          ${op('text:tokenize','Tokenize',45,34,'<parameter key="mode" value="non letters"/>','9.4.000')}
          ${op('text:transform_cases','Transform Cases',179,34,'<parameter key="transform_to" value="lower case"/>','9.4.000')}
          ${op('text:filter_by_length','Filter Tokens (by Length)',313,34,'<parameter key="min_chars" value="3"/><parameter key="max_chars" value="25"/>','9.4.000')}
          <connect from_port="document" to_op="Tokenize" to_port="document"/>
          <connect from_op="Tokenize" from_port="document" to_op="Transform Cases" to_port="document"/>
          <connect from_op="Transform Cases" from_port="document" to_op="Filter Tokens (by Length)" to_port="document"/>
          <connect from_op="Filter Tokens (by Length)" from_port="document" to_port="document 1"/>
          <portSpacing port="source_document" spacing="0"/>
          <portSpacing port="sink_document 1" spacing="0"/>
          <portSpacing port="sink_document 2" spacing="0"/>
        </process>
      </operator>
      ${op('concurrency:k_means','Clustering',581,34,`
        <parameter key="add_cluster_attribute" value="true"/>
        <parameter key="k" value="${S.k}"/>
        <parameter key="max_runs" value="10"/>
        <parameter key="measure_types" value="NumericalMeasures"/>
        <parameter key="numerical_measure" value="CosineSimilarity"/>
      `)}
      <connect from_op="Read CSV" from_port="output" to_op="Set Role" to_port="example set input"/>
      <connect from_op="Set Role" from_port="example set output" to_op="Nominal to Text" to_port="example set input"/>
      <connect from_op="Nominal to Text" from_port="example set output" to_op="Process Documents from Data" to_port="example set"/>
      <connect from_op="Process Documents from Data" from_port="example set" to_op="Clustering" to_port="example set"/>
      <connect from_op="Process Documents from Data" from_port="word list" to_port="result 3"/>
      <connect from_op="Clustering" from_port="cluster model" to_port="result 1"/>
      <connect from_op="Clustering" from_port="clustered set" to_port="result 2"/>
      <portSpacing port="source_input 1" spacing="0"/>
      <portSpacing port="sink_result 1" spacing="0"/>
      <portSpacing port="sink_result 2" spacing="0"/>
      <portSpacing port="sink_result 3" spacing="0"/>
      <portSpacing port="sink_result 4" spacing="0"/>
    </process>
  </operator>
</process>
`,'application/xml');
  }
}

/* =====================================================================
   pengatur tampilan
   ===================================================================== */
const VIEWS={ringkas:'#v-ringkas',nvivo:'#v-nvivo',spss:'#v-spss',rapidminer:'#v-rapidminer'};
window.renderPenyajian=function(){
  if(S.meta!==META){S.meta=META;S.themes=null;S.kwic='';S.rmTab='data'}
  for(const k in VIEWS){const e=$(VIEWS[k]);if(e)e.style.display=k===S.view?'':'none'}
  document.querySelectorAll('#view-seg button').forEach(b=>b.classList.toggle('on',b.dataset.v===S.view));
  const rows=current(),trows=rows.filter(r=>r.text);
  if(S.view==='ringkas')return;
  const box=$(VIEWS[S.view]);
  if(S.view!=='spss'&&!HAS_TEXT){box.innerHTML='<div class="pv-body"><b>Gaya ini butuh kolom teks.</b><p class="hint" style="margin-top:6px">Data ini hanya berisi angka dan kategori, jadi yang cocok adalah gaya SPSS. Untuk memakai gaya ini, unggah data yang punya kolom berisi kalimat (jawaban terbuka, kutipan wawancara, komentar).</p></div>';return}
  if(!(S.view==='spss'?rows:trows).length){box.innerHTML='<div class="pv-body">Tidak ada data pada filter ini.</div>';return}
  if(S.view==='nvivo')renderNV(trows);
  if(S.view==='spss')window.renderSPSS(rows);
  if(S.view==='rapidminer')renderRM(trows);
};
document.addEventListener('click',e=>{
  const v=e.target.closest('#view-seg button');if(v){S.view=v.dataset.v;renderPenyajian();return}
  const b=e.target.closest('[data-dl]');if(!b)return;
  const kind=b.dataset.dl,all=current(),rows=S.view==='spss'?all:all.filter(r=>r.text);
  if(kind==='html'){
    const node=b.closest('.pv').cloneNode(true);node.querySelectorAll('.pv-btn,.noexp').forEach(n=>n.remove());
    dl(slug()+'-'+S.view+'.html',`<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${esc(META.title)} · ${S.view}</title><style>body{margin:24px;background:#fff}${PEN_CSS}</style></head><body><p style="font:600 15px system-ui">${esc(META.title)} · ${rows.length} baris data</p>${node.outerHTML}</body></html>`,'text/html');
  }
  else if(kind.startsWith('nv-'))nvDownloads(kind,rows);
  else if(kind.startsWith('sp-'))window.spssDownloads(kind,rows);
  else if(kind.startsWith('rm-'))rmDownloads(kind,rows);
});
})();
