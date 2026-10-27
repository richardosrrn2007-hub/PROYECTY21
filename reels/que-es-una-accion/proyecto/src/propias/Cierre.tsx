// Cierre de marca: el logo de Origine aparece en la pantalla del monitor que ya está en la última escena.
// La vela se apaga en el cristal, el vídeo del logo empieza dentro de la pantalla y la pantalla crece hasta
// ocupar todo el vídeo (como si la cámara entrara en el monitor). Sin cambiar de escena ni de estilo.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

/** Fotogramas del paso al logo (encima del final de la última escena) y del logo a pantalla completa (después). */
export const TRANSICION = 60;
export const LOGO = 45;
export const CIERRE = LOGO;
/** Fotograma de la transición en que empieza el vídeo del logo (dentro del monitor). */
export const ENTRA_LOGO = 10;

/** Cristal del monitor en la pantalla al final de la última escena (medido sobre el render, 1080×1920). */
const CRISTAL = { x0: 24, y0: 534, x1: 1056, y1: 1218, radio: 18 };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  // 1) la pantalla se apaga (la vela se va)
  const apaga = interpolate(f, [0, 12], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  // 2) el logo empieza dentro del cristal
  const logo = interpolate(f, [ENTRA_LOGO, ENTRA_LOGO + 12], [0, 1], cl);
  // 3) el cristal crece hasta ocupar todo y lo de alrededor se va a negro
  const crece = interpolate(f, [26, TRANSICION], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const fuera = interpolate(f, [22, 48], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const arriba = CRISTAL.y0 * (1 - crece),
    derecha = (1080 - CRISTAL.x1) * (1 - crece),
    abajo = (1920 - CRISTAL.y1) * (1 - crece),
    izquierda = CRISTAL.x0 * (1 - crece),
    radio = CRISTAL.radio * (1 - crece);
  return (
    <AbsoluteFill>
      {/* lo de alrededor del monitor se apaga mientras la pantalla crece */}
      <AbsoluteFill style={{ background: "#000", opacity: fuera }} />
      {/* la pantalla se apaga antes de que entre el logo */}
      <div style={{ position: "absolute", left: CRISTAL.x0, top: CRISTAL.y0, width: CRISTAL.x1 - CRISTAL.x0, height: CRISTAL.y1 - CRISTAL.y0, borderRadius: CRISTAL.radio, background: "#000", opacity: apaga * (1 - crece) }} />
      <Sequence from={ENTRA_LOGO} layout="none">
        <AbsoluteFill style={{ clipPath: `inset(${arriba}px ${derecha}px ${abajo}px ${izquierda}px round ${radio}px)`, opacity: logo }}>
          <OffthreadVideo src={staticFile("logo.mp4")} style={{ width: 1080, height: 1920 }} volume={0.9} />
        </AbsoluteFill>
      </Sequence>
      {/* reflejo del cristal mientras todavía es pantalla */}
      <div style={{ position: "absolute", left: izquierda, top: arriba, right: derecha, bottom: abajo, borderRadius: radio, border: `2px solid rgba(246,236,210,${0.3 * (1 - crece)})`, background: `linear-gradient(115deg, transparent 40%, rgba(246,236,210,${0.06 * (1 - crece)}) 48%, transparent 56%)`, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
