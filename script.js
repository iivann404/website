/* ============================================================
   script.js — Iván Vázquez Portfolio
   ============================================================ */

'use strict';

// ─── LOADER ───────────────────────────────────────────────────
const loader  = document.getElementById('loader');
const body    = document.body;

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    body.classList.remove('loading');
    // Kick off scroll animations check
    observeSections();
  }, 1400);
});

// ─── HAMBURGER MENU ──────────────────────────────────────────
const hamburger     = document.getElementById('hamburger');
const sidebar       = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMenu() {
  hamburger.classList.add('open');
  sidebar.classList.add('open');
  mobileOverlay.classList.add('visible');
  body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  sidebar.classList.remove('open');
  mobileOverlay.classList.remove('visible');
  body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

mobileOverlay.addEventListener('click', closeMenu);

// Close menu on nav link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeMenu();
  });
});

// ─── SMOOTH SCROLL ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = window.innerWidth <= 768 ? 80 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── ACTIVE NAV HIGHLIGHT (Intersection Observer) ────────────
const navLinks   = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// ─── FADE-UP ON SCROLL ────────────────────────────────────────
function observeSections() {
  const fadeEls = document.querySelectorAll('.fade-up');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach((el, i) => {
    // Stagger delay for hero children
    if (el.classList.contains('hero')) {
      el.style.transitionDelay = '0s';
    } else {
      el.style.transitionDelay = `${i * 0.05}s`;
    }
    fadeObserver.observe(el);
  });
}

// ─── EXPERIENCE TABS ─────────────────────────────────────────
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.querySelector(`.tab-panel[data-panel="${target}"]`).classList.add('active');
  });
});

// ─── CURSOR SPOTLIGHT ────────────────────────────────────────
// Only on non-touch devices
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const spotlight = document.createElement('div');
  spotlight.classList.add('spotlight');
  document.body.appendChild(spotlight);

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateSpotlight() {
    // Lerp for smooth lag
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    spotlight.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`;
    requestAnimationFrame(animateSpotlight);
  }

  animateSpotlight();
}

// ─── PROJECT CARD TILT (subtle) ──────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── SECTION HEADING NUMBER COUNTER EFFECT ───────────────────
document.querySelectorAll('.section-number').forEach(el => {
  const target = parseInt(el.textContent);
  el.textContent = '00.';

  const numObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        el.textContent = `0${target}.`;
      }, 200);
      numObserver.disconnect();
    }
  }, { threshold: 0.5 });

  numObserver.observe(el.closest('section') || el);
});