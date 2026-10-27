// El "cuadrito": un monitor minimalista sobre una mesa y un personaje 2D de espaldas que mueve el ratón y
// analiza el gráfico. Lo que va en la pantalla se pasa como children (en coordenadas de pantalla del lienzo)
// y se recorta al cristal del monitor.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { F } from "../motor/estilos";
import { bump } from "../motor/anim";
import { DISPLAY, Halo, pr } from "./mg";

export const PANTALLA = { x0: 128, y0: 268, x1: 952, y1: 752 };
const MESA_Y = 868;
const PIEL = "#D9A77C";
const PELO = "#2A1E15";
const SUDADERA = "#3B3128";
const CREMA = "#F6ECD2";

export type Punto = [frame: number, x: number, y: number];

/** Posición del cursor interpolando entre puntos [fotograma, x, y]. */
export const cursorEn = (f: number, pts: Punto[]): [number, number] => {
  if (!pts.length) return [540, 510];
  if (f <= pts[0][0]) return [pts[0][1], pts[0][2]];
  for (let k = 0; k + 1 < pts.length; k++) {
    const [a, xa, ya] = pts[k],
      [b, xb, yb] = pts[k + 1];
    if (f <= b) {
      const t = Easing.inOut(Easing.cubic)((f - a) / Math.max(1, b - a));
      return [xa + (xb - xa) * t, ya + (yb - ya) * t];
    }
  }
  const u = pts[pts.length - 1];
  return [u[1], u[2]];
};

