// Vídeo 2 · Cómo leer una vela. La batalla entre compradores (toro blanco, tira hacia arriba) y vendedores
// (oso negro, tira hacia abajo) de una cuerda: el nudo es el precio y va dibujando la vela del día.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { numeroES, rnd } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { arr, txt } from "../escenas/util";
import { Icono } from "../piezas/basicas";
import { Escritorio, Personaje } from "./Escritorio";
import { TRANSICION } from "./Cierre";
import { GraficoVelas, PAPEL, geometria, serieVelas } from "./Velas";
import { AAPL_DIARIO } from "./aapl_diario";
import { Chispas, Etiqueta, Halo, ORO, PRINCIPAL, REBOTE, ROJO, Revela, SECUND, Trazo, VERDE, encajar, pr, principalPara, sp, temblor } from "./mg";

const CREMA = "#F2E8D5";
const TINTA = "#16120E";
const LUZ = alfa("#F6ECD2", 0.6);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------- personajes

export type Animo = "tira" | "gana" | "pierde";

/** Torso musculoso en V: hombros anchos, pectorales y abdominales. Origen: centro de la cabeza. */
const Torso: React.FC<{ piel: string; borde: string; linea: string; pecho?: string }> = ({ piel, borde, linea, pecho }) => (
  <g>
    {/* trapecios y cuello */}
    <path d="M-40 40 L-100 92 L100 92 L40 40 Z" fill={piel} stroke={borde} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-112 96 C-120 78 -90 70 -60 74 L60 74 C90 70 120 78 112 96 C104 150 74 190 58 214 L-58 214 C-74 190 -104 150 -112 96 Z" fill={piel} stroke={borde} strokeWidth={4} strokeLinejoin="round" />
    {pecho && <ellipse cx={0} cy={150} rx={46} ry={56} fill={pecho} />}
    {/* pectorales */}
    <path d="M-6 96 C-30 88 -76 92 -82 116 C-78 134 -36 140 -6 128 Z M6 96 C30 88 76 92 82 116 C78 134 36 140 6 128 Z" fill="none" stroke={linea} strokeWidth={4} strokeLinejoin="round" />
    {/* abdominales */}
    <line x1={0} x2={0} y1={136} y2={208} stroke={linea} strokeWidth={4} strokeLinecap="round" />
    {[150, 172, 194].map((yy) => (
      <path key={yy} d={`M-30 ${yy} Q-16 ${yy + 5} -4 ${yy} M4 ${yy} Q16 ${yy + 5} 30 ${yy}`} fill="none" stroke={linea} strokeWidth={4} strokeLinecap="round" />
    ))}
  </g>
);

/** Brazo musculoso: tira de la cuerda (hasta la mano) o saca bíceps al ganar. s = lado (-1 izquierda, 1 derecha). */
const Brazo: React.FC<{ s: number; gana: boolean; mano: [number, number]; piel: string; borde: string; puno: string; f: number }> = ({ s, gana, mano, piel, borde, puno, f }) => {
  const flex = gana ? Math.sin(f / 5) * 6 : 0;
  // hombro → codo → mano
  const codo: [number, number] = gana ? [s * 178, 96 + flex] : mano[1] > 0 ? [s * 150, 170] : [s * 168, 0];
  const fin: [number, number] = gana ? [s * 172, -14 + flex] : mano;
  const d = `M${s * 100} 100 L${codo[0]} ${codo[1]} L${fin[0]} ${fin[1]}`;
  // bíceps: bulto en el brazo
  const bx = (s * 100 + codo[0]) / 2,
    by = (100 + codo[1]) / 2 - (gana ? 14 : 0);
  return (
    <g>
      <path d={d} fill="none" stroke={borde} strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={piel} strokeWidth={43} strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={bx} cy={by} rx={gana ? 34 : 30} ry={gana ? 30 : 24} transform={`rotate(${(Math.atan2(codo[1] - 100, codo[0] - s * 100) * 180) / Math.PI} ${bx} ${by})`} fill={piel} stroke={borde} strokeWidth={4} />
      <circle cx={fin[0]} cy={fin[1]} r={21} fill={puno} stroke={borde} strokeWidth={3} />
    </g>
  );
};

/** Toro blanco musculoso (compradores), de frente, tirando de la cuerda hacia abajo. Origen: centro de la cabeza. */
export const Toro: React.FC<{ x: number; y: number; esc?: number; animo?: Animo; manos?: number }> = ({ x, y, esc = 1, animo = "tira", manos = 235 }) => {
  const f = useCurrentFrame();
  const gana = animo === "gana";
  const pierde = animo === "pierde";
  const sacude = animo === "tira" ? Math.sin(f / 2.2) * 2 : gana ? Math.sin(f / 4) * 4 : 0;
  return (
    <g transform={`translate(${x + sacude},${y}) scale(${esc}) rotate(${pierde ? 8 : 0})`}>
      <Torso piel={CREMA} borde={TINTA} linea={alfa(TINTA, 0.4)} />
      {[-1, 1].map((s) => (
        <Brazo key={s} s={s} gana={gana} mano={[s * 14, manos]} piel={CREMA} borde={TINTA} puno="#D9B79A" f={f} />
      ))}
      {/* cuernos */}
      {[-1, 1].map((s) => (
        <path key={`c${s}`} d={`M${s * 46} -38 C${s * 84} -46 ${s * 104} -80 ${s * 96} -118 C${s * 86} -88 ${s * 66} -66 ${s * 40} -60 Z`} fill={ORO} stroke={TINTA} strokeWidth={3} />
      ))}
      {[-1, 1].map((s) => (
        <ellipse key={`o${s}`} cx={s * 72} cy={-12} rx={24} ry={11} transform={`rotate(${s * 20} ${s * 72} -12)`} fill={CREMA} stroke={TINTA} strokeWidth={3} />
      ))}
      {/* cabeza ancha */}
      <path d="M-58 -50 C-64 -90 64 -90 58 -50 L62 30 C64 66 -64 66 -62 30 Z" fill={CREMA} stroke={TINTA} strokeWidth={4} />
      <ellipse cx={0} cy={34} rx={48} ry={27} fill="#D9B79A" stroke={TINTA} strokeWidth={3} />
      <ellipse cx={-15} cy={34} rx={5} ry={7} fill={TINTA} />
      <ellipse cx={15} cy={34} rx={5} ry={7} fill={TINTA} />
      {/* esfuerzo: vapor por la nariz y gota de sudor */}
      {animo === "tira" &&
        [-1, 1].map((s) => {
          const c = ((f + (s > 0 ? 10 : 0)) % 20) / 20;
          return <circle key={`v${s}`} cx={s * (18 + 40 * c)} cy={44 + 18 * c} r={6 + 12 * c} fill={alfa("#FFFFFF", 0.55 * (1 - c))} />;
        })}
      {animo === "tira" && (() => {
        const c = (f % 36) / 36;
        return <path d={`M66 ${-44 + 60 * c} q-9 14 0 20 q9 -6 0 -20 Z`} fill="#9FD3F0" stroke={TINTA} strokeWidth={2} opacity={c < 0.85 ? 1 : (1 - c) / 0.15} />;
      })()}
      {/* aro de oro en la nariz */}
      <path d="M-14 46 Q0 72 14 46" fill="none" stroke={ORO} strokeWidth={5} />
      {[-1, 1].map((s) => (
        <g key={`e${s}`}>
          <circle cx={s * 24} cy={-14} r={pierde ? 3 : 6} fill={TINTA} />
          <path d={gana ? `M${s * 34} -34 Q${s * 24} -40 ${s * 14} -34` : `M${s * 38} -32 L${s * 10} -22`} stroke={TINTA} strokeWidth={6} strokeLinecap="round" fill="none" />
        </g>
      ))}
    </g>
  );
};

