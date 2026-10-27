// Gráfico de velas japonesas realista (OHLC): cada vela abre donde cerró la anterior, mechas finas
// hasta el máximo y el mínimo, eje de precios a la derecha, volumen abajo y línea del último precio.
// Las velas se "forman" al entrar: el cierre viaja desde la apertura como en un gráfico en vivo.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { numeroES, rnd } from "../motor/anim";
/** Velas monocromas de la marca: alcistas rellenas en crema, bajistas huecas con borde crema. */
export type Tema = { borde: string; alcista: string; bajista: string; rejilla: string; eje: string; etiqueta: string; etiquetaTexto: string; volumen: string };
export const OSCURO: Tema = { borde: "#F6ECD2", alcista: "#F6ECD2", bajista: "#000000", rejilla: "#1C1915", eje: "#8C826E", etiqueta: "#F6ECD2", etiquetaTexto: "#000000", volumen: "#F6ECD2" };
/** Gráfico "de papel" como en los análisis de Order Block: alcistas blancas con borde, bajistas negras. */
export const PAPEL: Tema = { borde: "#141414", alcista: "#FFFFFF", bajista: "#141414", rejilla: "#E4DDCC", eje: "#6B6458", etiqueta: "#141414", etiquetaTexto: "#FFFFFF", volumen: "#141414" };

export type Vela = { o: number; h: number; l: number; c: number; v: number };

/**
 * Serie OHLC determinista. `rumbo(k)` es la tendencia de cada vela (en unidades de volatilidad):
 * positiva sube, negativa baja.
 */
export const serieVelas = (n: number, semilla: number, rumbo: (k: number) => number, base = 48, vol = 0.55): Vela[] => {
  // Como un gráfico real: volatilidad por rachas, cuerpos de tamaños muy distintos (dojis incluidos),
  // mechas desiguales y alguna mecha larga de vez en cuando.
  const gauss = (s: number) => (rnd(s) + rnd(s + 0.37) + rnd(s + 0.71) - 1.5) / 0.75;
  const out: Vela[] = [];
  let c = base;
  for (let k = 0; k < n; k++) {
    const o = c;
    const racha = 0.55 + 0.75 * Math.abs(Math.sin(k / 4.3 + semilla)) + 0.25 * rnd(semilla + k * 1.9);
    const v = vol * racha;
    c = o + rumbo(k) * vol * 0.8 + gauss(semilla + k * 3.17) * v * 0.75;
    const larga = (s: number) => (rnd(s) > 0.88 ? 2.6 : 1);
    const h = Math.max(o, c) + Math.pow(rnd(semilla + k * 5.31), 2.2) * v * 0.9 * larga(semilla + k * 8.1);
    const l = Math.min(o, c) - Math.pow(rnd(semilla + k * 7.77), 2.2) * v * 0.9 * larga(semilla + k * 6.3);
    const vo = 0.3 + 0.5 * rnd(semilla + k * 9.13) + Math.abs(c - o) / vol / 2.5 + (h - l) / vol / 6;
    out.push({ o, h, l, c, v: vo });
  }
  return out;
};

export type Marco = { x0: number; x1: number; y0: number; y1: number };

/** Geometría del gráfico: dónde cae cada vela y cada precio (para colocar marcas encima). */
export const geometria = (velas: Vela[], m: Marco, letra = 26) => {
  const lo = Math.min(...velas.map((v) => v.l)),
    hi = Math.max(...velas.map((v) => v.h));
  const pad = (hi - lo) * 0.12;
  const pMin = lo - pad,
    pMax = hi + pad;
  const anchoEje = letra * 4.6;
  const altoVol = (m.y1 - m.y0) * 0.11;
  const yPrecio = (p: number) => m.y0 + ((pMax - p) / (pMax - pMin)) * (m.y1 - m.y0 - altoVol - 20);
  const hueco = (m.x1 - m.x0 - anchoEje) / velas.length;
  const xVela = (k: number) => m.x0 + hueco * (k + 0.5);
  return { yPrecio, xVela, hueco, anchoEje, altoVol, pMin, pMax };
};

