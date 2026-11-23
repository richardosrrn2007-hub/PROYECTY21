import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, ChevronLeft, ChevronRight, Handshake, ImageOff, Instagram, LineChart, Plus, Star, Users, Video } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import FadeIn from '../components/FadeIn';
import LogoMark from '../components/Logo';
import { ContactButton, TelegramButton, TikTokIcon, WhatsAppIcon } from '../components/Buttons';
import { contactHref, INSTAGRAM, TELEGRAM, TIKTOK, vipHref } from '../config';

/* ---------- shared: zoomable image + carousel ---------- */
type Img = { src: string; alt: string };

export function useZoom() {
  const [img, setImg] = useState<Img | null>(null);
  const open = (i: Img) => {
    history.pushState({ lfxZoom: true }, '');
    setImg(i);
  };
  const close = (e?: { stopPropagation: () => void }) => {
    e?.stopPropagation();
    setImg(null);
    /* drop the history entry we added, once, without ever leaving the page */
    if (history.state?.lfxZoom) history.replaceState(null, '');
  };
  useEffect(() => {
    if (!img) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close();
    const pop = () => setImg(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    addEventListener('keydown', k);
    addEventListener('popstate', pop);
    return () => {
      document.body.style.overflow = prev;
      removeEventListener('keydown', k);
      removeEventListener('popstate', pop);
    };
  }, [img]);
  const view =
    img &&
    createPortal(
      <div className="lightbox" role="dialog" aria-modal="true" aria-label="Imagen ampliada" onClick={close}>
        <button type="button" className="lb-close" onClick={close} aria-label="Cerrar">
          <X />
        </button>
        <img src={img.src} alt={img.alt} onClick={(e) => e.stopPropagation()} draggable={false} />
        <span className="lb-hint">Toca fuera de la imagen o la X para cerrar</span>
      </div>,
      document.body,
    );
  return { open, view };
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

function Stars({ n }: { n: number }) {
  return (
    <span className="stars" aria-label={`${n} de 5 estrellas`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, n - i));
        return (
          <span key={i} className="star">
            <Star className="bgs" />
            <span className="fg" style={{ width: `${fill * 100}%` }}>
              <Star />
            </span>
          </span>
        );
      })}
    </span>
  );
}

const Head = ({ kicker, title, center = true }: { kicker: string; title: string; center?: boolean }) => (
  <div className={`sec-head${center ? ' center' : ''}`}>
    <FadeIn y={16}>
      <p className="kicker">{kicker}</p>
    </FadeIn>
    <FadeIn delay={0.08} y={30}>
      <h2 className="hero-heading">{title}</h2>
    </FadeIn>
  </div>
);

/* ---------- 2 + 3. Comunidad LFX + class carousel ---------- */
const COVERS = [
  './cursos/c01.webp', './cursos/c02.webp', './cursos/c03.webp', './cursos/c04.webp', './cursos/c05.webp',
  './cursos/c06.webp', './cursos/c07.webp', './cursos/c08.webp', './cursos/c09.webp', './cursos/c10.webp',
  './cursos/c11.webp', './cursos/c12.webp', './cursos/c13.webp', './cursos/c14.webp', './cursos/c15.webp',
  './cursos/c16.webp', './cursos/c17.webp', './cursos/c18.webp', './cursos/c19.webp', './cursos/c20.webp',
  './cursos/c21.webp',
];

export function ComunidadSection({ classesOnly = false }: { classesOnly?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [x, setX] = useState(0);
  const { open, view } = useZoom();
  useEffect(() => {
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + scrollY;
      setX((scrollY - top + innerHeight) * 0.35);
    };
    on();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => {
      removeEventListener('scroll', on);
      removeEventListener('resize', on);
    };
  }, []);
  const row1 = [...COVERS.slice(0, 11), ...COVERS.slice(0, 11), ...COVERS.slice(0, 11)];
  const row2 = [...COVERS.slice(11), ...COVERS.slice(11), ...COVERS.slice(11)];
  return (
    <section ref={ref} className="sec comunidad" id={classesOnly ? 'clases' : 'comunidad'}>
      {classesOnly ? (
        <Head kicker="02 · La academia" title="Clases y temas que encontrarás dentro de la Comunidad LFX" />
      ) : (
        <>
          <Head kicker="01 · La comunidad" title="Comunidad LFX" />
          <AnimatedText
            className="lead lit"
            text="Una comunidad enfocada en aprender y operar trading de manera profesional. Participa en operativas en vivo, recibe señales con seguimiento y aprende a comprender cómo se mueve el mercado, cómo operan las instituciones y cómo gestionar cada operación como un profesional."
          />
          <FadeIn y={20}>
            <h3 className="sub-title">Clases y temas que encontrarás dentro de la Comunidad LFX</h3>
          </FadeIn>
        </>
      )}
      <div className="belt" aria-label="Portadas de las clases de la Comunidad LFX">
        {[row1, row2].map((row, r) => (
          <div key={r} className="belt-row" style={{ transform: `translateX(${r === 0 ? x - 1000 : -(x - 300)}px)` }}>
            {row.map((src, i) => (
              <button key={i} type="button" className="belt-item" onClick={() => open({ src, alt: 'Portada de una clase de la Comunidad LFX' })} aria-label="Ampliar portada de la clase">
                <img src={src} alt="" decoding="async" />
              </button>
            ))}
          </div>
        ))}
      </div>
      {view}
    </section>
  );
}

