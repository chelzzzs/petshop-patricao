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
  const hints = root.querySelector<SVGGElement>('[data-hints]'); // só o cachorro tem dicas
  const eyes = $$('[data-eye]');
  const lids = $$('[data-lid]');
  const happy = $$('[data-happy]');
  const blush = $$('[data-blush]');
  const tongue = $('[data-tongue]');
  const ears = $$('[data-ear]');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isHappy = false;
  let smiling = false;

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
    if (!isHappy && !smiling) lids.forEach((l) => animate(l, { scaleY: [0, 1, 0] }, { duration: 0.22, ease: 'easeInOut' }));
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

  const dismissHints = () => hints && animate(hints, { opacity: 0 }, { duration: 0.4 });

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
    smile();
  });

  // Sorriso rápido: olhinhos fechados em "^ ^", bochechas coradas e linguinha, depois volta ao normal
  let smileTimer = 0;
  const smile = () => {
    if (isHappy) return;
    clearTimeout(smileTimer);
    smiling = true;
    eyes.forEach((el) => animate(el, { x: 0, y: 0 }, { duration: 0.15 }));
    lids.forEach((l) => animate(l, { scaleY: 1 }, { duration: 0.15 }));
    happy.forEach((h) => animate(h, { opacity: 1 }, { duration: 0.15, delay: 0.05 }));
    blush.forEach((b) => animate(b, { opacity: 0.85 }, { duration: 0.25 }));
    animate(tongue, { opacity: 1 }, { duration: 0.2 });
    smileTimer = window.setTimeout(() => {
      if (isHappy) return;
      // Primeiro some o "^ ^", só depois a pálpebra abre — nunca os dois olhos aparecem juntos
      happy.forEach((h) => animate(h, { opacity: 0 }, { duration: 0.12 }));
      lids.forEach((l) => animate(l, { scaleY: 0 }, { duration: 0.22, delay: 0.12 }));
      blush.forEach((b) => animate(b, { opacity: 0 }, { duration: 0.4 }));
      animate(tongue, { opacity: 0 }, { duration: 0.2 });
      window.setTimeout(() => (smiling = false), 360);
    }, 1100);
  };

  // Segurar no focinho = feliz
  let pump: ReturnType<typeof animate> | null = null;
  let heartsTimer = 0;
  const setHappy = (on: boolean) => {
    clearTimeout(smileTimer);
    smiling = false;
    isHappy = on;
    // Fechando: pálpebra desce e depois aparece o "^ ^". Abrindo: o inverso.
    lids.forEach((l) => animate(l, { scaleY: on ? 1 : 0 }, { duration: 0.2, delay: on ? 0 : 0.12 }));
    happy.forEach((h) => animate(h, { opacity: on ? 1 : 0 }, { duration: on ? 0.2 : 0.12, delay: on ? 0.1 : 0 }));
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

  // Mouse sobre os botões do topo: ele mostra a linguinha (e ela balança enquanto o mouse estiver lá)
  let tongueWiggle: ReturnType<typeof animate> | null = null;
  const tease = (on: boolean) => {
    if (isHappy || smiling) return;
    tongueWiggle?.stop();
    tongueWiggle = null;
    if (on) {
      animate(tongue, { opacity: 1, scaleY: [0.2, 1.25, 1] }, { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }).then(() => {
        if (!reduce && tongue.style.opacity === '1')
          tongueWiggle = animate(tongue, { scaleY: [1, 1.18, 1], rotate: [0, -6, 6, 0] }, { duration: 0.9, repeat: Infinity, ease: 'easeInOut' });
      });
      animate(head, { y: -3 }, spring(0.4, 0.5));
    } else {
      animate(tongue, { opacity: 0, scaleY: 0.2 }, { duration: 0.2 });
      animate(head, { y: 0 }, spring(0.4, 0.6));
    }
  };
  document.querySelectorAll('[data-mascot-tease]').forEach((btn) => {
    btn.addEventListener('pointerenter', (e) => (e as PointerEvent).pointerType === 'mouse' && tease(true));
    btn.addEventListener('pointerleave', (e) => (e as PointerEvent).pointerType === 'mouse' && tease(false));
    btn.addEventListener('focus', () => tease(true));
    btn.addEventListener('blur', () => tease(false));
  });

  // Teclado: Enter/Espaço faz carinho
  root.tabIndex = 0;
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      head.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });
}
