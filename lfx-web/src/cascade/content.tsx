import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useState, type RefObject } from 'react';
import AnimatedText from '../components/AnimatedText';
import FadeIn from '../components/FadeIn';
import { ContactButton } from '../components/Buttons';

/* ---------- Cave: about + class-cover belt ---------- */
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
        <p className="kicker">01 · La academia</p>
      </FadeIn>
      <FadeIn delay={0.1} y={40}>
        <h2 className="hero-heading">Sobre LFX</h2>
      </FadeIn>
      <AnimatedText
        className="lit"
        text="Una academia de trading profesional especializada en oro. Aprendes a leer el mercado como lo hacen las instituciones, con 47 clases grabadas, sesiones en vivo cada día y una gestión de riesgo que protege tu capital."
      />
    </div>
  );
}

/* Moves sideways with the page scroll while its scene is on screen */
export function CoverBelt({ sceneRef }: { sceneRef: RefObject<HTMLElement> }) {
  const [x, setX] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = sceneRef.current;
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
  }, [sceneRef]);
  const row = [...COVERS, ...COVERS];
  return (
    <div className="belt" aria-label="Portadas de las clases de LFX Academy">
      <div className="belt-row" style={{ transform: `translateX(${-x}px)` }}>
        {row.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" />
        ))}
      </div>
    </div>
  );
}

/* ---------- Mine: programs ---------- */
const PROGRAMS = [
  { name: 'Trading Institucional', desc: '29 clases: estructura real del mercado, cómo se mueve el dinero, Fibonacci institucional y macroeconomía.' },
  { name: 'Estrategia de Scalping', desc: '13 clases para operar las sesiones con entradas de alta precisión en timeframes bajos.' },
  { name: 'Mentalidad del Trader', desc: '5 clases de psicología: disciplina, control emocional y bitácora profesional.' },
  { name: 'Sesiones en vivo', desc: 'Asia 6:00 p.m. dom–jue, New York 6:30 a.m. lun–vie e Institucional los viernes (hora de México).' },
  { name: 'Gestión de riesgo', desc: 'Cinco guías para proteger tu capital y tu plan personal de operación.' },
];

export function ProgramsBlock() {
  return (
    <div className="block programs">
      <FadeIn y={20}>
        <p className="kicker">02 · Programas</p>
      </FadeIn>
      <FadeIn delay={0.1} y={40}>
        <h2 className="hero-heading">Programas</h2>
      </FadeIn>
      <ol>
        {PROGRAMS.map((p, i) => (
          <FadeIn as="li" key={p.name} delay={0.15 + i * 0.1} x={40} y={0}>
            <span className="num hero-heading">{String(i + 1).padStart(2, '0')}</span>
            <span className="txt">
              <b>{p.name}</b>
              <span>{p.desc}</span>
            </span>
          </FadeIn>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Refinery: deck of cards that stack while you scroll ---------- */
const CARDS = [
  { label: 'Formación', name: '47 clases grabadas', imgs: ['./cursos/c03.webp', './cursos/c06.webp', './cursos/c05.webp'] },
  { label: 'Cada día', name: 'Sesiones en vivo', imgs: ['./dentro/sesiones-horarios.webp', './cursos/c17.webp', './dentro/sesiones-panel.webp'] },
  { label: 'Protección', name: 'Gestión de riesgo', imgs: ['./dentro/riesgo1.webp', './dentro/riesgo2.webp', './dentro/riesgo3.webp'] },
];

export function DeckBlock({ sceneRef }: { sceneRef: RefObject<HTMLElement> }) {
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start 0.95', 'start 0.05'] });
  return (
    <div className="block deck-wrap">
      <FadeIn y={20}>
        <p className="kicker">03 · Por dentro</p>
      </FadeIn>
      <FadeIn delay={0.1} y={40}>
        <h2 className="hero-heading">Así es LFX</h2>
      </FadeIn>
      <div className="deck">
        {CARDS.map((c, i) => (
          <DeckCard key={c.name} card={c} i={i} n={CARDS.length} progress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}

function DeckCard({ card, i, n, progress }: { card: (typeof CARDS)[number]; i: number; n: number; progress: MotionValue<number> }) {
  const start = i * 0.26;
  const y = useTransform(progress, [start, start + 0.3], ['120%', `${i * 3.2}em`]);
  const rotate = useTransform(progress, [start, start + 0.3], [8 - i * 4, 0]);
  const scale = useTransform(progress, [start + 0.3, 1], [1, 1 - (n - 1 - i) * 0.03]);
  return (
    <motion.article className="card" style={{ y, rotate, scale, zIndex: i + 1 }}>
      <header>
        <span className="num hero-heading">{String(i + 1).padStart(2, '0')}</span>
        <span>
          <small>{card.label}</small>
          <b>{card.name}</b>
        </span>
      </header>
      <div className="imgs">
        {card.imgs.map((s) => (
          <img key={s} src={s} alt="" loading="lazy" />
        ))}
      </div>
    </motion.article>
  );
}

/* ---------- Vault: join ---------- */
export function JoinBlock() {
  return (
    <div className="block join" id="contacto">
      <FadeIn y={20}>
        <p className="kicker">04 · Únete</p>
      </FadeIn>
      <FadeIn delay={0.1} y={40}>
        <h2 className="hero-heading">Un trader profesional no predice, se prepara.</h2>
      </FadeIn>
      <FadeIn delay={0.25}>
        <p className="lead">Membresía mensual con clases grabadas, sesiones en vivo cada día y comunidad VIP en Telegram. Escríbenos y te explicamos cómo acceder.</p>
      </FadeIn>
      <FadeIn delay={0.4}>
        <ContactButton label="Escríbenos por WhatsApp" />
      </FadeIn>
    </div>
  );
}
