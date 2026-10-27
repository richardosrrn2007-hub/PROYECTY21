// Portada del vídeo 2 (Cómo leer una vela): el toro y el oso musculosos tiran de la cuerda y en medio queda
// la vela blanca de cuerpo largo del gancho. Mismo mundo que el vídeo: planeta de fondo y letras de la serie.
import React from "react";
import { AbsoluteFill } from "remotion";
import "../motor/fuentes";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { Planeta } from "./Planeta";
import { Oso, Toro } from "./Batalla";
import { CLAVE, ORO, VIVO, encajar } from "./mg";

const CREMA = "#F2E8D5";
const TINTA = "#16120E";

export const PortadaPropia: React.FC = () => {
  const tam = encajar("ESTA BATALLA?", 980, 200, CLAVE);
  const yToro = 840,
    yOso = 1600,
    esc = 0.92;
  const top = 1110,
    bot = 1330;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Planeta />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={540} cy={1220} r={330} fill={alfa(ORO, 0.1)} />
        <line x1={540} x2={540} y1={yToro + 235 * esc} y2={yOso - 150 * esc} stroke={ORO} strokeWidth={9} />
        <line x1={540} x2={540} y1={top - 60} y2={bot + 50} stroke={CREMA} strokeWidth={9} />
        <rect x={430} y={top} width={220} height={bot - top} rx={5} fill={CREMA} stroke={CREMA} strokeWidth={5} />
        <circle cx={540} cy={top} r={18} fill={ORO} stroke={TINTA} strokeWidth={3} />
        <Toro x={540} y={yToro} esc={esc} animo="tira" />
        <Oso x={540} y={yOso} esc={esc} animo="tira" />
      </svg>
      <div style={{ position: "absolute", left: 740, top: 900, transform: "rotate(-5deg)", fontFamily: CLAVE, fontSize: 48, color: TINTA, background: CREMA, padding: "0 16px", borderRadius: 10 }}>COMPRAN</div>
      <div style={{ position: "absolute", left: 750, top: 1530, transform: "rotate(5deg)", fontFamily: CLAVE, fontSize: 48, color: CREMA, background: TINTA, border: `3px solid ${CREMA}`, padding: "0 16px", borderRadius: 10 }}>VENDEN</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", gap: 14 }}>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 7, color: ORO, border: `2px solid ${alfa(ORO, 0.6)}`, borderRadius: 40, padding: "10px 26px" }}>TRADING DESDE CERO</div>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: TINTA, background: ORO, borderRadius: 40, padding: "10px 22px" }}>PARTE 2</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: VIVO, fontWeight: 800, fontSize: 160, color: C.texto, letterSpacing: -3 }}>¿Quién ganó</div>
        <div style={{ fontFamily: CLAVE, fontSize: tam, color: ORO, marginTop: 6, textShadow: `0 0 50px ${alfa(ORO, 0.35)}` }}>ESTA BATALLA?</div>
      </div>
    </AbsoluteFill>
  );
};
