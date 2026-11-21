/* LFX wordmark redrawn in code from the academy logo:
   heavy slanted letters, L white, F electric blue, X violet, with a neon glow. */

export const LOGO_COLORS = {
  L: 'linear-gradient(180deg, #FFFFFF 0%, #DCE6FF 100%)',
  F: 'linear-gradient(180deg, #4FA3FF 0%, #1F5BFF 100%)',
  X: 'linear-gradient(180deg, #B36BFF 0%, #7A2BFF 100%)',
};

export const GLOW = {
  L: '0 0 18px rgba(200,220,255,.55)',
  F: '0 0 18px rgba(40,120,255,.75)',
  X: '0 0 18px rgba(150,70,255,.75)',
};

export function letterStyle(ch: 'L' | 'F' | 'X') {
  return {
    background: LOGO_COLORS[ch],
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: `drop-shadow(${GLOW[ch]})`,
  } as const;
}

export default function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex select-none font-black uppercase leading-none ${className}`} style={{ transform: 'skewX(-14deg)', letterSpacing: '0.01em' }} aria-label="LFX">
      {(['L', 'F', 'X'] as const).map((c) => (
        <span key={c} aria-hidden="true" style={letterStyle(c)}>
          {c}
        </span>
      ))}
    </span>
  );
}

/* "TRADERS LEONARDO FX" line from the logo */
export function LogoTagline({ className = '' }: { className?: string }) {
  return (
    <span className={className}>
      <span className="text-[#F4F6FF]">Traders </span>
      <span style={{ display: 'inline-block', paddingRight: '0.3em', marginRight: '-0.3em', background: 'linear-gradient(90deg,#5AA2FF,#A45BFF)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 8px rgba(110,90,255,.55))' }}>
        Leonardo FX
      </span>
    </span>
  );
}
