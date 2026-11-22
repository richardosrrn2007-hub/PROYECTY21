/* Canvas + DOM engine for the gold cascade descent.
   Everything is positioned in % of each scene's illustration, so it stays
   locked to the painted features at any screen size. */

type Overlay =
  | { t: 'flow'; x: number; y: number; w: number; h: number; v: number }
  | { t: 'dust'; kind: DustKind; n: number; x?: number; y?: number; w?: number; h?: number }
  | { t: 'sprite'; s: keyof typeof SP; x: number; y: number; w: number }
  | { t: 'glow' | 'mist' | 'halo'; cls?: string; x: number; y: number; w: number; h?: number };
type DustKind = 'wisp' | 'mote' | 'spray' | 'spark' | 'drip' | 'glint' | 'shimmer';

const SPRITES = './cascada/10-sprites.webp';
const SP = { coin: [70, 40, 480, 515], nugget: [685, 100, 500, 440], bar: [55, 840, 515, 190], edge: [885, 685, 100, 490] } as const;

export const CONF: Record<string, Overlay[]> = {
  hero: [
    { t: 'halo', x: 50, y: 33, w: 19 },
    { t: 'flow', x: 46.8, y: 46, w: 6.4, h: 24, v: 55 },
    { t: 'mist', x: 50, y: 71, w: 26, h: 10 },
    { t: 'dust', kind: 'spray', n: 46, x: 44, y: 64, w: 12, h: 10 },
    { t: 'dust', kind: 'drip', n: 26, x: 47.6, y: 46, w: 4.8, h: 24 },
    { t: 'dust', kind: 'drip', n: 24, x: 47, y: 78, w: 6, h: 22 },
    { t: 'glow', x: 9.5, y: 38.5, w: 6 }, { t: 'glow', x: 13, y: 40, w: 3 },
    { t: 'glow', x: 86.5, y: 45, w: 5 }, { t: 'glow', x: 89, y: 46, w: 3 },
    { t: 'glow', cls: 'soft', x: 50, y: 73, w: 26 },
    { t: 'dust', kind: 'wisp', n: 60, x: 20, y: 30, w: 60, h: 70 },
    { t: 'sprite', s: 'coin', x: 21, y: 34, w: 4.2 },
    { t: 'sprite', s: 'nugget', x: 79, y: 26, w: 3.8 },
    { t: 'sprite', s: 'bar', x: 67, y: 54, w: 3.6 },
    { t: 'sprite', s: 'edge', x: 33, y: 52, w: 1.4 },
  ],
  cueva: [
    { t: 'flow', x: 42.5, y: 0, w: 21, h: 80, v: 60 },
    { t: 'mist', x: 53, y: 79, w: 38, h: 13 },
    { t: 'dust', kind: 'spray', n: 60, x: 44, y: 72, w: 18, h: 12 },
    { t: 'dust', kind: 'drip', n: 40, x: 46, y: 4, w: 15, h: 70 },
    { t: 'glow', cls: 'soft', x: 53, y: 82, w: 30 },
    { t: 'glow', x: 84, y: 45, w: 7 }, { t: 'glow', x: 88, y: 26, w: 5 }, { t: 'glow', x: 74, y: 58, w: 4 },
    { t: 'dust', kind: 'mote', n: 40 },
    { t: 'sprite', s: 'coin', x: 76, y: 33, w: 2.6 },
  ],
  mina: [
    { t: 'flow', x: 20.5, y: 6, w: 11, h: 68, v: 65 },
    { t: 'dust', kind: 'spray', n: 60, x: 16, y: 66, w: 20, h: 16 },
    { t: 'dust', kind: 'drip', n: 22, x: 22.5, y: 12, w: 7, h: 56 },
    { t: 'glow', cls: 'soft', x: 13, y: 86, w: 22 },
    { t: 'glow', x: 36.8, y: 30.8, w: 3.4 }, { t: 'glow', x: 48.5, y: 46.9, w: 2.6 }, { t: 'glow', x: 58.3, y: 55.7, w: 2.2 },
    { t: 'glow', cls: 'soft', x: 52, y: 58.6, w: 5 },
    { t: 'glow', x: 93.4, y: 54.7, w: 3 }, { t: 'glow', x: 90.5, y: 58.6, w: 3 }, { t: 'glow', x: 87.6, y: 62.5, w: 3 },
    { t: 'glow', x: 84.6, y: 68.8, w: 3 }, { t: 'glow', x: 82, y: 75.2, w: 3 },
    { t: 'dust', kind: 'mote', n: 24 },
  ],
  refineria: [
    { t: 'flow', x: 67.4, y: 21, w: 9, h: 30, v: 34 },
    { t: 'glow', cls: 'soft', x: 79, y: 14, w: 22 },
    { t: 'glow', x: 69, y: 56, w: 30 },
    { t: 'glow', cls: 'soft', x: 62, y: 86, w: 40 },
    { t: 'mist', x: 62, y: 60, w: 34, h: 14 },
    { t: 'dust', kind: 'spark', n: 70, x: 52, y: 40, w: 38, h: 26 },
  ],
  boveda: [
    { t: 'glow', cls: 'soft', x: 50, y: 66, w: 10 },
    { t: 'glow', x: 10.7, y: 58, w: 4 }, { t: 'glow', x: 21, y: 60, w: 3 }, { t: 'glow', x: 79, y: 60, w: 3 }, { t: 'glow', x: 89, y: 58, w: 4 },
    { t: 'dust', kind: 'glint', n: 60, x: 0, y: 64, w: 100, h: 30 },
    { t: 'dust', kind: 'shimmer', n: 50, x: 40, y: 72, w: 20, h: 24 },
    { t: 'sprite', s: 'coin', x: 28, y: 30, w: 2.6 },
    { t: 'sprite', s: 'edge', x: 72, y: 34, w: 1.2 },
  ],
};
/* seam falls: box in % of the band; texture borrowed from a scene's painted falls (% of that image) */
export const SEAM_FLOWS = [
  { x: 45, y: 33, w: 10, h: 51, from: 'hero', s: [47, 84, 6, 16], v: 85 },
  { x: 19.8, y: 33, w: 10, h: 51, from: 'mina', s: [22, 14, 8, 50], v: 65 },
  { x: 64.6, y: 31, w: 10, h: 51, from: 'mina', s: [22, 14, 8, 50], v: 65 },
  null,
];

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const EASE = 'cubic-bezier(.2,.8,.2,1)';

