/* Sajiin — "Unduh PDF": menyusun file PDF sungguhan dari sajian yang sedang dibuka
   (tabel sebagai teks yang bisa disalin, grafik sebagai gambar), bukan dialog cetak. */
(function(){
const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
const slug=s=>clean(s).toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,50)||'sajian';
const judul=()=>(typeof META!=='undefined'&&META.title)||'data';
const bigSvg=s=>{const vb=s.viewBox&&s.viewBox.baseVal;return !!vb&&vb.width>=200&&!s.closest('.noexp,button,.dlbar')};

/* isi sajian yang bukan tabel, sebagai baris data */
const tipNum=el=>{const m=(el.dataset.tip||'').match(/<br>([^<]+)/);return m?clean(m[1]):''};
const rbRows=box=>[['Label','Jumlah','Tampil'],...[...box.querySelectorAll(':scope > .rb')].map(r=>[r.querySelector('.lab').textContent,tipNum(r),r.querySelector('.val').textContent])];
function sentRows(sent){const rows=[['Kelompok','Positif','Netral','Negatif']];
  const seg=st=>['Positif','Netral','Negatif'].map(k=>{const sp=[...st.querySelectorAll('span')].find(x=>(x.dataset.tip||'').includes('<b>'+k+'</b>'));return sp?tipNum(sp):'0'});
  const all=sent.querySelector(':scope > .stack');if(all)rows.push(['Semua',...seg(all)]);
  sent.querySelectorAll('.srow').forEach(r=>rows.push([r.firstElementChild.textContent,...seg(r.querySelector('.stack'))]));return rows}
const kpiRows=k=>[['Ukuran','Nilai','Keterangan'],...[...k.querySelectorAll('.kpi')].map(x=>[x.querySelector('.l').textContent,x.querySelector('.v').textContent,x.querySelector('.d').textContent])];
const postRows=p=>[['Sumber','Teks','Keterangan'],...[...p.querySelectorAll('.post')].map(x=>[x.querySelector('.who').textContent,x.querySelector('.tx').textContent,x.querySelector('.ft').textContent])];
const clusterRows=c=>[['Kubu','Akun utama','Nada dan kata'],...[...c.querySelectorAll('.cl')].map(x=>[x.children[0].textContent,x.children[1].textContent,x.children[2].textContent])];

/* SVG -> kanvas, dengan gaya hasil hitung ditempel ke tiap elemen */
const PROPS=['fill','stroke','stroke-width','stroke-dasharray','stroke-dashoffset','stroke-linecap','stroke-linejoin','opacity','fill-opacity','stroke-opacity','font-family','font-size','font-weight','letter-spacing','text-anchor','paint-order','visibility'];
function svgToCanvas(svg){return new Promise((ok,no)=>{
  const box=svg.getBoundingClientRect(),w=Math.max(1,Math.round(box.width)),h=Math.max(1,Math.round(box.height)),pad=12,scale=2;
  const copy=svg.cloneNode(true),src=[svg,...svg.querySelectorAll('*')],dst=[copy,...copy.querySelectorAll('*')];
  src.forEach((s,i)=>{const cs=getComputedStyle(s),d=dst[i];if(d.tagName==='title')return;
    PROPS.forEach(p=>{const v=cs.getPropertyValue(p);if(v)d.style.setProperty(p,v)});d.style.animation='none';d.style.transition='none'});
  copy.querySelectorAll('[visibility="hidden"],rect[fill="transparent"]').forEach(n=>n.remove());
  copy.setAttribute('xmlns','http://www.w3.org/2000/svg');copy.setAttribute('width',w);copy.setAttribute('height',h);copy.style.overflow='visible';
  const xml=new XMLSerializer().serializeToString(copy),img=new Image();
  img.onload=()=>{const cv=document.createElement('canvas');cv.width=(w+pad*2)*scale;cv.height=(h+pad*2)*scale;const ctx=cv.getContext('2d');
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,cv.width,cv.height);ctx.drawImage(img,pad*scale,pad*scale,w*scale,h*scale);ok({cv,w:w+pad*2,h:h+pad*2})};
  img.onerror=()=>no(new Error('Grafik gagal diubah menjadi gambar.'));
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(xml)})}

const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'];
const loadLib=src=>new Promise((ok,no)=>{if(document.querySelector(`script[src="${src}"]`))return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('Pembuat PDF gagal dimuat. Sambungkan internet lalu coba lagi.'));document.head.appendChild(s)});
/* huruf bawaan PDF hanya mengenal Latin: rapikan tanda baca, buang emoji */
const pdfText=s=>clean(s).replace(/[“”„]/g,'"').replace(/[‘’]/g,"'").replace(/[–—−]/g,'-').replace(/…/g,'...').replace(/[→↓▾]/g,'').replace(/×/g,'x').replace(/[^\x20-\x7E -ÿ]/g,'').trim();
const NAMA={ringkas:'Gambaran cepat',spss:'Statistik (gaya SPSS)',nvivo:'Kualitatif (gaya NVivo)',rapidminer:'Text mining (gaya RapidMiner)'};
const SKIP='.noexp,.dlbar,.exp,.pick,.pv-bar,.hint,.sub,.note,.legend,.seg,.out,.fn,.warn,.tabs,script,style';

