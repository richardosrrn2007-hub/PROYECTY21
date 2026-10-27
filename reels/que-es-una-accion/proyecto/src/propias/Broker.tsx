// Cómo se compra: el móvil manda la orden al bróker, el bróker la lleva al mercado
// y en el mercado compradores y vendedores mueven el precio.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { numeroES, rnd } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { txt } from "../escenas/util";
import { Icono, Onda } from "../piezas/basicas";
import { Chispas, Etiqueta, Halo, ORO, ROJO, Rejilla, Trazo, VERDE, pr, sp, temblor } from "./mg";

/** Nodo redondo con icono y etiqueta. */
export const Nodo: React.FC<{ x: number; y: number; r: number; icono: string; texto: string; desde: number; color?: string; pulso?: number }> = ({ x, y, r, icono, texto, desde, color = ORO, pulso = -1 }) => {
  const f = useCurrentFrame();
  const k = sp(f, desde, { damping: 10, stiffness: 170, mass: 0.6 });
  if (k <= 0) return null;
  const late = pulso >= 0 && f >= pulso ? 1 + 0.06 * Math.max(0, Math.sin((f - pulso) / 3)) : 1;
  const giro = f * 0.8;
  return (
    <>
      <Halo x={x} y={y} r={r * 2} color={color} op={0.22} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`translate(${x},${y}) scale(${k * late})`}>
          <circle r={r} fill={C.tarjeta} stroke={color} strokeWidth={6} />
          <circle r={r + 18} fill="none" stroke={alfa(color, 0.45)} strokeWidth={3} strokeDasharray="10 14" transform={`rotate(${giro})`} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k * late})` }}>
        <Icono nombre={icono} tam={r * 0.95} color={color} />
      </div>
      <div style={{ position: "absolute", left: x - 250, width: 500, top: y + r + 34, textAlign: "center", fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 7, color, opacity: pr(f, desde + 4, 8) }}>{texto}</div>
    </>
  );
};

/** Fichas que viajan en bucle de A a B. */
const Flujo: React.FC<{ desde: number; x1: number; y1: number; x2: number; y2: number; cada?: number; viaje?: number; etiquetas: [string, string][]; hasta?: number }> = ({ desde, x1, y1, x2, y2, cada = 14, viaje = 22, etiquetas, hasta = 1e9 }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const out: React.ReactNode[] = [];
  for (let n = 0; desde + n * cada <= Math.min(f, hasta); n++) {
    const t = (f - desde - n * cada) / viaje;
    if (t < 0 || t > 1) continue;
    const e = Easing.inOut(Easing.cubic)(t);
    const [txtE, col] = etiquetas[n % etiquetas.length];
    const x = x1 + (x2 - x1) * e,
      y = y1 + (y2 - y1) * e - Math.sin(t * Math.PI) * 40;
    out.push(
      <div key={n} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1, t * 6, (1 - t) * 6)})`, background: col, color: C.acentoTexto, fontFamily: F.texto, fontWeight: 800, fontSize: 24, letterSpacing: 2, padding: "8px 14px", borderRadius: 10, boxShadow: `0 0 24px ${alfa(col, 0.5)}` }}>
        {txtE}
      </div>,
    );
  }
  return <>{out}</>;
};