/* ---------- 4. How it works ---------- */
const STEPS = [
  { icon: Users, title: 'Te unes a la Comunidad LFX', text: 'Contactas directamente con Leo, conoces las opciones de acceso y entras a los canales exclusivos de la comunidad.' },
  { icon: Video, title: 'Te conectas a las operativas en vivo', text: 'Participas en las sesiones en vivo donde analizamos el mercado y buscamos oportunidades de trading.' },
  { icon: LineChart, title: 'Recibes y revisas las señales', text: 'Recibes operaciones con sus entradas, objetivos y seguimiento para entender cómo se gestionan.' },
  { icon: Handshake, title: 'Decides cómo participar', text: 'Utilizas los análisis, las clases y las señales para desarrollar tu criterio y operar siguiendo tu propio plan de riesgo.' },
];

export function StepsSection() {
  return (
    <section className="sec steps-sec" id="como-funciona">
      <Head kicker="03 · El recorrido" title="¿Cómo funciona la Comunidad LFX?" />
      <ol className="steps-grid">
        {STEPS.map((s, i) => (
          <FadeIn as="li" key={s.title} delay={0.1 + i * 0.12} y={40} className="step">
            <div className="step-top">
              <span className="step-icon">
                <s.icon strokeWidth={1.6} />
              </span>
              <span className="num hero-heading">{String(i + 1).padStart(2, '0')}</span>
              {i < STEPS.length - 1 && <ArrowRight className="step-arrow" strokeWidth={1.5} />}
            </div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </FadeIn>
        ))}
      </ol>
      <FadeIn className="sec-cta">
        <ContactButton label="Quiero ser parte de LFX" />
      </FadeIn>
    </section>
  );
}

/* ---------- 5. Everything in one place: seven cards ---------- */
export type Card = { title: string; img?: string; alt?: string; fit?: 'cover' | 'contain' | 'bottom'; missing?: string };
export const CARDS: Card[] = [
  { title: 'Operativas y análisis en vivo', img: './comunidad/sesion-asia.webp', alt: 'Aviso de la sesión Asia en vivo en Telegram' },
  { title: 'Señales de oro — XAUUSD', img: './comunidad/senales-oro.webp', alt: 'Canal de señales XAUUSD con TP1 y TP2 alcanzados' },
  { title: 'Señales Forex', img: './comunidad/senales-forex.webp', alt: 'Canal de señales Forex VIP con objetivos alcanzados' },
  { title: 'Señales de índices', img: './comunidad/senales-indices.webp', alt: 'Canal de señales de índices con NAS100 en TP6' },
  { title: 'Clases grabadas', img: './comunidad/academia-trading-institucional.webp', alt: 'Curso de Trading Institucional dentro de la Academia LFX', fit: 'bottom' },
  { title: 'Trading institucional, scalping y gestión de riesgo', img: './comunidad/academia-riesgo.webp', alt: 'Guías de gestión de riesgo de la Academia LFX', fit: 'contain' },
  { title: 'Comunidad y avisos', img: './comunidad/bienvenida.webp', alt: 'Mensaje de bienvenida a la comunidad en Telegram' },
];

