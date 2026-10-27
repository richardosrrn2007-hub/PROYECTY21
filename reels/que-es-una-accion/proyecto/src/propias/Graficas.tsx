// Gráficas de precio (se mueve, sube, baja, velas), ganar/perder, comisiones y el cierre.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { numeroES, rnd } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { txt } from "../escenas/util";
import { Icono } from "../piezas/basicas";
import { GraficoVelas, Nota, geometria, serieVelas } from "./Velas";
import { Escritorio } from "./Escritorio";
import { Caja, Chispas, Cuenta, Etiqueta, Halo, ORO, ROJO, Rejilla, Revela as Revela2, Trazo, VERDE, fuenteTitulo, pr, sp, temblor } from "./mg";

const X0 = 120,
  X1 = 960,
  Y0 = 330,
  Y1 = 1010;

const Ejes: React.FC<{ p: number }> = ({ p }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
    {[0.25, 0.5, 0.75].map((k) => (
      <line key={k} x1={X0} x2={X0 + (X1 - X0) * p} y1={Y0 + (Y1 - Y0) * k} y2={Y0 + (Y1 - Y0) * k} stroke={C.linea} strokeWidth={2} strokeDasharray="6 10" />
    ))}
    <Trazo d={`M${X0} ${Y0} L${X0} ${Y1} L${X1} ${Y1}`} p={p} grosor={4} color={C.suave} />
  </svg>
);

/** Polilínea a partir de puntos. */
const linea = (pts: [number, number][]) => pts.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

/** Puntos de un precio con ruido entre (xa,ya) y (xb,yb). */
const tramo = (xa: number, ya: number, xb: number, yb: number, n: number, ruido: number, semilla: number): [number, number][] =>
  Array.from({ length: n + 1 }).map((_, k) => {
    const t = k / n;
    const r = k === 0 || k === n ? 0 : (rnd(k * 3.1 + semilla) - 0.5) * ruido;
    return [xa + (xb - xa) * t, ya + (yb - ya) * t + r];
  });

/** Punto a lo largo de una polilínea (0→1). */
const enLinea = (pts: [number, number][], t: number): [number, number] => {
  const i = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1)));
  const u = t * (pts.length - 1) - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u];
};

const Cabeza: React.FC<{ x: number; y: number; color: string; valor?: string }> = ({ x, y, color, valor }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: 30, background: alfa(color, 0.25 + 0.15 * Math.sin(f / 3)) }} />
      <div style={{ position: "absolute", left: x - 13, top: y - 13, width: 26, height: 26, borderRadius: 13, background: color, boxShadow: `0 0 30px ${color}` }} />
      {valor && <div style={{ position: "absolute", left: x > 700 ? x - 26 : x + 26, transform: x > 700 ? "translateX(-100%)" : undefined, top: y - 64, background: color, color: C.acentoTexto, fontFamily: F.texto, fontWeight: 800, fontSize: 30, padding: "6px 14px", borderRadius: 10, fontVariantNumeric: "tabular-nums" }}>{valor}</div>}
    </>
  );
};

