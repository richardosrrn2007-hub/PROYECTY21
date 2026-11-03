// Vídeo 5 · El hombre que le declaró la guerra a Inglaterra (Soros, Miércoles Negro, 16-09-1992).
// Mundo: azul medianoche y plata, planeta nocturno, luna roja y Londres en silueta. Partículas de oro.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { F } from "../motor/estilos";
import { rnd } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { CLAVE, PRO, SECUND, VIVO, Trazo, pr, sp, temblor, REBOTE } from "./mg";
import { continua, type Vela } from "./Velas";
import { LIBRA_DM } from "./libra";
import { Planeta } from "./Planeta";

export const NOCHE = "#0A0F1E";
export const ACERO = "#1F3A5F";
export const PLATA = "#C9D1D9";
/** Rojo único del vídeo (micro-acento dramático: luna, sello, caída). */
export const ROJO = "#B8432F";
/** Plata-acero para objetos (balanza). */
const ACERO_PLATA = "#7E8A97";
export const ORO = "#D4AF37";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ───────────────────────── fondo de todo el vídeo ─────────────────────────

/** Luna roja con cráteres suaves y halo. */
export const Luna: React.FC<{ x: number; y: number; r: number; op?: number }> = ({ x, y, r, op = 1 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
    <defs>
      <radialGradient id="lu-halo">
        <stop offset="0.35" stopColor={ROJO} stopOpacity="0.45" />
        <stop offset="1" stopColor={ROJO} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lu-cuerpo" cx="0.38" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#D0644E" />
        <stop offset="0.65" stopColor={ROJO} />
        <stop offset="1" stopColor="#5E2016" />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r * 2.4} fill="url(#lu-halo)" />
    <circle cx={x} cy={y} r={r} fill="url(#lu-cuerpo)" />
    {[
      [-0.3, -0.2, 0.18],
      [0.25, 0.15, 0.13],
      [-0.05, 0.4, 0.1],
      [0.35, -0.35, 0.08],
    ].map(([dx, dy, rr], k) => (
      <circle key={k} cx={x + dx * r} cy={y + dy * r} r={rr * r} fill="#000" opacity={0.14} />
    ))}
  </svg>
);

/** Londres en silueta (con el Big Ben) a lo ancho de la pantalla. */
export const Londres: React.FC<{ base: number; color?: string; op?: number; esc?: number }> = ({ base, color = "#050814", op = 1, esc = 1 }) => {
  const tejados = [
    [0, 70], [60, 110], [120, 80], [180, 140], [230, 95], [300, 120], [360, 75], [420, 100], [640, 90], [700, 130], [760, 85], [820, 150], [880, 100], [940, 120], [1000, 80], [1080, 80],
  ];
  const d = `M0 ${base} ` + tejados.map(([x, h]) => `L${x} ${base - h * esc}`).join(" ") + ` L1080 ${base} Z`;
  // cúpula de St Paul a la izquierda y torre del reloj en el centro
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      <path d={d} fill={color} />
      <rect x={0} y={base - 1} width={1080} height={1920 - base + 1} fill={color} />
      <path d={`M190 ${base - 140 * esc} q50 -110 100 0 Z`} fill={color} />
      <rect x={236} y={base - 290 * esc} width={8} height={70 * esc} fill={color} />
      <path d={`M500 ${base} L500 ${base - 330 * esc} L540 ${base - 420 * esc} L580 ${base - 330 * esc} L580 ${base} Z`} fill={color} />
    </svg>
  );
};

// Costa de Gran Bretaña e Irlanda (lon, lat), simplificada a mano. Se proyecta sobre la superficie del planeta.
const GB: [number, number][] = [
  [-5.0, 58.6], [-3.0, 58.6], [-3.1, 58.0], [-4.0, 57.6], [-1.8, 57.6], [-2.1, 57.1], [-2.5, 56.5], [-3.0, 56.0], [-2.0, 55.8], [-1.6, 55.3], [-1.2, 54.6], [-0.1, 54.1], [0.1, 53.5], [0.3, 53.0], [1.7, 52.7], [1.6, 52.1], [1.0, 51.8], [0.5, 51.5], [1.4, 51.3], [1.0, 51.0], [0.0, 50.8], [-1.0, 50.7], [-2.0, 50.6], [-3.5, 50.3], [-4.5, 50.3], [-5.7, 50.1], [-5.0, 50.6], [-4.2, 51.1], [-3.0, 51.3], [-4.0, 51.6], [-5.2, 51.7], [-4.2, 52.3], [-4.1, 52.9], [-4.6, 53.3], [-3.0, 53.4], [-3.0, 53.9], [-3.4, 54.5], [-3.2, 54.9], [-4.9, 54.7], [-5.1, 55.0], [-4.8, 55.6], [-5.6, 55.4], [-5.6, 56.3], [-6.2, 56.7], [-5.7, 57.3], [-5.8, 57.9],
];
const IRLANDA: [number, number][] = [
  [-6.0, 55.2], [-7.3, 55.3], [-8.3, 55.0], [-8.6, 54.3], [-10.0, 54.2], [-9.9, 53.5], [-9.3, 53.1], [-9.9, 52.2], [-10.3, 51.9], [-9.5, 51.5], [-8.2, 51.8], [-6.4, 52.2], [-6.0, 53.0], [-6.2, 53.6], [-5.5, 54.3],
];
const proy = ([lon, lat]: [number, number]) => [(lon + 3) * 0.588 * 60, -(lat - 54.5) * 60];
const trazoDe = (pts: [number, number][]) => "M" + pts.map((q) => proy(q).join(" ")).join(" L") + " Z";
const LONDRES_P = proy([-0.13, 51.5]);
/** Dónde queda Londres en pantalla durante la órbita (la escena 2 levanta el Big Ben justo ahí). */
export const LONDRES_XY = { x: 560, y: 1250 };