/** Oso negro musculoso (vendedores), de frente, tirando de la cuerda hacia arriba. Origen: centro de la cabeza. */
export const Oso: React.FC<{ x: number; y: number; esc?: number; animo?: Animo; manos?: number }> = ({ x, y, esc = 1, animo = "tira", manos = -150 }) => {
  const f = useCurrentFrame();
  const gana = animo === "gana";
  const pierde = animo === "pierde";
  const sacude = animo === "tira" ? Math.cos(f / 2.4) * 2 : gana ? Math.sin(f / 4) * 4 : 0;
  return (
    <g transform={`translate(${x + sacude},${y}) scale(${esc}) rotate(${pierde ? -8 : 0})`}>
      <Torso piel={TINTA} borde={LUZ} linea={alfa(CREMA, 0.3)} pecho="#2E231A" />
      {[-1, 1].map((s) => (
        <Brazo key={s} s={s} gana={gana} mano={[s * 16, manos]} piel={TINTA} borde={LUZ} puno="#3A2C20" f={f} />
      ))}
      {[-1, 1].map((s) => (
        <g key={`o${s}`}>
          <circle cx={s * 56} cy={-50} r={24} fill={TINTA} stroke={LUZ} strokeWidth={3} />
          <circle cx={s * 56} cy={-50} r={11} fill="#3A2C20" />
        </g>
      ))}
      <ellipse cx={0} cy={0} rx={70} ry={64} fill={TINTA} stroke={LUZ} strokeWidth={3} />
      <ellipse cx={0} cy={26} rx={34} ry={25} fill="#5A4535" />
      <ellipse cx={0} cy={15} rx={13} ry={8} fill="#0A0806" />
      <path d={pierde ? "M-12 42 Q0 34 12 42" : "M-12 36 Q0 44 12 36"} fill="none" stroke="#0A0806" strokeWidth={3} strokeLinecap="round" />
      {/* cicatriz de luchador */}
      <path d="M34 -36 L48 -6 M30 -26 L44 -30 M36 -16 L50 -20" stroke={alfa(CREMA, 0.5)} strokeWidth={3} strokeLinecap="round" />
      {[-1, 1].map((s) => (
        <g key={`e${s}`}>
          {gana && <circle cx={s * 26} cy={-10} r={16} fill={alfa(ROJO, 0.45 + 0.2 * Math.sin(f / 3))} />}
          <circle cx={s * 26} cy={-10} r={pierde ? 3 : 6} fill={gana ? ROJO : CREMA} />
          <path d={gana ? `M${s * 36} -28 Q${s * 26} -34 ${s * 16} -28` : `M${s * 40} -28 L${s * 12} -16`} stroke={CREMA} strokeWidth={6} strokeLinecap="round" fill="none" />
        </g>
      ))}
    </g>
  );
};

/** Magnate de frente (gente con plata): traje, bigote de manillar y sombrero. Origen: centro de la cabeza.
 * arriba = true: está encima de la vela y tira con los brazos hacia abajo (comprador). false: tira hacia arriba (vendedor). */
const PIEL = "#D9A77C";
export const Magnate: React.FC<{ x: number; y: number; esc?: number; animo?: Animo; arriba: boolean }> = ({ x, y, esc = 1, animo = "tira", arriba }) => {
  const f = useCurrentFrame();
  const gana = animo === "gana";
  const pierde = animo === "pierde";
  const traje = arriba ? CREMA : TINTA;
  const borde = arriba ? TINTA : LUZ;
  const manos = arriba ? 190 : -150;
  const sacude = animo === "tira" ? Math.sin(f / (arriba ? 2.2 : 2.4)) * 2 : gana ? Math.sin(f / 4) * 4 : 0;
  const brazo = (s: number) =>
    gana ? `M${s * 64} 100 Q${s * 120} 30 ${s * 96} -66` : arriba ? `M${s * 64} 100 Q${s * 74} 160 ${s * 14} ${manos}` : `M${s * 70} 110 Q${s * 130} -40 ${s * 18} ${manos}`;
  const mano = (s: number): [number, number] => (gana ? [s * 96, -72] : [s * 14, manos + (arriba ? 6 : -6)]);
  return (
    <g transform={`translate(${x + sacude},${y}) scale(${esc}) rotate(${pierde ? (arriba ? 8 : -8) : 0})`}>
      {/* brazos (mangas del traje) */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path d={brazo(s)} fill="none" stroke={borde} strokeWidth={38} strokeLinecap="round" />
          <path d={brazo(s)} fill="none" stroke={traje} strokeWidth={32} strokeLinecap="round" />
          <circle cx={mano(s)[0]} cy={mano(s)[1]} r={15} fill={PIEL} stroke={TINTA} strokeWidth={2} />
        </g>
      ))}
      {/* cuerpo: traje con solapas, camisa y corbata */}
      <path d="M-84 200 C-90 118 -62 72 0 70 C62 72 90 118 84 200 Z" fill={traje} stroke={borde} strokeWidth={4} />
      <path d="M-22 72 L0 130 L22 72 Z" fill="#FFFFFF" />
      <path d="M-7 82 L7 82 L11 150 L0 166 L-11 150 Z" fill={arriba ? ORO : ROJO} />
      <path d="M-22 72 L-6 128 L-42 96 Z M22 72 L6 128 L42 96 Z" fill={arriba ? "#E2D6BE" : "#2A231B"} stroke={borde} strokeWidth={2} />
      {arriba && <path d="M40 110 l10 -8 l6 10" fill="none" stroke={ORO} strokeWidth={3} />}
      {/* cuello y cabeza */}
      <rect x={-18} y={42} width={36} height={32} rx={10} fill={PIEL} />
      <ellipse cx={0} cy={0} rx={52} ry={58} fill={PIEL} stroke={TINTA} strokeWidth={3} />
      <ellipse cx={-52} cy={6} rx={9} ry={14} fill={PIEL} stroke={TINTA} strokeWidth={2} />
      <ellipse cx={52} cy={6} rx={9} ry={14} fill={PIEL} stroke={TINTA} strokeWidth={2} />
      {/* pelo de los lados */}
      <path d="M-50 -14 Q-56 -40 -36 -50 M50 -14 Q56 -40 36 -50" fill="none" stroke="#3A2A1C" strokeWidth={9} strokeLinecap="round" />
      {/* ojos: gafas de sol el vendedor */}
      {arriba ? (
        [-1, 1].map((s) => (
          <g key={`o${s}`}>
            <circle cx={s * 20} cy={-6} r={pierde ? 3 : 5} fill={TINTA} />
            <path d={gana ? `M${s * 30} -24 Q${s * 20} -30 ${s * 10} -24` : `M${s * 32} -20 L${s * 10} -15`} stroke="#3A2A1C" strokeWidth={5} strokeLinecap="round" fill="none" />
          </g>
        ))
      ) : (
        <g>
          <rect x={-42} y={-18} width={36} height={24} rx={8} fill={TINTA} stroke={LUZ} strokeWidth={2} />
          <rect x={6} y={-18} width={36} height={24} rx={8} fill={TINTA} stroke={LUZ} strokeWidth={2} />
          <line x1={-6} x2={6} y1={-8} y2={-8} stroke={LUZ} strokeWidth={3} />
          <line x1={-34} x2={-24} y1={-12} y2={-12} stroke={alfa("#FFFFFF", 0.5)} strokeWidth={2} />
        </g>
      )}
      {/* nariz y bigote de manillar */}
      <ellipse cx={0} cy={12} rx={9} ry={11} fill="#C48E66" />
      <path d={`M0 26 C-14 20 -30 22 -40 30 C-48 36 -50 26 -44 22 M0 26 C14 20 30 22 40 30 C48 36 50 26 44 22`} fill="none" stroke="#2A1D12" strokeWidth={9} strokeLinecap="round" />
      <path d={pierde ? "M-10 44 Q0 38 10 44" : gana ? "M-12 38 Q0 50 12 38" : "M-10 40 L10 40"} fill="none" stroke="#2A1D12" strokeWidth={3} strokeLinecap="round" />
      {/* sombrero: copa blanca el comprador, bombín negro el vendedor */}
      {arriba ? (
        <g transform={gana ? `translate(0 ${-14 - Math.abs(Math.sin(f / 5)) * 12})` : undefined}>
          <rect x={-60} y={-56} width={120} height={12} rx={6} fill={CREMA} stroke={TINTA} strokeWidth={3} />
          <rect x={-38} y={-128} width={76} height={74} rx={6} fill={CREMA} stroke={TINTA} strokeWidth={3} />
          <rect x={-38} y={-70} width={76} height={12} fill={ORO} />
        </g>
      ) : (
        <g>
          <ellipse cx={0} cy={-50} rx={66} ry={12} fill={TINTA} stroke={LUZ} strokeWidth={2} />
          <path d="M-42 -50 C-42 -112 42 -112 42 -50 Z" fill={TINTA} stroke={LUZ} strokeWidth={2} />
          <rect x={-42} y={-62} width={84} height={9} fill={ROJO} opacity={0.8} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- relleno: marcador, público y capítulos

/** Barra de fuerza a la derecha: sube (crema) cuando ganan los compradores y baja (negra) cuando ganan los vendedores. */
/** Barras de vida de videojuego de lucha, arriba: compradores (izquierda) contra vendedores (derecha).
 * La vida se vacía hacia el centro; el tramo blanco es el daño reciente (se queda un momento y se va). */
const Vida: React.FC<{ fz: number; fzAntes: number; y: number; gana: "toro" | "oso" | null }> = ({ fz, fzAntes, y, gana }) => {
  const f = useCurrentFrame();
  const c = (v: number) => Math.max(0.05, Math.min(1, v));
  const hT = c(0.5 + 0.5 * fz),
    hO = c(0.5 - 0.5 * fz);
  const hTa = Math.max(hT, c(0.5 + 0.5 * fzAntes)),
    hOa = Math.max(hO, c(0.5 - 0.5 * fzAntes));
  const W = 400;
  const parpadeo = (lado: "toro" | "oso") => (gana && gana !== lado && Math.floor(f / 3) % 2 ? 0.35 : 1);
  const barra = (lado: "toro" | "oso") => {
    const izq = lado === "toro";
    const h = izq ? hT : hO,
      ha = izq ? hTa : hOa;
    return (
      <div style={{ position: "relative", width: W, height: 34, transform: `skewX(${izq ? -14 : 14}deg)`, border: `3px solid ${ORO}`, background: alfa("#000", 0.75), overflow: "hidden", opacity: parpadeo(lado) }}>
        {/* el lado de fuera es el que se vacía: la vida está pegada al centro */}
        <div style={{ position: "absolute", top: 0, bottom: 0, [izq ? "right" : "left"]: 0, width: W * ha, background: "#FFFFFF" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, [izq ? "right" : "left"]: 0, width: W * h, background: izq ? `linear-gradient(90deg, ${ORO}, ${CREMA})` : `linear-gradient(270deg, #7A1F1A, ${ROJO})` }} />
      </div>
    );
  };
  const entra = sp(f, 0, REBOTE);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${(1 - entra) * -120}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {barra("toro")}
        <div style={{ fontFamily: PRINCIPAL, fontSize: 54, color: ORO, width: 90, textAlign: "center", textShadow: "0 0 20px rgba(0,0,0,0.9)" }}>VS</div>
        {barra("oso")}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: 900, marginTop: 6, fontFamily: F.texto, fontWeight: 800, fontSize: 22, letterSpacing: 4 }}>
        <span style={{ color: CREMA }}>COMPRADORES</span>
        <span style={{ color: ROJO }}>VENDEDORES</span>
      </div>
    </div>
  );
};

