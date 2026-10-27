// La metáfora central: la empresa es una pizza y cada porción es una acción.
// Una sola escena con 5 modos que encadenan (cada uno empieza donde acabó el anterior).
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { C } from "../motor/actual";
import { F, alfa } from "../motor/estilos";
import type { DefEscena, PropsEscena } from "../tipos";
import { txt } from "../escenas/util";
import { Icono, Onda } from "../piezas/basicas";
import { Caja, Chispas, Cuenta, Etiqueta, Halo, ORO, ROJO, Rejilla, Trazo, pr, sp, temblor } from "./mg";
import { Edificio } from "./Texto";

const R = 270;
const N = 8;
/** La porción protagonista (arriba a la derecha). */
const P = 1;
const CORTEZA = "#D08A35";
const QUESO = "#F4C65A";
const PEPE = "#C7412C";

const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
const punto = (a: number, r: number) => [Math.cos(a) * r, Math.sin(a) * r];
const cuña = (a0: number, a1: number, r = R) => {
  const [x0, y0] = punto(a0, r);
  const [x1, y1] = punto(a1, r);
  return `M0 0 L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`;
};
const arco = (a0: number, a1: number, r = R - 9) => {
  const [x0, y0] = punto(a0, r);
  const [x1, y1] = punto(a1, r);
  return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
};

/** Pepperoni de una porción (en coordenadas de la pizza). */
const PEPERONIS: [number, number, number][] = [];
for (let i = 0; i < N; i++) {
  const m = ang(i) + Math.PI / N;
  PEPERONIS.push([i, m - 0.12, R * 0.72], [i, m + 0.16, R * 0.4]);
}

type Estado = {
  cx: number;
  cy: number;
  esc: number;
  aparece: number; // 0→1 la pizza rellena
  cortes: number; // 0→1 se dibujan los cortes
  resto: { op: number; dx: number; dy: number; esc: number };
  porcion: { dx: number; dy: number; esc: number; brillo: number };
  sub: number; // 0→1 la porción se parte en 4 (fracción)
  cruz: number; // 0→1 cruz roja
  pepe: number; // fotograma en que saltan los pepperoni
  base?: boolean; // círculo de queso debajo (tapa las juntas entre porciones)
};

const Porcion: React.FC<{ i: number; sub?: number; brillo?: number; f: number; pepe: number }> = ({ i, sub = 0, brillo = 0, f, pepe }) => {
  const a0 = ang(i),
    a1 = ang(i + 1);
  const partes = 4;
  return (
    <g>
      {Array.from({ length: partes }).map((_, k) => {
        const s0 = a0 + ((a1 - a0) * k) / partes,
          s1 = a0 + ((a1 - a0) * (k + 1)) / partes;
        const m = (s0 + s1) / 2;
        const ultima = k === partes - 1;
        const fuera = ultima ? sub * 70 : sub * 8;
        const op = sub > 0 && !ultima ? 1 - 0.55 * sub : 1;
        return (
          <g key={k} transform={`translate(${Math.cos(m) * fuera},${Math.sin(m) * fuera})`} opacity={op}>
            <path d={cuña(s0, s1)} fill={QUESO} />
            <path d={arco(s0, s1)} stroke={CORTEZA} strokeWidth={18} fill="none" />
            {ultima && sub > 0 && <path d={cuña(s0, s1)} fill="none" stroke={ORO} strokeWidth={5} opacity={sub} />}
          </g>
        );
      })}
      {PEPERONIS.filter((p) => p[0] === i).map(([, a, r], k) => {
        const [x, y] = punto(a, r);
        const kk = sp(f, pepe + i * 1.5 + k * 3);
        return <circle key={k} cx={x} cy={y} r={20 * kk} fill={PEPE} opacity={sub > 0 ? 1 - 0.5 * sub : 1} />;
      })}
      {brillo > 0 && <path d={cuña(a0, a1)} fill="none" stroke={ORO} strokeWidth={6} opacity={brillo} />}
      {sub > 0 &&
        [1, 2, 3].map((k) => {
          const a = a0 + ((a1 - a0) * k) / 4;
          const [x, y] = punto(a, R);
          return <line key={k} x1={0} y1={0} x2={x} y2={y} stroke={C.fondo} strokeWidth={5} opacity={Math.min(1, sub * 3)} />;
        })}
    </g>
  );
};

