// Piezas de motion graphics compartidas por las escenas propias de este reel:
// rejilla de fondo, trazos que se dibujan, texto que entra con máscara, etiquetas y contadores.
import React from "react";
import { Easing, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { C, ESTILO } from "../motor/actual";
import { FPS } from "../motor/constantes";
import { F, alfa } from "../motor/estilos";
import { numeroES, rnd } from "../motor/anim";

// Fuente de marca para títulos: Internet Friends (no trae tildes, ñ, ¿ ni ¡). Si un texto las lleva,
// se usa Le Jardin Secret (la fuente "mano" del estilo), que sí las tiene.
export const DISPLAY = "BRDisplay";
if (typeof document !== "undefined") {
  const h = delayRender("Cargando Internet Friends");
  const cara = new FontFace(DISPLAY, `url(${staticFile("fuentes/internet-friends.ttf")})`);
  (document.fonts as unknown as { add: (c: FontFace) => void }).add(cara);
  cara.load().then(() => continueRender(h));
}
/** Tipografía de las etiquetas del gráfico (más profesional): Space Grotesk 700. */
export const PRO = "BRPro";
if (typeof document !== "undefined") {
  const h = delayRender("Cargando Space Grotesk");
  const cara = new FontFace(PRO, `url(${staticFile("fuentes/space-grotesk-latin-700-normal.woff2")})`, { weight: "700" });
  (document.fonts as unknown as { add: (c: FontFace) => void }).add(cara);
  cara.load().then(() => continueRender(h));
}
const SIN_GLIFO = /[áéíóúÁÉÍÓÚñÑ¿¡üÜ%€]/;
/** Fuente de título para un grupo de textos: Internet Friends si todos se pueden escribir con ella. */
export const fuenteTitulo = (textos: string[]) => (textos.some((t) => SIN_GLIFO.test(t)) ? F.mano : DISPLAY);
export const pesoDe = (fuente: string) => (fuente === F.titulo ? ESTILO.fuentes.titulo.peso : fuente === F.texto ? 800 : 400);

export const ORO = C.acento;
export const VERDE = C.exito;
export const ROJO = C.error;

/** Progreso 0→1 con curva, entre el fotograma a y a+d. */
export const pr = (f: number, a: number, d = 12, ease = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** Muelle 0→1 (con rebote) desde el fotograma a. */
export const sp = (f: number, a: number, cfg = { damping: 12, stiffness: 170, mass: 0.6 }) => (f < a ? 0 : spring({ frame: f - a, fps: FPS, config: cfg }));

/** Temblor de cámara que decae tras el fotograma `en`. */
export const temblor = (f: number, en: number, fuerza = 14, dur = 10) => {
  const e = f - en;
  if (e < 0 || e > dur) return { x: 0, y: 0 };
  const k = (1 - e / dur) * fuerza;
  return { x: Math.sin(e * 2.7) * k, y: Math.cos(e * 3.3) * k * 0.7 };
};

/** Fondo limpio como la referencia: solo una viñeta suave que oscurece los bordes (sin rejilla). */
export const Rejilla: React.FC<{ op?: number; color?: string }> = () => (
  <div style={{ position: "absolute", left: -200, right: -200, top: -600, bottom: -600, background: "radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,0.55) 100%)" }} />
);

/** Trazo SVG que se dibuja de 0 a 1 (usa pathLength=1). */
export const Trazo: React.FC<{ d: string; p: number; color?: string; grosor?: number; relleno?: string; op?: number; guion?: boolean; cap?: "round" | "butt" }> = ({
  d,
  p,
  color = ORO,
  grosor = 6,
  relleno = "none",
  op = 1,
  guion = false,
  cap = "round",
}) =>
  p <= 0 ? null : (
    <path
      d={d}
      pathLength={1}
      fill={relleno}
      stroke={color}
      strokeWidth={grosor}
      strokeLinecap={cap}
      strokeLinejoin="round"
      strokeDasharray={guion ? "0.014 0.012" : "1 1"}
      strokeDashoffset={guion ? 0 : 1 - p}
      opacity={guion ? op * p : op}
    />
  );

/** Ancho de un texto en la fuente del título. */
export const ancho = (t: string, tam: number, fuente: string = F.titulo, peso = ESTILO.fuentes.titulo.peso, esp = -0.02) =>
  measureText({ text: t, fontFamily: fuente, fontWeight: String(peso), fontSize: tam, letterSpacing: `${esp * tam}px`, validateFontIsLoaded: false }).width;

/** Tamaño de letra para que `t` quepa en `max` px (sin pasar de `tope`). */
export const encajar = (t: string, max: number, tope: number, fuente: string = F.titulo) => Math.min(tope, (tope * max) / Math.max(1, ancho(t, tope, fuente, pesoDe(fuente), fuente === F.titulo ? -0.02 : 0)));

/** Palabra que sube desde detrás de una máscara (entrada típica de motion graphics). */
export const Revela: React.FC<{ desde: number; children: React.ReactNode; tam: number; color?: string; fuente?: string; dur?: number; giro?: number; esp?: number }> = ({
  desde,
  children,
  tam,
  color = C.texto,
  fuente = F.titulo,
  dur = 10,
  giro = 6,
  esp = -0.02,
}) => {
  const f = useCurrentFrame();
  const k = pr(f, desde, dur, Easing.out(Easing.exp));
  if (f < desde) return <span style={{ display: "inline-block", height: tam * 1.05 }} />;
  return (
    <span style={{ display: "inline-block", overflow: "hidden", lineHeight: 1.05, paddingBottom: tam * 0.06, verticalAlign: "top" }}>
      <span
        style={{
          display: "inline-block",
          fontFamily: fuente,
          fontWeight: pesoDe(fuente),
          fontSize: tam,
          letterSpacing: fuente === F.titulo ? esp * tam : 0,
          color,
          transform: `translateY(${(1 - k) * 110}%) rotate(${(1 - k) * giro}deg)`,
          transformOrigin: "0% 100%",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** Etiqueta pequeña en mayúsculas con raya dorada que se dibuja debajo. */
export const Etiqueta: React.FC<{ desde: number; x: number; y: number; texto: string; color?: string; tam?: number; centro?: boolean }> = ({ desde, x, y, texto, color = ORO, tam = 30, centro = true }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const k = pr(f, desde, 10);
  const n = Math.round(texto.length * pr(f, desde, 12, Easing.linear));
  return (
    <div style={{ position: "absolute", left: centro ? x - 500 : x, top: y, width: centro ? 1000 : undefined, textAlign: centro ? "center" : "left" }}>
      <div style={{ display: "inline-block", fontFamily: F.texto, fontWeight: 800, fontSize: tam, letterSpacing: tam * 0.28, color, opacity: k, whiteSpace: "nowrap" }}>
        {texto.slice(0, n)}
        <span style={{ opacity: 0 }}>{texto.slice(n)}</span>
        <div style={{ height: 3, background: color, marginTop: 10, width: `${k * 100}%`, marginLeft: centro ? `${(1 - k) * 50}%` : 0 }} />
      </div>
    </div>
  );
};

/** Número que cuenta entre dos valores. */
export const Cuenta: React.FC<{ desde: number; dur?: number; de: number; a: number; dec?: number; prefijo?: string; sufijo?: string; tam: number; color?: string; signo?: boolean }> = ({
  desde,
  dur = 18,
  de,
  a,
  dec = 0,
  prefijo = "",
  sufijo = "",
  tam,
  color = C.texto,
  signo = false,
}) => {
  const f = useCurrentFrame();
  const v = de + (a - de) * pr(f, desde, dur, Easing.out(Easing.cubic));
  const s = signo && v > 0 ? "+" : "";
  return (
    <span style={{ fontFamily: F.titulo, fontWeight: ESTILO.fuentes.titulo.peso, fontSize: tam, color, letterSpacing: -0.03 * tam, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
      {prefijo}
      {s}
      {numeroES(v, dec)}
      {sufijo}
    </span>
  );
};

/** Chispas que salen disparadas desde un punto. */
export const Chispas: React.FC<{ desde: number; x: number; y: number; n?: number; color?: string; r?: number }> = ({ desde, x, y, n = 14, color = ORO, r = 170 }) => {
  const f = useCurrentFrame();
  const e = f - desde;
  if (e < 0 || e > 20) return null;
  const t = Easing.out(Easing.cubic)(e / 20);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, k) => {
        const a = (k / n) * Math.PI * 2 + rnd(k + desde) * 0.5;
        const r0 = r * 0.35 + r * 0.6 * t;
        const r1 = r0 + 26 * (1 - t);
        return <line key={k} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke={color} strokeWidth={5} strokeLinecap="round" opacity={1 - t} />;
      })}
    </svg>
  );
};

/** Caja con borde fino dorado y texto: chips de datos. */
export const Caja: React.FC<{ x: number; y: number; desde: number; children: React.ReactNode; color?: string; fondo?: string; tam?: number; centro?: boolean; escala?: number }> = ({
  x,
  y,
  desde,
  children,
  color = ORO,
  fondo = alfa(C.tarjeta, 0.92),
  tam = 34,
  centro = true,
  escala = 1,
}) => {
  const f = useCurrentFrame();
  const k = sp(f, desde);
  if (k <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${centro ? -50 : 0}%, -50%) scale(${k * escala})`,
        background: fondo,
        border: `3px solid ${color}`,
        color,
        borderRadius: 16,
        padding: `${tam * 0.4}px ${tam * 0.6}px`,
        fontFamily: F.texto,
        fontWeight: 800,
        fontSize: tam,
        letterSpacing: tam * 0.06,
        whiteSpace: "nowrap",
        boxShadow: `0 0 40px ${alfa(color, 0.25)}`,
        display: "flex",
        alignItems: "center",
        gap: tam * 0.4,
      }}
    >
      {children}
    </div>
  );
};

/** Halo radial (luz) detrás de un objeto. */
export const Halo: React.FC<{ x: number; y: number; r: number; color?: string; op?: number }> = ({ x, y, r, color = ORO, op = 0.28 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${alfa(color, op)} 0%, ${alfa(color, 0)} 70%)` }} />
);
