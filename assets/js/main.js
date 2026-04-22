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