const Marcador: React.FC<{ x: number; y: number; desde: number; texto: string; color: string; arriba?: boolean }> = ({ x, y, desde, texto, color, arriba = false }) => {
  const f = useCurrentFrame();
  const k = sp(f, desde);
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, ${arriba ? "-100%" : "0"}) scale(${k})`, transformOrigin: arriba ? "50% 100%" : "50% 0", display: "flex", flexDirection: arriba ? "column-reverse" : "column", alignItems: "center", gap: 6 }}>
      <div style={{ width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", [arriba ? "borderTop" : "borderBottom"]: `26px solid ${color}` }} />
      <div style={{ background: color, color: C.acentoTexto, fontFamily: F.texto, fontWeight: 800, fontSize: 28, letterSpacing: 3, padding: "6px 14px", borderRadius: 10 }}>{texto}</div>
    </div>
  );
};

// ---------------------------------------------------------------- precio

const Precio: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const modo = txt(p, "modo", "mueve");
  const ejes = modo === "mueve" ? pr(f, b[0] - 4, 14) : 1;

  if (modo === "mueve") {
    const [b0, b1, b2, b3, b4] = b;
    const pts = [...tramo(X0 + 20, 700, 380, 560, 8, 70, 1), ...tramo(380, 560, 640, 820, 8, 80, 2).slice(1), ...tramo(640, 820, X1 - 30, 470, 10, 90, 3).slice(1)];
    const t = pr(f, b3 - 4, Math.max(20, dur - b3), Easing.inOut(Easing.sin));
    const vis = pts.slice(0, Math.max(2, Math.ceil(t * (pts.length - 1)) + 1));
    const [hx, hy] = enLinea(pts, t);
    vis[vis.length - 1] = [hx, hy];
    const g = temblor(f, b4, 8);
    const valor = 228 + (700 - hy) / 10;
    return (
      <AbsoluteFill style={{ transform: `translate(${g.x}px,${g.y}px)` }}>
        <Rejilla op={0.6} />
        <Ejes p={ejes} />
        <Etiqueta desde={b0} x={X0} y={250} texto="AAPL" centro={false} tam={28} />
        <Caja x={540} y={285} desde={b1 - 2} color={VERDE} tam={30}>
          <Icono nombre="arrow-up" tam={36} color={VERDE} /> PAGAR
        </Caja>
        <Caja x={820} y={285} desde={b2 - 2} color={ROJO} tam={30}>
          <Icono nombre="arrow-down" tam={36} color={ROJO} /> ACEPTAR
        </Caja>
        {f >= b3 - 4 && (
          <>
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              <path d={linea(vis)} fill="none" stroke={ORO} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <Cabeza x={hx} y={hy} color={ORO} valor={numeroES(valor, 2)} />
          </>
        )}
      </AbsoluteFill>
    );
  }

  if (modo === "sube" || modo === "baja") {
    const sube = modo === "sube";
    const col = sube ? VERDE : ROJO;
    const yE = sube ? 820 : 520;
    const xE = 420;
    const previo = tramo(X0 + 20, sube ? 860 : 600, xE, yE, 6, 50, sube ? 4 : 5);
    const nuevo = tramo(xE, yE, X1 - 40, sube ? 400 : 930, 12, 70, sube ? 6 : 7);
    const [bA, bLinea, bC, bD, bE] = sube ? [b[0], b[1], b[2], b[3], -1] : [b[0], b[1], b[2], b[3], b[4]];
    const t = pr(f, bLinea - 4, Math.max(16, (bD ?? bLinea + 30) - bLinea + 10), Easing.inOut(Easing.sin));
    const vis = nuevo.slice(0, Math.max(2, Math.ceil(t * (nuevo.length - 1)) + 1));
    const [hx, hy] = enLinea(nuevo, t);
    vis[vis.length - 1] = [hx, hy];
    const area = `${linea(vis)} L${hx} ${yE} L${xE} ${yE} Z`;
    const entrada = sube ? pr(f, bA - 2, 10) : 1;
    const flash = !sube ? Math.max(0, 1 - Math.abs(f - bA) / 10) : 0;
    const vineta = !sube && bE >= 0 ? 0.5 * Math.max(0, Math.sin(Math.min(Math.PI, ((f - bE) / 24) * Math.PI))) * (f >= bE ? 1 : 0) : 0;
    const g = temblor(f, sube ? bD : bE, sube ? 8 : 14);
    return (
      <AbsoluteFill style={{ transform: `translate(${g.x}px,${g.y}px)` }}>
        <Rejilla op={0.6} color={sube ? ORO : ROJO} />
        <Ejes p={1} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <linearGradient id={`g${modo}`} x1="0" y1={sube ? "1" : "0"} x2="0" y2={sube ? "0" : "1"}>
              <stop offset="0" stopColor={col} stopOpacity={0} />
              <stop offset="1" stopColor={col} stopOpacity={0.45} />
            </linearGradient>
          </defs>
          <path d={linea(previo)} fill="none" stroke={C.suave} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
          {f >= bLinea - 4 && <path d={area} fill={`url(#g${modo})`} opacity={sube ? 1 : pr(f, bC - 2, 10)} />}
          <line x1={X0} x2={X0 + (X1 - X0) * entrada} y1={yE} y2={yE} stroke={alfa(C.texto, 0.6)} strokeWidth={3} strokeDasharray="10 10" />
          {f >= bLinea - 4 && <path d={linea(vis)} fill="none" stroke={col} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />}
        </svg>
        <Marcador x={xE} y={yE + 24} desde={sube ? bA - 2 : -30} texto={sube ? "COMPRAS" : "TU COMPRA"} color={ORO} />
        {f >= bLinea - 4 && <Cabeza x={hx} y={hy} color={col} />}
        {f >= bC - 2 && (
          <div style={{ position: "absolute", left: sube ? 140 : 560, top: sube ? 330 : 330, transform: `scale(${sp(f, bC - 2)})`, transformOrigin: "0 0", display: "flex", alignItems: "center", gap: 16 }}>
            <Icono nombre={sube ? "trending-up" : "trending-down"} tam={90} color={col} />
            <Cuenta desde={bC - 2} dur={20} de={0} a={sube ? 24 : -18} sufijo=" %" signo tam={110} color={col} />
          </div>
        )}
        {sube && <Chispas desde={bD} x={hx} y={hy} n={16} r={200} color={VERDE} />}
        {sube && <Etiqueta desde={bD - 2} x={540} y={1050} texto="TU ACCIÓN VALE MÁS" color={VERDE} />}
        {!sube && (
          <>
            {f >= bA - 2 && (
              <div style={{ position: "absolute", left: 540, top: 270, transform: `translate(-50%,-50%) scale(${sp(f, bA - 2, { damping: 8, stiffness: 220, mass: 0.6 })}) rotate(${Math.sin(f / 2) * (f < bA + 12 ? 8 : 0)}deg)` }}>
                <Icono nombre="triangle-alert" tam={110} color={ORO} />
              </div>
            )}
            <Etiqueta desde={bD - 2} x={540} y={1050} texto="PIERDE VALOR" color={ROJO} />
            <AbsoluteFill style={{ top: -400, bottom: -400, background: `radial-gradient(ellipse at center, transparent 45%, ${alfa(ROJO, vineta)} 100%)` }} />
            <AbsoluteFill style={{ top: -400, bottom: -400, background: alfa(ORO, 0.18 * flash) }} />
          </>
        )}
      </AbsoluteFill>
    );
  }

  // velas: el gráfico se ve en un monitor de cristal y el personaje lo analiza
  const [b0, b1, b2, b3, b4] = b;
  const n = 40;
  const velas = serieVelas(n, 21, (k) => (k < 12 ? -0.7 : k < 28 ? 0.85 : -0.5), 228, 1.5);
  const marco = { x0: 110, x1: 990, y0: 320, y1: 850 };
  const LT = 20;
  const g = geometria(velas, marco, LT);
  const entra = (k: number) => (k < 16 ? -60 : (k - 16) * 1.3);
  let iMin = 0;
  velas.forEach((v, k) => (k < 20 && v.l < velas[iMin].l ? (iMin = k) : null));
  let iMax = iMin + 1;
  velas.forEach((v, k) => (k > iMin && k < 32 && v.h > velas[iMax].h ? (iMax = k) : null));
  const xa = g.xVela(iMin),
    ya = g.yPrecio(velas[iMin].l);
  const xb = g.xVela(iMax),
    yb = g.yPrecio(velas[iMax].h);
  const banda = pr(f, b2 - 2, 12);
  const arcoP = pr(f, b3 - 2, 16, Easing.inOut(Easing.cubic));
  const zoom = 1 + 0.12 * pr(f, b4 - 4, 20, Easing.inOut(Easing.cubic));
  return (
    <Escritorio
      dur={dur}
      cabecera="AAPL · APPLE · 15M · EJEMPLO"
      cursor={[
        [0, g.xVela(20), g.yPrecio(velas[20].c) - 40],
        [b0 - 6, xa + 10, ya + 6],
        [b1 - 6, xb + 10, yb - 6],
        [b3 - 2, xa + 30, ya - 20],
        [b3 + 14, xb - 30, yb + 30],
        [b4 - 4, g.xVela(n - 1) + 12, g.yPrecio(velas[n - 1].c)],
      ]}
      clics={[b0 - 2, b1 - 2, b4]}
      asiente={[b0, b1, b3]}
    >
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "900px 560px" }}>
        {banda > 0 && <div style={{ position: "absolute", left: xa, top: yb, width: (xb - xa) * banda, height: ya - yb, background: `linear-gradient(90deg, ${alfa(VERDE, 0.1)}, ${alfa(ORO, 0.14)})`, borderLeft: `2px solid ${alfa(VERDE, 0.6)}`, borderRight: banda > 0.95 ? `2px solid ${alfa(ROJO, 0.6)}` : undefined }} />}
        <GraficoVelas velas={velas} marco={marco} entra={entra} forma={6} letra={LT} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <Trazo d={`M${xa} ${ya + 40} C${xa + 60} ${ya + 40}, ${xb - 120} ${yb - 60}, ${xb} ${yb - 30}`} p={arcoP} grosor={4} color={ORO} />
        </svg>
        <Nota x={xa} y={ya + 8} dx={-50} dy={60} texto="comprar" desde={b0 - 2} color={VERDE} />
        <Nota x={xb} y={yb - 8} dx={70} dy={-22} texto="vender" desde={b1 - 2} color={ROJO} />
        {f >= b3 + 6 && (
          <div style={{ position: "absolute", left: (xa + xb) / 2 - 40, top: (ya + yb) / 2 - 10, fontFamily: F.mano, fontSize: 60, color: ORO, transform: `rotate(-12deg) scale(${sp(f, b3 + 6)})`, whiteSpace: "nowrap" }}>el movimiento</div>
        )}
      </AbsoluteFill>
    </Escritorio>
  );
};