const Cursor: React.FC<{ x: number; y: number; clics: number[] }> = ({ x, y, clics }) => {
  const f = useCurrentFrame();
  const pulsa = clics.reduce((m, c) => Math.max(m, bump(f, c, 8)), 0);
  return (
    <>
      {clics.map((c) => {
        const t = (f - c) / 12;
        if (t < 0 || t > 1) return null;
        return <div key={c} style={{ position: "absolute", left: x - 30 * t, top: y - 30 * t, width: 60 * t, height: 60 * t, borderRadius: "50%", border: "3px solid #141414", opacity: 1 - t }} />;
      })}
      <svg width={40} height={40} style={{ position: "absolute", left: x - 4, top: y - 2, transform: `scale(${1 - 0.15 * pulsa})`, transformOrigin: "4px 2px", overflow: "visible" }}>
        <path d="M4 2 L4 30 L11 23 L16 35 L21 33 L16 21 L26 21 Z" fill="#FFFFFF" stroke="#141414" strokeWidth={2.5} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** Personaje 2D de espaldas, sentado frente al monitor. */
const Personaje: React.FC<{ mira: number; inclina: number; asiente: number; mano: [number, number] }> = ({ mira, inclina, asiente, mano }) => {
  const f = useCurrentFrame();
  const respira = Math.sin(f / 14) * 3;
  const cx = 300 + mira * 14,
    cy = 955 - inclina * 22 + asiente * 8;
  const giro = mira * 6;
  const hombroD: [number, number] = [400, 1040 + respira];
  const hombroI: [number, number] = [200, 1040 + respira];
  const manoI: [number, number] = [372, MESA_Y + 30];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {/* respaldo de la silla */}
      <rect x={150} y={1015} width={300} height={230} rx={40} fill="#16120E" stroke="#2A241D" strokeWidth={3} />
      {/* brazos apoyados en la mesa: el izquierdo en el teclado, el derecho en el ratón */}
      <path d={`M${hombroI[0]} ${hombroI[1]} Q${hombroI[0] - 40} ${MESA_Y + 70} ${manoI[0]} ${manoI[1]}`} fill="none" stroke={SUDADERA} strokeWidth={44} strokeLinecap="round" />
      <circle cx={manoI[0]} cy={manoI[1]} r={18} fill={PIEL} />
      <path d={`M${hombroD[0]} ${hombroD[1]} Q${hombroD[0] + 70} ${MESA_Y + 80} ${mano[0]} ${mano[1]}`} fill="none" stroke={SUDADERA} strokeWidth={44} strokeLinecap="round" />
      <circle cx={mano[0]} cy={mano[1]} r={18} fill={PIEL} />
      {/* cuerpo (sudadera con capucha) */}
      <path d={`M150 ${1180} Q150 ${1020 + respira} 300 ${1005 + respira - inclina * 10} Q450 ${1020 + respira} 450 ${1180} Z`} fill={SUDADERA} />
      <path d={`M232 ${1020 + respira - inclina * 8} Q300 ${1060 + respira} 368 ${1020 + respira - inclina * 8}`} fill="none" stroke={CREMA} strokeOpacity={0.35} strokeWidth={5} strokeLinecap="round" />
      {/* cabeza de espaldas */}
      <g transform={`rotate(${giro} ${cx} ${cy + 60})`}>
        <rect x={cx - 26} y={cy + 40} width={52} height={40} rx={14} fill={PIEL} />
        <circle cx={cx - 70} cy={cy + 8} r={16} fill={PIEL} />
        <circle cx={cx + 70} cy={cy + 8} r={16} fill={PIEL} />
        <circle cx={cx} cy={cy} r={74} fill={PELO} />
        <path d={`M${cx - 66} ${cy - 20} Q${cx - 40} ${cy - 92} ${cx + 10} ${cy - 76} Q${cx + 70} ${cy - 66} ${cx + 66} ${cy - 10}`} fill="none" stroke="#3D2C20" strokeWidth={10} strokeLinecap="round" />
        {/* auriculares */}
        <path d={`M${cx - 78} ${cy + 4} Q${cx} ${cy - 112} ${cx + 78} ${cy + 4}`} fill="none" stroke="#C9A06A" strokeWidth={9} strokeLinecap="round" />
        <rect x={cx - 92} y={cy - 12} width={22} height={40} rx={10} fill="#C9A06A" />
        <rect x={cx + 70} y={cy - 12} width={22} height={40} rx={10} fill="#C9A06A" />
      </g>
    </svg>
  );
};

/** Taza con vapor (detalle que siempre se mueve). */
const Taza: React.FC<{ x: number }> = ({ x }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {[0, 1].map((k) => {
        const d = ((f + k * 20) % 40) / 40;
        return <path key={k} d={`M${x + 12 + k * 18} ${MESA_Y - 62 - d * 50} q8 -12 0 -24 q-8 -12 0 -24`} fill="none" stroke={CREMA} strokeOpacity={0.35 * (1 - d)} strokeWidth={4} strokeLinecap="round" />;
      })}
      <rect x={x} y={MESA_Y - 60} width={52} height={56} rx={10} fill="#C9A06A" />
      <path d={`M${x + 52} ${MESA_Y - 46} q22 0 22 16 q0 16 -22 16`} fill="none" stroke="#C9A06A" strokeWidth={7} />
    </svg>
  );
};

