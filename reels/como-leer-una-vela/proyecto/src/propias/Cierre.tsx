// Cierre de marca: la imagen se apaga como una tele antigua (se aplasta en una línea de luz horizontal) y esa
// línea se vuelve el destello que cruza los aros del logo de Origine, que aparece desde la luz.
// El aplastado lo aplica ApagaTele a todo el vídeo; aquí se dibuja la línea de luz y el vídeo del logo.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

/** Fotogramas del apagado (al final de la última escena) y del logo después del final de la voz. */
export const TRANSICION = 34;
/** El logo completo (su vídeo dura 8,1 s): lo que queda después de la transición. */
export const LOGO = 225;
export const CIERRE = LOGO;
/** Fotograma de la transición en que empieza el vídeo del logo. */
export const ENTRA_LOGO = 16;
/** Altura de la línea: la del destello que cruza los aros del logo (sobre 1080×1920). */
export const LINEA_Y = 750;
/** Fotogramas que tarda la imagen en aplastarse. */
export const APLASTA = 12;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Envuelve el vídeo y lo aplasta en vertical hacia la línea, como una tele que se apaga. */
export const ApagaTele: React.FC<{ desde: number; children: React.ReactNode }> = ({ desde, children }) => {
  const f = useCurrentFrame() - desde;
  if (f < 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = interpolate(f, [0, APLASTA], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const sy = Math.max(0.003, 1 - t);
  const sx = 1 - 0.12 * t;
  return (
    <AbsoluteFill style={{ transform: `scale(${sx}, ${sy})`, transformOrigin: `540px ${LINEA_Y}px`, filter: `brightness(${1 + 3 * t})`, opacity: f > APLASTA + 2 ? 0 : 1 }}>
      {children}
    </AbsoluteFill>
  );
};

/** Centro del cristal del monitor en pantalla (donde nace la línea al apagarse). */
const MONITOR_Y = 876;

export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  // el monitor se apaga (lo hace Escritorio en los primeros APLASTA fotogramas); luego todo lo demás se funde a negro
  const negro = interpolate(f, [APLASTA - 2, APLASTA + 8], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  // la línea de luz nace en el monitor, sube hasta la altura del destello del logo y se estira
  const sube = interpolate(f, [APLASTA - 2, ENTRA_LOGO + 4], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const y = MONITOR_Y + (LINEA_Y - MONITOR_Y) * sube;
  const ancho = 0.82 + (1.15 - 0.82) * sube;
  const brillo = interpolate(f, [APLASTA - 3, APLASTA, ENTRA_LOGO + 6, ENTRA_LOGO + 18], [0, 1, 1, 0], cl);
  const logo = interpolate(f, [ENTRA_LOGO, ENTRA_LOGO + 10], [0, 1], cl);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: negro }} />
      <Sequence from={ENTRA_LOGO} layout="none">
        <AbsoluteFill style={{ opacity: logo }}>
          <OffthreadVideo src={staticFile("logo.mp4")} style={{ width: 1080, height: 1920 }} volume={0.9} />
        </AbsoluteFill>
      </Sequence>
      <div style={{ position: "absolute", left: 540 - 540 * ancho, width: 1080 * ancho, top: y - 5, height: 10, background: "linear-gradient(90deg, transparent, rgba(255,226,180,0.9) 30%, #FFF8EC 50%, rgba(255,226,180,0.9) 70%, transparent)", opacity: brillo, filter: "blur(1.5px)", boxShadow: "0 0 40px rgba(240,190,120,0.8)" }} />
      <div style={{ position: "absolute", left: 540 - 260, top: y - 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,244,225,0.8) 0%, rgba(240,185,110,0.3) 25%, rgba(240,185,110,0) 65%)", opacity: brillo * 0.8 * sube, transform: `scaleY(${0.25 + 0.75 * logo})` }} />
    </AbsoluteFill>
  );
};
