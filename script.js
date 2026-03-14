/**
 * TaskNest Digital Marketing — script.js
 * Handles: navbar, mobile menu, scroll reveal,
 *          active nav, smooth scroll, form validation
 */

'use strict';

/* =============================================
   1. UTILITY HELPERS
   ============================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* =============================================
   2. NAVBAR — scroll state + active link
   ============================================= */
const navbar = $('#navbar');

function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Active nav link via IntersectionObserver
function setupActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const active = navLinks.find(
            (link) => link.getAttribute('href') === `#${entry.target.id}`
          );
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}


/* =============================================
   3. MOBILE HAMBURGER MENU
   ============================================= */
function setupMobileMenu() {
  const hamburger    = $('#hamburger');
  const drawer       = $('#mobile-drawer');
  const overlay      = $('#drawer-overlay');
  const mobileLinks  = $$('.mobile-nav-link');

  if (!hamburger || !drawer) return;

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close on any mobile nav link click
  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}


/* =============================================
   4. SMOOTH SCROLL for all anchor links
   ============================================= */
function setupSmoothScroll() {
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = $(id);
      if (!target) return;

      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 72;

      const top = target.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* =============================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================= */
function setupScrollReveal() {
  const revealEls = $$('.reveal');
  if (!revealEls.length) return;

  // Use IntersectionObserver for performance
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}


/* =============================================
   6. CONTACT FORM VALIDATION
   ============================================= */
function setupContactForm() {
  const form       = $('#contact-form');
  const successMsg = $('#form-success');
  if (!form) return;

  const fields = {
    name:     { el: $('#name'),     err: $('#name-error'),     msg: 'Please enter your name.'          },
    email:    { el: $('#email'),    err: $('#email-error'),    msg: 'Please enter a valid email.'      },
    business: { el: $('#business'), err: $('#business-error'), msg: 'Please enter your business name.' },
    message:  { el: $('#message'),  err: $('#message-error'),  msg: 'Please add a short message.'      },
  };

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function validateField(key) {
    const { el, err, msg } = fields[key];
    const val = el.value.trim();
    let valid = true;

    if (!val) {
      valid = false;
    } else if (key === 'email' && !isValidEmail(val)) {
      valid = false;
    }

    if (!valid) {
      el.classList.add('error');
      err.textContent = msg;
    } else {
      el.classList.remove('error');
      err.textContent = '';
    }

    return valid;
  }

  // Validate on blur for real-time UX
  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const allValid = Object.keys(fields).map(validateField).every(Boolean);

    if (!allValid) {
      // Focus first error
      const firstError = Object.values(fields).find((f) =>
        f.el.classList.contains('error')
      );
      if (firstError) firstError.el.focus();
      return;
    }

    // Simulate submission (frontend only)
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Book Free Consultation';
      btn.disabled = false;
      successMsg.classList.add('visible');

      setTimeout(() => successMsg.classList.remove('visible'), 6000);
    }, 1200);
  });
}


/* =============================================
   7. STAT COUNTER ANIMATION (hero section)
   ============================================= */
function animateCounters() {
  const counters = $$('.stat-num');
  if (!counters.length) return;

  const targets = [200, 98, 5];   // raw numbers
  const suffixes = ['+', '%', '×'];
  const duration = 1800;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = targets[idx] ?? 0;
        const suffix = suffixes[idx] ?? '';
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(end * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.7 }
  );

  counters.forEach((c) => observer.observe(c));
}


/* =============================================
   8. INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  handleNavbarScroll();
  setupActiveNav();
  setupMobileMenu();
  setupSmoothScroll();
  setupScrollReveal();
  setupContactForm();
  animateCounters();
});

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
