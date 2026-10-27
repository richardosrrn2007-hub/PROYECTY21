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
import { GraficoVelas, geometria, serieVelas } from "./Velas";
import { Chispas, Etiqueta, Halo, ORO, PRINCIPAL, REBOTE, ROJO, Revela, SECUND, Trazo, VERDE, encajar, pr, principalPara, sp, temblor } from "./mg";

const CREMA = "#F2E8D5";
const TINTA = "#16120E";
const LUZ = alfa("#F6ECD2", 0.6);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------- personajes

export type Animo = "tira" | "gana" | "pierde";

/** Toro blanco (compradores), de frente, con los brazos hacia abajo agarrando la cuerda. Origen: centro de la cabeza. */
export const Toro: React.FC<{ x: number; y: number; esc?: number; animo?: Animo; manos?: number }> = ({ x, y, esc = 1, animo = "tira", manos = 190 }) => {
  const f = useCurrentFrame();
  const gana = animo === "gana";
  const pierde = animo === "pierde";
  const brazo = gana ? -1 : 1;
  const sacude = animo === "tira" ? Math.sin(f / 2.2) * 2 : gana ? Math.sin(f / 4) * 4 : 0;
  return (
    <g transform={`translate(${x + sacude},${y}) scale(${esc}) rotate(${pierde ? 8 : 0})`}>
      {/* brazos */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path d={gana ? `M${s * 62} 110 Q${s * 110} 40 ${s * 92} -60` : `M${s * 62} 110 Q${s * 70} 160 ${s * 14} ${manos}`} fill="none" stroke={TINTA} strokeWidth={34} strokeLinecap="round" />
          <path d={gana ? `M${s * 62} 110 Q${s * 110} 40 ${s * 92} -60` : `M${s * 62} 110 Q${s * 70} 160 ${s * 14} ${manos}`} fill="none" stroke={CREMA} strokeWidth={28} strokeLinecap="round" />
          <circle cx={gana ? s * 92 : s * 14} cy={gana ? -64 : manos + 4} r={15} fill={TINTA} />
        </g>
      ))}
      {/* cuerpo */}
      <path d="M-78 175 C-86 110 -60 72 0 70 C60 72 86 110 78 175 Z" fill={CREMA} stroke={TINTA} strokeWidth={4} />
      <path d="M-30 110 Q0 128 30 110" fill="none" stroke={alfa(TINTA, 0.35)} strokeWidth={4} strokeLinecap="round" />
      {/* cuernos */}
      {[-1, 1].map((s) => (
        <path key={`c${s}`} d={`M${s * 46} -38 C${s * 80} -48 ${s * 98} -78 ${s * 92} -112 C${s * 84} -86 ${s * 66} -66 ${s * 40} -60 Z`} fill={ORO} stroke={TINTA} strokeWidth={3} />
      ))}
      {/* orejas */}
      {[-1, 1].map((s) => (
        <ellipse key={`o${s}`} cx={s * 70} cy={-12} rx={22} ry={11} transform={`rotate(${s * 20} ${s * 70} -12)`} fill={CREMA} stroke={TINTA} strokeWidth={3} />
      ))}
      {/* cabeza */}
      <path d="M-52 -50 C-58 -86 58 -86 52 -50 L56 30 C58 64 -58 64 -56 30 Z" fill={CREMA} stroke={TINTA} strokeWidth={4} />
      {/* hocico */}
      <ellipse cx={0} cy={34} rx={44} ry={26} fill="#D9B79A" stroke={TINTA} strokeWidth={3} />
      <ellipse cx={-14} cy={36} rx={5} ry={7} fill={TINTA} />
      <ellipse cx={14} cy={36} rx={5} ry={7} fill={TINTA} />
      <path d="M-12 54 Q0 66 12 54" fill="none" stroke={ORO} strokeWidth={4} />
      {/* ojos y cejas */}
      {[-1, 1].map((s) => (
        <g key={`e${s}`}>
          <circle cx={s * 22} cy={-14} r={pierde ? 3 : 6} fill={TINTA} />
          <path d={gana ? `M${s * 32} -34 Q${s * 22} -40 ${s * 12} -34` : `M${s * 34} -30 L${s * 10} -24`} stroke={TINTA} strokeWidth={5} strokeLinecap="round" fill="none" />
        </g>
      ))}
    </g>
  );
};

