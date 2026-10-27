// Subtítulos arriba, al estilo de las explicaciones "hechas con código": palabras grises que entran al ritmo
// de la voz y las palabras clave en blanco dentro de una caja de selección dorada (como en Figma).
import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { F } from "../motor/estilos";
import { useFuentes } from "../motor/fuentes";
import { paginasLinea } from "../motor/Subtitulos";
import type { FraseT } from "../tipos";
import { C } from "../motor/actual";
import { CLAVE, PRO, VIVO } from "./mg";

/** Color de la caja de selección (el dorado de la marca). */
const MARCO = C.acento;
const TAM = 50;
/** Letra de las palabras normales del subtítulo. */
const SUB_FUENTE = F.texto;
const SUB_PESO = 600;

const Esquina: React.FC<{ x: "left" | "right"; y: "top" | "bottom" }> = ({ x, y }) => (
  <div style={{ position: "absolute", [x]: -6, [y]: -6, width: 10, height: 10, borderRadius: 5, background: C.texto, border: `2px solid ${MARCO}` }} />
);

export const SubArriba: React.FC<{ frases: FraseT[]; sin: number[]; top?: number }> = ({ frases, sin, top = 215 }) => {
  const f = useCurrentFrame();
  const listas = useFuentes();
  const paginas = useMemo(() => (listas ? paginasLinea(frases, new Set(sin)) : []), [listas, frases, sin]);
  const pag = paginas.find((p) => f >= p.inicio && f < p.fin);
  if (!pag) return null;
  const sale = interpolate(f, [pag.fin - 4, pag.fin], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", columnGap: TAM * 0.26, rowGap: 14, opacity: sale }}>
      {pag.grupos.map((g, k) => {
        const a = g.palabras[0].aparece;
        if (f < a) return null;
        const t = interpolate(f, [a, a + 6], [0, 1], { extrapolateRight: "clamp" });
        const texto = g.palabras.map((p) => p.w.replace(/\*/g, "")).join(" ");
        const base: React.CSSProperties = { fontFamily: SUB_FUENTE, fontSize: TAM, lineHeight: 1.15, whiteSpace: "nowrap", opacity: t, transform: `translateY(${(1 - t) * 10}px)` };
        if (!g.clave) return <span key={k} style={{ ...base, fontWeight: SUB_PESO, color: C.suave }}>{texto}</span>;
        const caja = interpolate(f, [a, a + 7], [0.85, 1], { extrapolateRight: "clamp" });
        return (
          <span key={k} style={{ ...base, position: "relative", fontFamily: CLAVE, fontWeight: 400, fontSize: TAM * 1.12, letterSpacing: 1, textTransform: "uppercase", color: C.acento, padding: "0 10px" }}>
            <span style={{ position: "absolute", inset: "-2px 0", border: `2px solid ${MARCO}`, transform: `scale(${caja})`, opacity: t }}>
              <Esquina x="left" y="top" />
              <Esquina x="right" y="top" />
              <Esquina x="left" y="bottom" />
              <Esquina x="right" y="bottom" />
            </span>
            {texto}
          </span>
        );
      })}
    </div>
  );
};