/** Golpe de anime: 2 fotogramas con los colores invertidos y un zoom que se recoge. */
const impacto = (f: number, golpes: number[]) => {
  const t = golpes.filter((g) => g <= f).pop();
  if (t === undefined) return { filtro: undefined as string | undefined, zoom: 1 };
  const d = f - t;
  return { filtro: d < 2 ? "invert(1) contrast(1.3)" : undefined, zoom: 1 + 0.07 * Math.max(0, 1 - d / 8) };
};

const Marcador: React.FC<{ fuerza: number }> = ({ fuerza }) => {
  const f = useCurrentFrame();
  const x = 930,
    y0 = Y_ALTO,
    y1 = Y_BAJO,
    mid = (y0 + y1) / 2;
  const h = Math.max(-1, Math.min(1, fuerza)) * (mid - y0);
  const pc = Math.round(50 + 50 * Math.max(-1, Math.min(1, fuerza)));
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: pr(f, 0, 10) }}>
        <rect x={x - 16} y={y0} width={32} height={y1 - y0} rx={16} fill={alfa(C.texto, 0.08)} stroke={alfa(C.texto, 0.25)} strokeWidth={2} />
        <rect x={x - 12} y={h > 0 ? mid - h : mid} width={24} height={Math.abs(h)} rx={10} fill={h > 0 ? CREMA : TINTA} stroke={h > 0 ? "none" : CREMA} strokeWidth={2} />
        <line x1={x - 24} x2={x + 24} y1={mid} y2={mid} stroke={ORO} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left: x - 70, width: 140, top: y0 - 70, textAlign: "center", fontFamily: F.texto, fontWeight: 800, fontSize: 26, color: CREMA, fontVariantNumeric: "tabular-nums" }}>{pc}%</div>
      <div style={{ position: "absolute", left: x - 70, width: 140, top: y1 + 16, textAlign: "center", fontFamily: F.texto, fontWeight: 800, fontSize: 26, color: alfa(CREMA, 0.6), fontVariantNumeric: "tabular-nums" }}>{100 - pc}%</div>
    </>
  );
};

/** Público en las esquinas de abajo: siluetas que animan a cada bando y saltan cuando su lado va ganando. */
const Publico: React.FC<{ fuerza: number }> = ({ fuerza }) => {
  const f = useCurrentFrame();
  const fila = (lado: -1 | 1) =>
    Array.from({ length: 6 }).map((_, k) => {
      const anima = lado < 0 ? fuerza > 0.15 : fuerza < -0.15;
      const salto = anima ? Math.abs(Math.sin((f + k * 7) / 4)) * 18 : Math.sin((f + k * 11) / 20) * 2;
      const x = lado < 0 ? 40 + k * 62 : 1040 - k * 62;
      const y = 1250 - (k % 2) * 26 - salto;
      const col = lado < 0 ? alfa(CREMA, 0.55) : alfa("#000000", 0.95);
      const borde = lado < 0 ? "none" : alfa(CREMA, 0.4);
      return (
        <g key={`${lado}${k}`}>
          <circle cx={x} cy={y} r={20} fill={col} stroke={borde} strokeWidth={2} />
          <path d={`M${x - 30} ${y + 70} Q${x} ${y + 14} ${x + 30} ${y + 70} Z`} fill={col} stroke={borde} strokeWidth={2} />
          {anima && <path d={`M${x - 22} ${y + 34} L${x - 34} ${y - 6} M${x + 22} ${y + 34} L${x + 34} ${y - 6}`} stroke={col} strokeWidth={10} strokeLinecap="round" />}
        </g>
      );
    });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {fila(-1)}
      {fila(1)}
    </svg>
  );
};

