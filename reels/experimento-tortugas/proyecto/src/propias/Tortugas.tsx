// Vídeo 6 · El experimento Turtle (Richard Dennis, Chicago, 1983).
// Mundo tortuga: noche verde oscura, el planeta de la serie, tortugas de caparazón dorado.
// Los términos técnicos van en inglés, como salen en las apps.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { F } from "../motor/estilos";
import { rnd } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { CLAVE, VIVO, Chispas, Trazo, pr, sp, temblor, REBOTE } from "./mg";
import type { Vela } from "./Velas";
import { Planeta } from "./Planeta";
import { CajaTexto, Cosmos, Flecha, Hombre, NOCHE, ORO, PLATA, Panel, Pelicula, Polvo, ROJO, Titulo } from "./Soros";

const AZUL = "#4C8DFF";
const CREMA = "#E8D9B5";
const PIEL = "#7FA35A";
const PIEL_OSC = "#56753C";
const CAPA = "#2F4722";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const miles = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ───────────────────────── fondo y piezas ─────────────────────────

/** Fondo de todo el vídeo: noche verde, planeta de la serie y brillos cósmicos. */
export const FondoTortuga: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 30%, #12241A 0%, #070B0A 62%)" }}>
    <Planeta />
    <Cosmos />
  </AbsoluteFill>
);

