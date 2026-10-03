// js/motion.js — GSAP animations, AOS initialization, scroll-driven effects
// Loaded as a module after DOM content

function initMotion() {
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionOff = document.body.classList.contains('motion-off');

  // ===== AOS INIT =====
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  if (prefersReducedMotion || motionOff) {
    // Show hero content immediately
    document.querySelectorAll('.hero-line').forEach(el => {
      el.style.clipPath = 'inset(0 0% 0 0)';
      el.style.opacity = '1';
    });
    // Show header
    const header = document.getElementById('site-header');
    if (header) header.style.transform = 'translateY(0)';
    // Grow bars
    document.querySelectorAll('.platform-bar').forEach(b => b.classList.add('grown'));
    return;
  }

  initGSAP();
}

function initGSAP() {
  if (typeof gsap === 'undefined') {
    // Fallback: just reveal everything
    document.querySelectorAll('.hero-line').forEach(el => {
      el.style.clipPath = 'inset(0 0% 0 0)';
      el.style.opacity = '1';
    });
    const header = document.getElementById('site-header');
    if (header) header.style.transform = 'translateY(0)';
    document.querySelectorAll('.platform-bar').forEach(b => b.classList.add('grown'));
    return;
  }

  // Register ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ===== C1: HEADER SLIDE DOWN =====
  const header = document.getElementById('site-header');
  if (header) {
    gsap.to(header, {
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      delay: 0.2
    });
  }

  // ===== C2: HERO ANIMATIONS (GSAP only, no AOS) =====
  const heroTl = gsap.timeline({ delay: 0.5 });

  // Line-by-line mask reveal
  const heroLines = document.querySelectorAll('.hero-line');
  heroLines.forEach((line, i) => {
    heroTl.to(line, {
      clipPath: 'inset(0 0% 0 0)',
      opacity: 1,
      duration: 0.3,
      ease: 'power3.out'
    }, i * 0.2);
  });

  // Badges stagger
  const badges = document.querySelectorAll('#hero-badges > span');
  heroTl.from(badges, {
    y: 20,
    opacity: 0,
    duration: 0.4,
    stagger: 0.1,
    ease: 'power3.out'
  }, '-=0.2');

  // Hero card bars grow
  heroTl.add(() => {
    document.querySelectorAll('.platform-bar').forEach(bar => {
      bar.classList.add('grown');
    });
  }, '-=0.3');

  // Hero card price count-up
  const priceEls = ['hero-price-blinkit', 'hero-price-zepto', 'hero-price-instamart'];
  priceEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const val = parseInt(el.textContent.replace('₹', ''));
      if (!isNaN(val)) {
        const obj = { v: 0 };
        heroTl.to(obj, {
          v: val,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = `₹${Math.round(obj.v)}`; }
        }, '-=0.6');
      }
    }
  });

  // Winner banner slide up
  const banner = document.getElementById('hero-winner-banner');
  if (banner) {
    heroTl.from(banner, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.4');
  }

  // Savings count up
  const savingsEl = document.getElementById('hero-savings');
  if (savingsEl) {
    const savingsVal = parseInt(savingsEl.textContent.replace('₹', ''));
    if (!isNaN(savingsVal)) {
      const obj = { v: 0 };
      heroTl.to(obj, {
        v: savingsVal,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => { savingsEl.textContent = `₹${Math.round(obj.v)}`; }
      }, '-=0.3');
    }
  }

  // ===== C4: PROBLEM SECTION =====
  if (typeof ScrollTrigger !== 'undefined') {
    // "14 app switches" count up
    const switchesEl = document.getElementById('problem-switches');
    if (switchesEl) {
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: '#problem-section',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            v: 14,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => { switchesEl.textContent = Math.round(obj.v); }
          });
        }
      });
    }

    // Connector lines draw
    ScrollTrigger.create({
      trigger: '#problem-section',
      start: 'top 60%',
      once: true,
      onEnter: () => {
        document.querySelectorAll('.connector-line').forEach((line, i) => {
          setTimeout(() => line.classList.add('drawn'), i * 300);
        });
        // Checkmark draws
        document.querySelectorAll('.check-draw').forEach((check, i) => {
          setTimeout(() => check.classList.add('visible'), 800 + i * 300);
        });
      }
    });

    // ===== C5: CATALOG TILT =====
    if (window.matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mousemove', (e) => {
        document.querySelectorAll('.product-card-tilt').forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

          if (isInside) {
            const rotateX = ((y - rect.height / 2) / rect.height) * -6;
            const rotateY = ((x - rect.width / 2) / rect.width) * 6;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          } else {
            card.style.transform = '';
          }
        });
      });
    }

    // ===== C7: FEATURE STACK SCROLL =====
    const featureCards = document.querySelectorAll('.feature-card');
    const stackContainer = document.getElementById('feature-stack-container');

    if (featureCards.length > 0 && stackContainer) {
      const totalCards = featureCards.length;

      // Set initial state
      featureCards.forEach((card, i) => {
        gsap.set(card, {
          zIndex: totalCards - i,
          scale: i === 0 ? 1 : 0.92,
          y: i * 12,
          opacity: i === 0 ? 1 : 0.6
        });
      });

      // ScrollTrigger for each card transition
      for (let i = 0; i < totalCards - 1; i++) {
        ScrollTrigger.create({
          trigger: stackContainer,
          start: () => `top+=${(i / totalCards) * 100}% top`,
          end: () => `top+=${((i + 1) / totalCards) * 100}% top`,
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;

            // Current card moves up and shrinks
            gsap.set(featureCards[i], {
              y: -progress * 60,
              scale: 1 - progress * 0.15,
              opacity: 1 - progress * 0.7,
              zIndex: totalCards - i
            });

            // Next card comes forward
            gsap.set(featureCards[i + 1], {
              y: (1 - progress) * 12,
              scale: 0.92 + progress * 0.08,
              opacity: 0.6 + progress * 0.4,
              zIndex: totalCards - (i + 1) + (progress > 0.5 ? totalCards : 0)
            });
          }
        });
      }
    }

    // ===== C9: SPARKLINE DRAW ON ENTER =====
    ScrollTrigger.create({
      trigger: '#features-section',
      start: 'top 50%',
      once: true,
      onEnter: () => {
        document.querySelectorAll('.sparkline-path').forEach(p => p.classList.add('drawn'));
        document.querySelectorAll('.sparkline-dot').forEach(d => d.classList.add('visible'));
      }
    });

    // ===== C11: MAGNETIC HOVER =====
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.3,
            ease: 'power3.out'
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    // ===== HERO SCROLL FADE =====
    const heroCanvas = document.getElementById('hero-canvas-container');
    if (heroCanvas) {
      ScrollTrigger.create({
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const opacity = 1 - self.progress * 0.75;
          heroCanvas.style.opacity = opacity;
        }
      });
    }
  }

  // ===== BASKET ADD EVENT — Fly to basket animation =====
  document.addEventListener('shopmate:basket-add', (e) => {
    flyToBasket(e.detail.productId);
    bumpBadge();
  });

  document.addEventListener('shopmate:basket-change', () => {
    bumpBadge();
  });

  // ===== ROUTE COMPLETE — Particle burst =====
  document.addEventListener('shopmate:route-complete', (e) => {
    const winner = e.detail.winner;
    setTimeout(() => particleBurst(winner), 200);
  });
}

