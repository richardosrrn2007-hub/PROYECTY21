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
import { Escritorio, Personaje } from "./Escritorio";
import { Nodo } from "./Broker";
import { Caja, Chispas, Cuenta, Etiqueta, Halo, ORO, ROJO, Rejilla, PRO, CLAVE, Billete, Revela as Revela2, Trazo, VERDE, fuenteTitulo, pr, sp, temblor } from "./mg";

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

// ---------------------------------------------------------------- piezas de datos

/** Precios del eje derecho (AAPL de ejemplo) en las líneas de la rejilla. */
const EjePrecios: React.FC<{ op: number; base?: number; k?: number }> = ({ op, base = 228, k: escala = 0.1 }) => (
  <>
    {[0.25, 0.5, 0.75].map((k) => {
      const y = Y0 + (Y1 - Y0) * k;
      return (
        <div key={k} style={{ position: "absolute", left: X1 - 120, width: 110, top: y - 30, textAlign: "right", fontFamily: F.texto, fontWeight: 600, fontSize: 22, color: C.suave, opacity: op, fontVariantNumeric: "tabular-nums" }}>
          {numeroES(base + (700 - y) * escala, 2)}
        </div>
      );
    })}
  </>
);

/** Libro de órdenes: filas de precio con barras de profundidad que se mueven. */
const Libro: React.FC<{ x: number; y: number; desde: number; lado: "compra" | "venta" }> = ({ x, y, desde, lado }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const col = lado === "compra" ? VERDE : ROJO;
  const filas = [0, 1, 2, 3, 4].map((k) => (lado === "compra" ? 227.9 - k * 0.05 : 228.0 + k * 0.05));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 250 }}>
      <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 18, letterSpacing: 3, color: alfa(col, 0.9), marginBottom: 8, opacity: pr(f, desde, 8) }}>{lado === "compra" ? "COMPRADORES" : "VENDEDORES"}</div>
      {filas.map((p, k) => {
        const e = pr(f, desde + 2 + k * 2, 8);
        const w = (0.3 + 0.6 * rnd(k * 3.3 + (lado === "compra" ? 1 : 2)) + 0.12 * Math.sin((f + k * 7) / 6)) * 100;
        return (
          <div key={k} style={{ position: "relative", height: 30, marginBottom: 4, opacity: e, transform: `translateX(${(1 - e) * 20}px)` }}>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${w * e}%`, background: alfa(col, 0.16), borderRadius: 4 }} />
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "0 10px", lineHeight: "30px", fontFamily: F.texto, fontWeight: 600, fontSize: 20, fontVariantNumeric: "tabular-nums" }}>
              <span style={{ color: col }}>{numeroES(p, 2)}</span>
              <span style={{ color: C.suave }}>{Math.round(20 + w * 3)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Tarjeta "Tu posición": precio de compra, precio actual y resultado. */
const Posicion: React.FC<{ x: number; y: number; desde: number; compra: number; ahora: number; col: string }> = ({ x, y, desde, compra, ahora, col }) => {
  const f = useCurrentFrame();
  const k = sp(f, desde);
  if (k <= 0) return null;
  const t = pr(f, desde + 4, 22, Easing.out(Easing.cubic));
  const v = compra + (ahora - compra) * t;
  const pct = ((v - compra) / compra) * 100;
  const fila = (a: string, b: React.ReactNode, c = C.texto) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.texto, fontWeight: 600, fontSize: 24, color: C.suave, padding: "6px 0" }}>
      <span>{a}</span>
      <span style={{ color: c, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{b}</span>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 380, transform: `scale(${k})`, transformOrigin: "0 0", background: alfa("#0E0C0A", 0.85), border: `2px solid ${alfa(col, 0.55)}`, borderRadius: 18, padding: "16px 22px", boxShadow: `0 0 40px ${alfa(col, 0.18)}` }}>
      <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 18, letterSpacing: 3, color: C.acento, marginBottom: 6 }}>TU POSICIÓN · AAPL</div>
      {fila("Compraste a", `${numeroES(compra, 2)} $`)}
      {fila("Ahora", `${numeroES(v, 2)} $`)}
      <div style={{ height: 1, background: C.linea, margin: "6px 0" }} />
      {fila("Resultado", `${pct >= 0 ? "+" : ""}${numeroES(pct, 1)} %`, col)}
    </div>
  );
};

/** Notificación tipo móvil que cae desde arriba. */
const Aviso: React.FC<{ desde: number; titulo: string; texto: string; col: string }> = ({ desde, titulo, texto, col }) => {
  const f = useCurrentFrame();
  const k = sp(f, desde, { damping: 14, stiffness: 160, mass: 0.7 });
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: 230 - (1 - k) * 160, opacity: Math.min(1, k * 2), display: "flex", alignItems: "center", gap: 18, background: alfa("#1A1714", 0.94), border: `1px solid ${C.linea}`, borderRadius: 26, padding: "18px 24px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
      <div style={{ width: 58, height: 58, borderRadius: 14, background: alfa(col, 0.18), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icono nombre="bell-ring" tam={32} color={col} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 26, color: C.texto }}>{titulo}</div>
        <div style={{ fontFamily: F.texto, fontWeight: 600, fontSize: 22, color: C.suave }}>{texto}</div>
      </div>
      <div style={{ fontFamily: F.texto, fontWeight: 600, fontSize: 18, color: C.suave }}>ahora</div>
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
        <EjePrecios op={ejes} />
        <Libro x={170} y={350} desde={b1} lado="compra" />
        <Libro x={560} y={350} desde={b2} lado="venta" />
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
    // cámara distinta en cada una para que las gráficas seguidas no se vean iguales:
    // sube = gira de lado y avanza hacia la punta; baja = picado con el plano torcido que se endereza
    const cam = pr(f, 0, Math.max(30, dur), Easing.inOut(Easing.cubic));
    const camara = sube
      ? `rotateY(${16 - 20 * cam}deg) rotateX(${6 - 6 * cam}deg) scale(${0.96 + 0.1 * cam})`
      : `rotateX(${14 - 14 * cam}deg) rotateZ(${-4 + 5 * cam}deg) scale(${1.08 - 0.06 * cam})`;
    return (
      <AbsoluteFill style={{ perspective: 1500 }}>
      <AbsoluteFill style={{ transform: `translate(${g.x}px,${g.y}px) ${camara}`, transformOrigin: sube ? "820px 560px" : "620px 820px" }}>
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
        {sube && <Posicion x={560} y={830} desde={bC} compra={218.4} ahora={270.82} col={VERDE} />}
        <Personaje mesa={false} pose={sube ? "celebra" : "cabeza"} cambio={sube ? bC : bD - 4} dx={290} dy={190} escala={0.85} mira={sube ? 0.3 : 0} />
        <EjePrecios op={1} base={sube ? 233.38 : 212.93} k={sube ? 0.1248 : 0.1015} />
        {!sube && (
          <>
            <Aviso desde={bA - 2} titulo="AAPL · Alerta de precio" texto="Ha caído un 18 % desde tu compra" col={ROJO} />
            <Posicion x={140} y={730} desde={bC} compra={231.2} ahora={189.58} col={ROJO} />
            <Etiqueta desde={bD - 2} x={540} y={1050} texto="PIERDE VALOR" color={ROJO} />
            <AbsoluteFill style={{ top: -400, bottom: -400, background: `radial-gradient(ellipse at center, transparent 45%, ${alfa(ROJO, vineta)} 100%)` }} />
            <AbsoluteFill style={{ top: -400, bottom: -400, background: alfa(ORO, 0.18 * flash) }} />
          </>
        )}
      </AbsoluteFill>
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
          <div style={{ position: "absolute", left: (xa + xb) / 2 - 40, top: (ya + yb) / 2 - 10, fontFamily: PRO, fontWeight: 700, fontSize: 38, letterSpacing: 1, color: ORO, transform: `rotate(-24deg) scale(${sp(f, b3 + 6)})`, whiteSpace: "nowrap" }}>el movimiento</div>
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

/** Ganas: los billetes caen y se abren en abanico. Pierdes: salen volando. */
const Billetes: React.FC<{ x: number; y: number; desde: number; modo: "gana" | "pierde" }> = ({ x, y, desde, modo }) => {
  const f = useCurrentFrame();
  if (f < desde - 2) return null;
  const n = 6;
  const gana = modo === "gana";
  const col = gana ? VERDE : ROJO;
  const cuenta = pr(f, desde, 16, Easing.out(Easing.cubic));
  return (
    <>
      {Array.from({ length: n }).map((_, k) => {
        const d = desde + k * 2;
        if (gana) {
          const c = sp(f, d, { damping: 11, stiffness: 140, mass: 0.6 });
          const ab = pr(f, desde + n * 2, 10, Easing.out(Easing.back(1.6)));
          return <Billete key={k} x={x + (k - (n - 1) / 2) * 14 * ab} y={y - 320 * (1 - c)} giro={(k - (n - 1) / 2) * 12 * ab + (1 - c) * 40} escala={1} op={Math.min(1, c * 2)} />;
        }
        // pierde: arrancan juntos y salen volando cada uno hacia un lado, girando
        const t = pr(f, d, 22, Easing.in(Easing.quad));
        const ang = -2.4 + k * 0.32;
        return <Billete key={k} x={x + Math.cos(ang) * 520 * t} y={y + Math.sin(ang) * 420 * t + 140 * t * t} giro={(k - 2.5) * 6 + t * (k % 2 ? 260 : -220)} escala={1 - 0.35 * t} op={1 - t} voltea={Math.cos(t * Math.PI * 3)} />;
      })}
      <div style={{ position: "absolute", left: x + 130, top: y - 50, fontFamily: CLAVE, fontSize: 92, color: col, whiteSpace: "nowrap", transform: `scale(${sp(f, desde + 4)})`, transformOrigin: "0 50%", textShadow: `0 0 30px ${alfa(col, 0.4)}, 0 4px 14px rgba(0,0,0,0.85)` }}>
        {gana ? "+" : "−"}
        {numeroES(1000 * cuenta, 0)} $
      </div>
    </>
  );
};

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
      <Caja x={720} y={360} desde={b3 - 2} color={VERDE} tam={42}>
        <Icono nombre="plus" tam={46} color={VERDE} /> GANAS
      </Caja>
      <Caja x={360} y={930} desde={b5 - 2} color={ROJO} tam={46}>
        <Icono nombre="minus" tam={46} color={ROJO} /> PIERDES
      </Caja>
      <Chispas desde={b3} x={A.h[0]} y={A.h[1]} color={VERDE} />
      <Chispas desde={b5} x={B.h[0]} y={B.h[1]} color={ROJO} />
      <Billetes x={250} y={470} desde={b3} modo="gana" />
      <Billetes x={260} y={820} desde={b5} modo="pierde" />
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
  const xS = 230,
    baseY = 760;
  const nodo: [number, number] = [830, 640];
  const linea0 = 360,
    linea1 = nodo[0] - 120;
  // en cada comisión, la moneda de arriba viaja por la línea hasta el bróker
  // tic, tic, tic: tres monedas pasan al bróker una detrás de otra
  const SALIDAS = [b2 - 6, b2 + 1, b2 + 8];
  const LLEGA = SALIDAS.map((x) => x + 10);
  const vuela = (k: number) => (k >= nMon - 3 ? SALIDAS[nMon - 1 - k] : 1e9);
  const cobrado = LLEGA.reduce((n, x) => n + pr(f, x, 4), 0);
  void b3;
  const neta = 218.4 - 2 * cobrado;
  const barra = pr(f, b0, 14);
  const g = temblor(f, LLEGA[2], 6);
  const menos = (d: number, dx = 0) => {
    const t = f - d;
    if (t < 0 || t > 30) return null;
    return (
      <div key={d} style={{ position: "absolute", left: nodo[0] - 60 + dx, top: nodo[1] - 150 - t * 2, width: 120, textAlign: "center", fontFamily: CLAVE, fontSize: 46, color: ROJO, opacity: Math.min(1, (30 - t) / 10), transform: `scale(${sp(f, d)})` }}>
        −2 $
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ transform: `translate(${g.x}px,${g.y}px)` }}>
      <Rejilla op={0.6} />
      <Halo x={xS} y={640} r={280} op={0.2} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <Trazo d={`M${linea0} ${nodo[1]} L${linea1} ${nodo[1]}`} p={pr(f, b1 - 2, 12)} grosor={5} guion />
        {Array.from({ length: nMon }).map((_, k) => {
          const cae = pr(f, k * 2.5, 10, Easing.out(Easing.bounce));
          const y0 = baseY - k * 40;
          const t = pr(f, vuela(k), 10, Easing.inOut(Easing.cubic));
          if (t >= 1) return null;
          const x = xS + (nodo[0] - xS) * t,
            y = (y0 - 600 * (1 - cae)) * (1 - t) + nodo[1] * t - Math.sin(t * Math.PI) * 90;
          return <Moneda key={k} x={x} y={y} s={0.85 - 0.5 * t} op={Math.min(1, cae * 3)} giro={t * 60} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: xS - 150, width: 300, top: baseY + 70, textAlign: "center", fontFamily: F.texto, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: ORO, opacity: pr(f, b0, 8) }}>TU DINERO</div>
      <Nodo x={nodo[0]} y={nodo[1]} r={95} icono="landmark" texto="BRÓKER" desde={b1 - 4} pulso={LLEGA[0]} />
      {LLEGA.map((x, k) => menos(x, (k - 1) * 130))}
      {LLEGA.map((x) => (
        <Chispas key={x} desde={x} x={nodo[0]} y={nodo[1]} color={ROJO} n={10} r={140} />
      ))}
      {/* tu ganancia: un número grande y una barra que se acorta */}
      <div style={{ position: "absolute", left: 160, right: 160, top: 930, opacity: barra }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: C.suave }}>TU GANANCIA</span>
          <span style={{ fontFamily: CLAVE, fontSize: 64, color: cobrado > 0 ? ROJO : VERDE, fontVariantNumeric: "tabular-nums" }}>+{numeroES(neta, 2)} $</span>
        </div>
        <div style={{ position: "relative", height: 20, borderRadius: 10, background: alfa(C.texto, 0.08), marginTop: 10, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(100 - 7 * cobrado) * barra}%`, background: VERDE, borderRadius: 10 }} />
        </div>
      </div>
      {f >= b2 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", transform: `scale(${sp(f, b2 - 2, { damping: 9, stiffness: 220, mass: 0.6 })})` }}>
          <div style={{ fontFamily: CLAVE, fontSize: 110, color: ROJO, letterSpacing: 2 }}>− COMISIONES</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const comision: DefEscena = {
  C: Comision,
  momentos: 4,
  alInicio: () => true,
  // las monedas que caen al principio y el golpe del título; los "tic" de cada moneda van en el plan
  sonidos: () => [
    [0, "papel", 0.2],
    [2, "golpe", 0.25],
  ],
};

// ---------------------------------------------------------------- cierre

/** Vela grande para enseñar a leerla: precios de ejemplo y su posición en pantalla. */
const VELA = { o: 232.1, c: 235.8, h: 237.2, l: 230.9 };
const VY = (p: number) => 360 + ((VELA.h - p) / (VELA.h - VELA.l)) * 460;

const Proximo: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0, b1, b2, b3] = b;
  // gráfico realista: más velas, cuerpos largos y mechas proporcionadas
  const n = 30;
  const K = 22;
  const velas = serieVelas(n, 7, (k) => (k === K ? 2.4 : Math.sin(k / 3.6) * 1.1 + 0.15), 224, 2.0);
  const marco = { x0: 110, x1: 990, y0: 330, y1: 850 };
  const LT = 20;
  const g = geometria(velas, marco, LT);
  const entra = (k: number) => b1 - 12 + k * 1.1;
  // al decir "leer", el gráfico se apaga y la vela K crece hasta ocupar la pantalla
  const m = pr(f, b2 - 6, 18, Easing.inOut(Easing.cubic));
  const ox = g.xVela(K),
    oy = g.yPrecio((velas[K].o + velas[K].c) / 2);
  const CX = 430,
    CY = (VY(VELA.h) + VY(VELA.l)) / 2;
  const vx = ox + (CX - ox) * m,
    vy = oy + (CY - oy) * m,
    ve = 0.25 + 0.75 * m;
  const notas = b2 + 10;
  const niveles: [string, number, string, number][] = [
    ["Máximo", VELA.h, C.texto, notas],
    ["Cierre", VELA.c, VERDE, notas + 6],
    ["Apertura", VELA.o, C.texto, notas + 12],
    ["Mínimo", VELA.l, C.texto, notas + 18],
  ];
  const fz = fuenteTitulo(["Cómo leer", "una gráfica"]);
  const boton = sp(f, b3 + 10);
  const bote = f > b3 + 20 ? Math.abs(Math.sin((f - b3) / 6)) * 8 : 0;
  return (
    <AbsoluteFill>
      <Escritorio
        dur={dur}
        cabecera="AAPL · APPLE · 1D · EJEMPLO"
        seInclina={b2 - 4}
        asiente={[b1 + 10, notas + 6, notas + 18]}
        cursor={[[0, 760, 640], [b1, g.xVela(8), 620], [b2 - 8, ox + 14, oy], [notas, 560, VY(VELA.h)], [notas + 6, 560, VY(VELA.c)], [notas + 12, 560, VY(VELA.o)], [notas + 18, 560, VY(VELA.l)], [notas + 30, 300, 600]]}
        clics={[b2 - 8]}
      >
        <AbsoluteFill style={{ opacity: 1 - m }}>
          <GraficoVelas velas={velas} marco={marco} entra={entra} forma={4} vivo={false} letra={LT} />
        </AbsoluteFill>
        {m > 0 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <g transform={`translate(${vx},${vy}) scale(${ve}) translate(${-CX},${-CY})`} opacity={Math.min(1, m * 2)}>
              <line x1={CX} x2={CX} y1={VY(VELA.h)} y2={VY(VELA.l)} stroke="#F6ECD2" strokeWidth={6} />
              <rect x={CX - 48} y={VY(VELA.c)} width={96} height={VY(VELA.o) - VY(VELA.c)} rx={4} fill="#F6ECD2" />
            </g>
            {/* líneas de cada nivel hasta el eje de precios */}
            {niveles.map(([, p, col, d]) => {
              const t = pr(f, d, 10);
              if (t <= 0) return null;
              const y = VY(p);
              return <line key={p} x1={CX + 60} x2={CX + 60 + (840 - CX) * t} y1={y} y2={y} stroke={col} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.85} />;
            })}
            {/* llave del cuerpo */}
            {pr(f, notas + 24, 10) > 0 && (
              <path d={`M${CX - 70} ${VY(VELA.c)} q-18 0 -18 18 L${CX - 88} ${(VY(VELA.c) + VY(VELA.o)) / 2 - 12} q0 12 -14 12 q14 0 14 12 L${CX - 88} ${VY(VELA.o) - 18} q0 18 18 18`} fill="none" stroke={ORO} strokeWidth={4} opacity={pr(f, notas + 24, 10)} />
            )}
          </svg>
        )}
        {niveles.map(([nombre, p, col, d]) => {
          const t = pr(f, d + 4, 8);
          if (t <= 0) return null;
          const y = VY(p);
          return (
            <React.Fragment key={nombre}>
              <div style={{ position: "absolute", left: CX + 76, top: y - 42, fontFamily: PRO, fontWeight: 700, fontSize: 32, color: col, opacity: t, transform: `translateX(${(1 - t) * 20}px)` }}>{nombre}</div>
              <div style={{ position: "absolute", left: 846, top: y - 19, width: 130, height: 38, borderRadius: 8, background: col === VERDE ? VERDE : "#F6ECD2", color: "#000", fontFamily: PRO, fontWeight: 700, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", opacity: t, fontVariantNumeric: "tabular-nums" }}>
                {numeroES(p, 2)}
              </div>
            </React.Fragment>
          );
        })}
        {f >= notas + 26 && (
          <div style={{ position: "absolute", left: CX - 270, top: (VY(VELA.c) + VY(VELA.o)) / 2 - 24, width: 160, textAlign: "right", fontFamily: PRO, fontWeight: 700, fontSize: 34, color: ORO, transform: `scale(${sp(f, notas + 26)})`, transformOrigin: "100% 50%" }}>cuerpo</div>
        )}
        {f >= notas + 30 && (
          <>
            <div style={{ position: "absolute", left: CX - 230, top: (VY(VELA.h) + VY(VELA.c)) / 2 - 18, width: 170, textAlign: "right", fontFamily: PRO, fontWeight: 700, fontSize: 24, color: C.suave, opacity: pr(f, notas + 30, 8) }}>mecha</div>
            <div style={{ position: "absolute", left: CX - 230, top: (VY(VELA.o) + VY(VELA.l)) / 2 - 18, width: 170, textAlign: "right", fontFamily: PRO, fontWeight: 700, fontSize: 24, color: C.suave, opacity: pr(f, notas + 30, 8) }}>mecha</div>
          </>
        )}
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
          <Revela2 desde={b3 - 1} tam={84} color={ORO} fuente={CLAVE}>
            UNA GRÁFICA
          </Revela2>
        </div>
      </div>
      {boton > 0 && (
        <div style={{ position: "absolute", left: 470, right: 20, top: 1185 - bote, display: "flex", justifyContent: "center", transform: `scale(${boton})` }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: ORO, color: C.acentoTexto, fontFamily: F.texto, fontWeight: 800, fontSize: 26, letterSpacing: 2, padding: "8px 20px 8px 16px", borderRadius: 40 }}>
              <Icono nombre="message-circle" tam={30} color={C.acentoTexto} /> COMENTA <span style={{ fontFamily: CLAVE, fontSize: 34, letterSpacing: 1 }}>GRÁFICA</span>
            </div>
            <div style={{ fontFamily: F.texto, fontWeight: 600, fontSize: 22, color: C.suave }}>y te aviso cuando salga</div>
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
