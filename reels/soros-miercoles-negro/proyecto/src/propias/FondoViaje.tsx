// Fondo del vídeo 3: el planeta de la serie. En el gancho la cámara se lanza hacia él y se queda en órbita
// sobre Japón (planeta enorme, Japón dibujado en dorado en su superficie y el sol rojo saliendo por el borde).
// En "1991" la cámara se aleja y el planeta vuelve a su sitio de siempre.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ESCENAS } from "../motor/linea";
import { PLAN } from "../motor/actual";
import { Planeta } from "./Planeta";
import { HOKKAIDO_P, HONSHU_P, KYUSHU_P, SHIKOKU_P } from "./Japon";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Momentos del viaje: ida (al decir "arroz" en el gancho) y vuelta (al empezar la escena de 1991). */
export const viajeTiempos = () => {
  const gancho = ESCENAS[0];
  const ida = gancho.ini + (gancho.b[2] ?? 60) - 4;
  const iv = PLAN.frases.findIndex((fr) => fr.escena?.nombre === "Viaje");
  const vuelta = ESCENAS[iv >= 0 ? iv : Math.max(0, ESCENAS.length - 3)].ini;
  const im = PLAN.frases.findIndex((fr) => fr.escena?.nombre === "Mapa");
  const mapaFin = im >= 0 ? ESCENAS[im].fin : 0;
  return { ida, idaFin: ida + 22, vuelta, vueltaFin: vuelta + 40, mapaFin };
};

export const FondoViaje: React.FC = () => {
  const f = useCurrentFrame();
  const { ida, idaFin, vuelta, vueltaFin, mapaFin } = viajeTiempos();
  // el Japón del fondo no aparece mientras la escena del mapa dibuja el suyo
  const japon = f < vuelta ? interpolate(f, [mapaFin - 6, mapaFin + 12], [0, 1], cl) : 1;
  // k: 0 = planeta normal, 1 = en órbita sobre Japón
  const k = f < vuelta ? interpolate(f, [ida, idaFin], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) }) : interpolate(f, [vuelta, vueltaFin], [1, 0], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const lerp = (a: number, z: number) => a + (z - a) * k;
  const cx = lerp(1250, 540),
    cy = lerp(1080, 2780),
    r = lerp(900, 1960);
  // destello al llegar
  const destello = interpolate(f, [idaFin - 2, idaFin + 2, idaFin + 14], [0, 0.85, 0], cl);
  const sol = Math.max(0, (k - 0.55) / 0.45);
  const yHorizonte = cy - r;
  return (
    <AbsoluteFill>
      {/* sol rojo que sale por el borde del planeta (detrás) */}
      {sol > 0 && (
        <div style={{ position: "absolute", left: 540 - 250, top: yHorizonte - 330 + (1 - sol) * 260, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle at 42% 38%, #E0533F, #C0392B 60%, #8E2318)", opacity: 0.92 * sol, boxShadow: "0 0 160px rgba(192,57,43,0.55)" }} />
      )}
      <Planeta cx={cx} cy={cy} r={r} sombra={k < 0.5} borde={5 + 3 * k} />
      {/* Japón en dorado sobre la superficie, con la malla del globo */}
      {k > 0.3 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: Math.min(1, (k - 0.3) / 0.5) }}>
          <defs>
            <clipPath id="fv-globo">
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
          </defs>
          <g clipPath="url(#fv-globo)">
            {Array.from({ length: 9 }).map((_, i) => (
              <ellipse key={`m${i}`} cx={cx} cy={cy} rx={r * Math.abs(Math.cos((i / 9) * Math.PI))} ry={r} fill="none" stroke="rgba(212,170,110,0.10)" strokeWidth={2} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <ellipse key={`p${i}`} cx={cx} cy={cy - r + (i + 1) * 110} rx={r} ry={40 + i * 6} fill="none" stroke="rgba(212,170,110,0.08)" strokeWidth={2} />
            ))}
            {/* Japón tumbado sobre la curva del planeta */}
            <g opacity={japon} transform={`translate(${cx - 540} ${yHorizonte + 40}) translate(540 0) scale(1.15 0.62) translate(-540 -250)`}>
              {[HONSHU_P, KYUSHU_P, SHIKOKU_P, HOKKAIDO_P].map((d, i) => (
                <path key={i} d={d} fill="rgba(212,170,110,0.10)" stroke="rgba(231,181,122,0.75)" strokeWidth={3} />
              ))}
            </g>
          </g>
        </svg>
      )}
      <AbsoluteFill style={{ background: "#FFF3DC", opacity: destello, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