// ===== FLY TO BASKET ANIMATION =====
function flyToBasket(productId) {
  if (typeof gsap === 'undefined') return;

  const sourceCard = document.querySelector(`[data-product-id="${productId}"]`);
  const badge = document.getElementById('basket-badge');
  if (!sourceCard || !badge) return;

  const sourceRect = sourceCard.getBoundingClientRect();
  const targetRect = badge.getBoundingClientRect();

  // Create flying clone
  const clone = document.createElement('div');
  clone.className = 'fly-clone';
  clone.style.cssText = `
    left: ${sourceRect.left}px;
    top: ${sourceRect.top}px;
    width: ${sourceRect.width}px;
    height: ${sourceRect.height}px;
    background: linear-gradient(135deg, var(--primary-container), var(--primary));
    opacity: 0.8;
  `;
  document.body.appendChild(clone);

  gsap.to(clone, {
    left: targetRect.left + targetRect.width / 2 - 16,
    top: targetRect.top + targetRect.height / 2 - 16,
    width: 32,
    height: 32,
    borderRadius: '50%',
    opacity: 0,
    duration: 0.6,
    ease: 'power3.in',
    onComplete: () => clone.remove()
  });
}

function bumpBadge() {
  const badge = document.getElementById('basket-badge');
  if (!badge) return;
  badge.classList.add('badge-bump');
  setTimeout(() => badge.classList.remove('badge-bump'), 400);
}

// ===== PARTICLE BURST =====
function particleBurst(platformId) {
  if (typeof gsap === 'undefined') return;

  const card = document.getElementById(`platform-card-${platformId}`);
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const colors = ['#5323e6', '#6c47ff', '#006c49', '#6cf8bb', '#f59e0b', '#9333ea', '#f97316'];

  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${cx}px;
      top: ${cy}px;
      background: ${colors[i % colors.length]};
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
    `;
    document.body.appendChild(p);

    const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.5;
    const dist = 60 + Math.random() * 100;

    gsap.to(p, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 30,
      opacity: 0,
      scale: 0.3,
      duration: 0.7 + Math.random() * 0.3,
      ease: 'power2.out',
      onComplete: () => p.remove()
    });
  }
}

// ===== INIT =====
// Wait for GSAP and AOS to load, then fonts
function boot() {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => initMotion());
  } else {
    initMotion();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure GSAP CDN has loaded
    setTimeout(boot, 100);
  });
} else {
  setTimeout(boot, 100);
}

export { initMotion, flyToBasket, particleBurst };
