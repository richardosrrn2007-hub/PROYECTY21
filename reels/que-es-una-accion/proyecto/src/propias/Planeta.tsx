// Fondo de marca: planeta de noche con el borde iluminado y luces de ciudades en ámbar, más estrellas.
// Se dibuja con código y gira muy despacio (va en todo el vídeo, por debajo de las escenas).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rnd } from "../motor/anim";

const CX = 1250,
  CY = 1080,
  R = 900;
const LUCES = Array.from({ length: 420 }).map((_, k) => {
  // grupos de ciudades: unos centros y puntos alrededor
  const g = Math.floor(rnd(k * 1.7) * 14);
  const ga = 2.0 + rnd(g * 9.1) * 2.3,
    gr = 0.45 + rnd(g * 4.3) * 0.5;
  const a = ga + (rnd(k * 3.3) - 0.5) * 0.35;
  const r = Math.min(0.985, gr + (rnd(k * 5.9) - 0.5) * 0.18);
  return { a, r, s: 1.2 + rnd(k * 7.7) * 2.6, b: rnd(k * 2.2) };
});
const ESTRELLAS = Array.from({ length: 90 }).map((_, k) => ({ x: rnd(k * 11.1) * 1080, y: rnd(k * 13.7) * 1920, s: 0.6 + rnd(k * 3.1) * 1.4, b: rnd(k * 5.5) }));

export const Planeta: React.FC = () => {
  const f = useCurrentFrame();
  const giro = f * 0.00045;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <radialGradient id="pl-cuerpo" cx="0.32" cy="0.38" r="0.75">
            <stop offset="0" stopColor="#15110C" />
            <stop offset="0.7" stopColor="#070605" />
            <stop offset="1" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="pl-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.9" stopColor="#C8894A" stopOpacity="0" />
            <stop offset="0.945" stopColor="#D49A5A" stopOpacity="0.32" />
            <stop offset="1" stopColor="#D49A5A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pl-borde" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E7B57A" stopOpacity="0.95" />
            <stop offset="0.45" stopColor="#B5793F" stopOpacity="0.45" />
            <stop offset="1" stopColor="#B5793F" stopOpacity="0" />
          </linearGradient>
          <filter id="pl-brillo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {ESTRELLAS.map((e, k) => (
          <circle key={k} cx={e.x} cy={e.y} r={e.s} fill="#F6ECD2" opacity={0.15 + 0.25 * (0.5 + 0.5 * Math.sin(f / 20 + e.b * 9))} />
        ))}
        <circle cx={CX} cy={CY} r={R * 1.06} fill="url(#pl-halo)" />
        <circle cx={CX} cy={CY} r={R} fill="url(#pl-cuerpo)" />
        <g filter="url(#pl-brillo)">
          {LUCES.map((l, k) => {
            const a = l.a + giro;
            return <circle key={k} cx={CX + Math.cos(a) * l.r * R} cy={CY + Math.sin(a) * l.r * R} r={l.s * 1.8} fill="#F0A955" opacity={0.45 + 0.4 * l.b} />;
          })}
        </g>
        {LUCES.map((l, k) => {
          const a = l.a + giro;
          return <circle key={`n${k}`} cx={CX + Math.cos(a) * l.r * R} cy={CY + Math.sin(a) * l.r * R} r={l.s * 0.55} fill="#FFE2B0" opacity={0.6 + 0.4 * l.b} />;
        })}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="url(#pl-borde)" strokeWidth={5} />
      </svg>
      {/* sombra para que el contenido de la izquierda se lea bien */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.35) 100%)" }} />
    </AbsoluteFill>
  );
};