const Broker: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const modo = txt(p, "modo", "movil");
  if (modo === "movil") {
    const [b0, b1, b2, b3] = b;
    const dibujo = pr(f, 0, Math.max(14, b0 + 10), Easing.inOut(Easing.cubic));
    const boton = sp(f, b1);
    const toque = b1 + 10;
    const pulsado = f >= toque && f < toque + 6;
    const chart = pr(f, b0 + 4, 26, Easing.inOut(Easing.cubic));
    return (
      <AbsoluteFill>
        <Rejilla />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <Trazo d="M215 360 Q215 320 255 320 L455 320 Q495 320 495 360 L495 920 Q495 960 455 960 L255 960 Q215 960 215 920 Z" p={dibujo} grosor={7} color={C.texto} />
          <Trazo d="M320 345 L390 345" p={dibujo} grosor={6} color={C.suave} />
          <Trazo d="M250 640 L290 610 L325 625 L365 560 L405 580 L455 500" p={chart} grosor={6} color={VERDE} />
          <Trazo d="M515 640 L670 640" p={pr(f, b2, 12)} grosor={5} guion />
        </svg>
        {boton > 0 && (
          <div style={{ position: "absolute", left: 355, top: 830, transform: `translate(-50%,-50%) scale(${boton * (pulsado ? 0.9 : 1)})`, background: pulsado ? "#FFFFFF" : ORO, color: C.acentoTexto, fontFamily: F.texto, fontWeight: 800, fontSize: 34, letterSpacing: 4, padding: "18px 40px", borderRadius: 14, boxShadow: `0 0 ${pulsado ? 60 : 30}px ${alfa(ORO, 0.5)}` }}>COMPRAR</div>
        )}
        <div style={{ position: "absolute", left: 245, top: 382, width: 230, opacity: pr(f, b0, 8) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 36, color: C.texto }}>AAPL</span>
            <span style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 22, color: VERDE }}>+1,2 %</span>
          </div>
          <div style={{ fontFamily: F.texto, fontWeight: 600, fontSize: 22, color: C.suave, marginTop: 2 }}>Apple Inc.</div>
        </div>
        {[
          ["NFLX", "Netflix", "−0,8 %", ROJO],
          ["TSLA", "Tesla", "+2,4 %", VERDE],
        ].map(([t, n, p, col], k) => (
          <div key={t} style={{ position: "absolute", left: 245, top: 676 + k * 58, width: 230, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.linea}`, paddingTop: 10, opacity: pr(f, b0 + 6 + k * 4, 8) }}>
            <span style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 22, color: C.texto }}>
              {t} <span style={{ fontWeight: 600, color: C.suave, fontSize: 18 }}>{n}</span>
            </span>
            <span style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 20, color: col }}>{p}</span>
          </div>
        ))}
        <Onda desde={toque} x={355} y={830} r0={20} r1={150} dur={14} />
        <Nodo x={800} y={640} r={115} icono="landmark" texto="BRÓKER" desde={b2 - 2} pulso={b3} />
        <Chispas desde={b2} x={800} y={640} n={14} r={230} />
        <Flujo desde={b3 - 6} x1={515} y1={640} x2={690} y2={640} cada={16} viaje={18} etiquetas={[["ORDEN", ORO]]} hasta={dur - 18} />
      </AbsoluteFill>
    );
  }
  // flujo: tú → bróker → mercado
  const [b0, b1, b2, b3, b4, b5] = b;
  const y = 640;
  const t = temblor(f, b5, 8);
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px,${t.y}px)` }}>
      <Rejilla />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Trazo d={`M265 ${y} L425 ${y}`} p={pr(f, b1, 10)} grosor={5} guion />
        <Trazo d={`M655 ${y} L815 ${y}`} p={pr(f, b5 - 4, 10)} grosor={5} guion />
      </svg>
      <Nodo x={540} y={y} r={110} icono="landmark" texto="BRÓKER" desde={-30} pulso={b2} />
      <Etiqueta desde={b0} x={540} y={300} texto="INTERMEDIARIO" tam={40} />
      <Nodo x={165} y={y} r={90} icono="user" texto="TÚ" desde={b1 - 2} color={C.texto} />
      <Nodo x={915} y={y} r={90} icono="chart-candlestick" texto="MERCADO" desde={b5 - 2} pulso={b5 + 10} />
      <Flujo desde={b2} x1={265} y1={y} x2={425} y2={y} cada={12} viaje={18} etiquetas={[["COMPRA", VERDE], ["VENTA", ROJO]]} />
      <Flujo desde={b5 + 4} x1={655} y1={y} x2={815} y2={y} cada={12} viaje={18} etiquetas={[["COMPRA", VERDE], ["VENTA", ROJO]]} />
      {[
        [b3, "COMPRA", VERDE, 450],
        [b4, "VENTA", ROJO, 880],
      ].map(([d, texto, col, yy]) =>
        f >= (d as number) - 2 ? (
          <div key={texto as string} style={{ position: "absolute", left: 540, top: yy as number, transform: `translate(-50%,-50%) scale(${sp(f, (d as number) - 2)})`, border: `4px solid ${col}`, color: col as string, fontFamily: F.titulo, fontWeight: 800, fontSize: 60, padding: "8px 30px", borderRadius: 16, background: alfa(col as string, 0.12) }}>
            {texto}
          </div>
        ) : null,
      )}
    </AbsoluteFill>
  );
};

