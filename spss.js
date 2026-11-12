/* Sajiin — penyajian statistik bergaya SPSS untuk variabel apa pun.
   Memakai global dari index.html (VARS, META, HAS_TEXT, count, esc) dan PENH dari penyajian.js. */
(function(){
const {dl,toCSV,slug,oneLine,f1,f2,f3,S,exp:X,intro:I}=window.PENH;
const $=s=>document.querySelector(s);
document.head.insertAdjacentHTML('beforeend',`<style>
.pv .pick{padding:14px 16px}
.pv .pick section{border-top:1px dashed #cfcfcf;padding:12px 0 10px}
.pv .pick section:first-of-type{border-top:0;padding-top:6px}
.pv .pick h6{margin:0;font-size:13.5px;font-weight:700}
.pv .pick h6 small{font-weight:400;color:#555;font-size:12.5px;margin-left:6px}
.pv .pick .how{margin:4px 0 8px;font-size:12.5px;color:#333;max-width:780px;line-height:1.55}
.pv .pick .how b{color:#141414}
.pv .pick .how .ex{display:block;margin-top:5px;padding:5px 9px;background:#fff8e0;border-left:4px solid #141414;border-radius:4px}
.pv .pick .how .ex i{font-style:normal;font-weight:700;background:#fff;border:1px solid #141414;border-radius:4px;padding:0 6px;margin-right:2px}
.pv .pick .q{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.pv .pick .q button{font:600 11.5px/1.4 "DM Sans",system-ui,sans-serif;color:#141414;border:1.5px solid #141414;background:#fff;border-radius:999px;padding:2px 10px;cursor:pointer}
.pv .pick .q button:hover{background:#f2c94c}
.pv .pick .q button.main{background:#e59be6}
.pv .pick .list{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:3px 18px;max-height:172px;overflow:auto;border:1px solid #d5d5d5;border-radius:6px;padding:8px 10px;background:#fff}
.pv .pick .list label{display:flex;gap:6px;align-items:flex-start;min-width:0;white-space:normal;cursor:pointer}
.pv .pick .list label span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pv .pick .list input{flex:none;margin:3px 0 0}
.pv .pick .sel{display:flex;gap:14px;flex-wrap:wrap}
.pv .pick .sel select{max-width:320px}
</style>`);

/* ---------- statistik ---------- */
function gammaln(x){const c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,.001208650973866179,-.000005395239384953];let y=x,t=x+5.5;t-=(x+.5)*Math.log(t);let s=1.000000000190015;for(let j=0;j<6;j++)s+=c[j]/++y;return -t+Math.log(2.5066282746310005*s/x)}
function gammq(a,x){
  if(x<=0)return 1;
  if(x<a+1){let ap=a,sum=1/a,del=sum;for(let n=0;n<500;n++){ap++;del*=x/ap;sum+=del;if(Math.abs(del)<Math.abs(sum)*1e-12)break}return 1-sum*Math.exp(-x+a*Math.log(x)-gammaln(a))}
  let b=x+1-a,c=1e300,d=1/b,h=d;for(let i=1;i<500;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-12)break}
  return Math.exp(-x+a*Math.log(x)-gammaln(a))*h;
}
function betacf(a,b,x){let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<1e-300)d=1e-300;d=1/d;let h=d;
  for(let m=1;m<=300;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<1e-300)d=1e-300;c=1+aa/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;h*=d*c;
    aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<1e-300)d=1e-300;c=1+aa/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-12)break}
  return h}
function betai(a,b,x){if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(gammaln(a+b)-gammaln(a)-gammaln(b)+a*Math.log(x)+b*Math.log(1-x));return x<(a+1)/(a+b+2)?bt*betacf(a,b,x)/a:1-bt*betacf(b,a,1-x)/b}
const tP=(t,df)=>df>0?betai(df/2,.5,df/(df+t*t)):NaN;            // dua sisi
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const vari=a=>{const m=mean(a);return a.length>1?a.reduce((x,y)=>x+(y-m)**2,0)/(a.length-1):NaN};
function pearson(x,y){const n=x.length;if(n<3)return {r:NaN,p:NaN,n};const mx=mean(x),my=mean(y);let sxy=0,sxx=0,syy=0;for(let i=0;i<n;i++){sxy+=(x[i]-mx)*(y[i]-my);sxx+=(x[i]-mx)**2;syy+=(y[i]-my)**2}
  const r=sxy/Math.sqrt(sxx*syy);if(!isFinite(r))return {r:NaN,p:NaN,n};const t=r*Math.sqrt((n-2)/(1-r*r));return {r,p:Math.abs(r)>=1?0:tP(t,n-2),n}}
function alpha(cols){const k=cols.length,n=cols[0].length;if(k<2||n<3)return NaN;const tot=Array.from({length:n},(_,i)=>cols.reduce((a,c)=>a+c[i],0));return k/(k-1)*(1-cols.reduce((a,c)=>a+vari(c),0)/vari(tot))}
const sig=p=>!isFinite(p)?'':p<.001?'&lt;.001':f3(p).replace(/^0/,'');