/** Órdenes que lanza el público: etiquetas que vuelan hacia el nudo. Del bando que va ganando salen más. */
const Ordenes: React.FC<{ fuerzaEn: (f: number) => number; nudo: (f: number) => number }> = ({ fuerzaEn, nudo }) => {
  const f = useCurrentFrame();
  const out: React.ReactNode[] = [];
  const VIAJE = 20;
  for (let n = 0; n < 60; n++) {
    const sale = 3 + n * 15;
    if (sale > f) break;
    const t = (f - sale) / VIAJE;
    if (t > 1) continue;
    const fz = fuerzaEn(sale);
    // de qué lado sale: más del bando que gana
    const compra = rnd(n * 3.7 + 1) < 0.5 + Math.max(-0.4, Math.min(0.4, fz * 0.5));
    const k = Math.floor(rnd(n * 5.3) * 6);
    const x0 = compra ? 40 + k * 62 : 1040 - k * 62,
      y0 = 1230;
    const x1 = 540 + (compra ? -36 : 36),
      y1 = nudo(sale + VIAJE);
    const e = Easing.inOut(Easing.cubic)(t);
    const x = x0 + (x1 - x0) * e,
      y = y0 + (y1 - y0) * e - Math.sin(t * Math.PI) * 120;
    const cant = 1 + Math.floor(rnd(n * 9.1) * 20);
    out.push(
      <div
        key={n}
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%,-50%) scale(${Math.min(1, t * 6, (1 - t) * 5)}) rotate(${(compra ? -1 : 1) * (1 - t) * 14}deg)`,
          background: compra ? CREMA : TINTA,
          color: compra ? TINTA : ROJO,
          border: `2px solid ${compra ? ORO : ROJO}`,
          borderRadius: 8,
          padding: "5px 12px",
          fontFamily: F.texto,
          fontWeight: 800,
          fontSize: 27,
          letterSpacing: 1,
          whiteSpace: "nowrap",
          boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
        }}
      >
        {compra ? `COMPRA +${cant}` : `VENTA −${cant}`}
      </div>,
    );
  }
  return <>{out}</>;
};

export const CAPITULOS = ["BATALLA", "APERTURA", "COLOR", "MECHAS", "CUERPO", "GRÁFICA"];
/** Barra de capítulos abajo: el actual se ilumina; da sensación de progreso. */
export const Capitulos: React.FC<{ activo: number; y?: number }> = ({ activo, y = 1425 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", justifyContent: "center", gap: 10, opacity: pr(f, 0, 8) }}>
      {CAPITULOS.map((c, k) => {
        const on = k === activo,
          hecho = k < activo;
        return (
          <div key={c} style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 18, letterSpacing: 2, padding: "7px 12px", borderRadius: 20, color: on ? TINTA : hecho ? ORO : alfa(CREMA, 0.4), background: on ? ORO : "transparent", border: `2px solid ${on || hecho ? ORO : alfa(CREMA, 0.2)}`, transform: on ? `scale(${1 + 0.08 * Math.max(0, 1 - f / 12)})` : undefined }}>
            {c}
          </div>
        );
      })}
    </div>
  );
};
const capituloDe = (modo: string) => ({ gancho: -1, batalla: 0, abre: 1, pelea: 1, blanca: 2, negra: 2, mechas: 3, fuerza: 4, rechazo: 4 } as Record<string, number>)[modo] ?? 0;

/** Movimiento de cámara distinto para cada escena de batalla. */
const camara = (modo: string, t: number) => {
  switch (modo) {
    case "batalla":
      return `scale(${1 + 0.08 * t})`;
    case "pelea":
      return `scale(${1.06 + 0.06 * Math.sin(t * Math.PI * 3)}) rotate(${Math.sin(t * Math.PI * 4) * 1.5}deg)`;
    case "abre":
      return `perspective(1600px) rotateY(${10 - 10 * t}deg) scale(${1.04 - 0.04 * t})`;
    case "blanca":
      return `scale(${1.14 - 0.14 * t}) translateY(${40 * (1 - t)}px)`;
    case "negra":
      return `rotate(${3 - 4 * t}deg) scale(${1.05})`;
    case "mechas":
      // zoom dentro de la vela: los personajes salen de plano y solo queda la vela con la cuerda
      return `scale(${1 + 0.62 * Easing.inOut(Easing.cubic)(Math.min(1, t * 3.5))})`;
    case "fuerza":
      return `scale(${1 + 0.1 * t}) translateY(${30 * t}px)`;
    case "rechazo":
      return `perspective(1600px) rotateX(${8 - 8 * t}deg) scale(${1.06 - 0.04 * t})`;
    default:
      return "";
  }
};

/** Reloj de la sesión: corre de 9:30 (apertura) a 16:00 (cierre). */
const Reloj: React.FC<{ f: number; desde: number; hasta: number }> = ({ f, desde, hasta }) => {
  const t = pr(f, desde, Math.max(10, hasta - desde), Easing.inOut(Easing.cubic));
  const min = Math.round(570 + (960 - 570) * t);
  const hh = Math.floor(min / 60),
    mm = String(min % 60).padStart(2, "0");
  const ang = (min / 60) * 30;
  const cierra = f >= hasta - 2;
  return (
    <div style={{ position: "absolute", left: 60, top: 1090, display: "flex", alignItems: "center", gap: 18, transform: `scale(${sp(f, desde - 6, REBOTE)})` }}>
      <svg width={90} height={90}>
        <circle cx={45} cy={45} r={40} fill={TINTA} stroke={ORO} strokeWidth={5} />
        <line x1={45} y1={45} x2={45 + 22 * Math.sin((ang * Math.PI) / 180)} y2={45 - 22 * Math.cos((ang * Math.PI) / 180)} stroke={CREMA} strokeWidth={6} strokeLinecap="round" />
        <line x1={45} y1={45} x2={45 + 32 * Math.sin((min % 60) * 6 * Math.PI / 180)} y2={45 - 32 * Math.cos((min % 60) * 6 * Math.PI / 180)} stroke={ORO} strokeWidth={4} strokeLinecap="round" />
      </svg>
      <div>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 52, color: CREMA, fontVariantNumeric: "tabular-nums" }}>{hh}:{mm}</div>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: cierra ? ORO : alfa(CREMA, 0.6) }}>{cierra ? "CIERRE" : min <= 572 ? "APERTURA" : "SESIÓN"}</div>
      </div>
    </div>
  );
};

/** Partes de la vela señaladas como en un libro: una línea fina sale de cada parte hacia la derecha con su nombre.
 * Cada entrada es "parte@momento" (parte: apertura, cierre, maximo, minimo). */
const Partes: React.FC<{ partes: string[]; b: number[]; f: number; yAbre: number; yCierre: number; yMax: number; yMin: number; xCuerpo?: number; xMecha?: number; xt?: number; tam?: number }> = ({ partes, b, f, yAbre, yCierre, yMax, yMin, xCuerpo = 635, xMecha = 553, xt = 760, tam = 36 }) => {
  const def: Record<string, { y: number; x0: number; texto: string; color: string }> = {
    maximo: { y: yMax, x0: xMecha, texto: "MÁXIMO", color: ORO },
    cierre: { y: yCierre, x0: xCuerpo, texto: "CIERRE", color: CREMA },
    apertura: { y: yAbre, x0: xCuerpo, texto: "APERTURA", color: CREMA },
    minimo: { y: yMin, x0: xMecha, texto: "MÍNIMO", color: ORO },
  };
  // de arriba abajo, con un hueco mínimo entre etiquetas para que no se pisen
  const vis = partes
    .map((t) => t.split("@"))
    .map(([nombre, m]) => ({ nombre, d: b[Number(m)] ?? 0 }))
    .filter((x) => def[x.nombre] && f >= x.d - 2)
    .sort((x, z) => def[x.nombre].y - def[z.nombre].y);
  let ultimo = -1e9;
  const filas = vis.map((x) => {
    const yy = Math.max(def[x.nombre].y, ultimo + tam * 1.45);
    ultimo = yy;
    return { ...x, ...def[x.nombre], yy };
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {filas.map((x) => {
        const k = sp(f, x.d - 2, REBOTE);
        return (
          <g key={x.nombre} opacity={Math.min(1, k)}>
            <circle cx={x.x0} cy={x.y} r={tam / 6} fill={x.color} />
            <path d={`M${x.x0} ${x.y} L${x.x0 + (xt - 20 - x.x0) * 0.5} ${x.y} L${xt - 20} ${x.yy}`} fill="none" stroke={x.color} strokeWidth={tam / 12} strokeDasharray={`${400 * Math.min(1, k)} 400`} />
            <text x={xt} y={x.yy + tam * 0.32} fontFamily={F.texto} fontWeight={800} fontSize={tam} letterSpacing={3} fill={x.color} style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 6 }} transform={`translate(${(1 - Math.min(1, k)) * 30} 0)`}>
              {x.texto}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** Primer plano de anime: pantalla partida con el toro y el oso apretando, líneas de velocidad y la vela que tiembla en medio. */
const PrimerPlano: React.FC<{ f: number; dur: number; precio: number; abre: number; tinte: number; fzAntes: number }> = ({ f, dur, precio, abre, tinte, fzAntes }) => {
  const entra = pr(f, 0, 8, Easing.out(Easing.cubic));
  const tiembla = Math.sin(f * 2.3) * 6;
  const lineas = (cx: number, cy: number, col: string, semilla: number) =>
    Array.from({ length: 24 }).map((_, k) => {
      const a = (k / 24) * Math.PI * 2 + semilla;
      const r0 = 300 + rnd(k + semilla * 10) * 120 + ((f * 50) % 220);
      return <line key={k} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * (r0 + 320)} y2={cy + Math.sin(a) * (r0 + 320)} stroke={col} strokeWidth={4 + rnd(k) * 6} opacity={0.45} />;
    });
  // la vela de la pelea, pequeña, en la diagonal: se estira arriba y abajo
  const yv = 900,
    alto = (precio - abre) * 520;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: -200, top: -600, width: 1480, height: 1900, clipPath: "polygon(0 0, 100% 0, 100% 58%, 0 74%)", background: `linear-gradient(160deg, #3A3326, #1A1611)`, transform: `translate(${(1 - entra) * -700 + tiembla}px, 0)` }}>
        <svg width={1480} height={1900} style={{ position: "absolute", left: 0, top: 0 }}>
          {lineas(700, 1150, alfa(CREMA, 0.3), 0.3)}
          <Toro x={600} y={1120} esc={2.5} animo="tira" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: -200, top: -600, width: 1480, height: 3000, clipPath: "polygon(0 49.6%, 100% 39.4%, 100% 100%, 0 100%)", background: `linear-gradient(160deg, #120E0B, #000)`, transform: `translate(${(1 - entra) * 700 - tiembla}px, 0)` }}>
        <svg width={1480} height={3000} style={{ position: "absolute", left: 0, top: 0 }}>
          {lineas(760, 1950, alfa(ROJO, 0.35), 1.1)}
          <Oso x={880} y={1980} esc={2.5} animo="tira" />
        </svg>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={-200} y1={806} x2={1280} y2={502} stroke={ORO} strokeWidth={10} />
        <g transform={`translate(${540 + tiembla * 0.5} ${yv - 140})`}>
          <rect x={-70} y={-70} width={140} height={360} rx={16} fill={alfa("#000", 0.75)} stroke={ORO} strokeWidth={4} />
          <line x1={0} x2={0} y1={-40} y2={260} stroke={CREMA} strokeWidth={8} />
          <rect x={-36} y={Math.min(110, 110 - alto)} width={72} height={Math.max(6, Math.abs(alto))} fill={alto >= 0 ? CREMA : TINTA} stroke={CREMA} strokeWidth={4} />
        </g>
      </svg>
      <Vida fz={tinte} fzAntes={fzAntes} y={-128} gana={null} />
      {void dur}
    </AbsoluteFill>
  );
};

