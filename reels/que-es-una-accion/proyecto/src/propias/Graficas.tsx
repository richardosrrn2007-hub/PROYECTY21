// Gráficas de precio (se mueve, sube, baja, velas), ganar/perder, comisiones y el cierre.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { numeroES, rnd } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { txt } from "../escenas/util";
import { Icono } from "../piezas/basicas";
import { Caja, Chispas, Cuenta, Etiqueta, Halo, ORO, ROJO, Rejilla, Revela as Revela2, Trazo, VERDE, pr, sp, temblor } from "./mg";

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
    const valor = 50 + (700 - hy) / 12;
    return (
      <AbsoluteFill style={{ transform: `translate(${g.x}px,${g.y}px)` }}>
        <Rejilla op={0.6} />
        <Ejes p={ejes} />
        <Etiqueta desde={b0} x={X0} y={250} texto="PRECIO" centro={false} tam={28} />
        <Caja x={430} y={285} desde={b1 - 2} color={VERDE} tam={30}>
          <Icono nombre="arrow-up" tam={36} color={VERDE} /> PAGAR
        </Caja>
        <Caja x={770} y={285} desde={b2 - 2} color={ROJO} tam={30}>
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

  // velas
  const [b0, b1, b2, b3, b4] = b;
  const n = 16;
  const paso = Math.max(2, (b3 - b0) / 13);
  const forma = (k: number) => 640 + 200 * Math.sin((k / (n - 1)) * Math.PI * 1.6 + 0.4) + (rnd(k) - 0.5) * 60;
  const ancho = (X1 - X0 - 40) / n;
  const velas = Array.from({ length: n }).map((_, k) => {
    const abre = forma(k - 0.6),
      cierra = forma(k);
    const alto = Math.min(abre, cierra) - 30 - rnd(k + 2) * 30,
      bajo = Math.max(abre, cierra) + 30 + rnd(k + 5) * 30;
    return { k, x: X0 + 30 + k * ancho + ancho / 2, abre, cierra, alto, bajo, verde: cierra < abre, desde: b0 - 2 + k * paso };
  });
  let iMin = 0,
    iMax = 0;
  velas.forEach((v, k) => {
    if (k < 10 && v.bajo > velas[iMin].bajo) iMin = k;
    if (k > iMin && v.alto < velas[iMax].alto) iMax = k;
  });
  if (iMax <= iMin) iMax = Math.min(n - 1, iMin + 5);
  const vMin = velas[iMin],
    vMax = velas[iMax];
  const arcoP = pr(f, b3, 14, Easing.inOut(Easing.cubic));
  const ultima = velas[n - 1];
  return (
    <AbsoluteFill>
      <Rejilla op={0.6} />
      <Ejes p={pr(f, 0, 10)} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {velas.map((v) => {
          const k = sp(f, v.desde, { damping: 12, stiffness: 200, mass: 0.5 });
          if (k <= 0) return null;
          const col = v.verde ? VERDE : ROJO;
          const cy = (v.abre + v.cierra) / 2;
          const h = Math.max(10, Math.abs(v.abre - v.cierra));
          return (
            <g key={v.k} transform={`translate(${v.x},${cy}) scale(1,${k}) translate(${-v.x},${-cy})`}>
              <line x1={v.x} x2={v.x} y1={v.alto} y2={v.bajo} stroke={col} strokeWidth={4} />
              <rect x={v.x - ancho * 0.32} y={cy - h / 2} width={ancho * 0.64} height={h} rx={4} fill={col} />
            </g>
          );
        })}
        <Trazo d={`M${vMin.x} ${vMin.bajo + 70} Q${(vMin.x + vMax.x) / 2} ${vMax.alto - 160} ${vMax.x} ${vMax.alto - 70}`} p={arcoP} grosor={5} guion />
      </svg>
      <Caja x={270} y={290} desde={b0 - 2} color={VERDE} tam={32}>
        COMPRAR
      </Caja>
      <Caja x={520} y={290} desde={b1 - 2} color={ROJO} tam={32}>
        VENDER
      </Caja>
      <Marcador x={vMin.x} y={vMin.bajo + 14} desde={b2 - 2} texto="COMPRA" color={VERDE} />
      <Marcador x={vMax.x} y={vMax.alto - 14} desde={b3 + 6} texto="VENTA" color={ROJO} arriba />
      {f >= b4 - 2 && <Cabeza x={ultima.x} y={ultima.cierra} color={ORO} valor={numeroES(50 + (640 - ultima.cierra) / 12 + Math.sin(f / 4) * 0.08, 2)} />}
    </AbsoluteFill>
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
  const n = 11;
  const ancho = 640 / n;
  const velas = Array.from({ length: n }).map((_, k) => {
    const c = 640 - k * 14 + Math.sin(k * 1.3) * 60;
    const a = c + (k % 3 === 1 ? -50 : 55);
    return { x: 220 + k * ancho + ancho / 2, abre: a, cierra: c, verde: c < a, desde: b1 - 2 + k * 2 };
  });
  const lupa = pr(f, b2 - 4, Math.max(20, dur - b2 - 10), Easing.inOut(Easing.sin));
  const lx = 240 + 600 * lupa,
    ly = 600 + Math.sin(lupa * Math.PI * 2) * 50;
  const boton = sp(f, b3 + 10);
  const bote = f > b3 + 20 ? Math.abs(Math.sin((f - b3) / 6)) * 12 : 0;
  return (
    <AbsoluteFill>
      <Rejilla />
      <Halo x={540} y={620} r={460} op={0.18} />
      {f >= b0 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", transform: `scale(${sp(f, b0 - 2)})` }}>
          <div style={{ background: ORO, color: C.acentoTexto, fontFamily: F.texto, fontWeight: 800, fontSize: 36, letterSpacing: 8, padding: "14px 34px", borderRadius: 40, display: "flex", gap: 14, alignItems: "center" }}>
            <Icono nombre="play" tam={36} color={C.acentoTexto} /> PRÓXIMO VÍDEO
          </div>
        </div>
      )}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {velas.map((v, k) => {
          const s = sp(f, v.desde, { damping: 12, stiffness: 200, mass: 0.5 });
          if (s <= 0) return null;
          const col = v.verde ? VERDE : ROJO;
          const cy = (v.abre + v.cierra) / 2,
            h = Math.abs(v.abre - v.cierra);
          const cerca = f >= b2 - 4 && Math.abs(lx - v.x) < 90;
          return (
            <g key={k} transform={`translate(${v.x},${cy}) scale(${cerca ? 1.15 : 1},${s}) translate(${-v.x},${-cy})`} opacity={f >= b2 - 4 && !cerca ? 0.45 : 1}>
              <line x1={v.x} x2={v.x} y1={Math.min(v.abre, v.cierra) - 40} y2={Math.max(v.abre, v.cierra) + 40} stroke={col} strokeWidth={4} />
              <rect x={v.x - ancho * 0.3} y={cy - h / 2} width={ancho * 0.6} height={h} rx={4} fill={col} />
            </g>
          );
        })}
      </svg>
      {f >= b2 - 4 && (
        <div style={{ position: "absolute", left: lx - 110, top: ly - 110, transform: `scale(${sp(f, b2 - 4)})` }}>
          <Icono nombre="search" tam={220} color={C.texto} grosor={2.4} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center" }}>
        <div>
          <Revela2 desde={b2 - 2} tam={96}>
            CÓMO LEER
          </Revela2>
        </div>
        <div>
          <Revela2 desde={b3 - 2} tam={110} color={ORO}>
            UNA GRÁFICA
          </Revela2>
        </div>
      </div>
      {boton > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1130 - bote, display: "flex", justifyContent: "center", transform: `scale(${boton})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, border: `3px solid ${ORO}`, color: ORO, fontFamily: F.texto, fontWeight: 800, fontSize: 32, letterSpacing: 5, padding: "12px 28px", borderRadius: 40 }}>
            <Icono nombre="bell-ring" tam={36} color={ORO} /> SÍGUEME PARA VERLO
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