function collect(root){
  const out=[];
  (function walk(el){
    if(el.nodeType!==1||el.matches(SKIP))return;
    if(el!==root&&el.tagName!=='svg'&&getComputedStyle(el).display==='none')return;
    if(el.matches('h4,h5,.tt')){out.push({t:'h',lv:el.matches('.tt')?3:el.matches('h5')?2:1,text:el.textContent});return}
    if(el.matches('pre')){out.push({t:'pre',text:el.innerText});return}
    if(el.id==='quick'){out.push({t:'list',items:[...el.querySelectorAll('li')].map(li=>li.textContent)});return}
    if(el.id==='kpis'){out.push({t:'h',lv:1,text:'Angka utama'},{t:'rows',rows:kpiRows(el)});return}
    if(el.id==='sent'&&el.querySelector('.stack')){out.push({t:'rows',rows:sentRows(el)});return}
    if(el.id==='posts'&&el.querySelector('.post')){out.push({t:'rows',rows:postRows(el)});return}
    if(el.id==='clusters'&&el.children.length){out.push({t:'rows',rows:clusterRows(el)});return}
    if([...el.children].some(c=>c.classList.contains('rb'))){out.push({t:'rows',rows:rbRows(el)});return}
    if(el.tagName==='TABLE'){out.push({t:'table',el});return}
    if(el.tagName==='svg'){if(bigSvg(el))out.push({t:'svg',el});return}
    [...el.children].forEach(walk);
  })(root);
  return out;
}

window.unduhPDF=async function(btn){
  const label=btn?btn.textContent:'';
  try{
    if(btn){btn.disabled=true;btn.textContent='Menyusun PDF…'}
    for(const l of LIBS)await loadLib(l);
    const view=(window.PEN&&PEN.view)||'ringkas',root=document.querySelector('#v-'+view);
    const blocks=collect(root);
    const doc=new window.jspdf.jsPDF({unit:'pt',format:'a4'}),W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight(),M=42;
    let y=M;
    const room=h=>{if(y+h>H-M-10){doc.addPage();y=M}};
    const para=(text,size,style,gap,font)=>{doc.setFont(font||'helvetica',style||'normal');doc.setFontSize(size);doc.splitTextToSize(pdfText(text),W-2*M).forEach(ln=>{room(size*1.35);doc.text(ln,M,y+size);y+=size*1.35});y+=gap||0};
    doc.setFillColor(229,155,230);doc.rect(0,0,W,8,'F');
    para(judul(),20,'bold',2);
    para(`${NAMA[view]||view} | ${current().length} baris data | dibuat dengan Sajiin, ${new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}`,9.5,'normal',10);
    doc.setDrawColor(20);doc.setLineWidth(1);doc.line(M,y,W-M,y);y+=6;
    const opt={margin:{left:M,right:M,bottom:M+10},theme:'grid',styles:{font:'helvetica',fontSize:8,cellPadding:3,textColor:20,lineColor:[150,150,150],lineWidth:.4,overflow:'linebreak'},headStyles:{fillColor:[243,236,208],textColor:20,fontStyle:'bold'},
      didParseCell:d=>{d.cell.text=d.cell.text.map(pdfText)}};
    for(const [bi,b] of blocks.entries()){
      if(b.t==='h'){const size=[0,14,12.5,10][b.lv];y+=b.lv===3?6:14;room(blocks[bi+1]&&blocks[bi+1].t==='svg'?270:size*4);para(b.text,size,'bold',b.lv===3?3:5)}
      else if(b.t==='pre'){b.text.split('\n').forEach(l=>para(l||' ',9,'normal',0,'courier'));y+=8}
      else if(b.t==='list'){b.items.forEach(it=>para('- '+it,10,'normal',2));y+=6}
      else if(b.t==='rows'){doc.autoTable({...opt,startY:y,head:[b.rows[0]],body:b.rows.slice(1)});y=doc.lastAutoTable.finalY+12}
      else if(b.t==='table'){doc.autoTable({...opt,startY:y,html:b.el,useCss:false});y=doc.lastAutoTable.finalY+12}
      else if(b.t==='svg'){const g=await svgToCanvas(b.el),w=Math.min(W-2*M,g.w*.75),h=w*g.h/g.w;room(h+8);doc.addImage(g.cv.toDataURL('image/jpeg',.9),'JPEG',M,y,w,h);y+=h+10}
    }
    const n=doc.getNumberOfPages();
    for(let i=1;i<=n;i++){doc.setPage(i);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(120);doc.text(pdfText('Sajiin | '+judul()),M,H-22);doc.text(i+' / '+n,W-M,H-22,{align:'right'});doc.setTextColor(20)}
    doc.save(slug(judul())+'-'+view+'.pdf');
    return {halaman:n,blok:blocks.length};
  }catch(e){alert(e.message||'PDF gagal dibuat.');return {error:e.message}}
  finally{if(btn){btn.disabled=false;btn.textContent=label}}
};
})();
