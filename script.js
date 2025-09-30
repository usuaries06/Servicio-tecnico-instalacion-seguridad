// Global WhatsApp number constant (international format without +)
const WA_NUMBER = '59163753122';

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', href);
      }
    }
  });
});

// Back to top visibility
const toTop = document.querySelector('.to-top');
const toggleToTop = () => {
  if (!toTop) return;
  const show = window.scrollY > 400;
  toTop.classList.toggle('visible', show);
};
window.addEventListener('scroll', toggleToTop);
window.addEventListener('load', toggleToTop);

// Dynamic year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Normalize WhatsApp links to open new chat
function openWhatsAppNewChat(text = '') {
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  const url = `https://wa.me/${WA_NUMBER}${q}`;
  window.open(url, '_blank', 'noopener');
}

// Bind explicit WhatsApp anchors
(function bindWhatsAppAnchors(){
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsAppNewChat('Hola, quisiera saber mas sobre sus servicios.');
    });
  });
})();

// Contact form -> WhatsApp
const form = document.getElementById('contact-form');
const toast = document.getElementById('form-toast');

function showToast(message, type = 'success') {
  if (!toast) return;
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.right = '18px';
  toast.style.bottom = '72px';
  toast.style.background = type === 'success' ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)';
  toast.style.border = `1px solid ${type === 'success' ? '#10b98166' : '#ef444466'}`;
  toast.style.color = '#e6edf6';
  toast.style.padding = '12px 14px';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 10px 24px rgba(0,0,0,.35)';
  toast.style.zIndex = '60';
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2600);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombre = data.get('nombre') || 'Cliente';
    const asunto = data.get('asunto') || 'Consulta';
    const mensaje = data.get('mensaje') || '';
    const text = `Hola, soy ${nombre}. Asunto: ${asunto}. ${mensaje}`;
    showToast('Abriendo WhatsApp…');
    openWhatsAppNewChat(text);
    form.reset();
  });
}

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Interactive glow on service cards based on cursor
const cards = document.querySelectorAll('.service-card');
cards.forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });
});

// Resolve local service images by trying common extensions
(function resolveServiceThumbs(){
  const thumbs = document.querySelectorAll('.service-thumb[data-img]');
  if (!thumbs.length) return;
  const exts = ['.jpg', '.jpeg', '.png', '.webp'];
  thumbs.forEach(async (el) => {
    const name = el.getAttribute('data-img');
    for (const ext of exts) {
      const url = `assets/images/${name}${ext}`;
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) {
          el.style.backgroundImage = `url('${url}')`;
          return;
        }
      } catch (_) { /* ignore */ }
    }
  });
})();

// Electric spark effect on buttons with .electric
(function electricButtons(){
  const els = document.querySelectorAll('.electric');
  els.forEach(el => {
    let spark = document.createElement('span');
    spark.className = 'spark';
    el.appendChild(spark);
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      spark.style.left = (e.clientX - r.left) + 'px';
      spark.style.top = (e.clientY - r.top) + 'px';
    });
    el.addEventListener('click', (e) => {
      e.preventDefault();
      spark.classList.add('active');
      setTimeout(() => spark.classList.remove('active'), 180);
      if (el.matches('a[href^="https://wa.me/"]')) {
        openWhatsAppNewChat('Hola, tengo una consulta.');
      }
    });
  });
})();

// Electric animated background
(function bgElectric(){
  const canvas = document.getElementById('bg-electric');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  function resize(){
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }

  window.addEventListener('resize', resize);
  resize();

  const sparks = Array.from({length: 40}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    vx: (Math.random()-0.5)*0.15,
    vy: (Math.random()-0.5)*0.15,
    r: 0.6 + Math.random()*1.2
  }));

  function step(){
    ctx.clearRect(0,0,w,h);

    const grd = ctx.createRadialGradient(w*0.2,h*0.1,0,w*0.2,h*0.1,Math.max(w,h)*0.7);
    grd.addColorStop(0,'rgba(59,130,246,0.08)');
    grd.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,w,h);

    for (const s of sparks) {
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
      if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(56,189,248,0.5)';
      ctx.arc(s.x, s.y, s.r*dpr, 0, Math.PI*2);
      ctx.fill();
    }

    if (Math.random() < 0.05) {
      const x1 = Math.random()*w, y1 = Math.random()*h*0.6;
      let x = x1, y = y1;
      ctx.lineWidth = 1.5*dpr; ctx.strokeStyle = 'rgba(59,130,246,0.35)';
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let i=0;i<8;i++) {
        x += (Math.random()-0.5)*80*dpr; y += Math.random()*70*dpr; ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.lineWidth = 3*dpr; ctx.strokeStyle = 'rgba(6,182,212,0.18)'; ctx.stroke();
    }

    requestAnimationFrame(step);
  }
  step();
})(); 