import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ChevronLeft, ChevronRight, Handshake, Instagram, LineChart, Plus, Star, Users, Video } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import FadeIn from '../components/FadeIn';
import LogoMark from '../components/Logo';
import { ContactButton, TelegramButton, TikTokIcon, WhatsAppIcon } from '../components/Buttons';
import { contactHref, INSTAGRAM, TELEGRAM, TIKTOK } from '../config';

/* ---------- Cave: about + two rows of class covers ---------- */
const COVERS = [
  './cursos/c01.webp', './cursos/c02.webp', './cursos/c03.webp', './cursos/c04.webp', './cursos/c05.webp',
  './cursos/c06.webp', './cursos/c07.webp', './cursos/c08.webp', './cursos/c09.webp', './cursos/c10.webp',
  './cursos/c11.webp', './cursos/c12.webp', './cursos/c13.webp', './cursos/c14.webp', './cursos/c15.webp',
  './cursos/c16.webp', './cursos/c17.webp', './cursos/c18.webp', './cursos/c19.webp', './cursos/c20.webp',
  './cursos/c21.webp',
];

export function AboutBlock() {
  return (
    <div className="block about">
      <FadeIn y={20}>
        <p className="kicker">01 · La comunidad</p>
      </FadeIn>
      <FadeIn delay={0.1} y={40}>
        <h2 className="hero-heading">Comunidad LFX</h2>
      </FadeIn>
      <AnimatedText
        className="lit"
        text="Una comunidad enfocada en aprender y operar el trading de manera profesional. Operativas en vivo cada día, señales con seguimiento y clases grabadas para entender el mercado como lo hacen las instituciones."
      />
    </div>
  );
}

export function CoverBelt({ sceneRef }: { sceneRef: RefObject<HTMLElement> }) {
  const [x, setX] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = sceneRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + scrollY;
      setX((scrollY - top + innerHeight) * 0.3);
    };
    on();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => {
      removeEventListener('scroll', on);
      removeEventListener('resize', on);
    };
  }, [sceneRef]);
  const row1 = [...COVERS.slice(0, 11), ...COVERS.slice(0, 11), ...COVERS.slice(0, 11)];
  const row2 = [...COVERS.slice(11), ...COVERS.slice(11), ...COVERS.slice(11)];
  return (
    <div className="belt" aria-label="Portadas de las clases de la Comunidad LFX">
      <div className="belt-row" style={{ transform: `translateX(${x - 900}px)` }}>
        {row1.map((src, i) => (
          <img key={i} src={src} alt="" decoding="async" />
        ))}
      </div>
      <div className="belt-row" style={{ transform: `translateX(${-(x - 200)}px)` }}>
        {row2.map((src, i) => (
          <img key={i} src={src} alt="" decoding="async" />
        ))}
      </div>
    </div>
  );
}

/* ---------- Mine: how it works ---------- */
const STEPS = [
  { icon: Users, title: 'Te unes a la Comunidad LFX', text: 'Le escribes a Leo, eliges tu plan y entras a los canales de la comunidad.' },
  { icon: Video, title: 'Te conectas a las operativas en vivo', text: 'Sesiones Asia, New York e Institucional, con el enlace en Telegram.' },
  { icon: LineChart, title: 'Recibes y revisas las señales', text: 'Cada señal llega con su entrada, sus objetivos y su seguimiento.' },
  { icon: Handshake, title: 'Decides cómo participar', text: 'Sigues el análisis junto a la comunidad y operas con tu propio plan de riesgo.' },
];

export function StepsBlock() {
  return (
    <div className="block steps" id="como-funciona">
      <FadeIn y={20}>
        <p className="kicker">02 · Cómo funciona</p>
      </FadeIn>
      <FadeIn delay={0.1} y={40}>
        <h2 className="hero-heading">De la entrada a la sesión</h2>
      </FadeIn>
      <ol>
        {STEPS.map((s, i) => (
          <FadeIn as="li" key={s.title} delay={0.15 + i * 0.15} x={40} y={0}>
            <span className="step-icon">
              <s.icon strokeWidth={1.6} />
              {i < STEPS.length - 1 && <ArrowDown className="step-arrow" strokeWidth={1.5} />}
            </span>
            <span className="txt">
              <b>{s.title}</b>
              <span>{s.text}</span>
            </span>
          </FadeIn>
        ))}
      </ol>
      <FadeIn delay={0.8}>
        <ContactButton label="Quiero ser parte de LFX" />
      </FadeIn>
    </div>
  );
}

