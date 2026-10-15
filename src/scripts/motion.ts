import { animate, inView, scroll, stagger } from 'motion';

(window as unknown as { __motionReady: boolean }).__motionReady = true;

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const spring = (bounce = 0.3, duration = 0.8) => ({ type: 'spring' as const, bounce, duration });

// Header ganha fundo ao rolar
const header = document.querySelector<HTMLElement>('[data-header]');
const onScroll = () => header?.toggleAttribute('data-scrolled', scrollY > 20);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menu mobile fecha ao escolher um link
document.querySelectorAll('[data-close-menu]').forEach((a) =>
  a.addEventListener('click', () => document.getElementById('menu')?.hidePopover()),
);

// Card flip (controlado por JS): hover mostra o verso no desktop; clique/toque em qualquer lugar vira e desvira;
// segurar e arrastar na horizontal gira o card junto com o dedo/mouse e solta no lado mais próximo.
document.querySelectorAll<HTMLElement>('[data-flip]').forEach((card) => {
  const inner = card.querySelector<HTMLElement>('.flip-inner')!;
  const toggle = card.querySelector<HTMLButtonElement>('[data-flip-toggle]');
  const hoverable = matchMedia('(hover: hover) and (pointer: fine)').matches;
  let angle = 0; // ângulo atual (graus)
  let pinned = false; // virado por clique/toque/arrasto
  let hovering = false;
  let drag: { x: number; start: number; last: number; t: number; v: number; moved: boolean; id: number } | null = null;
  let suppressClick = false;
  let anim: ReturnType<typeof animate> | null = null;

  // Ângulo realmente na tela (no meio de uma animação ele difere do alvo): lê a matriz e "desenrola" perto do alvo
  const currentAngle = () => {
    const m = new DOMMatrix(getComputedStyle(inner).transform);
    const deg = (Math.atan2(-m.m13, m.m11) * 180) / Math.PI;
    return deg + 360 * Math.round((angle - deg) / 360);
  };
  // Para a animação em andamento (senão ela "ganha" do arrasto) e congela no ângulo atual
  const freeze = () => {
    if (!anim) return;
    const a = currentAngle();
    anim.stop();
    anim = null;
    setAngle(a);
  };
  const setAngle = (a: number) => {
    angle = a;
    inner.style.transform = `rotateY(${a}deg)`;
  };
  const goTo = (target: number) => {
    freeze();
    const from = angle;
    angle = target;
    anim = animate(
      inner,
      { rotateY: [from, target] },
      reduce ? { duration: 0 } : { type: 'spring', visualDuration: 0.8, bounce: 0.22 },
    );
  };
  // Lado mostrado: verso quando fixado ou com o mouse em cima
  const showing = () => (pinned || hovering ? 180 : 0);
  // Vai para o ângulo do lado desejado mais próximo do ângulo atual (evita voltas extras)
  const settle = () => {
    const side = showing();
    const k = Math.round((angle - side) / 360);
    goTo(side + k * 360);
    toggle?.setAttribute('aria-expanded', String(side === 180));
  };

  if (hoverable) {
    card.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      hovering = true;
      if (!drag) settle();
    });
    card.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      hovering = false;
      if (!drag) settle();
    });
  }

  card.addEventListener('pointerdown', (e) => {
    if ((e.target as Element).closest('a') || e.button > 0) return;
    freeze();
    drag = { x: e.clientX, start: angle, last: e.clientX, t: performance.now(), v: 0, moved: false, id: e.pointerId };
  });
  card.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      try {
        card.setPointerCapture(e.pointerId);
      } catch {}
    }
    const now = performance.now();
    drag.v = (e.clientX - drag.last) / Math.max(1, now - drag.t); // px/ms
    drag.last = e.clientX;
    drag.t = now;
    setAngle(drag.start + dx * (180 / Math.max(card.clientWidth, 120)));
  });
  const endDrag = () => {
    if (!drag) return;
    if (drag.moved) {
      suppressClick = true;
      // Projeta um pouco na direção do gesto e fica com o lado (frente/verso) mais próximo
      const projected = angle + Math.max(-90, Math.min(90, drag.v * 140));
      const half = Math.round(projected / 180);
      pinned = Math.abs(half) % 2 === 1;
      goTo(half * 180);
      toggle?.setAttribute('aria-expanded', String(pinned));
    }
    drag = null;
  };
  card.addEventListener('pointerup', endDrag);
  card.addEventListener('pointercancel', endDrag);

  card.addEventListener('click', (e) => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if ((e.target as Element).closest('a')) return;
    pinned = !(pinned || hovering);
    if (!pinned) hovering = false;
    settle();
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pinned) {
      pinned = false;
      settle();
      toggle?.focus({ preventScroll: true });
    }
  });
  // Foco de teclado no link do verso mostra o verso
  card.querySelector('a')?.addEventListener('focus', () => {
    pinned = true;
    settle();
  });
});

// Galeria pausa quando sai da tela (por padrão ela roda; só pausa com confirmação do observer)
const marquee = document.querySelector<HTMLElement>('[data-marquee]');
if (marquee) {
  new IntersectionObserver(([entry]) => marquee.toggleAttribute('data-offscreen', !entry.isIntersecting), {
    rootMargin: '100px 0px',
  }).observe(marquee);
}

