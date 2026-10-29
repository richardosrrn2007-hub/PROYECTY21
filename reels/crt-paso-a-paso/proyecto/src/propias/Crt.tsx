// Vídeo 5 · CRT paso a paso (parte 2). Mismo mundo de la serie (planeta, dorado y crema). Datos reales del oro:
// el setup diario del 10–11 jun 2026 y su detalle en 1H (barrido, CHoCH, Order Block, gestión y R:R).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { F, alfa } from "../motor/estilos";
import { numeroES } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { Escritorio } from "./Escritorio";
import { GraficoVelas, OSCURO, PAPEL, continua, geometria, type Marco } from "./Velas";
import { XAU_H1, iH, N5 } from "./xau_h1";
import type { VelaFecha } from "./xau";
import { CREMA, DOJI, Fondo, MARCO, Nivel, Rotulo, TINTA, VelaG, Velocidad, cl, latido } from "./Doji";
import { Chispas, Halo, ORO, PRINCIPAL, PRO, REBOTE, ROJO, SECUND, VERDE, Trazo, pr, sp, temblor } from "./mg";

const H1 = continua(XAU_H1) as VelaFecha[];
/** Vela invisible que solo amplía el rango de precios del gráfico (para que quepan SL, TP1 y TP2). */
const fantasma = (lo: number, hi: number): VelaFecha => ({ fecha: "", o: (lo + hi) / 2, h: hi, l: lo, c: (lo + hi) / 2, v: 0 });

// ---------------------------------------------------------------- 1 · POV: «te barrieron el stop»