/** Fondo del vídeo: noche azul, el planeta de la serie y la luna roja.
 *  Al decir «Inglaterra» la cámara se lanza al planeta y queda en órbita sobre Gran Bretaña (plata, Londres en oro);
 *  al empezar la escena de los diarios vuelve a alejarse. */
export const FondoNoche: React.FC<{ sinLuna?: [number, number][]; viaje?: { ida: number; vuelta: number } }> = ({ sinLuna = [], viaje }) => {
  const f = useCurrentFrame();
  const ida = viaje?.ida ?? 1e9,
    vuelta = viaje?.vuelta ?? 1e9;
  const k = f < vuelta ? interpolate(f, [ida, ida + 22], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) }) : interpolate(f, [vuelta, vuelta + 34], [1, 0], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const lerp = (a: number, z: number) => a + (z - a) * k;
  const cx = lerp(1250, 540),
    cy = lerp(1080, 2850),
    r = lerp(900, 1960);
  const destello = interpolate(f, [ida + 20, ida + 23, ida + 36], [0, 0.6, 0], cl);
  const mapa = Math.max(0, (k - 0.4) / 0.6);
  const dibuja = interpolate(f, [ida + 18, ida + 40], [0, 1], cl);
  const sx = 1.1,
    sy = 0.62;
  const tx = LONDRES_XY.x - LONDRES_P[0] * sx,
    ty = LONDRES_XY.y - LONDRES_P[1] * sy;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 60% 30%, #12203A 0%, ${NOCHE} 60%)` }}>
      {/* el planeta de la serie, con su forma y sitio de siempre */}
      <Planeta cx={cx} cy={cy} r={r} sombra={k < 0.5} borde={5 + 3 * k} />
      {mapa > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: mapa }}>
          <defs>
            <clipPath id="fn-globo">
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
          </defs>
          <g clipPath="url(#fn-globo)">
            {Array.from({ length: 9 }).map((_, i) => (
              <ellipse key={`m${i}`} cx={cx} cy={cy} rx={r * Math.abs(Math.cos((i / 9) * Math.PI + f * 0.002))} ry={r} fill="none" stroke="rgba(201,209,217,0.08)" strokeWidth={2} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <ellipse key={`p${i}`} cx={cx} cy={cy - r + (i + 1) * 120} rx={r} ry={40 + i * 6} fill="none" stroke="rgba(201,209,217,0.07)" strokeWidth={2} />
            ))}
            <g transform={`translate(${tx} ${ty}) scale(${sx} ${sy})`}>
              {[GB, IRLANDA].map((pts, i) => (
                <path key={i} d={trazoDe(pts)} fill={`rgba(201,209,217,${0.1 * dibuja})`} stroke={PLATA} strokeOpacity={0.8} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - dibuja} />
              ))}
            </g>
            {/* Londres */}
            <circle cx={LONDRES_XY.x} cy={LONDRES_XY.y} r={(16 + 10 * Math.abs(Math.sin(f / 8))) * dibuja} fill={ORO} opacity={0.25} />
            <circle cx={LONDRES_XY.x} cy={LONDRES_XY.y} r={8 * dibuja} fill={ORO} />
          </g>
        </svg>
      )}
      <Luna x={160} y={330 + Math.sin(f / 60) * 5} r={68} op={sinLuna.reduce((o, [a, z]) => Math.min(o, interpolate(f, [a - 4, a + 6, z - 6, z + 4], [1, 0, 0, 1], cl)), 1)} />
      <AbsoluteFill style={{ background: "#EAF0F6", opacity: destello }} />
    </AbsoluteFill>
  );
};

// ───────────────────────── piezas ─────────────────────────

/** Hombre de traje, de espaldas (silueta con luz de borde plateada). */
export const Hombre: React.FC<{ x: number; y: number; esc?: number; borde?: string; op?: number; brazo?: number }> = ({ x, y, esc = 1, borde = PLATA, op = 1, brazo = 0 }) => {
  const f = useCurrentFrame();
  const resp = Math.sin(f / 22) * 2;
  const id = `hb${Math.round(x)}${Math.round(y)}`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A7B0BA" stopOpacity="0.75" />
          <stop offset="0.7" stopColor="#5D6670" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2A3038" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <g transform={`translate(${x} ${y}) scale(${esc})`}>
        {/* brazo que lanza (de espaldas, el izquierdo se levanta hacia la izquierda) */}
        {brazo > 0 && <path d={`M-130 -200 Q${-190 - 60 * brazo} ${-230 - 40 * brazo} ${-230 - 60 * brazo} ${-260 - 70 * brazo}`} fill="none" stroke="#03050A" strokeWidth={46} strokeLinecap="round" />}
        {/* chaqueta */}
        <path d={`M-165 0 L-158 -165 Q-150 -${232 + resp} -58 -250 L58 -250 Q150 -${232 + resp} 158 -165 L165 0 Z`} fill="#0B111C" />
        {/* costura central de la espalda */}
        <path d="M0 -245 L0 0" stroke="#0F1626" strokeWidth={3} />
        {/* cuello */}
        <rect x={-27} y={-292} width={54} height={50} rx={14} fill="#05070D" />
        <path d="M-40 -252 Q0 -238 40 -252 L36 -262 Q0 -250 -36 -262 Z" fill="#1B2333" />
        {/* cabeza */}
        <ellipse cx={0} cy={-338} rx={52} ry={63} fill="#05070D" />
        <ellipse cx={-52} cy={-330} rx={8} ry={16} fill="#05070D" />
        <ellipse cx={52} cy={-330} rx={8} ry={16} fill="#05070D" />
        {/* pelo canoso: masa con degradado y pocos mechones suaves */}
        <path d="M-53 -345 Q-54 -404 0 -405 Q54 -404 53 -345 Q46 -318 30 -306 Q0 -300 -30 -306 Q-46 -318 -53 -345 Z" fill={`url(#${id}p)`} />
        {[-24, 0, 24].map((dx, k) => (
          <path key={k} d={`M${dx * 0.6} -400 Q${dx + 4} -356 ${dx * 0.9} -312`} fill="none" stroke="#C3CBD3" strokeWidth={2} opacity={0.25} />
        ))}
        {/* luz de borde: solo hombros y nuca */}
        <g filter={`url(#${id})`} opacity={0.9}>
          <path d={`M-150 -175 Q-140 -${228 + resp} -58 -246`} fill="none" stroke={borde} strokeWidth={6} />
          <path d={`M150 -175 Q140 -${228 + resp} 58 -246`} fill="none" stroke={borde} strokeWidth={6} />
          <path d="M-24 -296 Q0 -290 24 -296" fill="none" stroke={borde} strokeWidth={4} />
        </g>
        <path d={`M-150 -175 Q-140 -${228 + resp} -58 -246`} fill="none" stroke={borde} strokeWidth={2.5} />
        <path d={`M150 -175 Q140 -${228 + resp} 58 -246`} fill="none" stroke={borde} strokeWidth={2.5} />
      </g>
    </svg>
  );
};

