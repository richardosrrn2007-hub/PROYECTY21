// Vídeo 6 · Los 5 tipos de CRT (parte 3). Sin voz: todo se cuenta con texto en pantalla.
// Mismo mundo de la serie (planeta, dorado y crema). Diagramas didácticos: cada vela abre donde cerró la anterior
// y se forma recorriendo su camino real (bajista: apertura → máximo → mínimo → cierre; alcista: al revés),
// así el barrido se ve pasar por fuera del rango de C1 antes de cerrar dentro.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { alfa } from "../motor/estilos";
import type { DefEscena, PropsEscena } from "../tipos";
import { txt } from "../escenas/util";
import { CREMA, TINTA, cl, latido } from "./Doji";
import { Chispas, Halo, ORO, PRINCIPAL, PRO, REBOTE, ROJO, SECUND, VERDE, Trazo, pr, sp, temblor } from "./mg";

type V = { o: number; h: number; l: number; c: number };
type Tipo = {
  num: string;
  nombre: string;
  velas: V[];
  /** índice de la vela que barre */
  barre: number;
  lado: "max" | "min";
  /** textos de abajo: rango, barrido, distribución */
  fases: [string, string, string];
  chip?: string;
};

// Precios en una escala 0–120 (el rango de C1 va de 20 a 100).
const C1_ALCISTA: V = { o: 26, h: 100, l: 20, c: 92 };
export const TIPOS: Record<string, Tipo> = {
  "1": {
    num: "01",
    nombre: "Clásico · 3 velas",
    velas: [{ o: 94, h: 100, l: 20, c: 26 }, { o: 26, h: 32, l: 11, c: 31 }, { o: 31, h: 100, l: 28, c: 95 }],
    barre: 1,
    lado: "min",
    fases: ["C1 marca el rango", "C2 barre el mínimo y cierra dentro", "C3 va al otro extremo"],
  },
  "2": {
    num: "02",
    nombre: "Distribución lenta",
    velas: [C1_ALCISTA, { o: 92, h: 108, l: 84, c: 86 }, { o: 86, h: 89, l: 58, c: 62 }, { o: 62, h: 65, l: 20, c: 26 }],
    barre: 1,
    lado: "max",
    fases: ["C1 marca el rango", "C2 barre el máximo", "la caída tarda varias velas"],
  },
  "3": {
    num: "03",
    nombre: "2 velas",
    velas: [C1_ALCISTA, { o: 92, h: 109, l: 20, c: 27 }],
    barre: 1,
    lado: "max",
    fases: ["C1 marca el rango", "C2 barre el máximo…", "…y cae en la misma vela"],
  },
  "4": {
    num: "04",
    nombre: "Inside bar",
    velas: [C1_ALCISTA, { o: 92, h: 96, l: 82, c: 85 }, { o: 85, h: 97, l: 80, c: 93 }, { o: 93, h: 108, l: 20, c: 25 }],
    barre: 3,
    lado: "max",
    fases: ["C1 marca el rango", "1–2 velas dentro del rango", "barre el máximo y cae"],
  },
  "5": {
    num: "05",
    nombre: "Varias inside bars",
    velas: [C1_ALCISTA, { o: 92, h: 95, l: 84, c: 86 }, { o: 86, h: 91, l: 81, c: 88 }, { o: 88, h: 90, l: 80, c: 83 }, { o: 83, h: 108, l: 79, c: 81 }, { o: 81, h: 84, l: 20, c: 25 }],
    barre: 4,
    lado: "max",
    fases: ["C1 marca el rango", "el rango aguanta varias velas", "barrido y caída"],
    chip: "más lento · más probabilidad",
  },
};

// ---------------------------------------------------------------- vela que se forma recorriendo su camino

