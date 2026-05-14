
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
const ORDERS = [
  { buyer:'㈜영신수산', product:'굴비 10kg × 5박스', status:'접수완료', statusColor:'var(--emerald)', dotColor:'#22d3ee', time:'방금' },
  { buyer:'해진식품', product:'갈치 5kg × 10박스', status:'처리중', statusColor:'var(--gold)', dotColor:'var(--gold)', time:'1분 전' },
  { buyer:'동해수산㈜', product:'새우 3kg × 20박스', status:'출고완료', statusColor:'#a78bfa', dotColor:'#a78bfa', time:'3분 전' },
  { buyer:'남해로컬푸드', product:'전복 1kg × 8박스', status:'배송중', statusColor:'var(--sky)', dotColor:'var(--sky)', time:'7분 전' },
  { buyer:'제주도청', product:'흑돼지 5kg × 12박스', status:'접수완료', statusColor:'var(--emerald)', dotColor:'#22d3ee', time:'12분 전' },
];

let pCurrent = 0;
let pTimer = null;
let pAnimTimer = null;
let autoFillVal = 0;
let autoFillTimer = null;

function goPStep(n) {
  clearInterval(pTimer);
  clearInterval(pAnimTimer);
  clearInterval(autoFillTimer);

  // 탭/점 업데이트
  document.querySelectorAll('.promo-nav-btn').forEach((b,i) => b.classList.toggle('active', i===n));
  document.querySelectorAll('.promo-dot-nav').forEach((d,i) => d.classList.toggle('active', i===n));

  // 스텝 전환
  document.querySelectorAll('.promo-step').forEach((s,i) => {
    s.classList.toggle('active', i===n);
    if (i===n) s.style.animation = 'none', requestAnimationFrame(() => { s.style.animation = ''; });
  });

  // 진행 바
  const bar = document.getElementById('promoProgBar');
  if (bar) bar.style.width = ((n+1)*25)+'%';

  pCurrent = n;

  // 스텝별 애니메이션
  if (n===0) runStep0();
  if (n===2) runStep2();
  if (n===3) runStep3();

  // 자동 전환
  pTimer = setInterval(() => goPStep((pCurrent+1)%4), 5000);
}

/* STEP 0: 주문 순차 등장 + 실시간 카운터 */
function runStep0() {
  const list = document.getElementById('orderList');
  if (!list) return;
  list.innerHTML = '';

  ORDERS.forEach((o,i) => {
    const div = document.createElement('div');
    div.className = 'pol-item';
    div.innerHTML = `
      <div class="pol-dot" style="background:${o.dotColor};box-shadow:0 0 6px ${o.dotColor}"></div>
      <div class="pol-buyer">${o.buyer}</div>
      <div class="pol-product">${o.product}</div>
      <span class="pol-status" style="background:${o.statusColor}22;border:1px solid ${o.statusColor}44;color:${o.statusColor}">${o.status}</span>
      <div class="pol-time">${o.time}</div>`;
    list.appendChild(div);
    setTimeout(() => div.classList.add('show'), i * 280);
  });

  // 실시간 카운터
  let cnt = 0; const target = 1284;
  const el = document.getElementById('liveOrderCount');
  pAnimTimer = setInterval(() => {
    cnt = Math.min(cnt + 42, target);
    if (el) el.textContent = cnt.toLocaleString();
    if (cnt >= target) { clearInterval(pAnimTimer); addNewOrder(); }
  }, 30);
}

/* 실시간 신규 주문 추가 */
const newOrders = [
  { buyer:'강원수산협동조합', product:'오징어 2kg × 15박스', status:'접수완료', statusColor:'var(--emerald)', dotColor:'#22d3ee', time:'방금' },
  { buyer:'목포수협', product:'세발낙지 1kg × 6박스', status:'접수완료', statusColor:'var(--emerald)', dotColor:'#22d3ee', time:'방금' },
];
let noIdx = 0;
function addNewOrder() {
  const list = document.getElementById('orderList');
  const el = document.getElementById('liveOrderCount');
  if (!list) return;
  setInterval(() => {
    const o = newOrders[noIdx++ % newOrders.length];
    const div = document.createElement('div');
    div.className = 'pol-item';
    div.innerHTML = `
      <div class="pol-dot" style="background:${o.dotColor};box-shadow:0 0 6px ${o.dotColor}"></div>
      <div class="pol-buyer">${o.buyer}</div>
      <div class="pol-product">${o.product}</div>
      <span class="pol-status" style="background:${o.statusColor}22;border:1px solid ${o.statusColor}44;color:${o.statusColor}">${o.status}</span>
      <div class="pol-time">${o.time}</div>`;
    list.insertBefore(div, list.firstChild);
    setTimeout(() => div.classList.add('show'), 50);
    // 오래된 항목 제거
    if (list.children.length > 5) list.removeChild(list.lastChild);
    // 카운터 +1
    if (el) el.textContent = (parseInt(el.textContent.replace(/,/g,''))+1).toLocaleString();
  }, 2200);
}

/* STEP 2: 금액 카운트업 */
function runStep2() {
  let v = 0; const target = 240000000;
  const el = document.getElementById('salesCount');
  pAnimTimer = setInterval(() => {
    v = Math.min(v + 8000000, target);
    if (el) el.textContent = '₩' + (v/100000000).toFixed(1) + '억';
    if (v >= target) clearInterval(pAnimTimer);
  }, 35);
}

/* STEP 3: 자동 발주서 진행 바 */
function runStep3() {
  autoFillVal = 0;
  const fill = document.getElementById('autoFill');
  const pct  = document.getElementById('autoPct');
  autoFillTimer = setInterval(() => {
    autoFillVal = Math.min(autoFillVal + 2, 100);
    if (fill) fill.style.width = autoFillVal + '%';
    if (pct)  pct.textContent  = autoFillVal + '%';
    if (autoFillVal >= 100) {
      clearInterval(autoFillTimer);
      if (pct) pct.textContent = '✅ 완료';
      // 재시작
      setTimeout(() => {
        autoFillVal = 0;
        if (fill) fill.style.width = '0%';
        if (pct)  pct.textContent  = '0%';
        runStep3();
      }, 1500);
    }
  }, 40);
}

/* 초기 시작 */
document.addEventListener('DOMContentLoaded', () => {
  goPStep(0);
});