/** Burbuja de chat (POV del trader). */
const Burbuja: React.FC<{ x: number; y: number; desde: number; texto: string; color?: string; fondo?: string; derecha?: boolean }> = ({ x, y, desde, texto, color = TINTA, fondo = CREMA, derecha = false }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const e = sp(f, desde, REBOTE);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${derecha ? -100 : 0}%, -50%) scale(${e})`, transformOrigin: derecha ? "100% 100%" : "0% 100%", background: fondo, color, fontFamily: PRO, fontSize: 44, padding: "16px 28px", borderRadius: 30, borderBottomLeftRadius: derecha ? 30 : 6, borderBottomRightRadius: derecha ? 6 : 30, boxShadow: "0 12px 30px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
      {texto}
    </div>
  );
};

const Pov: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 10, b1 = 40, b2 = 70] = b;
  const marco: Marco = { x0: 90, x1: 1000, y0: 240, y1: 1000 };
  const velas = H1.slice(0, iH("15:00", 5) + 1);
  const kS = iH("19:00");
  const g = geometria(velas, marco, 22);
  const entrada = velas[iH("18:00")].c; // el trader del ejemplo entra al cierre de las 18:00
  const stop = 4036; // y pone el stop justo bajo el mínimo anterior (4.036,1)
  const entra = (k: number) => (k < kS ? -60 : k === kS ? b1 - 8 : b2 - 6 + (k - kS - 1) * 2);
  const impacto = b1 - 2;
  const t = temblor(f, impacto, 24, 12);
  const flash = interpolate(f, [impacto, impacto + 1, impacto + 6], [0, 0.45, 0], cl);
  const zoom = 1.2 - 0.2 * pr(f, b2 - 6, 30, Easing.inOut(Easing.cubic));
  const yE = g.yPrecio(entrada),
    yS = g.yPrecio(stop);
  const roto = f >= impacto;
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${g.xVela(kS)}px 620px` }}>
        <GraficoVelas velas={velas} marco={marco} entra={entra} forma={5} letra={22} tema={OSCURO} vivo={false} volumen={false} ejes={0.6} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {f >= b0 - 2 && <Trazo d={`M${marco.x0} ${yE} L${marco.x1 - 110} ${yE}`} p={pr(f, b0 - 2, 12)} color={CREMA} grosor={3} />}
          {f >= b0 + 6 && <Trazo d={`M${marco.x0} ${yS} L${marco.x1 - 110} ${yS}`} p={pr(f, b0 + 6, 12)} color={roto ? ROJO : alfa(ROJO, 0.7)} grosor={roto ? 6 : 3} />}
          {roto && <circle cx={g.xVela(kS)} cy={yS} r={20 + 120 * pr(f, impacto, 14)} fill="none" stroke={ROJO} strokeWidth={6} opacity={1 - pr(f, impacto, 14)} />}
        </svg>
        {f >= b0 + 8 && <Rotulo x={marco.x0 + 150} y={yS + 30} desde={b0 + 8} tam={30} color={ROJO}>mi stop · 4.036</Rotulo>}
      </AbsoluteFill>
      {roto && f < b2 + 20 && <Velocidad x={540} y={1100} op={0.5 * (1 - pr(f, impacto + 10, 12))} />}
      <Burbuja x={60} y={170} desde={b0 - 4} texto="Voy largo ↗" />
      <Burbuja x={1020} y={1060} desde={impacto + 2} texto="Stop Loss ✕" fondo={ROJO} color={CREMA} derecha />
      <Burbuja x={60} y={1150} desde={b2 + 8} texto="…y subió sin mí" fondo="#2B2620" color={CREMA} />
      <div style={{ position: "absolute", right: 40, top: 215, fontFamily: PRO, fontSize: 24, color: alfa(CREMA, 0.6) }}>ejemplo · XAUUSD 1H · 10–11 jun</div>
      {f >= b2 + 22 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b2 + 22, REBOTE)}) rotate(-3deg)` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 110, color: ROJO, textShadow: "0 0 30px rgba(217,115,94,0.5)" }}>TE BARRIERON.</span>
        </div>
      )}
      <AbsoluteFill style={{ background: "#FF6A55", opacity: flash, pointerEvents: "none" }} />
      <Chispas desde={impacto} x={g.xVela(kS)} y={yS} n={16} r={260} color={ROJO} />
      {dur < 0 && <div />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2 · el ciclo CRT

const Ciclo: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const CX = 540,
    CY = 1080,
    R = 300;
  const nodos = [
    { a: -90, t: "C1", s: "rango", v: { o: 0.35, c: 0.65, h: 0.2, l: 0.8 } },
    { a: 30, t: "C2", s: "barrido", v: { o: 0.4, c: 0.3, h: 0.25, l: 0.95 } },
    { a: 150, t: "C3", s: "expansión", v: { o: 0.8, c: 0.15, h: 0.1, l: 0.85 } },
  ];
  const giro = f * 0.8;
  const liq = pr(f, b2 - 4, 30);
  return (
    <AbsoluteFill>
      <Halo x={CX} y={CY} r={420} op={0.22} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`rotate(${giro} ${CX} ${CY})`} opacity={pr(f, b0, 10)}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={alfa(ORO, 0.5)} strokeWidth={4} strokeDasharray="30 18" />
          {[0, 120, 240].map((a) => (
            <path key={a} d={`M${CX + R} ${CY - 22} l22 22 l22 -22`} transform={`rotate(${a + 60} ${CX} ${CY})`} fill="none" stroke={ORO} strokeWidth={6} strokeLinecap="round" />
          ))}
        </g>
        {nodos.map((n, i) => {
          const e = sp(f, b0 + 4 + i * 6, REBOTE);
          if (e <= 0) return null;
          const x = CX + Math.cos((n.a * Math.PI) / 180) * R,
            y = CY + Math.sin((n.a * Math.PI) / 180) * R;
          return (
            <g key={n.t} transform={`translate(${x} ${y}) scale(${e * latido(f, b1 + i * 6, 0.15, 10)})`}>
              <circle r={105} fill="#0E0C0A" stroke={ORO} strokeWidth={5} />
              <VelaG x={-30} y={-70} alto={140} ancho={34} v={n.v} />
              <text x={34} y={-4} fontFamily={PRINCIPAL} fontSize={54} fill={ORO}>{n.t}</text>
              <text x={34} y={36} fontFamily={PRO} fontSize={24} fill={CREMA}>{n.s}</text>
            </g>
          );
        })}
        {/* liquidez: gotas que caen hacia la mecha de C2 */}
        {f >= b2 - 4 &&
          Array.from({ length: 14 }).map((_, i) => {
            const t = (liq * 1.6 + i / 14) % 1;
            const x0 = CX + Math.cos((30 * Math.PI) / 180) * R;
            const y0 = CY + Math.sin((30 * Math.PI) / 180) * R;
            return <circle key={i} cx={x0 - 160 + (i % 7) * 50 + (1 - t) * 0} cy={y0 + 260 - t * 150} r={8 * (1 - t) + 3} fill={ORO} opacity={(1 - t) * 0.9} />;
          })}
      </svg>
      {f >= b1 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", transform: `scale(${sp(f, b1 - 2, REBOTE)})` }}>
          <div style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>el ciclo</div>
          <div style={{ fontFamily: PRINCIPAL, fontSize: 150, color: ORO, lineHeight: 1 }}>CRT</div>
        </div>
      )}
      {f >= b2 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center", transform: `scale(${sp(f, b2 - 2, REBOTE)})` }}>
          <span style={{ fontFamily: PRO, fontSize: 56, color: TINTA, background: ORO, borderRadius: 40, padding: "8px 32px", letterSpacing: 4 }}>LIQUIDITY</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5 · bajamos a 1H: CHoCH y Order Block

const Hora: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 30, b2 = 60] = b;
  const velas = H1.slice(0, iH("23:00") + 1);
  const g = geometria(velas, MARCO, 20);
  const kOB = iH("18:00"),
    kS = iH("19:00"),
    kC = iH("20:00"),
    kR = iH("22:00");
  const entra = (k: number) => (k <= kS ? -60 + 0 * k : k === kC ? b1 - 10 : k === iH("21:00") ? b2 - 22 : k === kR ? b2 - 14 : b2 + 4);
  const entrada = 0.55 + 0.45 * pr(f, 0, 14, Easing.out(Easing.cubic)); // «bajamos»: la cámara entra en el gráfico de 1H
  const yCh = g.yPrecio(N5.chochNivel);
  const xOB = g.xVela(kOB) - g.hueco * 0.4;
  const yOBa = g.yPrecio(N5.obAlto),
    yOBb = g.yPrecio(N5.obBajo);
  const toca = b2 - 4;
  return (
    <>
      <Escritorio dur={dur} cabecera="XAUUSD · ORO AL CONTADO · 1 HORA" foco={[[0, 540], [b1, g.xVela(kC)], [b2, g.xVela(kR)]]} asiente={[b1, b2]}>
        <AbsoluteFill style={{ transform: `scale(${entrada})`, transformOrigin: "540px 600px", clipPath: `inset(${MARCO.y0 - 70}px ${1080 - MARCO.x1 - 20}px ${1920 - MARCO.y1 - 50}px ${MARCO.x0 - 20}px)` }}>
          <Fondo />
          <GraficoVelas velas={velas} marco={MARCO} entra={entra} forma={6} letra={20} tema={PAPEL} vivo={false} volumen={false} fechas={velas.map((v, k) => (k % 2 === 0 ? v.fecha : ""))} />
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {/* barrido de las 19:00 */}
            <circle cx={g.xVela(kS)} cy={g.yPrecio(N5.barrido)} r={12} fill="none" stroke={ROJO} strokeWidth={4} />
            {/* CHoCH: último máximo más bajo (18:00) y la vela de las 20:00 que cierra encima */}
            {f >= b1 - 6 && <Trazo d={`M${g.xVela(kOB)} ${yCh} L${MARCO.x1 - 110} ${yCh}`} p={pr(f, b1 - 6, 10)} color={ORO} grosor={4} guion />}
            {f >= b1 + 2 && <circle cx={g.xVela(kC)} cy={g.yPrecio(N5.chochCierre)} r={10 + 30 * pr(f, b1 + 2, 12)} fill="none" stroke={ORO} strokeWidth={4} opacity={1 - 0.6 * pr(f, b1 + 2, 12)} />}
            {/* Order Block: cuerpo de la vela bajista de las 18:00, prolongado */}
            {f >= b2 - 26 && <rect x={xOB} y={yOBa} width={(MARCO.x1 - 110 - xOB) * pr(f, b2 - 26, 12)} height={yOBb - yOBa} fill={alfa(ORO, 0.25 + 0.3 * (latido(f, toca, 1, 14) - 1))} stroke={ORO} strokeWidth={3} />}
            {f >= toca && <circle cx={g.xVela(kR)} cy={g.yPrecio(N5.retroceso)} r={12 + 40 * pr(f, toca, 14)} fill="none" stroke={ORO} strokeWidth={5} opacity={1 - pr(f, toca, 14)} />}
          </svg>
          <Rotulo x={g.xVela(kS)} y={g.yPrecio(N5.barrido) + 34} desde={b0 + 4} tam={26} color={ROJO}>barrido 4.023,9</Rotulo>
          {f >= b1 && <Rotulo x={g.xVela(kC) + 110} y={yCh - 58} desde={b1} tam={34} color="#7A5C2E">CHoCH</Rotulo>}
          {f >= b2 - 20 && <Rotulo x={xOB - 60} y={yOBb + 30} desde={b2 - 20} tam={30} color="#7A5C2E">ORDER BLOCK</Rotulo>}
        </AbsoluteFill>
      </Escritorio>
      {f < b1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, 2, REBOTE)})` }}>
          <span style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>diario → </span>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 90, color: ORO }}>1 HORA</span>
        </div>
      )}
      {f >= b1 && f < b2 - 4 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b1, REBOTE)})` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 96, color: ORO }}>CHoCH</span>
          <div style={{ fontFamily: PRO, fontSize: 32, color: CREMA }}>cierra sobre 4.069,4</div>
        </div>
      )}
      {f >= b2 - 4 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b2 - 4, REBOTE)})` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 84, color: ORO }}>ORDER BLOCK</span>
          <div style={{ fontFamily: PRO, fontSize: 32, color: CREMA }}>4.046,5 – 4.061,7</div>
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 6 · gestión: entrada, SL, TP1, TP2

