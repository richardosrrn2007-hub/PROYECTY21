// Cierre de marca en un solo movimiento de cámara: la escena final se apaga mientras la cámara se mete en el
// planeta del fondo (crece y se centra); al llenar la pantalla, el plano pasa al vídeo del logo de Origine
// muy ampliado sobre la Tierra de su aro izquierdo, y la cámara se aleja hasta mostrar el logo entero.
// No se redibuja el logo: se usa el vídeo real, así no hay salto de estilo.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Planeta } from "./Planeta";

/** Fotogramas de la entrada al planeta (encima del final de la última escena) y del logo (después). */
export const TRANSICION = 60;
export const LOGO = 170;
export const CIERRE = LOGO;
/** Fotograma de la transición en que empieza el vídeo del logo. */
export const ENTRA_LOGO = 44;

/** Centro de la Tierra dentro del aro izquierdo del logo (sobre 1080×1920). */
const TIERRA = { x: 412, y: 750 };
const PLANETA = { x: 1250, y: 1080, r: 900 };
/** Ampliación del logo al empezar (la Tierra del aro llena la pantalla). */
const ZOOM_INICIAL = 3.6;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  // 1) la escena se apaga y la cámara entra en el planeta: crece y se centra
  const apaga = interpolate(f, [0, 32], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const entra = interpolate(f, [0, TRANSICION], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const cx = PLANETA.x + (540 - PLANETA.x) * entra,
    cy = PLANETA.y + (960 - PLANETA.y) * entra,
    r = PLANETA.r * (1 + 0.5 * entra);
  // 2) el logo aparece muy ampliado sobre su Tierra y la cámara se aleja
  const logo = interpolate(f, [ENTRA_LOGO, ENTRA_LOGO + 20], [0, 1], cl);
  const aleja = interpolate(f, [ENTRA_LOGO, ENTRA_LOGO + 92], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const z = ZOOM_INICIAL + (1 - ZOOM_INICIAL) * aleja;
  // la Tierra del logo empieza en el centro de la pantalla y vuelve a su sitio
  const tx = (540 - TIERRA.x) * (1 - aleja),
    ty = (960 - TIERRA.y) * (1 - aleja);
  const desenfoque = 6 * (1 - logo) + 2 * Math.max(0, 1 - aleja * 3);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: apaga }} />
      {logo < 1 && (
        <AbsoluteFill style={{ opacity: apaga * (1 - logo), filter: entra > 0.6 ? `blur(${(entra - 0.6) * 10}px)` : undefined }}>
          <Planeta cx={cx} cy={cy} r={r} estrellas sombra={false} />
        </AbsoluteFill>
      )}
      <Sequence from={ENTRA_LOGO} layout="none">
        <AbsoluteFill style={{ opacity: logo, transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: `${TIERRA.x}px ${TIERRA.y}px`, filter: desenfoque > 0.2 ? `blur(${desenfoque}px)` : undefined }}>
          <OffthreadVideo src={staticFile("logo.mp4")} style={{ width: 1080, height: 1920 }} volume={0.9} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
