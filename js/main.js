
/* ═══ CUSTOM CURSOR ═══ */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.left=mx+'px';cursor.style.top=my+'px';
});
(function animRing(){
  rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
  cursorRing.style.left=rx+'px';cursorRing.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('button,a,.platform-card,.vv-card,.ws-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cursor.style.transform='translate(-50%,-50%) scale(2.5)';
    cursorRing.style.transform='translate(-50%,-50%) scale(1.5)';
    cursorRing.style.opacity='0.3';
  });
  el.addEventListener('mouseleave',()=>{
    cursor.style.transform='translate(-50%,-50%) scale(1)';
    cursorRing.style.transform='translate(-50%,-50%) scale(1)';
    cursorRing.style.opacity='0.6';
  });
});

/* ═══ PARTICLES ═══ */
const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
let W,H,particles=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
resize();
window.addEventListener('resize',resize);
const isDark=()=>document.documentElement.getAttribute('data-theme')==='dark';
for(let i=0;i<60;i++){
  particles.push({
    x:Math.random()*window.innerWidth,
    y:Math.random()*window.innerHeight,
    r:Math.random()*1.5+0.3,
    vx:(Math.random()-0.5)*0.3,
    vy:(Math.random()-0.5)*0.3,
    o:Math.random()*0.5+0.1,
    color:['#f5c842','#00e5a0','#38bdf8'][Math.floor(Math.random()*3)]
  });
}
function drawParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=W;if(p.x>W)p.x=0;
    if(p.y<0)p.y=H;if(p.y>H)p.y=0;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=p.color;ctx.globalAlpha=isDark()?p.o:p.o*0.4;
    ctx.fill();
    // glow
    ctx.shadowBlur=8;ctx.shadowColor=p.color;
    ctx.fill();
    ctx.shadowBlur=0;ctx.globalAlpha=1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ═══ THEME TOGGLE ═══ */
function toggleTheme(){
  const html=document.documentElement;
  const isDarkNow=html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme',isDarkNow?'light':'dark');
  document.getElementById('themeIcon').textContent=isDarkNow?'☀️':'🌙';
  localStorage.setItem('yuan-theme',isDarkNow?'light':'dark');
}
// restore
const saved=localStorage.getItem('yuan-theme');
if(saved){
  document.documentElement.setAttribute('data-theme',saved);
  document.getElementById('themeIcon').textContent=saved==='light'?'☀️':'🌙';
}

/* ═══ RIPPLE ═══ */
function addRipple(e,btn){
  const r=document.createElement('span');
  r.className='btn-ripple';
  const rect=btn.getBoundingClientRect();
  r.style.left=(e.clientX-rect.left)+'px';
  r.style.top=(e.clientY-rect.top)+'px';
  btn.appendChild(r);
  setTimeout(()=>r.remove(),700);
}

/* ═══ SMOOTH SCROLL ═══ */
function scrollTo(id){
  document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ═══ MOBILE DRAWER ═══ */
function openDrawer(){document.getElementById('mobileDrawer').classList.add('open')}
function closeDrawer(){document.getElementById('mobileDrawer').classList.remove('open')}

/* ═══ SCROLL REVEAL ═══ */
const revealEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const ro=new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      setTimeout(()=>entry.target.classList.add('vis'),i*80);
      ro.unobserve(entry.target);
    }
  });
},{threshold:0.1});
revealEls.forEach(el=>ro.observe(el));

/* ═══ COUNTER ANIMATION ═══ */
const counters=document.querySelectorAll('[data-target]');
const co=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el=entry.target;
      const target=+el.getAttribute('data-target');
      let start=0;const dur=1800;let startTime=null;
      function step(ts){
        if(!startTime)startTime=ts;
        const prog=Math.min((ts-startTime)/dur,1);
        const ease=1-Math.pow(1-prog,4);
        el.textContent=Math.floor(ease*target);
        if(prog<1)requestAnimationFrame(step);
        else el.textContent=target;
      }
      requestAnimationFrame(step);
      co.unobserve(el);
    }
  });
},{threshold:0.5});
counters.forEach(el=>co.observe(el));

/* ═══ NAV SCROLL ═══ */
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('mainNav');
  if(window.scrollY>60){
    nav.style.boxShadow='0 4px 30px rgba(0,0,0,0.3)';
  }else{
    nav.style.boxShadow='none';
  }
});