/** Monitor de cotización (apagado o encendido con una línea que cae). */
const Monitor: React.FC<{ x: number; y: number; w: number; h: number; luz: number; giro?: number; semilla: number }> = ({ x, y, w, h, luz, giro = 0, semilla }) => {
  const f = useCurrentFrame();
  const pts = Array.from({ length: 24 }).map((_, k) => {
    const t = k / 23;
    const caida = t < 0.55 ? 0 : (t - 0.55) * 1.9;
    return `${x + 20 + t * (w - 40)},${y + h * 0.3 + caida * h * 0.55 + Math.sin(k * 1.7 + semilla + f / 6) * 7}`;
  });
  return (
    <g transform={`rotate(${giro} ${x + w / 2} ${y + h / 2})`}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#05080F" stroke={PLATA} strokeOpacity={0.35 + 0.4 * luz} strokeWidth={4} />
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx={6} fill={ROJO} opacity={0.04 * luz} />
      {luz > 0 && <polyline points={pts.join(" ")} fill="none" stroke={ROJO} strokeWidth={6} opacity={luz} strokeLinejoin="round" />}
      <rect x={x + w / 2 - 8} y={y + h} width={16} height={40} fill="#0C1220" />
    </g>
  );
};

/** Caja de texto con fondo de color (para las cifras). */
const CajaTexto: React.FC<{ x: number; y: number; desde: number; texto: string; fondo: string; color?: string; tam: number; fuente?: string; giro?: number; contorno?: string }> = ({ x, y, desde, texto, fondo, color = "#fff", tam, fuente = CLAVE, giro = -2, contorno }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const k = sp(f, desde, REBOTE);
  return (
    <div style={{ position: "absolute", left: x - 520, top: y, width: 1040, display: "flex", justifyContent: "center" }}>
      <div style={{ background: fondo, color, fontFamily: fuente, fontSize: tam, padding: `${tam * 0.08}px ${tam * 0.28}px`, transform: `scale(${k}) rotate(${giro}deg)`, letterSpacing: 1, whiteSpace: "nowrap", boxShadow: contorno ? "none" : `0 0 50px ${fondo}55`, border: contorno ? `4px solid ${contorno}` : "none" }}>
        {texto}
      </div>
    </div>
  );
};

/** Texto grande que sube por máscara, centrado. */
const Titulo: React.FC<{ y: number; desde: number; texto: string; tam: number; color?: string; fuente?: string }> = ({ y, desde, texto, tam, color = PLATA, fuente = CLAVE }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const k = pr(f, desde, 10, Easing.out(Easing.exp));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", overflow: "hidden", height: tam * 1.25 }}>
      <div style={{ fontFamily: fuente, fontSize: tam, color, transform: `translateY(${(1 - k) * 110}%)`, whiteSpace: "nowrap", lineHeight: 1.2, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>{texto}</div>
    </div>
  );
};

/** Cadena dorada entre dos puntos; `p` cuánto se ha dibujado; `rota` separa las dos mitades. */
const Cadena: React.FC<{ x0: number; y0: number; x1: number; y1: number; p: number; grieta?: number; rota?: number; ondula?: number }> = ({ x0, y0, x1, y1, p, grieta = 0, rota = 0, ondula = 0 }) => {
  const f = useCurrentFrame();
  const n = 14;
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  const medio = Math.floor(n / 2);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - rota * 0.85 }}>
      {Array.from({ length: n }).map((_, k) => {
        const t = k / (n - 1);
        if (p <= 0 || t > p) return null;
        const lado = k < medio ? -1 : 1;
        const caeX = rota * lado * (40 + Math.abs(k - medio) * 4) * (1 + rota * 7);
        const caeY = rota * rota * (120 + Math.abs(k - medio) * 30) * (1 + rota * 4);
        const cx = x0 + (x1 - x0) * t + caeX;
        const cy = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 30 + Math.sin(f / 8 + k) * ondula + caeY;
        const vert = k % 2 === 1;
        const roto = k === medio && grieta > 0;
        return (
          <g key={k} transform={`translate(${cx} ${cy}) rotate(${ang + rota * lado * 40})`}>
            <ellipse cx={0} cy={0} rx={vert ? 26 : 30} ry={vert ? 9 : 18} fill="none" stroke={ORO} strokeWidth={vert ? 9 : 8} />
            {roto && <path d="M-6 -20 L4 -8 L-4 0 L7 10 L-2 22" fill="none" stroke="#FFF6D8" strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - grieta} />}
          </g>
        );
      })}
    </svg>
  );
};