/* ---------- penjelasan untuk pembaca awam ---------- */
const c1=x=>f1(x).replace('.',','),c2=x=>f2(x).replace('.',','),c3=x=>f3(x).replace('.',',');
const strength=r=>{r=Math.abs(r);return r<.2?'sangat lemah':r<.4?'lemah':r<.6?'sedang':r<.8?'kuat':'sangat kuat'};
function corrExp(iv,pair){let best=null;for(let a=0;a<iv.length;a++)for(let b=a+1;b<iv.length;b++){const p=pair(a,b);if(isFinite(p.r)&&(!best||Math.abs(p.r)>Math.abs(best.r)))best={r:p.r,a,b}}
  return 'Korelasi mengukur seberapa erat dua variabel angka bergerak bersama. Nilainya dari −1 sampai 1. Makin dekat ke 1 atau −1, makin erat. Tanda minus berarti arahnya berlawanan: yang satu naik, yang lain turun. Baris Sig. (2-tailed) di bawah 0,05 berarti hubungannya signifikan, dan bintang menandai itu.'+(best?` <i>Di datamu</i> pasangan paling erat adalah <b>${esc(iv[best.a].name)}</b> dan <b>${esc(iv[best.b].name)}</b> (r = ${c3(best.r)}), tergolong ${strength(best.r)} menurut patokan yang umum dipakai.`:'')}
function relExp(al,iv,cc,tot){const low=iv.filter((v,j)=>pearson(cc[j],tot.map((t,i)=>t-cc[j][i])).r<.3).map(v=>esc(v.name));
  return `Cronbach's Alpha menjawab satu pertanyaan: apakah butir-butir kuesionermu konsisten mengukur hal yang sama? Nilai 0,70 ke atas umumnya dianggap reliabel. <i>Di datamu</i> alpha = ${c3(al)}, jadi butir-butirnya <b>${al>=.7?'reliabel':'belum reliabel'}</b>. Di tabel Item-Total, kolom Corrected Item-Total Correlation menunjukkan seberapa sejalan satu butir dengan butir lainnya. Nilai di bawah 0,30 biasanya jadi alasan butir itu ditinjau ulang. `+(low.length?`Butir di bawah 0,30: <b>${low.join(', ')}</b>.`:'Semua butirmu di atas 0,30.')+' Kolom terakhir memperlihatkan alpha kalau butir itu dibuang.'}

/* ---------- pilihan variabel ---------- */
const byName=n=>VARS.find(v=>v.name===n);
function lowCard(v,rows){if(v.type!=='num')return false;return new Set(rows.map(r=>v.get(r)).filter(x=>x!=null)).size<=10}
function choices(rows){
  const cats=VARS.filter(v=>v.type==='cat'), nums=VARS.filter(v=>v.type==='num');
  const catLike=[...cats.filter(v=>!v.derived),...cats.filter(v=>v.derived),...nums.filter(v=>!v.derived&&lowCard(v,rows))];
  return {catLike,nums};
}
function itemGroups(nums){const g=new Map();
  nums.filter(v=>!v.derived).forEach(v=>{const n=v.name.trim(),m=n.match(/^([A-Za-z]{1,3}\d{0,2})\s*[._-]\s*\d+/)||n.match(/^([A-Za-z]{1,4})\d+$/);
    if(m){const k=m[1].toUpperCase();if(!g.has(k))g.set(k,[]);g.get(k).push(v.name)}});
  return [...g].filter(x=>x[1].length>=2)}
function defaults(rows){
  const {catLike,nums}=choices(rows), realCats=catLike.filter(v=>v.type==='cat');
  const usable=realCats.filter(v=>{const k=new Set(rows.map(r=>v.get(r)).filter(x=>x!=null)).size;return k>=2&&k<=15});
  const likert=nums.filter(v=>!v.derived&&lowCard(v,rows)&&rows.every(r=>{const x=v.get(r);return x==null||(Number.isInteger(x)&&x>=0&&x<=10)}));
  const items=(likert.length>=2?likert:nums.filter(v=>!v.derived)).slice(0,8);
  const senti=byName('Sentimen');
  return {freq:usable.slice(0,3).map(v=>v.name),desc:nums.slice(0,10).map(v=>v.name),items:(itemGroups(nums)[0]||[0,items.map(v=>v.name)])[1].slice(0,12),
    row:(usable.find(v=>!v.derived)||usable[0]||{}).name||'',col:(senti&&usable.includes(senti)&&usable.some(v=>!v.derived)?senti:usable.find(v=>v!==(usable.find(u=>!u.derived)||usable[0]))||{}).name||''};
}
function fmtCat(x){return typeof x==='number'?String(x):x}
function catOrder(v,vals,cap=1e9,hard=false){
  // SPSS mengurutkan kategori menurut nilainya secara menaik (angka: kecil ke besar, teks: abjad).
  let c=count(vals,x=>fmtCat(x));if(c.length>cap)c=c.slice(0,hard?cap:cap-1);
  return v.type==='num'?c.sort((a,b)=>+a[0]-+b[0]):c.sort((a,b)=>String(a[0]).localeCompare(String(b[0]),'id'))}