/* ═══ EMAIL FORM ═══ */
function sendEmail(e, btn) {
  addRipple(e, btn);
  const type    = document.getElementById('inquiryType')?.value || '';
  const name    = document.getElementById('senderName')?.value.trim() || '';
  const email   = document.getElementById('senderEmail')?.value.trim() || '';
  const content = document.getElementById('inquiryContent')?.value.trim() || '';

  if (!name) { alert('업체명 / 성함을 입력해주세요.'); return; }
  if (!email || !email.includes('@')) { alert('올바른 이메일 주소를 입력해주세요.'); return; }
  if (!content) { alert('문의 내용을 입력해주세요.'); return; }

  const subject = encodeURIComponent(`[유안 F&B] ${type} — ${name}`);
  const body = encodeURIComponent(
    `문의 유형: ${type}\n업체명/성함: ${name}\n연락처 이메일: ${email}\n\n문의 내용:\n${content}`
  );
  window.location.href = `mailto:tarry9653@daum.net?subject=${subject}&body=${body}`;

  // 성공 메시지
  setTimeout(() => {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
  }, 800);
}

// 폼 입력 포커스 효과
document.querySelectorAll('input,textarea,select').forEach(el => {
  el.addEventListener('focus', () => { el.style.borderColor = 'var(--gold)'; el.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.1)'; });
  el.addEventListener('blur',  () => { el.style.borderColor = ''; el.style.boxShadow = ''; });
});
document.querySelectorAll('.btn-glow').forEach(btn=>{
  btn.addEventListener('mousedown',()=>{btn.style.transform='scale(0.93)'});
  btn.addEventListener('mouseup',()=>{btn.style.transform=''});
  btn.addEventListener('mouseleave',()=>{btn.style.transform=''});
});


/* ══ PROMO 애니메이션 ══ */
const ORDERS=[
  {buyer:'㈜영신수산',product:'굴비 10kg × 5박스',status:'접수완료',sc:'#00e5a0',dc:'#00e5a0',time:'방금'},
  {buyer:'해진식품',product:'갈치 5kg × 10박스',status:'처리중',sc:'#f5c842',dc:'#f5c842',time:'1분 전'},
  {buyer:'동해수산㈜',product:'새우 3kg × 20박스',status:'출고완료',sc:'#a78bfa',dc:'#a78bfa',time:'3분 전'},
  {buyer:'남해로컬푸드',product:'전복 1kg × 8박스',status:'배송중',sc:'#38bdf8',dc:'#38bdf8',time:'7분 전'},
  {buyer:'제주도청',product:'흑돼지 5kg × 12박스',status:'접수완료',sc:'#00e5a0',dc:'#00e5a0',time:'12분 전'},
];
const NEW_ORDERS=[
  {buyer:'강원수산협동조합',product:'오징어 2kg × 15박스',status:'접수완료',sc:'#00e5a0',dc:'#00e5a0',time:'방금'},
  {buyer:'목포수협',product:'세발낙지 1kg × 6박스',status:'접수완료',sc:'#00e5a0',dc:'#00e5a0',time:'방금'},
];
let pCurrent=0,pTimer=null,pAnimTimer=null,autoFillTimer=null,noIdx=0,newOrderTimer=null;

function goPStep(n){
  clearInterval(pTimer);clearInterval(pAnimTimer);clearInterval(autoFillTimer);clearInterval(newOrderTimer);
  // 탭/점 업데이트
  document.querySelectorAll('.promo-nav-btn').forEach((b,i)=>b.classList.toggle('active',i===n));
  document.querySelectorAll('.promo-dot-nav').forEach((d,i)=>d.classList.toggle('active',i===n));
  // 스텝 전환
  document.querySelectorAll('.promo-step').forEach((s,i)=>{
    if(i===n){s.style.display='grid';}
    else{s.style.display='none';}
  });
  // 진행바
  const bar=document.getElementById('promoProgBar');
  if(bar) bar.style.width=((n+1)*25)+'%';
  pCurrent=n;
  // 스텝별 애니메이션
  setTimeout(()=>{
    if(n===0) runStep0();
    if(n===1) runStep1();
    if(n===2) runStep2();
    if(n===3) runStep3();
  },50);
  pTimer=setInterval(()=>goPStep((pCurrent+1)%4),5000);
}

/* STEP 0: 주문 순차 등장 + 라이브 카운터 */
function makeOrderEl(o){
  const d=document.createElement('div');
  d.style.cssText='display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);margin-bottom:6px;opacity:0;transition:opacity 0.4s,transform 0.4s;transform:translateX(-12px)';
  d.innerHTML=`
    <div style="width:7px;height:7px;min-width:7px;border-radius:50%;background:${o.dc};box-shadow:0 0 6px ${o.dc};flex-shrink:0"></div>
    <div style="flex:1;min-width:0;font-size:12px;font-weight:700;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.buyer}</div>
    <div style="font-size:11px;color:#94a3b8;flex:1;min-width:0;display:none" class="pol-prod">${o.product}</div>
    <span style="font-size:10px;font-weight:800;padding:3px 8px;border-radius:20px;background:${o.sc}22;border:1px solid ${o.sc}55;color:${o.sc};flex-shrink:0;white-space:nowrap">${o.status}</span>
    <div style="font-size:10px;color:#475569;flex-shrink:0;white-space:nowrap">${o.time}</div>`;
  return d;
}
function runStep0(){
  const list=document.getElementById('orderList');
  if(!list) return;
  list.innerHTML='';
  ORDERS.forEach((o,i)=>{
    const d=makeOrderEl(o);
    list.appendChild(d);
    setTimeout(()=>{d.style.opacity='1';d.style.transform='translateX(0)'},i*280);
  });
  let cnt=0; const target=1284;
  const el=document.getElementById('liveOrderCount');
  pAnimTimer=setInterval(()=>{
    cnt=Math.min(cnt+42,target);
    if(el) el.textContent=cnt.toLocaleString();
    if(cnt>=target){clearInterval(pAnimTimer);startNewOrders();}
  },30);
}
let newOrderRunning=false;
function startNewOrders(){
  if(newOrderRunning) return;
  newOrderRunning=true;
  const list=document.getElementById('orderList');
  const el=document.getElementById('liveOrderCount');
  newOrderTimer=setInterval(()=>{
    if(!document.getElementById('pstep-0') || document.getElementById('pstep-0').style.display==='none'){
      newOrderRunning=false; return;
    }
    const o=NEW_ORDERS[noIdx++%NEW_ORDERS.length];
    const d=makeOrderEl(o);
    d.style.opacity='0'; d.style.transform='translateX(-12px)';
    if(list){list.insertBefore(d,list.firstChild);setTimeout(()=>{d.style.opacity='1';d.style.transform='translateX(0)'},50);}
    if(list && list.children.length>5) list.removeChild(list.lastChild);
    if(el) el.textContent=(parseInt(el.textContent.replace(/,/g,''))+1).toLocaleString();
  },2200);
}

/* STEP 1: 상품 바 JS로 직접 애니메이션 */
function runStep1(){
  const items=document.querySelectorAll('.ppi');
  items.forEach((item,i)=>{
    item.style.opacity='0'; item.style.transform='translateX(10px)';
    const bar=item.querySelector('.ppi-b');
    if(bar) bar.style.width='0';
    setTimeout(()=>{
      item.style.opacity='1'; item.style.transform='translateX(0)';
      setTimeout(()=>{ if(bar) bar.style.width=item.dataset.w; },200);
    },i*200);
  });
}

/* STEP 2: 차트 바 + 카운트업 JS로 직접 */
function runStep2(){
  // 바 차트
  const bars=document.querySelectorAll('.cb');
  bars.forEach((b,i)=>{
    b.style.height='0';
    setTimeout(()=>{ b.style.height=b.dataset.h; },i*100+50);
  });
  // 카운트업
  let v=0; const target=240000000;
  const el=document.getElementById('salesCount');
  pAnimTimer=setInterval(()=>{
    v=Math.min(v+8000000,target);
    if(el) el.textContent='₩'+(v/100000000).toFixed(1)+'억';
    if(v>=target) clearInterval(pAnimTimer);
  },35);
}

/* STEP 3: 자동 발주서 진행바 */
function runStep3(){
  let val=0;
  const fill=document.getElementById('autoFill');
  const pct=document.getElementById('autoPct');
  if(fill) fill.style.width='0%';
  if(pct) pct.textContent='0%';
  autoFillTimer=setInterval(()=>{
    val=Math.min(val+2,100);
    if(fill) fill.style.width=val+'%';
    if(pct) pct.textContent=val+'%';
    if(val>=100){
      clearInterval(autoFillTimer);
      if(pct) pct.textContent='✅ 완료';
      setTimeout(()=>{runStep3();},1500);
    }
  },40);
}

document.addEventListener('DOMContentLoaded',()=>{
  // 초기 상태: 모든 스텝 숨김
  document.querySelectorAll('.promo-step').forEach(s=>s.style.display='none');
  goPStep(0);
});