/** Moneda de libra en plata (opcionalmente agrietada). */
const Libra: React.FC<{ x: number; y: number; r: number; grieta?: number; giro?: number }> = ({ x, y, r, grieta = 0, giro = 0 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
    <defs>
      <radialGradient id="lb-plata" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#F4F7FA" />
        <stop offset="0.6" stopColor={PLATA} />
        <stop offset="1" stopColor="#6F7C8A" />
      </radialGradient>
    </defs>
    <g transform={`rotate(${giro} ${x} ${y})`}>
      <circle cx={x} cy={y} r={r * 1.25} fill={PLATA} opacity={0.08} />
      <circle cx={x} cy={y} r={r} fill="url(#lb-plata)" />
      <circle cx={x} cy={y} r={r * 0.86} fill="none" stroke="#7D8996" strokeWidth={r * 0.03} />
      <text x={x} y={y + r * 0.42} textAnchor="middle" fontFamily={CLAVE} fontSize={r * 1.25} fill="#3A4654">
        £
      </text>
      {grieta > 0 && (
        <path
          d={`M${x - r * 0.15} ${y - r} L${x + r * 0.05} ${y - r * 0.5} L${x - r * 0.12} ${y - r * 0.1} L${x + r * 0.18} ${y + r * 0.3} L${x + r * 0.02} ${y + r * 0.62} L${x + r * 0.2} ${y + r}`}
          fill="none"
          stroke={NOCHE}
          strokeWidth={r * 0.045}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - grieta}
        />
      )}
    </g>
  </svg>
);

/** Partículas de oro que flotan (o convergen hacia un punto con `junta`). */
const Polvo: React.FC<{ n?: number; junta?: number; hacia?: [number, number][]; op?: number }> = ({ n = 60, junta = 0, hacia, op = 1 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      {Array.from({ length: n }).map((_, k) => {
        const x0 = rnd(k * 3.7) * 1080 + Math.sin(f / 30 + k) * 20;
        const y0 = (rnd(k * 5.1) * 1920 - f * (0.6 + rnd(k) * 1.2) + 1920 * 4) % 1920;
        const [tx, ty] = hacia ? hacia[k % hacia.length] : [x0, y0];
        const x = x0 + (tx - x0) * junta;
        const y = y0 + (ty - y0) * junta;
        return <circle key={k} cx={x} cy={y} r={1.5 + rnd(k * 9.3) * 3} fill={ORO} opacity={0.35 + 0.5 * rnd(k * 2.9)} />;
      })}
    </svg>
  );
};

// ───────────────────────── escenas ─────────────────────────

/** 1 · Gancho: silueta de espaldas, tres pantallas apagadas y la luna; BOOM con la cifra. */
const Gancho: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [boom, pais, mil, dia] = b;
  const luz = pr(f, boom, 4);
  const t = temblor(f, boom, 18, 14);
  const zoom = 1 + f * 0.0012 + 0.05 * pr(f, boom, 6);
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${zoom})`, transformOrigin: "540px 900px" }}>
      <AbsoluteFill style={{ background: ROJO, opacity: interpolate(f, [boom, boom + 2, boom + 10], [0, 0.18, 0], cl) }} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Monitor x={90} y={640} w={280} h={190} luz={luz} giro={-8} semilla={1} />
        <Monitor x={400} y={600} w={280} h={190} luz={luz} semilla={2} />
        <Monitor x={710} y={640} w={280} h={190} luz={luz} giro={8} semilla={3} />
      </svg>
      <Hombre x={540} y={1300} esc={1.25} borde={f >= boom ? ROJO : PLATA} />
      <Titulo y={410} desde={pais} texto="UN PAÍS ENTERO" tam={110} />
      <CajaTexto x={540} y={1400} desde={mil} texto="1.000.000.000 $" fondo={ORO} color={NOCHE} tam={120} />
      <Titulo y={1580} desde={dia} texto="EN UN SOLO DÍA" tam={72} color={PLATA} fuente={VIVO} />
    </AbsoluteFill>
  );
};

/** 2 · Inglaterra 1992: Big Ben de plata, la £ atada al reloj con una cadena dorada y el sello 1992. */
const Inglaterra: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [lon, sello, atada, artificial, cueste] = b;
  // primero se ve el mapa (lo dibuja el fondo); con «1992» Londres y el Big Ben se levantan desde el punto de Londres
  const sube = pr(f, sello + 14, 26);
  const dib = pr(f, sello + 18, 24);
  void lon;
  const hora = (f / 30) * 6;
  const kS = sp(f, sello, REBOTE);
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0006})`, transformOrigin: "540px 1000px" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - sube) * 520}px)`, opacity: sube }}>
        <Londres base={1420} color="#070B16" />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* torre del reloj */}
        <Trazo d="M470 1420 L470 760 L610 760 L610 1420" p={dib} color={PLATA} grosor={6} />
        <Trazo d="M455 760 L540 600 L625 760" p={dib} color={PLATA} grosor={6} />
        <Trazo d="M540 600 L540 520" p={dib} color={PLATA} grosor={5} />
        {[880, 980, 1080, 1180, 1280].map((y) => (
          <Trazo key={y} d={`M480 ${y} L600 ${y}`} p={dib} color={PLATA} grosor={2} op={0.5} />
        ))}
        <circle cx={540} cy={820} r={52 * dib} fill={NOCHE} stroke={PLATA} strokeWidth={6} />
        {dib > 0.8 && (
          <g stroke={PLATA} strokeLinecap="round">
            <line x1={540} y1={820} x2={540 + Math.sin((hora * Math.PI) / 180) * 40} y2={820 - Math.cos((hora * Math.PI) / 180) * 40} strokeWidth={5} />
            <line x1={540} y1={820} x2={540} y2={790} strokeWidth={7} />
          </g>
        )}
      </svg>
      <Libra x={210} y={1050} r={110 * sp(f, atada - 6)} giro={Math.sin(f / 20) * 6} />
      <Cadena x0={290} y0={990} x1={510} y1={850} p={pr(f, atada, 16)} ondula={2} />
      {/* sello de lacre */}
      {f >= sello && (
        <div style={{ position: "absolute", left: 790, top: 600, width: 210, height: 210, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #CC5E48, ${ROJO} 60%, #5E2016)`, transform: `scale(${2 - kS}) rotate(-12deg)`, opacity: Math.min(1, kS * 1.4), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: CLAVE, fontSize: 70, color: "#3A0B06", opacity: 0.85 }}>1992</div>
        </div>
      )}
      <CajaTexto x={540} y={1480} desde={artificial} texto="PRECIO ARTIFICIAL" fondo="transparent" contorno={PLATA} color={PLATA} tam={70} />
      <Titulo y={1610} desde={cueste} texto="CUESTE LO QUE CUESTE" tam={78} color={ORO} />
      {void dur}
    </AbsoluteFill>
  );
};