/* ---------- tabel ---------- */
function freqHTML(v,rows){
  const all=rows.map(r=>v.get(r)),valid=all.filter(x=>x!=null),miss=all.length-valid.length,N=all.length;
  const allN=new Set(valid.map(fmtCat)).size;let cats=catOrder(v,valid,40);
  if(allN>40){const shown=cats.reduce((a,c)=>a+c[1],0);cats=[...cats,['Lainnya ('+(allN-cats.length)+' kategori terkecil)',valid.length-shown]]}
  let cum=0;
  return `<div class="tt">${esc(v.name)}</div><div class="tw"><table><tr><th colspan="2"></th><th>Frequency</th><th>Percent</th><th>Valid Percent</th><th>Cumulative Percent</th></tr>
    ${cats.map((c,i)=>{cum+=c[1];return `<tr>${i===0?`<td rowspan="${cats.length+1}">Valid</td>`:''}<td>${esc(c[0])}</td><td class="n">${c[1]}</td><td class="n">${f1(c[1]/N*100)}</td><td class="n">${f1(c[1]/valid.length*100)}</td><td class="n">${f1(cum/valid.length*100)}</td></tr>`}).join('')}
    <tr>${cats.length?'':'<td>Valid</td>'}<td>Total</td><td class="n">${valid.length}</td><td class="n">${f1(valid.length/N*100)}</td><td class="n">${valid.length?'100.0':''}</td><td></td></tr>
    ${miss?`<tr><td>Missing</td><td>System</td><td class="n">${miss}</td><td class="n">${f1(miss/N*100)}</td><td></td><td></td></tr><tr><td colspan="2">Total</td><td class="n">${N}</td><td class="n">100.0</td><td></td><td></td></tr>`:''}</table></div>`;
}
function crosstab(rows,rv,cv){
  const data=rows.map(r=>[rv.get(r),cv.get(r)]).filter(p=>p[0]!=null&&p[1]!=null).map(p=>[fmtCat(p[0]),fmtCat(p[1])]);
  const rc=catOrder(rv,data.map(p=>p[0]),12,true).map(c=>c[0]),cc=catOrder(cv,data.map(p=>p[1]),8,true).map(c=>c[0]);
  const d=data.filter(p=>rc.includes(p[0])&&cc.includes(p[1]));
  const tab=rc.map(a=>cc.map(b=>d.filter(p=>p[0]===a&&p[1]===b).length));
  const rt=tab.map(r=>r.reduce((a,b)=>a+b,0)),ct=cc.map((_,j)=>tab.reduce((a,r)=>a+r[j],0)),N=d.length;
  let chi=0,g2=0,low=0,minE=Infinity;tab.forEach((r,i)=>r.forEach((o,j)=>{const e=rt[i]*ct[j]/N;if(e>0)chi+=(o-e)**2/e;if(o>0&&e>0)g2+=2*o*Math.log(o/e);if(e<5)low++;minE=Math.min(minE,e)}));
  const df=(rc.length-1)*(cc.length-1);
  return {rc,cc,tab,rt,ct,N,chi,g2,df,p:df>0?gammq(df/2,chi/2):NaN,pg:df>0?gammq(df/2,g2/2):NaN,low,cells:rc.length*cc.length,minE,total:rows.length};
}
function numFmt(x){return Number.isInteger(x)?String(x):f2(x)}

