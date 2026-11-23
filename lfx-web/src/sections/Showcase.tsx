import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { contactHref } from '../config';
import { CARDS, useZoom } from './Sections';
import './showcase.css';

/* Real academy video: drop the file in public/video/ and set the path here.
   While empty, the player runs a 30-second tour of real platform screens. */
const ACADEMY_VIDEO = '';
const RM = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const TOUR = [
  { src: './tour/f1.webp', cap: 'Trading Institucional', sub: '29 clases · empieza por TradingView' },
  { src: './tour/f2.webp', cap: 'La realidad del trading institucional', sub: 'Cómo se mueve el dinero de verdad' },
  { src: './tour/f3.webp', cap: 'Estrategia de Scalping', sub: '13 clases · sesiones Asia y New York' },
  { src: './tour/f4.webp', cap: 'Mentalidad del Trader', sub: 'Psicología y bitácora profesional' },
  { src: './tour/f5.webp', cap: 'Gestión de riesgo', sub: 'Cinco guías para proteger tu capital' },
  { src: './tour/f6.webp', cap: 'Sesiones en vivo', sub: 'Calendario con Asia, New York e Institucional' },
];
const SLIDE_MS = 5000;

const PROGRAMS = [
  { n: 29, name: 'Trading Institucional', d: 'Estructura real del mercado, Fibonacci institucional, macro y TradingView.' },
  { n: 13, name: 'Estrategia de Scalping', d: 'Entradas de alta precisión en timeframes bajos, con intensivos.' },
  { n: 5, name: 'Mentalidad del Trader', d: 'Disciplina, control emocional y bitácora.' },
];

/* ---------------------------------------------------------------- ACADEMY TOUR */
export function AcademySection() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(!RM);
  const [t, setT] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.35 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (ACADEMY_VIDEO || !playing) return;
    let raf = 0, last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      if (visible.current) {
        setT((v) => {
          const nv = v + dt;
          if (nv >= SLIDE_MS) {
            setI((k) => (k + 1) % TOUR.length);
            return 0;
          }
          return nv;
        });
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const go = (k: number) => {
    setI(k);
    setT(0);
  };

  return (
    <section className="sc-academy" id="clases">
      <div className="sc-academy__text">
        <FadeIn y={16}>
          <p className="sc-kicker">(01) La academia por dentro</p>
        </FadeIn>
        <FadeIn delay={0.08} y={30}>
          <h2 className="sc-h2">Todo lo que vas a estudiar, en una sola plataforma.</h2>
        </FadeIn>
        <ul className="sc-programs">
          {PROGRAMS.map((p, k) => (
            <FadeIn as="li" key={p.name} delay={0.15 + k * 0.08} y={20}>
              <span className="sc-programs__n">{String(p.n).padStart(2, '0')}</span>
              <span>
                <b>{p.name}</b>
                <small>{p.d}</small>
              </span>
              <em>clases</em>
            </FadeIn>
          ))}
        </ul>
        <FadeIn delay={0.4}>
          <a className="btn-ed btn-ed--light" href={contactHref} target="_blank" rel="noopener noreferrer">
            <span>Quiero acceder a la academia</span>
            <ArrowUpRight className="btn-ed__arrow" />
          </a>
        </FadeIn>
      </div>

      <FadeIn delay={0.1} y={40} className="sc-player">
        <div className="sc-browser">
          <span className="sc-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="sc-url">leonardofx.com/academia</span>
        </div>
        <div ref={box} className="sc-screen">
          {ACADEMY_VIDEO ? (
            <video src={ACADEMY_VIDEO} autoPlay muted loop playsInline controls />
          ) : (
            <>
              {TOUR.map((f, k) => (
                <img key={f.src} src={f.src} alt={f.cap} className={k === i ? 'on' : ''} decoding="async" />
              ))}
              <div className="sc-caption" key={i}>
                <b>{TOUR[i].cap}</b>
                <span>{TOUR[i].sub}</span>
              </div>
              <button type="button" className="sc-toggle" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pausar' : 'Reproducir'}>
                {playing ? <Pause /> : <Play />}
              </button>
            </>
          )}
        </div>
        {!ACADEMY_VIDEO && (
          <div className="sc-progress" role="tablist" aria-label="Pantallas del recorrido">
            {TOUR.map((f, k) => (
              <button key={f.src} type="button" role="tab" aria-selected={k === i} aria-label={f.cap} onClick={() => go(k)}>
                <i style={{ transform: `scaleX(${k < i ? 1 : k === i ? t / SLIDE_MS : 0})` }} />
              </button>
            ))}
          </div>
        )}
        <p className="sc-player__note">Recorrido de 30 s por la plataforma real de la academia.</p>
      </FadeIn>
    </section>
  );
}

