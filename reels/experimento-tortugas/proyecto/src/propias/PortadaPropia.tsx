// Portada del vídeo 6 (experimento Turtle): tortuga dorada bajo el titular.
import React from "react";
import { AbsoluteFill } from "remotion";
import "../motor/fuentes";
import { F, alfa } from "../motor/estilos";
import { CLAVE, encajar } from "./mg";
import { ORO, PLATA } from "./Soros";
import { FondoTortuga, TortugaOro } from "./Tortugas";

export const PortadaPropia: React.FC = () => {
  const tam = encajar("175 MILLONES", 960, 210, CLAVE);
  return (
    <AbsoluteFill>
      <FondoTortuga />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={540} cy={1500} rx={430} ry={46} fill="#000" opacity={0.45} />
        <TortugaOro x={540} y={1290} esc={3.4} anda={0} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 7, color: PLATA, border: `2px solid ${alfa(PLATA, 0.6)}`, borderRadius: 40, padding: "10px 26px" }}>TRADING DESDE CERO</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 340, textAlign: "center", lineHeight: 1.02 }}>
        <div style={{ fontFamily: CLAVE, fontSize: 130, color: PLATA }}>23 NOVATOS</div>
        <div style={{ fontFamily: CLAVE, fontSize: tam, color: "#0A0F1E", background: ORO, display: "inline-block", padding: "0 26px", transform: "rotate(-2deg)" }}>175 MILLONES</div>
        <div style={{ fontFamily: CLAVE, fontSize: 130, color: ORO, marginTop: 8 }}>5 REGLAS</div>
      </div>
    </AbsoluteFill>
  );
};