/* ---------- Refinery: what you'll find ---------- */
const SERVICES = [
  { img: './comunidad/sesion-asia.webp', alt: 'Aviso de la sesión Asia en vivo en Telegram', title: 'Operativas y análisis en vivo' },
  { img: './comunidad/senales-forex.webp', alt: 'Canal de señales Forex con objetivos alcanzados', title: 'Señales en Forex, oro e índices' },
  { img: './comunidad/clase-subida.webp', alt: 'Aviso de una clase de Trading Institucional subida a la academia', title: 'Clases grabadas' },
  { img: './cursos/c16.webp', alt: 'Portada del intensivo de Scalping', title: 'Institucional, scalping y riesgo' },
  { img: './comunidad/bienvenida.webp', alt: 'Mensaje de bienvenida a la comunidad en Telegram', title: 'Comunidad y avisos' },
];

export function ServicesBlock() {
  return (
    <div className="services" id="servicios">
      <FadeIn y={20}>
        <p className="kicker">03 · Qué encontrarás</p>
      </FadeIn>
      <FadeIn delay={0.1} y={40}>
        <h2 className="hero-heading">Todo en un solo lugar</h2>
      </FadeIn>
      <div className="service-row">
        {SERVICES.map((s, i) => (
          <FadeIn key={s.title} delay={0.15 + i * 0.1} y={70} className="service">
            <div className="service-img">
              <img src={s.img} alt={s.alt} decoding="async" />
            </div>
            <span className="num hero-heading">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.title}</h3>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.5} className="services-cta">
        <ContactButton label="Conocer los planes" />
      </FadeIn>
    </div>
  );
}

/* ---------- Vault: results carousel, rating and comments ---------- */
const RESULTS = [
  { src: './comunidad/resultados-semana.webp', alt: 'Resultados semanales del VIP LFX publicados en Telegram: 9 de 10 operaciones favorables' },
  { src: './resultados/r1.webp', alt: 'Historial de operaciones en MetaTrader con BTCUSD, ETHUSD y XAUUSD' },
  { src: './resultados/r2.webp', alt: 'Operación de venta en XAUUSD cerrada en take profit con 105,61 USDT de ganancia' },
  { src: './resultados/r3.webp', alt: 'Historial en MetaTrader con operaciones en XAUUSD y EURUSD' },
  { src: './resultados/r4.webp', alt: 'Historial de ventas en XAUUSD de junio y julio' },
  { src: './resultados/r5.webp', alt: 'Historial del 13 de julio con operaciones en XAUUSD' },
];

/* Real community rating and comments go here when Leo sends them. Empty = hidden. */
const RATING = null as { value: number; count: number; source: string } | null;
const COMMENTS: { name: string; text: string; stars: number }[] = [];

export function JoinBlock() {
  return (
    <div className="block join" id="contacto">
      <FadeIn y={20}>
        <p className="kicker">04 · Resultados</p>
      </FadeIn>
      <FadeIn delay={0.1} y={40}>
        <h2 className="hero-heading">Un trader profesional no predice, se prepara.</h2>
      </FadeIn>
      <FadeIn delay={0.25}>
        <ContactButton label="Hablar con Leo" />
      </FadeIn>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="stars" aria-label={`${n} de 5 estrellas`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={i < Math.round(n) ? 'on' : ''} />
      ))}
    </span>
  );
}