function renderSP(rows){
  const el=$('#v-spss');
  if(S.spMeta!==META){S.spMeta=META;S.sp=defaults(rows)}
  const P=S.sp,{catLike,nums}=choices(rows),N=rows.length;
  const fv=P.freq.map(byName).filter(Boolean),dv=P.desc.map(byName).filter(Boolean),iv=P.items.map(byName).filter(Boolean).slice(0,12);
  const rv=byName(P.row),cvv=byName(P.col);
  const chk=(grp,list,sel)=>list.map(v=>`<label title="${esc(v.name)}"><input type="checkbox" data-grp="${grp}" value="${esc(v.name)}"${sel.includes(v.name)?' checked':''}> <span>${esc(v.name)}</span></label>`).join('')||'<span class="hint">Tidak ada variabel yang cocok.</span>';
  const opt=(list,sel)=>'<option value="">(tidak dipakai)</option>'+list.map(v=>`<option${v.name===sel?' selected':''}>${esc(v.name)}</option>`).join('');
  let out='',outline=[];

  /* Frequencies */
  if(fv.length){outline.push(['sp-f','Frequencies']);
    const fx=fv.map(v=>{const a=rows.map(r=>v.get(r)).filter(x=>x!=null),c=count(a,x=>fmtCat(x))[0];return c?`pada <b>${esc(v.name)}</b> yang terbanyak adalah “${esc(c[0])}” (${c[1]} dari ${a.length}, atau ${c1(c[1]/a.length*100)}%)`:''}).filter(Boolean).join('; ');
    const eF='Tabel frekuensi menghitung berapa banyak data di tiap kategori. Frequency adalah jumlahnya. Percent adalah persen dari semua data, termasuk yang kosong. Valid Percent adalah persen dari data yang terisi saja; pakai kolom ini di laporan kalau ada data kosong. Cumulative Percent menjumlahkan persen dari baris teratas ke bawah. Grafik batang di bawah tabel menggambarkan jumlah yang sama.'+(fx?` <i>Di datamu</i> ${fx}.`:'');
    out+=`<h5 id="sp-f">Frequencies</h5>${X(eF)}<div class="tt">Statistics</div><div class="tw"><table><tr><th colspan="2"></th>${fv.map(v=>`<th>${esc(v.name)}</th>`).join('')}</tr>
      <tr><td rowspan="2">N</td><td>Valid</td>${fv.map(v=>`<td class="n">${rows.filter(r=>v.get(r)!=null).length}</td>`).join('')}</tr>
      <tr><td>Missing</td>${fv.map(v=>`<td class="n">${rows.filter(r=>v.get(r)==null).length}</td>`).join('')}</tr></table></div>`+fv.map(v=>freqHTML(v,rows)).join('');
    const v=fv[0],c=catOrder(v,rows.map(r=>v.get(r)).filter(x=>x!=null),10,true),bmax=Math.max(1,...c.map(x=>x[1])),step=Math.pow(10,Math.floor(Math.log10(bmax))),top=Math.ceil(bmax/step)*step,bw=380/c.length;
    out+=`<div class="tt" style="text-align:left;margin-top:18px">Bar Chart</div><svg viewBox="0 0 460 290" style="max-width:480px" role="img" aria-label="Bar chart ${esc(v.name)}"><rect x="60" y="20" width="380" height="210" fill="#f0f0f0" stroke="#000" stroke-width=".8"/>
      ${[0,1,2,3,4].map(i=>`<line x1="55" x2="60" y1="${230-i*52.5}" y2="${230-i*52.5}" stroke="#000"/><text x="50" y="${234-i*52.5}" text-anchor="end" font-size="11">${Math.round(top*i/4)}</text>`).join('')}
      ${c.map((x,i)=>`<g><title>${esc(x[0])}: ${x[1]}</title><rect x="${60+i*bw+bw*.2}" y="${230-x[1]/top*210}" width="${bw*.6}" height="${x[1]/top*210}" fill="#3a6ea5" stroke="#000" stroke-width=".6"/><text x="${60+i*bw+bw/2}" y="246" text-anchor="middle" font-size="${c.length>6?9.5:11.5}">${esc(String(x[0]).slice(0,c.length>6?8:14))}</text></g>`).join('')}
      <text x="250" y="274" text-anchor="middle" font-size="12" font-weight="700">${esc(v.name)}</text><text transform="translate(16 125) rotate(-90)" text-anchor="middle" font-size="12" font-weight="700">Frequency</text></svg>`}

  /* Descriptives */
  if(dv.length){outline.push(['sp-d','Descriptives']);
    const ms=dv.filter(v=>!v.derived).map(v=>{const a=rows.map(r=>v.get(r)).filter(x=>x!=null);return a.length?{n:v.name,m:mean(a),mx:Math.max(...a),mn:Math.min(...a)}:null}).filter(Boolean).filter(o=>o.mn>=0&&o.mx<=10).sort((a,b)=>b.m-a.m);
    const eD='Tabel ini merangkum variabel angka. N adalah jumlah data yang terisi. Minimum dan Maximum adalah nilai terkecil dan terbesar. Mean adalah rata-rata. Std. Deviation menunjukkan seberapa beragam jawabannya: makin besar angkanya, makin berbeda-beda jawaban responden.'+(ms.length>=2?` <i>Di datamu</i> rata-rata tertinggi ada di <b>${esc(ms[0].n)}</b> (${c2(ms[0].m)}) dan terendah di <b>${esc(ms[ms.length-1].n)}</b> (${c2(ms[ms.length-1].m)}).`:'');
    const listN=rows.filter(r=>dv.every(v=>v.get(r)!=null)).length;
    out+=`<h5 id="sp-d">Descriptives</h5>${X(eD)}<div class="tt">Descriptive Statistics</div><div class="tw"><table><tr><th></th><th>N</th><th>Minimum</th><th>Maximum</th><th>Mean</th><th>Std. Deviation</th></tr>
      ${dv.map(v=>{const a=rows.map(r=>v.get(r)).filter(x=>x!=null);return a.length?`<tr><td>${esc(v.name)}</td><td class="n">${a.length}</td><td class="n">${numFmt(Math.min(...a))}</td><td class="n">${numFmt(Math.max(...a))}</td><td class="n">${f2(mean(a))}</td><td class="n">${f3(Math.sqrt(vari(a)))}</td></tr>`:`<tr><td>${esc(v.name)}</td><td class="n">0</td><td></td><td></td><td></td><td></td></tr>`}).join('')}
      <tr><td>Valid N (listwise)</td><td class="n">${listN}</td><td></td><td></td><td></td><td></td></tr></table></div>`}

  /* Crosstabs */
  if(rv&&cvv&&rv!==cvv){const ct=crosstab(rows,rv,cvv);outline.push(['sp-c','Crosstabs']);
    const okC=ct.rc.length>1&&ct.cc.length>1;
    const eC=okC?`Tabel silang mempertemukan dua variabel kategori. Bacanya per baris: Count adalah jumlah datanya, dan “% within” adalah persennya di dalam baris itu. <i>Contoh dari datamu</i>: dari ${ct.rt[0]} data “${esc(ct.rc[0])}”, sebanyak ${c1(ct.tab[0][0]/ct.rt[0]*100)}% masuk “${esc(ct.cc[0])}”. Tabel Chi-Square Tests lalu menguji apakah kedua variabel itu berhubungan. Lihat kolom Asymptotic Significance pada baris Pearson Chi-Square: di bawah 0,05 berarti ada hubungan yang signifikan. Nilaimu ${ct.p<.001?'di bawah 0,001':c3(ct.p)}, jadi hubungan <b>${esc(rv.name)}</b> dan <b>${esc(cvv.name)}</b> <b>${ct.p<.05?'signifikan':'belum terbukti'}</b>.`+(ct.low/ct.cells>.2?' Perhatikan peringatan kuning di bawah tabel: syarat ujinya tidak terpenuhi, jadi kesimpulan ini jangan dipakai dulu.':''):'';
    out+=`<h5 id="sp-c">Crosstabs</h5>${okC?X(eC):''}`+(ct.rc.length>1&&ct.cc.length>1?`
    <div class="tt">Case Processing Summary</div><div class="tw"><table><tr><th rowspan="2"></th><th colspan="2">Valid</th><th colspan="2">Missing</th><th colspan="2">Total</th></tr><tr><th>N</th><th>Percent</th><th>N</th><th>Percent</th><th>N</th><th>Percent</th></tr>
      <tr><td>${esc(rv.name)} * ${esc(cvv.name)}</td><td class="n">${ct.N}</td><td class="n">${f1(ct.N/ct.total*100)}%</td><td class="n">${ct.total-ct.N}</td><td class="n">${f1((ct.total-ct.N)/ct.total*100)}%</td><td class="n">${ct.total}</td><td class="n">100.0%</td></tr></table></div>
    <div class="tt">${esc(rv.name)} * ${esc(cvv.name)} Crosstabulation</div><div class="tw"><table><tr><th colspan="3" rowspan="2"></th><th colspan="${ct.cc.length}">${esc(cvv.name)}</th><th rowspan="2">Total</th></tr><tr>${ct.cc.map(k=>`<th>${esc(k)}</th>`).join('')}</tr>
      ${ct.rc.map((c,i)=>`<tr>${i===0?`<td rowspan="${ct.rc.length*2}">${esc(rv.name)}</td>`:''}<td rowspan="2">${esc(c)}</td><td>Count</td>${ct.tab[i].map(v=>`<td class="n">${v}</td>`).join('')}<td class="n">${ct.rt[i]}</td></tr>
        <tr><td>% within ${esc(rv.name)}</td>${ct.tab[i].map(v=>`<td class="n">${f1(v/ct.rt[i]*100)}%</td>`).join('')}<td class="n">100.0%</td></tr>`).join('')}
      <tr><td colspan="2" rowspan="2">Total</td><td>Count</td>${ct.ct.map(v=>`<td class="n">${v}</td>`).join('')}<td class="n">${ct.N}</td></tr>
      <tr><td>% within ${esc(rv.name)}</td>${ct.ct.map(v=>`<td class="n">${f1(v/ct.N*100)}%</td>`).join('')}<td class="n">100.0%</td></tr></table></div>
    <div class="tt">Chi-Square Tests</div><div class="tw"><table><tr><th></th><th>Value</th><th>df</th><th>Asymptotic Significance (2-sided)</th></tr>
      <tr><td>Pearson Chi-Square</td><td class="n">${f3(ct.chi)}<sup>a</sup></td><td class="n">${ct.df}</td><td class="n">${sig(ct.p)}</td></tr>
      <tr><td>Likelihood Ratio</td><td class="n">${f3(ct.g2)}</td><td class="n">${ct.df}</td><td class="n">${sig(ct.pg)}</td></tr>
      <tr><td>N of Valid Cases</td><td class="n">${ct.N}</td><td></td><td></td></tr></table>
      <div class="fn">a. ${ct.low} cells (${f1(ct.low/ct.cells*100)}%) have expected count less than 5. The minimum expected count is ${f2(ct.minE)}.</div></div>
    ${ct.low/ct.cells>.2?`<p class="warn">Catatan Sajiin: lebih dari 20% sel bernilai harapan di bawah 5, jadi hasil chi-square ini tidak layak dipakai. Gabungkan kategori yang kecil atau pakai uji eksak.</p>`:''}`
    :'<p class="hint">Crosstab butuh minimal dua kategori terisi di baris dan di kolom.</p>')}

  /* Correlations */
  if(iv.length>=2){outline.push(['sp-r','Correlations']);
    const col=v=>rows.map(r=>v.get(r));const cs=iv.map(col);
    const pair=(a,b)=>{const x=[],y=[];for(let i=0;i<N;i++)if(cs[a][i]!=null&&cs[b][i]!=null){x.push(cs[a][i]);y.push(cs[b][i])}return a===b?{r:1,p:NaN,n:x.length}:pearson(x,y)};
    out+=`<h5 id="sp-r">Correlations</h5>${X(corrExp(iv,pair))}<div class="tt">Correlations</div><div class="tw"><table><tr><th colspan="2"></th>${iv.map(v=>`<th>${esc(v.name)}</th>`).join('')}</tr>
      ${iv.map((v,a)=>{const ps=iv.map((_,b)=>pair(a,b));return `<tr><td rowspan="3">${esc(v.name)}</td><td>Pearson Correlation</td>${ps.map((p,b)=>`<td class="n">${a===b?'1':isFinite(p.r)?f3(p.r).replace(/^(-?)0/,'$1')+(p.p<.01?'<sup>**</sup>':p.p<.05?'<sup>*</sup>':''):''}</td>`).join('')}</tr>
        <tr><td>Sig. (2-tailed)</td>${ps.map((p,b)=>`<td class="n">${a===b?'':sig(p.p)}</td>`).join('')}</tr><tr><td>N</td>${ps.map(p=>`<td class="n">${p.n}</td>`).join('')}</tr>`}).join('')}</table>
      <div class="fn">**. Correlation is significant at the 0.01 level (2-tailed).<br>*. Correlation is significant at the 0.05 level (2-tailed).</div></div>`;

    /* Reliability */
    const ok=[];for(let i=0;i<N;i++)if(cs.every(c=>c[i]!=null))ok.push(i);
    const cc=cs.map(c=>ok.map(i=>c[i])),n=ok.length,k=iv.length;
    outline.push(['sp-a','Reliability']);
    out+=`<h5 id="sp-a">Reliability</h5>`;
    if(n>=3){const al=alpha(cc),tot=ok.map((_,i)=>cc.reduce((a,c)=>a+c[i],0));
      out+=`${X(relExp(al,iv,cc,tot))}<div class="tt">Case Processing Summary</div><div class="tw"><table><tr><th colspan="2"></th><th>N</th><th>%</th></tr><tr><td rowspan="3">Cases</td><td>Valid</td><td class="n">${n}</td><td class="n">${f1(n/N*100)}</td></tr><tr><td>Excluded<sup>a</sup></td><td class="n">${N-n}</td><td class="n">${f1((N-n)/N*100)}</td></tr><tr><td>Total</td><td class="n">${N}</td><td class="n">100.0</td></tr></table><div class="fn">a. Listwise deletion based on all variables in the procedure.</div></div>
      <div class="tt">Reliability Statistics</div><div class="tw"><table><tr><th>Cronbach's Alpha</th><th>N of Items</th></tr><tr><td class="n">${f3(al).replace(/^0/,'')}</td><td class="n">${k}</td></tr></table></div>
      <div class="tt">Item-Total Statistics</div><div class="tw"><table><tr><th></th><th>Scale Mean if Item Deleted</th><th>Scale Variance if Item Deleted</th><th>Corrected Item-Total Correlation</th><th>Cronbach's Alpha if Item Deleted</th></tr>
      ${iv.map((v,j)=>{const rest=tot.map((t,i)=>t-cc[j][i]),others=cc.filter((_,x)=>x!==j);return `<tr><td>${esc(v.name)}</td><td class="n">${f2(mean(rest))}</td><td class="n">${f3(vari(rest))}</td><td class="n">${f3(pearson(cc[j],rest).r).replace(/^(-?)0/,'$1')}</td><td class="n">${k>2?f3(alpha(others)).replace(/^0/,''):'.'}</td></tr>`}).join('')}</table></div>`}
    else out+='<p class="hint">Reliabilitas butuh minimal tiga baris yang semua butirnya terisi.</p>';
  }
  if(!out)out='<p class="hint">Belum ada variabel yang dipilih. Centang variabel di panel atas.</p>';
  else out+='<p class="hint" style="margin-top:26px;max-width:640px">Cara hitung mengikuti SPSS: kategori diurutkan menaik menurut nilainya; Percent dari seluruh kasus dan Valid Percent dari kasus terisi; simpangan baku memakai pembagi n − 1; Correlations memakai pasangan terisi (pairwise); Reliability memakai kasus yang semua butirnya terisi (listwise); Chi-Square memakai kasus yang kedua variabelnya terisi.</p>';

  const sh=n=>{n=String(n);return esc(n.length>46?n.slice(0,44)+'…':n)};
  const pc=catLike.filter(v=>v.type==='cat'&&!v.derived).filter(v=>{const k=new Set(rows.map(r=>v.get(r)).filter(x=>x!=null)).size;return k>=2&&k<=15}),gs=itemGroups(nums);
  const E=t=>`<span class="ex"><i>Contoh di data ini</i> ${t}</span>`;
  const ex={
    f:pc.length?E(`centang “${sh(pc[0].name)}”${pc[1]?` dan “${sh(pc[1].name)}”`:''}. Hasilnya tabel yang memperlihatkan berapa responden di tiap pilihan, lengkap dengan persennya.`):'',
    d:gs.length?E(`centang semua butir ${esc(gs[0][0])} (${gs[0][1].length} butir). Hasilnya rata-rata tiap butir, jadi kamu tahu pernyataan mana yang paling disetujui responden.`):(nums[0]?E(`centang “${sh(nums[0].name)}”. Hasilnya rata-rata, nilai terkecil, dan nilai terbesarnya.`):''),
    c:pc.length>=2?E(`pilih baris “${sh(P.row||pc[0].name)}” dan kolom “${sh(P.col&&P.col!==P.row?P.col:pc[1].name)}”. Hasilnya memperlihatkan apakah jawaban di kolom berbeda antar kelompok di baris.`):'',
    r:gs.length?E(`klik tombol “Butir ${esc(gs[0][0])} saja” dan catat alpha-nya${gs[1]?`, lalu klik “Butir ${esc(gs[1][0])} saja”`:''}${gs[2]?`, lalu “Butir ${esc(gs[2][0])} saja”`:''}. Tiap variabel mendapat nilai alpha sendiri.`):''
  };
  el.innerHTML=`<div class="pv-bar"><b>Gaya SPSS · Output Viewer</b>
      <button class="pv-btn" data-dl="sp-sps">Syntax (.sps)</button><button class="pv-btn" data-dl="sp-data">Data untuk SPSS (.csv)</button><button class="pv-btn" data-dl="html">Output ini (.html)</button></div>
    <div class="pick noexp"><b>Pilih variabel</b>
      <section><h6>Frequencies <small>menghitung berapa orang di tiap pilihan</small></h6>
        <p class="how"><b>Centang</b> variabel yang isinya pilihan, seperti jenis kelamin, pekerjaan, atau jawaban ya/tidak. <b>Jangan centang</b> butir skala (X1.1, X1.2, dan seterusnya), kecuali kamu memang mau melihat sebaran jawaban satu butir. Isian bebas seperti nama tidak perlu.${ex.f}</p>
        <div class="q"><button data-q="freq|">Kosongkan</button><button data-q="freq|*">Centang semua</button></div>
        <div class="list">${chk('freq',catLike,P.freq)}</div></section>
      <section><h6>Descriptives <small>rata-rata dan sebaran</small></h6>
        <p class="how"><b>Centang</b> variabel angka yang wajar dirata-rata: butir skala, total skor, usia, atau penghasilan. <b>Jangan centang</b> angka yang sebenarnya kode kategori, misalnya 1 = laki-laki dan 2 = perempuan.${ex.d}</p>
        <div class="q"><button data-q="desc|">Kosongkan</button><button data-q="desc|*">Centang semua</button></div>
        <div class="list">${chk('desc',nums,P.desc)}</div></section>
      <section><h6>Crosstabs <small>membandingkan dua variabel pilihan</small></h6>
        <p class="how">Pilih satu variabel untuk <b>baris</b> dan satu untuk <b>kolom</b>, misalnya jenis kelamin dengan pekerjaan. Pilih variabel yang pilihannya sedikit. Biarkan “(tidak dipakai)” kalau tabel ini tidak kamu perlukan.${ex.c}</p>
        <div class="sel"><label>Baris <select data-sel="row">${opt(catLike,P.row)}</select></label><label>Kolom <select data-sel="col">${opt(catLike,P.col)}</select></label></div></section>
      <section><h6>Correlations dan Reliability <small>menguji butir kuesioner</small></h6>
        <p class="how"><b>Centang</b> hanya butir yang mengukur <b>satu variabel yang sama</b>, baca hasilnya, lalu ganti ke variabel berikutnya. Contoh: semua butir X1 dulu, kemudian X2, kemudian Y. <b>Jangan campur</b> butir X1 dengan X2 atau Y, karena nilai alpha gabungan tidak punya arti. Pertanyaan data diri juga jangan dicentang di sini.${ex.r}${P.items.length>12?' Yang dihitung hanya 12 butir pertama yang dicentang.':''}</p>
        <div class="q">${itemGroups(nums).map(g=>`<button class="main" data-q="items|${esc(g[0])}">Butir ${esc(g[0])} saja (${g[1].length})</button>`).join('')}<button data-q="items|">Kosongkan</button></div>
        <div class="list">${chk('items',nums.filter(v=>!v.derived),P.items)}</div></section></div>
    <div class="lay"><div class="out"><div class="h">Output</div>${outline.map(o=>`<div data-go="${o[0]}">${o[1]}</div>`).join('')}</div><div class="res">${I('Kapan pakai gaya SPSS?','Saat datamu berupa angka dan pilihan jawaban, misalnya hasil kuesioner. Gaya ini menjawab tiga hal: berapa banyak, berapa rata-ratanya, dan apakah dua hal saling berhubungan. Centang variabel di panel “Pilih variabel” untuk mengatur tabel yang muncul.')}${out}</div></div>`;
  el.querySelectorAll('[data-go]').forEach(d=>d.onclick=()=>$('#'+d.dataset.go).scrollIntoView({behavior:'smooth',block:'start'}));
  el.querySelectorAll('[data-grp]').forEach(c=>c.onchange=()=>{const g=c.dataset.grp;P[g]=[...el.querySelectorAll(`[data-grp="${g}"]:checked`)].map(x=>x.value);renderSP(rows)});
  el.querySelectorAll('[data-sel]').forEach(s=>s.onchange=()=>{P[s.dataset.sel]=s.value;renderSP(rows)});
  el.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const [g,k]=b.dataset.q.split('|');
    const pool={freq:catLike,desc:nums,items:nums.filter(v=>!v.derived)}[g].map(v=>v.name);
    P[g]=k==='*'?pool:k===''?[]:(itemGroups(nums).find(x=>x[0]===k)||[0,[]])[1];renderSP(rows)});
}