/** 3 · Lo que nadie quería ver: ojos reflejados en la pantalla de cotización y la cadena que se agrieta. */
const Grieta: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [inv, pant, vio, sost] = b;
  const ojos = pr(f, pant, 14);
  const mira = Math.sin(f / 14) * 14;
  const g = pr(f, vio, 30, Easing.inOut(Easing.cubic));
  const precio = 2.7784 + Math.sin(f / 5) * 0.0006;
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0008})`, transformOrigin: "540px 900px" }}>
      {/* pantalla de cotización */}
      <div style={{ position: "absolute", left: 110, top: 540, width: 860, height: 470, borderRadius: 16, background: "linear-gradient(160deg, #0D1628, #070B15)", border: `4px solid ${PLATA}55`, opacity: pr(f, inv, 10), overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: PRO, fontSize: 40, color: `${PLATA}AA`, letterSpacing: 4 }}>GBP / DEM</div>
        <div style={{ position: "absolute", left: 40, top: 85, fontFamily: PRO, fontSize: 120, color: PLATA }}>{precio.toFixed(4).replace(".", ",")}</div>
        <div style={{ position: "absolute", left: 40, bottom: 34, fontFamily: PRO, fontSize: 34, color: ROJO }}>SUELO DEL ERM · 2,7780</div>
        {/* ojos reflejados */}
        <svg width={860} height={470} style={{ position: "absolute", left: 0, top: 0, opacity: 0.55 * ojos }}>
          {[290, 570].map((cx) => (
            <g key={cx}>
              <path d={`M${cx - 110} 300 Q${cx} ${300 - 80 * ojos} ${cx + 110} 300 Q${cx} ${300 + 70 * ojos} ${cx - 110} 300 Z`} fill="none" stroke={PLATA} strokeWidth={5} />
              <circle cx={cx + mira} cy={300} r={36 * ojos} fill={PLATA} opacity={0.6} />
              <circle cx={cx + mira} cy={300} r={15 * ojos} fill={NOCHE} />
            </g>
          ))}
        </svg>
      </div>
      <Cadena x0={120} y0={1130} x1={960} y1={1130} p={1} grieta={g} ondula={g > 0.6 ? 3 : 1} />
      {g > 0 && g < 1 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 10 }).map((_, k) => (
            <circle key={k} cx={540 + Math.cos(k) * 60 * g} cy={1160 + Math.sin(k * 2.1) * 50 * g} r={3} fill="#FFF6D8" opacity={1 - g} />
          ))}
        </svg>
      )}
      {f >= sost && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1270, textAlign: "center", fontFamily: F.mano, fontSize: 104, color: PLATA, transform: `rotate(-4deg) scale(${sp(f, sost)})`, textShadow: `0 0 30px ${PLATA}55` }}>
          eso no se sostiene
        </div>
      )}
    </AbsoluteFill>
  );
};

/** 4 · Balanza: el banco en un plato y Soros en el otro, lanzando libras al banco. */
const Balanza: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [soros, millones, fallaba, acertaba, banco, vende] = b;
  // cada ficha sale de la mano y tarda VUELO fotogramas en llegar; cada vez más seguidas
  const VUELO = 16;
  const salen = Array.from({ length: 26 }).map((_, k) => soros + 6 + k * (k < 10 ? 9 : 5));
  const dentro = salen.filter((c) => f >= c + VUELO).length;
  const tilt = -Math.min(16, dentro * 0.7) + Math.sin(f / 10) * 0.6;
  const cx = 540,
    cy = 860,
    L = 330;
  const rad = (tilt * Math.PI) / 180;
  const iz = { x: cx - Math.cos(rad) * L, y: cy - Math.sin(rad) * L };
  const de = { x: cx + Math.cos(rad) * L, y: cy + Math.sin(rad) * L };
  const yPlatoI = iz.y + 160,
    yPlatoD = de.y + 160;
  const ESC = 0.62;
  // mano de Soros (fin del brazo) y montón del banco
  const brazo = 0.6 + 0.4 * Math.abs(Math.sin((f - soros) / 4.5));
  const mano = { x: de.x + (-230 - 60 * brazo) * ESC, y: yPlatoD + (-260 - 70 * brazo) * ESC };
  const monton = (k: number) => ({ x: iz.x + ((k % 5) - 2) * 34, y: yPlatoI - 236 - Math.floor(k / 5) * 14 });
  const latido = 1 + 0.03 * Math.abs(Math.sin((f - soros) / (f > banco ? 3 : 6)));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M${cx} ${cy} L${cx - 70} 1290 L${cx + 70} 1290 Z`} fill={ACERO_PLATA} stroke={PLATA} strokeWidth={4} />
        <g transform={`rotate(${tilt} ${cx} ${cy})`}>
          <rect x={cx - L - 20} y={cy - 8} width={2 * L + 40} height={16} rx={8} fill={PLATA} />
        </g>
        <circle cx={cx} cy={cy} r={18} fill={ORO} />
        {[
          [iz.x, iz.y, yPlatoI],
          [de.x, de.y, yPlatoD],
        ].map(([x, y, yp], k) => (
          <g key={k}>
            <line x1={x} y1={y} x2={x - 110} y2={yp} stroke={PLATA} strokeWidth={3} />
            <line x1={x} y1={y} x2={x + 110} y2={yp} stroke={PLATA} strokeWidth={3} />
            <path d={`M${x - 130} ${yp} Q${x} ${yp + 50} ${x + 130} ${yp} Z`} fill={ACERO_PLATA} stroke={PLATA} strokeWidth={4} />
          </g>
        ))}
        {/* banco de cúpula */}
        <g transform={`translate(${iz.x} ${yPlatoI})`}>
          <path d="M-95 0 L-95 -110 L95 -110 L95 0 Z" fill="#0C1426" stroke={PLATA} strokeWidth={4} />
          {[-70, -35, 0, 35, 70].map((x) => (
            <rect key={x} x={x - 7} y={-105} width={14} height={100} fill={PLATA} opacity={0.6} />
          ))}
          <path d="M-110 -110 L0 -150 L110 -110 Z" fill={PLATA} />
          <path d="M-50 -150 Q0 -230 50 -150 Z" fill={PLATA} opacity={0.85} />
        </g>
        {Array.from({ length: dentro }).map((_, k) => {
          const m = monton(k);
          return <ellipse key={k} cx={m.x} cy={m.y} rx={20} ry={7} fill={PLATA} stroke="#6F7C8A" strokeWidth={2} />;
        })}
        {/* fichas en el aire: arco de la mano al montón */}
        {salen.map((c, k) => {
          if (f < c || f >= c + VUELO) return null;
          const t = (f - c) / VUELO;
          const m = monton(k);
          const x = mano.x + (m.x - mano.x) * t;
          const y = mano.y + (m.y - mano.y) * t - Math.sin(t * Math.PI) * 170;
          return <ellipse key={k} cx={x} cy={y} rx={20} ry={7} fill={PLATA} stroke="#6F7C8A" strokeWidth={2} transform={`rotate(${t * 360} ${x} ${y})`} />;
        })}
      </svg>
      <Hombre x={de.x} y={yPlatoD} esc={ESC} brazo={brazo} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center", opacity: f >= millones ? 1 : 0, transform: `scale(${latido})` }}>
        <div style={{ background: ORO, color: NOCHE, fontFamily: CLAVE, fontSize: 96, padding: "4px 30px", transform: "rotate(-2deg)" }}>
          {Math.round(10000 * pr(f, millones, 26)).toLocaleString("es-ES").replace(/\u00a0/g, ".")} MILLONES $
        </div>
      </div>
      <Titulo y={430} desde={fallaba} texto="POCO RIESGO" tam={100} color={PLATA} />
      <Titulo y={540} desde={acertaba} texto="MUCHO PREMIO" tam={100} color={ORO} />
      <Titulo y={1480} desde={vende} texto="Y SEGUÍA VENDIENDO" tam={64} color={PLATA} fuente={VIVO} />
    </AbsoluteFill>
  );
};