const Gestion: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 25, b2 = 50, b3 = 75] = b;
  const reales = H1.slice(0, H1.length);
  const velas = [...reales, fantasma(4012, 4268)];
  const g = geometria(velas, MARCO, 20);
  const kR = iH("22:00"),
    kTP1 = iH("14:00");
  const n = reales.length;
  // las velas posteriores al retroceso avanzan durante la frase hasta tocar TP1 (14:00)
  const entra = (k: number) => (k >= n ? 1e9 : k <= kR ? -60 : b0 + 4 + ((k - kR - 1) * (b2 + 6 - b0 - 4)) / (kTP1 - kR - 1));
  const lineas = [
    { p: N5.tp2, t: `TP2 · ${numeroES(N5.tp2, 1)}`, c: VERDE, d: b3 },
    { p: N5.tp1, t: `TP1 · ${numeroES(N5.tp1, 1)}`, c: VERDE, d: b2 },
    { p: N5.entrada, t: `ENTRADA · ${numeroES(N5.entrada, 1)}`, c: "#E8DCC0", d: b0 },
    { p: N5.sl, t: `SL · ${numeroES(N5.sl, 0)}`, c: ROJO, d: b1 },
  ];
  const tocaTP1 = entra(kTP1) + 4;
  return (
    <>
      <Escritorio dur={dur} cabecera="XAUUSD · 1 HORA · GESTIÓN" foco={[[0, 540]]} asiente={[b0, b1, b2, b3]}>
        <AbsoluteFill style={{ clipPath: `inset(${MARCO.y0 - 70}px ${1080 - MARCO.x1 - 20}px ${1920 - MARCO.y1 - 50}px ${MARCO.x0 - 20}px)` }}>
          <Fondo />
          <GraficoVelas velas={velas} marco={MARCO} entra={entra} forma={4} letra={20} tema={PAPEL} vivo={false} volumen={false} opacidad={(k) => (k >= n ? 0 : 1)} />
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {/* zona de riesgo y de beneficio */}
            {f >= b1 && <rect x={g.xVela(kR)} y={g.yPrecio(N5.entrada)} width={MARCO.x1 - 110 - g.xVela(kR)} height={g.yPrecio(N5.sl) - g.yPrecio(N5.entrada)} fill={alfa(ROJO, 0.18 * pr(f, b1, 8))} />}
            {f >= b2 && <rect x={g.xVela(kR)} y={g.yPrecio(N5.tp2)} width={MARCO.x1 - 110 - g.xVela(kR)} height={g.yPrecio(N5.entrada) - g.yPrecio(N5.tp2)} fill={alfa(VERDE, 0.16 * pr(f, b2, 8))} />}
            {lineas.map((l) =>
              f >= l.d - 2 ? <Nivel key={l.t} y={g.yPrecio(l.p)} x0={g.xVela(kR)} p={pr(f, l.d - 2, 10)} color={l.c === "#E8DCC0" ? "#6B6458" : l.c} texto={numeroES(l.p, 0)} guion={l.c !== ROJO} /> : null,
            )}
            {f >= tocaTP1 && <circle cx={g.xVela(kTP1)} cy={g.yPrecio(N5.tp1)} r={12 + 40 * pr(f, tocaTP1, 14)} fill="none" stroke={VERDE} strokeWidth={5} opacity={1 - pr(f, tocaTP1, 14)} />}
          </svg>
          {lineas.map((l) => (f >= l.d ? <Rotulo key={l.t} x={g.xVela(kR) + 150} y={g.yPrecio(l.p) - 22} desde={l.d} tam={24} color={l.c === "#E8DCC0" ? TINTA : l.c === ROJO ? ROJO : "#3F7A47"}>{l.t}</Rotulo> : null))}
          {f >= b3 && <Rotulo x={g.xVela(kR) + 150} y={g.yPrecio(N5.tp2) + 26} desde={b3 + 6} tam={22} color="#3F7A47">✓ 15 jun</Rotulo>}
        </AbsoluteFill>
      </Escritorio>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center" }}>
        {lineas
          .slice()
          .reverse()
          .map((l) =>
            f >= l.d ? (
              <span key={l.t} style={{ display: "inline-block", margin: "0 14px", fontFamily: PRO, fontSize: 46, color: l.c === "#E8DCC0" ? CREMA : l.c, transform: `scale(${sp(f, l.d, REBOTE) * latido(f, l.d + 8, 0.15, 10)})` }}>
                {l.t.split(" · ")[0]}
              </span>
            ) : null,
          )}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- 7 · R:R real

const Rr: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 25, b2 = 50, b3 = 75] = b;
  const riesgo = N5.entrada - N5.sl,
    tp1 = N5.tp1 - N5.entrada,
    tp2 = N5.tp2 - N5.entrada;
  const ESC = 2.6; // px por dólar
  const BASE = 1000;
  const rR = pr(f, b0 - 4, 12) * riesgo * ESC;
  const rW = pr(f, b1 - 4, 30, Easing.inOut(Easing.cubic)) * tp2 * ESC;
  const ratio = f < b1 ? 1 : 1 + (tp2 / riesgo - 1) * pr(f, b1, 34, Easing.inOut(Easing.cubic));
  const t = temblor(f, b3, 14, 10);
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={160} x2={920} y1={BASE} y2={BASE} stroke={CREMA} strokeWidth={4} />
        {/* riesgo (abajo) y recorrido (arriba) */}
        <rect x={330} y={BASE} width={160} height={rR} fill={alfa(ROJO, 0.85)} rx={8} />
        <rect x={590} y={BASE - rW} width={160} height={rW} fill={alfa(VERDE, 0.85)} rx={8} />
        {f >= b1 + 10 && <line x1={570} x2={770} y1={BASE - tp1 * ESC} y2={BASE - tp1 * ESC} stroke={CREMA} strokeWidth={3} strokeDasharray="10 8" opacity={pr(f, b1 + 10, 8)} />}
      </svg>
      {f >= b0 - 2 && <div style={{ position: "absolute", left: 300, width: 220, top: BASE + rR + 14, textAlign: "center", fontFamily: PRO, fontSize: 40, color: ROJO, opacity: pr(f, b0, 8) }}>−{numeroES(riesgo, 0)} $<div style={{ fontSize: 24, color: CREMA }}>riesgo</div></div>}
      {f >= b1 && <div style={{ position: "absolute", left: 560, width: 220, top: BASE - rW - 90, textAlign: "center", fontFamily: PRO, fontSize: 40, color: VERDE, opacity: pr(f, b1 + 20, 8) }}>+{numeroES(tp2, 0)} $<div style={{ fontSize: 24, color: CREMA }}>hasta TP2</div></div>}
      {f >= b1 + 10 && <div style={{ position: "absolute", left: 790, top: BASE - tp1 * ESC - 22, fontFamily: PRO, fontSize: 26, color: CREMA, opacity: pr(f, b1 + 10, 8) }}>TP1 · 1:2,4</div>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", opacity: pr(f, b0, 8) }}>
        <span style={{ fontFamily: PRINCIPAL, fontSize: f >= b2 ? 170 : 130, color: f >= b2 ? ORO : CREMA, display: "inline-block", transform: `scale(${latido(f, b2 - 2, 0.25, 12)})` }}>1 : {numeroES(ratio, 1)}</span>
      </div>
      {f >= b3 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b3 - 2, REBOTE)}) rotate(-3deg)` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 64, color: CREMA, border: `6px solid ${ROJO}`, borderRadius: 16, padding: "4px 26px", background: "rgba(0,0,0,0.6)" }}>
            el <span style={{ color: ROJO }}>STOP</span> va siempre
          </span>
        </div>
      )}
      <Chispas desde={b2 - 2} x={540} y={260} n={18} r={360} color={ORO} />
    </AbsoluteFill>
  );
};

export const pov: DefEscena = { C: Pov, momentos: 3, alInicio: () => true, sonidos: () => [[0, "tic", 0.3], [1, "golpe", 0.45], [2, "subida", 0.3]] };
export const ciclo: DefEscena = { C: Ciclo, momentos: 3, alInicio: () => true, sonidos: () => [[1, "ding", 0.25], [2, "burbuja", 0.3]] };
export const hora: DefEscena = { C: Hora, momentos: 3, alInicio: () => true, sonidos: () => [[0, "whoosh", 0.3], [1, "tic", 0.3], [2, "ding", 0.3]] };
export const gestion: DefEscena = { C: Gestion, momentos: 4, alInicio: () => true, sonidos: () => [[0, "tic", 0.3], [1, "tic", 0.3], [2, "tic", 0.3], [3, "exito", 0.3]] };
export const rr: DefEscena = { C: Rr, momentos: 4, alInicio: () => true, sonidos: () => [[0, "tic", 0.25], [1, "subida", 0.3], [2, "exito", 0.35], [3, "golpe", 0.3]] };
export { DOJI };
