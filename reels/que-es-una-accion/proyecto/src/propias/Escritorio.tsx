// El "cuadrito": un monitor de cristal (transparente, deja ver el planeta detrás) y un personaje en silueta,
// de espaldas, que analiza lo que pasa en la pantalla. Lo que va en la pantalla se pasa como children
// (en coordenadas del lienzo) y se recorta al cristal.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { F, alfa } from "../motor/estilos";
import { bump } from "../motor/anim";
import { pr } from "./mg";

export const PANTALLA = { x0: 80, y0: 262, x1: 1000, y1: 872 };
const CREMA = "#F6ECD2";
const ORO = "#C9A06A";
const MESA_Y = 958;

/** Personaje de espaldas en silueta: relleno casi negro y contorno crema fino. */
const Personaje: React.FC<{ mira: number; inclina: number; asiente: number }> = ({ mira, inclina, asiente }) => {
  const f = useCurrentFrame();
  const respira = Math.sin(f / 15) * 2.5;
  const cx = 250 + mira * 10,
    cy = 1010 - inclina * 18 + asiente * 6;
  const linea = alfa(CREMA, 0.42);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="pj-cuerpo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120F0B" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
      </defs>
      {/* antebrazos sobre la mesa */}
      <path d={`M145 ${1095 + respira} C150 ${1010} 230 ${MESA_Y + 6} 300 ${MESA_Y + 2}`} fill="none" stroke={linea} strokeWidth={2} />
      <path d={`M355 ${1095 + respira} C372 ${1010} 420 ${MESA_Y + 10} 470 ${MESA_Y + 4}`} fill="none" stroke={linea} strokeWidth={2} />
      {/* hombros y espalda */}
      <path
        d={`M78 1220 C82 ${1120 + respira} 120 ${1080 + respira} 190 ${1068 + respira - inclina * 6} C215 ${1062 + respira} 228 ${1056} ${cx - 22} ${cy + 52} L${cx + 22} ${cy + 52} C272 1056 285 ${1062 + respira} 310 ${1068 + respira - inclina * 6} C380 ${1080 + respira} 418 ${1120 + respira} 422 1220 Z`}
        fill="url(#pj-cuerpo)"
        stroke={linea}
        strokeWidth={2}
      />
      {/* cabeza */}
      <g transform={`rotate(${mira * 5} ${cx} ${cy + 50})`}>
        <ellipse cx={cx} cy={cy} rx={46} ry={54} fill="#0B0907" stroke={linea} strokeWidth={2} />
        <path d={`M${cx - 48} ${cy - 2} C${cx - 44} ${cy - 66} ${cx + 44} ${cy - 66} ${cx + 48} ${cy - 2}`} fill="none" stroke={ORO} strokeWidth={3} />
        <rect x={cx - 55} y={cy - 10} width={12} height={28} rx={5} fill={ORO} />
        <rect x={cx + 43} y={cy - 10} width={12} height={28} rx={5} fill={ORO} />
      </g>
    </svg>
  );
};

export const Escritorio: React.FC<{
  children: React.ReactNode;
  /** a dónde mira el personaje: [fotograma, x] (x en pantalla) */
  foco?: [number, number][];
  asiente?: number[];
  seInclina?: number;
  cabecera?: string;
  /** inclinación 3D del monitor al entrar (se endereza) */
  inclina3d?: number;
  dur: number;
}> = ({ children, foco = [], asiente = [], seInclina = 1e9, cabecera, inclina3d = 1, dur }) => {
  const f = useCurrentFrame();
  let fx = 540;
  for (let k = 0; k < foco.length; k++) {
    const [a, x] = foco[k];
    const sig = foco[k + 1];
    if (f >= a) fx = sig && f < sig[0] ? x + (sig[1] - x) * Easing.inOut(Easing.cubic)((f - a) / Math.max(1, sig[0] - a)) : x;
  }
  const mira = interpolate(fx, [PANTALLA.x0, PANTALLA.x1], [-1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inclina = pr(f, seInclina, 16, Easing.inOut(Easing.cubic));
  const nod = asiente.reduce((m, a) => Math.max(m, bump(f, a, 10)), 0);
  const recto = 1 - pr(f, 0, Math.max(30, dur), Easing.out(Easing.cubic));
  const { x0, y0, x1, y1 } = PANTALLA;
  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      {/* mesa: una sola línea y un reflejo tenue */}
      <div style={{ position: "absolute", left: -100, right: -100, top: MESA_Y, height: 2, background: alfa(CREMA, 0.18) }} />
      <div style={{ position: "absolute", left: -100, right: -100, top: MESA_Y + 2, height: 260, background: `linear-gradient(180deg, ${alfa(CREMA, 0.05)} 0%, transparent 100%)` }} />
      <AbsoluteFill style={{ transform: `rotateX(${14 * recto * inclina3d}deg) rotateY(${-8 * recto * inclina3d}deg)`, transformOrigin: "540px 600px" }}>
        {/* pie del monitor */}
        <div style={{ position: "absolute", left: 532, top: y1 + 2, width: 16, height: MESA_Y - y1 - 8, background: alfa(CREMA, 0.16) }} />
        <div style={{ position: "absolute", left: 450, top: MESA_Y - 8, width: 180, height: 6, borderRadius: 3, background: alfa(CREMA, 0.22) }} />
        {/* cristal */}
        <div
          style={{
            position: "absolute",
            left: x0,
            top: y0,
            width: x1 - x0,
            height: y1 - y0,
            borderRadius: 16,
            border: `2px solid ${alfa(CREMA, 0.32)}`,
            background: `linear-gradient(160deg, ${alfa(CREMA, 0.07)} 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.28) 100%)`,
            backdropFilter: "blur(1.5px)",
            boxShadow: `0 0 60px ${alfa(CREMA, 0.06)}`,
          }}
        />
        {cabecera && (
          <div style={{ position: "absolute", left: x0 + 24, top: y0 + 16, display: "flex", alignItems: "center", gap: 10, fontFamily: F.texto, fontWeight: 600, fontSize: 20, letterSpacing: 2, color: alfa(CREMA, 0.55) }}>
            {[0, 1, 2].map((k) => (
              <span key={k} style={{ width: 9, height: 9, borderRadius: 5, background: alfa(CREMA, 0.28) }} />
            ))}
            <span style={{ marginLeft: 8 }}>{cabecera}</span>
          </div>
        )}
        <AbsoluteFill style={{ clipPath: `inset(${y0}px ${1080 - x1}px ${1920 - y1}px ${x0}px round 16px)` }}>{children}</AbsoluteFill>
        {/* brillo del cristal */}
        <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, borderRadius: 16, background: `linear-gradient(115deg, transparent 40%, ${alfa(CREMA, 0.05)} 48%, transparent 56%)`, pointerEvents: "none" }} />
      </AbsoluteFill>
      <Personaje mira={mira} inclina={inclina} asiente={nod} />
    </AbsoluteFill>
  );
};