/** Arranque "VS": pantalla partida en diagonal con los dos magnates, líneas de velocidad y un VS que golpea. */
const Versus: React.FC<{ f: number; fin: number }> = ({ f, fin }) => {
  const entra = pr(f, 0, 6, Easing.out(Easing.cubic));
  const sale = pr(f, fin - 2, 8, Easing.in(Easing.cubic));
  const golpe = sp(f, 4, { damping: 9, stiffness: 260, mass: 0.5 });
  const tiembla = f >= 4 && f < 12 ? Math.sin(f * 7) * 10 * (1 - (f - 4) / 8) : 0;
  const lineas = (cx: number, cy: number, col: string, semilla: number) =>
    Array.from({ length: 26 }).map((_, k) => {
      const a = (k / 26) * Math.PI * 2 + semilla;
      const r0 = 260 + rnd(k + semilla * 10) * 120 + ((f * 40) % 200);
      return <line key={k} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * (r0 + 300)} y2={cy + Math.sin(a) * (r0 + 300)} stroke={col} strokeWidth={4 + rnd(k) * 6} opacity={0.5} />;
    });
  return (
    <AbsoluteFill style={{ transform: `translate(${tiembla}px, 0)`, opacity: 1 - sale * 0.2 }}>
      {/* mitad de arriba: comprador */}
      <div style={{ position: "absolute", left: -200, top: -600, width: 1480, height: 1900, clipPath: "polygon(0 0, 100% 0, 100% 58%, 0 74%)", background: `linear-gradient(160deg, ${CREMA}, #D8C6A2)`, transform: `translate(${(1 - entra) * -900 - sale * 900}px, ${-sale * 500}px)` }}>
        <svg width={1480} height={1900} style={{ position: "absolute", left: 0, top: 0 }}>
          {lineas(740, 1050, alfa(TINTA, 0.35), 0.3)}
          <Magnate x={600} y={1000} esc={2.4} animo="tira" arriba />
        </svg>
      </div>
      {/* mitad de abajo: vendedor */}
      <div style={{ position: "absolute", left: -200, top: -600, width: 1480, height: 3000, clipPath: "polygon(0 49.6%, 100% 39.4%, 100% 100%, 0 100%)", background: `linear-gradient(160deg, #241B14, ${TINTA})`, transform: `translate(${(1 - entra) * 900 + sale * 900}px, ${sale * 500}px)` }}>
        <svg width={1480} height={3000} style={{ position: "absolute", left: 0, top: 0 }}>
          {lineas(740, 1900, alfa(ROJO, 0.4), 1.1)}
          <Magnate x={880} y={1900} esc={2.4} animo="tira" arriba={false} />
        </svg>
      </div>
      {/* raya dorada de la diagonal y el VS */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - sale }}>
        <line x1={-200} y1={806} x2={1280} y2={502} stroke={ORO} strokeWidth={10} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: PRINCIPAL, fontSize: 190, color: ORO, WebkitTextStroke: `7px ${TINTA}`, transform: `scale(${(1 - golpe) * 3 + golpe}) rotate(-8deg)`, opacity: Math.min(1, f / 3) * (1 - sale), textShadow: "0 10px 40px rgba(0,0,0,0.7)" }}>VS</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- la batalla

/** Precio (0 = mínimo de la pantalla, 1 = máximo) a lo largo de la escena, según el modo. */
type Clave = [frame: number, precio: number];
const recorrido = (modo: string, b: number[], dur: number): Clave[] => {
  const [b0 = 0, b1 = 20, b2 = 40, b3 = 60] = b;
  const fin = dur - 4;
  switch (modo) {
    case "blanca":
      return [[0, 0.45], [b0, 0.36], [b1, 0.72], [b2, 0.6], [fin, 0.92]];
    case "negra":
      return [[0, 0.55], [b0, 0.64], [b1, 0.3], [b2, 0.42], [fin, 0.08]];
    case "mechas":
      return [[0, 0.5], [b0, 0.97], [b1, 0.04], [fin, 0.66]];
    case "fuerza":
      return [[0, 0.22], [b0, 0.45], [b1, 0.85], [fin, 0.95]];
    case "rechazo":
      return [[0, 0.4], [b0, 0.62], [b1, 0.98], [b2, 0.5], [fin, 0.48]];
    case "gancho": {
      // abre abajo, sube a la mecha de arriba, cae a la de abajo, y acaba cerrando arriba: blanca y de cuerpo largo
      const k = Math.max(0.5, (b1 - 8) / 80);
      return [[0, 0.32], [8 * k, 0.6], [18 * k, 0.22], [28 * k, 0.97], [40 * k, 0.05], [52 * k, 0.7], [62 * k, 0.45], [74 * k, 0.84], [Math.max(76 * k + 1, fin), 0.82]];
    }
    case "pelea": {
      const out: Clave[] = [[0, 0.62]];
      for (let t = 6, k = 0; t < fin; t += 11, k++) out.push([t, k % 2 ? 0.25 + 0.1 * rnd(k) : 0.78 - 0.1 * rnd(k + 3)]);
      return out;
    }
    case "abre":
      return [[0, 0.45], [b0, 0.45], [b1, 0.7], [b2, 0.35], [fin, 0.78]];
    default:
      // batalla: va y viene
      return [[0, 0.5], [b0, 0.72], [b1, 0.3], [b2, 0.76], [b3, 0.38], [fin, 0.62]];
  }
};
const precioEn = (f: number, claves: Clave[]) => {
  if (f <= claves[0][0]) return claves[0][1];
  for (let k = 0; k + 1 < claves.length; k++) {
    const [a, pa] = claves[k],
      [bb, pb] = claves[k + 1];
    if (f <= bb) return pa + (pb - pa) * Easing.inOut(Easing.cubic)((f - a) / Math.max(1, bb - a));
  }
  return claves[claves.length - 1][1];
};

const Y_ALTO = 460,
  Y_BAJO = 960;
const yDe = (p: number) => Y_BAJO - (Y_BAJO - Y_ALTO) * p;