/** Tortuga de lado con el caparazón dorado; `anda` 0–1 mueve las patas. Va dentro de un <svg>. */
export const TortugaOro: React.FC<{ x: number; y: number; esc?: number; fase?: number; ang?: number; anda?: number; borde?: string }> = ({ x, y, esc = 1, fase = 0, ang = 0, anda = 1, borde = ORO }) => {
  const f = useCurrentFrame();
  const paso = Math.sin(f / 4 + fase) * 9 * anda;
  const cab = Math.sin(f / 9 + fase) * 3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${esc})`}>
      <defs>
        <linearGradient id="to-capa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4C6E33" />
          <stop offset="1" stopColor={CAPA} />
        </linearGradient>
      </defs>
      <path d="M-76 -10 L-104 4 L-74 6 Z" fill={PIEL} />
      <rect x={-54 + paso} y={-8} width={22} height={34} rx={10} fill={PIEL_OSC} />
      <rect x={32 - paso} y={-8} width={22} height={34} rx={10} fill={PIEL_OSC} />
      <rect x={-40 - paso} y={-8} width={22} height={38} rx={10} fill={PIEL} />
      <rect x={18 + paso} y={-8} width={22} height={38} rx={10} fill={PIEL} />
      <path d={`M56 -14 Q86 ${-28 + cab} 96 ${-40 + cab}`} stroke={PIEL} strokeWidth={22} strokeLinecap="round" fill="none" />
      <ellipse cx={104} cy={-44 + cab} rx={26} ry={20} fill={PIEL} />
      <circle cx={112} cy={-50 + cab} r={4.5} fill={NOCHE} />
      <path d={`M112 ${-36 + cab} q10 2 16 -3`} stroke={NOCHE} strokeWidth={2.5} fill="none" />
      <path d="M-80 0 Q-80 -92 0 -96 Q80 -92 80 0 Z" fill="url(#to-capa)" stroke={borde} strokeWidth={5} />
      <path d="M-22 -72 L22 -72 L36 -42 L22 -14 L-22 -14 L-36 -42 Z M-36 -42 L-72 -46 M36 -42 L72 -46 M-22 -14 L-34 0 M22 -14 L34 0 M-22 -72 L-32 -90 M22 -72 L32 -90" fill="none" stroke={borde} strokeWidth={3} opacity={0.75} />
      <path d="M-88 0 L88 0" stroke={borde} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};

/** Rótulo de datos arriba, como en el resto de la serie. */
const Hud: React.FC<{ texto: string; desde?: number; y?: number }> = ({ texto, desde = 0, y = 372 }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: PLATA, opacity: pr(f, desde, 10) * 0.85 }}>{texto}</div>;
};

/** Tarjeta en inglés (el término tal cual sale en la app). */
const Tarjeta: React.FC<{ y: number; desde: number; texto: string; color?: string; x?: number; tam?: number }> = ({ y, desde, texto, color = ORO, x = 540, tam = 30 }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  return (
    <div style={{ position: "absolute", left: x - 520, width: 1040, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: tam, letterSpacing: 5, color, padding: "12px 26px", background: "rgba(8,12,10,0.82)", border: `2px solid ${color}`, borderRadius: 10, whiteSpace: "nowrap", transform: `scale(${sp(f, desde)})`, opacity: pr(f, desde, 6) }}>{texto}</div>
    </div>
  );
};

/** Cabecera de regla: número en un círculo dorado y el nombre en inglés. */
const Cabecera: React.FC<{ n: number; nombre: string; desde: number; hasta?: number; y?: number }> = ({ n, nombre, desde, hasta = 1e9, y = 392 }) => {
  const f = useCurrentFrame();
  if (f < desde || f >= hasta) return null;
  const k = sp(f, desde, REBOTE);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
      <div style={{ width: 104, height: 104, borderRadius: 52, background: ORO, color: NOCHE, fontFamily: CLAVE, fontSize: 72, lineHeight: "104px", textAlign: "center", transform: `scale(${k})`, boxShadow: `0 0 40px ${ORO}66` }}>{n}</div>
      <div style={{ overflow: "hidden", height: 104 }}>
        <div style={{ fontFamily: CLAVE, fontSize: 80, lineHeight: "104px", color: "#F2EEDF", letterSpacing: 1, whiteSpace: "nowrap", transform: `translateY(${(1 - pr(f, desde + 3, 10, Easing.out(Easing.exp))) * 110}%)` }}>{nombre}</div>
      </div>
    </div>
  );
};

/** Texto suelto en mono (dentro de un <svg>). */
const Mono: React.FC<{ x: number; y: number; t: string; tam?: number; color?: string; ancla?: "start" | "middle" | "end"; op?: number }> = ({ x, y, t, tam = 26, color = CREMA, ancla = "start", op = 1 }) => (
  <text x={x} y={y} textAnchor={ancla} fontFamily={F.mono} fontWeight={700} fontSize={tam} letterSpacing={3} fill={color} opacity={op}>
    {t}
  </text>
);

/** Tortuga que pasea por abajo en las escenas de reglas (el hilo del mundo tortuga). */
const Paseo: React.FC<{ y?: number; vel?: number; esc?: number }> = ({ y = 1790, vel = 1.6, esc = 0.9 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={0} y1={y + 30 * esc} x2={1080} y2={y + 30 * esc} stroke={ORO} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="4 14" />
      <TortugaOro x={120 + f * vel} y={y} esc={esc} />
    </svg>
  );
};

/** Chicago de noche en 1983 (silueta con la torre Sears) con el look de película antigua. */
const EDIFICIOS = Array.from({ length: 16 }).map((_, k) => ({ x: k * 70 - 10, w: 58 + rnd(k * 3.3) * 30, h: 190 + rnd(k * 7.1) * 330 }));
const Chicago1983: React.FC<{ oscuro?: number }> = ({ oscuro = 0 }) => {
  const f = useCurrentFrame();
  const base = 1560;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "sepia(0.6) saturate(1.15) contrast(1.08)", transform: `scale(${1.02 + f * 0.0003})`, transformOrigin: "540px 1200px" }}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #04060C 0%, #0E1424 45%, #4A3323 76%, #8A5A2E 81%, #0B0A0C 82%)" }} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 60 }).map((_, k) => (
            <circle key={k} cx={rnd(k * 11.3) * 1080} cy={rnd(k * 5.7) * 900} r={0.8 + rnd(k * 2.1) * 1.4} fill="#F6ECD2" opacity={0.2 + 0.3 * (0.5 + 0.5 * Math.sin(f / 15 + k))} />
          ))}
          {EDIFICIOS.map((e, k) => (
            <g key={k}>
              <rect x={e.x} y={base - e.h} width={e.w} height={e.h} fill="#07080D" />
              {Array.from({ length: Math.floor(e.h / 34) }).map((_, r) =>
                [0, 1, 2].map((c) => (rnd(k * 13.1 + r * 3.7 + c * 1.9) > 0.55 ? <rect key={`${r}-${c}`} x={e.x + 8 + c * (e.w - 16) / 3} y={base - e.h + 14 + r * 34} width={(e.w - 16) / 3 - 6} height={14} fill="#F0C27A" opacity={0.55 + 0.3 * rnd(k + r + c)} /> : null)),
              )}
            </g>
          ))}
          {/* torre Sears: tres cuerpos escalonados y dos antenas */}
          <path d={`M640 ${base} L640 ${base - 640} L690 ${base - 640} L690 ${base - 800} L730 ${base - 800} L730 ${base - 930} L790 ${base - 930} L790 ${base - 800} L820 ${base - 800} L820 ${base - 640} L850 ${base - 640} L850 ${base} Z`} fill="#05060A" />
          <path d={`M746 ${base - 930} L746 ${base - 1070} M774 ${base - 930} L774 ${base - 1050}`} stroke="#05060A" strokeWidth={6} />
          <circle cx={746} cy={base - 1070} r={5} fill={ROJO} opacity={0.5 + 0.5 * Math.sin(f / 6)} />
          {Array.from({ length: 22 }).map((_, r) =>
            [0, 1, 2, 3, 4].map((c) => (rnd(r * 5.3 + c * 9.1) > 0.5 ? <rect key={`s${r}-${c}`} x={652 + c * 38} y={base - 620 + r * 28} width={22} height={10} fill="#F0C27A" opacity={0.6} /> : null)),
          )}
          <rect x={0} y={base} width={1080} height={400} fill="#060507" />
          <ellipse cx={540} cy={base + 30} rx={620} ry={60} fill="#F0A955" opacity={0.12} />
        </svg>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(22,13,4,0.25) 0%, rgba(22,13,4,0.05) 50%, rgba(22,13,4,0.4) 100%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#070504", opacity: oscuro }} />
      <Pelicula op={0.9} />
    </AbsoluteFill>
  );
};

/** Sello de lacre con el año. */
const Sello: React.FC<{ x: number; y: number; desde: number; texto: string }> = ({ x, y, desde, texto }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const k = sp(f, desde, REBOTE);
  return (
    <div style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, borderRadius: 90, background: `radial-gradient(circle at 38% 34%, #D0644E, ${ROJO} 60%, #5E2016)`, border: "5px solid rgba(0,0,0,0.25)", transform: `scale(${2 - k}) rotate(-12deg)`, opacity: Math.min(1, k * 1.5), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: CLAVE, fontSize: 62, color: "#2A0D08", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>{texto}</div>
  );
};

// ───────────────────────── escenas ─────────────────────────

