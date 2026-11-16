// «El Banco» (Smart Money), el villano del vídeo 5: el magnate del vídeo 2 (traje negro, bombín, gafas de sol,
// bigote de manillar) con sonrisa maliciosa y gestos propios para contar la cacería de stops.
import React from "react";
import { useCurrentFrame } from "remotion";
import { alfa } from "../motor/estilos";
import { PRINCIPAL, ROJO, ORO, pr, sp, REBOTE } from "./mg";

const TRAJE = "#16120E";
const LUZ = alfa("#F2E8D5", 0.55);
const PIEL = "#D9A77C";
const CREMA = "#F2E8D5";

export type Gesto = "no" | "frota" | "bolsa" | "olla" | "espera" | "sorpresa";

/** Brazo con manga: del hombro a la mano pasando por el codo. */
const Brazo: React.FC<{ s: number; codo: [number, number]; mano: [number, number] }> = ({ s, codo, mano }) => {
  const d = `M${s * 64} 100 Q${codo[0]} ${codo[1]} ${mano[0]} ${mano[1]}`;
  return (
    <g>
      <path d={d} fill="none" stroke={LUZ} strokeWidth={38} strokeLinecap="round" />
      <path d={d} fill="none" stroke={TRAJE} strokeWidth={32} strokeLinecap="round" />
      <circle cx={mano[0]} cy={mano[1]} r={16} fill={PIEL} stroke={TRAJE} strokeWidth={2} />
    </g>
  );
};