const Batalla: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const modo = txt(p, "modo", "batalla");
  const claves = recorrido(modo, b, dur);
  const precio = precioEn(f, claves) + Math.sin(f / 3) * 0.006;
  // máximo y mínimo alcanzados hasta ahora (dibujan las mechas)
  let hi = claves[0][1],
    lo = claves[0][1];
  for (let t = 0; t <= f; t += 2) {
    const v = precioEn(t, claves);
    hi = Math.max(hi, v);
    lo = Math.min(lo, v);
  }
  const abre = claves[0][1];
  const sube = precio >= abre;
  const yA = yDe(abre),
    yC = yDe(precio);
  // quién tira: la velocidad del precio
  const vel = precioEn(f + 3, claves) - precioEn(f - 3, claves);
  const final = modo === "blanca" || modo === "fuerza" ? "toro" : modo === "negra" ? "oso" : null;
  const ganador = final && f > dur - 24 ? final : null;
  const animoToro: Animo = ganador === "toro" ? "gana" : ganador === "oso" ? "pierde" : "tira";
  const animoOso: Animo = ganador === "oso" ? "gana" : ganador === "toro" ? "pierde" : "tira";
  const yToro = 215 + (modo === "gancho" ? 45 : 0) + (ganador === "toro" ? 40 : 0) - Math.min(50, Math.max(0, vel) * 1100) + (ganador === "oso" ? 40 : 0);
  const ko = modo === "fuerza" && ganador ? sp(f, dur - 24, REBOTE) : 0;
  const yOso = 1150 + Math.min(50, Math.max(0, -vel) * 1100) + (ganador === "toro" ? 40 : 0) - 150 * ko;
  const repeticion = modo === "rechazo";
  const g = temblor(f, b[1] ?? 0, 6);
  const tensa = 1 + Math.abs(vel) * 40;
  const etiquetas = arr<string>(p, "etiquetas");
  const gancho = modo === "gancho";
  // elenco: magnates en el gancho; luego toro y oso musculosos ("cambio": los magnates se transforman en cada momento)
  const elenco = txt(p, "elenco", gancho ? "magnates" : "animales");
  const cambio = elenco === "cambio";
  const [, cT = 0, cO = 0] = b;
  const toroYa = elenco === "animales" || (cambio && f >= cT - 2);
  const osoYa = elenco === "animales" || (cambio && f >= cO - 2);
  const popToro = cambio ? sp(f, cT - 2, REBOTE) : 1;
  const popOso = cambio ? sp(f, cO - 2, REBOTE) : 1;
  const [gb0 = 0, gb1 = 20] = b;
  // golpe de cámara en cada cambio de sentido
  const golpes = gancho ? [claves[3][0], claves[4][0], claves[7][0]] : [];
  const ganaEn = final ? dur - 24 : modo === "rechazo" ? (b[2] ?? 1e9) : null;
  const imp = impacto(f, ganaEn === null ? golpes : [...golpes, ganaEn]);
  // color con significado: verde si van ganando los compradores, rojo si los vendedores
  const tinte = Math.max(-1, Math.min(1, (precio - abre) * 3));
  const ultimoGolpe = golpes.filter((t) => t <= f).pop() ?? -100;
  const choque = gancho ? temblor(f, ultimoGolpe, 12, 6) : { x: 0, y: 0 };
  const acerca = gancho ? pr(f, gb1 - 4, 16, Easing.inOut(Easing.cubic)) : 0;
  const zoomG = gancho ? 0.84 + 0.3 * acerca : 1;
  const vsFin = 24;
  if (modo === "pelea") return <PrimerPlano f={f} dur={dur} precio={precio} abre={abre} tinte={tinte} fzAntes={Math.max(-1, Math.min(1, (precioEn(f - 10, claves) - abre) * 3))} />;
  return (
    <AbsoluteFill style={{ filter: imp.filtro, transform: `scale(${imp.zoom})` }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${alfa(tinte > 0 ? VERDE : ROJO, 0.3 * Math.abs(tinte))} 0%, transparent 65%)` }} />
    <AbsoluteFill style={{ filter: [repeticion ? "sepia(0.35) contrast(1.12) saturate(0.8)" : "", ko > 0 ? `grayscale(${0.75 * Math.min(1, ko)})` : ""].join(" ").trim() || undefined, transform: `translate(${g.x + choque.x}px,${g.y + choque.y + (gancho ? 90 : 0)}px) scale(${zoomG}) ${camara(modo, pr(f, 0, Math.max(30, dur), Easing.inOut(Easing.sin)))}`, transformOrigin: `540px ${gancho ? 330 : 700}px` }}>
      <Publico fuerza={(precio - abre) * 4} />
      {(gancho || modo === "pelea") && <Ordenes fuerzaEn={(t) => (precioEn(t + 3, claves) - precioEn(t - 3, claves)) * 40} nudo={(t) => yDe(precioEn(t, claves))} />}
      <Halo x={540} y={700} r={480} op={0.14} />
      {/* eje de precio a la izquierda */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={150} x2={150} y1={Y_ALTO - 30} y2={Y_BAJO + 30} stroke={alfa(C.texto, 0.18)} strokeWidth={2} />
        <line x1={170} x2={910} y1={yA} y2={yA} stroke={alfa(ORO, 0.6)} strokeWidth={2.5} strokeDasharray="10 10" />
        {/* mecha: barra ancha crema por debajo de la cuerda, para que se lea aunque la cuerda pase por encima */}
        <rect x={540 - 13} y={yDe(hi) - 4} width={26} height={Math.max(8, yDe(lo) - yDe(hi) + 8)} rx={13} fill={CREMA} stroke={TINTA} strokeWidth={3} />
        {/* cuerda */}
        <path d={`M540 ${toroYa ? yToro + 20 + 235 * 0.95 : yToro + 190 * 1.05} Q${540 + Math.sin(f / 2) * 6 / tensa} ${(yToro + yC) / 2} 540 ${yC}`} fill="none" stroke={ORO} strokeWidth={5} />
        <path d={`M540 ${yC} Q${540 - Math.sin(f / 2) * 6 / tensa} ${(yOso + yC) / 2} 540 ${yOso - 150 * 1.05}`} fill="none" stroke={ORO} strokeWidth={5} />
        {/* cuerpo de la vela */}
        <rect x={540 - 95} y={Math.min(yA, yC)} width={190} height={Math.max(4, Math.abs(yC - yA))} rx={4} fill={sube ? CREMA : TINTA} stroke={CREMA} strokeWidth={5} />
        {gancho && <circle cx={540} cy={yC} r={Math.min(150, 70 + Math.abs(vel) * 600)} fill="none" stroke={ORO} strokeWidth={3} opacity={Math.min(1, Math.abs(vel) * 25)} />}
        <circle cx={540} cy={yC} r={13} fill="none" stroke={ORO} strokeWidth={5} />
        {toroYa ? <Toro x={540} y={yToro + 20} esc={0.95 * popToro} animo={animoToro} /> : <Magnate x={540} y={yToro} esc={1.05} animo={animoToro} arriba />}
        {osoYa ? <Oso x={540} y={yOso} esc={1.05 * popOso} animo={animoOso} /> : <Magnate x={540} y={yOso} esc={1.05} animo={animoOso} arriba={false} />}
      </svg>

      <div style={{ position: "absolute", left: 180, top: yA - 44, fontFamily: SECUND, fontSize: 30, color: ORO, opacity: pr(f, 0, 10) }}>abre</div>
      {/* etiquetas de cada momento */}
      {(() => {
        // posiciones sin pisarse: cada etiqueta de la columna izquierda queda al menos 64 px de las anteriores
        const usados: number[] = [];
        return etiquetas.map((t, k) => {
        const d = b[k];
        if (!t || d === undefined || f < d - 2) return null;
        const [texto, lugar] = t.split("@");
        const y = lugar === "arriba" ? 262 : lugar === "abajo" ? 1030 : lugar === "cierre" ? yC - 30 : lugar === "alto" ? yDe(hi) - 30 : lugar === "bajo" ? yDe(lo) - 20 : 380;
        const x = lugar === "arriba" || lugar === "abajo" ? 690 : 110;
        let yy = y;
        if (x === 110) {
          while (usados.some((u) => Math.abs(u - yy) < 64)) yy += 64;
          usados.push(yy);
          // las etiquetas largas ocupan dos líneas: reservan también el hueco de debajo
          if (texto.length > 10) usados.push(yy + 64);
        }
        return (
          <div key={k} style={{ position: "absolute", left: x === 110 ? x : 590, width: 340, top: yy, textAlign: x === 110 ? "left" : "right", transform: `scale(${sp(f, d - 2, REBOTE)})`, transformOrigin: x === 110 ? "0 50%" : "100% 50%", fontFamily: principalPara(texto), fontSize: lugar === "titulo" ? 52 : 44, lineHeight: 1.05, color: lugar === "abajo" ? ROJO : ORO, textShadow: "0 4px 14px rgba(0,0,0,0.85)" }}>
            {x === 110 ? texto : texto.split(" · ").map((l, i) => <div key={i} style={{ fontSize: i ? 34 : 54, fontFamily: i ? SECUND : principalPara(l) }}>{l}</div>)}
          </div>
        );
      });
      })()}
      <Partes partes={arr<string>(p, "partes")} b={b} f={f} yAbre={yA} yCierre={yC} yMax={yDe(hi)} yMin={yDe(lo)} tam={modo === "mechas" ? 24 : 36} xt={modo === "mechas" ? 690 : 760} />
      {/* repetición: rastro del precio en el tiempo, hacia la derecha */}
      {repeticion && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {Array.from({ length: Math.floor(f / 2) }).map((_, i) => {
            const t = i * 2;
            return <circle key={i} cx={660 + (t / Math.max(1, dur)) * 300} cy={yDe(precioEn(t, claves))} r={4} fill={ORO} opacity={0.35 + 0.65 * (t / Math.max(1, f))} />;
          })}
        </svg>
      )}
      {cambio && <Chispas desde={cT - 2} x={540} y={yToro + 60} n={22} r={240} color={CREMA} />}
      {cambio && <Chispas desde={cO - 2} x={540} y={yOso + 60} n={22} r={240} color={ORO} />}
      {ganador && <Chispas desde={dur - 24} x={540} y={ganador === "toro" ? 300 : 1060} n={18} r={260} color={ganador === "toro" ? CREMA : ORO} />}
      {gancho && golpes.map((t, k) => <Chispas key={k} desde={t} x={540} y={yDe(precioEn(t, claves))} n={12} r={170} color={k % 2 ? ORO : CREMA} />)}
      {gancho && f >= gb1 - 4 && (
        <div style={{ position: "absolute", left: 540 - 120, top: (yA + yC) / 2 - 140, width: 240, textAlign: "center", fontFamily: PRINCIPAL, fontSize: 240, color: ORO, textShadow: "0 0 40px rgba(0,0,0,0.9)", transform: `scale(${sp(f, gb1 - 4, REBOTE)}) rotate(${Math.sin(f / 6) * 8}deg)` }}>?</div>
      )}
    </AbsoluteFill>
    {gancho && f < vsFin + 6 && <Versus f={f} fin={vsFin} />}
    {ko > 0 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontFamily: PRINCIPAL, fontSize: 300, color: ROJO, WebkitTextStroke: `9px ${TINTA}`, transform: `scale(${3 - 2 * Math.min(1, ko)}) rotate(-8deg)`, opacity: Math.min(1, ko * 2), textShadow: "0 14px 40px rgba(0,0,0,0.8)" }}>K.O.</div>
    )}
    {repeticion && (
      <>
        <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 70, top: 1320, display: "flex", alignItems: "center", gap: 14, fontFamily: F.texto, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: "#FFFFFF", textShadow: "0 0 12px rgba(255,255,255,0.6)" }}>
          <span style={{ opacity: Math.floor(f / 12) % 2 ? 0.25 : 1 }}>▶</span> REPETICIÓN
        </div>
        <div style={{ position: "absolute", right: 70, top: 1320, fontFamily: F.texto, fontWeight: 700, fontSize: 34, color: "#FFFFFF", opacity: 0.8, fontVariantNumeric: "tabular-nums" }}>
          00:{String(Math.floor(f / 30)).padStart(2, "0")}:{String(f % 30).padStart(2, "0")}
        </div>
      </>
    )}
    {!!p.reloj && <Reloj f={f} desde={b[0] ?? 0} hasta={b[2] ?? dur} />}
    {gancho && (
      <div style={{ position: "absolute", right: 50, top: 210, transform: `scale(${sp(f, 26, REBOTE)}) rotate(-4deg)`, background: ORO, color: TINTA, fontFamily: F.texto, fontWeight: 800, fontSize: 34, letterSpacing: 5, padding: "10px 26px", borderRadius: 40, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>PARTE 2</div>
    )}
    {gancho && (
      <div style={{ position: "absolute", left: 0, right: 0, top: -20, textAlign: "center" }}>
        <div>
          <Revela desde={vsFin - 2} tam={74} fuente={SECUND}>
            ¿Quién ganó
          </Revela>
        </div>
        <div>
          <Revela desde={Math.max(vsFin + 2, gb0 - 4)} tam={encajar("ESTA BATALLA?", 900, 128, principalPara("ESTA BATALLA?"))} color={ORO} fuente={principalPara("ESTA BATALLA?")}>
            ESTA BATALLA?
          </Revela>
        </div>
      </div>
    )}
    </AbsoluteFill>
  );
};

export const batalla: DefEscena = {
  C: Batalla,
  momentos: (p) => Math.max(3, arr(p, "etiquetas").length),
  alInicio: () => true,
  // solo suenan los momentos importantes: el resto lo ponen las frases del plan (ganar, perder, swoosh de capítulo)
  sonidos: (p) => (txt(p, "elenco") === "cambio" ? [[1, "transforma", 0.4], [2, "transforma", 0.4]] : []),
};

// ---------------------------------------------------------------- reto: la vela del gancho

/** La vela del gancho (blanca, cuerpo largo): se repite al final para responder. */
const VelaReto: React.FC<{ f: number; desde: number; respuesta?: number }> = ({ f, desde, respuesta = 1e9 }) => {
  const k = pr(f, desde, 16, Easing.out(Easing.cubic));
  const late = 1 + 0.025 * Math.sin(f / 6);
  const top = 360,
    alto = 330;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(540 ${top + alto / 2}) scale(${late}) translate(-540 ${-(top + alto / 2)})`}>
        <line x1={540} x2={540} y1={top - 70} y2={top + alto + 60} stroke={CREMA} strokeWidth={7} opacity={k} />
        <rect x={540 - 60} y={top + alto * (1 - k)} width={120} height={alto * k} rx={4} fill={f >= respuesta ? CREMA : alfa(CREMA, 0.12)} stroke={CREMA} strokeWidth={6} />
      </g>
    </svg>
  );
};