if (!reduce) {
  // Entrada do hero
  animate('[data-hero-logo]', { opacity: [0, 1], scale: [0.6, 1], rotate: [-14, 0] }, spring(0.5, 1.1));
  animate(
    '[data-hero-item]',
    { opacity: [0, 1], y: [32, 0] },
    { ...spring(0.3, 0.9), delay: stagger(0.09, { startDelay: 0.1 }) },
  );


  // Reveals no scroll
  inView(
    '[data-reveal]',
    (el) => {
      animate(el, { opacity: [0, 1], y: [48, 0] }, spring(0.25, 1));
    },
    { margin: '0px 0px -12% 0px' },
  );
  inView(
    '[data-stagger]',
    (el) => {
      animate(
        [...el.children],
        { opacity: [0, 1], y: [60, 0], rotate: [4, 0] },
        { ...spring(0.35, 1), delay: stagger(0.1) },
      );
    },
    { margin: '0px 0px -12% 0px' },
  );

  // Banner final: botão vira (flip no eixo X) com spring no hover; ao aparecer dá uma volta como dica
  document.querySelectorAll<HTMLElement>('.btn-flip').forEach((btn) => {
    const inner = btn.querySelector<HTMLElement>('.btn-flip-inner');
    if (!inner) return;
    const flip = (deg: number) => animate(inner, { rotateX: deg }, spring(0.45, 0.8));
    btn.addEventListener('pointerenter', () => flip(180));
    btn.addEventListener('pointerleave', () => flip(0));
    btn.addEventListener('focus', () => flip(180));
    btn.addEventListener('blur', () => flip(0));
    inView(
      btn,
      () => {
        animate(inner, { rotateX: [0, 360] }, { duration: 1.2, delay: 0.5, ease: [0.34, 1.3, 0.64, 1] }).then(() => {
          if (!btn.matches(':hover, :focus')) animate(inner, { rotateX: 0 }, { duration: 0 });
        });
      },
      { margin: '0px 0px -15% 0px' },
    );
  });

  // Frase do "Sobre" acende palavra por palavra
  const words = [...document.querySelectorAll<HTMLElement>('[data-word]')];
  const statement = document.querySelector('[data-words]');
  if (statement && words.length) {
    words.forEach((w) => (w.style.opacity = '0.15'));
    scroll(
      (progress: number) => {
        const lit = progress * words.length;
        words.forEach((w, i) => (w.style.opacity = String(0.15 + 0.85 * Math.min(Math.max(lit - i, 0), 1))));
      },
      { target: statement, offset: ['start 85%', 'end 55%'] },
    );
  }

  // Parallax scrolling: [data-speed] (vertical) e [data-speed-x] (horizontal), velocidade em --speed/--speed-x.
  // Usa a propriedade CSS `translate`, que compõe com os `transform` das outras animações.
  // No celular o hero empilha: colunas e etiquetas do hero ficam fixas e o resto anda pela metade.
  const mobile = matchMedia('(max-width: 767px)');
  type Layer = { el: HTMLElement; sy: number; sx: number; inHero: boolean; center: number; k: number };
  const layers: Layer[] = [...document.querySelectorAll<HTMLElement>('[data-speed], [data-speed-x]')].map((el) => ({
    el,
    sy: Number(el.style.getPropertyValue('--speed') || 0),
    sx: Number(el.style.getPropertyValue('--speed-x') || 0),
    inHero: !!el.closest('[data-hero-content]'),
    center: 0,
    k: 1,
  }));
  const measure = () =>
    layers.forEach((l) => {
      l.el.style.translate = 'none';
      const r = l.el.getBoundingClientRect();
      l.center = r.top + scrollY + r.height / 2;
      // No celular: hero e camadas horizontais (galeria) ficam sem parallax — no touch o scroll roda
      // no compositor e o translate via JS chega 1 quadro atrasado, o que dá o "tremido".
      l.k = mobile.matches ? (l.inHero || l.sx ? 0 : 0.5) : 1;
      l.el.style.willChange = l.k ? 'translate' : '';
    });
  // Camadas longe da tela não são atualizadas (sem escrita de estilo à toa)
  const update = () => {
    const mid = scrollY + innerHeight / 2;
    const reach = innerHeight * 1.5;
    layers.forEach((l) => {
      const raw = mid - l.center;
      if (!l.k || Math.abs(raw) > reach) return;
      const d = raw * l.k;
      l.el.style.translate = `${(d * l.sx).toFixed(1)}px ${(d * l.sy).toFixed(1)}px`;
    });
  };
  measure();
  update();
  scroll(update);
  let resizeTimer = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      measure();
      update();
    }, 150);
  });

  // Hero se afasta ao rolar (só desktop: no celular o hero é mais alto que a tela e desfocaria o CTA)
  const hero = document.querySelector('[data-hero]');
  const heroContent = document.querySelector<HTMLElement>('[data-hero-content]');
  if (hero && heroContent && !mobile.matches) {
    scroll(animate(heroContent, { opacity: [1, 0], scale: [1, 0.92] }, { ease: 'linear' }), {
      target: hero,
      offset: ['start start', 'end start'],
    });
  }
}