type Flow = { cv: HTMLCanvasElement; img: HTMLImageElement; s: number[]; v: number; w?: number; h?: number; ctx?: CanvasRenderingContext2D; L?: number; cols?: { ph: number; sp: number }[] };
type P = { u: number; v: number; r: number; ph: number; sp: number };
type Dust = { cv: HTMLCanvasElement; art: HTMLElement; o: Extract<Overlay, { t: 'dust' }>; W?: number; H?: number; ctx?: CanvasRenderingContext2D; bx?: number; by?: number; bw?: number; bh?: number; p?: P[] };
type Sprite = { el: HTMLElement; art: HTMLElement; o: Extract<Overlay, { t: 'sprite' }>; ph: number; ox: number; oy: number; ar: number };

export function startCascade(root: HTMLElement, imgs: Record<string, string>) {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(devicePixelRatio || 1, 1.5);
  const $$ = <T extends Element>(s: string, r: ParentNode = root) => [...r.querySelectorAll<T>(s)];
  const flows: Flow[] = [], dusts: Dust[] = [], sprites: Sprite[] = [];
  const IMG: Record<string, HTMLImageElement> = {};
  const created: Element[] = [];

  const image = (src: string) => {
    if (!IMG[src]) {
      const i = new Image();
      i.decoding = 'async';
      i.src = src;
      i.onload = () => flows.forEach(sizeFlow);
      IMG[src] = i;
    }
    return IMG[src];
  };

  /* ---------- build overlays ---------- */
  $$<HTMLElement>('.scene').forEach((sc) => {
    const id = sc.dataset.scene!;
    const art = sc.querySelector<HTMLElement>('.art')!;
    for (const o of CONF[id] || []) {
      let el: HTMLElement;
      if (o.t === 'flow') {
        const cv = document.createElement('canvas');
        cv.className = 'flow';
        flows.push({ cv, img: image(imgs[id]), s: [o.x, o.y, o.w, o.h], v: o.v });
        el = cv;
      } else if (o.t === 'dust') {
        const cv = document.createElement('canvas');
        cv.className = 'dust';
        dusts.push({ cv, art, o });
        art.appendChild(cv);
        created.push(cv);
        continue;
      } else if (o.t === 'sprite') {
        el = document.createElement('div');
        el.className = 'sprite';
        const [x, y, w, h] = SP[o.s], S = 1254;
        el.style.backgroundImage = `url('${SPRITES}')`;
        el.style.backgroundSize = `${(S / w) * 100}% ${(S / h) * 100}%`;
        el.style.backgroundPosition = `${(x / (S - w)) * 100}% ${(y / (S - h)) * 100}%`;
        el.style.width = o.w + '%';
        el.style.aspectRatio = `${w}/${h}`;
        sprites.push({ el, art, o, ph: Math.random() * 6.28, ox: 0, oy: 0, ar: h / w });
        art.appendChild(el);
        created.push(el);
        continue;
      } else {
        el = document.createElement('div');
        el.className = o.t + (o.cls ? ' ' + o.cls : '');
        if (o.h) el.style.height = o.h + '%';
      }
      el.style.left = o.x + '%';
      el.style.top = o.y + '%';
      el.style.width = o.w + '%';
      if (o.t === 'flow') el.style.height = o.h + '%';
      art.appendChild(el);
      created.push(el);
    }
  });
  $$<HTMLElement>('.seam').forEach((s, i) => {
    const f = SEAM_FLOWS[i];
    if (!f) return;
    const cv = document.createElement('canvas');
    cv.className = 'flow seamflow';
    Object.assign(cv.style, { position: 'absolute', left: f.x + '%', top: f.y + '%', width: f.w + '%', height: f.h + '%' });
    s.querySelector('.band')!.prepend(cv);
    created.push(cv);
    flows.push({ cv, img: image(imgs[f.from]), s: f.s, v: f.v });
  });

  /* ---------- flowing painted falls (ribbon flow-map) ---------- */
  function sizeFlow(f: Flow) {
    const w = f.cv.offsetWidth, h = f.cv.offsetHeight;
    if (!w || !h) return;
    f.w = w; f.h = h;
    f.cv.width = Math.round(w * DPR);
    f.cv.height = Math.round(h * DPR);
    f.ctx = f.cv.getContext('2d')!;
    f.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    f.ctx.imageSmoothingQuality = 'high';
    f.L = Math.max(22, Math.min(64, h * 0.11));
    const n = Math.max(4, Math.round(w / 9));
    if (!f.cols || f.cols.length !== n) f.cols = Array.from({ length: n }, () => ({ ph: Math.random(), sp: rnd(0.8, 1.25) }));
  }
  function drawFlow(f: Flow, t: number) {
    const im = f.img;
    if (!f.ctx || !im.complete || !im.naturalWidth || !f.cols) return;
    const r = f.cv.getBoundingClientRect();
    if (r.bottom < -50 || r.top > innerHeight + 50) return;
    const c = f.ctx, w = f.w!, h = f.h!, N = im.naturalWidth, M = im.naturalHeight, L = f.L!;
    const sx = (f.s[0] / 100) * N, sy = (f.s[1] / 100) * M, sw = (f.s[2] / 100) * N, sh = (f.s[3] / 100) * M;
    const n = f.cols.length, cw = w / n, scw = sw / n;
    c.globalAlpha = 1;
    c.clearRect(0, 0, w, h);
    for (let i = 0; i < n; i++) {
      const col = f.cols[i];
      const phA = ((t * f.v * col.sp) / L + col.ph) % 1, phB = (phA + 0.5) % 1;
      const wB = 1 - Math.abs(2 * phB - 1);
      const x = i * cw, srcX = sx + i * scw;
      c.globalAlpha = 1;
      c.drawImage(im, srcX, sy, scw, sh, x, (phA - 0.5) * L, cw + 0.7, h);
      if (wB > 0.01) {
        c.globalAlpha = wB;
        c.drawImage(im, srcX, sy, scw, sh, x, (phB - 0.5) * L, cw + 0.7, h);
      }
    }
    c.globalAlpha = 1;
  }

  /* ---------- particles ---------- */
  function sizeDust(d: Dust) {
    const w = d.art.offsetWidth, h = d.art.offsetHeight;
    d.W = w; d.H = h;
    d.cv.width = Math.round(w * DPR);
    d.cv.height = Math.round(h * DPR);
    d.ctx = d.cv.getContext('2d')!;
    d.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const o = d.o;
    d.bx = ((o.x ?? 0) / 100) * w; d.by = ((o.y ?? 0) / 100) * h;
    d.bw = ((o.w ?? 100) / 100) * w; d.bh = ((o.h ?? 100) / 100) * h;
    if (!d.p) d.p = Array.from({ length: o.n }, () => ({ u: Math.random(), v: Math.random(), r: Math.random(), ph: rnd(0, 6.28), sp: rnd(0.4, 1.2) }));
  }
  function drawDust(d: Dust, t: number) {
    if (!d.ctx || !d.p) return;
    const rect = d.cv.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const c = d.ctx, k = d.o.kind, bx = d.bx!, by = d.by!, bw = d.bw!, bh = d.bh!;
    c.clearRect(0, 0, d.W!, d.H!);
    for (const p of d.p) {
      let x = 0, y = 0, rad = 1, a = 0, col = '255,214,130';
      if (k === 'wisp') {
        const life = (t * 0.02 * p.sp + p.v) % 0.55;
        x = bx + (p.u + Math.sin(t * 0.6 + p.ph) * 0.012) * bw;
        y = by + (1 - life / 0.55) * bh;
        rad = 0.8 + p.r * 1.8;
        a = Math.min(1, life / 0.14) * Math.abs(Math.sin(2 * t + p.ph)) * (1 - life / 0.55);
      } else if (k === 'mote') {
        const v = (p.v - t * 0.008 * p.sp + 10) % 1;
        x = bx + (p.u + Math.sin(t * 0.4 + p.ph) * 0.02) * bw; y = by + v * bh;
        rad = 0.6 + p.r * 1.4; a = 0.25 + 0.5 * Math.abs(Math.sin(t * 0.8 + p.ph)); col = '255,205,140';
      } else if (k === 'spray') {
        const life = (t * p.sp * 0.8 + p.ph) % 1;
        x = bx + bw * (0.5 + (p.r - 0.5) * 0.6 * life * 1.6); y = by + bh * (0.15 + life * life * 0.9 - life * 0.25);
        rad = 0.7 + p.r * 1.6; a = 1 - life; col = '255,225,150';
      } else if (k === 'spark') {
        const life = (t * p.sp * 0.35 + p.ph) % 1;
        x = bx + bw * (p.u + Math.sin(t * 2 + p.ph) * 0.02 + (p.r - 0.5) * life * 0.3);
        y = by + bh * (1 - life * (0.6 + p.r * 0.4));
        rad = 0.6 + p.r * 1.3; a = (1 - life) * 0.95; col = '255,170,60';
      } else if (k === 'drip') {
        const life = (t * p.sp * 0.55 + p.ph) % 1;
        x = bx + (p.u + Math.sin(t * 3 + p.ph) * 0.015) * bw; y = by + life * life * bh;
        rad = 0.7 + p.r * 1.1; a = Math.sin(life * Math.PI) * 0.85; col = '255,238,175';
      } else if (k === 'glint') {
        x = bx + p.u * bw; y = by + p.v * bh;
        a = Math.pow(Math.max(0, Math.sin(t * (0.8 + 1.6 * p.r) + p.ph)), 6) * 0.75;
        if (a < 0.02) continue;
        const L = 2.5 + p.r * 5;
        c.strokeStyle = `rgba(255,240,200,${a})`;
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(x - L, y); c.lineTo(x + L, y); c.moveTo(x, y - L * 0.7); c.lineTo(x, y + L * 0.7); c.stroke();
        continue;
      } else if (k === 'shimmer') {
        x = bx + p.u * bw; y = by + p.v * bh;
        a = Math.max(0, Math.sin(t * (1.2 + 2 * p.r) + p.ph)) * 0.7;
        c.fillStyle = `rgba(255,230,180,${a})`;
        c.fillRect(x, y, 12 + p.r * 20, 1.2);
        continue;
      }
      c.fillStyle = `rgba(${col},${Math.max(0, a)})`;
      c.beginPath(); c.arc(x, y, rad, 0, 6.283); c.fill();
    }
  }

  /* ---------- layout ---------- */
  const layout = () => { flows.forEach(sizeFlow); dusts.forEach(sizeDust); };
  let rt = 0;
  const onResize = () => { clearTimeout(rt); rt = window.setTimeout(layout, 120); };
  addEventListener('resize', onResize);
  layout();

  /* ---------- pointer + lamp ---------- */
  const lamp = document.createElement('div');
  lamp.className = 'lfx-lamp';
  document.body.appendChild(lamp);
  let mx = -9999, my = -9999, lx = innerWidth / 2, ly = innerHeight / 2;
  const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; if (e.pointerType === 'mouse') lamp.classList.add('on'); };
  const onLeave = () => { mx = my = -9999; lamp.classList.remove('on'); };
  addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);

  /* ---------- hero intro ---------- */
  const hero = root.querySelector<HTMLElement>('.scene.hero')!;
  const heroArt = hero.querySelector<HTMLElement>('.art')!;
  const heroCopy = hero.querySelector<HTMLElement>('.hero-copy')!;
  const h1 = heroCopy.querySelector<HTMLElement>('h1')!;
  if (!RM) {
    $$<HTMLElement>('span', h1).forEach((s, i) =>
      s.animate([{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], { duration: 1200, delay: 250 + i * 70, easing: EASE, fill: 'both' }),
    );
    heroCopy.querySelector('.sub')?.animate(
      [
        { letterSpacing: '1.4em', transform: 'translateY(14px)', clipPath: 'inset(0 50% 0 50%)' },
        { letterSpacing: getComputedStyle(heroCopy.querySelector('.sub')!).letterSpacing, transform: 'translateY(0)', clipPath: 'inset(0 0% 0 0%)' },
      ],
      { duration: 1600, delay: 900, easing: EASE, fill: 'both' },
    );
    heroArt.animate([{ transform: 'scale(1.09)' }, { transform: 'scale(1)' }], { duration: 2600, easing: EASE, composite: 'add' });
    heroCopy.querySelector('.logo-rule')?.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 1200, delay: 1300, easing: EASE, fill: 'both' });
    heroCopy.querySelector('.tagline')?.animate([{ transform: 'translateY(12px)', clipPath: 'inset(0 0 100% 0)' }, { transform: 'translateY(0)', clipPath: 'inset(0 0 0% 0)' }], { duration: 1000, delay: 1500, easing: EASE, fill: 'both' });
  }

  /* ---------- caption reveals ---------- */
  const blocks = $$<HTMLElement>('.cap').map((c) => ({ c, done: false }));
  if (!RM)
    blocks.forEach((b) => {
      $$<HTMLElement>('.ln > span', b.c).forEach((s) => (s.style.transform = 'translateY(105%)'));
      const r = b.c.querySelector<HTMLElement>('.rule');
      if (r) r.style.transform = 'scaleX(0)';
    });
  const reveal = (b: { c: HTMLElement; done: boolean }) => {
    b.done = true;
    if (RM) return;
    $$<HTMLElement>('.ln > span', b.c).forEach((s, i) => {
      s.style.transform = '';
      s.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], { duration: 1000, delay: i * 90, easing: EASE, fill: 'both' });
    });
    const r = b.c.querySelector<HTMLElement>('.rule');
    if (r) {
      r.style.transform = '';
      r.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 1100, delay: 160, easing: EASE, fill: 'both' });
    }
  };

  /* ---------- loop ---------- */
  let raf = 0, last = performance.now(), once = false;
  const t0 = last;
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = RM ? 0 : (now - t0) / 1000;
    const sy = scrollY;
    const hh = hero.offsetHeight;
    if (!RM && sy < hh * 1.2) {
      heroArt.style.transform = `translate3d(0,${sy * 0.32}px,0)`;
      if (!hero.classList.contains('hero-v2')) heroCopy.style.transform = `translate3d(0,${sy * 0.55}px,0)`;
      h1.style.setProperty('--lsx', ((Math.min(1, Math.max(0, sy / hh)) * 0.14).toFixed(4)) + 'em');
    }
    for (const b of blocks) if (!b.done && b.c.getBoundingClientRect().top < innerHeight * 0.8) reveal(b);
    if (!RM || !once) {
      flows.forEach((f) => drawFlow(f, t));
      dusts.forEach((d) => drawDust(d, t));
    }
    for (const s of sprites) {
      const W = s.art.offsetWidth, H = s.art.offsetHeight, sw = (s.o.w / 100) * W, sh = sw * s.ar;
      let x = (s.o.x / 100) * W - sw / 2, y = (s.o.y / 100) * H - sh / 2;
      if (!RM) {
        x += Math.sin(0.35 * t + s.ph) * 0.012 * W;
        y += Math.sin(0.9 * t + s.ph) * 0.014 * H;
        const ar = s.art.getBoundingClientRect(), sc = ar.width / W;
        const cx = ar.left + (x + sw / 2) * sc, cy = ar.top + (y + sh / 2) * sc;
        const dx = cx - mx, dy = cy - my, dist = Math.hypot(dx, dy);
        let tx = 0, ty = 0;
        if (dist < 260 && dist > 0) {
          const p = Math.pow(1 - dist / 260, 1.5) * 90;
          tx = (dx / dist) * p; ty = (dy / dist) * p;
        }
        const k = 1 - Math.exp(-3 * dt);
        s.ox += (tx - s.ox) * k; s.oy += (ty - s.oy) * k;
      }
      const rot = RM ? 0 : Math.sin(0.7 * t + s.ph) * 6 + s.ox * 0.05;
      s.el.style.transform = `translate3d(${x + s.ox}px,${y + s.oy}px,0) rotate(${rot}deg)`;
    }
    lx += (mx - lx) * (1 - Math.exp(-10 * dt));
    ly += (my - ly) * (1 - Math.exp(-10 * dt));
    lamp.style.transform = `translate3d(${lx}px,${ly}px,0)`;
    once = true;
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', onResize);
    removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
    lamp.remove();
    created.forEach((el) => el.remove());
  };
}
