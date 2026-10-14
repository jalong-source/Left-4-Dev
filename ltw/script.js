// Hamburger menu
const burger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
function toggleMenu(open) {
  burger.classList.toggle('open', open);
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
}
burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

// Typing effect
const words = ['Sinh viên CNTT', 'Lập trình viên Web', 'Người đam mê công nghệ'];
const typed = document.getElementById('typed');
let w = 0, c = 0, del = false;
(function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  let delay = del ? 50 : 100;
  if (!del && c === word.length) { del = true; delay = 1500; }
  else if (del && c === 0) { del = false; w = (w + 1) % words.length; delay = 400; }
  else c += del ? -1 : 1;
  setTimeout(type, delay);
})();

// Parallax
const layers = document.querySelectorAll('.layer');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  layers.forEach(l => l.style.transform = `translateY(${y * l.dataset.speed}px)`);
}, { passive: true });

// Skill bars on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.fill').forEach(f => f.style.width = f.dataset.level + '%');
      io.unobserve(e.target);
    }
  });
}, { threshold: .3 });
io.observe(document.getElementById('skills'));

// Flip card (touch support)
const card = document.querySelector('.flip-card');
card.addEventListener('click', () => card.classList.toggle('flipped'));

// FAB
const fab = document.getElementById('fab');
document.getElementById('fabMain').addEventListener('click', () => fab.classList.toggle('open'));
