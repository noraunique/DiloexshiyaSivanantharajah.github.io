(() => {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const header = $('#header');
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const navToggle = $('.nav__toggle');
  const navMenu = $('#nav-menu');
  const closeNav = () => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    $$('#nav-menu a').forEach((a) => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (!navMenu.classList.contains('is-open')) return;
      if (navMenu.contains(t) || navToggle.contains(t)) return;
      closeNav();
    });
  }

  const revealEls = $$('[data-reveal]');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const ent of entries) {
          if (!ent.isIntersecting) continue;
          const el = ent.target;
          const stagger = Number(el.getAttribute('data-stagger') || '0');
          if (stagger) {
            el.style.transitionDelay = `${Math.min(600, stagger * 120)}ms`;
          }
          el.classList.add('is-on');
          io.unobserve(el);
        }
      },
      { threshold: 0.14 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-on'));
  }

  const meterCards = $$('#professional .prof');
  const langFills = $$('#languages [data-fill]');

  const enableMeters = () => {
    meterCards.forEach((c, idx) => {
      const meter = $('.meter', c);
      if (meter) meter.classList.add('is-on');

      const bar = $('[data-meter-bar]', c);
      if (bar && bar instanceof HTMLElement) {
        const values = [0.92, 0.86, 0.9, 0.84, 0.88, 0.86, 0.8, 0.9, 0.84, 0.82];
        const v = values[idx] ?? 0.84;
        bar.style.setProperty('--w', `${v * 100}%`);
        bar.style.position = 'relative';
        bar.style.overflow = 'hidden';
        const after = bar;
        if (!after.dataset.ready) {
          after.dataset.ready = '1';
          after.style.setProperty('contain', 'paint');
        }
        bar.style.setProperty('width', '92px');
        bar.style.setProperty('height', '6px');
        bar.style.setProperty('borderRadius', '999px');
      }
      if (bar && bar instanceof Element) {
        bar.classList.add('is-on');
      }
    });

    langFills.forEach((el) => {
      const v = Number(el.getAttribute('data-fill') || '0');
      if (el instanceof HTMLElement) {
        el.style.width = `${Math.max(0, Math.min(1, v)) * 100}%`;
      }
    });
  };

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const metersObserver = new IntersectionObserver(
      (entries) => {
        for (const ent of entries) {
          if (!ent.isIntersecting) continue;
          enableMeters();
          metersObserver.disconnect();
          break;
        }
      },
      { threshold: 0.25 }
    );
    const anchor = $('#professional');
    if (anchor) metersObserver.observe(anchor);
  } else {
    enableMeters();
  }

  const toast = $('#toast');
  let toastTimer = 0;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-on'), 3200);
  };

  const form = $('#contact-form');
  const setError = (name, message) => {
    const el = document.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message || '';
  };
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim());

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get('name') || '').trim();
      const email = String(fd.get('email') || '').trim();
      const message = String(fd.get('message') || '').trim();

      let ok = true;

      if (name.length < 2) {
        setError('name', 'Please enter your name.');
        ok = false;
      } else setError('name', '');

      if (!isEmail(email)) {
        setError('email', 'Please enter a valid email.');
        ok = false;
      } else setError('email', '');

      if (message.length < 10) {
        setError('message', 'Please add a short message (at least 10 characters).');
        ok = false;
      } else setError('message', '');

      if (!ok) {
        showToast('Please fix the highlighted fields.');
        return;
      }

      form.reset();
      showToast('Message sent successfully. I’ll get back to you soon.');
    });
  }

  const modal = $('#modal');
  const modalContent = $('#modal-content');

  const CASES = {
    jobson: {
      title: 'Jobson — OnDemand Hiring & Home Services App',
      overview: 'UI/UX concept for booking home services like plumbers and electricians with simple navigation and clear service categories.',
      problem: 'Users need to find trusted service providers quickly, understand categories, and complete booking without friction.',
      solution: 'A clean booking flow with structured service browsing, clear CTAs, and readable UI hierarchy.',
      process: ['Requirement analysis', 'User flow mapping', 'Wireframes (placeholder)', 'High-fidelity UI in Figma', 'QA-inspired UI checks'],
      tools: ['Figma'],
      results: ['Cleaner booking flow', 'Reduced cognitive load', 'Concept-ready handoff structure'],
    },
    brand: {
      title: 'Brand Identity Kit (Logo + Social Pack)',
      overview: 'A premium brand identity kit focused on consistency across logo, typography, colors, and social templates.',
      problem: 'Brands need a unified look that scales across platforms without visual inconsistency.',
      solution: 'A lightweight system with clear rules and reusable templates.',
      process: ['Moodboard (placeholder)', 'Logo exploration (placeholder)', 'Color + type system', 'Social templates (placeholder)'],
      tools: ['Canva', 'Adobe Photoshop'],
      results: ['Consistent visual language', 'Reusable assets', 'Faster marketing output'],
      comingSoon: true,
    },
    marketing: {
      title: 'Marketing Poster / Social Media Campaign',
      overview: 'High-impact campaign creatives designed for clarity, hierarchy, and brand alignment.',
      problem: 'Campaigns need attention quickly while keeping messaging clean and readable.',
      solution: 'Bold hierarchy, consistent spacing, and platform-ready exports.',
      process: ['Brief & requirements', 'Layout exploration (placeholder)', 'Final visuals (placeholder)', 'QA-style checks'],
      tools: ['Canva', 'Adobe Photoshop'],
      results: ['Higher clarity', 'Brand-consistent layouts', 'Ready-to-post assets'],
      comingSoon: true,
    },
  };

  const renderCase = (data) => {
    const coming = data.comingSoon
      ? `<div class="tag" style="display:inline-block;margin-bottom:.6rem">Coming soon</div>`
      : '';

    const list = (items) => `<ul style="margin:.5rem 0 0;padding-left:1.1rem;color:rgba(233,239,255,.74)">${items
      .map((x) => `<li style="margin:.25rem 0">${x}</li>`)
      .join('')}</ul>`;

    return `
      <div class="card" style="padding:1rem">
        ${coming}
        <h2 style="margin:0;font-family:'Space Grotesk';letter-spacing:-.02em">${data.title}</h2>
        <p style="margin:.65rem 0 0;color:rgba(233,239,255,.74)">${data.overview}</p>
      </div>
      <div style="height:12px"></div>
      <div class="grid" style="grid-template-columns:repeat(2, minmax(0,1fr));gap:12px">
        <div class="card" style="padding:1rem">
          <h3 style="margin:0;font-family:'Space Grotesk'">Problem</h3>
          <p style="margin:.5rem 0 0;color:rgba(233,239,255,.74)">${data.problem}</p>
        </div>
        <div class="card" style="padding:1rem">
          <h3 style="margin:0;font-family:'Space Grotesk'">Solution</h3>
          <p style="margin:.5rem 0 0;color:rgba(233,239,255,.74)">${data.solution}</p>
        </div>
        <div class="card" style="padding:1rem">
          <h3 style="margin:0;font-family:'Space Grotesk'">Process</h3>
          ${list(data.process)}
        </div>
        <div class="card" style="padding:1rem">
          <h3 style="margin:0;font-family:'Space Grotesk'">Wireframes / Final UI</h3>
          <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:.6rem">
            <div style="height:92px;border-radius:16px;border:1px solid rgba(140,170,255,.14);background:linear-gradient(135deg, rgba(76,125,255,.18), rgba(47,231,255,.08))"></div>
            <div style="height:92px;border-radius:16px;border:1px solid rgba(140,170,255,.14);background:linear-gradient(135deg, rgba(47,231,255,.14), rgba(76,125,255,.08))"></div>
          </div>
          <p style="margin:.6rem 0 0;color:rgba(233,239,255,.62)">Placeholders for case study visuals.</p>
        </div>
      </div>
      <div style="height:12px"></div>
      <div class="grid" style="grid-template-columns:repeat(2, minmax(0,1fr));gap:12px">
        <div class="card" style="padding:1rem">
          <h3 style="margin:0;font-family:'Space Grotesk'">Tools</h3>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:.6rem">${data.tools
            .map((t) => `<span class="tag">${t}</span>`)
            .join('')}</div>
        </div>
        <div class="card" style="padding:1rem">
          <h3 style="margin:0;font-family:'Space Grotesk'">Results</h3>
          ${list(data.results)}
        </div>
      </div>
      <div style="height:12px"></div>
      <div class="cta-row">
        <a class="btn btn--ghost" href="#" target="_blank" rel="noreferrer" data-magnetic>View Full Case Study on Behance</a>
      </div>
    `;
  };

  const openModal = (key) => {
    if (!modal || !modalContent) return;
    const data = CASES[key];
    if (!data) return;
    modalContent.innerHTML = renderCase(data);
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
    document.body.style.overflow = '';
  };

  $$('[data-modal-open]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-modal-open')));
  });
  $$('[data-modal-close]').forEach((btn) => btn.addEventListener('click', closeModal));

  if (modal) {
    modal.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.hasAttribute('open')) closeModal();
    });
  }

  const cursor = $('#cursor');
  const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  const isHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  if (!prefersReduced && cursor && isFinePointer && isHover) {
    cursor.style.display = 'block';
    let x = 0, y = 0;
    let tx = 0, ty = 0;

    window.addEventListener(
      'mousemove',
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
      },
      { passive: true }
    );

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const magneticEls = $$('[data-magnetic]');
  if (!prefersReduced && isFinePointer && isHover) {
    magneticEls.forEach((el) => {
      let rect = null;
      const strength = 10;

      el.addEventListener('mouseenter', () => {
        rect = el.getBoundingClientRect();
      });

      el.addEventListener('mousemove', (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top - rect.height / 2;
        const dx = (mx / rect.width) * strength;
        const dy = (my / rect.height) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      const reset = () => {
        el.style.transform = '';
      };
      el.addEventListener('mouseleave', reset);
      el.addEventListener('blur', reset);
    });
  }

  const canvas = $('#dots');
  if (canvas instanceof HTMLCanvasElement && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const DPR = Math.min(2, window.devicePixelRatio || 1);
      let w = 0, h = 0;
      let dots = [];

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        w = Math.floor(rect.width);
        h = Math.floor(rect.height);
        canvas.width = Math.floor(w * DPR);
        canvas.height = Math.floor(h * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

        const count = Math.floor((w * h) / 28000);
        dots = Array.from({ length: Math.min(120, Math.max(40, count)) }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.6,
          a: 0.08 + Math.random() * 0.12,
          vx: (-0.15 + Math.random() * 0.3) * 0.25,
          vy: (-0.15 + Math.random() * 0.3) * 0.25,
        }));
      };

      const step = () => {
        ctx.clearRect(0, 0, w, h);
        for (const d of dots) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < -10) d.x = w + 10;
          if (d.x > w + 10) d.x = -10;
          if (d.y < -10) d.y = h + 10;
          if (d.y > h + 10) d.y = -10;

          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(47,231,255,${d.a})`;
          ctx.fill();
        }
        requestAnimationFrame(step);
      };

      resize();
      window.addEventListener('resize', resize);
      requestAnimationFrame(step);
    }
  }
})();
