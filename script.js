// Performance helpers (keep these)
const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(hover: none)').matches;
let pageVisible = true;
document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; });

// === Animated Background Themes (cycled) ===
const themes = [
  { name: "Sky", gradient: "radial-gradient(circle at 30% 30%, #6ec6ff33, transparent 60%), radial-gradient(circle at 70% 70%, #80d8ff33, transparent 60%)" },
  { name: "Halo", gradient: "radial-gradient(circle at 30% 40%, #c084fc33, transparent 60%), radial-gradient(circle at 70% 60%, #7c4dff33, transparent 60%)" },
  { name: "Dusk", gradient: "radial-gradient(circle at 30% 30%, #ff6e6e33, transparent 60%), radial-gradient(circle at 70% 70%, #ffb34733, transparent 60%)" }
];
// === Smooth Gradient Transition ===
let currentTheme = 0;
const bg = document.getElementById("background");
let nextTheme = 1;
let t = 0; // interpolation factor

function lerpColor(c1, c2, t) {
  // simple lerp between rgba() colors
  return `linear-gradient(120deg, ${c1} ${Math.round(t * 100)}%, ${c2} ${Math.round((1 - t) * 100)}%)`;
}

function animateGradient() {
  t += 0.0025; // smaller = slower transition
  if (t >= 1) {
    t = 0;
    currentTheme = nextTheme;
    nextTheme = (nextTheme + 1) % themes.length;
  }
  bg.style.transition = "background 4s ease-in-out";
  bg.style.background = themes[currentTheme].gradient;
  requestAnimationFrame(animateGradient);
}
animateGradient();


// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Light/Dark toggle
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");
toggle.addEventListener("click", () => root.classList.toggle("light"));

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  }
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Tilt on hover (desktop only)
if (!isTouch && !prefersReduce) {
  document.querySelectorAll(".tilt").forEach((card) => {
    let rect;
    const damp = 35;

    function update(e) {
      rect = rect || card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y - rect.height / 2) / damp);
      const ry = -((x - rect.width / 2) / damp);
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    function reset() {
      rect = null;
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
    card.addEventListener("mousemove", update, { passive: true });
    card.addEventListener("mouseleave", reset, { passive: true });
  });
}

// Magnetic buttons (desktop only)
if (!isTouch && !prefersReduce) {
  const magnets = document.querySelectorAll(".magnet");
  magnets.forEach(el => {
    const strength = 20;
    let rect;

    function move(e){
      rect = rect || el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      el.style.transform = `translate(${x/strength}px, ${y/strength}px)`;
    }
    function reset(){ rect=null; el.style.transform = "translate(0,0)"; }

    el.addEventListener("mousemove", move, { passive: true });
    el.addEventListener("mouseleave", reset, { passive: true });
  });
}


