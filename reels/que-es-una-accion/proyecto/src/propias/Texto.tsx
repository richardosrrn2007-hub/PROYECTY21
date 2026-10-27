// Escenas de texto: el gancho (edificio que se parte en acciones) y la tipografía cinética de las frases puente.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import { rnd } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { Escritorio } from "./Escritorio";
import { arr } from "../escenas/util";
import { CLAVE, PRO, Chispas, Etiqueta, Halo, ORO, ROJO, Rejilla, Revela, Trazo, ancho, encajar, fuenteTitulo, pesoDe, pr, sp, temblor } from "./mg";

// ---------------------------------------------------------------- edificio

/** Edificio dibujado con líneas, partido en 4 columnas (las "acciones") que se pueden separar. */
export const Edificio: React.FC<{ cx: number; base: number; esc?: number; dibujo: number; ventanas: number; separa?: number; resalta?: number; op?: number; encender?: number }> = ({
  cx,
  base,
  esc = 1,
  dibujo,
  ventanas,
  separa = 0,
  resalta = 0,
  op = 1,
  encender = 1e9,
}) => {
  const f = useCurrentFrame();
  // rascacielos moderno de oficinas: cuatro bloques de alturas distintas (la columna 2 es la más alta y es
  // la "acción" que se separa), ventanas en cuadrícula y una antena arriba
  const anchoCol = 105;
  const ALTOS = [380, 460, 520, 420];
  const x0 = -2 * anchoCol;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }}>
      <g transform={`translate(${cx},${base}) scale(${esc})`}>
        {[0, 1, 2, 3].map((c) => {
          const alto = ALTOS[c];
          const dx = (c - 1.5) * 46 * separa;
          const dy = c === 2 ? -40 * resalta : 0;
          const x = x0 + c * anchoCol;
          const oro = c === 2 && resalta > 0;
          const filas = Math.floor((alto - 70) / 62);
          return (
            <g key={c} transform={`translate(${dx},${dy})`}>
              {oro && <rect x={x} y={-alto} width={anchoCol} height={alto} fill={alfa(ORO, 0.22 * resalta)} />}
              <Trazo d={`M${x} 0 L${x} ${-alto} L${x + anchoCol} ${-alto} L${x + anchoCol} 0 Z`} p={dibujo} grosor={oro ? 8 : 6} />
              {c === 2 && <Trazo d={`M${x + anchoCol / 2} ${-alto} L${x + anchoCol / 2} ${-alto - 70}`} p={dibujo} grosor={5} />}
              {c === 2 && dibujo > 0.9 && <circle cx={x + anchoCol / 2} cy={-alto - 74} r={7} fill={ORO} opacity={0.6 + 0.4 * Math.sin(f / 5)} />}
              {Array.from({ length: filas }).map((_, r) =>
                [0, 1].map((w) => {
                  const k = sp(f, ventanas + (c * filas + r) * 0.8);
                  const luz = f >= encender + (r * 4 + c) * 1.2;
                  if (k <= 0 || (c === 1 && r >= filas - 2)) return null;
                  return <rect key={`${r}-${w}`} x={x + 18 + w * 40} y={-alto + 34 + r * 62} width={29} height={34} rx={3} fill={oro || luz ? ORO : alfa(ORO, 0.3)} style={{ transformBox: "fill-box", transformOrigin: "center", transform: `scale(${k})` }} />;
                }),
              )}
              {c === 1 && <Trazo d={`M${x + 22} 0 L${x + 22} -100 L${x + 83} -100 L${x + 83} 0 M${x + 52} 0 L${x + 52} -100`} p={pr(f, ventanas, 12)} grosor={5} />}
            </g>
          );
        })}
        <Trazo d={`M${x0 - 60} 0 L${-x0 + 60} 0`} p={dibujo} grosor={7} />
      </g>
    </svg>
  );
};

