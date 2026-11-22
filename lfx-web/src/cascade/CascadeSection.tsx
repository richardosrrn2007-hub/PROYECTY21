import { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import Magnet from '../components/Magnet';
import { startCascade } from './engine';
import { letterStyle } from '../components/Logo';
import { ContactButton, TelegramButton } from '../components/Buttons';
import { VIDEO_POSTER, VIDEO_SRC } from '../config';
import './cascade.css';

/* Only the first screen keeps the painted cascade: logo, two buttons and the presentation video. */
const IMGS: Record<string, string> = { hero: './cascada/01-hero.webp' };

export default function CascadeSection() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => (root.current ? startCascade(root.current, IMGS) : undefined), []);

  return (
    <div ref={root} className="cascade" id="top">
      <section className="scene hero hero-v2" data-scene="hero" style={{ ['--focus' as string]: 50 }}>
        <div className="art">
          <div className="bg" style={{ backgroundImage: `url('${IMGS.hero}')` }} />
        </div>
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
        <div className="hero-video">
          {VIDEO_SRC ? (
            <video src={VIDEO_SRC} poster={VIDEO_POSTER || undefined} controls playsInline preload="metadata" />
          ) : (
            <div className="video-pending" role="img" aria-label="Video de presentación pendiente">
              <span className="play">
                <Play />
              </span>
              <b>Video de presentación de la Comunidad LFX</b>
              <small>Pendiente: falta el archivo del video</small>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
