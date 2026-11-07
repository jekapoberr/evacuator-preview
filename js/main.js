if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');
const overlay = document.getElementById('overlay');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobMenu.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
});
function cm() {
  burger.classList.remove('open');
  mobMenu.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

const navTargets = ['home','apropos','services','portfolio','avis','contacts'];
function updateNav() {
  const scrollY = window.scrollY + 80;
  let current = 'home';
  navTargets.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 8 ? '0 2px 14px rgba(0,0,0,.28)' : 'none';
}, { passive: true });

const rvObs = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); rvObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

// Отзывы
(function () {
  const track = document.getElementById('avisTrack');
  const dots  = document.getElementById('avisDots');
  const cards = Array.from(track.children);
  if(!track) return;
  let cur = 0;

  function vis()   { return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3; }
  function cw()    { return cards[0].offsetWidth + 22; }
  function pages() { return Math.ceil(cards.length / vis()); }

  function buildDots() {
    dots.innerHTML = '';
    for (let i = 0; i < pages(); i++) {
      const d = document.createElement('button');
      d.className = 'a-dot' + (i === cur ? ' on' : '');
      d.addEventListener('click', () => go(i));
      dots.appendChild(d);
    }
  }

  function go(i) {
    cur = Math.max(0, Math.min(i, pages() - 1));
    track.style.transform = `translateX(-${cur * vis() * cw()}px)`;
    dots.querySelectorAll('.a-dot').forEach((d, j) => d.classList.toggle('on', j === cur));
  }

  window.addEventListener('resize', () => { buildDots(); go(0); });
  buildDots();
  go(0);
})();

// Декор футера
(function () {
  const svg = document.getElementById('fsvg');
  if (!svg) return;

  const W = 1440, H = 110;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');

  const fill = '#2D3A4A';
  const bgColor = 'var(--light, #E8EAED)'; 
  const peaks = 12;
  const step = W / peaks;
  const mw = 220;
  const mh = mw / 2;
  const peakY = H - mh;
  const S = 50; 
  let linesSVG = '';

  for (let i = -2; i <= peaks + 2; i++) {
    const px = i * step; 
    for (let k = 1; k < 10; k++) {
      let x1, y1, x2, y2;
      if (k % 2 !== 0) {
        let n = (k + 1) / 2;
        x1 = px - mh + n * S;
        y1 = H;
        x2 = px + S / 2;
        y2 = peakY + k * S / 2;
      } else {
        let n = k / 2;
        x1 = px + mh - n * S;
        y1 = H;
        x2 = px;
        y2 = peakY + k * S / 2;
      }
      if (y2 <= H) {
        linesSVG += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />\n`;
      }
    }
  }

  let mountains = '';
  for (let i = -2; i <= peaks + 2; i++) {
    const px = i * step;
    mountains += `<polygon points="${px - mw / 2},${H} ${px},${peakY} ${px + mw / 2},${H}" />`;
  }

  svg.innerHTML = `
    <defs><clipPath id="mountainsClip">${mountains}</clipPath></defs>
    <rect width="100%" height="100%" fill="${bgColor}" />
    <g fill="${fill}">${mountains}</g>
    <g clip-path="url(#mountainsClip)" stroke="${bgColor}" stroke-width="4" stroke-linecap="round">${linesSVG}</g>
  `;
})();