const Reto: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20] = b;
  const final = txt(p, "modo") === "respuesta";
  const aleja = final ? 1 : pr(f, 0, Math.max(20, b1), Easing.inOut(Easing.cubic));
  const t1 = final ? "¿Y la vela" : "¿Quién ganó";
  const t2 = final ? "DEL PRINCIPIO?" : "ESTA BATALLA?";
  const tam2 = encajar(t2, 860, 130, principalPara(t2));
  // en la respuesta: dos comprobaciones (blanca, cuerpo largo) y luego el sello
  const [, c1 = 1e9, c2 = 1e9, c3 = b1] = b;
  const sello = sp(f, final ? c3 : b1, REBOTE);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${372 * aleja - 120 * (1 - aleja)}px) scale(${0.62 + 0.63 * (1 - aleja)})`, transformOrigin: "540px 262px" }}>
        <Escritorio dur={dur} foco={[[0, 540]]} asiente={[b0, b1]} cabecera="AAPL · 1D">
          <Halo x={540} y={560} r={380} op={0.18} />
          <VelaReto f={f} desde={final ? -40 : 0} respuesta={final ? c1 : 1e9} />
          {final && <Partes partes={["cierre@0", "apertura@2", "maximo@1", "minimo@3"]} b={[c1, c2, c1 + 16, c2 + 8]} f={f} yCierre={360} yAbre={690} yMax={290} yMin={750} xCuerpo={606} xMecha={546} xt={700} tam={52} />}
          {!final && <div style={{ position: "absolute", left: 640, top: 380, fontFamily: PRINCIPAL, fontSize: 140, color: ORO, transform: `rotate(${Math.sin(f / 7) * 10}deg) scale(${sp(f, b0)})` }}>?</div>}
        </Escritorio>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center" }}>
        <div>
          <Revela desde={-10} tam={78} fuente={SECUND}>
            {t1}
          </Revela>
        </div>
        <div>
          <Revela desde={b0 - 4} tam={tam2} color={ORO} fuente={principalPara(t2)}>
            {t2}
          </Revela>
        </div>
      </div>
      {final && sello > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", transform: `scale(${sello}) rotate(-6deg)` }}>
          <div style={{ fontFamily: principalPara("GANARON LOS COMPRADORES"), fontSize: 50, color: TINTA, background: CREMA, border: `4px solid ${ORO}`, borderRadius: 14, padding: "6px 24px", boxShadow: `0 0 40px ${alfa(ORO, 0.5)}` }}>GANARON LOS COMPRADORES</div>
        </div>
      )}
      {final && f >= c3 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <Toro x={190} y={800} esc={0.5} animo="gana" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const reto: DefEscena = { C: Reto, momentos: (p) => (txt(p, "modo") === "respuesta" ? 4 : 2), alInicio: () => true, sonidos: (p) => (txt(p, "modo") === "respuesta" ? [[1, "tic", 0.3], [2, "tic", 0.3], [3, "ganar", 0.4]] : [[0, "burbuja", 0.3]]) };

// ---------------------------------------------------------------- apps: verde y rojo

const Apps: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20] = b;
  const color = pr(f, b1 - 2, 14, Easing.inOut(Easing.cubic));
  const movil = sp(f, b0 - 4);
  const mezcla = (a: string, z: string) => (color > 0.5 ? z : a);
  const vela = (x: number, alza: boolean) => {
    const col = alza ? mezcla(CREMA, VERDE) : mezcla(TINTA, ROJO);
    return (
      <g>
        <line x1={x} x2={x} y1={alza ? 560 : 600} y2={alza ? 900 : 940} stroke={alza ? mezcla(CREMA, VERDE) : mezcla(CREMA, ROJO)} strokeWidth={6} />
        <rect x={x - 45} y={alza ? 620 : 660} width={90} height={220} rx={4} fill={col} stroke={alza ? mezcla(CREMA, VERDE) : mezcla(CREMA, ROJO)} strokeWidth={5} />
      </g>
    );
  };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 300, top: 330, width: 480, height: 760, borderRadius: 60, border: `4px solid ${CREMA}`, background: alfa("#0B0A08", 0.92), transform: `scale(${movil}) rotate(${(1 - movil) * -8}deg)`, boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${60 * color}px ${alfa(VERDE, 0.25)}` }}>
        <div style={{ position: "absolute", left: 190, top: 22, width: 100, height: 10, borderRadius: 5, background: alfa(CREMA, 0.3) }} />
        <div style={{ position: "absolute", left: 40, top: 60, fontFamily: F.texto, fontWeight: 800, fontSize: 30, color: CREMA }}>AAPL</div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: movil }}>
        {vela(450, true)}
        {vela(630, false)}
      </svg>
      <Etiqueta desde={b0} x={540} y={1130} texto="EN TU APP" />
    </AbsoluteFill>
  );
};
export const apps: DefEscena = { C: Apps, momentos: 2, sonidos: () => [[1, "ding", 0.22]] };

// ---------------------------------------------------------------- gráfica y tendencia

