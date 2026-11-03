// Portada del vídeo 5 (Soros, Miércoles Negro): silueta de espaldas frente a la luna roja y Londres.
import React from "react";
import { AbsoluteFill } from "remotion";
import "../motor/fuentes";
import { F, alfa } from "../motor/estilos";
import { CLAVE, encajar } from "./mg";
import { FondoNoche, Hombre, Londres, Luna, ORO, PLATA } from "./Soros";

export const PortadaPropia: React.FC = () => {
  const tam = encajar("1.000 MILLONES", 960, 210, CLAVE);
  return (
    <AbsoluteFill>
      <FondoNoche sinLuna={[[-100, 100000]]} />
      <Luna x={540} y={1050} r={330} />
      <div style={{ position: "absolute", inset: 0, transform: "translateX(-250px)" }}>
        <Londres base={1560} color="#03050B" esc={1.3} />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: "translateX(830px)" }}>
        <Londres base={1560} color="#03050B" esc={1.3} />
      </div>
      <Hombre x={540} y={1920} esc={1.45} borde={PLATA} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 7, color: PLATA, border: `2px solid ${alfa(PLATA, 0.6)}`, borderRadius: 40, padding: "10px 26px" }}>TRADING DESDE CERO</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 340, textAlign: "center", lineHeight: 1.02 }}>
        <div style={{ fontFamily: CLAVE, fontSize: 130, color: PLATA }}>GANÓ</div>
        <div style={{ fontFamily: CLAVE, fontSize: tam, color: "#0A0F1E", background: ORO, display: "inline-block", padding: "0 26px", transform: "rotate(-2deg)" }}>1.000 MILLONES</div>
        <div style={{ fontFamily: CLAVE, fontSize: 130, color: ORO, marginTop: 8 }}>EN UN DÍA</div>
      </div>
    </AbsoluteFill>
  );
};