export const broker: DefEscena = {
  C: Broker,
  momentos: (p) => (txt(p, "modo", "movil") === "movil" ? 4 : 6),
  alInicio: () => true,
  sonidos: (p) =>
    txt(p, "modo", "movil") === "movil"
      ? [[1, "pop", 0.25], [1, "clic", 0.35], [2, "ding", 0.3], [3, "whoosh", 0.2]]
      : [[0, "pop", 0.25], [1, "pop", 0.2], [3, "tic", 0.3], [4, "tic", 0.3], [5, "subida", 0.3]],
};

// ---------------------------------------------------------------- mercado

/** Precio que se mueve de forma creíble (paseo aleatorio determinista). */
const precio = (f: number, base: number, tendencia = 0) => {
  let v = base;
  for (let k = 0; k < Math.floor(f / 3); k++) v += (rnd(k * 7.3) - 0.5 + tendencia) * 0.35;
  return v;
};

const Mercado: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0, b1, b2, b3] = b;
  const personas = Array.from({ length: 24 }).map((_, k) => {
    const lado = k % 2 === 0 ? -1 : 1;
    const idx = Math.floor(k / 2);
    const x = 540 + lado * (230 + rnd(k + 3) * 160);
    const y = 330 + (idx / 11) * 640 + (rnd(k + 9) - 0.5) * 40;
    return { k, lado, x, y, desde: b1 + idx * 1.2 + (lado > 0 ? 1 : 0) };
  });
  const sube = f >= b2 ? 0.2 : 0;
  const v = f >= b0 ? precio(f - b0, 228, f >= b3 ? 0 : sube) : 228;
  const golpe = temblor(f, b3 + 8, 6);
  const choque = (n: number) => b3 + 8 + n * 14;
  return (
    <AbsoluteFill style={{ transform: `translate(${golpe.x}px,${golpe.y}px)` }}>
      <Rejilla />
      {personas.map(({ k, lado, x, y, desde }) => {
        const s = sp(f, desde);
        if (s <= 0) return null;
        const activo = (lado < 0 && f >= b2) || (lado > 0 && f >= b3);
        const col = lado < 0 ? VERDE : ROJO;
        const salto = activo ? Math.abs(Math.sin((f + k * 5) / 5)) * 10 : 0;
        return (
          <div key={k} style={{ position: "absolute", left: x - 28, top: y - 28 - salto, transform: `scale(${s})`, opacity: activo ? 1 : 0.55 }}>
            <Icono nombre="user-round" tam={56} color={col} />
          </div>
        );
      })}
      {personas.map(({ k, lado, x, y }) => {
        const desde = lado < 0 ? b2 : b3;
        const e = f - desde - (k % 6) * 4 - Math.floor(k / 6) * 9;
        const ciclo = 26;
        if (e < 0) return null;
        const t = (e % ciclo) / ciclo;
        const tx = x + (540 - x) * Easing.in(Easing.quad)(t),
          ty = y + (640 - y) * Easing.in(Easing.quad)(t);
        const col = lado < 0 ? VERDE : ROJO;
        return <div key={`o${k}`} style={{ position: "absolute", left: tx - 9, top: ty - 9, width: 18, height: 18, borderRadius: 9, background: col, boxShadow: `0 0 18px ${col}`, opacity: Math.min(1, (1 - t) * 4) }} />;
      })}
      <Etiqueta desde={b2} x={270} y={240} texto="COMPRADORES" color={VERDE} tam={24} />
      <Etiqueta desde={b3} x={810} y={240} texto="VENDEDORES" color={ROJO} tam={24} />
      {[0, 1, 2, 3].map((n) => (
        <Chispas key={n} desde={choque(n)} x={540} y={640} n={10} r={150} />
      ))}
      {f >= b0 - 2 && (
        <div style={{ position: "absolute", left: 540, top: 640, transform: `translate(-50%,-50%) scale(${sp(f, b0 - 2)})`, background: C.tarjeta, border: `4px solid ${ORO}`, borderRadius: 26, padding: "26px 40px", textAlign: "center", boxShadow: `0 0 60px ${alfa(ORO, 0.3)}` }}>
          <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 26, letterSpacing: 7, color: ORO }}>PRECIO</div>
          <div style={{ fontFamily: F.titulo, fontWeight: 800, fontSize: 92, color: C.texto, fontVariantNumeric: "tabular-nums", letterSpacing: -2 }}>{numeroES(v, 2)}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const mercado: DefEscena = {
  C: Mercado,
  momentos: 4,
  sonidos: () => [
    [0, "pop", 0.3],
    [1, "burbuja", 0.25],
    [2, "subida", 0.22],
    [3, "golpe", 0.25],
  ],
};