// iOS "liquid" orb animation with mouse attraction
(function liquidOrb() {
  if (prefersReduce) return;

  const wrapper = document.getElementById("liquid");
  if (!wrapper) return;
  const drops = Array.from(wrapper.querySelectorAll(".drop"));

  drops.forEach((d) => {
    d.style.setProperty("--phase", (Math.random() * Math.PI * 2).toFixed(3));
    d.style.left = d.style.left || `${10 + Math.random() * 70}%`;
    d.style.top  = d.style.top  || `${10 + Math.random() * 70}%`;
  });

  let mouse = { x: 0.5, y: 0.5, inside: false };
  wrapper.addEventListener("pointerenter", () => (mouse.inside = true), { passive: true });
  wrapper.addEventListener("pointerleave", () => (mouse.inside = false), { passive: true });
  wrapper.addEventListener("pointermove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  }, { passive: true });

  function animate() {
    if (!pageVisible) { requestAnimationFrame(animate); return; }

    drops.forEach((d, i) => {
      const phase = parseFloat(getComputedStyle(d).getPropertyValue("--phase")) + 0.0025 * (i + 1);
      d.style.setProperty("--phase", phase.toString());
      const baseX = 0.5 + Math.sin(phase + i) * 0.18;
      const baseY = 0.5 + Math.cos(phase * 1.1 + i) * 0.18;
      let targetX = baseX, targetY = baseY;
      if (mouse.inside) {
        targetX = baseX * 0.75 + mouse.x * 0.25;
        targetY = baseY * 0.75 + mouse.y * 0.25;
      }
      d.style.left = `calc(${(targetX * 100).toFixed(2)}% - ${d.offsetWidth / 2}px)`;
      d.style.top  = `calc(${(targetY * 100).toFixed(2)}% - ${d.offsetHeight / 2}px)`;
    });

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();


// Sparkles (parallax stars) on canvas — throttled
(function sparkles(){
  if (prefersReduce) return;

  const c = document.getElementById('sparkles');
  if(!c) return;
  const ctx = c.getContext('2d', { alpha: true });

  let w, h, stars, scale, last = 0;

  function resize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25); // cap res
    scale = dpr;
    w = Math.floor(window.innerWidth * 0.98);
    h = Math.floor(window.innerHeight * 0.98);
    c.width  = Math.max(1, w * scale);
    c.height = Math.max(1, h * scale);
    c.style.width  = w + 'px';
    c.style.height = h + 'px';
    ctx.setTransform(scale,0,0,scale,0,0);

    const target = Math.min(90, Math.floor((w*h)/26000)); // fewer stars
    stars = Array.from({length: target}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      z: Math.random()*0.8 + 0.2,
      r: Math.random()*1 + 0.25
    }));
  }

  function draw(ts){
    if (!pageVisible) { requestAnimationFrame(draw); return; }
    if (ts - last < 40) { requestAnimationFrame(draw); return; } // ~25fps
    last = ts;

    ctx.clearRect(0,0,w,h);
    const alphaBase = 0.5 + 0.5*Math.sin(Date.now()*0.0015);
    for(const s of stars){
      const parallaxX = (window.scrollY * 0.03) * s.z;
      ctx.globalAlpha = alphaBase;
      ctx.beginPath();
      ctx.arc((s.x + parallaxX) % w, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = "#c7d7ff";
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', debounce(resize, 150), { passive: true });
  resize();
  requestAnimationFrame(draw);
})();
function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; }


// Scroll progress (no listener leak)
(function progress(){
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function updateMax(){ max = Math.max(1, document.body.scrollHeight - window.innerHeight); }
  let max = 1;

  function update(){ bar.style.width = `${(window.scrollY / max) * 100}%`; }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => { updateMax(); update(); }, { passive: true });

  updateMax(); update();
})();

// === Mobile menu open/close ===
(function mobileMenu(){
  const menu = document.getElementById('mobileMenu');
  const scrim = document.getElementById('scrim');
  const btnOpen = document.getElementById('menuToggle');
  const btnClose = document.getElementById('menuClose');

  if(!menu || !btnOpen || !scrim) return;

  function open() {
    menu.dataset.open = "true";
    scrim.hidden = false;
    document.body.classList.add('menu-open');
    btnOpen.setAttribute('aria-expanded', 'true');
  }
  function close() {
    delete menu.dataset.open;
    scrim.hidden = true;
    document.body.classList.remove('menu-open');
    btnOpen.setAttribute('aria-expanded', 'false');
  }

  btnOpen.addEventListener('click', open);
  btnClose?.addEventListener('click', close);
  scrim.addEventListener('click', close);

  // close when a link is tapped
  menu.querySelectorAll('a[href^="#"], a[target="_blank"]').forEach(a=>{
    a.addEventListener('click', close);
  });

  // close with Escape
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
})();


// Close mobile menu whenever we switch to desktop width
(function () {
  const mq = window.matchMedia('(min-width: 901px)');
  const menu = document.getElementById('mobileMenu');
  const scrim = document.getElementById('scrim');
  const btnOpen = document.getElementById('menuToggle');

  function closeMenu() {
    if (!menu) return;
    delete menu.dataset.open;
    if (scrim) scrim.hidden = true;
    document.body.classList.remove('menu-open');
    if (btnOpen) btnOpen.setAttribute('aria-expanded', 'false');
  }

  // If page loads already wide, ensure it's closed
  if (mq.matches) closeMenu();

  // When crossing to desktop, close it
  mq.addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });
})();
