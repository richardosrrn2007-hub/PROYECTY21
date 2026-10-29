// Vídeo 5 · CRT paso a paso (parte 2). Mismo mundo de la serie (planeta, dorado y crema). Datos reales del oro:
// el setup diario del 10–11 jun 2026 y su detalle en 1H (barrido, CHoCH, Order Block, gestión y R:R).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { F, alfa } from "../motor/estilos";
import { numeroES, rnd } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { Escritorio } from "./Escritorio";
import { GraficoVelas, OSCURO, PAPEL, continua, geometria, type Marco } from "./Velas";
import { XAU_H1, iH, N5 } from "./xau_h1";
import { BancoCapa } from "./Banco";
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

/** Móvil en la mano con una app de trading genérica: el dedo pulsa COMPRAR en `toca`. */
const Movil: React.FC<{ toca: number; sale: number }> = ({ toca, sale }) => {
  const f = useCurrentFrame();
  const entra = sp(f, 0, REBOTE);
  const fuera = pr(f, sale, 10, Easing.in(Easing.cubic));
  if (fuera >= 1) return null;
  const dedo = pr(f, toca - 14, 12, Easing.inOut(Easing.cubic)); // el dedo se acerca al botón
  const pulsa = f >= toca && f < toca + 5;
  const hecho = f >= toca;
  const velas = [0.7, 0.55, 0.62, 0.4, 0.48, 0.3, 0.38];
  return (
    <div style={{ position: "absolute", left: 600, top: 760 + (1 - entra) * 900 + fuera * 1200, width: 480, height: 900, transform: `scale(0.68) rotate(${6 + 1.5 * Math.sin(f / 18)}deg)`, transformOrigin: "50% 0%" }}>
      {/* teléfono */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: "#0B0A09", border: "10px solid #2A2520", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 30, top: 50, fontFamily: PRO, fontSize: 30, color: CREMA }}>XAUUSD · 1H</div>
        <div style={{ position: "absolute", right: 30, top: 50, fontFamily: PRO, fontSize: 30, color: ORO }}>4.046,5</div>
        <svg width={460} height={360} style={{ position: "absolute", left: 0, top: 110 }}>
          {velas.map((y, k) => (
            <g key={k}>
              <line x1={50 + k * 58} x2={50 + k * 58} y1={y * 300 - 40} y2={y * 300 + 40} stroke={CREMA} strokeWidth={3} />
              <rect x={36 + k * 58} y={y * 300 - 20} width={28} height={40} fill={k % 2 ? CREMA : "#0B0A09"} stroke={CREMA} strokeWidth={3} />
            </g>
          ))}
        </svg>
        <div style={{ position: "absolute", left: 30, top: 500, fontFamily: PRO, fontSize: 24, color: alfa(CREMA, 0.6) }}>Lote 0,10</div>
        {/* botones VENDER / COMPRAR */}
        <div style={{ position: "absolute", left: 30, right: 30, top: 560, display: "flex", gap: 20 }}>
          <div style={{ flex: 1, height: 120, borderRadius: 22, background: alfa(ROJO, 0.85), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PRO, fontSize: 36, color: CREMA }}>VENDER</div>
          <div style={{ flex: 1, height: 120, borderRadius: 22, background: pulsa ? "#2F6FD6" : "#3B82F6", transform: `scale(${pulsa ? 0.92 : 1})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PRO, fontSize: 36, color: "#fff", boxShadow: hecho ? "0 0 40px rgba(59,130,246,0.7)" : "none" }}>COMPRAR</div>
        </div>
        {hecho && (
          <div style={{ position: "absolute", left: 30, right: 30, top: 720, borderRadius: 20, background: "#1E2A1F", border: `2px solid ${VERDE}`, padding: "16px 20px", fontFamily: PRO, fontSize: 26, color: CREMA, transform: `translateY(${(1 - pr(f, toca, 8)) * 40}px)`, opacity: pr(f, toca, 6) }}>
            ✓ Orden ejecutada · COMPRA 4.046,5
          </div>
        )}
      </div>
      {/* toque de pantalla (como en una grabación del móvil) */}
      {dedo > 0 && f < toca + 8 && <div style={{ position: "absolute", left: 300, top: 585, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.55)", border: "3px solid #fff", opacity: Math.min(dedo, 1 - pr(f, toca + 2, 6)), transform: `scale(${pulsa ? 0.8 : 1})` }} />}
      {f >= toca && f < toca + 10 && <div style={{ position: "absolute", left: 285, top: 570, width: 120, height: 120, borderRadius: "50%", border: "4px solid #fff", opacity: 1 - (f - toca) / 10, transform: `scale(${1 + (f - toca) / 4})` }} />}
    </div>
  );
};

/** Cristal roto: grietas irregulares en zigzag con ramas, punto de impacto astillado y trozos sueltos. */
const Cristal: React.FC<{ x: number; y: number; desde: number }> = ({ x, y, desde }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const t = pr(f, desde, 5, Easing.out(Easing.cubic));
  const grietas = Array.from({ length: 7 }).map((_, k) => {
    let a = (k / 7) * Math.PI * 2 + rnd(k * 3.1) * 0.6;
    let px = x,
      py = y;
    const largo = 380 + rnd(k * 7.7) * 520;
    const pts: [number, number][] = [[px, py]];
    for (let i = 0; i < 6; i++) {
      a += (rnd(k * 13 + i) - 0.5) * 0.7;
      const d = (largo / 6) * t;
      px += Math.cos(a) * d;
      py += Math.sin(a) * d;
      pts.push([px, py]);
    }
    return pts;
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {grietas.map((pts, k) => {
        const d = pts.map(([px, py], i) => `${i ? "L" : "M"}${px} ${py}`).join(" ");
        const [bx, by] = pts[3];
        const ra = rnd(k * 5.5) * Math.PI * 2;
        return (
          <g key={k}>
            <path d={d} stroke="rgba(0,0,0,0.5)" strokeWidth={6} fill="none" strokeLinejoin="miter" />
            <path d={d} stroke="#FFFFFF" strokeWidth={k % 3 === 0 ? 3.5 : 2} fill="none" strokeLinejoin="miter" />
            {/* rama */}
            <path d={`M${bx} ${by} l${Math.cos(ra) * 120 * t} ${Math.sin(ra) * 120 * t} l${Math.cos(ra + 0.5) * 70 * t} ${Math.sin(ra + 0.5) * 70 * t}`} stroke="#FFFFFF" strokeWidth={1.5} fill="none" opacity={0.8} />
          </g>
        );
      })}
      {/* centro astillado y trozos */}
      <circle cx={x} cy={y} r={34 * t} fill="rgba(255,255,255,0.18)" stroke="#FFFFFF" strokeWidth={2} />
      {Array.from({ length: 6 }).map((_, k) => {
        const a = rnd(k * 9.9) * Math.PI * 2,
          d = 60 + 140 * pr(f, desde, 14, Easing.out(Easing.cubic));
        return <path key={`s${k}`} d={`M${x + Math.cos(a) * d} ${y + Math.sin(a) * d} l14 -6 l-6 16 Z`} fill="rgba(255,255,255,0.7)" opacity={1 - pr(f, desde + 6, 10)} />;
      })}
    </svg>
  );
};

const Pov: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 10, b1 = 40, b2 = 70] = b;
  // 1) la vela real del barrido (19:00), gigante, cae como un martillo hacia «TU STOP»
  // 2) impacto: el cristal se agrieta, la línea del stop revienta, «STOP LOSS −10,5 $»
  // 3) rebobinado VHS y las velas reales suben hasta 4.220: «TE BARRIERON.»
  const V = XAU_H1[iH("19:00")];
  const STOP = 4036,
    ENTRADA = XAU_H1[iH("18:00")].c;
  const Y = (p: number) => 330 + ((4072 - p) / 52) * 900; // escala de la vela gigante (4.072 arriba → 4.020 abajo)
  const impacto = b1 - 2;
  const baja = pr(f, b0 + 2, impacto - b0 - 2, Easing.in(Easing.cubic));
  const yMecha = Y(V.o) + (Y(V.l) - Y(V.o)) * baja;
  const yStop = Y(STOP);
  const t = temblor(f, impacto, 34, 16);
  const flash = interpolate(f, [impacto, impacto + 1, impacto + 7], [0, 0.6, 0], cl);
  const grieta = pr(f, impacto, 6);
  const rebobina = f >= b2 - 8 && f < b2 + 4;
  const sube = pr(f, b2 + 2, 26, Easing.out(Easing.cubic));
  const marco: Marco = { x0: 90, x1: 1000, y0: 240, y1: 1000 };
  const velas = H1.slice(iH("19:00"), iH("15:00", 5) + 1);
  const entra = (k: number) => b2 + 2 + k * 1.5;
  const cx = 540,
    cy = yStop;
  const grietas = [
    [0, -1], [0.8, -0.6], [1, 0.2], [0.5, 0.9], [-0.4, 1], [-1, 0.3], [-0.9, -0.5], [-0.3, -1],
  ];
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)`, filter: f >= impacto && f < impacto + 2 ? "invert(1) contrast(1.4)" : undefined }}>
      {f < b2 + 2 && (
        <>
          {f < impacto && <Halo x={540} y={Y(V.o)} r={420} op={0.25 * (1 - baja)} />}
          {f < impacto && f > b0 && <Velocidad x={540} y={yMecha} op={0.6 * baja} />}
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {/* la entrada y el stop del trader */}
            <line x1={40} x2={1040} y1={Y(ENTRADA)} y2={Y(ENTRADA)} stroke={CREMA} strokeWidth={4} strokeDasharray="16 10" opacity={pr(f, b0 + 4, 6)} />
            {f < impacto ? (
              <line x1={40} x2={1040} y1={yStop} y2={yStop} stroke={ROJO} strokeWidth={8} opacity={pr(f, b0 + 4, 6)} />
            ) : (
              <>
                <line x1={40 - 300 * grieta} x2={520 - 300 * grieta} y1={yStop + 80 * grieta} y2={yStop + 200 * grieta} stroke={ROJO} strokeWidth={8} opacity={1 - pr(f, impacto + 8, 10)} />
                <line x1={560 + 300 * grieta} x2={1040 + 300 * grieta} y1={yStop + 200 * grieta} y2={yStop + 60 * grieta} stroke={ROJO} strokeWidth={8} opacity={1 - pr(f, impacto + 8, 10)} />
              </>
            )}
            {/* la vela gigante del barrido */}
            <g opacity={pr(f, 0, 8)}>
            <line x1={540} x2={540} y1={Y(V.h)} y2={Math.max(Y(V.h), yMecha)} stroke={CREMA} strokeWidth={22} strokeLinecap="round" />
            <rect x={540 - 130} y={Math.min(Y(V.o), Y(V.c))} width={260} height={Math.max(14, Math.abs(Y(V.c) - Y(V.o)))} fill={CREMA} stroke={CREMA} strokeWidth={6} rx={6} />
            </g>
          </svg>
          <div style={{ position: "absolute", left: 60, top: Y(ENTRADA) - 54, fontFamily: PRO, fontSize: 34, color: CREMA, opacity: pr(f, b0 + 4, 6) }}>ENTRADA LARGO</div>
          <div style={{ position: "absolute", left: 60, top: yStop + 18, fontFamily: PRO, fontSize: 40, color: ROJO, opacity: f < impacto ? pr(f, b0 + 4, 6) : 0 }}>TU STOP</div>
          {f >= impacto && (
            <div style={{ position: "absolute", left: 0, right: 0, top: yStop + 130, textAlign: "center", transform: `scale(${sp(f, impacto, REBOTE)}) rotate(-4deg)` }}>
              <span style={{ fontFamily: PRINCIPAL, fontSize: 70, color: CREMA, background: ROJO, borderRadius: 14, padding: "4px 22px" }}>STOP LOSS −10,5 $</span>
            </div>
          )}
          <Cristal x={cx} y={cy} desde={impacto} />
          <BancoCapa x={880} y={1290} esc={0.8} gesto="no" desde={impacto + 2} />
          <Chispas desde={impacto} x={cx} y={cy} n={22} r={420} color={ROJO} />
        </>
      )}
      {/* rebobinado VHS */}
      {rebobina && (
        <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 3px, transparent 3px 7px)", mixBlendMode: "screen" }}>
          <div style={{ position: "absolute", left: 60, top: 260, fontFamily: PRO, fontSize: 64, color: CREMA }}>◀◀ REBOBINA</div>
        </AbsoluteFill>
      )}
      {/* y el precio sube sin ti: velas reales 19:00 → 15:00 */}
      {f >= b2 + 2 && (
        <AbsoluteFill style={{ opacity: sube }}>
          <GraficoVelas velas={velas} marco={marco} entra={entra} forma={3} letra={22} tema={OSCURO} vivo={false} volumen={false} ejes={0.6} />
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <line x1={marco.x0} x2={marco.x1 - 110} y1={geometria(velas, marco, 22).yPrecio(STOP)} y2={geometria(velas, marco, 22).yPrecio(STOP)} stroke={ROJO} strokeWidth={4} strokeDasharray="12 10" />
          </svg>
          <div style={{ position: "absolute", right: 40, top: 215, fontFamily: PRO, fontSize: 24, color: alfa(CREMA, 0.6) }}>ejemplo · XAUUSD 1H · 11 jun 2026</div>
        </AbsoluteFill>
      )}
      <Movil toca={b0} sale={b0 + 6} />
      {f >= b2 + 22 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b2 + 22, REBOTE)}) rotate(-3deg)` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 120, color: ROJO, textShadow: "0 0 30px rgba(217,115,94,0.5)" }}>TE BARRIERON.</span>
        </div>
      )}
      <AbsoluteFill style={{ background: "#FF6A55", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2 · el ciclo CRT

const Ciclo: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const CX = 540,
    CY = 980,
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
        {/* Liquidity: los stops bajo el mínimo, justo donde va la mecha de C2 */}
        {f >= b2 - 6 && (
          <g opacity={pr(f, b2 - 6, 8)}>
            <line x1={260} x2={980} y1={1300} y2={1300} stroke={ORO} strokeWidth={4} strokeDasharray="16 10" />
            <text x={270} y={1285} fontFamily={PRO} fontSize={26} fill={ORO}>mínimo de C1</text>
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M${300 + i * 75 - 12} ${1330 + (i % 2) * 18 - 12} l24 24 m0 -24 l-24 24`} stroke={ROJO} strokeWidth={5} transform={`scale(${latido(f, b2 + i * 2, 0.3, 8)})`} style={{ transformOrigin: `${300 + i * 75}px ${1330 + (i % 2) * 18}px` }} />
            ))}
          </g>
        )}
      </svg>
      <BancoCapa x={540} y={900} esc={0.62} gesto="frota" desde={b2 - 8} />
      {f >= b1 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", transform: `scale(${sp(f, b1 - 2, REBOTE)})` }}>
          <div style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>el ciclo</div>
          <div style={{ fontFamily: PRINCIPAL, fontSize: 150, color: ORO, lineHeight: 1 }}>CRT</div>
        </div>
      )}
      {f >= b2 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1380, textAlign: "center", transform: `scale(${sp(f, b2 - 2, REBOTE)})` }}>
          <span style={{ fontFamily: PRO, fontSize: 56, color: TINTA, background: ORO, borderRadius: 40, padding: "8px 32px", letterSpacing: 4 }}>LIQUIDITY</span>
          <div style={{ fontFamily: PRO, fontSize: 30, color: CREMA, marginTop: 14 }}>stops bajo el mínimo</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5 · bajamos a 1H: CHoCH y Order Block

