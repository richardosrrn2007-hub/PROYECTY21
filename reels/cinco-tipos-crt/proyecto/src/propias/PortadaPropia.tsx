// Portada del vídeo 5 (CRT paso a paso): la vela gigante del barrido rompiendo «tu stop» y el Banco
// haciendo «no, no» con el dedo. Mismo mundo de la serie: planeta de fondo y letras de la serie.
import React from "react";
import { AbsoluteFill } from "remotion";
import "../motor/fuentes";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { Planeta } from "./Planeta";
import { Banco } from "./Banco";
import { CLAVE, ORO, VIVO, encajar } from "./mg";

const CREMA = "#F2E8D5";
const TINTA = "#16120E";

export const PortadaPropia: React.FC = () => {
  const tam = encajar("¿TE BARRIERON?", 980, 200, CLAVE);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Planeta />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={420} cy={1180} r={340} fill={alfa(ORO, 0.12)} />
        {/* tu stop, roto */}
        <line x1={40} x2={420} y1={1300} y2={1330} stroke={C.error} strokeWidth={10} />
        <line x1={460} x2={1040} y1={1350} y2={1300} stroke={C.error} strokeWidth={10} />
        {/* la vela del barrido */}
        <line x1={420} x2={420} y1={820} y2={1560} stroke={CREMA} strokeWidth={20} strokeLinecap="round" />
        <rect x={290} y={1000} width={260} height={22} rx={6} fill={CREMA} />
        <Banco x={800} y={1320} esc={1.25} gesto="no" desde={-40} />
      </svg>
      <div style={{ position: "absolute", left: 60, top: 1380, transform: "rotate(-4deg)", fontFamily: CLAVE, fontSize: 50, color: CREMA, background: C.error, padding: "0 18px", borderRadius: 10 }}>TU STOP</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", gap: 14 }}>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 7, color: ORO, border: `2px solid ${alfa(ORO, 0.6)}`, borderRadius: 40, padding: "10px 26px" }}>TRADING DESDE CERO</div>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: TINTA, background: ORO, borderRadius: 40, padding: "10px 22px" }}>CRT · PARTE 2</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: CLAVE, fontSize: tam, color: ORO, textShadow: `0 0 50px ${alfa(ORO, 0.35)}` }}>¿TE BARRIERON?</div>
        <div style={{ fontFamily: VIVO, fontWeight: 800, fontSize: 110, color: C.texto, letterSpacing: -2, marginTop: 10 }}>CRT paso a paso</div>
      </div>
    </AbsoluteFill>
  );
};
