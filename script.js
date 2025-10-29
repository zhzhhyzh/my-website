// Theme cycler for moving gradients + manual light/dark toggle
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
toggle.addEventListener("click", () => {
  root.classList.toggle("light");
});

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

// Subtle tilt on hover (no library)
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

// iOS "liquid" orb animation
(function liquidOrb() {
  const wrapper = document.getElementById("liquid");
  if (!wrapper) return;
  const drops = Array.from(wrapper.querySelectorAll(".drop"));

  // Randomize initial positions to avoid uniform motion
  drops.forEach((d, i) => {
    d.style.setProperty("--phase", (Math.random() * Math.PI * 2).toFixed(3));
    d.style.left = d.style.left || `${10 + Math.random() * 70}%`;
    d.style.top = d.style.top || `${10 + Math.random() * 70}%`;
  });

  // Mouse attraction for more "real" liquid feel
  let mouse = { x: 0, y: 0, inside: false };
  wrapper.addEventListener("pointerenter", () => (mouse.inside = true));
  wrapper.addEventListener("pointerleave", () => (mouse.inside = false));
  wrapper.addEventListener("pointermove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  });

  // Animate drops with simple springy attraction
  function animate(t) {
    drops.forEach((d, i) => {
      const phase = parseFloat(getComputedStyle(d).getPropertyValue("--phase")) + 0.0025 * (i + 1);
      d.style.setProperty("--phase", phase.toString());
      const baseX = 0.5 + Math.sin(phase + i) * 0.18;
      const baseY = 0.5 + Math.cos(phase * 1.1 + i) * 0.18;
      let targetX = baseX, targetY = baseY;
      if (mouse.inside) {
        // Attract a bit toward mouse
        targetX = baseX * 0.8 + mouse.x * 0.2;
        targetY = baseY * 0.8 + mouse.y * 0.2;
      }
      d.style.left = `calc(${(targetX * 100).toFixed(2)}% - ${d.offsetWidth / 2}px)`;
      d.style.top  = `calc(${(targetY * 100).toFixed(2)}% - ${d.offsetHeight / 2}px)`;
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
