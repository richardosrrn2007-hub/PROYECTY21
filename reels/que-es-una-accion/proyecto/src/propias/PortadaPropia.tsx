// Portada del reel con el mismo mundo del vídeo: planeta de fondo, el protagonista frente a su monitor de
// cristal con velas de Apple, y una porción de pizza que sale de la pantalla con "= 1 ACCIÓN".
import React from "react";
import { AbsoluteFill } from "remotion";
import "../motor/fuentes";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { Planeta } from "./Planeta";
import { Escritorio } from "./Escritorio";
import { GraficoVelas, serieVelas } from "./Velas";
import { CLAVE, ORO, VIVO, encajar } from "./mg";

const velas = serieVelas(34, 21, (k) => (k < 10 ? -0.5 : 0.9), 210, 1.4);

const Porcion: React.FC = () => (
  <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ position: "absolute", left: 700, top: 1020, transform: "rotate(-18deg)", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.6))" }}>
    <path d="M0 120 L-95 -95 A135 135 0 0 1 95 -95 Z" fill="#F4C65A" />
    <path d="M-95 -95 A135 135 0 0 1 95 -95" fill="none" stroke="#D08A35" strokeWidth={24} strokeLinecap="round" />
    {[[-20, -45], [30, -20], [-5, 30], [35, -70]].map(([x, y], k) => (
      <circle key={k} cx={x} cy={y} r={15} fill="#C7412C" />
    ))}
  </svg>
);

export const PortadaPropia: React.FC = () => {
  const tam = encajar("UNA ACCIÓN?", 960, 230, CLAVE);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Planeta />
      <AbsoluteFill style={{ transform: "translateY(560px) scale(0.78)", transformOrigin: "540px 262px" }}>
        <Escritorio dur={1} cabecera="AAPL · APPLE · 1D" foco={[[0, 640]]} inclina3d={0}>
          <GraficoVelas velas={velas} marco={{ x0: 110, x1: 990, y0: 330, y1: 850 }} entra={() => -100} letra={20} vivo={false} />
        </Escritorio>
      </AbsoluteFill>
      <Porcion />
      <div style={{ position: "absolute", left: 760, top: 1250, transform: "rotate(-6deg)", fontFamily: CLAVE, fontSize: 64, color: C.acentoTexto, background: ORO, padding: "0 20px", borderRadius: 12, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>= 1 ACCIÓN</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 7, color: ORO, border: `2px solid ${alfa(ORO, 0.6)}`, borderRadius: 40, padding: "10px 26px" }}>TRADING DESDE CERO</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: VIVO, fontWeight: 800, fontSize: 170, color: C.texto, letterSpacing: -3 }}>¿Qué es</div>
        <div style={{ fontFamily: CLAVE, fontSize: tam, color: ORO, marginTop: 6, textShadow: `0 0 50px ${alfa(ORO, 0.35)}` }}>UNA ACCIÓN?</div>
      </div>
    </AbsoluteFill>
  );
};
