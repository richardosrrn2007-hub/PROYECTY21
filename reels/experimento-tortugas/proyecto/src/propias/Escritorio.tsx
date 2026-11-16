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
const MESA_Y = 1072;

export type Punto = [frame: number, x: number, y: number];

/** Posición del cursor interpolando entre puntos [fotograma, x, y]. */
export const cursorEn = (f: number, pts: Punto[]): [number, number] => {
  if (!pts.length) return [540, 560];
  if (f <= pts[0][0]) return [pts[0][1], pts[0][2]];
  for (let k = 0; k + 1 < pts.length; k++) {
    const [a, xa, ya] = pts[k],
      [b, xb, yb] = pts[k + 1];
    if (f <= b) {
      const t = Easing.inOut(Easing.cubic)((f - a) / Math.max(1, b - a));
      // pequeño temblor de mano para que parezca movido por una persona
      return [xa + (xb - xa) * t + Math.sin(f / 3) * 1.5, ya + (yb - ya) * t + Math.cos(f / 4) * 1.2];
    }
  }
  const u = pts[pts.length - 1];
  return [u[1] + Math.sin(f / 7) * 3, u[2] + Math.cos(f / 9) * 2];
};

const Cursor: React.FC<{ x: number; y: number; clics: number[] }> = ({ x, y, clics }) => {
  const f = useCurrentFrame();
  const pulsa = clics.reduce((m, c) => Math.max(m, bump(f, c, 8)), 0);
  return (
    <>
      {clics.map((c) => {
        const t = (f - c) / 12;
        if (t < 0 || t > 1) return null;
        return <div key={c} style={{ position: "absolute", left: x - 26 * t, top: y - 26 * t, width: 52 * t, height: 52 * t, borderRadius: "50%", border: `2px solid ${alfa(CREMA, 0.8)}`, opacity: 1 - t }} />;
      })}
      <svg width={40} height={40} style={{ position: "absolute", left: x - 4, top: y - 2, transform: `scale(${1 - 0.15 * pulsa})`, transformOrigin: "4px 2px", overflow: "visible", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }}>
        <path d="M4 2 L4 30 L11 23 L16 35 L21 33 L16 21 L26 21 Z" fill={CREMA} stroke="#000" strokeWidth={2} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** Personaje de espaldas, ilustración plana: pelo rizado, sudadera con capucha, brazos con manga y manos,
 * y una luz de borde crema que viene del monitor. */
const PIEL = "#C68F67";
const PIEL_SOMBRA = "#9E6C4C";
const PELO = "#1C140E";
const PELO_LUZ = "#5A4331";
const TELA = "#2B241D";
const TELA_SOMBRA = "#15110D";
const LUZ = alfa(CREMA, 0.55);

const Brazo: React.FC<{ hombro: [number, number]; mano: [number, number]; codo: [number, number] }> = ({ hombro, mano, codo }) => {
  const d = `M${hombro[0]} ${hombro[1]} Q${codo[0]} ${codo[1]} ${mano[0]} ${mano[1]}`;
  // dirección del antebrazo para colocar el puño y la mano
  const ang = Math.atan2(mano[1] - codo[1], mano[0] - codo[0]);
  const px = mano[0] - Math.cos(ang) * 16,
    py = mano[1] - Math.sin(ang) * 16;
  return (
    <g>
      <path d={d} fill="none" stroke={LUZ} strokeWidth={36} strokeLinecap="round" />
      <path d={d} fill="none" stroke={TELA} strokeWidth={32} strokeLinecap="round" />
      <path d={d} fill="none" stroke={TELA_SOMBRA} strokeWidth={12} strokeLinecap="round" opacity={0.5} transform="translate(4,6)" />
      <circle cx={px} cy={py} r={17} fill={TELA_SOMBRA} />
      <g transform={`translate(${mano[0]},${mano[1]}) rotate(${(ang * 180) / Math.PI - 90})`}>
        <ellipse cx={0} cy={4} rx={16} ry={15} fill={PIEL} />
        {[-12, -4, 4, 12].map((x, k) => (
          <ellipse key={k} cx={x * 0.8} cy={15 + (k === 0 || k === 3 ? -3 : 0)} rx={4} ry={7} fill={PIEL} stroke={PIEL_SOMBRA} strokeWidth={1.2} />
        ))}
      </g>
    </g>
  );
};

export type Pose = "mesa" | "celebra" | "cabeza" | "lanza";
type Brazos = { codoI: [number, number]; manoI: [number, number]; codoD: [number, number]; manoD: [number, number] };
const mezcla = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Personaje de espaldas con poses: en la mesa (teclado y ratón), celebrando (brazos arriba) o con las manos en la cabeza. */
export const Personaje: React.FC<{
  mira?: number;
  inclina?: number;
  asiente?: number;
  raton?: [number, number];
  pose?: Pose;
  /** fotograma en que cambia a `pose` (antes está en la mesa) */
  cambio?: number;
  mesa?: boolean;
  /** colocación: desplazamiento y escala alrededor del centro del personaje */
  dx?: number;
  dy?: number;
  escala?: number;
}> = ({ mira = 0, inclina = 0, asiente = 0, raton = [470, MESA_Y - 10], pose = "mesa", cambio = 0, mesa = true, dx = 0, dy = 0, escala = 1 }) => {
  const f = useCurrentFrame();
  const t = pose === "mesa" ? 0 : pr(f, cambio, 10, Easing.out(Easing.back(1.4)));
  const bota = pose === "celebra" && f > cambio + 8 ? Math.abs(Math.sin((f - cambio) / 5)) * 12 : 0;
  const niega = pose === "cabeza" && f > cambio + 6 ? Math.sin((f - cambio) / 3.2) * 6 * Math.max(0, 1 - (f - cambio) / 50) : 0;
  const r = Math.sin(f / 15) * 2.5 - bota;
  const cx = 250 + mira * 10,
    cy = 1000 - inclina * 18 + asiente * 6 - bota - (pose === "celebra" ? 10 * t : 0);
  const [mx, my] = raton;
  const hI: [number, number] = [140, 1104 + r],
    hD: [number, number] = [360, 1104 + r];
  const enMesa: Brazos = mesa
    ? { codoI: [100, 1156], manoI: [236, MESA_Y - 4 - (Math.floor(f / 45) % 3 === 0 ? Math.abs(Math.sin(f / 2.5)) * 5 : 0)], codoD: [404, 1156], manoD: [mx - 6, my - 2] }
    : { codoI: [104, 1190], manoI: [130, 1236], codoD: [396, 1190], manoD: [370, 1236] };
  const impulso = pose === "lanza" ? Math.abs(Math.sin(((f - cambio) / 9) * Math.PI)) : 0;
  const fin: Brazos =
    pose === "lanza"
      ? { codoI: enMesa.codoI, manoI: enMesa.manoI, codoD: [420, 1050], manoD: [470 + 40 * impulso, 985 - 30 * impulso] }
      : pose === "celebra"
      ? { codoI: [70, 1010 - bota], manoI: [96, 870 - bota], codoD: [430, 1010 - bota], manoD: [404, 870 - bota] }
      : { codoI: [70, 1030], manoI: [cx - 44, cy - 34], codoD: [430, 1030], manoD: [cx + 44, cy - 34] };
  const b: Brazos = { codoI: mezcla(enMesa.codoI, fin.codoI, t), manoI: mezcla(enMesa.manoI, fin.manoI, t), codoD: mezcla(enMesa.codoD, fin.codoD, t), manoD: mezcla(enMesa.manoD, fin.manoD, t) };
  const rizos = Array.from({ length: 13 }).map((_, k) => {
    const a = Math.PI * (0.95 + (k / 12) * 1.1);
    const mece = Math.sin(f / 9 + k) * 1.6;
    return { x: cx + Math.cos(a) * 50 + mece, y: cy - 6 + Math.sin(a) * 58, r: 15 + (k % 3) * 3 };
  });
  const brazos = (
    <>
      <Brazo hombro={hI} codo={b.codoI} mano={b.manoI} />
      <Brazo hombro={hD} codo={b.codoD} mano={b.manoD} />
    </>
  );
  const sobreCabeza = pose === "cabeza" && t > 0.5;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="pj-tela" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TELA} />
          <stop offset="1" stopColor="#0A0806" />
        </linearGradient>
      </defs>
      <g transform={`translate(${dx},${dy}) translate(250 1120) scale(${escala}) translate(-250 -1120)`}>
        {mesa && (
          <>
            <rect x={170} y={MESA_Y - 16} width={190} height={14} rx={4} fill="#14110D" stroke={alfa(CREMA, 0.3)} strokeWidth={1.5} />
            <ellipse cx={mx} cy={my} rx={22} ry={12} fill="#14110D" stroke={alfa(CREMA, 0.45)} strokeWidth={1.5} />
          </>
        )}
        {!sobreCabeza && brazos}
        {/* espalda con capucha */}
        <path
          d={`M186 1240 C176 1196 134 ${1156 + r} 118 ${1114 + r} C112 ${1094 + r} 150 ${1082 + r} 192 ${1077 + r - inclina * 6} C220 ${1072 + r} ${cx - 36} ${cy + 74} ${cx} ${cy + 72} C${cx + 36} ${cy + 74} 280 ${1072 + r} 308 ${1077 + r - inclina * 6} C350 ${1082 + r} 388 ${1094 + r} 382 ${1114 + r} C366 ${1156 + r} 324 1196 314 1240 Z`}
          fill="url(#pj-tela)"
          stroke={LUZ}
          strokeWidth={2.5}
        />
        <path d={`M${cx - 62} ${cy + 78} C${cx - 58} ${cy + 130} ${cx + 58} ${cy + 130} ${cx + 62} ${cy + 78} C${cx + 30} ${cy + 96} ${cx - 30} ${cy + 96} ${cx - 62} ${cy + 78} Z`} fill={TELA} stroke={LUZ} strokeWidth={2} />
        <path d={`M${cx - 40} ${cy + 96} C${cx - 20} ${cy + 116} ${cx + 20} ${cy + 116} ${cx + 40} ${cy + 96}`} fill="none" stroke={TELA_SOMBRA} strokeWidth={6} strokeLinecap="round" />
        <path d={`M${cx} ${cy + 124} L${cx} 1240`} stroke={TELA_SOMBRA} strokeWidth={3} opacity={0.7} />
        <path d={`M168 ${1150 + r} q26 26 54 30 M332 ${1150 + r} q-26 26 -54 30`} fill="none" stroke={TELA_SOMBRA} strokeWidth={4} strokeLinecap="round" />
        <g transform={`rotate(${mira * 5 + niega + Math.sin(f / 37) * 2.5} ${cx} ${cy + 50})`}>
          <rect x={cx - 22} y={cy + 30} width={44} height={44} rx={12} fill={PIEL_SOMBRA} />
          <ellipse cx={cx - 50} cy={cy + 8} rx={10} ry={16} fill={PIEL} />
          <ellipse cx={cx + 50} cy={cy + 8} rx={10} ry={16} fill={PIEL} />
          <ellipse cx={cx} cy={cy} rx={48} ry={56} fill={PELO} />
          {rizos.map((z, k) => (
            <circle key={k} cx={z.x} cy={z.y} r={z.r} fill={PELO} />
          ))}
          {rizos.map((z, k) => (k % 2 ? null : <path key={`l${k}`} d={`M${z.x - z.r * 0.5} ${z.y - z.r * 0.2} q${z.r * 0.5} ${-z.r * 0.6} ${z.r} 0`} fill="none" stroke={PELO_LUZ} strokeWidth={2.5} strokeLinecap="round" />))}
          {[-22, 0, 22].map((x, k) => (
            <path key={`m${k}`} d={`M${cx + x - 8} ${cy - 10 + k * 6} q8 -10 16 0 q8 10 16 0`} fill="none" stroke={PELO_LUZ} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
          ))}
          <path d={`M${cx - 54} ${cy + 2} C${cx - 52} ${cy - 76} ${cx + 52} ${cy - 76} ${cx + 54} ${cy + 2}`} fill="none" stroke={ORO} strokeWidth={6} strokeLinecap="round" />
          <rect x={cx - 66} y={cy - 12} width={18} height={36} rx={8} fill={ORO} />
          <rect x={cx + 48} y={cy - 12} width={18} height={36} rx={8} fill={ORO} />
          <path d={`M${cx - 40} ${cy - 50} C${cx - 20} ${cy - 74} ${cx + 20} ${cy - 74} ${cx + 40} ${cy - 50}`} fill="none" stroke={LUZ} strokeWidth={2} opacity={0.7} />
        </g>
        {sobreCabeza && brazos}
      </g>
    </svg>
  );
};

