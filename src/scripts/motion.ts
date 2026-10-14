import { animate, inView, scroll, stagger } from 'motion';

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

// Card flip por toque/teclado
document.querySelectorAll<HTMLElement>('[data-flip]').forEach((card) => {
  const toggles = card.querySelectorAll<HTMLButtonElement>('[data-flip-toggle]');
  toggles.forEach((btn) =>
    btn.addEventListener('click', () => {
      const flipped = card.classList.toggle('is-flipped');
      toggles[0].setAttribute('aria-expanded', String(flipped));
      if (!flipped) toggles[0].focus({ preventScroll: true });
    }),
  );
});

if (!reduce) {
  // Entrada do hero
  animate('[data-hero-logo]', { opacity: [0, 1], scale: [0.6, 1], rotate: [-14, 0] }, spring(0.5, 1.1));
  animate(
    '[data-hero-item]',
    { opacity: [0, 1], y: [32, 0] },
    { ...spring(0.3, 0.9), delay: stagger(0.09, { startDelay: 0.1 }) },
  );
  animate(
    '[data-chip]',
    { opacity: [0, 1], scale: [0, 1] },
    { ...spring(0.55, 0.8), delay: stagger(0.18, { startDelay: 0.7 }) },
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
      l.k = mobile.matches ? (l.inHero ? 0 : 0.5) : 1;
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