/** Oso negro (vendedores), de frente, con los brazos hacia arriba agarrando la cuerda. Origen: centro de la cabeza. */
export const Oso: React.FC<{ x: number; y: number; esc?: number; animo?: Animo; manos?: number }> = ({ x, y, esc = 1, animo = "tira", manos = -150 }) => {
  const f = useCurrentFrame();
  const gana = animo === "gana";
  const pierde = animo === "pierde";
  const sacude = animo === "tira" ? Math.cos(f / 2.4) * 2 : gana ? Math.sin(f / 4) * 4 : 0;
  return (
    <g transform={`translate(${x + sacude},${y}) scale(${esc}) rotate(${pierde ? -8 : 0})`}>
      {/* cuerpo */}
      <path d="M-92 210 C-100 120 -66 70 0 68 C66 70 100 120 92 210 Z" fill={TINTA} stroke={LUZ} strokeWidth={3} />
      <ellipse cx={0} cy={140} rx={44} ry={50} fill="#3A2C20" />
      {/* brazos */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path d={gana ? `M${s * 70} 110 Q${s * 130} 40 ${s * 100} -60` : `M${s * 70} 110 Q${s * 100} 10 ${s * 16} ${manos}`} fill="none" stroke={LUZ} strokeWidth={42} strokeLinecap="round" />
          <path d={gana ? `M${s * 70} 110 Q${s * 130} 40 ${s * 100} -60` : `M${s * 70} 110 Q${s * 100} 10 ${s * 16} ${manos}`} fill="none" stroke={TINTA} strokeWidth={36} strokeLinecap="round" />
          <circle cx={gana ? s * 100 : s * 16} cy={gana ? -64 : manos - 4} r={18} fill="#3A2C20" stroke={LUZ} strokeWidth={2} />
        </g>
      ))}
      {/* orejas */}
      {[-1, 1].map((s) => (
        <g key={`o${s}`}>
          <circle cx={s * 52} cy={-48} r={22} fill={TINTA} stroke={LUZ} strokeWidth={3} />
          <circle cx={s * 52} cy={-48} r={10} fill="#3A2C20" />
        </g>
      ))}
      {/* cabeza */}
      <circle cx={0} cy={0} r={64} fill={TINTA} stroke={LUZ} strokeWidth={3} />
      <ellipse cx={0} cy={24} rx={32} ry={24} fill="#5A4535" />
      <ellipse cx={0} cy={14} rx={12} ry={8} fill="#0A0806" />
      <path d={pierde ? "M-10 40 Q0 32 10 40" : "M-10 34 Q0 42 10 34"} fill="none" stroke="#0A0806" strokeWidth={3} strokeLinecap="round" />
      {[-1, 1].map((s) => (
        <g key={`e${s}`}>
          <circle cx={s * 24} cy={-10} r={pierde ? 3 : 6} fill={CREMA} />
          <path d={gana ? `M${s * 34} -28 Q${s * 24} -34 ${s * 14} -28` : `M${s * 36} -26 L${s * 12} -18`} stroke={CREMA} strokeWidth={5} strokeLinecap="round" fill="none" />
        </g>
      ))}
    </g>
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
  const yToro = 215 - Math.max(0, vel) * 1100 + (ganador === "oso" ? 40 : 0);
  const yOso = 1150 + Math.max(0, -vel) * 1100 + (ganador === "toro" ? 40 : 0);
  const g = temblor(f, b[1] ?? 0, 6);
  const tensa = 1 + Math.abs(vel) * 40;
  const etiquetas = arr<string>(p, "etiquetas");
  return (
    <AbsoluteFill style={{ transform: `translate(${g.x}px,${g.y}px)` }}>
      <Halo x={540} y={700} r={480} op={0.14} />
      {/* eje de precio a la izquierda */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={150} x2={150} y1={Y_ALTO - 30} y2={Y_BAJO + 30} stroke={alfa(C.texto, 0.18)} strokeWidth={2} />
        <line x1={170} x2={910} y1={yA} y2={yA} stroke={alfa(ORO, 0.6)} strokeWidth={2.5} strokeDasharray="10 10" />
        {/* mecha */}
        <line x1={540} x2={540} y1={yDe(hi)} y2={yDe(lo)} stroke={CREMA} strokeWidth={8} />
        {/* cuerpo de la vela */}
        <rect x={540 - 95} y={Math.min(yA, yC)} width={190} height={Math.max(4, Math.abs(yC - yA))} rx={4} fill={sube ? CREMA : TINTA} stroke={CREMA} strokeWidth={5} />
        {/* cuerda */}
        <path d={`M540 ${yToro + 190 * 1.05} Q${540 + Math.sin(f / 2) * 6 / tensa} ${(yToro + yC) / 2} 540 ${yC}`} fill="none" stroke={ORO} strokeWidth={8} />
        <path d={`M540 ${yC} Q${540 - Math.sin(f / 2) * 6 / tensa} ${(yOso + yC) / 2} 540 ${yOso - 150 * 1.05}`} fill="none" stroke={ORO} strokeWidth={8} />
        <circle cx={540} cy={yC} r={16} fill={ORO} stroke={TINTA} strokeWidth={3} />
        <Toro x={540} y={yToro} esc={1.05} animo={animoToro} />
        <Oso x={540} y={yOso} esc={1.05} animo={animoOso} />
      </svg>
      {/* precio que sigue al nudo */}
      <div style={{ position: "absolute", left: 660, top: yC - 24, background: sube ? CREMA : TINTA, color: sube ? TINTA : CREMA, border: `2px solid ${CREMA}`, borderRadius: 10, padding: "4px 14px", fontFamily: F.texto, fontWeight: 800, fontSize: 28, fontVariantNumeric: "tabular-nums" }}>
        {numeroES(228 + (precio - 0.5) * 12, 2)}
      </div>
      <div style={{ position: "absolute", left: 160, top: yA - 46, fontFamily: SECUND, fontSize: 30, color: ORO, opacity: pr(f, 0, 10) }}>abre</div>
      {/* etiquetas de cada momento */}
      {(() => {
        // posiciones sin pisarse: cada etiqueta de la columna izquierda queda al menos 64 px de las anteriores
        const usados: number[] = [];
        return etiquetas.map((t, k) => {
        const d = b[k];
        if (!t || d === undefined || f < d - 2) return null;
        const [texto, lugar] = t.split("@");
        const y = lugar === "arriba" ? 300 : lugar === "abajo" ? 1060 : lugar === "cierre" ? yC - 30 : lugar === "alto" ? yDe(hi) - 30 : lugar === "bajo" ? yDe(lo) - 20 : 380;
        const x = lugar === "arriba" || lugar === "abajo" ? 690 : 110;
        let yy = y;
        if (x === 110) {
          while (usados.some((u) => Math.abs(u - yy) < 64)) yy += 64;
          usados.push(yy);
          // las etiquetas largas ocupan dos líneas: reservan también el hueco de debajo
          if (texto.length > 10) usados.push(yy + 64);
        }
        return (
          <div key={k} style={{ position: "absolute", left: x, width: 340, top: yy, textAlign: "left", transform: `scale(${sp(f, d - 2, REBOTE)})`, transformOrigin: "0 50%", fontFamily: principalPara(texto), fontSize: lugar === "titulo" ? 52 : 44, lineHeight: 1.05, color: lugar === "abajo" ? ROJO : ORO, textShadow: "0 4px 14px rgba(0,0,0,0.85)" }}>
            {texto}
          </div>
        );
      });
      })()}
      {ganador && <Chispas desde={dur - 24} x={540} y={ganador === "toro" ? 300 : 1060} n={18} r={260} color={ganador === "toro" ? CREMA : ORO} />}
    </AbsoluteFill>
  );
};