/* ---------- unduhan ---------- */
const RESERVED=new Set(['all','and','by','eq','ge','gt','le','lt','ne','not','or','to','with']);
function safeNames(){const used=new Set(['id']);return VARS.map(v=>{let s=v.name.normalize('NFD').replace(/[^A-Za-z0-9_]+/g,'_').replace(/^_+|_+$/g,'');if(!/^[A-Za-z]/.test(s))s='v_'+s;s=s.slice(0,40);if(RESERVED.has(s.toLowerCase()))s+='_';let b=s,i=2;while(used.has(s.toLowerCase()))s=b+'_'+i++;used.add(s.toLowerCase());return s})}
function spDownloads(kind,rows){
  if(S.spMeta!==META){S.spMeta=META;S.sp=defaults(rows)}
  const P=S.sp,names=safeNames(),nameOf=n=>names[VARS.findIndex(v=>v.name===n)],base=slug()+'-spss',enc=new TextEncoder();
  const vals=VARS.map(v=>rows.map(r=>{const x=v.get(r);return x==null?'':v.type==='num'?String(x):oneLine(x).slice(0,2000)}));
  if(kind==='sp-data'){dl(base+'.csv',toCSV([['id',...names],...rows.map((_,i)=>[i+1,...vals.map(c=>c[i])])]),'text/csv');return}
  const fmt=VARS.map((v,j)=>v.type==='num'?(vals[j].every(x=>x===''||/^-?\d+$/.test(x))?'F12.0':'F12.3'):'A'+Math.max(1,...vals[j].map(x=>enc.encode(x).length)));
  const q=s=>"'"+String(s).replace(/'/g,"''")+"'";
  const list=a=>a.map(nameOf).filter(Boolean).join(' ');
  const freq=list(P.freq),desc=list(P.desc),items=P.items.map(nameOf).filter(Boolean);
  dl(base+'.sps',`* Encoding: UTF-8.
* Dibuat oleh Sajiin untuk data: ${META.title}.
* 1) Unduh juga "${base}.csv". 2) Ganti jalur /FILE di bawah dengan lokasi file itu. 3) Run > All.

GET DATA
  /TYPE=TXT
  /FILE="${base}.csv"
  /ENCODING='UTF8'
  /DELCASE=LINE
  /DELIMITERS=","
  /QUALIFIER='"'
  /ARRANGEMENT=DELIMITED
  /FIRSTCASE=2
  /VARIABLES=
    id F8.0
${names.map((n,j)=>'    '+n+' '+fmt[j]).join('\n')}.
EXECUTE.

VARIABLE LABELS
  id 'Nomor baris'
${names.map((n,j)=>'  '+n+' '+q(VARS[j].name)).join('\n')}.
${freq?`
FREQUENCIES VARIABLES=${freq}
  /BARCHART FREQ
  /ORDER=ANALYSIS.
`:''}${desc?`
DESCRIPTIVES VARIABLES=${desc}
  /STATISTICS=MEAN STDDEV MIN MAX.
`:''}${nameOf(P.row)&&nameOf(P.col)&&P.row!==P.col?`
CROSSTABS
  /TABLES=${nameOf(P.row)} BY ${nameOf(P.col)}
  /STATISTICS=CHISQ
  /CELLS=COUNT ROW.
`:''}${items.length>=2?`
CORRELATIONS
  /VARIABLES=${items.join(' ')}
  /PRINT=TWOTAIL NOSIG
  /MISSING=PAIRWISE.

RELIABILITY
  /VARIABLES=${items.join(' ')}
  /SCALE('Skala') ALL
  /MODEL=ALPHA
  /SUMMARY=TOTAL.
`:''}`);
}
window.renderSPSS=renderSP; window.spssDownloads=spDownloads;
})();
