import FadeIn from '../components/FadeIn';
import { ContactButton } from '../components/Buttons';

export default function ContactSection() {
  return (
    <section id="contacto" className="relative flex flex-col items-center gap-10 px-5 pb-12 pt-24 text-center sm:px-8 md:gap-14 md:px-10 md:pt-32">
      <FadeIn y={40}>
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Únete
        </h2>
      </FadeIn>
      <FadeIn delay={0.15}>
        <p className="max-w-[560px] font-light leading-relaxed text-[#D7E2EA]" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>
          Membresía mensual con clases grabadas, sesiones en vivo cada día y comunidad VIP en Telegram. Escríbenos y te explicamos cómo acceder.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <ContactButton label="Escríbenos por WhatsApp" />
      </FadeIn>
      <p className="mt-10 max-w-[720px] text-xs font-light leading-relaxed text-[#D7E2EA]/50 md:mt-16">
        El trading conlleva riesgo de pérdida de capital. LFX Academy ofrece formación, no asesoría financiera ni garantía de resultados.
      </p>
      <p className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/40">Leonardo FX Academy · Formación profesional en trading</p>
    </section>
  );
}
