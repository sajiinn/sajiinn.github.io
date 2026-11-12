/* Sajiin — penyajian statistik bergaya SPSS untuk variabel apa pun.
   Memakai global dari index.html (VARS, META, HAS_TEXT, count, esc) dan PENH dari penyajian.js. */
(function(){
const {dl,toCSV,slug,oneLine,f1,f2,f3,S}=window.PENH;
const $=s=>document.querySelector(s);

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

/* ---------- pilihan variabel ---------- */
const byName=n=>VARS.find(v=>v.name===n);
function lowCard(v,rows){if(v.type!=='num')return false;return new Set(rows.map(r=>v.get(r)).filter(x=>x!=null)).size<=10}
function choices(rows){
  const cats=VARS.filter(v=>v.type==='cat'), nums=VARS.filter(v=>v.type==='num');
  const catLike=[...cats.filter(v=>!v.derived),...cats.filter(v=>v.derived),...nums.filter(v=>!v.derived&&lowCard(v,rows))];
  return {catLike,nums};
}
function defaults(rows){
  const {catLike,nums}=choices(rows), realCats=catLike.filter(v=>v.type==='cat');
  const usable=realCats.filter(v=>{const k=new Set(rows.map(r=>v.get(r)).filter(x=>x!=null)).size;return k>=2&&k<=15});
  const likert=nums.filter(v=>!v.derived&&lowCard(v,rows)&&rows.every(r=>{const x=v.get(r);return x==null||(Number.isInteger(x)&&x>=0&&x<=10)}));
  const items=(likert.length>=2?likert:nums.filter(v=>!v.derived)).slice(0,8);
  const senti=byName('Sentimen');
  return {freq:usable.slice(0,3).map(v=>v.name),desc:nums.slice(0,10).map(v=>v.name),items:items.map(v=>v.name),
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
  const fv=P.freq.map(byName).filter(Boolean),dv=P.desc.map(byName).filter(Boolean),iv=P.items.map(byName).filter(Boolean).slice(0,10);
  const rv=byName(P.row),cvv=byName(P.col);
  const chk=(grp,list,sel)=>list.map(v=>`<label><input type="checkbox" data-grp="${grp}" value="${esc(v.name)}"${sel.includes(v.name)?' checked':''}> ${esc(v.name)}</label>`).join('')||'<span class="hint">Tidak ada variabel yang cocok.</span>';
  const opt=(list,sel)=>'<option value="">(tidak dipakai)</option>'+list.map(v=>`<option${v.name===sel?' selected':''}>${esc(v.name)}</option>`).join('');
  let out='',outline=[];

  /* Frequencies */
  if(fv.length){outline.push(['sp-f','Frequencies']);
    out+=`<h5 id="sp-f">Frequencies</h5><div class="tt">Statistics</div><div class="tw"><table><tr><th colspan="2"></th>${fv.map(v=>`<th>${esc(v.name)}</th>`).join('')}</tr>
      <tr><td rowspan="2">N</td><td>Valid</td>${fv.map(v=>`<td class="n">${rows.filter(r=>v.get(r)!=null).length}</td>`).join('')}</tr>
      <tr><td>Missing</td>${fv.map(v=>`<td class="n">${rows.filter(r=>v.get(r)==null).length}</td>`).join('')}</tr></table></div>`+fv.map(v=>freqHTML(v,rows)).join('');
    const v=fv[0],c=catOrder(v,rows.map(r=>v.get(r)).filter(x=>x!=null),10,true),bmax=Math.max(1,...c.map(x=>x[1])),step=Math.pow(10,Math.floor(Math.log10(bmax))),top=Math.ceil(bmax/step)*step,bw=380/c.length;
    out+=`<div class="tt" style="text-align:left;margin-top:18px">Bar Chart</div><svg viewBox="0 0 460 290" style="max-width:480px" role="img" aria-label="Bar chart ${esc(v.name)}"><rect x="60" y="20" width="380" height="210" fill="#f0f0f0" stroke="#000" stroke-width=".8"/>
      ${[0,1,2,3,4].map(i=>`<line x1="55" x2="60" y1="${230-i*52.5}" y2="${230-i*52.5}" stroke="#000"/><text x="50" y="${234-i*52.5}" text-anchor="end" font-size="11">${Math.round(top*i/4)}</text>`).join('')}
      ${c.map((x,i)=>`<g><title>${esc(x[0])}: ${x[1]}</title><rect x="${60+i*bw+bw*.2}" y="${230-x[1]/top*210}" width="${bw*.6}" height="${x[1]/top*210}" fill="#3a6ea5" stroke="#000" stroke-width=".6"/><text x="${60+i*bw+bw/2}" y="246" text-anchor="middle" font-size="${c.length>6?9.5:11.5}">${esc(String(x[0]).slice(0,c.length>6?8:14))}</text></g>`).join('')}
      <text x="250" y="274" text-anchor="middle" font-size="12" font-weight="700">${esc(v.name)}</text><text transform="translate(16 125) rotate(-90)" text-anchor="middle" font-size="12" font-weight="700">Frequency</text></svg>`}

  /* Descriptives */
  if(dv.length){outline.push(['sp-d','Descriptives']);
    const listN=rows.filter(r=>dv.every(v=>v.get(r)!=null)).length;
    out+=`<h5 id="sp-d">Descriptives</h5><div class="tt">Descriptive Statistics</div><div class="tw"><table><tr><th></th><th>N</th><th>Minimum</th><th>Maximum</th><th>Mean</th><th>Std. Deviation</th></tr>
      ${dv.map(v=>{const a=rows.map(r=>v.get(r)).filter(x=>x!=null);return a.length?`<tr><td>${esc(v.name)}</td><td class="n">${a.length}</td><td class="n">${numFmt(Math.min(...a))}</td><td class="n">${numFmt(Math.max(...a))}</td><td class="n">${f2(mean(a))}</td><td class="n">${f3(Math.sqrt(vari(a)))}</td></tr>`:`<tr><td>${esc(v.name)}</td><td class="n">0</td><td></td><td></td><td></td><td></td></tr>`}).join('')}
      <tr><td>Valid N (listwise)</td><td class="n">${listN}</td><td></td><td></td><td></td><td></td></tr></table></div>`}

  /* Crosstabs */
  if(rv&&cvv&&rv!==cvv){const ct=crosstab(rows,rv,cvv);outline.push(['sp-c','Crosstabs']);
    out+=`<h5 id="sp-c">Crosstabs</h5>`+(ct.rc.length>1&&ct.cc.length>1?`
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
    out+=`<h5 id="sp-r">Correlations</h5><div class="tt">Correlations</div><div class="tw"><table><tr><th colspan="2"></th>${iv.map(v=>`<th>${esc(v.name)}</th>`).join('')}</tr>
      ${iv.map((v,a)=>{const ps=iv.map((_,b)=>pair(a,b));return `<tr><td rowspan="3">${esc(v.name)}</td><td>Pearson Correlation</td>${ps.map((p,b)=>`<td class="n">${a===b?'1':isFinite(p.r)?f3(p.r).replace(/^(-?)0/,'$1')+(p.p<.01?'<sup>**</sup>':p.p<.05?'<sup>*</sup>':''):''}</td>`).join('')}</tr>
        <tr><td>Sig. (2-tailed)</td>${ps.map((p,b)=>`<td class="n">${a===b?'':sig(p.p)}</td>`).join('')}</tr><tr><td>N</td>${ps.map(p=>`<td class="n">${p.n}</td>`).join('')}</tr>`}).join('')}</table>
      <div class="fn">**. Correlation is significant at the 0.01 level (2-tailed).<br>*. Correlation is significant at the 0.05 level (2-tailed).</div></div>`;

    /* Reliability */
    const ok=[];for(let i=0;i<N;i++)if(cs.every(c=>c[i]!=null))ok.push(i);
    const cc=cs.map(c=>ok.map(i=>c[i])),n=ok.length,k=iv.length;
    outline.push(['sp-a','Reliability']);
    out+=`<h5 id="sp-a">Reliability</h5>`;
    if(n>=3){const al=alpha(cc),tot=ok.map((_,i)=>cc.reduce((a,c)=>a+c[i],0));
      out+=`<div class="tt">Case Processing Summary</div><div class="tw"><table><tr><th colspan="2"></th><th>N</th><th>%</th></tr><tr><td rowspan="3">Cases</td><td>Valid</td><td class="n">${n}</td><td class="n">${f1(n/N*100)}</td></tr><tr><td>Excluded<sup>a</sup></td><td class="n">${N-n}</td><td class="n">${f1((N-n)/N*100)}</td></tr><tr><td>Total</td><td class="n">${N}</td><td class="n">100.0</td></tr></table><div class="fn">a. Listwise deletion based on all variables in the procedure.</div></div>
      <div class="tt">Reliability Statistics</div><div class="tw"><table><tr><th>Cronbach's Alpha</th><th>N of Items</th></tr><tr><td class="n">${f3(al).replace(/^0/,'')}</td><td class="n">${k}</td></tr></table></div>
      <div class="tt">Item-Total Statistics</div><div class="tw"><table><tr><th></th><th>Scale Mean if Item Deleted</th><th>Scale Variance if Item Deleted</th><th>Corrected Item-Total Correlation</th><th>Cronbach's Alpha if Item Deleted</th></tr>
      ${iv.map((v,j)=>{const rest=tot.map((t,i)=>t-cc[j][i]),others=cc.filter((_,x)=>x!==j);return `<tr><td>${esc(v.name)}</td><td class="n">${f2(mean(rest))}</td><td class="n">${f3(vari(rest))}</td><td class="n">${f3(pearson(cc[j],rest).r).replace(/^(-?)0/,'$1')}</td><td class="n">${k>2?f3(alpha(others)).replace(/^0/,''):'.'}</td></tr>`}).join('')}</table></div>`}
    else out+='<p class="hint">Reliabilitas butuh minimal tiga baris yang semua butirnya terisi.</p>';
  }
  if(!out)out='<p class="hint">Belum ada variabel yang dipilih. Centang variabel di panel atas.</p>';
  else out+='<p class="hint" style="margin-top:26px;max-width:640px">Cara hitung mengikuti SPSS: kategori diurutkan menaik menurut nilainya; Percent dari seluruh kasus dan Valid Percent dari kasus terisi; simpangan baku memakai pembagi n − 1; Correlations memakai pasangan terisi (pairwise); Reliability memakai kasus yang semua butirnya terisi (listwise); Chi-Square memakai kasus yang kedua variabelnya terisi.</p>';

  el.innerHTML=`<div class="pv-bar"><b>Gaya SPSS · Output Viewer</b>
      <button class="pv-btn" data-dl="sp-sps">Syntax (.sps)</button><button class="pv-btn" data-dl="sp-data">Data untuk SPSS (.csv)</button><button class="pv-btn" data-dl="html">Output ini (.html)</button></div>
    <div class="pick noexp"><b>Pilih variabel</b>
      <div><span>Frequencies</span>${chk('freq',catLike,P.freq)}</div>
      <div><span>Descriptives</span>${chk('desc',nums,P.desc)}</div>
      <div><span>Crosstabs</span><label>Baris <select data-sel="row">${opt(catLike,P.row)}</select></label><label>Kolom <select data-sel="col">${opt(catLike,P.col)}</select></label></div>
      <div><span>Correlations dan Reliability</span>${chk('items',nums.filter(v=>!v.derived),P.items)}</div></div>
    <div class="lay"><div class="out"><div class="h">Output</div>${outline.map(o=>`<div data-go="${o[0]}">${o[1]}</div>`).join('')}</div><div class="res">${out}</div></div>`;
  el.querySelectorAll('[data-go]').forEach(d=>d.onclick=()=>$('#'+d.dataset.go).scrollIntoView({behavior:'smooth',block:'start'}));
  el.querySelectorAll('[data-grp]').forEach(c=>c.onchange=()=>{const g=c.dataset.grp;P[g]=[...el.querySelectorAll(`[data-grp="${g}"]:checked`)].map(x=>x.value);renderSP(rows)});
  el.querySelectorAll('[data-sel]').forEach(s=>s.onchange=()=>{P[s.dataset.sel]=s.value;renderSP(rows)});
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