/** Camino del precio dentro de la vela: bajista o → h → l → c; alcista o → l → h → c. */
const camino = (v: V) => (v.c < v.o ? [v.o, v.h, v.l, v.c] : [v.o, v.l, v.h, v.c]);
/** Fracción del tiempo de la vela en que llega a su extremo `lado` (para sincronizar el destello del barrido). */
const hastaExtremo = (v: V, lado: "max" | "min") => {
  const p = camino(v);
  const seg = [Math.abs(p[1] - p[0]), Math.abs(p[2] - p[1]), Math.abs(p[3] - p[2])];
  const tot = seg[0] + seg[1] + seg[2] || 1;
  const objetivo = lado === "max" ? v.h : v.l;
  return p[1] === objetivo ? seg[0] / tot : (seg[0] + seg[1]) / tot;
};
/** Estado de la vela en t ∈ [0, 1]. */
const formada = (v: V, t: number): V => {
  if (t >= 1) return v;
  const p = camino(v);
  const seg = [Math.abs(p[1] - p[0]), Math.abs(p[2] - p[1]), Math.abs(p[3] - p[2])];
  const tot = seg[0] + seg[1] + seg[2] || 1;
  let d = t * tot,
    precio = p[0];
  let h = v.o,
    l = v.o;
  for (let i = 0; i < 3; i++) {
    const k = Math.min(1, d / (seg[i] || 1));
    precio = p[i] + (p[i + 1] - p[i]) * k;
    h = Math.max(h, precio);
    l = Math.min(l, precio);
    d -= seg[i];
    if (d <= 0) break;
  }
  return { o: v.o, h, l, c: precio };
};

type Area = { x: number; y: number; w: number; h: number };
const geo = (a: Area, n: number) => {
  const pMin = 2,
    pMax = 118;
  const yP = (p: number) => a.y + ((pMax - p) / (pMax - pMin)) * a.h;
  const paso = Math.min(150, (a.w * 0.72) / Math.max(n, 3));
  const x0 = a.x + paso * 0.7;
  const xV = (k: number) => x0 + k * paso;
  return { yP, xV, paso, ancho: Math.min(84, paso * 0.58) };
};

const Vela: React.FC<{ v: V; x: number; yP: (p: number) => number; ancho: number; grosor?: number }> = ({ v, x, yP, ancho, grosor = 6 }) => {
  const alza = v.c >= v.o;
  const top = yP(Math.max(v.o, v.c)),
    bot = yP(Math.min(v.o, v.c));
  return (
    <g>
      <line x1={x} x2={x} y1={yP(v.h)} y2={yP(v.l)} stroke={CREMA} strokeWidth={grosor + 1} strokeLinecap="round" />
      <rect x={x - ancho / 2} y={top} width={ancho} height={Math.max(grosor + 2, bot - top)} rx={4} fill={alza ? CREMA : "#000"} stroke={CREMA} strokeWidth={grosor} />
    </g>
  );
};

/** Calendario de un tipo: cuándo entra cada vela y cuánto tarda, con el barrido cayendo justo en `b1` y la última vela terminando en `b2`. */
const calendario = (T: Tipo, b1: number, b2: number) => {
  const n = T.velas.length;
  const ent: { desde: number; dur: number }[] = [{ desde: 2, dur: 12 }];
  const sw = T.velas[T.barre];
  const ultimaEsBarrido = T.barre === n - 1;
  const tH = hastaExtremo(sw, T.lado);
  let dSw = 22,
    sSw = Math.round(b1 - tH * dSw);
  if (ultimaEsBarrido) {
    // la misma vela barre y distribuye: termina en b2
    sSw = Math.round((b1 - tH * b2) / (1 - tH));
    dSw = b2 - sSw;
  }
  const medias = T.barre - 1;
  const paso = medias > 0 ? Math.min(12, (sSw - 2 - 26) / medias) : 0;
  for (let k = 0; k < medias; k++) ent.push({ desde: Math.round(26 + k * paso), dur: Math.max(6, Math.round(paso)) });
  ent.push({ desde: sSw, dur: dSw });
  const resto = n - 1 - T.barre;
  const ini = sSw + dSw + 2;
  for (let k = 0; k < resto; k++) {
    const d = (b2 - ini) / resto;
    ent.push({ desde: Math.round(ini + k * d), dur: Math.max(6, Math.round(d)) });
  }
  return { ent, sSw, finSw: sSw + dSw };
};