const Gancho: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0, b1, b2, b3] = b;
  const t = temblor(f, b3, 16);
  const fz = fuenteTitulo();
  const tam1 = encajar("Dueño de", 760, 120, fz);
  const tam2 = encajar("UNA EMPRESA", 860, 150, CLAVE);
  const tachon = pr(f, b3 + 3, 8);
  const sello = sp(f, b3, { damping: 9, stiffness: 220, mass: 0.6 });
  const aleja = pr(f, 0, Math.max(20, b1 + 6), Easing.inOut(Easing.cubic));
  const sale = pr(f, b2, 16, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px,${t.y}px)` }}>
      <Rejilla />
      {/* el protagonista ya está frente a su monitor desde el primer segundo */}
      {/* la cámara empieza dentro de la pantalla y se aleja hasta mostrarlo a él */}
      <AbsoluteFill style={{ transform: `translateY(${372 * aleja - 120 * (1 - aleja)}px) scale(${0.62 + 0.63 * (1 - aleja)})`, transformOrigin: "540px 262px" }}>
        <Escritorio dur={dur} foco={[[0, 540]]} asiente={[b1, b3]} cabecera="APPLE · EMPRESA">
          <Halo x={540} y={600} r={380} op={0.18 + 0.12 * pr(f, b1, 10)} />
          <Edificio cx={540} base={830} esc={0.9} dibujo={pr(f, 0, 10, Easing.out(Easing.cubic))} ventanas={10} encender={b1 + 4} separa={pr(f, b2, 12, Easing.out(Easing.back(1.6)))} resalta={pr(f, b2 + 6, 10)} />
          <Chispas desde={b2 + 2} x={540} y={640} n={16} r={260} />
        </Escritorio>
        {/* una columna (una acción) sale de la pantalla flotando */}
        {sale > 0 && (
          <div style={{ position: "absolute", left: 540, top: 362, width: 95, height: 468, transform: `translate(${300 * sale}px, ${190 * sale - 40 * Math.sin(sale * Math.PI)}px) scale(${1 + 0.22 * sale}) rotate(${8 * sale + Math.sin(f / 8) * 2 * sale}deg)`, transformOrigin: "50% 100%", border: `5px solid ${ORO}`, background: alfa(ORO, 0.22), boxShadow: `0 0 50px ${alfa(ORO, 0.5)}`, borderRadius: 4 }}>
            {Array.from({ length: 7 }).map((_, r) =>
              [0, 1].map((w) => <div key={`${r}-${w}`} style={{ position: "absolute", left: 15 + w * 36, top: 30 + r * 56, width: 26, height: 30, borderRadius: 3, background: ORO }} />),
            )}
            <div style={{ position: "absolute", left: "50%", top: "100%", marginTop: 22, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: CLAVE, fontSize: 52, color: C.acentoTexto, background: ORO, padding: "0 16px", borderRadius: 10, opacity: pr(f, b2 + 8, 8) }}>1 ACCIÓN</div>
          </div>
        )}
      </AbsoluteFill>
      <Etiqueta desde={-20} x={540} y={190} texto="¿TE IMAGINAS SER…" tam={28} />
      <div style={{ position: "absolute", top: 245, left: 0, right: 0, textAlign: "center" }}>
        <div>
          <Revela desde={b0 - 2} tam={tam1} fuente={fz}>
            Dueño de
          </Revela>
        </div>
        <div>
          <Revela desde={b1 - 3} tam={tam2} color={ORO} fuente={CLAVE}>
            UNA EMPRESA
          </Revela>
        </div>
      </div>
      <div style={{ position: "absolute", top: 548, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        <Revela desde={b2} tam={50} color={C.texto} fuente={fz}>
          sin comprarla
        </Revela>
        {f >= b3 && (
          <div style={{ position: "relative", transform: `scale(${0.6 + 0.4 * sello}) rotate(${-4 * sello}deg)` }}>
            <div style={{ fontFamily: CLAVE, fontSize: 54, color: C.acentoTexto, background: ORO, padding: "0 16px", borderRadius: 10 }}>ENTERA</div>
            <div style={{ position: "absolute", left: -10, top: "50%", height: 8, width: `${tachon * 108}%`, background: ROJO, borderRadius: 5, transform: "rotate(-6deg)" }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const gancho: DefEscena = {
  C: Gancho,
  momentos: 4,
  alInicio: () => true,
  sonidos: () => [
    [0, "whoosh", 0.3],
    [1, "pop", 0.3],
    [2, "swoosh", 0.32],
    [3, "golpe", 0.4],
  ],
};

// ---------------------------------------------------------------- tipografía cinética

type Efecto = "subir" | "glitch" | "giro" | "zoom" | "brillo" | "pregunta" | "enorme" | "sello";
const DORADOS: Efecto[] = ["zoom", "brillo", "pregunta", "enorme"];

const Linea: React.FC<{ palabras: string[]; desde: number; efecto: Efecto; tam: number; fuente: string }> = ({ palabras, desde, efecto, tam, fuente }) => {
  const f = useCurrentFrame();
  if (f < desde) return <div style={{ height: tam * 1.1 }} />;
  const e = f - desde;
  const color = efecto === "sello" ? ROJO : DORADOS.includes(efecto) ? ORO : C.texto;
  const texto = palabras.join(" ");
  if (efecto === "zoom") {
    const k = pr(f, desde, 9, Easing.out(Easing.exp));
    return (
      <div style={{ height: tam * 1.1, fontFamily: fuente, fontWeight: pesoDe(fuente), fontSize: tam, color, letterSpacing: -0.02 * tam, lineHeight: 1.05, transform: `scale(${3 - 2 * k})`, opacity: k, filter: k < 1 ? `blur(${(1 - k) * 18}px)` : undefined, whiteSpace: "nowrap" }}>
        {texto}
      </div>
    );
  }
  if (efecto === "giro") {
    const k = sp(f, desde, { damping: 11, stiffness: 160, mass: 0.6 });
    return <div style={{ height: tam * 1.1, fontFamily: fuente, fontWeight: pesoDe(fuente), fontSize: tam, color, letterSpacing: -0.02 * tam, lineHeight: 1.05, transform: `perspective(900px) rotateX(${(1 - k) * 90}deg)`, transformOrigin: "50% 100%", whiteSpace: "nowrap" }}>{texto}</div>;
  }
  if (efecto === "sello") {
    const k = sp(f, desde, { damping: 9, stiffness: 240, mass: 0.7 });
    return (
      <div style={{ height: tam * 1.25, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: fuente, fontWeight: pesoDe(fuente), fontSize: tam, color, letterSpacing: 0.02 * tam, lineHeight: 1, border: `8px solid ${color}`, borderRadius: 18, padding: `${tam * 0.12}px ${tam * 0.25}px`, transform: `scale(${2.2 - 1.2 * k}) rotate(${-7 * Math.min(1, k)}deg)`, opacity: Math.min(1, k * 1.6), whiteSpace: "nowrap", boxShadow: `0 0 50px ${alfa(color, 0.3)}` }}>
          {texto}
        </div>
      </div>
    );
  }
  // subir / glitch / brillo / pregunta / enorme: palabra a palabra con máscara
  let acum = 0;
  const glitch = efecto === "glitch" && e < 14;
  return (
    <div style={{ position: "relative", height: tam * 1.1, whiteSpace: "nowrap", transform: glitch ? `translateX(${(rnd(e) - 0.5) * 30}px) skewX(${(rnd(e + 9) - 0.5) * 16}deg)` : undefined }}>
      {glitch && (
        <>
          <div style={{ position: "absolute", inset: 0, fontFamily: fuente, fontWeight: pesoDe(fuente), fontSize: tam, color: "#FF2E63", opacity: 0.7, transform: `translateX(${-10 - rnd(e + 3) * 12}px)`, letterSpacing: -0.02 * tam, mixBlendMode: "screen" }}>{texto}</div>
          <div style={{ position: "absolute", inset: 0, fontFamily: fuente, fontWeight: pesoDe(fuente), fontSize: tam, color: "#2EE6FF", opacity: 0.7, transform: `translateX(${10 + rnd(e + 5) * 12}px)`, letterSpacing: -0.02 * tam, mixBlendMode: "screen" }}>{texto}</div>
        </>
      )}
      <div style={{ position: "relative" }}>
        {palabras.map((w, k) => {
          const d = desde + acum;
          acum += 4;
          return (
            <span key={k} style={{ display: "inline-block", marginLeft: k > 0 ? tam * 0.26 : 0 }}>
              <Revela desde={d} tam={tam} color={color} fuente={fuente} dur={efecto === "enorme" ? 14 : 10}>
                {w}
              </Revela>
            </span>
          );
        })}
      </div>
      {efecto === "brillo" && (
        <div style={{ position: "absolute", left: "50%", bottom: -6, height: 10, borderRadius: 5, background: ORO, width: ancho(texto, tam, fuente, pesoDe(fuente), 0) * pr(f, desde + 6, 14, Easing.inOut(Easing.cubic)), transform: "translateX(-50%)", boxShadow: `0 0 30px ${ORO}` }} />
      )}
    </div>
  );
};

const Kinetico: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const lineas = arr<string[]>(p, "lineas").map((l) => (Array.isArray(l) ? l : [String(l)]));
  const efectos = arr<Efecto>(p, "efectos");
  const fz = fuenteTitulo(lineas.flat());
  const esc = 1;
  // las líneas protagonistas (doradas o sello) van en Anton y en mayúsculas; el resto, en Bricolage
  const clave = (k: number) => DORADOS.includes(efectos[k]) || efectos[k] === "sello";
  const fuenteL = (k: number) => (clave(k) ? CLAVE : fz);
  const lineasV = lineas.map((l, k) => (clave(k) ? l.map((w) => w.toUpperCase()) : l));
  const tams = lineasV.map((l, k) => encajar(l.join(" "), efectos[k] === "sello" ? 700 : 860, (efectos[k] === "enorme" ? 290 : efectos[k] === "sello" ? 110 : 150) * esc * (clave(k) ? 1.3 : 1), fuenteL(k)));
  const alto = tams.reduce((s, t, k) => s + t * (efectos[k] === "sello" ? 1.25 : 1.1), 0);
  const ultimo = b.length ? b[b.length - 1] : 0;
  const golpes = b.map((x) => temblor(f, x, 7, 8));
  const t = golpes.reduce((s, g) => ({ x: s.x + g.x, y: s.y + g.y }), { x: 0, y: 0 });
  const pregunta = efectos.indexOf("pregunta");
  const kq = pregunta >= 0 ? sp(f, b[pregunta] ?? 0, { damping: 10, stiffness: 120, mass: 0.8 }) : 0;
  const cinta = lineas.flat().join(" · ") + " · ";
  const deriva = f * 3;
  const empuje = 1 + 0.06 * pr(f, ultimo, Math.max(10, dur - ultimo), Easing.linear);
  return (
    <AbsoluteFill>
      <Rejilla op={0.8} />
      {[230, 1050].map((y, k) => (
        <div key={y} style={{ position: "absolute", top: y, left: -200, whiteSpace: "nowrap", fontFamily: fz, fontWeight: pesoDe(fz), fontSize: 110, color: "transparent", WebkitTextStroke: `2px ${alfa(ORO, 0.16)}`, transform: `translateX(${k ? -((deriva % 1400)) : (deriva % 1400) - 1400}px)` }}>
          {cinta.repeat(6)}
        </div>
      ))}
      {pregunta >= 0 && kq > 0 && (
        <div style={{ position: "absolute", left: 540, top: 650, transform: `translate(-50%,-50%) scale(${kq}) rotate(${(1 - kq) * -40 + Math.sin(f / 10) * 6}deg)`, fontFamily: PRO, fontWeight: 700, fontSize: 860, lineHeight: 1, color: "transparent", WebkitTextStroke: `6px ${alfa(ORO, 0.35)}` }}>?</div>
      )}
      <Halo x={540} y={650} r={520} op={0.16} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 650 - alto / 2, textAlign: "center", transform: `translate(${t.x}px,${t.y}px) scale(${empuje})`, transformOrigin: "50% 50%" }}>
        {lineasV.map((l, k) => (
          <Linea key={k} palabras={lineasV[k]} desde={(b[k] ?? 0) - 2} efecto={efectos[k] ?? "subir"} tam={tams[k]} fuente={fuenteL(k)} />
        ))}
      </div>
      {efectos.map((e, k) => (e === "sello" || e === "enorme" ? <Chispas key={k} desde={(b[k] ?? 0) + 2} x={540} y={650} n={18} r={420} color={e === "sello" ? ROJO : ORO} /> : null))}
    </AbsoluteFill>
  );
};

export const kinetico: DefEscena = {
  C: Kinetico,
  momentos: (p) => Math.max(1, arr(p, "lineas").length),
  sonidos: (p) =>
    arr<Efecto>(p, "efectos").map((e, k) => [k, e === "sello" ? "golpe" : e === "glitch" ? "negacion" : e === "zoom" || e === "enorme" ? "whoosh" : e === "pregunta" ? "burbuja" : "swoosh", e === "sello" ? 0.42 : 0.28] as [number, string, number]),
  validar: (p) => (arr(p, "lineas").length ? [] : ["falta «lineas»"]),
};

