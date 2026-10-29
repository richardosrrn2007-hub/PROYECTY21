// Vídeo 4 · El doji (parte 1 de «Las 3 velas que más vas a ver»). Mismo mundo de la serie: planeta de noche,
// dorado y crema. Las tres velas entran borrosas y salta el doji; luego el oro real (OANDA:XAUUSD diario,
// mayo-junio 2026) en el monitor con estilo papel, un contraejemplo y los porcentajes de Bulkowski.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { F, alfa } from "../motor/estilos";
import { numeroES, rnd } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { txt } from "../escenas/util";
import { Escritorio } from "./Escritorio";
import { GraficoVelas, PAPEL, continua, geometria, type Marco } from "./Velas";
import { TRANSICION } from "./Cierre";
import { XAU, idx, type VelaFecha } from "./xau";
import { Oso, Toro } from "./Batalla";
import { BancoCapa } from "./Banco";
import { Chispas, Cuenta, Halo, ORO, PRINCIPAL, PRO, REBOTE, ROJO, SECUND, VERDE, Trazo, pr, principalPara, sp, temblor } from "./mg";

export const CREMA = "#F2E8D5";
export const TINTA = "#141414";
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Fotograma (relativo a la escena) en que se oye la palabra que empieza por `w`; si no está, `def`. */
export const enPalabra = (palabras: PropsEscena["palabras"], w: string, def: number) =>
  palabras.find((x) => x.w.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "").startsWith(w))?.f ?? def;
/** Latido 1 → 1+k → 1 que dura `d` fotogramas desde `a` (para que algo "respire" en un tramo sin cambios). */
export const latido = (f: number, a: number, k = 0.08, d = 12) => (f < a || f > a + d ? 1 : 1 + k * Math.sin(((f - a) / d) * Math.PI));

// ---------------------------------------------------------------- vela suelta (dibujo grande)

type Forma = { o: number; c: number; h: number; l: number };
/** Vela grande de la marca: alcista crema rellena, bajista negra con borde crema. y = 0 arriba, 1 abajo. */
export const VelaG: React.FC<{ x: number; y: number; alto: number; ancho?: number; v: Forma; color?: string }> = ({ x, y, alto, ancho = 90, v, color = CREMA }) => {
  const Y = (p: number) => y + p * alto;
  const top = Y(Math.min(v.o, v.c)),
    bot = Y(Math.max(v.o, v.c));
  const alza = v.c < v.o; // en coordenadas de pantalla: cierre más arriba que la apertura
  return (
    <g>
      <line x1={x} x2={x} y1={Y(v.h)} y2={Y(v.l)} stroke={color} strokeWidth={7} strokeLinecap="round" />
      <rect x={x - ancho / 2} y={top} width={ancho} height={Math.max(8, bot - top)} rx={4} fill={alza ? color : "#000"} stroke={color} strokeWidth={6} />
    </g>
  );
};
export const MARTILLO: Forma = { o: 0.3, c: 0.18, h: 0.12, l: 1 };
export const DOJI: Forma = { o: 0.5, c: 0.505, h: 0, l: 1 };
export const PREVIA: Forma = { o: 0.42, c: 0.62, h: 0.36, l: 0.7 };
export const ENVUELVE: Forma = { o: 0.72, c: 0.18, h: 0.1, l: 0.8 };

// ---------------------------------------------------------------- Bulkowski (personaje)

/**
 * Thomas Bulkowski como personaje de la serie (ilustración, no retrato): ingeniero que pasó a trader y probó
 * 103 patrones de velas. Gafas, pelo canoso, camisa y corbata, el libro «103 VELAS» y un bolígrafo para señalar.
 * Entra con rebote en `desde`; en `senala` levanta el bolígrafo hacia el dato; se ajusta las gafas y hojea el libro.
 */