const Grafica: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const tendencia = txt(p, "modo") === "tendencia";
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  // datos reales: Apple diario, 27 abr 2016 – 16 feb 2017 (estilo papel, como los análisis en TradingView)
  const velas = AAPL_DIARIO;
  const n = velas.length;
  const marco = { x0: 110, x1: 990, y0: 320, y1: 812 };
  const g = geometria(velas, marco, 20);
  // mínimos más altos: los valles locales
  // mínimos de giro: el más bajo de 9 velas a cada lado
  const VENT = 9;
  const valles: number[] = [];
  velas.forEach((v, k) => {
    if (k >= VENT && k < n - VENT && velas.slice(k - VENT, k + VENT + 1).every((w) => w.l >= v.l)) valles.push(k);
  });
  const subiendo = valles.filter((k, i) => i === 0 || velas[k].l > velas[valles[i - 1]].l);
  const pts = subiendo.map((k) => [g.xVela(k), g.yPrecio(velas[k].l) + 9] as [number, number]);
  const linea = pr(f, b1, 20, Easing.inOut(Easing.cubic));
  const zoom = tendencia ? 1 : 1.9 - 0.9 * pr(f, 0, Math.max(24, b0 + 10), Easing.inOut(Easing.cubic));
  const LLEGA = 18;
  const entra = (k: number) => (tendencia ? -60 : k === n - 1 ? LLEGA - 5 : k < n - 10 ? -60 : (k - (n - 10)) * 2);
  // la vela de la batalla vuela y se coloca como la última vela de la gráfica
  const ult = velas[n - 1];
  const vuela = pr(f, 0, LLEGA, Easing.inOut(Easing.cubic));
  const lerp = (a: number, z: number) => a + (z - a) * vuela;
  // punto de salida: el centro de la pantalla, deshaciendo el zoom inicial (1.9 alrededor de la última vela)
  const ox = g.xVela(n - 1);
  const vx = lerp(ox + (540 - ox) / 1.9, g.xVela(n - 1)),
    vTop = lerp(520, g.yPrecio(Math.max(ult.o, ult.c))),
    vBot = lerp(560, g.yPrecio(Math.min(ult.o, ult.c))),
    vHi = lerp(400, g.yPrecio(ult.h)),
    vLo = lerp(585, g.yPrecio(ult.l)),
    vW = lerp(100, g.hueco * 0.62);
  return (
    <>
    <Escritorio dur={dur} cabecera="AAPL · APPLE INC. · 1D · NASDAQ" foco={[[0, 700], [b1, 400], [b2, 800]]} asiente={[b1, b2]}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${g.xVela(n - 1)}px 560px` }}>
        <div style={{ position: "absolute", left: marco.x0 - 20, top: marco.y0 - 70, width: marco.x1 - marco.x0 + 40, height: marco.y1 - marco.y0 + 120, background: "#DBDBDB", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: marco.x0, top: marco.y0 - 52, fontFamily: F.texto, fontSize: 19, color: "#8A8A8A", whiteSpace: "nowrap" }}>
          Apple Inc. · 1D · NASDAQ <span style={{ color: "#141414", fontWeight: 700 }}>&nbsp;O 135,67 &nbsp;H 135,90 &nbsp;L 134,84 &nbsp;C 135,35</span>
        </div>
        <GraficoVelas velas={velas} marco={marco} entra={entra} forma={5} letra={20} tema={PAPEL} fechas={velas.map((v, k) => (k === 0 ? "" : v.fecha))} volumen={false} />
        {!tendencia && f < LLEGA + 4 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - pr(f, LLEGA, 4) }}>
            <line x1={vx} x2={vx} y1={vHi} y2={vLo} stroke={CREMA} strokeWidth={lerp(8, 2.5)} />
            <rect x={vx - vW / 2} y={vTop} width={vW} height={Math.max(2, vBot - vTop)} fill={vuela > 0.8 ? "#FFFFFF" : CREMA} stroke={vuela > 0.8 ? "#141414" : CREMA} strokeWidth={lerp(3, 1)} style={{ filter: `drop-shadow(0 0 ${12 * (1 - vuela)}px ${ORO})` }} />
          </svg>
        )}
        {tendencia && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {pts.length > 1 && <Trazo d={pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ")} p={linea} grosor={6} color={ORO} />}
            {pts.map(([x, y], i) => {
              const s = sp(f, b0 + i * 5, REBOTE);
              if (s <= 0) return null;
              return (
                <g key={i}>
                  <line x1={x} x2={x + 70} y1={y} y2={y} stroke="#2E8B57" strokeWidth={2.5} strokeDasharray="7 6" opacity={Math.min(1, s)} />
                  <text x={x + 35} y={y + 22} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={15} fill="#2E8B57" opacity={Math.min(1, s)}>mín ↑</text>
                  <circle cx={x} cy={y} r={7 * s} fill={ORO} stroke={TINTA} strokeWidth={2} />
                </g>
              );
            })}
          </svg>
        )}
      </AbsoluteFill>
      {tendencia && f >= b2 - 2 && (
        <div style={{ position: "absolute", left: 140, top: 340, fontFamily: principalPara("MÍNIMOS MÁS ALTOS"), fontSize: 46, color: TINTA, transform: `scale(${sp(f, b2 - 2, REBOTE)})`, transformOrigin: "0 50%" }}>MÍNIMOS MÁS ALTOS ↗</div>
      )}
    </Escritorio>
    </>
  );
};
export const grafica: DefEscena = { C: Grafica, momentos: 3, alInicio: () => true, sonidos: (p) => (txt(p, "modo") === "tendencia" ? [[2, "ding", 0.25]] : []) };

// ---------------------------------------------------------------- adelanto en papel sepia

const Adelanto: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20] = b;
  const papel = pr(f, 0, 14, Easing.out(Easing.cubic));
  const tinta = pr(f, b0, 22, Easing.inOut(Easing.cubic));
  const SEPIA = "#E9D8B4",
    MARRON = "#4A3422";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 330, width: 860, height: 820, transform: `translateY(${(1 - papel) * 700}px) rotate(${(1 - papel) * 8 - 2}deg)`, background: `radial-gradient(ellipse at 40% 30%, ${SEPIA} 0%, #D7C098 70%, #BFA478 100%)`, borderRadius: 6, boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }}>
        {Array.from({ length: 14 }).map((_, k) => (
          <div key={k} style={{ position: "absolute", left: 0, right: 0, top: 40 + k * 56, height: 1, background: alfa(MARRON, 0.08 + 0.05 * rnd(k)) }} />
        ))}
        <svg width={860} height={820} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={650} cy={170} r={70} fill="#B5462F" opacity={0.85 * pr(f, b0 + 8, 14)} />
          <Trazo d="M330 150 L330 700" p={tinta} grosor={9} color={MARRON} />
          <Trazo d="M270 270 L390 270 L390 560 L270 560 Z" p={tinta} grosor={11} color={MARRON} />
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M${520 + k * 60} 640 q20 -40 40 0`} fill="none" stroke={MARRON} strokeWidth={5} opacity={pr(f, b0 + 14 + k * 4, 8)} />
          ))}
        </svg>
        <div style={{ position: "absolute", left: 470, top: 360, fontFamily: SECUND, fontSize: 48, color: MARRON, opacity: pr(f, b0 + 10, 10), transform: "rotate(-4deg)" }}>¿de dónde</div>
        <div style={{ position: "absolute", left: 470, top: 420, fontFamily: SECUND, fontSize: 48, color: MARRON, opacity: pr(f, b0 + 14, 10), transform: "rotate(-4deg)" }}>salió?</div>
      </div>
      {f >= b1 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1190, display: "flex", justifyContent: "center", transform: `scale(${sp(f, b1 - 2, REBOTE)})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: ORO, color: TINTA, fontFamily: F.texto, fontWeight: 800, fontSize: 34, letterSpacing: 5, padding: "14px 30px", borderRadius: 40 }}>
            <Icono nombre="play" tam={34} color={TINTA} /> PRÓXIMO VÍDEO
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
export const adelanto: DefEscena = { C: Adelanto, momentos: 2, sonidos: () => [[0, "papel", 0.35], [1, "pop", 0.3]] };

// ---------------------------------------------------------------- CTA: Comenta VELA (con el monitor que se apaga al final)

const Comenta: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 1e9] = b;
  const guia = sp(f, b1 - 2, REBOTE);
  return (
    <AbsoluteFill>
      <Escritorio dur={dur} apagaEn={dur - TRANSICION} cabecera="GUÍA · VELAS" foco={[[0, 540]]} asiente={[b0, b1]}>
        <Halo x={540} y={560} r={400} op={0.2} />
        {guia > 0 && (
          <div style={{ position: "absolute", left: 330, top: 330, width: 420, height: 500, transform: `scale(${guia}) rotate(${-4 + Math.sin(f / 12) * 2}deg)`, background: CREMA, borderRadius: 18, boxShadow: `0 30px 60px rgba(0,0,0,0.5)`, padding: 30 }}>
            <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: ORO }}>GUÍA GRATIS</div>
            <div style={{ fontFamily: principalPara("VELAS"), fontSize: 64, color: TINTA, marginTop: 8 }}>VELAS</div>
            <div style={{ fontFamily: SECUND, fontSize: 30, color: TINTA }}>para practicar</div>
            <svg width={360} height={240} style={{ marginTop: 20 }}>
              {[0, 1, 2, 3, 4, 5].map((k) => {
                const alza = k % 3 !== 1;
                const y = 150 - k * 18;
                return (
                  <g key={k}>
                    <line x1={30 + k * 56} x2={30 + k * 56} y1={y - 50} y2={y + 60} stroke={TINTA} strokeWidth={4} />
                    <rect x={14 + k * 56} y={y - 30} width={32} height={70} fill={alza ? CREMA : TINTA} stroke={TINTA} strokeWidth={4} />
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </Escritorio>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26, transform: `scale(${sp(f, b0 - 4, REBOTE)})` }}>
        <span style={{ fontFamily: SECUND, fontSize: 80, color: C.texto }}>Comenta</span>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 130, color: ORO, background: alfa(ORO, 0.12), border: `4px solid ${ORO}`, borderRadius: 24, padding: "0 26px", transform: `rotate(${Math.sin(f / 8) * 3}deg)`, display: "inline-block" }}>VELA</span>
      </div>
      {f >= b2 - 2 && f < dur - TRANSICION && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 850, display: "flex", justifyContent: "center", transform: `scale(${sp(f, b2 - 2, REBOTE)}) rotate(-2deg)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#E9D8B4", color: "#4A3422", border: `4px solid ${ORO}`, padding: "14px 30px", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
            <Icono nombre="play" tam={34} color="#4A3422" />
            <span style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 28, letterSpacing: 4 }}>PRÓXIMO:</span>
            <span style={{ fontFamily: SECUND, fontSize: 44 }}>¿de dónde salió?</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
export const comenta: DefEscena = { C: Comenta, momentos: 3, alInicio: () => true, sonidos: () => [[1, "campana", 0.25], [2, "papel", 0.25]] };

export { Personaje };