export const Escritorio: React.FC<{
  children: React.ReactNode;
  /** a dónde mira el personaje: [fotograma, x] (x en pantalla) */
  foco?: [number, number][];
  /** recorrido del cursor en la pantalla: [fotograma, x, y] */
  cursor?: Punto[];
  clics?: number[];
  asiente?: number[];
  seInclina?: number;
  cabecera?: string;
  /** inclinación 3D del monitor al entrar (se endereza) */
  inclina3d?: number;
  dur: number;
  /** fotograma en que la pantalla se apaga como una tele (se aplasta en una línea de luz) */
  apagaEn?: number;
}> = ({ children, foco = [], cursor = [], clics = [], asiente = [], seInclina = 1e9, cabecera, inclina3d = 1, dur, apagaEn = 1e9 }) => {
  const f = useCurrentFrame();
  const [cxp, cyp] = cursorEn(f, cursor);
  const raton: [number, number] = [470 + (cxp - 540) * 0.08, MESA_Y - 10 + (cyp - 560) * 0.015];
  let fx = 540;
  for (let k = 0; k < foco.length; k++) {
    const [a, x] = foco[k];
    const sig = foco[k + 1];
    if (f >= a) fx = sig && f < sig[0] ? x + (sig[1] - x) * Easing.inOut(Easing.cubic)((f - a) / Math.max(1, sig[0] - a)) : x;
  }
  if (cursor.length) fx = cxp;
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
        <AbsoluteFill style={{ clipPath: `inset(${y0}px ${1080 - x1}px ${1920 - y1}px ${x0}px round 16px)`, transform: f >= apagaEn ? `scale(${1 - 0.1 * pr(f, apagaEn, 10, Easing.in(Easing.cubic))}, ${Math.max(0.004, 1 - pr(f, apagaEn, 10, Easing.in(Easing.cubic)))})` : undefined, transformOrigin: `540px ${(y0 + y1) / 2}px`, filter: f >= apagaEn ? `brightness(${1 + 3 * pr(f, apagaEn, 10)})` : undefined, opacity: f > apagaEn + 12 ? 0 : 1 }}>
          {children}
          {cursor.length > 0 && <Cursor x={cxp} y={cyp} clics={clics} />}
        </AbsoluteFill>
        {/* brillo del cristal */}
        <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, borderRadius: 16, background: `linear-gradient(115deg, transparent 40%, ${alfa(CREMA, 0.05)} 48%, transparent 56%)`, pointerEvents: "none" }} />
      </AbsoluteFill>
      <Personaje mira={mira} inclina={inclina} asiente={nod} raton={raton} />
    </AbsoluteFill>
  );
};