/** El Banco. `desde`: fotograma en que entra (con rebote desde abajo). */
export const Banco: React.FC<{ x: number; y: number; esc?: number; gesto: Gesto; desde?: number; espejo?: boolean }> = ({ x, y, esc = 1, gesto, desde = 0, espejo = false }) => {
  const f = useCurrentFrame();
  const e = sp(f, desde, REBOTE);
  if (e <= 0) return null;
  const t = f - desde;
  const meneo = Math.sin(t / 3) * 14; // dedo «no, no»
  const frota = Math.sin(t / 1.6) * 8;
  const remueve = Math.sin(t / 5);
  const sorpresa = gesto === "sorpresa";
  const vuela = sorpresa ? pr(f, desde + 4, 18) : 0;
  let izq: [[number, number], [number, number]] = [[-110, 150], [-60, 190]];
  let der: [[number, number], [number, number]] = [[110, 150], [60, 190]];
  if (gesto === "no") {
    izq = [[-110, 170], [-56, 196]];
    der = [[150, 60], [110 + meneo, -40]];
  } else if (gesto === "frota") {
    izq = [[-100, 170], [-14 + frota, 150]];
    der = [[100, 170], [14 + frota, 156]];
  } else if (gesto === "bolsa") {
    izq = [[-130, 120], [-150, 30]];
    der = [[120, 190], [120, 250]];
  } else if (gesto === "olla") {
    izq = [[-110, 170], [-70, 210]];
    der = [[140, 120], [90 + remueve * 30, 200]];
  } else if (gesto === "espera") {
    izq = [[-60, 160], [40, 140]];
    der = [[60, 170], [-40, 150]];
  } else if (sorpresa) {
    izq = [[-140, 40], [-120, -60]];
    der = [[140, 40], [120, -60]];
  }
  return (
    <g transform={`translate(${x} ${y + (1 - e) * 400}) scale(${(espejo ? -1 : 1) * esc} ${esc})`} opacity={Math.min(1, e * 1.5)}>
      {/* sombra */}
      <ellipse cx={0} cy={210} rx={110} ry={16} fill="rgba(0,0,0,0.45)" />
      {/* cuerpo: traje negro, camisa y corbata roja */}
      <path d="M-86 210 C-92 118 -62 72 0 70 C62 72 92 118 86 210 Z" fill={TRAJE} stroke={LUZ} strokeWidth={4} />
      <path d="M-22 72 L0 130 L22 72 Z" fill="#FFFFFF" />
      <path d="M-7 82 L7 82 L11 150 L0 166 L-11 150 Z" fill={ROJO} />
      <path d="M-22 72 L-6 128 L-42 96 Z M22 72 L6 128 L42 96 Z" fill="#2A231B" stroke={LUZ} strokeWidth={2} />
      {/* bolsa de dinero */}
      {gesto === "bolsa" && (
        <g transform={`translate(120 290) rotate(${Math.sin(t / 4) * 6})`}>
          <path d="M-60 0 C-70 -60 -30 -80 -14 -82 L14 -82 C30 -80 70 -60 60 0 C56 34 -56 34 -60 0 Z" fill="#B88B4A" stroke={TRAJE} strokeWidth={4} />
          <path d="M-20 -82 L-10 -100 L10 -100 L20 -82" fill="#9C7238" stroke={TRAJE} strokeWidth={4} />
          <text x={0} y={-12} textAnchor="middle" fontFamily={PRINCIPAL} fontSize={56} fill={TRAJE}>$</text>
        </g>
      )}
      {/* cucharón de la sopa */}
      {gesto === "olla" && <line x1={90 + remueve * 30} y1={200} x2={60 + remueve * 30} y2={330} stroke="#8C826E" strokeWidth={10} strokeLinecap="round" />}
      <Brazo s={-1} codo={izq[0]} mano={izq[1]} />
      <Brazo s={1} codo={der[0]} mano={der[1]} />
      {gesto === "no" && <rect x={104 + meneo} y={-92} width={12} height={46} rx={6} fill={PIEL} stroke={TRAJE} strokeWidth={2} />}
      {/* cabeza */}
      <rect x={-18} y={42} width={36} height={32} rx={10} fill={PIEL} />
      <ellipse cx={0} cy={0} rx={52} ry={58} fill={PIEL} stroke={TRAJE} strokeWidth={3} />
      <ellipse cx={-52} cy={6} rx={9} ry={14} fill={PIEL} stroke={TRAJE} strokeWidth={2} />
      <ellipse cx={52} cy={6} rx={9} ry={14} fill={PIEL} stroke={TRAJE} strokeWidth={2} />
      {/* gafas de sol y cejas malvadas */}
      <rect x={-42} y={-18} width={36} height={24} rx={8} fill={TRAJE} stroke={LUZ} strokeWidth={2} />
      <rect x={6} y={-18} width={36} height={24} rx={8} fill={TRAJE} stroke={LUZ} strokeWidth={2} />
      <line x1={-6} x2={6} y1={-8} y2={-8} stroke={LUZ} strokeWidth={3} />
      {!sorpresa && <path d="M-44 -30 L-8 -22 M44 -30 L8 -22" stroke="#2A1D12" strokeWidth={6} strokeLinecap="round" />}
      {/* nariz, bigote y boca */}
      <ellipse cx={0} cy={12} rx={9} ry={11} fill="#C48E66" />
      <path d="M0 26 C-14 20 -30 22 -40 30 C-48 36 -50 26 -44 22 M0 26 C14 20 30 22 40 30 C48 36 50 26 44 22" fill="none" stroke="#2A1D12" strokeWidth={9} strokeLinecap="round" />
      {sorpresa ? (
        <ellipse cx={0} cy={44} rx={10} ry={13} fill="#2A1D12" />
      ) : (
        <>
          <path d="M-22 36 Q0 58 22 36 Z" fill="#2A1D12" />
          <path d="M-16 39 L16 39" stroke="#FFFFFF" strokeWidth={4} />
        </>
      )}
      {/* bombín (sale volando en la sorpresa) */}
      <g transform={`translate(${vuela * 90} ${-vuela * 220}) rotate(${vuela * 160} 0 -60)`}>
        <ellipse cx={0} cy={-50} rx={66} ry={12} fill={TRAJE} stroke={LUZ} strokeWidth={2} />
        <path d="M-42 -50 C-42 -112 42 -112 42 -50 Z" fill={TRAJE} stroke={LUZ} strokeWidth={2} />
        <rect x={-42} y={-62} width={84} height={9} fill={ROJO} opacity={0.8} />
      </g>
      {/* risa / sorpresa */}
      {!sorpresa && gesto !== "espera" && t > 6 && (
        <text x={espejo ? -90 : 90} y={-80} transform={espejo ? "scale(-1 1)" : undefined} textAnchor="middle" fontFamily={PRINCIPAL} fontSize={40} fill={ORO} opacity={0.4 + 0.6 * Math.abs(Math.sin(t / 4))}>
          je je
        </text>
      )}
      {sorpresa && <text x={0} y={-150} textAnchor="middle" fontFamily={PRINCIPAL} fontSize={60} fill={CREMA} opacity={pr(f, desde + 2, 6)}>!?</text>}
    </g>
  );
};

/** El Banco dentro de su propio SVG a pantalla completa (para ponerlo encima de cualquier escena). */
export const BancoCapa: React.FC<React.ComponentProps<typeof Banco>> = (p) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
    <Banco {...p} />
  </svg>
);