function Carousel({ count, children, label }: { count: number; children: ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const stepPx = () => {
    const t = track.current;
    const item = t?.children[0] as HTMLElement | undefined;
    return item ? item.offsetWidth + 16 : t?.clientWidth || 300;
  };
  const go = (d: number) => track.current?.scrollBy({ left: d * stepPx(), behavior: 'smooth' });
  const onScroll = () => {
    const t = track.current;
    if (t) setIdx(Math.min(count - 1, Math.round(t.scrollLeft / stepPx())));
  };
  return (
    <div className="carousel" aria-label={label}>
      <button type="button" className="nav-btn prev" onClick={() => go(-1)} aria-label="Anterior">
        <ChevronLeft />
      </button>
      <div className="track" ref={track} onScroll={onScroll}>
        {children}
      </div>
      <button type="button" className="nav-btn next" onClick={() => go(1)} aria-label="Siguiente">
        <ChevronRight />
      </button>
      <div className="dots">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={i === idx ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
}

export function ResultsBlock() {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  return (
    <div className="results" id="resultados">
      {RATING && (
        <div className="rating">
          <Stars n={RATING.value} />
          <b>{RATING.value.toFixed(1)}</b>
          <span>
            {RATING.count} opiniones · {RATING.source}
          </span>
        </div>
      )}
      <Carousel count={RESULTS.length} label="Capturas de resultados">
        {RESULTS.map((r, i) => (
          <button key={r.src} type="button" className="phone" onClick={() => setOpen(i)} aria-label={`Ampliar: ${r.alt}`}>
            <img src={r.src} alt={r.alt} decoding="async" />
          </button>
        ))}
      </Carousel>
      {COMMENTS.length > 0 && (
        <Carousel count={COMMENTS.length} label="Comentarios de la comunidad">
          {COMMENTS.map((c) => (
            <figure key={c.name} className="comment">
              <Stars n={c.stars} />
              <blockquote>{c.text}</blockquote>
              <figcaption>{c.name}</figcaption>
            </figure>
          ))}
        </Carousel>
      )}
      <p className="note">Capturas de operaciones reales, con ganancias y pérdidas. Resultados pasados no garantizan resultados futuros.</p>
      {open !== null &&
        createPortal(
          <div className="lightbox" role="dialog" aria-label="Captura ampliada" onClick={() => setOpen(null)}>
            <img src={RESULTS[open].src} alt={RESULTS[open].alt} />
          </div>,
          document.body,
        )}
    </div>
  );
}

/* ---------- After the vault: FAQ + footer ---------- */
const FAQ = [
  {
    q: '¿Qué incluye la Comunidad LFX?',
    a: 'Operativas y análisis en vivo cada día (sesiones Asia, New York e Institucional), señales con seguimiento en Forex, oro e índices, clases grabadas de Trading Institucional, Scalping y Mentalidad, guías de gestión de riesgo y avisos de cada sesión en Telegram.',
  },
  {
    q: '¿Cómo puedo entrar a la comunidad?',
    a: 'Escríbele a Leo por WhatsApp. Te explica los pasos de acceso y los planes disponibles, y te da la bienvenida a los canales de la comunidad.',
    cta: true,
  },
  {
    q: '¿Necesito experiencia para participar?',
    a: 'No. Las clases grabadas empiezan por lo básico: cómo usar TradingView, leer las velas y entender la estructura del mercado. También hay una guía para copiar correctamente las señales y cinco guías de gestión de riesgo para que aprendas sin arriesgar de más.',
  },
  {
    q: '¿Hay reembolso?',
    a: 'Sí. Por los resultados y por la fidelidad que tenemos en nuestra comunidad, contamos con reembolsos. Escríbenos por WhatsApp y Leo te explica cómo solicitarlo.',
    cta: true,
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="faq" id="faq">
      <FadeIn y={20}>
        <p className="kicker">05 · Preguntas frecuentes</p>
      </FadeIn>
      <FadeIn delay={0.1} y={40}>
        <h2 className="hero-heading">Preguntas frecuentes</h2>
      </FadeIn>
      <div className="faq-list">
        {FAQ.map((f, i) => (
          <FadeIn key={f.q} delay={0.1 + i * 0.08} className={`faq-item${open === i ? ' open' : ''}`}>
            <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span>{f.q}</span>
              <Plus className="plus" />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                  className="faq-a"
                >
                  <p>{f.a}</p>
                  {f.cta && (
                    <a href={contactHref} target="_blank" rel="noopener noreferrer" className="faq-link">
                      <WhatsAppIcon className="h-4 w-4" /> Hablar con Leo
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>
        ))}
      </div>
      <p className="risk">El trading conlleva riesgo de pérdida de capital. El contenido de la Comunidad LFX es educativo y no constituye asesoría financiera.</p>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <LogoMark className="text-[64px] md:text-[88px]" />
      <p className="footer-name">Comunidad LFX</p>
      <div className="footer-cta">
        <TelegramButton label="Únete al canal de Telegram" />
        <ContactButton label="Hablar con Leo" />
      </div>
      <div className="socials">
        <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" aria-label="Telegram de Comunidad LFX" className="tg">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9.04 15.47 8.87 19.5c.36 0 .52-.16.71-.35l1.7-1.63 3.53 2.58c.65.36 1.1.17 1.28-.6l2.32-10.88c.21-.96-.35-1.34-.98-1.1L3.75 12.79c-.93.36-.92.89-.16 1.12l3.49 1.09 8.1-5.11c.38-.25.73-.11.44.14Z" />
          </svg>
        </a>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Leonardo LFX">
          <Instagram />
        </a>
        <a href={TIKTOK} target="_blank" rel="noopener noreferrer" aria-label="TikTok de Leonardo Forex">
          <TikTokIcon />
        </a>
      </div>
    </footer>
  );
}