export const precioDef: DefEscena = {
  C: Precio,
  momentos: (p) => ({ mueve: 5, sube: 4, baja: 5, velas: 5 })[txt(p, "modo", "mueve")] ?? 5,
  alInicio: (p) => txt(p, "modo", "mueve") !== "mueve",
  sonidos: (p) => {
    const m = txt(p, "modo", "mueve");
    if (m === "mueve") return [[1, "tic", 0.25], [2, "tic", 0.25], [3, "whoosh", 0.25]];
    if (m === "sube") return [[0, "clic", 0.3], [1, "subida", 0.32], [3, "exito", 0.25]];
    if (m === "baja") return [[0, "campana", 0.2], [1, "puff", 0.3], [4, "golpe", 0.35]];
    return [[0, "tecla", 0.25], [1, "tecla", 0.25], [2, "pop", 0.3], [3, "swoosh", 0.25], [4, "ding", 0.25]];
  },
};

// ---------------------------------------------------------------- ganar / perder

const GanarPerder: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0, b1, b2, b3, b4, b5] = b;
  const yC = 660,
    xC = 200;
  const arriba = tramo(xC, yC, X1 - 50, 400, 10, 50, 11);
  const abajo = tramo(xC, yC, X1 - 50, 920, 10, 50, 12);
  const dibuja = (pts: [number, number][], t: number) => {
    const vis = pts.slice(0, Math.max(2, Math.ceil(t * (pts.length - 1)) + 1));
    const h = enLinea(pts, t);
    vis[vis.length - 1] = h;
    return { d: linea(vis), h, area: `${linea(vis)} L${h[0]} ${yC} L${xC} ${yC} Z` };
  };
  const tA = pr(f, b1 - 4, Math.max(14, b3 - b1), Easing.inOut(Easing.sin));
  const tB = pr(f, b4 - 4, Math.max(14, b5 - b4 + 6), Easing.inOut(Easing.sin));
  const A = dibuja(arriba, tA),
    B = dibuja(abajo, tB);
  const pulso = f >= b2 ? 1 + 0.4 * Math.max(0, Math.sin(((f - b2) / 14) * Math.PI)) * (f < b2 + 14 ? 1 : 0) : 1;
  const g = temblor(f, b5, 12);
  return (
    <AbsoluteFill style={{ transform: `translate(${g.x}px,${g.y}px)` }}>
      <Rejilla op={0.6} />
      <Ejes p={1} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {f >= b3 - 2 && <path d={A.area} fill={alfa(VERDE, 0.3 * pr(f, b3 - 2, 10))} />}
        {f >= b5 - 2 && <path d={B.area} fill={alfa(ROJO, 0.3 * pr(f, b5 - 2, 10))} />}
        <line x1={X0} x2={X0 + (X1 - X0) * pr(f, 0, 12)} y1={yC} y2={yC} stroke={ORO} strokeWidth={4 * pulso} strokeDasharray="14 12" />
        {f >= b1 - 4 && <path d={A.d} fill="none" stroke={VERDE} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />}
        {f >= b4 - 4 && <path d={B.d} fill="none" stroke={ROJO} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      <div style={{ position: "absolute", left: xC - 22, top: yC - 22, width: 44, height: 44, borderRadius: 22, background: ORO, transform: `scale(${sp(f, b0 - 2)})`, boxShadow: `0 0 30px ${ORO}` }} />
      <Etiqueta desde={b2 - 2} x={X0 + 10} y={yC + 30} texto="LO QUE PAGASTE" centro={false} tam={26} />
      {f >= b1 - 4 && <Cabeza x={A.h[0]} y={A.h[1]} color={VERDE} />}
      {f >= b4 - 4 && <Cabeza x={B.h[0]} y={B.h[1]} color={ROJO} />}
      <Caja x={360} y={400} desde={b3 - 2} color={VERDE} tam={46}>
        <Icono nombre="plus" tam={46} color={VERDE} /> GANAS
      </Caja>
      <Caja x={360} y={930} desde={b5 - 2} color={ROJO} tam={46}>
        <Icono nombre="minus" tam={46} color={ROJO} /> PIERDES
      </Caja>
      <Chispas desde={b3} x={A.h[0]} y={A.h[1]} color={VERDE} />
      <Chispas desde={b5} x={B.h[0]} y={B.h[1]} color={ROJO} />
    </AbsoluteFill>
  );
};

