import FadeIn from '../components/FadeIn';

const items = [
  {
    name: 'Trading Institucional',
    desc: '29 clases para leer la estructura real del mercado: cómo se mueve el dinero, confluencias, Fibonacci institucional, macroeconomía y TradingView como un profesional.',
  },
  {
    name: 'Estrategia de Scalping',
    desc: '13 clases para operar las sesiones y encontrar entradas de alta precisión en timeframes bajos, con intensivos y operativa en vivo.',
  },
  {
    name: 'Mentalidad del Trader',
    desc: '5 clases de psicología de trading: disciplina, control emocional y una bitácora profesional para decidir bajo presión.',
  },
  {
    name: 'Sesiones en vivo',
    desc: 'Asia a las 6:00 p.m. de domingo a jueves, New York a las 6:30 a.m. de lunes a viernes y Trading Institucional los viernes. Hora de México, con acceso por Telegram VIP.',
  },
  {
    name: 'Gestión de riesgo',
    desc: 'Cinco guías para proteger tu capital: riesgo/beneficio, cálculo de lotaje, tipos de gestión y tu plan personal de operación. Más una biblioteca de libros y audiolibros.',
  },
];

export default function ServicesSection() {
  return (
    <section id="programas" className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn>
        <h2 className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Programas
        </h2>
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        {items.map((it, i) => (
          <FadeIn
            key={it.name}
            delay={i * 0.1}
            className="flex items-start gap-6 py-8 sm:gap-10 sm:py-10 md:gap-14 md:py-12"
            style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(12, 12, 12, 0.15)' }}
          >
            <span className="font-black leading-none text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2 pt-2 text-[#0C0C0C] md:gap-3 md:pt-4">
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                {it.name}
              </h3>
              <p className="max-w-2xl font-light leading-relaxed opacity-60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                {it.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