export function ServicesSection() {
  const { open, view } = useZoom();
  return (
    <section className="sec services-sec" id="servicios">
      <Head kicker="03 · Qué encontrarás" title="Todo en un solo lugar" />
      <div className="cards7">
        {CARDS.map((c, i) => (
          <FadeIn key={c.title} delay={0.05 + (i % 4) * 0.08} y={50} className="card7">
            {c.img ? (
              <button type="button" className={`card7-img ${c.fit || 'cover'}`} onClick={() => open({ src: c.img!, alt: c.alt || c.title })} aria-label={`Ampliar: ${c.alt}`}>
                <img src={c.img} alt={c.alt} decoding="async" />
              </button>
            ) : (
              <div className="card7-img pending">
                <ImageOff />
                <span>{c.missing}</span>
                <small>Pendiente</small>
              </div>
            )}
            <div className="card7-body">
              <span className="num hero-heading">{String(i + 1).padStart(2, '0')}</span>
              <h3>{c.title}</h3>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn className="sec-cta">
        <ContactButton label="Conocer los planes" />
      </FadeIn>
      {view}
    </section>
  );
}

/* ---------- 5b. How to use our signals: four visual steps ---------- */
type Step = { title: string; text: string; imgs: Img[] };
const SIGNAL_STEPS: Step[] = [
  {
    title: 'Únete a la Comunidad VIP',
    text: 'Accede a nuestra comunidad privada en Telegram y conoce todos los beneficios disponibles.',
    imgs: [{ src: './comunidad/resultados-semana.webp', alt: 'Canal Traders Leonardo-FX en Telegram con los resultados semanales del VIP' }],
  },
  {
    title: 'Elige tu canal de señales',
    text: 'Tres canales especializados: oro (XAUUSD), Forex e índices.',
    imgs: [
      { src: './comunidad/senales-oro.webp', alt: 'Canal de señales XAUUSD' },
      { src: './comunidad/senales-forex.webp', alt: 'Canal de señales Forex' },
      { src: './comunidad/senales-indices.webp', alt: 'Canal de señales de índices' },
    ],
  },
  {
    title: 'Copia la operación en MetaTrader 5',
    text: 'Introduce la entrada, el Stop Loss y el Take Profit de la señal que quieras seguir.',
    imgs: [{ src: './resultados/r6.webp', alt: 'Operación en MetaTrader 5 con el Take Profit y el Stop Loss configurados' }],
  },
  {
    title: 'Sigue la operación y su resultado',
    text: 'Supervisa tu operación y consulta el seguimiento que compartimos en los canales.',
    imgs: [{ src: './resultados/r2.webp', alt: 'Operación en XAUUSD cerrada en take profit con 105,61 USDT de ganancia' }],
  },
];
const CHANNEL_NAMES = ['Oro · XAUUSD', 'Forex', 'Índices'];

export function SignalsSection() {
  const { open, view } = useZoom();
  return (
    <section className="sec signals-sec" id="senales">
      <Head kicker="04 · Sistema de señales" title="¿Cómo puedes aprovechar nuestras señales?" />
      <FadeIn y={20}>
        <p className="sec-sub">Descubre cómo funciona nuestro sistema de señales y cómo puedes seguir las operaciones de nuestra comunidad en cuatro sencillos pasos.</p>
      </FadeIn>
      <ol className="signal-grid">
        {SIGNAL_STEPS.map((st, i) => (
          <FadeIn as="li" key={st.title} delay={0.08 + i * 0.1} y={50} className="signal-card">
            <div className={`signal-media${st.imgs.length > 1 ? ' trio' : ''}`}>
              {st.imgs.map((im, k) => (
                <button key={im.src} type="button" onClick={() => open(im)} aria-label={`Ampliar: ${im.alt}`}>
                  <img src={im.src} alt={im.alt} decoding="async" />
                  {st.imgs.length > 1 && <span className="chan">{CHANNEL_NAMES[k]}</span>}
                </button>
              ))}
            </div>
            <div className="signal-body">
              <span className="num hero-heading">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </ol>
      <FadeIn className="sec-cta">
        <ContactButton label="Quiero comenzar en la Comunidad VIP" />
      </FadeIn>
      {view}
    </section>
  );
}

/* ---------- 6. Results (compact) ---------- */
const RESULTS: Img[] = [
  { src: './comunidad/resultados-semana.webp', alt: 'Resultados semanales del VIP LFX publicados en Telegram: 9 de 10 operaciones favorables' },
  { src: './resultados/r1.webp', alt: 'Historial de operaciones en MetaTrader con BTCUSD, ETHUSD y XAUUSD' },
  { src: './resultados/r7.webp', alt: 'Gráfico de XAUUSD con venta en ganancia de 82,80 USD' },
  { src: './resultados/r3.webp', alt: 'Historial en MetaTrader con operaciones en XAUUSD y EURUSD' },
  { src: './resultados/r4.webp', alt: 'Historial de ventas en XAUUSD de junio y julio' },
  { src: './resultados/r5.webp', alt: 'Historial del 13 de julio con operaciones en XAUUSD' },
  { src: './resultados/r8.webp', alt: 'Gráfico de XAUUSD en M1 con la entrada y la salida marcadas' },
];

export function ResultsSection() {
  const { open, view } = useZoom();
  return (
    <section className="sec results-sec compact" id="resultados">
      <Head kicker="05 · Resultados reales" title="Un trader profesional no predice, se prepara." />
      <Carousel count={RESULTS.length} label="Capturas de resultados">
        {RESULTS.map((r) => (
          <button key={r.src} type="button" className="phone" onClick={() => open(r)} aria-label={`Ampliar: ${r.alt}`}>
            <img src={r.src} alt={r.alt} decoding="async" />
          </button>
        ))}
      </Carousel>
      <p className="note">Capturas de operaciones reales, con ganancias y pérdidas. Resultados pasados no garantizan resultados futuros.</p>
      {view}
    </section>
  );
}

/* ---------- 7 + 8. Testimonials, rating and comments ---------- */
/* Cropped: no status bar, no chat header (no contact names), no typing bar. */
const TESTIMONIAL_SHOTS: Img[] = [
  { src: './testimonios/t01.webp', alt: 'Un alumno: la comunidad está de maravilla, no solo hay señales sino que también aprende' },
  { src: './testimonios/t02.webp', alt: 'Un alumno: las semanas ahora son profit desde que se unió a la comunidad VIP' },
  { src: './testimonios/t03.webp', alt: 'Un alumno se conecta a las clases y sus primeros trades van en profit' },
  { src: './testimonios/t04.webp', alt: 'Alumnos en el grupo VIP agradeciendo y compartiendo ganancias' },
  { src: './testimonios/t05.webp', alt: 'Un alumno pasó la primera fase de una cuenta de fondeo' },
  { src: './testimonios/t06.webp', alt: 'Un alumno comparte su retiro de una cuenta de fondeo' },
  { src: './testimonios/t07.webp', alt: 'Un alumno comparte el retiro que realizó' },
  { src: './testimonios/t08.webp', alt: 'Un alumno comparte los resultados del día siguiendo las señales' },
  { src: './testimonios/t09.webp', alt: 'Un alumno comparte operaciones en profit en oro y petróleo' },
  { src: './testimonios/t10.webp', alt: 'Un alumno comparte sus operaciones en oro' },
  { src: './testimonios/t11.webp', alt: 'Un alumno comparte su semana y agradece' },
  { src: './testimonios/t12.webp', alt: 'Un alumno comparte que retiró 30 dólares' },
  { src: './testimonios/t13.webp', alt: 'Un alumno cierra la semana con 80 positivos' },
  { src: './testimonios/t14.webp', alt: 'Un alumno comparte su historial de operaciones' },
  { src: './testimonios/t15.webp', alt: 'Un alumno agradece por su segundo mes en la comunidad' },
  { src: './testimonios/t16.webp', alt: 'Un alumno agradece el tiempo dedicado a apoyarlos' },
  { src: './testimonios/t17.webp', alt: 'Un alumno comparte una operación en XAUUSD con +427,14' },
];
/* Fragments copied word for word from the screenshots, with the name that appears in each chat. */
const COMMENTS: { name: string; text: string; stars?: number }[] = [
  { name: 'Juan', text: 'La comunidad está de maravilla por qué no solo hay señales si no también aprendo y aparte me sorprendió que la estrategia de scalpin sea tan efectiva' },
  { name: 'Edwin', text: 'Muchas gracias estoy en el mejor equipo uff las semanas ahora son profit desde que me uní a la comunidad vip' },
  { name: 'Erick', text: 'He estado conectandome a tus clases y me gusta la manera que operas, he metido ya mis primeros trades y voy super profit' },
  { name: 'Jesús Octavio', text: 'Ganancia del dia de hoy. No se rindan con calma 💪 Gracias leo por todo lo que me has ayudado' },
  { name: 'Edwin', text: 'Ya con esta operativa pase la primera fase de una cuenta de fondeo 💪' },
  { name: 'Jorge Arrieta', text: 'Muchas gracias ya hice mis primeros 200 usd' },
  { name: 'Raúl', text: 'A pesar de que ésta semana casi no pude estar en las sesiones y haciendo operativas, comparto el retiro que realicé' },
  { name: 'Luis', text: 'Los resultados de hoy siguiendo tus señales' },
  { name: 'Julio', text: 'Cierro la semana con 80 positivos' },
  { name: 'Keivin', text: 'Sabes yo me guié por lo que tu mandaste' },
  { name: 'César', text: 'Salimos profi en la cuenta personal' },
  { name: 'Cris', text: 'Ya estaba pensando en empezar a operar con la real' },
  { name: 'Jorge', text: 'Sii, gracias por todo, espero q este sea un muy buen año' },
];
const RATING = 4.5;

export function TestimonialsSection() {
  const { open, view } = useZoom();
  return (
    <section className="sec testimonials-sec" id="testimonios">
      <Head kicker="06 · Testimonios" title="Testimonios de nuestros alumnos" />
      {TESTIMONIAL_SHOTS.length ? (
        <Carousel count={TESTIMONIAL_SHOTS.length} label="Capturas de testimonios">
          {TESTIMONIAL_SHOTS.map((t) => (
            <button key={t.src} type="button" className="phone" onClick={() => open(t)} aria-label={`Ampliar: ${t.alt}`}>
              <img src={t.src} alt={t.alt} decoding="async" />
            </button>
          ))}
        </Carousel>
      ) : (
        <div className="pending-box">
          <ImageOff />
          <span>Pendiente: capturas de los testimonios de los alumnos (Diego, Socio, Edwin…)</span>
        </div>
      )}

      <FadeIn className="rating-big">
        <Stars n={RATING} />
        <b>{RATING.toFixed(1)} / 5</b>
        <span>Valoración de nuestra comunidad</span>
      </FadeIn>

      {COMMENTS.length ? (
        <Carousel count={COMMENTS.length} label="Comentarios de alumnos">
          {COMMENTS.map((c) => (
            <figure key={c.name + c.text.slice(0, 12)} className="comment">
              {c.stars ? <Stars n={c.stars} /> : <span className="quote-mark">“</span>}
              <blockquote>{c.text}</blockquote>
              <figcaption>
                {c.name} <small>· Socio LFX</small>
              </figcaption>
            </figure>
          ))}
        </Carousel>
      ) : (
        <div className="pending-box small">
          <span>Pendiente: los comentarios se copian de las capturas de testimonios, con el nombre real de cada alumno.</span>
        </div>
      )}
      {view}
    </section>
  );
}

/* ---------- 9. FAQ ---------- */
const FAQ = [
  {
    q: '¿Qué incluye la Comunidad LFX?',
    a: 'Operativas y análisis en vivo cada día (sesiones Asia, New York e Institucional), señales con seguimiento en oro, Forex e índices, clases grabadas de Trading Institucional, Scalping y Mentalidad, guías de gestión de riesgo y avisos de cada sesión en Telegram.',
  },
  {
    q: '¿Cómo puedo entrar a la comunidad?',
    a: 'Escríbele a Leo por WhatsApp. Te explica los pasos de acceso y las opciones disponibles, y te da la bienvenida a los canales de la comunidad.',
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
  const [openIdx, setOpen] = useState<number | null>(0);
  return (
    <section className="sec faq" id="faq">
      <Head kicker="07 · Preguntas frecuentes" title="Preguntas frecuentes" />
      <div className="faq-list">
        {FAQ.map((f, i) => (
          <FadeIn key={f.q} delay={0.05 + i * 0.06} className={`faq-item${openIdx === i ? ' open' : ''}`}>
            <button type="button" onClick={() => setOpen(openIdx === i ? null : i)} aria-expanded={openIdx === i}>
              <span>{f.q}</span>
              <Plus className="plus" />
            </button>
            <AnimatePresence initial={false}>
              {openIdx === i && (
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

/* ---------- 10. Footer ---------- */
export function Footer() {
  return (
    <footer className="footer">
      <LogoMark className="text-[60px] md:text-[80px]" />
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
        <a href={contactHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Leo">
          <WhatsAppIcon />
        </a>
      </div>
    </footer>
  );
}

/* ---------- Floating VIP button ---------- */
export function FloatingVip() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => {
      const hero = document.querySelector('.mostar') as HTMLElement | null;
      const foot = document.querySelector('.footer') as HTMLElement | null;
      const pastHero = hero ? scrollY > 650 : scrollY > 400;
      const atFooter = foot ? foot.getBoundingClientRect().top < innerHeight - 40 : false;
      setShow(pastHero && !atFooter);
    };
    on();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => {
      removeEventListener('scroll', on);
      removeEventListener('resize', on);
    };
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={vipHref}
          target="_blank"
          rel="noopener noreferrer"
          className="vip-float"
          initial={{ y: 90, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 90, opacity: 0, x: '-50%' }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <WhatsAppIcon className="vip-ico" />
          <span>
            <b>Quiero ser parte de la Comunidad VIP</b>
            <small>Obtén la promoción limitada</small>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