/** Velas de la libra frente al marco: cada una abre donde cerró la anterior (datos reales del BoE). */
const VELAS_LIBRA: Vela[] = continua(LIBRA_DM.map((d) => ({ o: d.c, h: d.c, l: d.c, c: d.c, v: 1 })));
const K_16 = LIBRA_DM.findIndex((d) => d.d === "16 Sep");

/** 5 · Miércoles Negro: la cadena se rompe y la libra cae en cascada. */
const Miercoles: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [mier, noche, rindio, libre, desplomo] = b;
  const rota = pr(f, rindio, 26, Easing.in(Easing.quad));
  const t = temblor(f, rindio, 16, 12);
  const M = { x0: 60, x1: 1020, y0: 760, y1: 1400 };
  const lo = 2.36,
    hi = 2.84;
  const y = (p: number) => M.y0 + ((hi - p) / (hi - lo)) * (M.y1 - M.y0);
  const paso = (M.x1 - M.x0) / VELAS_LIBRA.length;
  const entra = (k: number) => (k <= K_16 ? mier + k * 1.2 : libre + (k - K_16) * 3);
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [rindio, rindio + 2, rindio + 8], [0, 0.5, 0], cl) }} />
      <Titulo y={420} desde={mier} texto="16 SEPT 1992" tam={96} color={PLATA} />
      {f >= noche && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 545, textAlign: "center", fontFamily: PRO, fontSize: 44, color: `${PLATA}CC`, letterSpacing: 6, opacity: pr(f, noche, 8) }}>
          19:00 · LONDRES
        </div>
      )}
      <Cadena x0={140} y0={650} x1={940} y1={650} p={1} grieta={1} rota={rota} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={M.x0} y1={y(2.778)} x2={M.x1} y2={y(2.778)} stroke={ROJO} strokeWidth={3} strokeDasharray="10 10" opacity={0.7} />
        <text x={M.x1} y={y(2.778) - 14} textAnchor="end" fontFamily={PRO} fontSize={30} fill={ROJO}>
          SUELO 2,778
        </text>
        {VELAS_LIBRA.map((v, k) => {
          const e = entra(k);
          if (f < e) return null;
          const tt = pr(f, e, 6);
          const c = v.o + (v.c - v.o) * tt;
          const sube = c >= v.o;
          const x = M.x0 + paso * (k + 0.5);
          const top = y(Math.max(v.o, c)),
            h = Math.max(3, Math.abs(y(v.o) - y(c)));
          return <rect key={k} x={x - paso * 0.32} y={top} width={paso * 0.64} height={h} fill={sube ? PLATA : ROJO} stroke={sube ? PLATA : ROJO} strokeWidth={2} />;
        })}
      </svg>
      <Titulo y={1450} desde={rindio} texto="INGLATERRA SE RINDIÓ" tam={92} color={ROJO} />
      {f >= desplomo && (
        <div style={{ position: "absolute", right: 70, top: 880, textAlign: "right", transform: `scale(${sp(f, desplomo, REBOTE)})`, transformOrigin: "right center" }}>
          <div style={{ fontFamily: CLAVE, fontSize: 170, color: ORO, lineHeight: 1, textShadow: `0 0 40px ${ORO}44` }}>−14 %</div>
          <div style={{ fontFamily: PRO, fontSize: 34, color: PLATA, marginTop: 8 }}>2,78 → 2,39 DM · 3 semanas</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** 6a · El periódico con el titular. */
const Periodico: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [diarios, hombre, quebro] = b;
  const k = sp(f, diarios, { damping: 14, stiffness: 120, mass: 0.8 });
  const giro = (1 - k) * 540;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 560, width: 820, height: 760, background: "linear-gradient(170deg, #E9E1CF, #CFC4AA)", transform: `rotate(${giro - 3}deg) scale(${k * (1 + f * 0.0005)})`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", padding: 36, boxSizing: "border-box", fontFamily: "Georgia, serif", color: "#1A1712" }}>
        <div style={{ borderBottom: "3px double #1A1712", textAlign: "center", fontSize: 34, letterSpacing: 6, paddingBottom: 10 }}>LONDON · 1992</div>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.02, marginTop: 30, textAlign: "center", opacity: pr(f, hombre, 8) }}>The Man Who Broke the Bank of England</div>
        <div style={{ display: "flex", gap: 20, marginTop: 34 }}>
          <div style={{ width: 300, height: 260, background: "#2A2620", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 95, top: 50, width: 110, height: 130, borderRadius: "50% 50% 40% 40%", background: "#55504A" }} />
            <div style={{ position: "absolute", left: 30, top: 170, width: 240, height: 120, borderRadius: "50% 50% 0 0", background: "#55504A" }} />
          </div>
          <div style={{ flex: 1 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ height: 10, background: "#1A171255", marginBottom: 17, width: `${70 + rnd(i) * 30}%` }} />
            ))}
          </div>
        </div>
      </div>
      <CajaTexto x={540} y={1360} desde={quebro} texto="EL HOMBRE QUE QUEBRÓ" fondo={PLATA} color={NOCHE} tam={66} />
      <CajaTexto x={540} y={1450} desde={quebro + 6} texto="AL BANCO DE INGLATERRA" fondo={PLATA} color={NOCHE} tam={66} giro={1} />
    </AbsoluteFill>
  );
};

