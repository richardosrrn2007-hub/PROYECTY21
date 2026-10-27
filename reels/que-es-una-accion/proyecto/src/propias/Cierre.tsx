// Cierre de marca: la escena final se desvanece y el planeta que acompaña todo el vídeo pasa al frente,
// viaja y se encoge hasta quedar dentro del aro izquierdo del logo de Origine (su borde se vuelve el aro);
// entra el segundo aro, salta el destello en el cruce y el plano encadena con el vídeo del logo.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Planeta } from "./Planeta";

/** Fotogramas de la transición (encima del final de la última escena) y del logo (después). */
export const TRANSICION = 64;
export const LOGO = 120;
export const CIERRE = LOGO;
/** Fotograma de la transición en que empieza el vídeo del logo. */
export const ENTRA_LOGO = 56;

// posición de los aros en el vídeo del logo (medida sobre 1080×1920) y del planeta de fondo
const ARO_I = { x: 412, y: 750 };
const ARO_D = { x: 669, y: 750 };
const RADIO = 165;
const PLANETA = { x: 1250, y: 1080, r: 900 };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  // 1) la escena se apaga y el planeta pasa al frente a la vez (sin salto: está en el mismo sitio)
  const apaga = interpolate(f, [0, 22], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  // 2) el planeta viaja y se encoge hasta el aro izquierdo
  const t = interpolate(f, [14, 50], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const cx = PLANETA.x + (ARO_I.x - PLANETA.x) * t,
    cy = PLANETA.y + (ARO_I.y - PLANETA.y) * t,
    r = PLANETA.r + (RADIO - PLANETA.r) * t;
  // 3) el borde se vuelve aro dorado y entra el segundo aro
  const aro = interpolate(f, [30, 50], [0, 1], cl);
  const aro2 = interpolate(f, [34, 54], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  // 4) destello en el cruce y entra el logo
  const destello = interpolate(f, [48, 56, 70], [0, 1, 0], cl);
  const logo = interpolate(f, [ENTRA_LOGO, ENTRA_LOGO + 10], [0, 1], cl);
  const ix = (ARO_I.x + ARO_D.x) / 2,
    iy = ARO_I.y - Math.sqrt(Math.max(0, RADIO * RADIO - ((ARO_D.x - ARO_I.x) / 2) ** 2));
  const x2 = ARO_D.x + (1 - aro2) * 260;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: apaga }} />
      {logo < 1 && (
        <AbsoluteFill style={{ opacity: apaga * (1 - logo) }}>
          <Planeta cx={cx} cy={cy} r={r} estrellas={t < 0.5} sombra={false} borde={5 + 9 * aro} />
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id="ci-oro" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#F7D9A8" />
                <stop offset="0.5" stopColor="#C9935A" />
                <stop offset="1" stopColor="#8E6236" />
              </linearGradient>
            </defs>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#ci-oro)" strokeWidth={14} opacity={aro} />
            {aro2 > 0 && <circle cx={x2} cy={ARO_D.y} r={RADIO} fill="none" stroke="url(#ci-oro)" strokeWidth={14} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - aro2} transform={`rotate(-90 ${x2} ${ARO_D.y})`} />}
          </svg>
        </AbsoluteFill>
      )}
      <Sequence from={ENTRA_LOGO} layout="none">
        <AbsoluteFill style={{ opacity: logo }}>
          <OffthreadVideo src={staticFile("logo.mp4")} style={{ width: 1080, height: 1920 }} volume={0.9} />
        </AbsoluteFill>
      </Sequence>
      <div style={{ position: "absolute", left: ix - 200, top: iy - 200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,244,225,0.95) 0%, rgba(240,185,110,0.45) 22%, rgba(240,185,110,0) 65%)", opacity: destello }} />
      <div style={{ position: "absolute", left: ix - 520, top: iy - 3, width: 1040, height: 6, background: "linear-gradient(90deg, transparent, rgba(255,230,190,0.95), transparent)", opacity: destello }} />
    </AbsoluteFill>
  );
};
