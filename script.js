// === Animated Background Themes (cycled) ===
const themes = [
  { name: "Sky", gradient: "radial-gradient(circle at 30% 30%, #6ec6ff33, transparent 60%), radial-gradient(circle at 70% 70%, #80d8ff33, transparent 60%)" },
  { name: "Halo", gradient: "radial-gradient(circle at 30% 40%, #c084fc33, transparent 60%), radial-gradient(circle at 70% 60%, #7c4dff33, transparent 60%)" },
  { name: "Dusk", gradient: "radial-gradient(circle at 30% 30%, #ff6e6e33, transparent 60%), radial-gradient(circle at 70% 70%, #ffb34733, transparent 60%)" }
];
let currentTheme = 0;
const bg = document.getElementById("background");
setInterval(() => {
  currentTheme = (currentTheme + 1) % themes.length;
  bg.style.background = themes[currentTheme].gradient;
}, 10000);

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

// Tilt on hover
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
  card.addEventListener("mousemove", update);
  card.addEventListener("mouseleave", reset);
});

// Magnetic buttons
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
  el.addEventListener("mousemove", move);
  el.addEventListener("mouseleave", reset);
});

// iOS "liquid" orb animation with mouse attraction
(function liquidOrb() {
  const wrapper = document.getElementById("liquid");
  if (!wrapper) return;
  const drops = Array.from(wrapper.querySelectorAll(".drop"));
  drops.forEach((d, i) => {
    d.style.setProperty("--phase", (Math.random() * Math.PI * 2).toFixed(3));
    d.style.left = d.style.left || `${10 + Math.random() * 70}%`;
    d.style.top = d.style.top || `${10 + Math.random() * 70}%`;
  });
  let mouse = { x: 0.5, y: 0.5, inside: false };
  wrapper.addEventListener("pointerenter", () => (mouse.inside = true));
  wrapper.addEventListener("pointerleave", () => (mouse.inside = false));
  wrapper.addEventListener("pointermove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  });
  function animate() {
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

// Sparkles (parallax stars) on canvas
(function sparkles(){
  const c = document.getElementById('sparkles');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w, h, stars;
  function resize(){
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    stars = Array.from({length: Math.min(140, Math.floor((w*h)/18000))}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      z: Math.random()*0.8 + 0.2,
      r: Math.random()*1.2 + 0.3
    }));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      const parallaxX = (window.scrollY * 0.03) * s.z;
      ctx.globalAlpha = 0.5 + 0.5*Math.sin((s.x+s.y+Date.now()/700)*0.01);
      ctx.beginPath();
      ctx.arc((s.x+parallaxX)%w, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = "#c7d7ff";
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize(); draw();
})();

// Scroll progress
(function progress(){
  const bar = document.getElementById('scrollProgress');
  const max = document.body.scrollHeight - window.innerHeight;
  function update(){ bar.style.width = `${(window.scrollY / max) * 100}%`; }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', progress);
  update();
})();