/** 6b · La regla: velas e indicadores tachados; folio bajo la lámpara. */
const Regla: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [velas, ind, regla, razon, todo] = b;
  const fuera = pr(f, regla, 10);
  const escribe = pr(f, razon, 24, Easing.linear);
  const frase = "Cuando tienes razón:";
  return (
    <AbsoluteFill>
      {/* velas e indicadores que se tachan */}
      <div style={{ opacity: 1 - fuera }}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {[0, 1, 2, 3].map((k) => {
            const x = 200 + k * 60,
              s = k % 2 ? -1 : 1;
            const e = pr(f, velas + k * 3, 8);
            return <rect key={k} x={x} y={900 - s * 30 - 60} width={34} height={120 * e} fill={s > 0 ? PLATA : ROJO} />;
          })}
          <Trazo d="M600 980 C660 860 720 1020 780 900 S880 960 900 880" p={pr(f, ind, 14)} color={PLATA} grosor={6} />
          <Trazo d="M160 800 L460 1080" p={pr(f, velas + 14, 6)} color={ROJO} grosor={14} />
          <Trazo d="M580 800 L920 1080" p={pr(f, ind + 10, 6)} color={ROJO} grosor={14} />
        </svg>
      </div>
      {/* lámpara y folio */}
      <div style={{ opacity: fuera }}>
        <div style={{ position: "absolute", left: 0, top: 380, width: 1080, height: 1200, background: "conic-gradient(from 160deg at 50% 0%, transparent 0deg, rgba(212,175,55,0.22) 20deg, rgba(212,175,55,0.22) 40deg, transparent 60deg)", filter: "blur(6px)" }} />
        <div style={{ position: "absolute", left: 470, top: 360, width: 140, height: 60, borderRadius: "70px 70px 0 0", background: ACERO, border: `3px solid ${PLATA}` }} />
        <div style={{ position: "absolute", left: 190, top: 760, width: 700, height: 600, background: "#EFE8D6", transform: `rotate(-2deg) translateY(${(1 - fuera) * 80}px)`, boxShadow: "0 30px 70px rgba(0,0,0,0.6)", padding: "70px 56px", boxSizing: "border-box" }}>
          <div style={{ fontFamily: CLAVE, fontSize: 40, color: "#5A5244", letterSpacing: 8 }}>UNA SOLA REGLA</div>
          <div style={{ fontFamily: F.mano, fontSize: 92, color: "#1A1712", marginTop: 40, lineHeight: 1.1 }}>
            {frase.slice(0, Math.round(frase.length * escribe))}
          </div>
          {f >= todo && <div style={{ fontFamily: CLAVE, fontSize: 104, color: ROJO, marginTop: 20, whiteSpace: "nowrap", transform: `scale(${sp(f, todo, REBOTE)}) rotate(-3deg)`, transformOrigin: "left center" }}>VE CON TODO</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Puntos de una palabra para que las partículas se junten (rejilla dentro del rectángulo del texto). */
const puntosTexto = (x: number, y: number, w: number, h: number) => Array.from({ length: 140 }).map((_, k) => [x + rnd(k * 1.3) * w, y + rnd(k * 2.7) * h] as [number, number]);

/** 7 · Miedo y codicia: el polvo de oro forma las palabras y la luna vuelve a salir. */
const MiedoCodicia: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [hist, precio, miedo, codicia] = b;
  const junta = pr(f, miedo - 10, 22, Easing.inOut(Easing.cubic));
  const sale = interpolate(f, [0, codicia + 10], [1500, 590], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Luna x={540} y={sale} r={150} op={0.9} />
      <Polvo n={140} junta={junta * 0.85} hacia={puntosTexto(220, 1040, 640, 240)} />
      <Titulo y={800} desde={hist} texto="EL PRECIO LO MUEVE" tam={64} color={PLATA} fuente={VIVO} />
      <Titulo y={895} desde={precio} texto="SIEMPRE LO MISMO…" tam={58} color={`${PLATA}CC`} fuente={VIVO} />
      <Titulo y={1030} desde={miedo} texto="MIEDO" tam={150} color={PLATA} />
      <Titulo y={1210} desde={codicia} texto="Y CODICIA" tam={150} color={ORO} />
    </AbsoluteFill>
  );
};

/** 8 · CTA: £ de plata agrietada y caja dorada. */
const Apuesta: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [apost, banco, libra] = b;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 520, width: 800, height: 980, borderRadius: 40, background: `linear-gradient(170deg, ${ACERO}, #0B1426)`, border: `3px solid ${PLATA}66`, transform: `scale(${sp(f, 0)})` }} />
      <Libra x={540} y={850} r={190} grieta={pr(f, banco, 14)} giro={Math.sin(f / 16) * 5} />
      <Titulo y={1110} desde={apost} texto="¿APOSTARÍAS?" tam={110} color={PLATA} />
      <CajaTexto x={540} y={1290} desde={libra} texto="COMENTA LIBRA" fondo={ORO} color={NOCHE} tam={96} />
    </AbsoluteFill>
  );
};