const Bulkowski: React.FC<{ x: number; y: number; esc?: number; desde: number; senala?: number; gafas?: number; mira?: number }> = ({ x, y, esc = 1, desde, senala = 1e9, gafas = 1e9, mira = 1 }) => {
  const f = useCurrentFrame();
  const e = sp(f, desde, REBOTE);
  if (e <= 0) return null;
  const T = TINTA,
    PIEL = "#D9A77C",
    CANA = "#C9C3B8";
  const parpadea = (f - desde) % 70 < 4 && f - desde > 10;
  const resp = Math.sin(f / 9) * 3; // respira
  const brazo = pr(f, senala, 10, Easing.out(Easing.back(2)));
  const ajusta = Math.max(0, Math.sin(Math.min(1, Math.max(0, (f - gafas) / 16)) * Math.PI));
  const hoja = Math.sin(f / 5) > 0.7 ? 1 : 0; // hojea el libro de vez en cuando
  const cabeza = Math.sin(f / 13) * 3 + (brazo > 0 ? -4 * mira : 0);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <g transform={`translate(${x} ${y + (1 - e) * 260}) scale(${esc * Math.min(1, 0.6 + 0.4 * e)})`} opacity={Math.min(1, e * 1.5)}>
        {/* cuerpo: camisa, chaleco y corbata dorada */}
        <g transform={`translate(0 ${resp})`}>
          <path d="M-125 330 L-105 120 Q0 80 105 120 L125 330 Z" fill="#2B3446" stroke={T} strokeWidth={5} />
          <path d="M-42 104 L0 175 L42 104 Z" fill={CREMA} stroke={T} strokeWidth={4} />
          <path d="M-10 118 L10 118 L16 200 L0 222 L-16 200 Z" fill={ORO} stroke={T} strokeWidth={3} />
          {/* libro «103 VELAS» en el brazo izquierdo */}
          <g transform={`translate(-70 190) rotate(${-8 + hoja * 3})`}>
            <rect x={-70} y={-55} width={130} height={150} rx={8} fill="#7A1F1A" stroke={T} strokeWidth={5} />
            <rect x={48} y={-50} width={14} height={140} fill={CREMA} stroke={T} strokeWidth={2} />
            <text x={-5} y={0} textAnchor="middle" fontFamily={PRO} fontSize={34} fill={ORO}>103</text>
            <text x={-5} y={36} textAnchor="middle" fontFamily={PRO} fontSize={22} fill={CREMA}>VELAS</text>
            {hoja > 0 && <path d="M60 -48 Q30 10 58 88" fill="none" stroke={CREMA} strokeWidth={4} />}
          </g>
          {/* brazo derecho con bolígrafo: baja → señala */}
          <g transform={`translate(85 140) rotate(${20 - 110 * brazo - 70 * ajusta * (1 - brazo)})`}>
            <rect x={-18} y={0} width={36} height={120} rx={18} fill="#2B3446" stroke={T} strokeWidth={4} />
            <circle cx={0} cy={128} r={20} fill={PIEL} stroke={T} strokeWidth={4} />
            <rect x={-4} y={140} width={8} height={60} rx={3} fill={ORO} stroke={T} strokeWidth={2} />
          </g>
        </g>
        {/* cabeza */}
        <g transform={`rotate(${cabeza} 0 60)`}>
          <rect x={-22} y={50} width={44} height={40} rx={12} fill={PIEL} />
          <ellipse cx={0} cy={0} rx={62} ry={72} fill={PIEL} stroke={T} strokeWidth={4} />
          {/* pelo canoso a los lados, entradas arriba */}
          <path d="M-62 -6 Q-66 -60 -30 -70 Q-46 -40 -48 -4 Z" fill={CANA} stroke={T} strokeWidth={3} />
          <path d="M62 -6 Q66 -60 30 -70 Q46 -40 48 -4 Z" fill={CANA} stroke={T} strokeWidth={3} />
          <path d="M-30 -70 Q0 -82 30 -70" fill="none" stroke={CANA} strokeWidth={6} strokeLinecap="round" />
          {/* gafas (suben un poco al ajustarlas) */}
          <g transform={`translate(0 ${-6 * ajusta})`}>
            {[-24, 24].map((dx) => (
              <circle key={dx} cx={dx} cy={-2} r={20} fill={alfa(CREMA, 0.25)} stroke={T} strokeWidth={5} />
            ))}
            <line x1={-4} x2={4} y1={-4} y2={-4} stroke={T} strokeWidth={5} />
            {[-24, 24].map((dx) => (parpadea ? <line key={`o${dx}`} x1={dx - 8} x2={dx + 8} y1={-2} y2={-2} stroke={T} strokeWidth={4} /> : <circle key={`o${dx}`} cx={dx + 3 * mira} cy={-2} r={5} fill={T} />))}
          </g>
          {/* bigote y boca */}
          <path d="M-22 30 Q0 20 22 30 Q0 40 -22 30 Z" fill={CANA} stroke={T} strokeWidth={3} />
          <path d={brazo > 0.5 ? "M-12 46 Q0 56 12 46" : "M-10 48 L10 48"} fill="none" stroke={T} strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- 1 · tres velas borrosas, salta el doji

// ---------------------------------------------------------------- 0 · «Esta vela engaña a casi todos»

/** Líneas de velocidad de anime desde un punto (cambian cada 2 fotogramas). */
export const Velocidad: React.FC<{ x: number; y: number; n?: number; r0?: number; op?: number }> = ({ x, y, n = 46, r0 = 480, op = 1 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      {Array.from({ length: n }).map((_, i) => {
        const sem = Math.floor(f / 2) * 97 + i * 13;
        const a = (i / n) * Math.PI * 2 + rnd(sem) * 0.08;
        const ra = r0 + rnd(sem + 1) * 260;
        return <line key={i} x1={x + Math.cos(a) * ra} y1={y + Math.sin(a) * ra} x2={x + Math.cos(a) * 1500} y2={y + Math.sin(a) * 1500} stroke={i % 3 ? CREMA : ORO} strokeWidth={2 + rnd(sem + 2) * 5} opacity={0.18 + 0.22 * rnd(sem + 3)} />;
      })}
    </svg>
  );
};

const Engana: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 15, b2 = 30] = b;
  const e = sp(f, -2, REBOTE);
  // al decir «engaña»: glitch (copias desplazadas en rojo y crema) y temblor
  const g = f >= b1 - 2 && f < b1 + 12 ? 1 - (f - (b1 - 2)) / 14 : 0;
  const dx = g * (rnd(Math.floor(f / 1.5)) - 0.5) * 60;
  const t = temblor(f, b1 - 2, 18, 12);
  const empuje = 1 + 0.12 * pr(f, 0, dur, Easing.inOut(Easing.cubic));
  const doji = (color: string, ox: number, op: number) => (
    <svg width={1080} height={1920} style={{ position: "absolute", left: ox, top: 0, opacity: op }}>
      <VelaG x={540} y={420} alto={1080} ancho={230} v={DOJI} color={color} />
    </svg>
  );
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${empuje})`, transformOrigin: "540px 960px" }}>
      <Halo x={540} y={960} r={560} op={0.35} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(540 960) rotate(${f * 0.6})`}>
          {Array.from({ length: 14 }).map((_, i) => (
            <path key={i} d="M0 0 L-40 -1200 L40 -1200 Z" transform={`rotate(${(i * 360) / 14})`} fill={alfa(ORO, i % 2 ? 0.07 : 0.14)} />
          ))}
        </g>
      </svg>
      <Velocidad x={540} y={960} op={0.7} />
      <AbsoluteFill style={{ transform: `scale(${0.6 + 0.4 * e})`, transformOrigin: "540px 960px", opacity: Math.min(1, e * 2) }}>
        {g > 0 && doji(ROJO, dx - 14, 0.7 * g)}
        {g > 0 && doji("#7FD8E8", -dx + 14, 0.5 * g)}
        {doji(CREMA, dx * 0.3, 1)}
      </AbsoluteFill>
      {f >= b1 - 2 && <div style={{ position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center", transform: `scale(${sp(f, b1 - 2, REBOTE)}) rotate(-4deg)` }}><span style={{ fontFamily: PRINCIPAL, fontSize: 120, color: ROJO, textShadow: "0 0 30px rgba(217,115,94,0.6)" }}>ENGAÑA</span></div>}
      <Chispas desde={b2 - 2} x={540} y={960} n={18} r={420} color={ORO} />
    </AbsoluteFill>
  );
};

/** Velas del oro que son doji, martillo o envolvente (para marcarlas en el gancho). */
const PATRONES = (() => {
  const v = continua(XAU);
  return v
    .map((c, k) => {
      const r = c.h - c.l,
        cu = Math.abs(c.c - c.o);
      const doji = cu <= 0.12 * r;
      const martillo = Math.min(c.o, c.c) - c.l >= 2 * cu && c.h - Math.max(c.o, c.c) <= cu;
      const p = v[k - 1];
      const envuelve = !!p && (c.c - c.o) * (p.c - p.o) < 0 && Math.max(c.o, c.c) >= Math.max(p.o, p.c) && Math.min(c.o, c.c) <= Math.min(p.o, p.c);
      return doji || martillo || envuelve ? k : -1;
    })
    .filter((k) => k >= 0);
})();
const MARCO_GANCHO: Marco = { x0: -40, x1: 1280, y0: 560, y1: 1500 };

const Tres: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  // «Elige tu vela», como la selección de personaje de un juego de lucha:
  // 1) fondo vivo (líneas de velocidad, el oro real pasando, el planeta) y tres cartas con siluetas borrosas «???»
  // 2) un selector dorado salta de carta en carta y se para en el doji
  // 3) destello: el doji se revela con sus «estadísticas»; las otras quedan para los próximos vídeos
  // 4) la cámara entra en la carta del doji (enlaza con la escena siguiente, que es el doji enorme)
  const revela = b2 - 4;
  const sel: [number, number][] = [
    [b0 + 6, 0],
    [b0 + 18, 1],
    [b0 + 30, 2],
    [b1 - 4, 0],
    [b1 + 10, 2],
    [b1 + 22, 1],
  ];
  let actual = -1;
  sel.forEach(([a, k]) => (f >= a ? (actual = k) : null));
  const ultimoSalto = sel.filter(([a]) => f >= a).pop()?.[0] ?? 0;
  const flash = interpolate(f, [revela, revela + 1, revela + 7], [0, 0.7, 0], cl);
  const t = temblor(f, revela, 20, 10);
  const r = sp(f, revela, REBOTE);
  const entra = pr(f, dur - 12, 12, Easing.in(Easing.cubic)); // la cámara entra en la carta del doji
  const velasXau = continua(XAU);
  const cartas = [
    { x: 215, nombre: "MARTILLO", v: [MARTILLO] },
    { x: 540, nombre: "DOJI", v: [DOJI] },
    { x: 865, nombre: "ENVOLVENTE", v: [PREVIA, ENVUELVE] },
  ];
  const W = 290,
    H = 520,
    Y = 980;
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${1 + 2.6 * entra})`, transformOrigin: `540px ${Y}px` }}>
      {/* el oro real pasando rápido detrás */}
      <AbsoluteFill style={{ opacity: 0.28, transform: `translateX(${-500 * pr(f, 0, dur, Easing.linear)}px)` }}>
        <GraficoVelas velas={velasXau} marco={{ x0: -60, x1: 1700, y0: 620, y1: 1360 }} entra={() => -60} forma={1} letra={20} vivo={false} volumen={false} ejes={0} />
      </AbsoluteFill>
      {/* líneas de velocidad de anime: cambian cada 2 fotogramas */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: 46 }).map((_, i) => {
          const sem = Math.floor(f / 2) * 97 + i * 13;
          const a = (i / 46) * Math.PI * 2 + rnd(sem) * 0.08;
          const r0 = 520 + rnd(sem + 1) * 260,
            r1 = 1300;
          return <line key={i} x1={540 + Math.cos(a) * r0} y1={Y + Math.sin(a) * r0} x2={540 + Math.cos(a) * r1} y2={Y + Math.sin(a) * r1} stroke={i % 3 ? CREMA : ORO} strokeWidth={2 + rnd(sem + 2) * 5} opacity={0.18 + 0.2 * rnd(sem + 3)} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: PRINCIPAL, fontSize: 70, color: CREMA, opacity: pr(f, 2, 8) * (1 - pr(f, revela, 6)), transform: `scale(${latido(f, b0 + 6, 0.08, 10)})` }}>ELIGE TU VELA</div>
      {cartas.map((c, i) => {
        const e = sp(f, i * 3, REBOTE);
        if (e <= 0) return null;
        const doji = i === 1;
        const revelada = doji && f >= revela;
        const lado = !doji && f >= revela;
        const enfocada = actual === i && f < revela;
        const salto = enfocada ? latido(f, ultimoSalto, 0.1, 8) : 1;
        const esc = (doji ? 1 + 0.18 * r : lado ? 0.88 : 1) * salto;
        const blur = revelada ? 0 : lado ? 10 : 7;
        return (
          <div key={c.nombre} style={{ position: "absolute", left: c.x - W / 2, top: Y - H / 2 + (1 - e) * 600, width: W, height: H, transform: `scale(${esc})`, opacity: lado ? 0.55 : 1, zIndex: doji ? 2 : 1 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: `linear-gradient(180deg, ${alfa(ORO, revelada ? 0.35 : 0.12)}, rgba(0,0,0,0.85))`, border: `4px solid ${enfocada || revelada ? ORO : alfa(CREMA, 0.35)}`, boxShadow: enfocada || revelada ? `0 0 50px ${alfa(ORO, 0.6)}` : "none" }} />
            <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, filter: `blur(${blur}px)`, opacity: revelada ? 1 : 0.6 }}>
              {c.v.length === 1 ? <VelaG x={W / 2} y={70} alto={300} ancho={70} v={c.v[0]} /> : <><VelaG x={W / 2 - 34} y={70} alto={300} ancho={50} v={c.v[0]} /><VelaG x={W / 2 + 34} y={70} alto={300} ancho={60} v={c.v[1]} /></>}
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: 395, textAlign: "center", fontFamily: revelada ? PRINCIPAL : PRO, fontSize: revelada ? 58 : 44, color: revelada ? ORO : CREMA, letterSpacing: revelada ? 0 : 6 }}>{revelada ? c.nombre : lado ? "PRÓXIMO" : "???"}</div>
          </div>
        );
      })}
      {f >= revela && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", transform: `scale(${r}) rotate(-3deg)` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 96, color: ORO, textShadow: `0 0 40px ${alfa(ORO, 0.6)}` }}>1 / 3</span>
        </div>
      )}
      <AbsoluteFill style={{ background: "#FFF3DC", opacity: flash, pointerEvents: "none" }} />
      <Chispas desde={revela} x={540} y={Y} n={20} r={380} color={ORO} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2-3 · el doji de cerca

const DojiZoom: React.FC<PropsEscena> = ({ p, b }) => {
  const f = useCurrentFrame();
  const duda = txt(p, "modo") === "duda";
  const [b0 = 0, b1 = 15, b2 = 30, b3 = 45] = b;
  const X = 540,
    Y0 = 560,
    ALTO = 900;
  const yA = Y0 + DOJI.o * ALTO,
    yC = Y0 + DOJI.c * ALTO;
  const t = duda ? temblor(f, b2, 12, 12) : { x: 0, y: 0 };
  const tambalea = duda ? Math.sin(Math.max(0, f - b3) / 3) * 4 * pr(f, b3, 6) : 0;
  const entra = duda ? 1 : sp(f, b0 - 6, REBOTE);
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
      <Halo x={X} y={yA} r={360} op={0.22} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`translate(0 ${(1 - entra) * 300}) rotate(${tambalea} ${X} ${yA})`} opacity={Math.min(1, entra)}>
          <VelaG x={X} y={Y0} alto={ALTO} ancho={150} v={DOJI} />
        </g>
        {!duda && (
          <>
            <Trazo d={`M${X - 380} ${yA} L${X - 90} ${yA}`} p={pr(f, b1 - 2, 12)} color={ORO} grosor={5} />
            <Trazo d={`M${X + 90} ${yC} L${X + 380} ${yC}`} p={pr(f, b2 - 2, 12)} color={ORO} grosor={5} />
          </>
        )}
        {duda && (
          <>
            {/* compradores empujan desde abajo, vendedores desde arriba: chocan en el cuerpo */}
            {(() => {
              const k1 = pr(f, b0 - 4, 14, Easing.in(Easing.cubic)),
                k2 = pr(f, b1 - 4, 14, Easing.in(Easing.cubic));
              const choca = Math.min(k1, k2);
              const yS = 1700 - (1700 - (yA + 70)) * k1,
                yB = 380 + (yA - 70 - 380) * k2;
              return (
                <>
                  {k1 > 0 && <path d={`M${X - 220} ${yS + 70} L${X - 220} ${yS} L${X - 255} ${yS + 40} M${X - 220} ${yS} L${X - 185} ${yS + 40}`} stroke={VERDE} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                  {k2 > 0 && <path d={`M${X + 220} ${yB - 70} L${X + 220} ${yB} L${X + 185} ${yB - 40} M${X + 220} ${yB} L${X + 255} ${yB - 40}`} stroke={ROJO} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                  {choca >= 1 && <circle cx={X} cy={yA} r={40 + 160 * pr(f, b2, 14)} fill="none" stroke={ORO} strokeWidth={6} opacity={1 - pr(f, b2, 14)} />}
                  {/* toro (compradores) y oso (vendedores), pequeños y de fondo: empujan cada uno desde su lado */}
                  <g opacity={0.75 * k1}>
                    <Toro x={X - 300 + 40 * k1} y={yA + 330 - 60 * k1} esc={0.42} animo={f >= b2 ? "tira" : "tira"} />
                  </g>
                  <g opacity={0.85 * k2} style={{ filter: `drop-shadow(0 0 3px ${CREMA}) drop-shadow(0 0 2px ${CREMA})` }}>
                    <Oso x={X + 300 - 40 * k2} y={yA - 330 + 60 * k2} esc={0.42} animo="tira" />
                  </g>
                </>
              );
            })()}
          </>
        )}
      </svg>
      {!duda && (
        <>
          <div style={{ position: "absolute", left: X - 400, top: yA - 70, fontFamily: PRO, fontSize: 40, color: ORO, opacity: pr(f, b1, 8) }}>APERTURA</div>
          <div style={{ position: "absolute", left: X + 160, top: yC + 20, fontFamily: PRO, fontSize: 40, color: ORO, opacity: pr(f, b2, 8) }}>CIERRE</div>
          {f >= b3 - 3 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b3 - 3, REBOTE)})` }}>
              <span style={{ fontFamily: SECUND, fontSize: 64, color: CREMA }}>apertura </span>
              <span style={{ fontFamily: PRINCIPAL, fontSize: 110, color: ORO }}>≈</span>
              <span style={{ fontFamily: SECUND, fontSize: 64, color: CREMA }}> cierre</span>
            </div>
          )}
        </>
      )}
      {duda && (
        <>
          <div style={{ position: "absolute", left: X - 330, top: 1560, fontFamily: PRO, fontSize: 36, color: VERDE, opacity: pr(f, b0, 8) }}>COMPRADORES</div>
          <div style={{ position: "absolute", left: X + 60, top: 330, fontFamily: PRO, fontSize: 36, color: ROJO, opacity: pr(f, b1, 8) }}>VENDEDORES</div>
          {f >= b2 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 1460, textAlign: "center", transform: `scale(${sp(f, b2, REBOTE)})` }}>
              <span style={{ fontFamily: PRINCIPAL, fontSize: 96, color: ORO }}>EMPATE</span>
            </div>
          )}
          {f >= b3 - 2 && <div style={{ position: "absolute", left: X + 120, top: yA - 260, fontFamily: PRINCIPAL, fontSize: 170, color: CREMA, transform: `scale(${sp(f, b3 - 2, REBOTE)}) rotate(12deg)` }}>?</div>}
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4 · el dato de Bulkowski (doji estrella alcista)

