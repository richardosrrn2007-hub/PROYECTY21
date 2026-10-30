// Portada del vídeo 6 (Los 5 tipos de CRT): «¿Solo 3 velas?» y los cinco diagramas en tarjetas.
// Mismo mundo de la serie: planeta de fondo y letras de la serie. Todo dentro del recorte 3:4 (y 240–1680).
import React from "react";
import { AbsoluteFill } from "remotion";
import "../motor/fuentes";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { Planeta } from "./Planeta";
import { CLAVE, ORO, PRINCIPAL, VIVO, encajar } from "./mg";
import { Diagrama, TIPOS } from "./Tipos";

const CREMA = "#F2E8D5";
const TINTA = "#16120E";
const W = 320,
  H = 300;
const POS = [
  [30, 640],
  [380, 640],
  [730, 640],
  [205, 970],
  [555, 970],
];

export const PortadaPropia: React.FC = () => {
  const tam = encajar("¿SOLO 3 VELAS?", 980, 200, CLAVE);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Planeta />
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", gap: 14 }}>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 7, color: ORO, border: `2px solid ${alfa(ORO, 0.6)}`, borderRadius: 40, padding: "10px 26px" }}>TRADING DESDE CERO</div>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: TINTA, background: ORO, borderRadius: 40, padding: "10px 22px" }}>CRT · PARTE 3</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: CLAVE, fontSize: tam, color: ORO, textShadow: `0 0 50px ${alfa(ORO, 0.35)}` }}>¿SOLO 3 VELAS?</div>
        <div style={{ fontFamily: VIVO, fontWeight: 800, fontSize: 100, color: C.texto, letterSpacing: -2, marginTop: 10 }}>Los 5 tipos de CRT</div>
      </div>
      {Object.values(TIPOS).map((T, k) => {
        const [x, y] = POS[k];
        return (
          <div key={T.num} style={{ position: "absolute", left: x, top: y, width: W, height: H, borderRadius: 24, border: `3px solid ${alfa(ORO, 0.6)}`, background: alfa("#0E0C0A", 0.92), overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 20, top: 10, fontFamily: PRINCIPAL, fontSize: 56, color: ORO }}>{T.num}</div>
            <AbsoluteFill style={{ transform: `translate(${-x}px, ${-y}px)` }}>
              <Diagrama T={T} a={{ x: x + 10, y: y + 70, w: W - 30, h: H - 90 }} b1={60} b2={100} etiquetas={false} grosor={3.5} quieto />
            </AbsoluteFill>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, textAlign: "center" }}>
        <span style={{ fontFamily: CLAVE, fontSize: 64, color: TINTA, background: CREMA, borderRadius: 14, padding: "4px 28px" }}>GUÁRDALO</span>
      </div>
    </AbsoluteFill>
  );
};