/** Tortuga que camina (vista lateral). */
const Tortuga: React.FC<{ x: number; y: number; esc: number; fase: number; ang: number }> = ({ x, y, esc, fase, ang }) => {
  const f = useCurrentFrame();
  const paso = Math.sin(f / 4 + fase) * 8;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${esc})`}>
      <ellipse cx={-40 + paso} cy={6} rx={12} ry={18} fill="#6E8F4E" />
      <ellipse cx={40 - paso} cy={6} rx={12} ry={18} fill="#6E8F4E" />
      <ellipse cx={72} cy={-20} rx={24} ry={18} fill="#7FA35A" />
      <circle cx={80} cy={-24} r={4} fill={NOCHE} />
      <path d="M-70 0 Q-70 -80 0 -80 Q70 -80 70 0 Z" fill="#3E5A2C" stroke={ORO} strokeWidth={4} />
      <path d="M-35 -10 L-20 -55 L20 -55 L35 -10 Z" fill="none" stroke={ORO} strokeWidth={3} opacity={0.7} />
    </g>
  );
};

/** 9 · Teaser: el planeta gira, pin dorado en Boston 1983 y dos tortugas sobre un gráfico. */
const Teaser: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [prox, normal, mejores] = b;
  const pin = sp(f, prox + 8, REBOTE);
  const lineaP = pr(f, normal, 30, Easing.linear);
  const pts = Array.from({ length: 30 }).map((_, k) => [90 + k * 31, 1360 - k * 8 - Math.sin(k * 0.9) * 26] as [number, number]);
  const pinOp = interpolate(f, [normal, normal + 12], [1, 0.35], cl);
  const visibles = pts.slice(0, Math.max(2, Math.round(pts.length * lineaP)));
  const ult = visibles[visibles.length - 1];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* pin dorado */}
        <g transform={`translate(700 ${880 - (1 - pin) * 60}) scale(${pin * 1.4})`} opacity={pinOp}>
          <circle cx={0} cy={0} r={60} fill={ORO} opacity={0.18 + 0.1 * Math.sin(f / 5)} />
          <path d="M0 30 C-30 -10 -30 -50 0 -50 C30 -50 30 -10 0 30 Z" fill={ROJO} />
          <circle cx={0} cy={-25} r={10} fill={NOCHE} />
        </g>
        {f >= normal && <polyline points={visibles.map((p) => p.join(",")).join(" ")} fill="none" stroke={ORO} strokeWidth={7} strokeLinejoin="round" />}
        {f >= normal && (
          <>
            <Tortuga x={ult[0] - 110} y={ult[1] - 6} esc={1.05} fase={0} ang={-12} />
            <Tortuga x={ult[0] - 330} y={ult[1] + 20} esc={0.95} fase={2} ang={-12} />
          </>
        )}
      </svg>
      {f >= prox + 8 && (
        <div style={{ position: "absolute", left: 330, top: 840, fontFamily: PRO, fontSize: 44, color: ORO, opacity: pr(f, prox + 8, 8) * pinOp }}>BOSTON · 1983</div>
      )}
      <Titulo y={420} desde={prox} texto="PRÓXIMO VIDEO" tam={64} color={PLATA} fuente={VIVO} />
      <Titulo y={1430} desde={normal} texto="GENTE NORMAL." tam={96} color={PLATA} />
      <Titulo y={1550} desde={mejores} texto="MILLONES." tam={120} color={ORO} />
    </AbsoluteFill>
  );
};

const def = (C: React.FC<PropsEscena>, momentos: number, sonidos: DefEscena["sonidos"]): DefEscena => ({ C, momentos, sonidos });

export const gancho = def(Gancho, 4, () => [[0, "golpe", 0.6]]);
export const inglaterra = def(Inglaterra, 5, () => [
  [0, "campana", 0.35],
  [1, "sello", 0.5],
  [2, "cuerda", 0.3],
]);
export const grieta = def(Grieta, 4, () => [[2, "cristal", 0.35]]);
export const balanza = def(Balanza, 6, () => [
  [0, "monedas", 0.3],
  [1, "subida", 0.3],
  [3, "golpe", 0.45],
  [5, "reloj", 0.25],
]);
export const miercoles = def(Miercoles, 5, () => [
  [0, "campana", 0.4],
  [2, "cristal", 0.5],
  [4, "perder", 0.4],
]);
export const periodico = def(Periodico, 3, () => [
  [0, "papel", 0.4],
  [2, "sello", 0.35],
]);
export const regla = def(Regla, 5, () => [[4, "golpe", 0.45]]);
export const miedoCodicia = def(MiedoCodicia, 4, () => [[2, "transforma", 0.3]]);
export const apuesta = def(Apuesta, 3, () => [
  [1, "cristal", 0.3],
  [2, "ding", 0.35],
]);
export const teaser = def(Teaser, 3, () => [
  [0, "whoosh", 0.35],
  [1, "tic", 0.3],
]);
void SECUND;