/** 1 · Gancho: la tortuga dorada, los 23 y la cifra. */
const TGancho: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [vein, n175, mismas, exp] = b;
  const t = temblor(f, n175, 18, 14);
  const zoom = 1 + f * 0.0009 + 0.04 * pr(f, n175, 6);
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${zoom})`, transformOrigin: "540px 1000px" }}>
      <AbsoluteFill style={{ background: ORO, opacity: interpolate(f, [n175, n175 + 2, n175 + 10], [0, 0.2, 0], cl) }} />
      <Hud texto="// CHICAGO · 1983" y={330} />
      <Titulo y={410} desde={vein} texto="23 DESCONOCIDOS" tam={112} color="#F2EEDF" />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <radialGradient id="tg-halo">
            <stop offset="0" stopColor={ORO} stopOpacity="0.4" />
            <stop offset="1" stopColor={ORO} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* los 23, uno a uno */}
        {Array.from({ length: 23 }).map((_, k) => {
          const a = sp(f, vein + 4 + k, REBOTE);
          const x = 144 + (k % 12) * 72 + (k >= 12 ? 36 : 0),
            y = 640 + (k >= 12 ? 84 : 0);
          return (
            <g key={k} transform={`translate(${x} ${y}) scale(${a})`} opacity={0.9}>
              <circle cx={0} cy={-26} r={13} fill={f >= n175 ? ORO : PLATA} />
              <path d="M-20 22 Q-20 -8 0 -8 Q20 -8 20 22 Z" fill={f >= n175 ? ORO : PLATA} />
            </g>
          );
        })}
        <circle cx={540} cy={1090} r={430} fill="url(#tg-halo)" opacity={0.5 + 0.5 * pr(f, n175, 8)} />
        <TortugaOro x={510} y={1210} esc={2.5} anda={0.5} />
      </svg>
      <Chispas desde={n175} x={540} y={1470} n={18} r={260} />
      <CajaTexto x={540} y={1390} desde={n175} texto={`${miles(175e6 * pr(f, n175, 24, Easing.out(Easing.quad)))} $`} fondo={ORO} color={NOCHE} tam={124} />
      <Titulo y={1570} desde={mismas} texto="CON LAS MISMAS REGLAS" tam={58} color={PLATA} fuente={VIVO} />
      <Tarjeta y={1690} desde={exp} texto="THE GREATEST TRADING EXPERIMENT" tam={27} />
    </AbsoluteFill>
  );
};

/** 2 · La apuesta: Dennis contra Eckhardt. ¿Nacen o se hacen? */
const TDuelo: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [chi, den, n1600, fort, nacen, hacen] = b;
  const amigo = nacen - 22;
  const sube = pr(f, n1600 + 4, Math.max(10, fort - n1600), Easing.inOut(Easing.quad));
  const t = temblor(f, hacen, 12, 10);
  const giro = Math.cos((f - nacen) / 5);
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
      <Chicago1983 />
      <Hud texto="// CHICAGO · 1983" desde={chi} />
      <Sello x={900} y={520} desde={chi + 6} texto="1983" />
      {/* de 1.600 dólares a una fortuna */}
      {f >= n1600 && (
        <>
          <Panel x={60} y={610} w={720} h={330} op={pr(f, n1600, 8)} />
          <div style={{ position: "absolute", left: 100, top: 640, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: CREMA, opacity: 0.8 }}>PRÉSTAMO</div>
          <div style={{ position: "absolute", left: 100, top: 676, fontFamily: CLAVE, fontSize: 84, color: "#F2EEDF", transform: `scale(${sp(f, n1600, REBOTE)})`, transformOrigin: "0 50%" }}>1.600 $</div>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <Trazo d="M110 900 C260 895 380 880 470 820 S640 690 740 650" p={sube} color={ORO} grosor={7} />
            {sube > 0.02 && sube < 1 && <circle cx={110 + 630 * sube} cy={900 - 250 * Math.pow(sube, 1.7)} r={10} fill="#FFE7A3" />}
          </svg>
        </>
      )}
      <CajaTexto x={560} y={800} desde={fort} texto="UNA FORTUNA" fondo={ORO} color={NOCHE} tam={76} />
      {/* los dos amigos */}
      <Hombre x={800} y={1500} esc={0.95} borde={f >= hacen ? ORO : PLATA} op={pr(f, den, 10)} />
      <Hombre x={280} y={1500} esc={0.95} borde={PLATA} op={pr(f, amigo, 10)} />
      <Tarjeta y={1520} x={800} desde={den} texto="RICHARD DENNIS" tam={24} />
      <Tarjeta y={1520} x={280} desde={amigo} texto="WILLIAM ECKHARDT" tam={24} color={PLATA} />
      <CajaTexto x={280} y={955} desde={nacen} texto="NACEN" fondo="rgba(8,12,10,0.85)" color={PLATA} tam={84} contorno={PLATA} giro={-3} />
      <CajaTexto x={800} y={955} desde={hacen} texto="SE HACEN" fondo={ORO} color={NOCHE} tam={84} giro={3} />
      {f >= nacen && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform={`translate(540 1280) scale(${sp(f, nacen, REBOTE)})`}>
            <ellipse cx={0} cy={0} rx={64 * Math.abs(giro)} ry={64} fill={giro > 0 ? ORO : "#B8932A"} stroke="#FFE7A3" strokeWidth={4} />
            {Math.abs(giro) > 0.35 && (
              <text x={0} y={24} textAnchor="middle" fontFamily={CLAVE} fontSize={70} fill={NOCHE} transform={`scale(${Math.abs(giro)} 1)`}>
                $
              </text>
            )}
          </g>
        </svg>
      )}
      <Tarjeta y={1640} desde={nacen} texto="THE BET · NATURE vs NURTURE" />
    </AbsoluteFill>
  );
};

/** Los 23 elegidos entre los mil (posiciones fijas en la rejilla de 40 × 25). */
const ELEGIDOS = new Set(Array.from({ length: 23 }).map((_, k) => Math.floor(rnd(k * 17.3 + 2) * 40) + 40 * ((k * 11 + 3) % 25)));
/** 3 · El anuncio: mil postulantes, 23 elegidos. */
const TAnuncio: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [anuncio, mil, guardia, blackjack, dungeons, n23] = b;
  const sube = pr(f, mil - 6, 14, Easing.inOut(Easing.cubic));
  const entra = sp(f, anuncio);
  const elige = pr(f, n23, 14);
  const iconos: [number, string, React.ReactNode][] = [
    [guardia, "GUARDIA", <path key="g" d="M0 -34 L28 -22 L28 6 Q28 28 0 38 Q-28 28 -28 6 L-28 -22 Z M0 -14 L6 -2 L19 -1 L9 8 L12 21 L0 14 L-12 21 L-9 8 L-19 -1 L-6 -2 Z" fill="none" stroke={CREMA} strokeWidth={4} strokeLinejoin="round" />],
    [blackjack, "BLACKJACK", <g key="b"><rect x={-30} y={-34} width={44} height={62} rx={6} fill="none" stroke={CREMA} strokeWidth={4} transform="rotate(-12)" /><rect x={-10} y={-32} width={44} height={62} rx={6} fill="#0B0F0D" stroke={CREMA} strokeWidth={4} transform="rotate(8)" /><text x={14} y={12} textAnchor="middle" fontFamily={CLAVE} fontSize={34} fill={CREMA} transform="rotate(8)">21</text></g>],
    [dungeons, "DISEÑADOR D&D", <g key="d"><path d="M0 -38 L33 -19 L33 19 L0 38 L-33 19 L-33 -19 Z M0 -38 L0 -12 M-33 19 L-17 12 M33 19 L17 12 M0 -12 L17 12 L-17 12 Z" fill="none" stroke={CREMA} strokeWidth={4} strokeLinejoin="round" /><text x={0} y={10} textAnchor="middle" fontFamily={CLAVE} fontSize={18} fill={CREMA}>20</text></g>],
  ];
  return (
    <AbsoluteFill>
      <Chicago1983 oscuro={0.35 + 0.35 * sube} />
      {/* el anuncio en el periódico */}
      <div style={{ position: "absolute", left: 140, top: 430, width: 800, height: 560, background: "#E9DFC4", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", transformOrigin: "50% 0%", transform: `translateY(${(1 - entra) * 500 - sube * 30}px) rotate(${-3 + 2 * sube}deg) scale(${1 - 0.52 * sube})`, opacity: Math.min(1, entra * 2), padding: 34, fontFamily: "Georgia, serif", color: "#1B1712" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, borderBottom: "4px double #1B1712", paddingBottom: 10 }}>
          <span>CLASIFICADOS</span>
          <span>CHICAGO · 1983</span>
        </div>
        <div style={{ border: "5px solid #1B1712", margin: "30px 20px 0", padding: "26px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: CLAVE, fontSize: 96, lineHeight: 1 }}>SE BUSCAN</div>
          <div style={{ fontFamily: CLAVE, fontSize: 124, lineHeight: 1.05 }}>TRADERS</div>
          <div style={{ fontSize: 32, marginTop: 14, fontStyle: "italic" }}>No hace falta experiencia</div>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 26 }}>
          {[0, 1, 2].map((c) => (
            <div key={c} style={{ flex: 1 }}>
              {[0, 1, 2, 3].map((r) => (
                <div key={r} style={{ height: 8, background: "#1B1712", opacity: 0.35, marginBottom: 10, width: `${70 + rnd(c * 3 + r) * 30}%` }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* mil luces: una por postulante */}
      {f >= mil - 4 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 1000 }).map((_, k) => {
            const c = k % 40,
              r = Math.floor(k / 40);
            const a = pr(f, mil + (c + r) * 0.45 + rnd(k) * 4, 6);
            if (a <= 0) return null;
            const el = ELEGIDOS.has(k);
            return <circle key={k} cx={92 + c * 23} cy={890 + r * 23} r={el ? 5 + 5 * elige : 5} fill={el && elige > 0 ? ORO : CREMA} opacity={a * (el ? 0.75 + 0.25 * elige : 0.75 - 0.6 * elige)} />;
          })}
          {elige > 0 && [...ELEGIDOS].map((k) => <circle key={`h${k}`} cx={92 + (k % 40) * 23} cy={890 + Math.floor(k / 40) * 23} r={20} fill={ORO} opacity={0.22 * elige} />)}
        </svg>
      )}
      {f >= mil && f < n23 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 745, textAlign: "center", fontFamily: CLAVE, fontSize: 92, color: "#F2EEDF", textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>
          {miles(1000 * pr(f, mil, 20, Easing.out(Easing.quad)))} <span style={{ fontFamily: VIVO, fontSize: 52, color: CREMA }}>POSTULANTES</span>
        </div>
      )}
      <CajaTexto x={540} y={735} desde={n23} texto="23 ELEGIDOS" fondo={ORO} color={NOCHE} tam={96} />
      {/* de dónde venían */}
      {iconos.map(([d, nombre, dibujo], k) =>
        f >= d ? (
          <div key={k} style={{ position: "absolute", left: 60 + k * 330, top: 1490, width: 300, textAlign: "center", transform: `scale(${sp(f, d, REBOTE)})` }}>
            <svg width={120} height={100} viewBox="-60 -50 120 100">{dibujo}</svg>
            <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 23, letterSpacing: 3, color: CREMA, marginTop: 6 }}>{nombre}</div>
          </div>
        ) : null,
      )}
      <Tarjeta y={1680} desde={n23} texto="1,000 APPLICANTS · 23 TURTLES" />
    </AbsoluteFill>
  );
};

/** 4 · La pizarra: dos semanas, cinco reglas. */
const TPizarra: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [dos, cinco] = b;
  const luz = pr(f, 0, 12);
  return (
    <AbsoluteFill>
      <Polvo n={40} op={0.6} />
      <div style={{ position: "absolute", left: 80, top: 440, width: 920, height: 900, borderRadius: 14, background: "linear-gradient(160deg, #23402F, #16291F)", border: "16px solid #6B4A2B", boxShadow: `0 30px 90px rgba(0,0,0,0.7), 0 0 ${120 * luz}px rgba(212,175,55,${0.25 * luz})`, opacity: luz }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: F.mano, fontSize: 120, color: "#F2EEDF", opacity: pr(f, 4, 10) }}>The System</div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Trazo d="M300 640 Q540 668 780 636" p={pr(f, 8, 12)} color={ORO} grosor={6} />
        {[0, 1, 2, 3, 4].map((k) => {
          const d = cinco + k * 5;
          const y = 760 + k * 108;
          return (
            <g key={k} opacity={pr(f, d, 6)}>
              <text x={170} y={y + 22} fontFamily={F.mano} fontSize={84} fill={ORO}>
                {k + 1}
              </text>
              <Trazo d={`M250 ${y + 14} q${90 + k * 6} -14 ${180 + k * 10} 0 t${200 - k * 10} 2 t${170 + (k % 2) * 60} -4`} p={pr(f, d + 2, 12)} color="#F2EEDF" grosor={7} op={0.85} />
            </g>
          );
        })}
        <TortugaOro x={250} y={1560} esc={0.8} anda={0} fase={1} />
        <TortugaOro x={520} y={1580} esc={0.9} anda={0} fase={3} />
        <TortugaOro x={800} y={1560} esc={0.8} anda={0} fase={5} />
      </svg>
      <Sello x={880} y={470} desde={dos} texto="2 SEM" />
      <Tarjeta y={1660} desde={cinco} texto="THE SYSTEM · 2 WEEKS · 5 RULES" />
    </AbsoluteFill>
  );
};

/** Velas en rango durante 20 días y luego la ruptura (ilustrativo, no son precios reales). */
const serieRuptura = (alza: boolean, sem: number): Vela[] => {
  const out: Vela[] = [];
  let c = 48;
  for (let k = 0; k < 26; k++) {
    const o = c;
    if (k < 20) {
      c = 48 + 1.35 * Math.sin(k * 0.85 + sem) + (rnd(sem + k * 3.1) - 0.5) * 0.9;
      if (k === 19) c = alza ? 49.1 : 46.9;
    } else c = o + (alza ? 1 : -1) * (0.75 + rnd(sem + k * 2.3) * 0.55);
    let h = Math.max(o, c) + rnd(sem + k * 5.3) * 0.45,
      l = Math.min(o, c) - rnd(sem + k * 7.7) * 0.45;
    if (k < 20) {
      h = Math.min(h, 49.85);
      l = Math.max(l, 46.15);
    }
    out.push({ o, h, l, c, v: 1 });
  }
  out[alza ? 7 : 9][alza ? "h" : "l"] = alza ? 50 : 46;
  return out;
};
const RUP_A = serieRuptura(true, 1.3),
  RUP_B = serieRuptura(false, 4.1);
const Ruptura: React.FC<{ alza: boolean; t0: number; tLinea: number; tOrden: number; op: number }> = ({ alza, t0, tLinea, tOrden, op }) => {
  const f = useCurrentFrame();
  const v = alza ? RUP_A : RUP_B;
  const [lo, hi] = alza ? [45.2, 55.6] : [40.4, 50.8];
  const G = { x0: 110, x1: 970, y0: 650, y1: 1330 };
  const paso = (G.x1 - G.x0) / 26;
  const X = (k: number) => G.x0 + (k + 0.5) * paso;
  const Y = (p: number) => G.y0 + ((hi - p) / (hi - lo)) * (G.y1 - G.y0);
  const nivel = alza ? 50 : 46;
  const col = alza ? AZUL : ROJO;
  const linea = pr(f, tLinea, 12);
  const tRompe = tOrden - 6;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      {v.map((d, k) => {
        const nace = k < 20 ? t0 + k * 1.2 : tRompe + (k - 20) * 4;
        const a = pr(f, nace, k < 20 ? 5 : 4, Easing.linear);
        if (a <= 0) return null;
        const c = d.o + (d.c - d.o) * a;
        const sube = d.c >= d.o;
        const rota = k >= 20;
        const color = rota ? col : CREMA;
        return (
          <g key={k}>
            <line x1={X(k)} y1={Y(Math.max(d.o, c, rota ? c : d.h))} x2={X(k)} y2={Y(Math.min(d.o, c, rota ? c : d.l))} stroke={color} strokeWidth={3} />
            <rect x={X(k) - paso * 0.3} y={Y(Math.max(d.o, c))} width={paso * 0.6} height={Math.max(3, Math.abs(Y(d.o) - Y(c)))} fill={rota ? col : sube ? CREMA : "#0B0F0D"} stroke={color} strokeWidth={3} />
          </g>
        );
      })}
      {/* el máximo (o mínimo) de los últimos 20 días */}
      <line x1={G.x0} y1={Y(nivel)} x2={G.x0 + (G.x1 - G.x0) * linea} y2={Y(nivel)} stroke={ORO} strokeWidth={4} strokeDasharray="14 10" />
      <g opacity={linea}>
        <rect x={G.x0} y={Y(nivel) + (alza ? -62 : 14)} width={292} height={46} rx={8} fill="#0B0F0D" stroke={ORO} strokeWidth={2} />
        <Mono x={G.x0 + 146} y={Y(nivel) + (alza ? -30 : 46)} t={alza ? "20-DAY HIGH" : "20-DAY LOW"} color={ORO} ancla="middle" />
        <path d={`M${X(0)} ${G.y1 + 26} L${X(19)} ${G.y1 + 26} M${X(0)} ${G.y1 + 12} L${X(0)} ${G.y1 + 40} M${X(19)} ${G.y1 + 12} L${X(19)} ${G.y1 + 40}`} stroke={CREMA} strokeWidth={3} opacity={0.7} />
        <Mono x={(X(0) + X(19)) / 2} y={G.y1 + 70} t="20 DÍAS" ancla="middle" op={0.85} />
      </g>
      {/* la ruptura dispara la orden */}
      {f >= tOrden && (
        <>
          <circle cx={X(20)} cy={Y(nivel)} r={18 + 70 * pr(f, tOrden, 16)} fill="none" stroke={col} strokeWidth={5} opacity={1 - pr(f, tOrden, 16)} />
          <circle cx={X(20)} cy={Y(nivel)} r={11} fill={col} stroke="#fff" strokeWidth={3} />
          <g transform={`translate(${X(20) - 70} ${Y(nivel) + (alza ? 150 : -150)}) scale(${1.9 * sp(f, tOrden, REBOTE)})`}>
            <Flecha x={0} y={0} abajo={!alza} color={col} />
          </g>
        </>
      )}
    </svg>
  );
};
/** 5 · Regla 1: trend following. Rompe el máximo de 20 días → compras; rompe el mínimo → vendes. */
const TBreakout: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [uno, maximo, compras, minimo, vendes] = b;
  const cambio = minimo - 8;
  const opA = interpolate(f, [cambio, cambio + 8], [1, 0], cl),
    opB = interpolate(f, [cambio + 4, cambio + 12], [0, 1], cl);
  return (
    <AbsoluteFill>
      <Cabecera n={1} nombre="TREND FOLLOWING" desde={uno} />
      <Panel x={50} y={560} w={980} h={920} op={pr(f, 0, 8)} />
      <Ruptura alza t0={uno + 2} tLinea={maximo} tOrden={compras} op={opA} />
      <Ruptura alza={false} t0={cambio + 2} tLinea={minimo} tOrden={vendes} op={opB} />
      {f < cambio + 4 && <CajaTexto x={840} y={1270} desde={compras} texto="BUY" fondo={AZUL} tam={92} giro={-3} />}
      <CajaTexto x={770} y={700} desde={vendes} texto="SELL" fondo={ROJO} tam={92} giro={3} />
      <Tarjeta y={1530} desde={maximo} texto="RULE 1 · 20-DAY BREAKOUT" />
      <Paseo />
    </AbsoluteFill>
  );
};

/** 6 · Regla 2: position sizing. Un movimiento normal del día (1N) = 1 % de la cuenta. */
const TSizing: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [dos, mov, cuesta, uno] = b;
  const velas = [0.2, -0.6, 0.5, -0.3, 0.7, -0.5, 0.4, -0.8, 0.6];
  const N = 120;
  let y = 860;
  const cuerpos = velas.map((d, k) => {
    const o = y;
    y = o - d * N * 0.75;
    return { x: 150 + k * 78, o, c: y, h: Math.min(o, y) - 22 - rnd(k * 3.1) * 14, l: Math.max(o, y) + 22 + rnd(k * 5.3) * 14 };
  });
  const foco = cuerpos[7];
  const marca = pr(f, mov, 10);
  const barra = pr(f, cuesta - 10, 12);
  const pierde = pr(f, cuesta, 10);
  return (
    <AbsoluteFill>
      <Cabecera n={2} nombre="POSITION SIZING" desde={dos} />
      <Panel x={50} y={560} w={980} h={920} op={pr(f, 0, 8)} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Mono x={110} y={630} t="EL PRECIO, DÍA A DÍA" op={0.8} />
        {cuerpos.map((c, k) => {
          const a = pr(f, dos + 2 + k * 2, 6);
          const es = k === 7;
          const color = es && f >= mov ? ORO : CREMA;
          return (
            <g key={k} opacity={a * (f >= mov && !es ? 0.45 : 1)}>
              <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={color} strokeWidth={3} />
              <rect x={c.x - 22} y={Math.min(c.o, c.c)} width={44} height={Math.max(4, Math.abs(c.o - c.c))} fill={c.c < c.o ? color : "#0B0F0D"} stroke={color} strokeWidth={3} />
            </g>
          );
        })}
        {/* el tamaño de un día normal: N */}
        <g opacity={marca}>
          <path d={`M${foco.x + 44} ${foco.h} L${foco.x + 74} ${foco.h} M${foco.x + 44} ${foco.l} L${foco.x + 74} ${foco.l} M${foco.x + 59} ${foco.h} L${foco.x + 59} ${foco.l}`} stroke={ORO} strokeWidth={5} />
          <text x={foco.x + 90} y={(foco.h + foco.l) / 2 + 26} fontFamily={CLAVE} fontSize={84} fill={ORO}>
            1N
          </text>
          <Mono x={110} y={1040} t="N = LO QUE SE MUEVE EN UN DÍA NORMAL" tam={25} color={ORO} />
        </g>
        {/* la cuenta: el 1 % que cuesta ese movimiento */}
        <g opacity={barra}>
          <Mono x={110} y={1150} t="TU CUENTA · 100 %" op={0.85} />
          <rect x={110} y={1176} width={860 * barra} height={74} rx={10} fill="#3E5A2C" stroke={CREMA} strokeWidth={3} />
          <rect x={110} y={1176} width={Math.max(0, 8.6 * pierde)} height={74} rx={3} fill={ROJO} />
        </g>
        {pierde > 0 && (
          <g opacity={pierde}>
            <path d="M114 1250 L114 1300 L330 1340" stroke={ROJO} strokeWidth={4} fill="none" />
            <rect x={110} y={1330} width={860} height={110} rx={12} fill="#0B0F0D" stroke={ROJO} strokeWidth={3} />
            <rect x={110} y={1330} width={150 * pierde} height={110} rx={12} fill={ROJO} />
            <text x={185} y={1408} textAnchor="middle" fontFamily={CLAVE} fontSize={64} fill="#fff">
              1 %
            </text>
            <Mono x={290} y={1396} t="SI VA 1N EN CONTRA, PIERDES ESTO" tam={25} />
          </g>
        )}
      </svg>
      <CajaTexto x={640} y={650} desde={uno} texto="1N = 1 % DE LA CUENTA" fondo={ORO} color={NOCHE} tam={62} giro={-2} />
      <Tarjeta y={1530} desde={mov} texto="RULE 2 · 1N = 1% OF ACCOUNT" />
      <Paseo />
    </AbsoluteFill>
  );
};

/** 7 · Reglas 3, 4 y 5 sobre la misma operación: stop a 2N, sumar si sigue a favor y dejar correr. */
const TReglas: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [tres, cuatro, sumar, cinco] = b;
  const p = interpolate(f, [0, Math.max(1, cuatro), sumar, cinco, cinco + 34], [0.1, 0.24, 0.3, 0.66, 1], cl);
  const N = 62;
  const pt = (t: number): [number, number] => [130 + t * 800, 1250 - t * 520 - Math.sin(t * 22) * 18 * (1 - t * 0.5)];
  const pts = Array.from({ length: 81 }).map((_, k) => pt((k / 80) * p));
  const [ex, ey] = pt(0.1);
  const [ux, uy] = pts[pts.length - 1];
  const suma = [0.34, 0.46, 0.58].map((t) => ({ t, xy: pt(t) }));
  const unidades = 1 + suma.filter((s) => p >= s.t).length;
  const stop = pr(f, tres, 10);
  // el stop sube con cada unidad que se añade
  const stopY = ey + 2 * N - (unidades - 1) * 0.5 * N * 1.6;
  return (
    <AbsoluteFill>
      <Cabecera n={3} nombre="STOP LOSS · 2N" desde={tres} hasta={cuatro} />
      <Cabecera n={4} nombre="PYRAMIDING" desde={cuatro} hasta={cinco} />
      <Cabecera n={5} nombre="RIDE THE WINNER" desde={cinco} />
      <Panel x={50} y={560} w={980} h={920} op={pr(f, 0, 8)} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="tr-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ORO} stopOpacity="0.28" />
            <stop offset="1" stopColor={ORO} stopOpacity="0" />
          </linearGradient>
        </defs>
        {f >= cinco && <path d={`M${pts[0][0]} 1400 ` + pts.map(([x, y]) => `L${x} ${y}`).join(" ") + ` L${ux} 1400 Z`} fill="url(#tr-area)" opacity={pr(f, cinco, 14)} />}
        {/* stop loss: 2N por debajo de la entrada */}
        <g opacity={stop}>
          <line x1={110} y1={stopY} x2={110 + 860 * stop} y2={stopY} stroke={ROJO} strokeWidth={5} strokeDasharray="16 10" />
          <Mono x={960} y={stopY + 38} t="STOP LOSS" color={ROJO} ancla="end" />
          {unidades === 1 && (
            <>
              <path d={`M${ex - 34} ${ey} L${ex - 34} ${ey + 2 * N} M${ex - 46} ${ey} L${ex - 22} ${ey} M${ex - 46} ${ey + 2 * N} L${ex - 22} ${ey + 2 * N}`} stroke={ROJO} strokeWidth={4} />
              <text x={ex - 4} y={ey + N + 22} fontFamily={CLAVE} fontSize={58} fill={ROJO}>
                2N
              </text>
            </>
          )}
        </g>
        <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={f >= cinco ? ORO : "#F2EEDF"} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
        {/* entrada */}
        <circle cx={ex} cy={ey} r={13} fill={AZUL} stroke="#fff" strokeWidth={3} />
        <Mono x={ex + 4} y={ey - 28} t="BUY" color={AZUL} ancla="middle" tam={28} />
        {/* pyramiding: una unidad más cada ½N a favor */}
        {suma.map((s, k) =>
          p >= s.t ? (
            <g key={k}>
              <circle cx={s.xy[0]} cy={s.xy[1]} r={11} fill={AZUL} stroke="#fff" strokeWidth={3} />
              <Mono x={s.xy[0]} y={s.xy[1] - 26} t="+1" color={AZUL} ancla="middle" tam={30} />
            </g>
          ) : null,
        )}
        {f >= cuatro && (
          <g opacity={pr(f, cuatro, 8)}>
            <Mono x={110} y={640} t="UNIDADES" op={0.85} />
            {[0, 1, 2, 3].map((k) => (
              <rect key={k} x={110 + k * 66} y={660} width={54} height={54} rx={8} fill={k < unidades ? AZUL : "none"} stroke={k < unidades ? "#fff" : CREMA} strokeOpacity={k < unidades ? 1 : 0.4} strokeWidth={3} />
            ))}
            <Mono x={110} y={756} t="+1 CADA ½N A FAVOR · MÁX. 4" tam={22} op={0.75} />
          </g>
        )}
        {/* la tortuga se sube a la tendencia */}
        {f >= cinco && <TortugaOro x={ux - 30} y={uy - 34} esc={0.62 * sp(f, cinco, REBOTE)} ang={-30} />}
        <circle cx={ux} cy={uy} r={10} fill={f >= cinco ? ORO : "#F2EEDF"} />
      </svg>
      <CajaTexto x={330} y={830} desde={cinco + 10} texto="DEJA CORRER" fondo={ORO} color={NOCHE} tam={64} giro={-3} />
      <Tarjeta y={1400} desde={tres + 14} texto="N = ATR DE 20 DÍAS" tam={22} color={CREMA} x={770} />
      <Tarjeta y={1530} desde={tres} texto="RULES 3 · 4 · 5" />
      <Paseo />
    </AbsoluteFill>
  );
};

/** 8 · El resultado: cinco años después, 175 millones. */
const TResultado: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [cinco, n175] = b;
  const t = temblor(f, n175, 16, 12);
  const anio = Math.round(1983 + 5 * pr(f, cinco, Math.max(10, n175 - cinco), Easing.inOut(Easing.quad)));
  const sube = pr(f, cinco, 50, Easing.out(Easing.quad));
  const linea = (k: number): [number, number] => [70 + k * 950, 1560 - k * 430 - Math.sin(k * 9) * 20];
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
      <AbsoluteFill style={{ background: ORO, opacity: interpolate(f, [n175, n175 + 2, n175 + 10], [0, 0.2, 0], cl) }} />
      <Polvo n={70} />
      <Hud texto="// CHICAGO · 1983 → 1988" y={330} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: CLAVE, fontSize: 190, color: "#F2EEDF", letterSpacing: 4, textShadow: "0 8px 40px rgba(0,0,0,0.7)" }}>{anio}</div>
      <Titulo y={640} desde={cinco} texto="5 AÑOS DESPUÉS" tam={66} color={PLATA} fuente={VIVO} />
      <Chispas desde={n175} x={540} y={900} n={22} r={320} />
      <CajaTexto x={540} y={800} desde={n175} texto={`${miles(175e6 * pr(f, n175, 26, Easing.out(Easing.quad)))} $`} fondo={ORO} color={NOCHE} tam={128} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <polyline points={Array.from({ length: 41 }).map((_, k) => linea((k / 40) * sube).join(",")).join(" ")} fill="none" stroke={ORO} strokeWidth={7} strokeLinecap="round" />
        {[0.86, 0.66, 0.46, 0.26, 0.08].map((d, k) => {
          const q = sube * d;
          const [x, y] = linea(q);
          return q > 0.03 ? <TortugaOro key={k} x={x} y={y - 24} esc={0.5} fase={k * 1.7} ang={-24} /> : null;
        })}
      </svg>
      <Tarjeta y={1640} desde={n175 + 8} texto="23 TURTLES · $250K–$2M EACH" />
    </AbsoluteFill>
  );
};

/** 9 · El secreto: no era el sistema, era la disciplina. */
const TDisciplina: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [secreto, sistema, disc] = b;
  const t = temblor(f, disc, 16, 12);
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
      <Polvo n={60} />
      <Titulo y={520} desde={secreto} texto="EL SECRETO NO ERA" tam={66} color={PLATA} fuente={VIVO} />
      <Titulo y={620} desde={sistema} texto="EL SISTEMA" tam={140} color="#8E9690" />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Trazo d="M190 716 L890 696" p={pr(f, disc - 10, 8)} color={ROJO} grosor={12} />
        <line x1={0} y1={1600} x2={1080} y2={1600} stroke={ORO} strokeOpacity={0.3} strokeWidth={3} />
        <TortugaOro x={-140 + f * 3.2} y={1560} esc={1.5} />
      </svg>
      <Chispas desde={disc} x={540} y={980} n={20} r={340} />
      <CajaTexto x={540} y={870} desde={disc} texto="DISCIPLINA" fondo={ORO} color={NOCHE} tam={168} />
      <Tarjeta y={1150} desde={disc + 10} texto="DISCIPLINE > IQ" tam={40} />
    </AbsoluteFill>
  );
};

/** 10 · CTA y adelanto: los tulipanes. */
const TCta: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [comenta, proximo, flores, casa] = b;
  const crece = pr(f, flores, 14, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill>
      <Titulo y={400} desde={comenta} texto="COMENTA" tam={90} color="#F2EEDF" />
      <CajaTexto x={540} y={520} desde={comenta + 5} texto="TORTUGA" fondo={ORO} color={NOCHE} tam={170} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <g opacity={pr(f, comenta, 10)}>
          <TortugaOro x={500} y={1000} esc={1.7} anda={0.6} />
        </g>
        <line x1={120} y1={1130} x2={960} y2={1130} stroke={PLATA} strokeOpacity={0.25 * pr(f, proximo, 10)} strokeWidth={2} />
        {/* tulipán */}
        {f >= flores && (
          <g transform={`translate(330 1600) scale(${crece * 1.5})`}>
            <path d="M0 0 Q-6 -70 0 -150" stroke="#5E8C3A" strokeWidth={10} fill="none" strokeLinecap="round" />
            <path d="M0 -30 Q-60 -50 -70 -120 Q-20 -90 0 -50 Z M0 -40 Q50 -60 62 -112 Q16 -92 0 -60 Z" fill="#5E8C3A" />
            <path d="M-44 -210 Q-52 -150 0 -140 Q52 -150 44 -210 Q22 -190 0 -236 Q-22 -190 -44 -210 Z" fill={ROJO} stroke="#F2B8A8" strokeWidth={3} />
            <path d="M0 -236 Q-12 -180 0 -142 Q12 -180 0 -236 Z" fill="#D0644E" />
          </g>
        )}
        {f >= flores && (
          <text x={540} y={1470} textAnchor="middle" fontFamily={CLAVE} fontSize={150} fill={ORO} opacity={pr(f, casa - 4, 8)}>
            &gt;
          </text>
        )}
        {/* casa */}
        {f >= casa && (
          <g transform={`translate(760 1600) scale(${sp(f, casa, REBOTE) * 1.25})`}>
            <path d="M-90 0 L-90 -110 L0 -190 L90 -110 L90 0 Z" fill="#0B0F0D" stroke={CREMA} strokeWidth={6} strokeLinejoin="round" />
            <rect x={-22} y={-70} width={44} height={70} fill={CREMA} opacity={0.85} />
            <rect x={-70} y={-96} width={32} height={32} fill="#F0C27A" />
            <rect x={38} y={-96} width={32} height={32} fill="#F0C27A" />
          </g>
        )}
      </svg>
      <Titulo y={1160} desde={proximo} texto="PRÓXIMO VIDEO" tam={58} color={PLATA} fuente={VIVO} />
      <Tarjeta y={1660} desde={casa} texto="HOLANDA · 1637" />
    </AbsoluteFill>
  );
};

const def = (C: React.FC<PropsEscena>, momentos: number, sonidos: DefEscena["sonidos"]): DefEscena => ({ C, momentos, sonidos, alInicio: () => true });

export const tGancho = def(TGancho, 4, () => [[1, "golpe", 0.6]]);
export const tDuelo = def(TDuelo, 6, () => [
  [0, "sello", 0.45],
  [3, "monedas", 0.3],
  [5, "golpe", 0.4],
]);
export const tAnuncio = def(TAnuncio, 6, () => [
  [0, "papel", 0.4],
  [5, "ding", 0.4],
]);
export const tPizarra = def(TPizarra, 2, () => [[1, "pincel", 0.35]]);
export const tBreakout = def(TBreakout, 5, () => [
  [2, "subida", 0.3],
  [4, "perder", 0.3],
]);
export const tSizing = def(TSizing, 4, () => [[3, "sello", 0.4]]);
export const tReglas = def(TReglas, 4, () => [
  [0, "tic", 0.3],
  [2, "pop", 0.3],
  [3, "subida", 0.3],
]);
export const tResultado = def(TResultado, 2, () => [[1, "ganar", 0.45]]);
export const tDisciplina = def(TDisciplina, 3, () => [[2, "golpe", 0.5]]);
export const tCta = def(TCta, 4, () => [
  [0, "ding", 0.35],
  [1, "whoosh", 0.3],
]);
