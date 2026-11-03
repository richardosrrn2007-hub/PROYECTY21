import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "./motor/fuentes";
import { C, CON_PERSONAJE, PLAN, SUBTITULOS } from "./motor/actual";
import { Escena, Semitono } from "./motor/Escena";
import { Fondo } from "./motor/Fondo";
import { CAMBIOS_POSE, EFECTOS, ESCENAS, HAY_VOZ, T, TOTAL, corte } from "./motor/linea";
import { Personaje } from "./motor/Personaje";
import { SubtitulosBloque, SubtitulosLinea } from "./motor/Subtitulos";
import { SubArriba } from "./propias/SubArriba";
import { FondoNoche } from "./propias/Soros";
import { CIERRE, Cierre, TRANSICION } from "./propias/Cierre";

// las escenas de este vídeo se dibujan a pantalla completa (sin Lienzo); la luna del fondo se esconde
// mientras sale la luna propia de «miedo y codicia»
const SIN_LUNA = ESCENAS.filter((e) => PLAN.frases[e.i].escena?.nombre === "MiedoCodicia").map((e) => [e.ini, e.ini + e.dur] as [number, number]);
const SIN_SUBTITULOS = PLAN.frases.map((f, i) => (f.sinSubtitulos ? i : -1)).filter((i) => i >= 0);

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: C.fondo }}>
    <Fondo />
    {/* el viaje a Gran Bretaña lo hace ahora la escena 2 en 3D; el planeta del fondo se queda en su sitio */}
    <FondoNoche sinLuna={SIN_LUNA} />
    {ESCENAS.map((e) => {
      const Comp = e.def?.C;
      if (!Comp) return null;
      return (
        <Sequence key={e.i} from={e.ini} durationInFrames={Math.max(1, e.dur)} name={`${e.i + 1}. ${PLAN.frases[e.i].escena?.tipo}`}>
          <Escena dur={e.dur} entrada={e.i === 0 ? "corte" : e.entrada} salida={e.salida}>
            <Comp p={e.p} b={e.b} dur={e.dur} palabras={e.palabras} i={e.i} />
          </Escena>
        </Sequence>
      );
    })}
    {/* la transición de semitono tapa solo la escena: los subtítulos y el personaje siguen encima */}
    {ESCENAS.filter((e) => e.entrada === "semitono").map((e) => (
      <Semitono key={e.i} centro={corte(e.i)} />
    ))}
    {SUBTITULOS === "linea" && <SubtitulosLinea frases={T.frases} sin={SIN_SUBTITULOS} />}
    {SUBTITULOS === "bloque" && <SubtitulosBloque frases={T.frases} sin={SIN_SUBTITULOS} />}
    {(SUBTITULOS as string) === "arriba" && <SubArriba frases={T.frases} sin={SIN_SUBTITULOS} />}
    {CON_PERSONAJE && <Personaje cambios={CAMBIOS_POSE} />}
    {/* cierre de marca: la imagen se apaga como una tele y la línea de luz se vuelve el destello del logo */}
    <Sequence from={TOTAL - TRANSICION} durationInFrames={TRANSICION + CIERRE} name="Cierre Origine">
      <Cierre />
    </Sequence>
    {HAY_VOZ && <Audio src={staticFile("voz.wav")} />}
    {EFECTOS.map((x, k) => (
      <Sequence key={k} from={Math.max(0, x.en)} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sonidos/${x.s}.wav`)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