export const batalla: DefEscena = {
  C: Batalla,
  momentos: (p) => Math.max(3, arr(p, "etiquetas").length),
  alInicio: () => true,
  sonidos: () => [
    [0, "swoosh", 0.25],
    [1, "golpe", 0.25],
    [2, "swoosh", 0.22],
  ],
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
  const sello = sp(f, b1, REBOTE);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${372 * aleja - 120 * (1 - aleja)}px) scale(${0.62 + 0.63 * (1 - aleja)})`, transformOrigin: "540px 262px" }}>
        <Escritorio dur={dur} foco={[[0, 540]]} asiente={[b0, b1]} cabecera="AAPL · 1D">
          <Halo x={540} y={560} r={380} op={0.18} />
          <VelaReto f={f} desde={final ? -40 : 0} respuesta={final ? b1 : 1e9} />
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
      {final && f >= b1 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <Toro x={880} y={760} esc={0.55} animo="gana" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const reto: DefEscena = { C: Reto, momentos: 2, alInicio: () => true, sonidos: (p) => (txt(p, "modo") === "respuesta" ? [[1, "exito", 0.3]] : [[0, "burbuja", 0.3]]) };

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
      {color > 0.3 && (
        <>
          <div style={{ position: "absolute", left: 140, top: 700, fontFamily: SECUND, fontSize: 40, color: VERDE, transform: `scale(${sp(f, b1 + 4)})` }}>sube</div>
          <div style={{ position: "absolute", left: 820, top: 740, fontFamily: SECUND, fontSize: 40, color: ROJO, transform: `scale(${sp(f, b1 + 8)})` }}>baja</div>
        </>
      )}
      <Etiqueta desde={b0} x={540} y={1130} texto="EN TU APP" />
    </AbsoluteFill>
  );
};
export const apps: DefEscena = { C: Apps, momentos: 2, sonidos: () => [[0, "pop", 0.25], [1, "ding", 0.25]] };

// ---------------------------------------------------------------- gráfica y tendencia

const Grafica: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const tendencia = txt(p, "modo") === "tendencia";
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const n = 36;
  const velas = serieVelas(n, 33, (k) => 0.55 + Math.sin(k / 2.6) * 1.0, 220, 1.6);
  const marco = { x0: 110, x1: 990, y0: 320, y1: 850 };
  const g = geometria(velas, marco, 20);
  // mínimos más altos: los valles locales
  const valles: number[] = [];
  velas.forEach((v, k) => {
    if (k > 1 && k < n - 2 && v.l < velas[k - 1].l && v.l < velas[k + 1].l && v.l < velas[k - 2].l && v.l < velas[k + 2].l) valles.push(k);
  });
  const subiendo = valles.filter((k, i) => i === 0 || velas[k].l > velas[valles[i - 1]].l);
  const pts = subiendo.map((k) => [g.xVela(k), g.yPrecio(velas[k].l) + 14] as [number, number]);
  const linea = pr(f, b1, 20, Easing.inOut(Easing.cubic));
  const zoom = tendencia ? 1 : 1.9 - 0.9 * pr(f, 0, Math.max(24, b0 + 10), Easing.inOut(Easing.cubic));
  const entra = (k: number) => (tendencia ? -60 : k < n - 10 ? -60 : (k - (n - 10)) * 2);
  return (
    <Escritorio dur={dur} cabecera="AAPL · APPLE · 1D · EJEMPLO" foco={[[0, 700], [b1, 400], [b2, 800]]} asiente={[b1, b2]}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${g.xVela(n - 1)}px 560px` }}>
        <GraficoVelas velas={velas} marco={marco} entra={entra} forma={5} letra={20} />
        {tendencia && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {pts.length > 1 && <Trazo d={pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ")} p={linea} grosor={6} color={ORO} />}
            {pts.map(([x, y], i) => {
              const s = sp(f, b0 + i * 6, REBOTE);
              return s > 0 ? <circle key={i} cx={x} cy={y} r={11 * s} fill={ORO} stroke={TINTA} strokeWidth={3} /> : null;
            })}
          </svg>
        )}
      </AbsoluteFill>
      {tendencia && f >= b2 - 2 && (
        <div style={{ position: "absolute", left: 140, top: 340, fontFamily: principalPara("MÍNIMOS MÁS ALTOS"), fontSize: 46, color: ORO, transform: `scale(${sp(f, b2 - 2, REBOTE)})`, transformOrigin: "0 50%" }}>MÍNIMOS MÁS ALTOS ↗</div>
      )}
    </Escritorio>
  );
};
export const grafica: DefEscena = { C: Grafica, momentos: 3, alInicio: () => true, sonidos: (p) => (txt(p, "modo") === "tendencia" ? [[0, "tic", 0.25], [1, "swoosh", 0.25], [2, "ding", 0.25]] : [[0, "whoosh", 0.25]]) };

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
  const [b0 = 0, b1 = 20] = b;
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
    </AbsoluteFill>
  );
};
export const comenta: DefEscena = { C: Comenta, momentos: 2, alInicio: () => true, sonidos: () => [[0, "pop", 0.3], [1, "campana", 0.25]] };

export { Personaje };