/** Diagrama completo de un tipo: velas, rango punteado de C1, flecha al barrido, destello y objetivo. */
const Diagrama: React.FC<{ T: Tipo; a: Area; b1: number; b2: number; desde?: number; etiquetas?: boolean; grosor?: number; quieto?: boolean }> = ({ T, a, b1, b2, desde = 0, etiquetas = true, grosor = 6, quieto = false }) => {
  const f0 = useCurrentFrame();
  const f = quieto ? 1e6 : f0 - desde;
  const g = geo(a, T.velas.length);
  const { ent } = calendario(T, b1, b2);
  const c1 = T.velas[0];
  const xRango1 = a.x + a.w;
  const lineas = pr(f, 10, 14);
  const ext = T.lado === "max" ? c1.h : c1.l;
  const obj = T.lado === "max" ? c1.l : c1.h;
  const yExt = g.yP(ext),
    yObj = g.yP(obj);
  const xs = g.xV(T.barre);
  const sw = T.velas[T.barre];
  const yPunta = g.yP(T.lado === "max" ? sw.h : sw.l);
  const sgn = T.lado === "max" ? -1 : 1;
  const flecha = pr(f, b1 - 16, 14, Easing.inOut(Easing.cubic));
  const objetivo = f >= b2;
  const brillo = objetivo ? latido(f, b2, 1, 16) - 1 : 0;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* rango de C1: máximo y mínimo punteados hacia la derecha */}
        {[c1.h, c1.l].map((p) => (
          <Trazo key={p} d={`M${g.xV(0)} ${g.yP(p)} L${xRango1} ${g.yP(p)}`} p={lineas} color={p === obj && objetivo ? ORO : alfa(ORO, 0.75)} grosor={p === obj && objetivo ? grosor * 0.8 + 2 * brillo : grosor * 0.6} guion />
        ))}
        {T.velas.map((v, k) => {
          const e = ent[k];
          if (f < e.desde) return null;
          const t = interpolate(f, [e.desde, e.desde + Math.max(1, e.dur)], [0, 1], { ...cl, easing: k === T.barre ? Easing.linear : Easing.inOut(Easing.cubic) });
          return <Vela key={k} v={formada(v, t)} x={g.xV(k)} yP={g.yP} ancho={g.ancho} grosor={grosor} />;
        })}
        {/* flecha curva hacia el barrido */}
        {flecha > 0 && (
          <g opacity={1 - pr(f, b2 + 6, 10)}>
            <Trazo d={`M${xs + 200} ${yPunta + sgn * 120} Q${xs + 160} ${yPunta + sgn * 14} ${xs + 22} ${yPunta + sgn * 6}`} p={flecha} color={ORO} grosor={grosor * 0.9} />
            {flecha >= 1 && <path d={`M${xs + 46} ${yPunta + sgn * 22} L${xs + 20} ${yPunta + sgn * 6} L${xs + 48} ${yPunta - sgn * 10}`} fill="none" stroke={ORO} strokeWidth={grosor * 0.9} strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        )}
        {f >= b1 && <circle cx={xs} cy={yExt} r={14 + 46 * pr(f, b1, 14)} fill="none" stroke={ORO} strokeWidth={grosor * 0.8} opacity={1 - pr(f, b1, 14)} />}
      </svg>
      {etiquetas && (
        <>
          {f >= 4 && <Rot x={g.xV(0)} y={g.yP(c1.l) + 46} desde={desde + 4} color={CREMA}>C1</Rot>}
          {f >= b1 && (
            <Rot x={xs} y={yExt + sgn * 92} desde={desde + b1} color={ORO} caja>
              barrido
            </Rot>
          )}
          {objetivo && (
            <Rot x={xRango1 - 110} y={yObj + (T.lado === "max" ? 50 : -50)} desde={desde + b2} color={VERDE}>
              objetivo ✓
            </Rot>
          )}
        </>
      )}
      {!quieto && <Chispas desde={desde + b1} x={xs} y={yExt} n={14} r={160} color={ORO} />}
    </>
  );
};