const Dato: React.FC<PropsEscena> = ({ b, palabras }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const fuente = enPalabra(palabras, "bulkowski", b1 - 4);
  // patrón: vela negra alta y doji debajo. Lo que "se espera" (sube) frente a lo que pasó (siguió cayendo)
  const espera = pr(f, b0, 16, Easing.inOut(Easing.cubic));
  const real = pr(f, b2 - 6, 18, Easing.inOut(Easing.cubic));
  const tacha = pr(f, b2 - 8, 8);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g opacity={sp(f, b0 - 8)}>
          <VelaG x={300} y={520} alto={600} ancho={86} v={{ o: 0.05, c: 0.62, h: 0, l: 0.68 }} />
          <VelaG x={420} y={520} alto={600} ancho={86} v={{ o: 0.8, c: 0.805, h: 0.74, l: 0.88 }} />
        </g>
        {f >= b1 - 2 && <circle cx={420} cy={1003} r={50 * latido(f, b1 - 2, 0.3, 14)} fill="none" stroke={ORO} strokeWidth={5} opacity={pr(f, b1 - 2, 6)} />}
        {/* lo que se espera: giro al alza */}
        <Trazo d="M470 990 C 560 990, 640 820, 760 640" p={espera} color={ORO} grosor={8} guion op={1 - 0.6 * tacha} />
        {espera > 0.95 && <path d="M760 640 l-46 6 M760 640 l-4 46" stroke={ORO} strokeWidth={8} strokeLinecap="round" opacity={1 - 0.6 * tacha} />}
        {tacha > 0 && <path d={`M640 700 L${640 + 140 * tacha} ${700 + 140 * tacha} M780 700 L${780 - 140 * tacha} ${700 + 140 * tacha}`} stroke={ROJO} strokeWidth={14} strokeLinecap="round" />}
        {/* lo que pasó: siguió cayendo */}
        <Trazo d="M470 1000 C 560 1040, 650 1160, 780 1290" p={real} color={CREMA} grosor={9} />
        {real > 0.95 && <path d="M780 1290 l-8 -46 M780 1290 l-46 -4" stroke={CREMA} strokeWidth={9} strokeLinecap="round" />}
      </svg>
      <div style={{ position: "absolute", left: 600, top: 520, fontFamily: PRO, fontSize: 38, color: ORO, opacity: pr(f, b0 + 6, 8) * (1 - 0.6 * tacha) }}>¿GIRO?</div>
      <Bulkowski x={250} y={1100} esc={0.95} desde={fuente - 4} gafas={fuente + 14} senala={b2 - 2} />
      {f >= fuente - 2 && (
        <div style={{ position: "absolute", left: 90, top: 1640, transform: `scale(${sp(f, fuente - 2)})`, transformOrigin: "0 50%", fontFamily: PRO, fontSize: 32, color: CREMA, opacity: 0.85 }}>
          <div style={{ fontSize: 24, opacity: 0.7 }}>Fuente: Bulkowski</div>
        </div>
      )}
      {f >= b2 - 4 && (
        <div style={{ position: "absolute", left: 600, top: 1210, transform: `scale(${sp(f, b2 - 4, REBOTE)})`, transformOrigin: "0 50%" }}>
          <div style={{ display: "inline-block", transform: `scale(${latido(f, b2 + 30, 0.1, 12)})`, transformOrigin: "0 50%" }}><Cuenta desde={b2 - 4} de={0} a={64} sufijo=" %" tam={150} color={ORO} /></div>
          <div style={{ fontFamily: SECUND, fontSize: 44, color: CREMA, marginTop: -10 }}>siguió cayendo</div>
          {f >= b2 + 18 && <div style={{ fontFamily: PRO, fontSize: 34, color: ORO, marginTop: 14, opacity: pr(f, b2 + 18, 8), transform: `translateX(${(1 - pr(f, b2 + 18, 10)) * 40}px)` }}>solo el 36 % giró</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5-11 · el oro real en el monitor

export const MARCO: Marco = { x0: 110, x1: 975, y0: 360, y1: 830 };

/**
 * Gráfico de papel del oro con una ventana de fechas. Con zoom > 1 la cámara se acerca a las velas `foco`:
 * el marco crece alrededor de ellas (las velas se ensanchan y los textos siguen nítidos y del mismo tamaño).
 */
export const usaVentana = (desde: string, hasta: string, zoom = 1, foco: string[] = []) => {
  const a = idx(desde),
    z = idx(hasta);
  const velas = continua(XAU).slice(a, z + 1) as VelaFecha[];
  const k = (fecha: string) => idx(fecha) - a;
  const g0 = geometria(velas, MARCO, 20);
  const fs = foco.map(k);
  const ox = fs.length ? fs.reduce((m, j) => m + g0.xVela(j), 0) / fs.length : 540;
  const oy = fs.length ? (g0.yPrecio(Math.max(...fs.map((j) => velas[j].h))) + g0.yPrecio(Math.min(...fs.map((j) => velas[j].l)))) / 2 : 600;
  // mientras se acerca, el foco viaja al centro del panel (si no, el setup se sale por el borde)
  const t = Math.min(1, Math.max(0, (zoom - 1) / 0.7));
  const cx = ox + ((MARCO.x0 + MARCO.x1 - g0.anchoEje) / 2 - ox) * t,
    cy = oy + ((MARCO.y0 + MARCO.y1) / 2 - 10 - oy) * t;
  const marco: Marco = { x0: cx + (MARCO.x0 - ox) * zoom, x1: cx + (MARCO.x1 - ox) * zoom, y0: cy + (MARCO.y0 - oy) * zoom, y1: cy + (MARCO.y1 - oy) * zoom };
  const g = geometria(velas, marco, 20);
  return { velas, g, k, marco };
};

export const Cabecera: React.FC<{ v: VelaFecha }> = ({ v }) => (
  <div style={{ position: "absolute", left: MARCO.x0, top: MARCO.y0 - 52, fontFamily: F.texto, fontSize: 19, color: "#8A8A8A", whiteSpace: "nowrap" }}>
    Oro / Dólar · 1D · OANDA <span style={{ color: TINTA, fontWeight: 700 }}>&nbsp;O {numeroES(v.o, 1)} &nbsp;H {numeroES(v.h, 1)} &nbsp;L {numeroES(v.l, 1)} &nbsp;C {numeroES(v.c, 1)}</span>
  </div>
);

export const Fondo: React.FC = () => <div style={{ position: "absolute", left: MARCO.x0 - 20, top: MARCO.y0 - 70, width: MARCO.x1 - MARCO.x0 + 40, height: MARCO.y1 - MARCO.y0 + 120, background: "#DBDBDB", borderRadius: 6 }} />;

/** Línea horizontal de nivel con etiqueta de precio a la derecha. */
export const Nivel: React.FC<{ y: number; x0: number; p: number; color: string; texto: string; guion?: boolean }> = ({ y, x0, p, color, texto, guion = true }) => (
  <>
    <line x1={x0} x2={x0 + (MARCO.x1 - 100 - x0) * p} y1={y} y2={y} stroke={color} strokeWidth={3} strokeDasharray={guion ? "10 7" : undefined} />
    {p > 0.9 && (
      <g>
        <rect x={MARCO.x1 - 112} y={y - 15} width={104} height={30} rx={5} fill={color} />
        <text x={MARCO.x1 - 60} y={y + 7} textAnchor="middle" fontFamily={F.texto} fontWeight={800} fontSize={18} fill="#fff">
          {texto}
        </text>
      </g>
    )}
  </>
);

export const Rotulo: React.FC<{ x: number; y: number; desde: number; children: React.ReactNode; color?: string; tam?: number }> = ({ x, y, desde, children, color = TINTA, tam = 30 }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${sp(f, desde, REBOTE)})`, fontFamily: principalPara(String(children)), fontSize: tam, color, whiteSpace: "nowrap", textShadow: "0 0 12px rgba(219,219,219,0.9)" }}>
      {children}
    </div>
  );
};

const Oro: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const modo = txt(p, "modo", "entra");
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  // cámara: primero el gráfico real completo; luego se acerca al setup frase a frase (sin saltos entre escenas)
  const CAM: Record<string, [number, number]> = { entra: [1, 1], rango: [1, 1.8], barre: [1.8, 2.1], cierre: [2.1, 2.2], sube: [2.2, 2.2] };
  const [z0, z1] = CAM[modo] ?? [1, 1];
  const zoom = z0 + (z1 - z0) * pr(f, 0, Math.max(20, dur - 4), Easing.inOut(Easing.cubic));
  const { velas, g, k, marco } = usaVentana("13 may", "15 jun", zoom, ["10 jun", "11 jun", "12 jun", "15 jun"]);
  const n = velas.length;
  const c1 = k("10 jun"),
    c2 = k("11 jun"),
    ind = k("12 jun"),
    c3 = k("15 jun");
  // los niveles se marcan con los precios reales de TradingView (continua() solo ajusta el dibujo)
  const V1 = XAU[idx("10 jun")],
    V2 = XAU[idx("11 jun")];
  const orden = ["entra", "rango", "barre", "cierre", "sube"].indexOf(modo);
  const ya = (m: number) => orden > m; // la marca de un paso anterior ya está puesta
  // qué velas se ven: hasta C1 al principio, C2 desde "barre", el resto en "sube"
  const ultima = orden < 2 ? c1 : orden < 4 ? c2 : n - 1;
  const entra = (j: number) => {
    if (j > ultima) return 1e9;
    if (modo === "entra") return b0 - 10 + j * 2;
    if (modo === "barre" && j === c2) return b0 - 2;
    if (modo === "sube" && j > c2) return (j === ind ? b0 - 6 : b1 - 4) + (j - ind) * 2;
    return -60;
  };
  const foco = (j: number) => (orden === 0 ? 1 : j === c1 || j === c2 || (orden === 4 && j > c2) ? 1 : 0.45);
  const x1 = g.xVela(c1) - g.hueco * 0.45;
  const yH = g.yPrecio(V1.h),
    yL = g.yPrecio(V1.l);
  const rect = modo === "rango" ? pr(f, b0, 14) : ya(1) ? 1 : 0;
  const vh = velas[Math.min(ultima, n - 1)];
  // C2: el barrido (mecha bajo el mínimo) y el cierre de vuelta dentro
  const xC2 = g.xVela(c2),
    yMin2 = g.yPrecio(V2.l),
    yC2 = g.yPrecio(V2.c);
  const flash = modo === "barre" ? interpolate(f, [b1 - 2, b1 + 2, b1 + 14], [0, 1, 0], cl) : 0;
  return (
    <>
    <Escritorio dur={dur} cabecera="XAUUSD · ORO AL CONTADO · DIARIO" foco={[[0, 540], [b1, g.xVela(c1)], [b2, xC2]]} asiente={[b1, b2]}>
      <AbsoluteFill style={{ clipPath: `inset(${MARCO.y0 - 70}px ${1080 - MARCO.x1 - 20}px ${1920 - MARCO.y1 - 50}px ${MARCO.x0 - 20}px)` }}>
        <Fondo />
        <Cabecera v={vh} />
        <GraficoVelas velas={velas} marco={marco} entra={entra} forma={6} letra={20} tema={PAPEL} vivo={false} volumen={false} opacidad={foco} fechas={velas.map((v, j) => (zoom > 1.6 || j % 3 === 0 || j === c1 || j === c2 ? v.fecha : ""))} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {/* rango de C1 */}
          {rect > 0 && <rect x={x1} y={yH} width={(MARCO.x1 - 110 - x1) * rect} height={yL - yH} fill={alfa(ORO, modo === "rango" ? 0.16 + 0.4 * (latido(f, b2 + 10, 1, 14) - 1) + 0.4 * (latido(f, b2 + 28, 1, 14) - 1) : 0.16)} stroke={ORO} strokeWidth={3} />}
          {(modo === "rango" || ya(1)) && (
            <>
              <Nivel y={yH} x0={x1} p={modo === "rango" ? pr(f, b1 - 2, 10) : 1} color="#9C7A45" texto={numeroES(V1.h, 1)} guion={false} />
              <Nivel y={yL} x0={x1} p={modo === "rango" ? pr(f, b2 - 2, 10) : 1} color="#9C7A45" texto={numeroES(V1.l, 1)} guion={false} />
            </>
          )}
          {/* barrido: los stops bajo el mínimo saltan */}
          {orden >= 2 &&
            [0, 1, 2, 3, 4].map((s) => {
              const xs = xC2 - 40 + s * 20,
                ys = yL + 14 + (s % 2) * 10;
              const cae = modo === "barre" ? pr(f, b2 - 4 + s, 6) : 1;
              return (
                <g key={s} opacity={1 - cae}>
                  <path d={`M${xs - 6} ${ys - 6} l12 12 m0 -12 l-12 12`} stroke={ROJO} strokeWidth={3} />
                </g>
              );
            })}
          {orden >= 2 && <circle cx={xC2} cy={yMin2} r={10 + 50 * flash} fill="none" stroke={ROJO} strokeWidth={4} opacity={modo === "barre" ? pr(f, b1 - 2, 4) * (1 - 0.5 * flash) : 0.8} />}
          {/* cierre dentro del rango */}
          {modo === "cierre" && <line x1={xC2} x2={xC2} y1={yL} y2={yMin2} stroke={ORO} strokeWidth={8} strokeLinecap="round" opacity={0.5 + 0.5 * Math.abs(Math.sin(f / 5))} />}
          {orden >= 3 && (
            <>
              <circle cx={xC2} cy={yC2} r={modo === "cierre" ? 12 + 6 * Math.sin(Math.max(0, f - b2) / 3) * pr(f, b2, 4) : 12} fill={ORO} stroke={TINTA} strokeWidth={3} opacity={modo === "cierre" ? pr(f, b0, 6) : 1} />
              <Trazo d={`M${xC2 + 26} ${yMin2} C ${xC2 + 70} ${yMin2}, ${xC2 + 70} ${yC2 + 20}, ${xC2 + 26} ${yC2 + 6}`} p={modo === "cierre" ? pr(f, b0 - 4, 14) : 1} color={ORO} grosor={5} />
            </>
          )}
          {/* después: indecisión y el precio llega al otro lado del rango */}
          {orden >= 4 && (
            <>
              <circle cx={g.xVela(ind)} cy={g.yPrecio(velas[ind].c)} r={34} fill="none" stroke={TINTA} strokeWidth={3} strokeDasharray="6 5" opacity={pr(f, b0, 8)} />
              <Trazo d={`M${g.xVela(ind)} ${g.yPrecio(velas[ind].c)} L${g.xVela(c3)} ${yH - 4}`} p={pr(f, b1, 14)} color={ORO} grosor={6} />
              {f >= b2 - 2 && <circle cx={g.xVela(c3)} cy={yH} r={12 + 30 * pr(f, b2 - 2, 12)} fill="none" stroke={ORO} strokeWidth={4} opacity={1 - 0.6 * pr(f, b2 - 2, 12)} />}
            </>
          )}
        </svg>
        {modo === "entra" && <Rotulo x={560} y={420} desde={b2 - 2} tam={44}>1D · DIARIO</Rotulo>}
        {modo === "entra" && <Rotulo x={300} y={760} desde={b1 - 2} tam={40} color="#7A5C2E">JUNIO 2026</Rotulo>}
        {modo === "entra" && f >= b1 + 8 && f <= b1 + 30 && (
          <div style={{ position: "absolute", top: MARCO.y0 - 60, height: MARCO.y1 - MARCO.y0 + 100, left: MARCO.x0 - 160 + (MARCO.x1 - MARCO.x0 + 200) * pr(f, b1 + 8, 22, Easing.inOut(Easing.cubic)), width: 140, background: `linear-gradient(90deg, transparent, ${alfa(ORO, 0.55)}, transparent)` }} />
        )}
        {modo === "rango" && <Rotulo x={(x1 + MARCO.x1 - 110) / 2} y={yH - 34} desde={b0 + 4} tam={34} color="#7A5C2E">{txt(p, "rotuloRango", "RANGO · 10 JUN")}</Rotulo>}
        {orden >= 2 && <Rotulo x={xC2} y={yMin2 + 44} desde={modo === "barre" ? b1 : -99} tam={30} color={ROJO}>BARRIDO {numeroES(V2.l, 1)}</Rotulo>}
        {modo === "barre" && <Rotulo x={xC2 - 130} y={yL + 24} desde={b2} tam={30} color={ROJO}>STOPS</Rotulo>}
        {orden === 3 && <Rotulo x={xC2 + 10} y={yH + 34} desde={modo === "cierre" ? b1 : -99} tam={30} color="#7A5C2E">CIERRE DENTRO</Rotulo>}
        {orden >= 4 && <Rotulo x={g.xVela(ind)} y={g.yPrecio(velas[ind].l) + 40} desde={b0 + 2} tam={26}>indecisión</Rotulo>}
        
      </AbsoluteFill>
    </Escritorio>
    {modo === "barre" && f >= b0 - 4 && <BarridoGrande b0={b0} b1={b1} b2={b2} dur={dur} />}
    {modo === "rango" && f >= b2 + 10 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b2 + 10, REBOTE)})` }}>
        <span style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>rango de </span>
        <span style={{ display: "inline-block", transform: `scale(${latido(f, b2 + 36, 0.18, 12)})` }}><Cuenta desde={b2 + 10} de={0} a={V1.h - V1.l} sufijo=" $" tam={78} color={ORO} /></span>
        {f >= b2 + 46 && <div style={{ fontFamily: PRO, fontSize: 36, color: CREMA, marginTop: 8, opacity: pr(f, b2 + 46, 8), transform: `translateY(${(1 - pr(f, b2 + 46, 10)) * 30}px)` }}>1,8 veces su ATR de 14 días</div>}
      </div>
    )}
    {modo === "sube" && f >= b2 - 2 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b2 - 2, REBOTE)})` }}>
        <span style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>objetivo </span>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 78, color: ORO }}>{numeroES(V1.h, 1)} ✓</span>
      </div>
    )}
    {modo === "cierre" && txt(p, "rotulo") === "TURTLE SOUP" && (
      <>
        <BancoCapa x={870} y={960} esc={0.55} gesto="olla" desde={b1 - 6} />
        {f >= b1 - 6 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: pr(f, b1 - 6, 8), transform: "translateY(-140px)" }}>
            <path d="M780 1280 L940 1280 L925 1360 Q860 1385 795 1360 Z" fill="#2B2620" stroke={CREMA} strokeWidth={4} />
            <ellipse cx={860} cy={1280} rx={80} ry={14} fill="#7A5C2E" />
            <g transform={`translate(${845 + Math.sin(f / 6) * 14} ${1272})`}>
              <ellipse cx={0} cy={0} rx={20} ry={12} fill="#5E8C55" stroke="#2A3A26" strokeWidth={3} />
              <circle cx={22} cy={-3} r={6} fill="#7FA872" stroke="#2A3A26" strokeWidth={2} />
            </g>
            {[0, 1, 2].map((k) => (
              <path key={k} d={`M${830 + k * 30} ${1250 - ((f + k * 10) % 30)} q6 -10 0 -20`} stroke={alfa(CREMA, 0.5)} strokeWidth={3} fill="none" />
            ))}
          </svg>
        )}
      </>
    )}
    {modo === "cierre" && f >= b2 - 2 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b2 - 2, REBOTE)})` }}>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 78, color: ORO }}>{txt(p, "rotulo", "LO QUE IMPORTA")}</span>
      </div>
    )}
    </>
  );
};

