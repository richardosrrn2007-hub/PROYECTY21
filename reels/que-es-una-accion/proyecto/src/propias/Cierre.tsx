// Cierre de marca: el planeta que acompaña todo el vídeo se aleja y encoge hasta quedar dentro del aro
// izquierdo del logo de Origine; su borde se vuelve el aro, entra el segundo aro con un destello y el plano
// encadena con el vídeo del logo, que está en la misma posición.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Planeta } from "./Planeta";

/** Fotogramas del cierre: transición (encima de la última escena) + logo. */
export const TRANSICION = 30;
export const LOGO = 96;
export const CIERRE = LOGO; // lo que se añade después del final de la voz

// posición de los aros en el vídeo del logo (medida sobre 1080×1920)
const ARO_I = { x: 412, y: 750 };
const ARO_D = { x: 669, y: 750 };
const RADIO = 165;
const PLANETA = { x: 1250, y: 1080, r: 900 };

const ease = Easing.inOut(Easing.cubic);

export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const negro = interpolate(f, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t = interpolate(f, [2, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const cx = PLANETA.x + (ARO_I.x - PLANETA.x) * t,
    cy = PLANETA.y + (ARO_I.y - PLANETA.y) * t,
    r = PLANETA.r + (RADIO - PLANETA.r) * t;
  const aro2 = interpolate(f, [16, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const destello = interpolate(f, [24, 30, 40], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const video = interpolate(f, [TRANSICION, TRANSICION + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ix = (ARO_I.x + ARO_D.x) / 2,
    iy = ARO_I.y - Math.sqrt(Math.max(0, RADIO * RADIO - ((ARO_D.x - ARO_I.x) / 2) ** 2));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: negro }} />
      {video < 1 && (
        <AbsoluteFill style={{ opacity: 1 - video * 0.9 }}>
          <Planeta cx={cx} cy={cy} r={r} estrellas={false} sombra={false} borde={5 + 9 * t} />
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id="ci-oro" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#F7D9A8" />
                <stop offset="0.5" stopColor="#C9935A" />
                <stop offset="1" stopColor="#8E6236" />
              </linearGradient>
            </defs>
            {/* el borde del planeta se vuelve un aro dorado */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#ci-oro)" strokeWidth={14} opacity={t} />
            {/* segundo aro que entra desde la derecha y se entrelaza */}
            <circle cx={ARO_D.x + (1 - aro2) * 260} cy={ARO_D.y} r={RADIO} fill="none" stroke="url(#ci-oro)" strokeWidth={14} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - aro2} opacity={aro2} transform={`rotate(-90 ${ARO_D.x + (1 - aro2) * 260} ${ARO_D.y})`} />
          </svg>
          {/* destello en el cruce de los aros */}
          <div style={{ position: "absolute", left: ix - 160, top: iy - 160, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,210,0.95) 0%, rgba(240,180,100,0.45) 25%, rgba(240,180,100,0) 70%)", opacity: destello }} />
          <div style={{ position: "absolute", left: ix - 420, top: iy - 3, width: 840, height: 6, background: "linear-gradient(90deg, transparent, rgba(255,230,190,0.9), transparent)", opacity: destello }} />
        </AbsoluteFill>
      )}
      <Sequence from={TRANSICION} layout="none">
        <AbsoluteFill style={{ opacity: video }}>
          <OffthreadVideo src={staticFile("logo.mp4")} style={{ width: 1080, height: 1920 }} volume={0.9} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
