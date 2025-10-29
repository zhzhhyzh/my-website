const themes = [
  { name: "Sky", gradient: "radial-gradient(circle at 30% 30%, #6ec6ff33, transparent 60%), radial-gradient(circle at 70% 70%, #80d8ff33, transparent 60%)" },
  { name: "Halo", gradient: "radial-gradient(circle at 30% 40%, #c084fc33, transparent 60%), radial-gradient(circle at 70% 60%, #7c4dff33, transparent 60%)" },
  { name: "Dusk", gradient: "radial-gradient(circle at 30% 30%, #ff6e6e33, transparent 60%), radial-gradient(circle at 70% 70%, #ffb34733, transparent 60%)" }
];

let current = 0;
const bg = document.getElementById("background");

setInterval(() => {
  current = (current + 1) % themes.length;
  bg.style.background = themes[current].gradient;
}, 10000);