/** Mano del protagonista que entra desde abajo y pulsa un botón con el índice (con manga de la sudadera). */
export const ManoPulsa: React.FC<{ x: number; y: number; toque: number }> = ({ x, y, toque }) => {
  const f = useCurrentFrame();
  const entra = pr(f, toque - 14, 12, Easing.out(Easing.cubic));
  const pulsa = bump(f, toque, 8);
  if (entra <= 0) return null;
  const ox = x + 260 * (1 - entra) + 6 * pulsa,
    oy = y + 380 * (1 - entra) + 10 * pulsa;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(${ox},${oy}) rotate(-28)`}>
        {/* manga */}
        <path d="M-10 120 L40 120 L52 520 L-40 520 Z" fill={TELA} stroke={LUZ} strokeWidth={2.5} />
        <rect x={-14} y={108} width={58} height={22} rx={8} fill={TELA_SOMBRA} />
        {/* mano: palma, dedos doblados y el índice estirado */}
        <path d="M-18 112 C-24 70 -10 46 14 44 C40 42 52 66 50 112 Z" fill={PIEL} stroke={PIEL_SOMBRA} strokeWidth={2} />
        {[8, 22, 36].map((dx, k) => (
          <ellipse key={k} cx={dx} cy={48} rx={8} ry={11} fill={PIEL} stroke={PIEL_SOMBRA} strokeWidth={1.5} />
        ))}
        <path d="M-8 52 C-10 30 -8 6 0 0 C8 6 10 30 8 52 Z" fill={PIEL} stroke={PIEL_SOMBRA} strokeWidth={2} />
        <ellipse cx={0} cy={6} rx={5} ry={4} fill="#E8C3A4" />
        <path d="M-22 96 C-36 80 -34 64 -22 60" fill="none" stroke={PIEL_SOMBRA} strokeWidth={2} />
      </g>
    </svg>
  );
};