/* ---------------------------------------------------------------- SERVICES INDEX */
const DESC: Record<string, string> = {
  'Operativas y análisis en vivo': 'Sesiones Asia, New York e Institucional. Analizamos el mercado en tiempo real y solo entramos con confirmación.',
  'Señales de oro — XAUUSD': 'El canal principal: entradas, Stop Loss y varios objetivos, con seguimiento hasta el cierre.',
  'Señales Forex': 'Canal exclusivo de pares de divisas con el método LFX y el resultado semanal publicado.',
  'Señales de índices': 'NAS100 y otros índices en su propio canal, con cada TP alcanzado reportado.',
  'Clases grabadas': 'Trading Institucional, Scalping y Mentalidad, organizados por secciones en la academia.',
  'Trading institucional, scalping y gestión de riesgo': 'Cinco guías de riesgo: lotaje, Risk/Reward, tipos de gestión y tu plan personal.',
  'Comunidad y avisos': 'Bienvenida, guía para copiar señales y aviso de cada sesión en Telegram.',
};

export function ServicesIndex() {
  const items = CARDS.filter((c) => c.img);
  const [on, setOn] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const { open, view } = useZoom();

  /* the row crossing the middle of the screen becomes active while scrolling */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setOn(Number((e.target as HTMLElement).dataset.k))),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section className="sc-index" id="servicios">
      <div className="sc-index__head">
        <p className="sc-kicker">(03) Qué encontrarás</p>
        <h2 className="sc-h2">Todo en un solo lugar.</h2>
      </div>
      <div className="sc-index__body">
        <ol className="sc-index__list">
          {items.map((c, k) => (
            <li key={c.title} ref={(el) => (rows.current[k] = el)} data-k={k} className={k === on ? 'on' : ''} onMouseEnter={() => setOn(k)}>
              <button type="button" onClick={() => setOn(k)}>
                <span className="sc-index__n">{String(k + 1).padStart(2, '0')}</span>
                <span className="sc-index__t">{c.title}</span>
                <ArrowUpRight className="sc-index__a" />
              </button>
              <p>{DESC[c.title]}</p>
              <button type="button" className="sc-index__thumb" onClick={() => open({ src: c.img!, alt: c.alt || c.title })} aria-label={`Ampliar: ${c.title}`}>
                <img src={c.img} alt="" decoding="async" />
              </button>
            </li>
          ))}
        </ol>
        <div className="sc-index__media">
          {items.map((c, k) => (
            <button key={c.title} type="button" className={k === on ? 'on' : ''} onClick={() => open({ src: c.img!, alt: c.alt || c.title })} aria-label={`Ampliar: ${c.title}`} tabIndex={k === on ? 0 : -1}>
              <img src={c.img} alt={c.alt} decoding="async" />
            </button>
          ))}
          <span className="sc-index__count">
            {String(on + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="sc-index__cta">
        <a className="btn-ed btn-ed--light" href={contactHref} target="_blank" rel="noopener noreferrer">
          <span>Conocer los planes</span>
          <ArrowUpRight className="btn-ed__arrow" />
        </a>
      </div>
      {view}
    </section>
  );
}
