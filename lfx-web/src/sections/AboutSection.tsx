import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import { ContactButton } from '../components/Buttons';

const text =
  'LFX Academy es una academia de trading profesional especializada en oro. Enseñamos a leer el mercado como lo hacen las instituciones, con clases grabadas, sesiones en vivo cada día y una gestión de riesgo que protege tu capital. Un trader profesional no predice, se prepara.';

export default function AboutSection() {
  return (
    <section id="academia" className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10">
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute left-[1%] top-[4%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]">
        <img src="./3d/moneda.webp" alt="" className="w-full" loading="lazy" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]">
        <img src="./3d/lingote.webp" alt="" className="w-full" loading="lazy" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute right-[1%] top-[4%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]">
        <img src="./3d/velas.webp" alt="" className="w-full" loading="lazy" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]">
        <img src="./3d/escudo.webp" alt="" className="w-full" loading="lazy" />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
              Sobre LFX
            </h2>
          </FadeIn>
          <AnimatedText
            text={text}
            className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>
        <ContactButton />
      </div>
    </section>
  );
}
