import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { letterStyle } from '../components/Logo';
import { ContactButton, TelegramButton } from '../components/Buttons';
import { VIDEO_POSTER, VIDEO_SRC } from '../config';
import { CARDS, useZoom } from '../sections/Sections';
import './mostar.css';

/* Cinematic sticky scroll (Mostar-style), built from the seven LFX layers:
   1 sky · 2 glow · 3 canyon · 4/5 vault doors · 6 gold falls · 7 gold pool.
   Story: canyon + LFX → the vault closes (Comunidad LFX) → it opens onto the
   gold pool (presentation video) → the seven channel cards slide in. */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (e0: number, e1: number, v: number) => {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (s: number, a: number, b: number, c: number, d: number) => {
  const enter = smooth(a, b, s), exit = smooth(c, d, s);
  return { enter, exit, active: enter * (1 - exit) };
};
export const VIDEO_SCROLL = 2150; // scroll distance where the video panel is centred

const SLIDES = CARDS.filter((c) => c.img);

export default function MostarHero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(SLIDES.length);
  const [jump, setJump] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const { open, view } = useZoom();

  /* ---------- scroll + pointer engine ---------- */
  useEffect(() => {
    const sec = section.current!, st = stage.current!;
    const rm = matchMedia('(prefers-reduced-motion: reduce)');
    let target = 0, cur = 0, mx = 0, my = 0, tmx = 0, tmy = 0, init = false, pending = false;
    const set = (k: string, v: string | number) => st.style.setProperty(k, String(v));
    const dist = () => clamp(-sec.getBoundingClientRect().top, 0, sec.offsetHeight - innerHeight);

    const update = () => {
      pending = false;
      target = dist();
      if (!init || rm.matches) { cur = target; init = true; } else cur = lerp(cur, target, 0.14);
      if (Math.abs(cur - target) < 0.08) cur = target;
      mx = lerp(mx, tmx, 0.12); my = lerp(my, tmy, 0.12);
      const px = rm.matches ? 0 : mx, py = rm.matches ? 0 : my;
      const s = cur;

      const intro = smooth(80, 620, s);
      const close = smooth(420, 1150, s);
      const openV = smooth(1450, 2000, s);
      const comunidad = seg(s, 1000, 1250, 1450, 1650);
      const video = seg(s, 1900, 2150, 2700, 2950);
      const cardsIn = Math.pow(smooth(2900, 3550, s), 1.4);
      const ctrls = smooth(3300, 3600, s);
      const back = 1 + clamp(s / 1500) * 0.22;
      const shade = Math.max(comunidad.active * 0.62, video.active * 0.42, cardsIn * 0.5);

      set('--back-scale', back.toFixed(4));
      set('--back-x', `${px * -14}px`);
      set('--back-y', `${py * -6}px`);
      set('--glow-op', (0.85 - close * 0.4).toFixed(3));
      set('--falls-y', `${py * 8 - close * 140}px`);
      set('--falls-scale', (1 + close * 0.35).toFixed(4));
      set('--falls-op', (1 - close).toFixed(3));
      const doorOff = (1 - close) * 46 + openV * 64;
      set('--door-l', `calc(${-doorOff}vw + ${px * 16}px)`);
      set('--door-r', `calc(${doorOff}vw + ${px * 16}px)`);
      set('--door-scale', (1 + openV * 0.28).toFixed(4));
      set('--pool-op', clamp(close * 1.2).toFixed(3));
      set('--pool-scale', (1.14 - openV * 0.1).toFixed(4));
      set('--pool-y', `${py * 6}px`);
      set('--shade', shade.toFixed(3));
      set('--title-y', `${intro * -200}px`);
      set('--title-scale', (1 - intro * 0.08).toFixed(4));
      set('--title-op', (1 - intro).toFixed(3));
      set('--intro-y', `${intro * 80}px`);
      set('--intro-op', (1 - intro).toFixed(3));
      st.classList.toggle('intro-off', intro > 0.98);
      set('--p1-op', comunidad.active.toFixed(3));
      set('--p1-y', `${-comunidad.exit * 80 + (1 - comunidad.enter) * 56}px`);
      set('--p2-op', video.active.toFixed(3));
      set('--p2-y', `${-video.exit * 80 + (1 - video.enter) * 56}px`);
      st.classList.toggle('p2-on', video.active > 0.5);
      set('--cards-x', `${(1 - cardsIn) * 120}vw`);
      set('--cards-vis', cardsIn > 0.01 ? 'visible' : 'hidden');
      set('--ctrl-op', ctrls.toFixed(3));
      st.classList.toggle('ctrl-on', ctrls > 0.98);

      if (Math.abs(cur - target) > 0.08 || Math.abs(mx - tmx) > 0.001 || Math.abs(my - tmy) > 0.001) tick();
    };
    const tick = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
    const onMove = (e: PointerEvent) => { tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; tick(); };
    addEventListener('scroll', tick, { passive: true });
    addEventListener('resize', tick);
    addEventListener('pointermove', onMove, { passive: true });
    tick();
    return () => {
      removeEventListener('scroll', tick);
      removeEventListener('resize', tick);
      removeEventListener('pointermove', onMove);
    };
  }, []);

  /* ---------- infinite card slider (3 sets, jump back to the middle set) ---------- */
  const n = SLIDES.length;
  const all = [...SLIDES, ...SLIDES, ...SLIDES];
  useEffect(() => {
    const measure = () => {
      const t = track.current;
      const c = t?.children[0] as HTMLElement | undefined;
      if (!t || !c) return;
      setShift(-(c.offsetWidth + parseFloat(getComputedStyle(t).columnGap || '0')) * active);
    };
    measure();
    addEventListener('resize', measure);
    return () => removeEventListener('resize', measure);
  }, [active]);
  const normalize = () => {
    if (active >= n * 2 || active < n) {
      setJump(true);
      setActive((a) => (a >= n * 2 ? a - n : a + n));
      requestAnimationFrame(() => requestAnimationFrame(() => setJump(false)));
    }
  };

  const toVideo = () => {
    const top = (section.current?.getBoundingClientRect().top ?? 0) + scrollY;
    scrollTo({ top: top + VIDEO_SCROLL, behavior: 'smooth' });
  };

  return (
    <section ref={section} className="mostar" id="top" aria-label="Comunidad LFX">
      <div ref={stage} className="m-stage">
        <div className="m-world">
          <img className="m-img m-sky" src="./portada/capa1.webp" alt="" />
          <div className="m-back">
            <img className="m-img m-glow" src="./portada/capa2.webp" alt="" />
            <img className="m-img m-canyon" src="./portada/capa3.webp" alt="" />
          </div>
          <img className="m-img m-pool" src="./portada/capa7.webp" alt="" />
          <img className="m-img m-falls" src="./portada/capa6.webp" alt="" />
          <img className="m-img m-door m-door-l" src="./portada/capa4.webp" alt="" />
          <img className="m-img m-door m-door-r" src="./portada/capa5.webp" alt="" />
          <div className="m-shade" />
        </div>

        {/* intro: logo + buttons */}
        <div className="m-intro">
          <h1 className="m-title" aria-label="LFX">
            {(['L', 'F', 'X'] as const).map((c) => (
              <span key={c} aria-hidden="true" style={letterStyle(c)}>
                {c}
              </span>
            ))}
          </h1>
          <p className="m-lead">Comunidad de trading profesional: operativas en vivo, señales con seguimiento y clases.</p>
          <div className="m-cta">
            <ContactButton label="Quiero ser parte de LFX" />
            <TelegramButton label="Canal de Telegram" />
          </div>
          <button type="button" className="m-watch" onClick={toVideo}>
            <Play /> Ver la presentación
          </button>
        </div>

        {/* panel 1: the vault closes */}
        <div className="m-panel m-p1" id="comunidad">
          <p className="kicker">01 · La comunidad</p>
          <h2>Comunidad LFX</h2>
          <p>
            Una comunidad enfocada en aprender y operar trading de manera profesional. Participa en operativas en vivo, recibe señales con seguimiento y aprende cómo se
            mueve el mercado, cómo operan las instituciones y cómo gestionar cada operación como un profesional.
          </p>
          <dl className="m-facts">
            <div>
              <dt>47</dt>
              <dd>clases grabadas</dd>
            </div>
            <div>
              <dt>3</dt>
              <dd>canales de señales</dd>
            </div>
          </dl>
        </div>

        {/* panel 2: the vault opens onto the gold pool → video */}
        <div className="m-panel m-p2">
          <p className="kicker">Presentación</p>
          <div className="m-video">
            {VIDEO_SRC ? (
              <video src={VIDEO_SRC} poster={VIDEO_POSTER || undefined} controls playsInline preload="metadata" />
            ) : (
              <div className="video-pending" role="img" aria-label="Espacio para el video de presentación">
                <span className="play">
                  <Play />
                </span>
                <b>Video de presentación de la Comunidad LFX</b>
                <small>Muy pronto</small>
              </div>
            )}
          </div>
        </div>

        {/* cards fly in */}
        <div className="m-cards" id="servicios">
          <div className="m-cards-head">
            <p className="kicker">Qué encontrarás</p>
            <h2>Todo en un solo lugar</h2>
          </div>
          <div ref={track} className={`m-track${jump ? ' jumping' : ''}`} style={{ transform: `translate3d(${shift}px,0,0)` }} onTransitionEnd={normalize}>
            {all.map((c, i) => (
              <article
                key={i}
                className={`m-card${i === active ? ' on' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={`Ampliar: ${c.title}`}
                onClick={() => open({ src: c.img!, alt: c.alt || c.title })}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open({ src: c.img!, alt: c.alt || c.title }))}
              >
                <div className="m-card-img">
                  <img src={c.img} alt="" decoding="async" />
                </div>
                <span className="m-card-num">{String((i % n) + 1).padStart(2, '0')}</span>
                <h3>{c.title}</h3>
              </article>
            ))}
          </div>
          <div className="m-ctrl">
            <button type="button" onClick={() => setActive((a) => a - 1)} aria-label="Anterior">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => setActive((a) => a + 1)} aria-label="Siguiente">
              <ArrowRight />
            </button>
            <ContactButton label="Conocer los planes" />
          </div>
        </div>
      </div>
      {view}
    </section>
  );
}