/** El barrido a pantalla completa: la mecha de C2 atraviesa el mínimo del rango y los stops saltan por los aires. */
export const BarridoGrande: React.FC<{ b0: number; b1: number; b2: number; dur: number }> = ({ b0, b1, b2, dur }) => {
  const f = useCurrentFrame();
  const entra = pr(f, b0 - 4, 6);
  const sale = pr(f, Math.max(b2 + 16, dur - 8), 8);
  const op = entra * (1 - sale);
  if (op <= 0) return null;
  const Y = 1000; // el mínimo del rango (4.067,2)
  const impacto = b1 + 4;
  const baja = pr(f, b0, impacto - b0, Easing.in(Easing.cubic)); // la mecha baja hasta la línea
  const atraviesa = pr(f, impacto, 8, Easing.out(Easing.cubic)); // y la cruza
  const yMecha = 380 + (Y - 380) * baja + 180 * atraviesa;
  const t = temblor(f, impacto, 26, 12);
  const flash = interpolate(f, [impacto, impacto + 1, impacto + 6], [0, 0.6, 0], cl);
  const vuelan = pr(f, b2 - 4, 16, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{ opacity: op, transform: `translate(${t.x}px, ${t.y}px)` }}>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.94)" }} />
      {f >= impacto && <Velocidad x={540} y={Y} op={0.8 * (1 - pr(f, impacto + 10, 12))} />}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={0} x2={1080} y1={Y} y2={Y} stroke={ORO} strokeWidth={6} strokeDasharray="22 12" />
        {/* stops bajo el mínimo: saltan al llegar la mecha */}
        {Array.from({ length: 11 }).map((_, i) => {
          const x0 = 120 + i * 84,
            y0 = Y + 50 + (i % 2) * 26;
          const a = -Math.PI / 2 + (i - 5) * 0.28;
          const d = 520 * vuelan * (0.7 + rnd(i) * 0.6);
          const x = x0 + Math.cos(a) * d * 0.6,
            y = y0 + (f >= b2 - 4 ? Math.sin(a) * d * 0.2 + 900 * vuelan * vuelan : 0);
          return <path key={i} d={`M${x - 16} ${y - 16} l32 32 m0 -32 l-32 32`} stroke={ROJO} strokeWidth={7} strokeLinecap="round" opacity={1 - 0.8 * vuelan} transform={`rotate(${vuelan * (i % 2 ? 260 : -260)} ${x} ${y})`} />;
        })}
        {/* la mecha de C2 */}
        <line x1={540} x2={540} y1={300} y2={yMecha} stroke={CREMA} strokeWidth={16} strokeLinecap="round" />
        {f >= impacto && <circle cx={540} cy={Y} r={30 + 220 * pr(f, impacto, 14)} fill="none" stroke={ROJO} strokeWidth={8} opacity={1 - pr(f, impacto, 14)} />}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: Y - 72, textAlign: "center", fontFamily: PRO, fontSize: 36, color: ORO }}>MÍNIMO DE C1 · 4.067,2</div>
      <div style={{ position: "absolute", left: 580, top: 330, fontFamily: PRINCIPAL, fontSize: 72, color: CREMA, opacity: pr(f, b0, 8) }}>C2</div>
      {f >= b2 - 4 && <div style={{ position: "absolute", left: 0, right: 0, top: Y + 170, textAlign: "center", transform: `scale(${sp(f, b2 - 4, REBOTE)}) rotate(-5deg)` }}><span style={{ fontFamily: PRINCIPAL, fontSize: 140, color: ROJO, textShadow: "0 0 40px rgba(217,115,94,0.6)" }}>STOPS</span></div>}
      <BancoCapa x={820} y={Y + 150} esc={0.72} gesto="bolsa" desde={b2 - 6} />
      <AbsoluteFill style={{ background: "#FFF3DC", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 10-11 · contraejemplo: doji perfecto en mayo

const Mayo: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const rompe = txt(p, "modo") === "rompe";
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const zoom = rompe ? 1.7 : 1 + 0.7 * pr(f, 0, Math.max(20, dur - 4), Easing.inOut(Easing.cubic));
  const { velas, g, k, marco } = usaVentana("13 may", "28 may", zoom, ["19 may", "20 may", "21 may", "22 may", "25 may", "26 may", "27 may"]);
  const c1 = k("19 may"),
    c2 = k("20 may"),
    dj = k("21 may"),
    rot = k("27 may");
  const V1 = velas[c1],
    V2 = velas[c2];
  const ultima = rompe ? rot : dj;
  const entra = (j: number) => (j > ultima ? 1e9 : rompe && j > dj ? b0 - 14 + (j - dj) * 3 : -60);
  const x1 = g.xVela(c1) - g.hueco * 0.45;
  const yH = g.yPrecio(V1.h),
    yL = g.yPrecio(V1.l),
    yInv = g.yPrecio(V2.l);
  const xD = g.xVela(dj),
    yD = g.yPrecio(velas[dj].c);
  const t = rompe ? temblor(f, b0 + 2, 10, 10) : { x: 0, y: 0 };
  const x = pr(f, b1 - 4, 8);
  const checks = ["barrido", "cierre dentro", "doji"];
  return (
    <>
    <Escritorio dur={dur} cabecera="XAUUSD · ORO AL CONTADO · DIARIO" foco={[[0, xD], [b1, xD]]} asiente={[b1]}>
      <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)`, clipPath: `inset(${MARCO.y0 - 70}px ${1080 - MARCO.x1 - 20}px ${1920 - MARCO.y1 - 50}px ${MARCO.x0 - 20}px)` }}>
        <Fondo />
        <Cabecera v={velas[ultima]} />
        <GraficoVelas velas={velas} marco={marco} entra={entra} forma={5} letra={20} tema={PAPEL} vivo={false} volumen={false} opacidad={(j) => (j < c1 ? 0.45 : 1)} fechas={velas.map((v) => v.fecha)} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <rect x={x1} y={yH} width={MARCO.x1 - 110 - x1} height={yL - yH} fill={alfa(ORO, 0.14)} stroke={ORO} strokeWidth={3} />
          <Nivel y={yInv} x0={x1} p={1} color={ROJO} texto={numeroES(V2.l, 0)} />
          {!rompe && <circle cx={xD} cy={yD} r={30 + 4 * Math.sin(f / 4)} fill="none" stroke={ORO} strokeWidth={5} opacity={pr(f, b1 - 4, 8)} />}
          {rompe && <circle cx={g.xVela(rot)} cy={g.yPrecio(velas[rot].l)} r={14 + 40 * pr(f, b0, 12)} fill="none" stroke={ROJO} strokeWidth={5} opacity={1 - 0.7 * pr(f, b0, 12)} />}
          {rompe && x > 0 && <path d={`M${xD - 60} ${yD - 60} l${120 * x} ${120 * x} M${xD + 60} ${yD - 60} l${-120 * x} ${120 * x}`} stroke={ROJO} strokeWidth={14} strokeLinecap="round" />}
        </svg>
        {!rompe && <Rotulo x={xD + 10} y={yD - 70} desde={b1 - 2} tam={32} color="#7A5C2E">DOJI PERFECTO · 1 %</Rotulo>}
        {rompe && <Rotulo x={g.xVela(rot) - 30} y={g.yPrecio(velas[rot].l) + 46} desde={b0 + 2} tam={30} color={ROJO}>ROTO · 27 MAY</Rotulo>}
      </AbsoluteFill>
    </Escritorio>
      {!rompe && (
        <div style={{ position: "absolute", left: 120, top: 1250 }}>
          {checks.map((c, i) => (
            <div key={c} style={{ fontFamily: PRO, fontSize: 40, color: CREMA, opacity: pr(f, b2 - 6 + i * 5, 6), transform: `translateX(${(1 - pr(f, b2 - 6 + i * 5, 8)) * -40}px)`, marginBottom: 10 }}>
              <span style={{ color: ORO }}>✓</span> {c}
            </div>
          ))}
        </div>
      )}
      {rompe && f >= b1 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b1 - 2, REBOTE)}) rotate(-4deg)` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 88, color: ROJO, border: `8px solid ${ROJO}`, borderRadius: 16, padding: "4px 28px", background: "rgba(0,0,0,0.6)" }}>NO BASTA</span>
          {f >= b2 - 2 && (
            <div style={{ marginTop: 28, transform: `rotate(4deg) scale(${sp(f, b2 - 2, REBOTE)})` }}>
              <span style={{ fontFamily: SECUND, fontSize: 44, color: CREMA }}>necesita </span>
              <span style={{ fontFamily: PRINCIPAL, fontSize: 60, color: ORO }}>ZONA CLAVE</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 12 · porcentajes de Bulkowski

const Porcentajes: React.FC<PropsEscena> = ({ b, palabras }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const filas = [
    { nombre: "MARTILLO", v: 60, desde: b0 },
    { nombre: "ENVOLVENTE", v: 63, desde: b1 },
  ];
  const X0 = 140,
    W = 800;
  const moneda = sp(f, b2 - 4, REBOTE);
  const fuente = enPalabra(palabras, "bulkowski", 0),
    velas = enPalabra(palabras, "velas", 12),
    w63 = enPalabra(palabras, "63", b1 + 30);
  return (
    <AbsoluteFill>
      {filas.map((r, i) => {
        const y = 560 + i * 300;
        const k = pr(f, r.desde - 2, 18, Easing.out(Easing.cubic));
        if (f < r.desde - 4) return null;
        return (
          <div key={r.nombre} style={{ position: "absolute", left: X0, top: y, width: W, opacity: pr(f, r.desde - 4, 6), transform: `translateX(${(1 - pr(f, r.desde - 4, 16, Easing.out(Easing.exp))) * 420}px)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: SECUND, fontSize: 50, color: CREMA }}>{r.nombre}</span>
              <span style={{ display: "inline-block", transform: `scale(${latido(f, i ? w63 : r.desde + 14, 0.2, 12)})` }}><Cuenta desde={r.desde - 2} de={0} a={r.v} sufijo=" %" tam={96} color={ORO} /></span>
            </div>
            <div style={{ position: "relative", height: 34, borderRadius: 17, background: alfa(CREMA, 0.12), marginTop: 10 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${r.v * k}%`, borderRadius: 17, background: ORO }} />
              <div style={{ position: "absolute", left: "50%", top: -14, bottom: -14, width: 4, background: CREMA, opacity: 0.8 }} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: X0 + W / 2 - 60, top: 1170, fontFamily: PRO, fontSize: 30, color: CREMA, opacity: 0.8 * pr(f, b0 + 22, 8), transform: `scale(${latido(f, b0 + 22, 0.25, 14)})` }}>50 % = azar</div>
      {f >= w63 + 14 && <div style={{ position: "absolute", left: 0, right: 0, top: 1220, textAlign: "center", fontFamily: PRO, fontSize: 36, color: ORO, opacity: pr(f, w63 + 14, 8), transform: `translateY(${(1 - pr(f, w63 + 14, 10)) * 30}px)` }}>solo 10-13 puntos más que el azar</div>}
      {/* al decir «velas», tres velas pequeñas; luego cada fila lleva su icono */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {[0, 1, 2].map((i) => {
          const e = sp(f, velas - 4 + i * 4, REBOTE);
          if (e <= 0 || f > b0 + 10) return null;
          return <g key={i} opacity={Math.min(1, e) * (1 - pr(f, b0 + 2, 8))} transform={`translate(${380 + i * 160} ${(1 - e) * 120})`}><VelaG x={0} y={300} alto={200} ancho={50} v={[MARTILLO, DOJI, ENVUELVE][i]} /></g>;
        })}
        {f >= b0 + 16 && <g opacity={pr(f, b0 + 16, 8)} transform={`translate(${X0 + W + 20} ${600}) scale(${sp(f, b0 + 16, REBOTE) * latido(f, b0 + 28, 0.3, 12)})`}><VelaG x={0} y={-40} alto={150} ancho={40} v={MARTILLO} color={ORO} /></g>}
        {f >= b1 + 12 && <g opacity={pr(f, b1 + 12, 8)} transform={`translate(${X0 + W + 20} ${900}) scale(${sp(f, b1 + 12, REBOTE)})`}><VelaG x={-14} y={-40} alto={150} ancho={26} v={PREVIA} color={ORO} /><VelaG x={16} y={-40} alto={150} ancho={30} v={ENVUELVE} color={ORO} /></g>}
      </svg>

      {f < b0 + 16 && <Bulkowski x={540 - 760 * pr(f, b0 - 4, 16, Easing.in(Easing.cubic))} y={760} esc={1.15} desde={fuente - 2} gafas={velas - 6} senala={velas + 4} />}
      {moneda > 0 && (
        <div style={{ position: "absolute", left: 540 - 110, top: 1290, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #F0D59A, ${ORO} 60%, #8C6A36)`, transform: `scale(${moneda}) scaleX(${Math.cos((f - b2) * 0.35)})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PRINCIPAL, fontSize: 64, color: "#3A2A12", boxShadow: `0 0 60px ${alfa(ORO, 0.4)}` }}>
          {Math.cos((f - b2) * 0.35) > 0 ? "50/50" : ""}
        </div>
      )}
      <div style={{ position: "absolute", left: X0, top: 1640, fontFamily: PRO, fontSize: 24, color: CREMA, opacity: 0.6 * pr(f, b0, 8) }}>Fuente: Bulkowski</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 13 · capas del análisis

const Capas: React.FC<PropsEscena> = ({ b, palabras }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 15, b2 = 30, b3 = 45] = b;
  const capas = [
    { t: "ZONA CLAVE", desde: b1 + 6 },
    { t: "CRT", desde: b1 + 12 },
    { t: "AMD", desde: b2 },
    { t: "SMC", desde: b3 },
  ];
  const BASE = 1260,
    H = 150;
  return (
    <AbsoluteFill>
      {f >= b0 - 2 && f < b1 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", transform: `scale(${sp(f, b0 - 2, REBOTE)})` }}>
          <span style={{ fontFamily: SECUND, fontSize: 76, color: CREMA }}>{"esto tiene nombre…".slice(0, Math.round(18 * pr(f, b0 - 2, 14, Easing.linear)))}</span>
          <div style={{ height: 10, background: ORO, borderRadius: 5, margin: "14px auto 0", width: 700 * pr(f, b0, 16, Easing.inOut(Easing.cubic)) }} />
        </div>
      )}
      {f >= b1 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", transform: `scale(${sp(f, b1 - 2, REBOTE)})` }}>
          <div style={{ fontFamily: PRINCIPAL, fontSize: 150, color: ORO, lineHeight: 1 }}>CRT</div>
          <div style={{ fontFamily: PRO, fontSize: 38, letterSpacing: 2, marginTop: 14, opacity: pr(f, b1 + 4, 10), display: "flex", justifyContent: "center", gap: 18 }}>
            {[["RANGO", "rango"], ["BARRIDO", "barrido"], ["CIERRE DENTRO", "cierre"]].map(([t, w]) => {
              const a = enPalabra(palabras, w, b1 + 20);
              const on = pr(f, a - 2, 6);
              return (
                <span key={t} style={{ color: on > 0.5 ? "#16120E" : CREMA, background: alfa(ORO, on), borderRadius: 8, padding: "2px 10px", transform: `scale(${latido(f, a - 2, 0.25, 10)})`, display: "inline-block" }}>{t}</span>
              );
            })}
          </div>
        </div>
      )}
      {capas.map((c, i) => {
        const k = sp(f, c.desde - 4, REBOTE);
        if (k <= 0) return null;
        const y = BASE - i * (H - 30) - (1 - k) * 220;
        return (
          <div key={c.t} style={{ position: "absolute", left: 180, width: 720, top: y, height: H, opacity: Math.min(1, k) }}>
            <div style={{ position: "absolute", inset: 0, transform: "perspective(900px) rotateX(58deg)", background: `linear-gradient(180deg, ${alfa(ORO, 0.55 - i * 0.08)}, ${alfa(ORO, 0.2)})`, border: `3px solid ${ORO}`, borderRadius: 18, boxShadow: `0 20px 40px rgba(0,0,0,0.5)` }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PRO, fontSize: 44, color: CREMA, letterSpacing: 4 }}>{c.t}</div>
          </div>
        );
      })}
      {/* la vela, pequeña, encima de todo: es la firma, no la base */}
      {f >= b3 + 8 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: pr(f, b3 + 8, 8) }}>
          <g transform={`translate(0 ${(1 - sp(f, b3 + 8, REBOTE)) * -200})`}>
            <VelaG x={540} y={700} alto={200} ancho={60} v={DOJI} color={ORO} />
          </g>
        </svg>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 14 · la firma y el próximo vídeo

const Firma: React.FC<PropsEscena> = ({ p, b, dur, palabras }) => {
  const parte = txt(p, "parte", "PARTE 2"),
    titulo = txt(p, "titulo", "CRT"),
    sub = txt(p, "sub", "paso a paso"),
    clave = txt(p, "clave", "crt");
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const firma = pr(f, b0 - 6, 22, Easing.inOut(Easing.cubic));
  const wCrt = enPalabra(palabras, clave, b1 + 20),
    wPaso = enPalabra(palabras, "paso", b2);
  return (
    <>
    <Escritorio dur={dur} apagaEn={dur - TRANSICION} cabecera="PRÓXIMO VÍDEO" cursor={[[0, 420, 760], [b0 + 4, 320, 700], [b1 - 6, 700, 520], [b1 + 10, 760, 470]]} clics={[wCrt]} asiente={[b0, b1]}>
      <Chispas desde={b0 + 16} x={300} y={490} n={12} r={160} color={ORO} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <VelaG x={300} y={340} alto={300} ancho={80} v={DOJI} color={CREMA} />
        <Trazo d="M140 700 C 190 630, 240 740, 280 680 S 350 640, 390 700 S 450 660, 500 690" p={firma} color={ORO} grosor={7} />
      </svg>
      {f >= b1 - 2 && (
        <div style={{ position: "absolute", left: 580, top: 400, width: 360, transform: `scale(${sp(f, b1 - 2, REBOTE) * latido(f, wCrt, 0.12, 10)}) rotate(-3deg)`, background: CREMA, borderRadius: 18, padding: 26, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: "#9C7A45" }}>{parte}</div>
          <div style={{ fontFamily: PRINCIPAL, fontSize: 84, color: "#16120E", lineHeight: 1 }}>{titulo}</div>
          <div style={{ fontFamily: SECUND, fontSize: 34, color: "#16120E", opacity: pr(f, b2 - 2, 8) }}>{sub}</div>

        </div>
      )}
    </Escritorio>
    {/* abajo, como en las otras escenas: primero la firma, luego el próximo vídeo */}
    {f >= b0 && f < b1 + 2 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1190, textAlign: "center", transform: `scale(${sp(f, b0, REBOTE)})`, opacity: 1 - pr(f, b1 - 4, 6) }}>
        <span style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>la vela es </span>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 84, color: ORO }}>LA FIRMA</span>
      </div>
    )}
    {f >= b1 + 2 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1190, textAlign: "center", transform: `scale(${sp(f, b1 + 2, REBOTE)})` }}>
        <span style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>{parte.toLowerCase()} → </span>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 84, color: ORO, display: "inline-block", transform: `scale(${latido(f, wCrt, 0.25, 12)})` }}>{titulo}</span>
        {f >= wPaso - 2 && <div style={{ fontFamily: SECUND, fontSize: 56, color: CREMA, opacity: pr(f, wPaso - 2, 6), transform: `translateY(${(1 - pr(f, wPaso - 2, 10)) * 40}px)` }}>{sub}</div>}
        {f >= wCrt + 14 && (
          <div style={{ marginTop: 18, display: "inline-block", fontFamily: PRO, fontSize: 44, color: "#16120E", background: ORO, borderRadius: 40, padding: "8px 30px", transform: `scale(${sp(f, wCrt + 14, REBOTE) * latido(f, wPaso + 4, 0.12, 10)})`, boxShadow: `0 0 40px ${alfa(ORO, 0.5)}` }}>
            Comenta <b>CRT</b>
          </div>
        )}
      </div>
    )}
    <Chispas desde={wPaso + 8} x={540} y={1330} n={20} r={380} color={ORO} />
    <Chispas desde={wPaso + 20} x={300} y={500} n={14} r={260} color={CREMA} />
    </>
  );
};