export const Escritorio: React.FC<{
  children: React.ReactNode;
  cursor: Punto[];
  clics?: number[];
  /** fotogramas en que el personaje asiente (al marcar algo) */
  asiente?: number[];
  /** fotograma desde el que se inclina hacia la pantalla */
  seInclina?: number;
  cabecera?: string;
  taza?: boolean;
}> = ({ children, cursor, clics = [], asiente = [], seInclina = 1e9, cabecera, taza = true }) => {
  const f = useCurrentFrame();
  const [x, y] = cursorEn(f, cursor);
  const mira = interpolate(x, [PANTALLA.x0, PANTALLA.x1], [-1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inclina = pr(f, seInclina, 16, Easing.inOut(Easing.cubic));
  const nod = asiente.reduce((m, a) => Math.max(m, bump(f, a, 10)), 0);
  const mano: [number, number] = [600 + (x - 540) * 0.1, MESA_Y + 34 + (y - 510) * 0.04];
  const entra = pr(f, 0, 12, Easing.out(Easing.cubic));
  const { x0, y0, x1, y1 } = PANTALLA;
  return (
    <AbsoluteFill>
      <Halo x={540} y={510} r={620} color={CREMA} op={0.1} />
      {/* mesa */}
      <div style={{ position: "absolute", left: -100, right: -100, top: MESA_Y, height: 700, background: "linear-gradient(180deg, #1A140E 0%, #0A0806 60%, #000000 100%)", borderTop: "3px solid #3A2F23" }} />
      {/* monitor */}
      <div style={{ position: "absolute", left: 510, top: 768, width: 60, height: 70, background: "#2A241D" }} />
      <div style={{ position: "absolute", left: 420, top: 832, width: 240, height: 22, borderRadius: 11, background: "#2A241D" }} />
      <div style={{ position: "absolute", left: 110, top: 250, width: 860, height: 520, borderRadius: 26, background: "#1B1814", border: "3px solid #3A322A", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", transform: `scale(${0.96 + 0.04 * entra})`, transformOrigin: "540px 510px" }} />
      <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, borderRadius: 10, background: "#F4EEDF", boxShadow: `0 0 90px rgba(246,236,210,0.18)` }} />
      {cabecera && <div style={{ position: "absolute", left: x0 + 22, top: y0 + 14, fontFamily: F.texto, fontWeight: 600, fontSize: 20, color: "#6B6458", letterSpacing: 1 }}>{cabecera}</div>}
      <AbsoluteFill style={{ clipPath: `inset(${y0}px ${1080 - x1}px ${1920 - y1}px ${x0}px round 10px)` }}>
        {children}
        <Cursor x={x} y={y} clics={clics} />
      </AbsoluteFill>
      {/* teclado y ratón */}
      <div style={{ position: "absolute", left: 300, top: MESA_Y + 18, width: 220, height: 30, borderRadius: 8, background: "#2A241D" }} />
      <div style={{ position: "absolute", left: mano[0] - 18, top: mano[1] - 14, width: 36, height: 48, borderRadius: 18, background: "#3A322A" }} />
      {taza && <Taza x={900} />}
      <Personaje mira={mira} inclina={inclina} asiente={nod} mano={mano} />
    </AbsoluteFill>
  );
};

/** Óvalo dibujado a mano alrededor de algo (como los análisis de Order Block). */
export const Ovalo: React.FC<{ x: number; y: number; rx: number; ry: number; desde: number; color: string; giro?: number }> = ({ x, y, rx, ry, desde, color, giro = -8 }) => {
  const f = useCurrentFrame();
  const p = pr(f, desde, 10, Easing.inOut(Easing.cubic));
  if (p <= 0) return null;
  // una vuelta y un poco más, con el final que no cierra del todo
  const pts: string[] = [];
  for (let k = 0; k <= 60; k++) {
    const a = -Math.PI / 2 + (k / 60) * Math.PI * 2.15;
    const r = 1 + 0.06 * Math.sin(k * 0.7);
    pts.push(`${k ? "L" : "M"}${(x + Math.cos(a) * rx * r).toFixed(1)} ${(y + Math.sin(a) * ry * r).toFixed(1)}`);
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={pts.join(" ")} pathLength={1} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} transform={`rotate(${giro} ${x} ${y})`} />
    </svg>
  );
};

/** Palabra con subrayado de rotulador que se dibuja (estilo "vela bajista"). */
export const Rotulo: React.FC<{ x: number; y: number; texto: string; desde: number; color: string; tam?: number; previo?: string }> = ({ x, y, texto, desde, color, tam = 34, previo }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const k = pr(f, desde, 8);
  const sub = pr(f, desde + 4, 10);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * k})`, opacity: k, whiteSpace: "nowrap", display: "flex", alignItems: "baseline", gap: tam * 0.3 }}>
      {previo && <span style={{ fontFamily: F.texto, fontWeight: 600, fontSize: tam * 0.8, color: "#141414" }}>{previo}</span>}
      <span style={{ position: "relative", fontFamily: DISPLAY, fontSize: tam, color }}>
        {texto}
        <span style={{ position: "absolute", left: 0, bottom: -4, height: 3, width: `${sub * 100}%`, background: color, borderRadius: 2 }} />
      </span>
    </div>
  );
};
