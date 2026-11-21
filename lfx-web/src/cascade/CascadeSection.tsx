import { forwardRef, useEffect, useRef, type ReactNode } from 'react';
import Magnet from '../components/Magnet';
import { startCascade } from './engine';
import { letterStyle } from '../components/Logo';
import { AboutBlock, CoverBelt, FeaturesBlock, JoinBlock, ProgramsBlock, ResultsBlock } from './content';
import './cascade.css';

const IMGS: Record<string, string> = {
  hero: './cascada/01-hero.webp',
  cueva: './cascada/02-cueva.webp',
  mina: './cascada/03-mina.webp',
  refineria: './cascada/04-refineria.webp',
  boveda: './cascada/05-boveda.webp',
};
const SEAMS = ['./cascada/06-franja-1.webp', './cascada/07-franja-2.webp', './cascada/08-franja-3.webp', './cascada/09-franja-4.webp'];

type SceneProps = { id: string; focus: number; anchor?: string; children?: ReactNode };
const Scene = forwardRef<HTMLElement, SceneProps>(function Scene({ id, focus, anchor, children }, ref) {
  return (
    <section ref={ref} id={anchor} className={`scene${id === 'hero' ? ' hero' : ''}`} data-scene={id} style={{ ['--focus' as string]: focus }}>
      <div className="art">
        <div className="bg" style={{ backgroundImage: `url('${IMGS[id]}')` }} />
      </div>
      {children}
    </section>
  );
});

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
  const cave = useRef<HTMLElement>(null);
  useEffect(() => (root.current ? startCascade(root.current, IMGS) : undefined), []);

  return (
    <div ref={root} className="cascade" id="top">
      <Scene id="hero" focus={50}>
        <div className="hero-copy">
          <Magnet padding={220} strength={5} activeTransition="transform 0.35s ease-out" inactiveTransition="transform 0.8s ease-in-out">
            <h1 aria-label="LFX">
              {(['L', 'F', 'X'] as const).map((c) => (
                <span key={c} aria-hidden="true" style={letterStyle(c)}>
                  {c}
                </span>
              ))}
            </h1>
          </Magnet>
        </div>
      </Scene>

      <Seam i={0} focus={50} />

      <Scene id="cueva" focus={53} anchor="academia" ref={cave}>
        <AboutBlock />
        <CoverBelt sceneRef={cave} />
      </Scene>

      <Seam i={1} focus={24.5} />

      <Scene id="mina" focus={25} anchor="programas">
        <ProgramsBlock />
      </Scene>

      <Seam i={2} focus={69.5} />

      <Scene id="refineria" focus={72} anchor="por-dentro">
        <FeaturesBlock />
      </Scene>

      <Seam i={3} focus={50} />

      <Scene id="boveda" focus={50}>
        <JoinBlock />
        <ResultsBlock />
        <p className="legal">
          El trading conlleva riesgo de pérdida de capital. LFX Academy ofrece formación, no asesoría financiera ni garantía de resultados.
        </p>
      </Scene>
    </div>
  );
}