const DibujoPizza: React.FC<{ e: Estado }> = ({ e }) => {
  const f = useCurrentFrame();
  const m = ang(P) + Math.PI / N;
  const cP = punto(m, R * 0.55);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(${e.cx},${e.cy}) scale(${e.esc * Math.max(0.001, e.aparece)})`}>
        <g opacity={e.resto.op} transform={`translate(${e.resto.dx},${e.resto.dy}) scale(${e.resto.esc})`}>
          <ellipse cx={0} cy={R + 26} rx={R * 0.85} ry={22} fill="#000" opacity={0.35} />
          {e.base && <circle r={R - 2} fill={QUESO} />}
          {Array.from({ length: N }).map((_, i) => (i === P ? null : <Porcion key={i} i={i} f={f} pepe={e.pepe} />))}
          {Array.from({ length: N }).map((_, i) => {
            const [x, y] = punto(ang(i), R + 4);
            const k = pr(f, 0, 1) * Math.max(0, Math.min(1, e.cortes * N - i));
            return k > 0 ? <line key={i} x1={0} y1={0} x2={x * k} y2={y * k} stroke={C.fondo} strokeWidth={7} strokeLinecap="round" /> : null;
          })}
        </g>
        <g transform={`translate(${e.porcion.dx},${e.porcion.dy}) translate(${cP[0]},${cP[1]}) scale(${e.porcion.esc}) translate(${-cP[0]},${-cP[1]})`}>
          <Porcion i={P} f={f} sub={e.sub} brillo={e.porcion.brillo} pepe={e.pepe} />
        </g>
        {e.cruz > 0 && (
          <g>
            <Trazo d={`M${-R * 0.85} ${-R * 0.85} L${R * 0.85} ${R * 0.85}`} p={pr(e.cruz, 0, 0.5, Easing.linear)} color={ROJO} grosor={30} />
            <Trazo d={`M${R * 0.85} ${-R * 0.85} L${-R * 0.85} ${R * 0.85}`} p={pr(e.cruz, 0.5, 0.5, Easing.linear)} color={ROJO} grosor={30} />
          </g>
        )}
      </g>
    </svg>
  );
};

const BASE: Estado = { cx: 540, cy: 660, esc: 1, aparece: 1, cortes: 1, resto: { op: 1, dx: 0, dy: 0, esc: 1 }, porcion: { dx: 0, dy: 0, esc: 1, brillo: 0 }, sub: 0, cruz: 0, pepe: -200 };
const FUERA = { dx: 70, dy: -30 };

const Pizza: React.FC<PropsEscena> = ({ p, b }) => {
  const f = useCurrentFrame();
  const modo = txt(p, "modo", "forma");
  const [b0 = 0, b1 = 10, b2 = 20, b3 = 30, b4 = 40] = b;
  const respira = 1 + 0.012 * Math.sin(f / 8);
  let e: Estado = { ...BASE, resto: { ...BASE.resto }, porcion: { ...BASE.porcion } };
  let capas: React.ReactNode = null;
  let golpe = { x: 0, y: 0 };

  if (modo === "forma") {
    const colapsa = pr(f, b1, 10, Easing.in(Easing.cubic));
    const anillo = pr(f, b1 + 4, 14);
    const llena = sp(f, b2, { damping: 11, stiffness: 150, mass: 0.7 });
    const crece = pr(f, b3, 14, Easing.out(Easing.back(2)));
    e = { ...e, base: true, pepe: b2 + 4, aparece: llena, cortes: 0, esc: (1 + 0.1 * crece) * respira };
    golpe = temblor(f, b3, 10);
    capas = (
      <>
        <Edificio cx={540} base={880 - 220 * colapsa} esc={0.72 * (1 - 0.65 * colapsa)} dibujo={pr(f, 0, Math.max(12, b1 - 4), Easing.inOut(Easing.cubic))} ventanas={b0 + 4} op={1 - colapsa} />
        {llena < 0.98 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform="translate(540,660) rotate(-90)">
              <Trazo d={`M${R} 0 A${R} ${R} 0 1 1 ${R - 0.01} -0.5`} p={anillo} grosor={8} op={1 - llena} />
            </g>
          </svg>
        )}
        <Onda desde={b3} x={540} y={660} r0={R} r1={R + 200} dur={18} grosor={6} />
        <Onda desde={b3 + 6} x={540} y={660} r0={R} r1={R + 260} dur={20} grosor={4} />
        <Etiqueta desde={b1} x={540} y={1000} texto="LA EMPRESA · EJ: APPLE" />
        <Caja x={540} y={300} desde={b3} tam={44}>
          PIZZA GIGANTE
        </Caja>
      </>
    );
  } else if (modo === "cortes") {
    const sale = sp(f, b1, { damping: 12, stiffness: 140, mass: 0.7 });
    e = { ...e, esc: (1.1 - 0.1 * pr(f, 0, 10)) * respira, cortes: pr(f, b0, 14, Easing.linear), porcion: { dx: FUERA.dx * sale, dy: FUERA.dy * sale, esc: 1 + 0.08 * sale, brillo: pr(f, b1 + 6, 8) } };
    golpe = temblor(f, b3, 9);
    capas = (
      <>
        <Chispas desde={b1 + 4} x={760} y={560} n={12} r={180} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <Trazo d="M790 470 L860 380" p={pr(f, b2, 10)} grosor={4} guion />
        </svg>
        <Caja x={840} y={320} desde={b3 - 2} tam={46} fondo={ORO} color={C.acentoTexto}>
          1 ACCIÓN
        </Caja>
        <Etiqueta desde={b0} x={250} y={260} texto="8 PORCIONES" tam={26} />
      </>
    );
  } else if (modo === "parte") {
    const atenua = pr(f, b0, 12);
    const zoom = sp(f, b1, { damping: 13, stiffness: 120, mass: 0.8 });
    e = {
      ...e,
      esc: respira,
      resto: { op: 1 - 0.75 * atenua, dx: -120 * atenua, dy: 60 * atenua, esc: 1 - 0.35 * atenua },
      porcion: { dx: FUERA.dx + (-80 - FUERA.dx) * zoom, dy: FUERA.dy + (40 - FUERA.dy) * zoom, esc: 1.08 + 0.8 * zoom, brillo: 1 },
    };
    capas = (
      <>
        <Halo x={560} y={560} r={360} op={0.25 * zoom} />
        {f >= b2 - 2 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", transform: `scale(${sp(f, b2 - 2)})` }}>
            <Cuenta desde={b2 - 2} de={0} a={12.5} dec={1} sufijo=" %" tam={150} color={ORO} />
          </div>
        )}
        <Etiqueta desde={b3 - 2} x={540} y={1125} texto="DE LA COMPAÑÍA" />
      </>
    );
  } else if (modo === "completa") {
    const entra = sp(f, 0, { damping: 13, stiffness: 160, mass: 0.6 });
    const cruz = pr(f, b4 - 2, 12, Easing.inOut(Easing.cubic));
    e = { ...e, base: true, esc: (0.95 + 0.05 * entra) * respira * (1 - 0.06 * cruz), aparece: entra, resto: { ...e.resto, op: 1 - 0.5 * cruz }, porcion: { ...e.porcion, brillo: 0 }, cruz };
    golpe = temblor(f, b4 + 6, 16);
    const giro = f * 1.2;
    capas = (
      <>
        {f >= b0 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <circle cx={540} cy={660} r={R + 50} fill="none" stroke={alfa(ORO, 0.6 * pr(f, b0, 8))} strokeWidth={4} strokeDasharray="14 18" transform={`rotate(${giro} 540 660)`} />
          </svg>
        )}
        <div style={{ position: "absolute", left: 0, right: 0, top: 255, display: "flex", justifyContent: "center", gap: 24 }}>
          {f >= b1 && (
            <div style={{ position: "relative", transform: `scale(${sp(f, b1)})` }}>
              <div style={{ fontFamily: F.titulo, fontWeight: 800, fontSize: 84, color: ORO }}>
                <Cuenta desde={b1} dur={14} de={0} a={100} sufijo=" %" tam={84} color={ORO} />
              </div>
              <div style={{ position: "absolute", left: -10, top: "50%", height: 10, borderRadius: 5, background: ROJO, width: `${pr(f, b4 + 4, 8) * 110}%` }} />
            </div>
          )}
          {f >= b2 && (
            <div style={{ transform: `translateX(${(1 - pr(f, b2, 10, Easing.out(Easing.back(1.4)))) * 500}px)`, display: "flex", alignItems: "center" }}>
              <Icono nombre="shopping-cart" tam={84} color={C.texto} />
            </div>
          )}
        </div>
        <Onda desde={b3} x={540} y={660} r0={R} r1={R + 140} dur={14} />
        <Etiqueta desde={b3} x={540} y={1010} texto="LA PIZZA COMPLETA" color={f >= b4 + 4 ? ROJO : ORO} />
      </>
    );
  } else {
    // fraccion
    const entra = pr(f, 0, 10, Easing.out(Easing.back(1.3)));
    const parte = pr(f, b3, 14, Easing.out(Easing.back(1.5)));
    e = {
      ...e,
      resto: { op: 0, dx: 0, dy: 0, esc: 1 },
      porcion: { dx: -110 + (1 - entra) * -500, dy: 70, esc: 1.95 * (1 + 0.05 * Math.sin(f / 9)) * (1 + 0.06 * Math.max(0, Math.sin(Math.min(Math.PI, (f - b4 + 2) / 5)))), brillo: 1 - parte },
      sub: parte,
    };
    golpe = temblor(f, b2, 8);
    capas = (
      <>
        <Halo x={540} y={640} r={420} op={0.22} />
        {f >= b1 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26, transform: `scale(${sp(f, b1)})` }}>
            <Cuenta desde={b3} dur={16} de={1} a={0.25} dec={2} tam={140} color={f >= b3 ? ORO : C.texto} />
            <span style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 50, color: C.texto, letterSpacing: 4 }}>{f >= b3 + 6 ? "DE ACCIÓN" : "ACCIÓN"}</span>
          </div>
        )}
        <Chispas desde={b2} x={540} y={640} n={14} r={300} />
        <Chispas desde={b3 + 4} x={700} y={420} n={12} r={160} />
        <Onda desde={b4 - 2} x={700} y={440} r0={60} r1={260} dur={18} />
      </>
    );
  }
  return (
    <AbsoluteFill style={{ transform: `translate(${golpe.x}px,${golpe.y}px)` }}>
      <Rejilla />
      <Halo x={540} y={660} r={460} op={0.12} />
      <DibujoPizza e={e} />
      {capas}
    </AbsoluteFill>
  );
};

export const pizza: DefEscena = {
  C: Pizza,
  momentos: (p) => ({ forma: 4, cortes: 4, parte: 4, completa: 5, fraccion: 5 })[txt(p, "modo", "forma")] ?? 4,
  alInicio: (p) => txt(p, "modo", "forma") !== "forma",
  sonidos: (p) => {
    const m = txt(p, "modo", "forma");
    if (m === "forma") return [[1, "whoosh", 0.28], [2, "pop", 0.35], [3, "subida", 0.3]];
    if (m === "cortes") return [[0, "papel", 0.3], [1, "swoosh", 0.3], [3, "ding", 0.3]];
    if (m === "parte") return [[1, "whoosh", 0.28], [2, "tic", 0.3], [3, "pop", 0.25]];
    if (m === "completa") return [[1, "tic", 0.25], [2, "clic", 0.3], [4, "negacion", 0.35]];
    return [[0, "pop", 0.25], [2, "ding", 0.28], [3, "cristal", 0.3], [4, "pop", 0.2]];
  },
};
