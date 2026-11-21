import { useEffect, useRef, type ReactNode } from 'react';
import Magnet from '../components/Magnet';
import { startCascade } from './engine';
import { letterStyle, LogoTagline } from '../components/Logo';
import './cascade.css';

const IMGS: Record<string, string> = {
  hero: './cascada/01-hero.webp',
  cueva: './cascada/02-cueva.webp',
  mina: './cascada/03-mina.webp',
  refineria: './cascada/04-refineria.webp',
  boveda: './cascada/05-boveda.webp',
};
const SEAMS = ['./cascada/06-franja-1.webp', './cascada/07-franja-2.webp', './cascada/08-franja-3.webp', './cascada/09-franja-4.webp'];

/* Each line rises out of a mask when the caption scrolls into view */
const Ln = ({ children }: { children: ReactNode }) => (
  <span className="ln">
    <span>{children}</span>
  </span>
);

function Scene({ id, focus, last, children }: { id: string; focus: number; last?: boolean; children?: ReactNode }) {
  return (
    <section className={`scene${id === 'hero' ? ' hero' : ''}${last ? ' last' : ''}`} data-scene={id} style={{ ['--focus' as string]: focus }}>
      <div className="art">
        <div className="bg" style={{ backgroundImage: `url('${IMGS[id]}')` }} />
      </div>
      {children}
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

const TITLE = 'LFX, Traders Leonardo FX';

export default function CascadeSection() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => (root.current ? startCascade(root.current, IMGS) : undefined), []);

  return (
    <div ref={root} className="cascade" id="top">
      <Scene id="hero" focus={50}>
        <div className="hero-copy">
          <h1 aria-label={TITLE}>
            {(['L', 'F', 'X'] as const).map((c) => (
              <span key={c} aria-hidden="true" style={letterStyle(c)}>
                {c}
              </span>
            ))}
          </h1>
          <div className="sub">
            <LogoTagline />
          </div>
          <div className="logo-rule" />
          <div className="tagline">
            Comunidad <b className="dot-b">•</b> Educación <b className="dot-p">•</b> Resultados
          </div>
        </div>
        <div className="bull">
          <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
            <img src="./3d/toro.webp" alt="Toro de oro, símbolo de LFX Academy" draggable={false} />
          </Magnet>
        </div>
      </Scene>

      <Seam i={0} focus={50} />

      <Scene id="cueva" focus={50}>
        <div className="cap" style={{ left: '6%', top: '30%', width: '32%' }}>
          <Ln><p className="kicker">01 · La formación</p></Ln>
          <Ln><h2>Aprende a leer el oro</h2></Ln>
          <div className="rule" />
          <Ln><p>Tres programas y 47 clases grabadas para entender cómo se mueve el dinero en el mercado.</p></Ln>
        </div>
      </Scene>

      <Seam i={1} focus={28} />

      <Scene id="mina" focus={28}>
        <div className="cap" style={{ left: '56%', top: '28%', width: '32%' }}>
          <Ln><p className="kicker">02 · En vivo</p></Ln>
          <Ln><h2>Opera con el equipo</h2></Ln>
          <div className="rule" />
          <Ln><p>Sesiones cada día: Asia, New York y Trading Institucional, con acceso por Telegram VIP.</p></Ln>
        </div>
      </Scene>

      <Seam i={2} focus={70} />

      <Scene id="refineria" focus={70}>
        <div className="cap" style={{ left: '6%', top: '30%', width: '34%' }}>
          <Ln><p className="kicker">03 · Gestión de riesgo</p></Ln>
          <Ln><h2>Protege tu capital</h2></Ln>
          <div className="rule" />
          <Ln><p>Antes de buscar entradas, aprendes a cuidar la cuenta. Cinco guías y un plan personal de operación.</p></Ln>
        </div>
      </Scene>

      <Seam i={3} focus={50} />

      <Scene id="boveda" focus={50} last>
        <div className="cap center" style={{ top: '24%' }}>
          <Ln><p className="kicker">LFX Academy</p></Ln>
          <Ln><h2>Un trader profesional no predice, se prepara.</h2></Ln>
          <div className="rule" />
        </div>
        <div className="scroll-cue">
          Descubre la academia
          <i />
        </div>
      </Scene>
    </div>
  );
}