export const ganarPerder: DefEscena = {
  C: GanarPerder,
  momentos: 6,
  alInicio: () => true,
  sonidos: () => [
    [0, "pop", 0.25],
    [1, "subida", 0.25],
    [3, "exito", 0.25],
    [4, "puff", 0.25],
    [5, "negacion", 0.3],
  ],
};

// ---------------------------------------------------------------- comisiones

const Moneda: React.FC<{ x: number; y: number; s?: number; op?: number; giro?: number }> = ({ x, y, s = 1, op = 1, giro = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${giro}) scale(${s})`} opacity={op}>
    <rect x={-110} y={0} width={220} height={30} fill="#A9782E" />
    <ellipse cx={0} cy={30} rx={110} ry={34} fill="#A9782E" />
    <ellipse cx={0} cy={0} rx={110} ry={34} fill={ORO} />
    <ellipse cx={0} cy={0} rx={78} ry={22} fill="none" stroke="#B88A3A" strokeWidth={5} />
  </g>
);

const Comision: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0, b1, b2, b3] = b;
  const nMon = 7;
  const xS = 340,
    baseY = 950;
  const vuela = (k: number) => (k === nMon - 1 ? b2 : k === nMon - 2 ? b3 : 1e9);
  const recibo = pr(f, b1 - 2, 12, Easing.out(Easing.back(1.3)));
  const filas = ["COMPRA", "PRECIO", "COMISIÓN"];
  return (
    <AbsoluteFill style={{ transform: "scale(1.12)", transformOrigin: "540px 600px" }}>
      <Rejilla op={0.6} />
      <Halo x={xS} y={800} r={300} op={0.2} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {Array.from({ length: nMon }).map((_, k) => {
          const cae = pr(f, k * 2.5, 10, Easing.out(Easing.bounce));
          const y0 = baseY - k * 42;
          const v = vuela(k);
          const t = pr(f, v, 16, Easing.inOut(Easing.cubic));
          const x = xS + (780 - xS) * t,
            y = (y0 - 600 * (1 - cae)) * (1 - t) + 700 * t - Math.sin(t * Math.PI) * 240;
          if (t >= 1) return null;
          return <Moneda key={k} x={x} y={y} s={1 - 0.6 * t} op={Math.min(1, cae * 3)} giro={t * 40} />;
        })}
      </svg>
      {recibo > 0 && (
        <div style={{ position: "absolute", left: 600, top: 470, width: 360, transform: `translateX(${(1 - recibo) * 500}px) rotate(${3 * (1 - recibo) + Math.sin(f / 14) * 1}deg)`, background: C.tarjeta, border: `3px solid ${C.linea}`, borderRadius: 20, padding: "28px 28px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: ORO, marginBottom: 18 }}>OPERACIÓN</div>
          {filas.map((r, k) => {
            const com = k === 2;
            const on = f >= b1 + 4 + k * 5;
            const rojo = com && f >= b2 + 12;
            return (
              <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: F.texto, fontWeight: 800, fontSize: 28, color: rojo ? ROJO : C.texto, padding: "12px 0", borderTop: `2px dashed ${C.linea}`, opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : 30}px)`, background: rojo ? alfa(ROJO, 0.12) : undefined }}>
                <span>{r}</span>
                <span style={{ width: com ? 70 : 100, height: 12, borderRadius: 6, background: rojo ? ROJO : alfa(C.texto, 0.3) }} />
              </div>
            );
          })}
        </div>
      )}
      <Chispas desde={b2 + 14} x={780} y={700} color={ROJO} n={12} r={160} />
      {f >= b2 + 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", transform: `scale(${sp(f, b2 + 6, { damping: 9, stiffness: 220, mass: 0.6 })})` }}>
          <div style={{ fontFamily: F.titulo, fontWeight: 800, fontSize: 76, color: ROJO, letterSpacing: -2 }}>− COMISIONES</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const comision: DefEscena = {
  C: Comision,
  momentos: 4,
  alInicio: () => true,
  sonidos: () => [
    [0, "tic", 0.25],
    [1, "papel", 0.3],
    [2, "swoosh", 0.3],
    [3, "negacion", 0.3],
  ],
};

// ---------------------------------------------------------------- cierre

const Proximo: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0, b1, b2, b3] = b;
  const n = 22;
  const K = 15;
  const velas = serieVelas(n, 7, (k) => (k === K ? 2.6 : k < K ? 0.3 : -0.35), 231, 1.4);
  velas[K] = { ...velas[K], h: velas[K].c + 0.6, l: velas[K].o - 0.55 };
  const marco = { x0: 120, x1: 990, y0: 330, y1: 850 };
  const LT = 20;
  const g = geometria(velas, marco, LT);
  const entra = (k: number) => b1 - 8 + k * 1.6;
  const m = pr(f, b2 - 4, 22, Easing.inOut(Easing.cubic));
  const z = 1 + 1.5 * m;
  const ox = g.xVela(K),
    oy = g.yPrecio((velas[K].o + velas[K].c) / 2);
  const tx = (560 - ox) * m,
    ty = (580 - oy) * m;
  const P = (x: number, y: number): [number, number] => [ox + tx + (x - ox) * z, oy + ty + (y - oy) * z];
  const v = velas[K];
  const ancho = Math.max(5, g.hueco * 0.56);
  const [hx, hy] = P(ox, g.yPrecio(v.h));
  const [cx1, cy1] = P(ox + ancho / 2, g.yPrecio(v.c));
  const [ox1, oy1] = P(ox + ancho / 2, g.yPrecio(v.o));
  const [lx, ly] = P(ox, g.yPrecio(v.l));
  const notas = b2 + 12;
  const fz = fuenteTitulo(["Cómo leer", "una gráfica"]);
  const boton = sp(f, b3 + 10);
  const bote = f > b3 + 20 ? Math.abs(Math.sin((f - b3) / 6)) * 8 : 0;
  return (
    <AbsoluteFill>
      <Escritorio dur={dur} cabecera="AAPL · APPLE · 1D · EJEMPLO" seInclina={b2 - 4} asiente={[b1 + 10, notas + 6]} cursor={[[0, 760, 640], [b1, g.xVela(6), 620], [b2 - 8, ox + 14, oy], [notas + 24, ox + 200, oy + 120]]} clics={[b2 - 6]}>
        <AbsoluteFill style={{ transform: `translate(${tx}px,${ty}px) scale(${z})`, transformOrigin: `${ox}px ${oy}px` }}>
          <GraficoVelas velas={velas} marco={marco} entra={entra} forma={5} vivo={false} letra={LT} opacidad={(k) => (k === K ? 1 : 1 - 0.85 * m)} ejes={1 - m} />
        </AbsoluteFill>
        <Nota x={hx} y={hy} dx={110} dy={-10} texto="máximo" desde={notas} />
        <Nota x={cx1} y={cy1} dx={140} dy={20} texto="cierre" desde={notas + 4} color={VERDE} />
        <Nota x={ox1} y={oy1} dx={140} dy={-20} texto="apertura" desde={notas + 8} />
        <Nota x={lx} y={ly} dx={-110} dy={10} texto="mínimo" desde={notas + 12} />
        {f >= notas + 8 && <div style={{ position: "absolute", left: ox1 - 300, top: (cy1 + oy1) / 2 - 40, fontFamily: F.mano, fontSize: 64, color: ORO, transform: `rotate(-8deg) scale(${sp(f, notas + 8)})` }}>cuerpo</div>}
      </Escritorio>
      {f >= b0 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 180, display: "flex", justifyContent: "center", transform: `scale(${sp(f, b0 - 2)})` }}>
          <div style={{ background: ORO, color: C.acentoTexto, fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 6, padding: "12px 28px", borderRadius: 40, display: "flex", gap: 12, alignItems: "center" }}>
            <Icono nombre="play" tam={30} color={C.acentoTexto} /> PRÓXIMO VÍDEO
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 470, right: 20, top: 985, textAlign: "center" }}>
        <div>
          <Revela2 desde={b3 - 4} tam={76} fuente={fz}>
            Cómo leer
          </Revela2>
        </div>
        <div>
          <Revela2 desde={b3 - 1} tam={82} color={ORO} fuente={fz}>
            una gráfica
          </Revela2>
        </div>
      </div>
      {boton > 0 && (
        <div style={{ position: "absolute", left: 470, right: 20, top: 1185 - bote, display: "flex", justifyContent: "center", transform: `scale(${boton})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, border: `2px solid ${ORO}`, color: ORO, fontFamily: F.texto, fontWeight: 800, fontSize: 26, letterSpacing: 3, padding: "10px 22px", borderRadius: 40 }}>
            <Icono nombre="bell-ring" tam={30} color={ORO} /> SÍGUEME
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const proximo: DefEscena = {
  C: Proximo,
  momentos: 4,
  sonidos: () => [
    [0, "whoosh", 0.3],
    [1, "tecla", 0.2],
    [2, "swoosh", 0.25],
    [3, "campana", 0.3],
  ],
};