export const engana: DefEscena = { C: Engana, momentos: 3, alInicio: () => true, sonidos: () => [[1, "golpe", 0.35]] };
export const tres: DefEscena = { C: Tres, momentos: 3, alInicio: () => true, sonidos: () => [[0, "tic", 0.25], [1, "tic", 0.25], [2, "exito", 0.35]] };
export const dojiZoom: DefEscena = { C: DojiZoom, momentos: 4, alInicio: () => true, sonidos: (p) => (txt(p, "modo") === "duda" ? [[2, "golpe", 0.25]] : [[1, "tic", 0.3], [2, "tic", 0.3]]) };
export const dato: DefEscena = { C: Dato, momentos: 3, alInicio: () => true, sonidos: () => [[2, "ding", 0.25]] };
export const oro: DefEscena = {
  C: Oro,
  momentos: 3,
  alInicio: () => true,
  sonidos: (p) => {
    const m = txt(p, "modo");
    return m === "rango" ? [[0, "tic", 0.3]] : m === "barre" ? [[0, "whoosh", 0.3], [1, "golpe", 0.4], [2, "puff", 0.35]] : m === "cierre" ? [[2, "ding", 0.25]] : m === "sube" ? [[1, "subida", 0.25]] : [];
  },
};
export const mayo: DefEscena = { C: Mayo, momentos: 3, alInicio: () => true, sonidos: (p) => (txt(p, "modo") === "rompe" ? [[0, "negacion", 0.3], [1, "sello", 0.35]] : [[1, "tic", 0.3]]) };
export const porcentajes: DefEscena = { C: Porcentajes, momentos: 3, alInicio: () => true, sonidos: () => [[0, "tic", 0.3], [1, "tic", 0.3], [2, "puff", 0.35]] };
export const capas: DefEscena = { C: Capas, momentos: 4, alInicio: () => true, sonidos: () => [[1, "papel", 0.25], [2, "papel", 0.25], [3, "papel", 0.25]] };
export const firma: DefEscena = { C: Firma, momentos: 3, alInicio: () => true, sonidos: () => [[0, "pincel", 0.35], [1, "campana", 0.25]] };
