/* Sajiin — tabel HTML -> gambar PNG.
   Tabel digambar ulang ke kanvas dari ukuran, garis, warna, dan teks yang tampil di layar,
   jadi hasilnya sama di semua browser dan tidak butuh pustaka tambahan. */
window.tableToCanvas=function(table){
  const S=2,pad=12,tb=table.getBoundingClientRect(),W=Math.ceil(tb.width),H=Math.ceil(tb.height);
  const cv=document.createElement('canvas');cv.width=(W+pad*2)*S;cv.height=(H+pad*2)*S;
  const c=cv.getContext('2d');c.scale(S,S);c.fillStyle='#ffffff';c.fillRect(0,0,W+pad*2,H+pad*2);c.translate(pad-tb.left,pad-tb.top);
  const vis=col=>!!col&&col!=='transparent'&&!/rgba\([^)]*,\s*0\)$/.test(col);
  const cells=[...table.querySelectorAll('th,td')];

  // latar: baris dulu, lalu sel
  [...table.rows].forEach(tr=>{const bg=getComputedStyle(tr).backgroundColor;if(vis(bg)){const r=tr.getBoundingClientRect();c.fillStyle=bg;c.fillRect(r.left,r.top,r.width,r.height)}});
  cells.forEach(td=>{const bg=getComputedStyle(td).backgroundColor;if(vis(bg)){const r=td.getBoundingClientRect();c.fillStyle=bg;c.fillRect(r.left,r.top,r.width,r.height)}});

  // garis tiap sisi sel, lalu garis tabel
  const edge=el=>{const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    [['Top',r.left,r.top,r.right,r.top],['Bottom',r.left,r.bottom,r.right,r.bottom],['Left',r.left,r.top,r.left,r.bottom],['Right',r.right,r.top,r.right,r.bottom]].forEach(([s,x1,y1,x2,y2])=>{
      const w=parseFloat(cs['border'+s+'Width']),col=cs['border'+s+'Color'];
      if(w>0&&cs['border'+s+'Style']!=='none'&&vis(col)){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()}})};
  cells.forEach(edge);edge(table);

  // label bulat (pil) dan titik warnanya
  table.querySelectorAll('.pill').forEach(p=>{const cs=getComputedStyle(p),r=p.getBoundingClientRect(),rad=r.height/2;
    c.beginPath();c.roundRect?c.roundRect(r.left,r.top,r.width,r.height,rad):c.rect(r.left,r.top,r.width,r.height);
    if(vis(cs.backgroundColor)){c.fillStyle=cs.backgroundColor;c.fill()}
    c.strokeStyle=cs.borderTopColor;c.lineWidth=parseFloat(cs.borderTopWidth)||1;c.stroke();
    p.querySelectorAll('i').forEach(d=>{const q=d.getBoundingClientRect();c.fillStyle=getComputedStyle(d).backgroundColor;c.beginPath();c.arc(q.left+q.width/2,q.top+q.height/2,q.width/2,0,Math.PI*2);c.fill()})});

  // teks, kata demi kata di posisi aslinya (supaya baris yang terlipat tetap benar)
  const range=document.createRange(),tw=document.createTreeWalker(table,NodeFilter.SHOW_TEXT);
  c.textBaseline='middle';let n;
  while((n=tw.nextNode())){const el=n.parentElement;if(!el)continue;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none')continue;
    c.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;c.fillStyle=cs.color;
    const re=/\S+/g;let m;
    while((m=re.exec(n.data))){range.setStart(n,m.index);range.setEnd(n,m.index+m[0].length);const r=range.getBoundingClientRect();if(r.width)c.fillText(m[0],r.left,r.top+r.height/2+.5)}}
  return cv;
};