/** Estado de una vela en el fotograma f: se forma durante `forma` fotogramas desde que aparece. */
const enFormacion = (v: Vela, f: number, desde: number, forma: number, vivo: boolean): Vela | null => {
  if (f < desde) return null;
  const t = interpolate(f, [desde, desde + forma], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  let c = v.o + (v.c - v.o) * t;
  // en la vela viva el precio sigue respirando
  if (vivo && t >= 1) c = v.c + Math.sin((f - desde) / 4.5) * Math.abs(v.c - v.o) * 0.35 + Math.sin((f - desde) / 2.1) * 0.04;
  const h = Math.max(v.o, c, v.o + (v.h - v.o) * Math.min(1, t * 1.4));
  const l = Math.min(v.o, c, v.o + (v.l - v.o) * Math.min(1, t * 1.4));
  return { o: v.o, h, l, c, v: v.v * t };
};

export const GraficoVelas: React.FC<{
  velas: Vela[];
  marco: Marco;
  /** fotograma en que entra cada vela */
  entra: (k: number) => number;
  forma?: number;
  /** la última vela visible se queda viva (el precio respira) */
  vivo?: boolean;
  /** opacidad de cada vela (para resaltar unas y apagar otras) */
  opacidad?: (k: number) => number;
  ejes?: number;
  tema?: Tema;
  /** tamaño de los textos de los ejes */
  letra?: number;
  /** etiquetas de hora debajo (una cada `cada` velas) */
  horas?: { desde: number; paso: number; cada: number };
  volumen?: boolean;
}> = ({ velas, marco, entra, forma = 8, vivo = true, opacidad, ejes = 1, tema = OSCURO, letra = 26, horas, volumen = true }) => {
  const TV = tema;
  const f = useCurrentFrame();
  const g = geometria(velas, marco, letra);
  const vis = velas.map((v, k) => enFormacion(v, f, entra(k), forma, false));
  let ultima = -1;
  vis.forEach((v, k) => (v ? (ultima = k) : null));
  if (vivo && ultima >= 0) vis[ultima] = enFormacion(velas[ultima], f, entra(ultima), forma, true);
  const ancho = Math.max(5, g.hueco * 0.56);
  const maxVol = Math.max(...velas.map((v) => v.v));
  const xEje = marco.x1 - g.anchoEje + 14;
  const niveles = 5;
  const ultimoP = ultima >= 0 ? vis[ultima]!.c : velas[0].o;
  const sube = ultima >= 0 ? vis[ultima]!.c >= vis[ultima]!.o : true;
  const colUlt = TV.etiqueta;
  void sube;
  const yUlt = g.yPrecio(ultimoP);
  const yVolBase = marco.y1;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {/* rejilla y eje de precios */}
      <g opacity={ejes}>
        {Array.from({ length: niveles }).map((_, k) => {
          const p = g.pMin + ((g.pMax - g.pMin) * (k + 0.5)) / niveles;
          const y = g.yPrecio(p);
          return (
            <g key={k}>
              <line x1={marco.x0} x2={xEje - 14} y1={y} y2={y} stroke={alfa(TV.rejilla, 0.8)} strokeWidth={2} />
              <text x={xEje} y={y + 9} fill={TV.eje} opacity={ultima >= 0 && Math.abs(y - yUlt) < 34 ? 0 : 1} fontFamily={F.texto} fontWeight={600} fontSize={letra} style={{ fontVariantNumeric: "tabular-nums" }}>
                {numeroES(p, 2)}
              </text>
            </g>
          );
        })}
        <line x1={xEje - 14} x2={xEje - 14} y1={marco.y0} y2={marco.y1} stroke={TV.rejilla} strokeWidth={2} />
      </g>
      {/* volumen */}
      {horas &&
        velas.map((_, k) => {
          if (k % horas.cada) return null;
          const min = horas.desde + k * horas.paso;
          const t = `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
          return (
            <text key={`h${k}`} x={g.xVela(k)} y={marco.y1 + letra + 8} textAnchor="middle" fill={TV.eje} fontFamily={F.texto} fontWeight={600} fontSize={letra * 0.85} opacity={ejes}>
              {t}
            </text>
          );
        })}
      {volumen && vis.map((v, k) => {
        if (!v) return null;
        const h = (v.v / maxVol) * g.altoVol;
        const col = TV.volumen;
        return <rect key={`v${k}`} x={g.xVela(k) - ancho / 2} y={yVolBase - h} width={ancho} height={h} fill={alfa(col, v.c >= v.o ? 0.2 : 0.1)} opacity={(opacidad ? opacidad(k) : 1) * ejes} />;
      })}
      {/* velas */}
      {vis.map((v, k) => {
        if (!v) return null;
        const x = g.xVela(k);
        const alza = v.c >= v.o;
        const col = TV.borde;
        const yA = g.yPrecio(Math.max(v.o, v.c)),
          yB = g.yPrecio(Math.min(v.o, v.c));
        const alto = Math.max(3, yB - yA);
        return (
          <g key={k} opacity={opacidad ? opacidad(k) : 1}>
            <line x1={x} x2={x} y1={g.yPrecio(v.h)} y2={g.yPrecio(v.l)} stroke={col} strokeWidth={1.8} />
            <rect x={x - ancho / 2 + 1.25} y={yA} width={ancho - 2} height={alto} rx={0.5} fill={alza ? TV.alcista : TV.bajista} stroke={col} strokeWidth={2} />
          </g>
        );
      })}
      {/* último precio */}
      {ultima >= 0 && ejes > 0.05 && (
        <g opacity={ejes}>
          <line x1={marco.x0} x2={xEje - 14} y1={yUlt} y2={yUlt} stroke={colUlt} strokeWidth={2} strokeDasharray="4 8" opacity={0.85} />
          <rect x={xEje - 10} y={yUlt - letra * 0.77} width={g.anchoEje - 8} height={letra * 1.54} rx={6} fill={colUlt} />
          <text x={xEje} y={yUlt + letra * 0.35} fill={TV.etiquetaTexto} fontFamily={F.texto} fontWeight={800} fontSize={letra} style={{ fontVariantNumeric: "tabular-nums" }}>
            {numeroES(ultimoP, 2)}
          </text>
        </g>
      )}
    </svg>
  );
};

/** Anotación al estilo de la referencia: punto, línea fina en codo y etiqueta. */
export const Nota: React.FC<{ x: number; y: number; dx: number; dy: number; texto: string; desde: number; color?: string; mano?: boolean }> = ({ x, y, dx, dy, texto, desde, color = C.texto, mano = true }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const t = interpolate(f, [desde, desde + 10], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const tx = x + dx,
    ty = y + dy;
  const largo = Math.abs(dy) + Math.abs(dx);
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <circle cx={x} cy={y} r={7 * t} fill={color} />
        <path d={`M${x} ${y} L${x} ${ty} L${tx} ${ty}`} fill="none" stroke={color} strokeWidth={2.5} strokeDasharray={largo} strokeDashoffset={largo * (1 - t)} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: tx + (dx >= 0 ? 12 : -12),
          top: ty,
          transform: `translate(${dx >= 0 ? 0 : -100}%, -50%)`,
          fontFamily: mano ? F.mano : F.texto,
          fontWeight: mano ? 400 : 600,
          fontSize: mano ? 52 : 30,
          color,
          opacity: interpolate(f, [desde + 4, desde + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          whiteSpace: "nowrap",
        }}
      >
        {texto}
      </div>
    </>
  );
};
