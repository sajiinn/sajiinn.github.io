/* Sajiin — tombol unduh untuk setiap sajian data di dasbor.
   Tabel -> .csv, grafik (SVG) -> .png, daftar batang -> .csv, ringkasan -> .txt. */
(function(){
const dash=document.querySelector('#dash');
document.head.insertAdjacentHTML('beforeend',`<style>
.dlbar{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 4px}
.grid>.dlbar{grid-column:1/-1;margin:-8px 0 0}
.dlb{font:600 11.5px/1.4 "DM Sans",system-ui,sans-serif;color:#141414;background:#fff;border:1.5px solid #141414;border-radius:999px;padding:3px 11px;cursor:pointer;transition:background .15s,transform .15s}
.dlb:hover{background:#f2c94c;transform:translateY(-1px)}
.dlb:focus-visible{outline:2px solid #141414;outline-offset:2px}
@media print{.dlbar{display:none!important}}
</style>`);

/* ---------- alat bantu ---------- */
const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
const slug=s=>clean(s).toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,50)||'sajian';
const base=()=>slug((typeof META!=='undefined'&&META.title)||'data');
const cell=v=>{v=clean(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
const toCSV=rows=>'﻿'+rows.map(r=>r.map(cell).join(',')).join('\r\n')+'\r\n';
function save(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
const saveText=(name,text,type)=>save(name,new Blob([text],{type:type||'text/csv;charset=utf-8'}));

/* judul terdekat di atas elemen, untuk nama file */
function titleFor(el){
  const tw=el.closest('.tw'); if(tw&&tw.previousElementSibling&&tw.previousElementSibling.matches('.tt'))return clean(tw.previousElementSibling.textContent);
  let n=el;
  while(n&&n!==dash){let p=n.previousElementSibling;
    while(p){if(p.matches('h4,h5,.tt'))return clean(p.textContent);p=p.previousElementSibling}
    n=n.parentElement;if(n&&n.matches('.card')){const h=n.querySelector('h4');if(h)return clean(h.textContent)}}
  return 'sajian';
}

/* tabel dengan rowspan/colspan -> kisi rata */
function tableGrid(table){
  const grid=[];
  [...table.rows].forEach((tr,r)=>{grid[r]=grid[r]||[];let c=0;
    [...tr.cells].forEach(td=>{while(grid[r][c]!==undefined)c++;
      const rs=td.rowSpan||1,cs=td.colSpan||1,t=clean(td.innerText);
      for(let i=0;i<rs;i++){grid[r+i]=grid[r+i]||[];for(let j=0;j<cs;j++)grid[r+i][c+j]=(i===0&&j===0)?t:''}
      c+=cs})});
  const w=Math.max(...grid.map(r=>r.length));
  return grid.map(r=>Array.from({length:w},(_,i)=>r[i]??''));
}

/* SVG -> PNG, dengan gaya hasil hitung ditempel ke tiap elemen */
const PROPS=['fill','stroke','stroke-width','stroke-dasharray','stroke-dashoffset','stroke-linecap','stroke-linejoin','opacity','fill-opacity','stroke-opacity','font-family','font-size','font-weight','letter-spacing','text-anchor','paint-order','visibility'];
function svgToPng(svg,name){
  const box=svg.getBoundingClientRect(),w=Math.max(1,Math.round(box.width)),h=Math.max(1,Math.round(box.height)),pad=16;
  const copy=svg.cloneNode(true),src=[svg,...svg.querySelectorAll('*')],dst=[copy,...copy.querySelectorAll('*')];
  src.forEach((s,i)=>{const cs=getComputedStyle(s),d=dst[i];if(d.tagName==='title')return;
    PROPS.forEach(p=>{const v=cs.getPropertyValue(p);if(v)d.style.setProperty(p,v)});d.style.animation='none';d.style.transition='none'});
  copy.querySelectorAll('[visibility="hidden"],rect[fill="transparent"]').forEach(n=>n.remove());
  copy.setAttribute('xmlns','http://www.w3.org/2000/svg');copy.setAttribute('width',w);copy.setAttribute('height',h);copy.style.overflow='visible';
  const xml=new XMLSerializer().serializeToString(copy),img=new Image(),scale=2;
  img.onload=()=>{const cv=document.createElement('canvas');cv.width=(w+pad*2)*scale;cv.height=(h+pad*2)*scale;const ctx=cv.getContext('2d');
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,cv.width,cv.height);ctx.drawImage(img,pad*scale,pad*scale,w*scale,h*scale);
    cv.toBlob(b=>b&&save(name,b),'image/png')};
  img.onerror=()=>saveText(name.replace(/\.png$/,'.svg'),xml,'image/svg+xml');
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(xml);
}

/* ---------- pemasangan tombol ---------- */
function bar(anchor,buttons,where){
  const d=document.createElement('div');d.className='dlbar noexp noprint';
  buttons.forEach(([label,fn])=>{const b=document.createElement('button');b.type='button';b.className='dlb';b.textContent='↓ '+label;b.onclick=e=>{e.stopPropagation();fn()};d.appendChild(b)});
  const old=anchor.nextElementSibling;if(old&&old.classList.contains('dlbar'))old.remove();
  anchor.insertAdjacentElement(where||'afterend',d);
}
function decorate(){
  if(!dash||dash.style.display==='none')return;
  // tabel
  dash.querySelectorAll('table:not([data-dl])').forEach(t=>{t.dataset.dl=1;if(t.closest('.noexp'))return;
    const anchor=t.closest('.tscroll,.scroll')||t;
    bar(anchor,[['Unduh tabel (.csv)',()=>saveText(base()+'-'+slug(titleFor(t))+'.csv',toCSV(tableGrid(t)))]])});
  // grafik
  dash.querySelectorAll('svg:not([data-dl])').forEach(s=>{s.dataset.dl=1;
    if(s.closest('.noexp,button,.dlbar'))return;const vb=s.viewBox&&s.viewBox.baseVal;if(!vb||vb.width<200)return;
    const anchor=s.closest('.scroll')||s;
    bar(anchor,[['Unduh grafik (.png)',()=>svgToPng(s,base()+'-'+slug(s.getAttribute('aria-label')||titleFor(s))+'.png')]])});
  // daftar batang
  new Set([...dash.querySelectorAll('.rb')].map(r=>r.parentElement)).forEach(box=>{if(box.dataset.dl)return;box.dataset.dl=1;
    bar(box,[['Unduh data (.csv)',()=>saveText(base()+'-'+slug(titleFor(box))+'.csv',toCSV([['Label','Jumlah','Tampil'],...[...box.querySelectorAll('.rb')].map(r=>{
      const m=(r.dataset.tip||'').match(/<br>([^<]+)/);return [r.querySelector('.lab').textContent,m?clean(m[1]):'',r.querySelector('.val').textContent]})]))]])});
  // sentimen (batang bertumpuk)
  const sent=dash.querySelector('#sent');
  if(sent&&!sent.dataset.dl&&sent.querySelector('.stack')){sent.dataset.dl=1;
    bar(sent,[['Unduh data (.csv)',()=>{const rows=[['Kelompok','Positif','Netral','Negatif']];
      const seg=st=>['Positif','Netral','Negatif'].map(k=>{const sp=[...st.querySelectorAll('span')].find(x=>(x.dataset.tip||'').includes('<b>'+k+'</b>'));const m=sp&&sp.dataset.tip.match(/<br>([^<]+)/);return m?clean(m[1]):'0'});
      const all=sent.querySelector(':scope > .stack');if(all)rows.push(['Semua',...seg(all)]);
      sent.querySelectorAll('.srow').forEach(r=>rows.push([r.firstElementChild.textContent,...seg(r.querySelector('.stack'))]));
      saveText(base()+'-sentimen.csv',toCSV(rows))}]])}
  // angka utama
  const k=dash.querySelector('#kpis');
  if(k&&!k.dataset.dl&&k.children.length){k.dataset.dl=1;
    bar(k,[['Unduh angka utama (.csv)',()=>saveText(base()+'-angka-utama.csv',toCSV([['Ukuran','Nilai','Keterangan'],...[...k.querySelectorAll('.kpi')].map(x=>[x.querySelector('.l').textContent,x.querySelector('.v').textContent,x.querySelector('.d').textContent])]))]])}
  // bacaan cepat
  const q=dash.querySelector('#quick');
  if(q&&!q.dataset.dl&&q.children.length){q.dataset.dl=1;
    bar(q,[['Unduh ringkasan (.txt)',()=>saveText(base()+'-bacaan-cepat.txt',[...q.querySelectorAll('li')].map(li=>'- '+clean(li.textContent)).join('\r\n')+'\r\n','text/plain;charset=utf-8')]])}
  // teks paling menonjol
  const p=dash.querySelector('#posts');
  if(p&&!p.dataset.dl&&p.querySelector('.post')){p.dataset.dl=1;
    bar(p,[['Unduh teks (.csv)',()=>saveText(base()+'-teks-menonjol.csv',toCSV([['Sumber','Teks','Keterangan'],...[...p.querySelectorAll('.post')].map(x=>[x.querySelector('.who').textContent,x.querySelector('.tx').textContent,x.querySelector('.ft').textContent])]))]])}
  // kubu
  const c=dash.querySelector('#clusters');
  if(c&&!c.dataset.dl&&c.children.length){c.dataset.dl=1;
    bar(c,[['Unduh daftar kubu (.csv)',()=>saveText(base()+'-kubu.csv',toCSV([['Kubu','Akun utama','Nada dan kata'],...[...c.querySelectorAll('.cl')].map(x=>[x.children[0].textContent,x.children[1].textContent,x.children[2].textContent])]))]])}
}

/* wadah yang isinya diganti saat render: tandanya dihapus supaya tombol dipasang lagi */
const RESET=['#sent','#kpis','#quick','#posts','#clusters'];
let timer=0;
new MutationObserver(muts=>{
  const own=n=>n.nodeType!==1||n.classList.contains('dlbar');
  if(muts.every(m=>[...m.addedNodes].every(own)&&[...m.removedNodes].every(own)))return;
  clearTimeout(timer);timer=setTimeout(()=>{
    RESET.forEach(s=>{const el=dash.querySelector(s);if(el&&el.dataset.dl){const nx=el.nextElementSibling;if(!nx||!nx.classList.contains('dlbar'))delete el.dataset.dl;else{nx.remove();delete el.dataset.dl}}});
    dash.querySelectorAll('[data-dl]').forEach(el=>{if(el.matches('table,svg'))return;const nx=el.nextElementSibling;if(el.querySelector('.rb')&&(!nx||!nx.classList.contains('dlbar')))delete el.dataset.dl});
    decorate()},60)
}).observe(dash,{childList:true,subtree:true});
window.pasangUnduh=decorate;
})();
