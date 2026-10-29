// Portada del vídeo 4 (El doji): el doji grande sobre el planeta, con el rango del oro marcado detrás,
// el barrido por debajo y la pregunta del vídeo. Mismo mundo que la serie: planeta de fondo y letras de la serie.
import React from "react";
import { AbsoluteFill } from "remotion";
import "../motor/fuentes";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { Planeta } from "./Planeta";
import { CLAVE, ORO, VIVO, encajar } from "./mg";

const CREMA = "#F2E8D5";
const TINTA = "#16120E";

export const PortadaPropia: React.FC = () => {
  const tam = encajar("¿O TRAMPA?", 980, 210, CLAVE);
  const X = 540;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Planeta />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={X} cy={1250} r={360} fill={alfa(ORO, 0.12)} />
        {/* el rango (C1) y el barrido por debajo */}
        <rect x={170} y={1060} width={740} height={340} fill={alfa(ORO, 0.12)} stroke={ORO} strokeWidth={5} strokeDasharray="18 12" />
        <line x1={170} x2={910} y1={1530} y2={1530} stroke={C.error} strokeWidth={5} strokeDasharray="14 10" />
        {/* el doji */}
        <line x1={X} x2={X} y1={860} y2={1570} stroke={CREMA} strokeWidth={14} strokeLinecap="round" />
        <rect x={X - 120} y={1222} width={240} height={18} rx={6} fill={CREMA} />
        <circle cx={X} cy={1570} r={22} fill={C.error} />
      </svg>
      <div style={{ position: "absolute", left: 130, top: 1450, transform: "rotate(-4deg)", fontFamily: CLAVE, fontSize: 46, color: CREMA, background: TINTA, border: `3px solid ${C.error}`, padding: "0 16px", borderRadius: 10 }}>BARRIDO</div>
      <div style={{ position: "absolute", left: 730, top: 990, transform: "rotate(4deg)", fontFamily: CLAVE, fontSize: 46, color: TINTA, background: CREMA, padding: "0 16px", borderRadius: 10 }}>ORO REAL</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", gap: 14 }}>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 7, color: ORO, border: `2px solid ${alfa(ORO, 0.6)}`, borderRadius: 40, padding: "10px 26px" }}>TRADING DESDE CERO</div>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: TINTA, background: ORO, borderRadius: 40, padding: "10px 22px" }}>DOJI · 1/3</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: VIVO, fontWeight: 800, fontSize: 160, color: C.texto, letterSpacing: -3 }}>¿Señal…</div>
        <div style={{ fontFamily: CLAVE, fontSize: tam, color: ORO, marginTop: 6, textShadow: `0 0 50px ${alfa(ORO, 0.35)}` }}>¿O TRAMPA?</div>
      </div>
    </AbsoluteFill>
  );
};
