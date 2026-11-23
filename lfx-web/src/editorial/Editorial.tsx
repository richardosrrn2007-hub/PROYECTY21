import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Asterisk, Check, Send } from 'lucide-react';
import { contactHref, TELEGRAM } from '../config';
import { letterStyle } from '../components/Logo';
import './editorial.css';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;
const RM = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(.2,.8,.2,1)';

/* count up a number when `go` turns true */
function useCount(to: number, go: boolean, ms = 1400) {
  const [v, setV] = useState(RM ? to : 0);
  useEffect(() => {
    if (!go || RM) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [go, to, ms]);
  return v;
}

const LINKS = [
  { label: 'Inicio', href: '#top' },
  { label: 'Comunidad', href: '#manifiesto' },
  { label: 'Señales', href: '#senales' },
  { label: 'Resultados', href: '#resultados' },
];

const MARKS = ['XAUUSD', 'Forex', 'Índices', 'NY', 'Asia', 'Institucional'];

/* ---------------------------------------------------------------- HERO */
export function EditorialHero() {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  const [loaded, setLoaded] = useState(false);
  const c47 = useCount(47, loaded);
  const c3 = useCount(3, loaded, 900);

  /* load choreography */
  useEffect(() => {
    const r = root.current!;
    setLoaded(true);
    if (RM) return;
    r.querySelectorAll<HTMLElement>('.ed-title .ln > span').forEach((s, i) =>
      s.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 1000, delay: 150 + i * 110, easing: EASE, fill: 'both' }),
    );
    photo.current?.animate(
      [{ opacity: 0, transform: 'translate3d(0,40px,0)', filter: 'blur(14px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
      { duration: 1300, easing: EASE, fill: 'both' },
    );
    navRef.current?.animate([{ opacity: 0, transform: 'translateY(-16px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: 100, easing: EASE, fill: 'both' });
    r.querySelectorAll<HTMLElement>('.rise').forEach((el, i) =>
      el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: 350 + i * 55, easing: EASE, fill: 'both' }),
    );
    r.querySelector<HTMLElement>('.ed-progress i')?.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 1600, delay: 900, easing: EASE, fill: 'both' });
  }, []);

  /* photo drift */
  useEffect(() => {
    if (RM) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (photo.current) photo.current.style.translate = `0 ${Math.min(scrollY, 1200) * 0.12}px`;
      });
    };
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  /* sliding black pill under the hovered nav link */
  const moveTo = (el: HTMLElement | null) => {
    if (!el) return;
    setPill({ x: el.offsetLeft, w: el.offsetWidth });
  };
  useEffect(() => moveTo(navRef.current?.querySelector('a') as HTMLElement), []);

  return (
    <section ref={root} className="ed-hero" id="top" aria-label="Comunidad LFX">
      <div ref={photo} className="ed-photo">
        <img src="./fotos/hero-trader.webp" alt="Trader de la Comunidad LFX de espaldas" fetchPriority="high" />
      </div>

      <nav ref={navRef} className="ed-nav" aria-label="Menú" onMouseLeave={() => moveTo(navRef.current?.querySelector('a') as HTMLElement)}>
        <span className="ed-nav__pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />
        {LINKS.map((l, i) => (
          <a key={l.href} href={l.href} className={i === 0 ? 'on' : ''} onMouseEnter={(e) => moveTo(e.currentTarget)}>
            {l.label}
          </a>
        ))}
      </nav>

      <p className="ed-date rise">
        Sesiones en vivo
        <br />
        <b>Asia · New York · Institucional</b>
      </p>
      <a className="ed-contact rise" href={contactHref} {...ext}>
        <span>Hablar con Leo</span>
        <ArrowUpRight />
      </a>

      <h1 className="ed-title" aria-label="Comunidad LFX">
        <span className="ln">
          <span>Comunidad</span>
        </span>
        <span className="ln">
          <span>
            <span className="ed-title__lfx">
              {(['L', 'F', 'X'] as const).map((c) => (
                <span key={c} style={letterStyle(c)}>
                  {c}
                </span>
              ))}
            </span>
          </span>
        </span>
        <sup className="rise">(’26)</sup>
      </h1>

      <div className="ed-about">
        <p className="ed-tag rise">● (Sobre LFX)</p>
        <p className="ed-about__copy rise">Una comunidad de trading profesional: operativas en vivo, señales con seguimiento y clases.</p>
        <a className="btn-ed btn-ed--dark rise" href={contactHref} {...ext}>
          <span>Quiero ser parte de LFX</span>
          <ArrowUpRight className="btn-ed__arrow" />
        </a>
      </div>

      <div className="ed-stats rise">
        <div className="ed-stats__dark">
          <p className="ed-big">
            {c47}
            <small>+</small>
          </p>
          <p className="ed-small">Clases grabadas</p>
          <ul className="ed-marks">
            {MARKS.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <a className="ed-bar" href={TELEGRAM} {...ext}>
            <Send /> Canal de Telegram <ArrowUpRight />
          </a>
        </div>
        <div className="ed-stats__photo">
          <img src="./fotos/escritorio.webp" alt="Escritorio de trading con dos monitores" />
          <p className="ed-feed">Sesión en vivo · 18:00</p>
          <p className="ed-stats__num">
            {c3}
            <small>Canales de señales: oro, Forex e índices</small>
          </p>
        </div>
      </div>

      <div className="ed-right">
        <p className="ed-chip rise">
          <span>
            <Check />
          </span>
          Comunidad VIP
        </p>
        <p className="ed-avail rise">
          Operamos
          <br />
          <span>●</span> en vivo cada día
        </p>
        <div className="ed-out rise">
          <p>
            Nuevo
            <br />
            <b>Trading Institucional</b>
            <br />
            <em>[29 clases]</em>
          </p>
          <a className="ed-out__card" href="#clases">
            <img src="./fotos/lingotes.webp" alt="Lingotes de oro" />
            <span className="ed-out__go">
              <ArrowUpRight />
            </span>
          </a>
          <span className="ed-progress">
            <i />
          </span>
        </div>
      </div>

      <div className="ed-plate rise" aria-hidden="true">
        <span className="ed-plate__mark">
          {(['L', 'F', 'X'] as const).map((c) => (
            <span key={c} style={letterStyle(c)}>
              {c}
            </span>
          ))}
        </span>
        <span className="ed-plate__name">Traders</span>
        <span className="ed-plate__menu">
          <i />
          <i />
        </span>
      </div>
      <p className="ed-logos rise" aria-hidden="true">
        XAUUSD <span>·</span> FOREX <span>·</span> ÍNDICES
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------- BAR + STATEMENT */
const STATEMENT =
  'Un trader profesional no predice, se prepara. En la Comunidad LFX aprendes a leer el mercado como las instituciones, operas en vivo junto al equipo y gestionas cada operación con un plan.';

export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const words = STATEMENT.split(' ');
  const [fill, setFill] = useState(RM ? words.length + 3 : 0);
  useEffect(() => {
    if (RM) return;
    const on = () => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      setFill(p * (words.length + 3));
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, [words.length]);

  return (
    <section className="ed-black" id="manifiesto">
      <div className="ed-strip">
        <span>
          Desde <em>2025</em>
        </span>
        <a href="#manifiesto-txt" className="ed-strip__mid">
          Baja <span className="ed-strip__dot">
            <ArrowDown />
          </span>{' '}
          y conoce LFX
        </a>
        <span>
          <em>En vivo</em> cada día
        </span>
      </div>
      <div className="ed-statement" id="manifiesto-txt">
        <p ref={ref} aria-label={STATEMENT}>
          {words.map((w, i) => {
            const t = Math.min(1, Math.max(0, (fill - i) / 3));
            return (
              <span key={i} aria-hidden="true" style={{ color: `rgb(${111 + 133 * t},${111 + 133 * t},${111 + 133 * t})` }}>
                {w}{' '}
              </span>
            );
          })}
        </p>
        <p className="ed-statement__sub">
          Operativas, señales y clases, de la estrategia a la ejecución. <em>Hecho para traders que se toman esto en serio.</em>
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- GOLD BAND (the falls, as a real photo) */
export function GoldBand() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (RM) return;
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.setProperty('--gy', `${p * -60}px`);
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  return (
    <section className="ed-gold" aria-label="Oro">
      <div ref={ref} className="ed-gold__frame">
        <img src="./fotos/oro-vertido.webp" alt="Oro fundido vertiéndose en un molde" />
        <div className="ed-gold__cap">
          <p>(Oro · XAUUSD)</p>
          <h2>El mercado que mejor conocemos.</h2>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- TRUST PANEL */
const INITIALS = ['JU', 'ED', 'ER', 'JO', 'JA', 'RA', 'LU', 'JL'];

export function TrustPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(RM);
  useEffect(() => {
    const el = ref.current;
    if (!el || RM) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const c45 = useCount(45, seen);
  const c900 = useCount(900, seen);
  return (
    <section className="ed-black ed-trust-wrap">
      <div ref={ref} className={`ed-trust${seen ? ' seen' : ''}`}>
        <div className="ed-trust__left">
          <h2>
            Alumnos
            <span className="ed-tile ed-tile--a">
              <Asterisk />
            </span>
            <br />
            que operan
            <br />
            con un plan
            <span className="ed-tile ed-tile--b">
              <i />
              <i />
              <i />
              <i />
            </span>
          </h2>
          <p>Testimonios y resultados compartidos por miembros reales de la comunidad, con sus ganancias y sus pérdidas.</p>
        </div>
        <div className="ed-trust__cards">
          <a className="ed-card ed-card--light" href="#testimonios">
            <div className="ed-avatars">
              {INITIALS.map((a, i) => (
                <span key={a} style={{ transitionDelay: `${i * 60}ms` }}>
                  {a}
                </span>
              ))}
            </div>
            <p className="ed-card__num">
              {(c45 / 10).toFixed(1)}
              <small>/5</small>
            </p>
            <p className="ed-card__lbl">Valoración de la comunidad</p>
          </a>
          <a className="ed-card ed-card--dark" href="#resultados">
            <p className="ed-card__num">
              +{c900}
              <small>pips</small>
            </p>
            <p className="ed-card__lbl">NAS100 · TP máximo alcanzado</p>
            <svg className="ed-laurel" viewBox="0 0 120 120" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M60 104c-22-6-36-24-36-46" />
                <path d="M60 104c22-6 36-24 36-46" />
                {[0, 1, 2, 3, 4].map((k) => (
                  <g key={k}>
                    <ellipse cx={30 + k * 2} cy={88 - k * 13} rx="7" ry="3.2" transform={`rotate(${-50 + k * 12} ${30 + k * 2} ${88 - k * 13})`} />
                    <ellipse cx={90 - k * 2} cy={88 - k * 13} rx="7" ry="3.2" transform={`rotate(${50 - k * 12} ${90 - k * 2} ${88 - k * 13})`} />
                  </g>
                ))}
              </g>
              <text x="60" y="56" textAnchor="middle" fontSize="8.5" fill="currentColor" letterSpacing="1">SEÑAL</text>
              <text x="60" y="68" textAnchor="middle" fontSize="8.5" fill="currentColor" letterSpacing="1">VERIFICADA</text>
            </svg>
            <p className="ed-card__note">Resultado publicado en el canal de índices de la comunidad.</p>
          </a>
          <div className="ed-card ed-card--photo">
            <img src="./fotos/perfil-azul.webp" alt="Miembro de la Comunidad LFX" />
          </div>
        </div>
      </div>
    </section>
  );
}