const Hora: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 30, b2 = 60] = b;
  const a = iH("18:00");
  const velas = H1.slice(a, iH("22:00") + 1);
  const g = geometria(velas, MARCO, 20);
  const kOB = 0,
    kS = iH("19:00") - a,
    kC = iH("20:00") - a,
    kR = iH("22:00") - a;
  const entra = (k: number) => (k <= kS ? -60 : k === kC ? b1 - 10 : k === kR - 1 ? b2 - 22 : b2 - 14);
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
          <GraficoVelas velas={velas} marco={MARCO} entra={entra} forma={6} letra={20} tema={PAPEL} vivo={false} volumen={false} fechas={velas.map((v) => v.fecha)} />
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
          {f >= b2 - 20 && <Rotulo x={xOB + 130} y={yOBb + 30} desde={b2 - 20} tam={30} color="#7A5C2E">ORDER BLOCK</Rotulo>}
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
      <BancoCapa x={150} y={1170} esc={0.55} gesto="espera" desde={b2 - 8} />
      <Burbuja x={230} y={1060} desde={b2} texto="aquí compré yo" fondo="#2B2620" color={CREMA} />
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
  const a = iH("19:00");
  const reales = H1.slice(a, iH("14:00") + 1);
  const velas = [...reales, fantasma(4016, 4176)]; // solo amplía hasta SL y TP1: el TP2 va como flecha arriba
  const g = geometria(velas, MARCO, 20);
  const kR = iH("22:00") - a,
    kTP1 = iH("14:00") - a;
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
            {f >= b2 && <rect x={g.xVela(kR)} y={g.yPrecio(N5.tp1)} width={MARCO.x1 - 110 - g.xVela(kR)} height={g.yPrecio(N5.entrada) - g.yPrecio(N5.tp1)} fill={alfa(VERDE, 0.16 * pr(f, b2, 8))} />}
            {/* TP2 fuera del gráfico: flecha en el borde de arriba */}
            {f >= b3 - 2 && (
              <g opacity={pr(f, b3 - 2, 8)} transform={`translate(${MARCO.x1 - 170} ${MARCO.y0 + 6 - 10 * Math.sin(Math.max(0, f - b3) / 4)})`}>
                <path d="M0 40 L0 0 M-18 18 L0 0 L18 18" stroke="#3F7A47" strokeWidth={6} fill="none" strokeLinecap="round" />
              </g>
            )}
            {lineas.map((l) =>
              f >= l.d - 2 && l.p !== N5.tp2 ? <Nivel key={l.t} y={g.yPrecio(l.p)} x0={g.xVela(kR)} p={pr(f, l.d - 2, 10)} color={l.c === "#E8DCC0" ? "#6B6458" : l.c} texto={numeroES(l.p, 0)} guion={l.c !== ROJO} /> : null,
            )}
            {f >= tocaTP1 && <circle cx={g.xVela(kTP1)} cy={g.yPrecio(N5.tp1)} r={12 + 40 * pr(f, tocaTP1, 14)} fill="none" stroke={VERDE} strokeWidth={5} opacity={1 - pr(f, tocaTP1, 14)} />}
          </svg>
          {lineas.map((l) => (f >= l.d && l.p !== N5.tp2 ? <Rotulo key={l.t} x={g.xVela(kR) + 150} y={g.yPrecio(l.p) - 22} desde={l.d} tam={24} color={l.c === "#E8DCC0" ? TINTA : l.c === ROJO ? ROJO : "#3F7A47"}>{l.t}</Rotulo> : null))}
          {f >= b3 && <Rotulo x={MARCO.x0 + 230} y={MARCO.y0 + 24} desde={b3} tam={26} color="#3F7A47">TP2 ↑ 4.257,6 · ✓ 15 jun</Rotulo>}
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
      <BancoCapa x={920} y={760} esc={0.6} gesto="sorpresa" desde={b2 - 2} />
      {f >= b2 + 4 && <div style={{ position: "absolute", left: 60, top: 640, transform: `scale(${sp(f, b2 + 4, REBOTE)}) rotate(-10deg)`, fontFamily: PRINCIPAL, fontSize: 120, color: ROJO, textShadow: "4px 4px 0 #000" }}>K.O.</div>}
    </AbsoluteFill>
  );
};

export const pov: DefEscena = { C: Pov, momentos: 3, alInicio: () => true, sonidos: () => [[0, "clic", 0.55], [1, "cristal", 0.5], [1, "golpe", 0.35], [2, "subida", 0.3]] };
export const ciclo: DefEscena = { C: Ciclo, momentos: 3, alInicio: () => true, sonidos: () => [[1, "ding", 0.25], [2, "burbuja", 0.3]] };
export const hora: DefEscena = { C: Hora, momentos: 3, alInicio: () => true, sonidos: () => [[0, "whoosh", 0.3], [1, "tic", 0.3], [2, "ding", 0.3]] };
export const gestion: DefEscena = { C: Gestion, momentos: 4, alInicio: () => true, sonidos: () => [[0, "tic", 0.3], [1, "tic", 0.3], [2, "tic", 0.3], [3, "exito", 0.3]] };
export const rr: DefEscena = { C: Rr, momentos: 4, alInicio: () => true, sonidos: () => [[0, "tic", 0.25], [1, "subida", 0.3], [2, "exito", 0.35], [3, "golpe", 0.3]] };
export { DOJI };
