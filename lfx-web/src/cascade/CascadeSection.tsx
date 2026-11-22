import { useEffect, useRef, type ReactNode } from 'react';
import { Play } from 'lucide-react';
import Magnet from '../components/Magnet';
import { startCascade } from './engine';
import { letterStyle } from '../components/Logo';
import { ContactButton, TelegramButton } from '../components/Buttons';
import { VIDEO_POSTER, VIDEO_SRC } from '../config';
import { ComunidadSection, ServicesSection, SignalsSection, StepsSection } from '../sections/Sections';
import './cascade.css';

/* The gold cascade runs behind the page: each section sits on its own painted scene,
   joined by rock seams the falls pours through. */
const IMGS: Record<string, string> = {
  hero: './cascada/01-hero.webp',
  cueva: './cascada/02-cueva.webp',
  mina: './cascada/03-mina.webp',
  refineria: './cascada/04-refineria.webp',
  boveda: './cascada/05-boveda.webp',
};
const SEAMS = ['./cascada/06-franja-1.webp', './cascada/07-franja-2.webp', './cascada/08-franja-3.webp', './cascada/09-franja-4.webp'];

/* fx = horizontal position of the painted falls (0..1), kept where the seams expect it */
function Scene({ id, fx, focus, children }: { id: string; fx: number; focus: number; children?: ReactNode }) {
  return (
    <section className={`scene${id === 'hero' ? ' hero hero-v2' : ''}`} data-scene={id} data-fx={fx} style={{ ['--focus' as string]: focus }}>
      <div className="art">
        <div className="bg" style={{ backgroundImage: `url('${IMGS[id]}')` }} />
      </div>
      <div className="scene-content">{children}</div>
    </section>
  );
}

function Seam({ i, focus }: { i: number; focus: number }) {
  return (
    <div className="seam" style={{ ['--focus' as string]: focus }}>
      <div className="band">
        <img src={SEAMS[i]} alt="" decoding="async" loading={i ? 'lazy' : 'eager'} />
      </div>
    </div>
  );
}

export default function CascadeSection() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => (root.current ? startCascade(root.current, IMGS) : undefined), []);

  return (
    <div ref={root} className="cascade" id="top">
      <Scene id="hero" fx={0.5} focus={50}>
        <div className="hero-left">
          <div className="hero-copy">
            <Magnet padding={160} strength={6} activeTransition="transform 0.35s ease-out" inactiveTransition="transform 0.8s ease-in-out">
              <h1 aria-label="LFX">
                {(['L', 'F', 'X'] as const).map((c) => (
                  <span key={c} aria-hidden="true" style={letterStyle(c)}>
                    {c}
                  </span>
                ))}
              </h1>
            </Magnet>
          </div>
          <div className="hero-cta">
            <ContactButton label="Quiero ser parte de LFX" />
            <TelegramButton label="Canal de Telegram" />
          </div>
        </div>
        <div className="hero-video">
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
      </Scene>

      <Seam i={0} focus={50} />
      <Scene id="cueva" fx={0.53} focus={53}>
        <ComunidadSection />
      </Scene>

      <Seam i={1} focus={24.5} />
      <Scene id="mina" fx={0.255} focus={25}>
        <StepsSection />
      </Scene>

      <Seam i={2} focus={69.5} />
      <Scene id="refineria" fx={0.72} focus={72}>
        <ServicesSection />
      </Scene>

      <Seam i={3} focus={50} />
      <Scene id="boveda" fx={0.5} focus={50}>
        <SignalsSection />
      </Scene>
    </div>
  );
}
