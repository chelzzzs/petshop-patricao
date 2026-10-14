import { animate } from 'motion';

const SVG_NS = 'http://www.w3.org/2000/svg';
const spring = (bounce = 0.4, duration = 0.6) => ({ type: 'spring' as const, bounce, duration });

export function mountMascot(root: HTMLElement) {
  const svg = root.querySelector('svg')!;
  const $ = <T extends Element = SVGGElement>(sel: string) => root.querySelector<T>(sel)!;
  const $$ = <T extends Element = SVGElement>(sel: string) => [...root.querySelectorAll<T>(sel)];

  const head = $('[data-head]');
  const chin = $('[data-chin]');
  const body = $('[data-body]');
  const fx = $('[data-fx]');
  const hints = $('[data-hints]');
  const eyes = $$('[data-eye]');
  const lids = $$('[data-lid]');
  const happy = $$('[data-happy]');
  const blush = $$('[data-blush]');
  const tongue = $('[data-tongue]');
  const ears = $$('[data-ear]');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isHappy = false;

  // Olhos e cabeça seguem o cursor
  // No máximo uma atualização por quadro, e só enquanto o mascote está na tela
  const look = { x: 0, y: 0 };
  let pointer: { x: number; y: number } | null = null;
  let lookFrame = 0;
  let onScreen = true;
  new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting)).observe(svg);
  const follow = () => {
    lookFrame = 0;
    if (!pointer || isHappy) return;
    const r = svg.getBoundingClientRect();
    look.x = Math.max(-1, Math.min(1, (pointer.x - (r.left + r.width / 2)) / (r.width * 1.2)));
    look.y = Math.max(-1, Math.min(1, (pointer.y - (r.top + r.height * 0.42)) / (r.height * 1.2)));
    eyes.forEach((el) => animate(el, { x: look.x * 9, y: look.y * 8 }, spring(0.15, 0.22)));
    animate(head, { rotate: look.x * 6, x: look.x * 6, y: look.y * 4 }, spring(0.2, 0.4));
  };
  addEventListener(
    'pointermove',
    (e) => {
      if (!onScreen || isHappy) return;
      pointer = { x: e.clientX, y: e.clientY };
      if (!lookFrame) lookFrame = requestAnimationFrame(follow);
    },
    { passive: true },
  );

  // Piscar
  const blink = () => {
    if (!isHappy) lids.forEach((l) => animate(l, { scaleY: [0, 1, 0] }, { duration: 0.22, ease: 'easeInOut' }));
    setTimeout(blink, 2500 + Math.random() * 3000);
  };

  // Respirar e balançar orelhas
  if (!reduce) {
    setTimeout(blink, 1800);
    animate(body, { scaleY: [1, 1.025, 1] }, { duration: 3, repeat: Infinity, ease: 'easeInOut' });
    ears.forEach((ear, i) =>
      animate(ear, { rotate: i ? [0, -3, 0] : [0, 3, 0] }, { duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }),
    );
  }

  const dismissHints = () => animate(hints, { opacity: 0 }, { duration: 0.4 });

  const heart = (x: number, y: number) => {
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#heart');
    use.setAttribute('fill', Math.random() > 0.5 ? '#ff6b7a' : '#ffc531');
    use.setAttribute('x', String(x));
    use.setAttribute('y', String(y));
    use.style.transformBox = 'fill-box';
    use.style.transformOrigin = 'center';
    fx.append(use);
    animate(
      use,
      { y: [0, -90 - Math.random() * 40], x: [0, (Math.random() - 0.5) * 70], scale: [0, 1.2, 0.8], opacity: [1, 1, 0] },
      { duration: 1.2, ease: 'easeOut' },
    ).then(() => use.remove());
  };

  // Clique na cabeça = carinho
  head.addEventListener('click', (e) => {
    if ((e.target as Element).closest('[data-chin]')) return;
    dismissHints();
    animate(head, { rotate: [0, -8, 7, -4, 0], scaleY: [1, 0.92, 1.04, 1] }, { duration: 0.6 });
    ears.forEach((ear, i) => animate(ear, { rotate: i ? [0, 28, -8, 0] : [0, -28, 8, 0] }, { duration: 0.7 }));
    lids.forEach((l) => animate(l, { scaleY: [0, 1, 1, 0] }, { duration: 0.6 }));
    for (let i = 0; i < 4; i++) setTimeout(() => heart(170 + Math.random() * 60, 70), i * 90);
  });

  // Segurar no focinho = feliz
  let pump: ReturnType<typeof animate> | null = null;
  let heartsTimer = 0;
  const setHappy = (on: boolean) => {
    isHappy = on;
    lids.forEach((l) => animate(l, { scaleY: on ? 1 : 0 }, { duration: 0.2 }));
    happy.forEach((h) => animate(h, { opacity: on ? 1 : 0 }, { duration: 0.2, delay: on ? 0.1 : 0 }));
    blush.forEach((b) => animate(b, { opacity: on ? 0.85 : 0 }, { duration: 0.3 }));
    animate(tongue, { opacity: on ? 1 : 0 }, { duration: 0.2 });
    if (on) {
      eyes.forEach((el) => animate(el, { x: 0, y: 0 }, { duration: 0.2 }));
      pump = animate(head, { rotate: [-6, -2, -6], y: [-4, -8, -4] }, { duration: 0.5, repeat: Infinity, ease: 'easeInOut' });
      heartsTimer = window.setInterval(() => heart(150 + Math.random() * 100, 80), 280);
    } else {
      pump?.stop();
      animate(head, { rotate: 0, y: 0 }, spring(0.4, 0.8));
      clearInterval(heartsTimer);
    }
  };

  let holdTimer = 0;
  chin.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    try {
      chin.setPointerCapture(e.pointerId);
    } catch {}
    dismissHints();
    holdTimer = window.setTimeout(() => setHappy(true), 180);
  });
  const release = () => {
    clearTimeout(holdTimer);
    if (isHappy) setHappy(false);
  };
  chin.addEventListener('pointerup', release);
  chin.addEventListener('pointercancel', release);

  // Teclado: Enter/Espaço faz carinho
  root.tabIndex = 0;
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      head.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });
}
