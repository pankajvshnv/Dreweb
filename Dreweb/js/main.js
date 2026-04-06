/* ══════════════════════════════════════════════
   DREWEB — Main JS v2.0
   Design • Develop • Deliver
══════════════════════════════════════════════════ */
'use strict';

/* ── Theme ── */
const ThemeManager = (() => {
  const KEY = 'dreweb-theme';
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = 'assets/logo.png';
  }

  function get() {
    return localStorage.getItem(KEY) ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }

  function init() {
    apply(get());
    if (btn) btn.addEventListener('click', () => {
      apply(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  return { init };
})();

/* ── Nav ── */
const NavManager = (() => {
  const navbar = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  let open = false;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  function toggle() {
    open = !open;
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function close() {
    open = false;
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    menu.classList.remove('active');
    document.body.style.overflow = '';
  }

  function init() {
    window.addEventListener('scroll', onScroll, { passive: true });
    if (ham) ham.addEventListener('click', toggle);
    menu?.querySelectorAll('a').forEach(l => l.addEventListener('click', close));
  }

  return { init };
})();

/* ── Smooth Scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    });
  });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}

/* ── Active Nav Highlight ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active-link', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
}

/* ── Counter Animate ── */
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      let now = 0, inc = end / 55;
      const t = setInterval(() => {
        now = Math.min(now + inc, end);
        el.textContent = Math.round(now) + suffix;
        if (now >= end) clearInterval(t);
      }, 28);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
}

/* ── Scroll To Top ── */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Portfolio Filter ── */
function initPortfolio() {
  const filters = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.pf-item');
  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      f.classList.add('active');
      f.setAttribute('aria-selected', 'true');
      const cat = f.dataset.filter;
      items.forEach((item, i) => {
        const match = cat === 'all' || item.dataset.cat === cat;
        item.classList.toggle('hidden', !match);
        if (match) item.style.animation = `none`;
        setTimeout(() => {
          if (match) { item.style.animation = ''; item.style.animationDelay = `${i * 0.06}s`; }
        }, 10);
      });
    });
  });
}

/* ── Why Card Progress Bar ── */
function initProgressBar() {
  const bars = document.querySelectorAll('.wc-bar-fill');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = '85%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => io.observe(b));
}

/* ── Marquee Duplicate ── */
function initMarquee() {
  const t = document.getElementById('marquee-track');
  if (t) t.innerHTML += t.innerHTML;
}

/* ── Custom Cursor ── */
function initCursor() {
  if (window.innerWidth < 768) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  }, { passive: true });

  function animRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a, button, .service-bento-card, .pf-item, .cc-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ── Particle Canvas ── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = window.innerWidth < 768 ? 30 : 60;
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      const colors = ['139,92,246', '236,72,153', '249,115,22'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Connect nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139,92,246,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ── Card Tilt ── */
function initTilt() {
  if (window.innerWidth < 768) return;
  document.querySelectorAll('.service-bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ── Footer Year ── */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ═══════════════════════════════════════════════
   CONTACT FORM — Web3Forms Email Integration
   User must add their access key from web3forms.com
═══════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-icon');

  if (!form) return;

  function showError(id, msg) {
    const el = document.getElementById(`err-${id}`);
    if (el) { el.textContent = msg; }
    const input = document.getElementById(`form-${id}`);
    if (input) input.style.borderColor = '#f87171';
  }

  function clearErrors() {
    ['name', 'email', 'message'].forEach(id => {
      const el = document.getElementById(`err-${id}`);
      if (el) el.textContent = '';
      const input = document.getElementById(`form-${id}`);
      if (input) input.style.borderColor = '';
    });
  }

  function validate() {
    clearErrors();
    let valid = true;
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length < 2) { showError('name', 'Please enter your name'); valid = false; }
    if (!email || !emailRe.test(email)) { showError('email', 'Please enter a valid email'); valid = false; }
    if (!message || message.length < 10) { showError('message', 'Please describe your project (min 10 chars)'); valid = false; }
    return valid;
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    if (loading) {
      btnText.textContent = 'Sending...';
      btnIcon.className = 'fa-solid fa-spinner fa-spin';
    } else {
      btnText.textContent = 'Send Message';
      btnIcon.className = 'fa-solid fa-paper-plane';
    }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const data = new FormData(form);
    const json = Object.fromEntries(data.entries());

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(json)
      });

      const result = await response.json();

      if (result.success) {
        // Show success
        form.style.display = 'none';
        successEl.style.display = 'block';
        successEl.setAttribute('aria-hidden', 'false');
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      // If access key is placeholder, show setup notice
      const accessKey = data.get('access_key');
      if (accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY' || !accessKey) {
        showFallback();
      } else {
        alert('Something went wrong. Please email us at nickvshnv@gmail.com or call +91 6261029938. Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  });

  function showFallback() {
    // Send via mailto as fallback
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const service = document.getElementById('form-service').value;
    const message = document.getElementById('form-message').value;
    const phone = document.getElementById('form-phone').value;

    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nMessage:\n${message}`
    );
    const mailSubject = encodeURIComponent('New Project Inquiry from dreweb Website');
    window.location.href = `mailto:nickvshnv@gmail.com?subject=${mailSubject}&body=${mailBody}`;
  }
}

/* ── Draggable Logo Card ── */
function initDraggableLogo() {
  const card = document.getElementById('hero-logo-card');
  if (!card) return;

  let isDragging = false;
  let startX, startY;
  let offsetX = 0, offsetY = 0;

  card.style.cursor = 'grab';
  
  card.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    card.style.transition = 'none';
    card.style.cursor = 'grabbing';
    card.style.zIndex = '9999';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    card.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(1.05) rotate(${offsetX * 0.02}deg)`;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    card.style.cursor = 'grab';
    card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    card.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(1)`;
  });
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavManager.init();
  initSmoothScroll();
  initScrollReveal();
  initActiveNav();
  initCounters();
  initScrollTop();
  initPortfolio();
  initProgressBar();
  initMarquee();
  initCursor();
  initParticles();
  initTilt();
  initYear();
  initContactForm();
  initDraggableLogo();
});