const Rot: React.FC<{ x: number; y: number; desde: number; color: string; caja?: boolean; tam?: number; children: React.ReactNode }> = ({ x, y, desde, color, caja = false, tam = 36, children }) => {
  const f = useCurrentFrame();
  const e = sp(f, desde, REBOTE);
  if (e <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${e})`, fontFamily: PRO, fontSize: tam, color: caja ? TINTA : color, background: caja ? color : "transparent", borderRadius: 12, padding: caja ? "4px 16px" : 0, whiteSpace: "nowrap", letterSpacing: 1 }}>
      {children}
    </div>
  );
};

/** Texto de abajo que cambia en cada fase (entra con rebote, el anterior sale hacia arriba). */
const Fases: React.FC<{ fases: string[]; en: number[]; y?: number }> = ({ fases, en, y = 1150 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {fases.map((t, i) => {
        const a = en[i],
          z = en[i + 1] ?? 1e9;
        if (f < a || f >= z) return null;
        const e = sp(f, a, REBOTE);
        const sale = pr(f, z - 5, 5);
        return (
          <div key={i} style={{ position: "absolute", left: 40, right: 40, top: y - 40 * sale, textAlign: "center", opacity: 1 - sale, transform: `scale(${0.6 + 0.4 * e})` }}>
            <span style={{ fontFamily: SECUND, fontSize: 60, color: CREMA, lineHeight: 1.1 }}>{t}</span>
          </div>
        );
      })}
    </>
  );
};

const Cabecera: React.FC<{ num: string; nombre: string }> = ({ num, nombre }) => {
  const f = useCurrentFrame();
  const e = sp(f, 0, REBOTE);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center" }}>
      <div style={{ display: "inline-block", transform: `scale(${e})` }}>
        <span style={{ fontFamily: SECUND, fontSize: 64, color: CREMA }}>tipo </span>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 140, color: ORO, lineHeight: 1 }}>{num}</span>
      </div>
      <div style={{ fontFamily: PRO, fontSize: 46, color: alfa(CREMA, 0.85), marginTop: 6, opacity: pr(f, 6, 10), transform: `translateY(${(1 - pr(f, 6, 10)) * 20}px)`, letterSpacing: 2 }}>{nombre}</div>
    </div>
  );
};

// ---------------------------------------------------------------- escenas

const AREA: Area = { x: 150, y: 290, w: 830, h: 760 };

const TipoCrt: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const T = TIPOS[txt(p, "n", "1")];
  const [, b1 = 40, b2 = 70] = b;
  const { finSw } = calendario(T, b1, b2);
  const zoom = 1 + 0.05 * pr(f, 0, dur, Easing.inOut(Easing.sin));
  const t = temblor(f, b1, 12, 10);
  const cap3 = T.barre === T.velas.length - 1 ? b1 + 10 : finSw + 2;
  return (
    <AbsoluteFill>
      <Halo x={540} y={660} r={480} op={0.16} />
      <Cabecera num={T.num} nombre={T.nombre} />
      <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${zoom})`, transformOrigin: "540px 660px" }}>
        <Diagrama T={T} a={AREA} b1={b1} b2={b2} />
      </AbsoluteFill>
      <Fases fases={T.fases} en={[4, b1 - 4, cap3]} />
      {T.chip && f >= b2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", transform: `scale(${sp(f, b2, REBOTE)})` }}>
          <span style={{ fontFamily: PRO, fontSize: 40, color: TINTA, background: ORO, borderRadius: 40, padding: "8px 28px", letterSpacing: 2 }}>{T.chip}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Gancho: las 3 velas de siempre → tachón rojo → «No siempre.» */
const Gancho3: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [, b1 = 34, b2 = 52] = b;
  const velas: V[] = [{ o: 30, h: 100, l: 22, c: 92 }, { o: 92, h: 104, l: 84, c: 88 }, { o: 88, h: 94, l: 18, c: 26 }];
  const a: Area = { x: 210, y: 360, w: 760, h: 640 };
  const g = geo(a, 3);
  const t = temblor(f, b1, 22, 14);
  const x1 = pr(f, b1 - 4, 6, Easing.out(Easing.cubic)),
    x2 = pr(f, b1, 6, Easing.out(Easing.cubic));
  const zoom = 1 + 0.04 * pr(f, 0, 70, Easing.inOut(Easing.sin));
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
      <Halo x={540} y={680} r={460} op={0.2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", transform: `scale(${0.7 + 0.3 * sp(f, 0, REBOTE)})` }}>
        <span style={{ fontFamily: SECUND, fontSize: 76, color: CREMA }}>¿CRT = </span>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 108, color: ORO }}>3 velas?</span>
      </div>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 680px" }}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {velas.map((v, k) => {
            const e = k === 0 ? 0.55 + 0.45 * sp(f, 0, REBOTE) : sp(f, 4 + k * 6, REBOTE);
            if (e <= 0) return null;
            const x = g.xV(k);
            return (
              <g key={k} transform={`translate(${x} 680) scale(${e}) translate(${-x} -680)`}>
                <Vela v={v} x={x} yP={g.yP} ancho={g.ancho} grosor={8} />
              </g>
            );
          })}
          {/* tachón: dos trazos rojos */}
          <Trazo d="M230 380 L890 1000" p={x1} color={ROJO} grosor={40} />
          <Trazo d="M890 380 L230 1000" p={x2} color={ROJO} grosor={40} />
        </svg>
        {["C1", "C2", "C3"].map((c, k) => (
          <Rot key={c} x={g.xV(k)} y={1050} desde={6 + k * 6} color={CREMA}>
            {c}
          </Rot>
        ))}
      </AbsoluteFill>
      {f >= b2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", transform: `scale(${sp(f, b2, REBOTE)}) rotate(-3deg)` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 104, color: TINTA, background: ORO, borderRadius: 18, padding: "6px 34px" }}>No siempre.</span>
        </div>
      )}
      <AbsoluteFill style={{ background: ROJO, opacity: interpolate(f, [b1, b1 + 1, b1 + 6], [0, 0.35, 0], cl), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/** «5 tipos de CRT»: el 5 gigante y los cinco números saltando debajo. */
const Cinco: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [, b1 = 14] = b;
  return (
    <AbsoluteFill>
      <Halo x={540} y={560} r={520} op={0.26} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", transform: `scale(${sp(f, 0, REBOTE)}) rotate(${(1 - pr(f, 0, 14)) * -8}deg)` }}>
        <div style={{ fontFamily: PRINCIPAL, fontSize: 560, color: ORO, lineHeight: 0.9, textShadow: `0 0 80px ${alfa(ORO, 0.45)}` }}>5</div>
        <div style={{ fontFamily: SECUND, fontSize: 96, color: CREMA, marginTop: 10 }}>tipos de CRT</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", gap: 26 }}>
        {["01", "02", "03", "04", "05"].map((n, k) => {
          const e = sp(f, b1 + k * 4, REBOTE);
          return (
            <div key={n} style={{ width: 150, height: 110, borderRadius: 20, border: `4px solid ${ORO}`, background: "#0E0C0A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PRINCIPAL, fontSize: 64, color: ORO, transform: `scale(${e}) translateY(${(1 - e) * 60}px)` }}>
              {n}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Resumen: los 5 tipos en tarjetas, ya dibujados, que entran uno tras otro (para guardarlo). */
const Resumen: React.FC<PropsEscena> = () => {
  const f = useCurrentFrame();
  const W = 440,
    H = 340;
  const pos = [
    [80, 130],
    [560, 130],
    [80, 500],
    [560, 500],
    [320, 870],
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: -10, textAlign: "center", transform: `scale(${sp(f, 0, REBOTE)})` }}>
        <span style={{ fontFamily: SECUND, fontSize: 70, color: CREMA }}>los </span>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 110, color: ORO }}>5 tipos</span>
      </div>
      {Object.values(TIPOS).map((T, k) => {
        const [x, y] = pos[k];
        const desde = 4 + k * 7;
        const e = sp(f, desde, REBOTE);
        if (e <= 0) return null;
        const foco = f >= desde + 6 && f < desde + 20;
        return (
          <div key={T.num} style={{ position: "absolute", left: x, top: y, width: W, height: H, transform: `scale(${e * (foco ? 1.04 : 1)})`, borderRadius: 24, border: `3px solid ${foco ? ORO : alfa(ORO, 0.45)}`, background: alfa("#0E0C0A", 0.92), overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 22, top: 14, fontFamily: PRINCIPAL, fontSize: 52, color: ORO }}>{T.num}</div>
            <div style={{ position: "absolute", left: 100, top: 30, fontFamily: PRO, fontSize: 28, color: CREMA }}>{T.nombre}</div>
            <AbsoluteFill style={{ transform: `translate(${-x}px, ${-y}px)` }}>
              <Diagrama T={T} a={{ x: x + 14, y: y + 90, w: W - 50, h: H - 120 }} b1={60} b2={100} etiquetas={false} grosor={3.5} quieto />
            </AbsoluteFill>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Llamada final: Serie CRT · Guárdalo y sígueme. */
const Guarda: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [, b1 = 12] = b;
  const salto = Math.abs(Math.sin(f / 7)) * 18;
  return (
    <AbsoluteFill>
      <Halo x={540} y={600} r={480} op={0.22} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 280, textAlign: "center", transform: `scale(${sp(f, 0, REBOTE)})` }}>
        <div style={{ fontFamily: SECUND, fontSize: 80, color: CREMA }}>serie</div>
        <div style={{ fontFamily: PRINCIPAL, fontSize: 210, color: ORO, lineHeight: 1 }}>CRT</div>
      </div>
      {/* marcador (guardar) que salta */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`translate(540 ${760 - salto}) scale(${sp(f, 4, REBOTE)})`}>
          <path d="M-50 -70 H50 V70 L0 32 L-50 70 Z" fill={ORO} stroke={CREMA} strokeWidth={5} strokeLinejoin="round" />
        </g>
      </svg>
      {f >= b1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 920, textAlign: "center", transform: `scale(${sp(f, b1, REBOTE)})` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 74, whiteSpace: "nowrap", color: TINTA, background: ORO, borderRadius: 18, padding: "8px 36px" }}>Guárdalo y sígueme</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const tipoCrt: DefEscena = { C: TipoCrt, momentos: 3, alInicio: () => true, sonidos: () => [[0, "swoosh", 0.3], [1, "golpe", 0.4], [2, "ding", 0.3]] };
export const gancho3: DefEscena = { C: Gancho3, momentos: 3, alInicio: () => true, sonidos: () => [[1, "golpe", 0.5], [1, "negacion", 0.3], [2, "sello", 0.35]] };
export const cinco: DefEscena = { C: Cinco, momentos: 2, alInicio: () => true, sonidos: () => [[0, "gong", 0.3], [1, "tic", 0.25]] };
export const resumen: DefEscena = { C: Resumen, momentos: 1, alInicio: () => true, sonidos: () => [[0, "swoosh", 0.3]] };
export const guarda: DefEscena = { C: Guarda, momentos: 2, alInicio: () => true, sonidos: () => [[1, "pop", 0.35]] };
