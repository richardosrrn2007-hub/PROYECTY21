import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import { GhostButton } from '../components/Buttons';

type Card = { label: string; name: string; imgs: [string, string, string]; alts: [string, string, string] };

/* Real screens and covers from the LFX platform. Swap in real results when they arrive. */
const cards: Card[] = [
  {
    label: 'Formación',
    name: '47 clases grabadas',
    imgs: ['./cursos/c03.webp', './cursos/c06.webp', './cursos/c05.webp'],
    alts: ['Portada de La Realidad del Trading Institucional', 'Portada de Nunca ser liquidado', 'Portada de Estructura real del mercado'],
  },
  {
    label: 'Cada día',
    name: 'Sesiones en vivo',
    imgs: ['./dentro/sesiones-horarios.webp', './dentro/sesiones-panel.webp', './cursos/c17.webp'],
    alts: ['Horarios de las sesiones Asia, New York e Institucional', 'Calendario de sesiones en vivo dentro de la plataforma', 'Portada de la estrategia de Scalping, sesión Asia y New York'],
  },
  {
    label: 'Protección',
    name: 'Gestión de riesgo',
    imgs: ['./dentro/riesgo1.webp', './dentro/riesgo3.webp', './dentro/riesgo2.webp'],
    alts: ['Guía de fundamentos de gestión de riesgo', 'Guía de cálculo de riesgo y lotaje', 'Guía de riesgo/beneficio y sistema de TPs'],
  },
];

export default function ProjectsSection() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });

  return (
    <section id="por-dentro" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-20 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32">
      <FadeIn>
        <h2 className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight md:mb-16" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Por dentro
        </h2>
      </FadeIn>
      <div ref={container} className="mx-auto max-w-6xl">
        {cards.map((c, i) => {
          const targetScale = 1 - (cards.length - 1 - i) * 0.03;
          return <StackCard key={c.name} card={c} index={i} progress={scrollYProgress} range={[i / cards.length, 1]} targetScale={targetScale} />;
        })}
      </div>
    </section>
  );
}

function StackCard({
  card,
  index,
  progress,
  range,
  targetScale,
}: {
  card: Card;
  index: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
  targetScale: number;
}) {
  const scale = useTransform(progress, range, [1, targetScale]);
  return (
    <div className="sticky top-24 flex h-[85vh] items-start md:top-32">
      <motion.article
        style={{ scale, top: `${index * 28}px`, transformOrigin: 'top center' }}
        className="relative w-full rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4 px-2 sm:mb-6 md:mb-8">
          <div className="flex items-end gap-4 md:gap-6">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="pb-1 md:pb-3">
              <p className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">{card.label}</p>
              <h3 className="font-medium uppercase text-[#D7E2EA]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                {card.name}
              </h3>
            </div>
          </div>
          <GhostButton label="Únete" />
        </div>
        <div className="flex gap-3 sm:gap-4">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <img src={card.imgs[0]} alt={card.alts[0]} loading="lazy" className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]" style={{ height: 'clamp(130px, 16vw, 230px)' }} />
            <img src={card.imgs[1]} alt={card.alts[1]} loading="lazy" className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]" style={{ height: 'clamp(160px, 22vw, 340px)' }} />
          </div>
          <div className="w-[60%]">
            <img src={card.imgs[2]} alt={card.alts[2]} loading="lazy" className="h-full w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]" />
          </div>
        </div>
      </motion.article>
    </div>
  );
}
