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
import { Globo3D } from "./Globo3D";

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
      <CajaTexto x={540} y={1400} desde={mil} texto={`${Math.round(1e9 * pr(f, mil, 22, Easing.out(Easing.quad))).toLocaleString("es-ES").replace(/\u00a0/g, ".")} $`} fondo={ORO} color={NOCHE} tam={120} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: PLATA, opacity: pr(f, boom, 8) * 0.85 }}>// LONDRES · 16 · 09 · 1992</div>
      <Titulo y={1580} desde={dia} texto="EN UN SOLO DÍA" tam={72} color={PLATA} fuente={VIVO} />
    </AbsoluteFill>
  );
};

/** Mapa del Reino Unido en grande (para la escena 2): Londres queda en el centro del encuadre al hacer zoom. */
const mp = ([lon, lat]: [number, number]) => [540 + (lon + 2.3) * 0.588 * 185, 1010 - (lat - 54.4) * 185] as const;
const trazoMapa = (pts: [number, number][]) => "M" + pts.map((q) => mp(q).join(" ")).join(" L") + " Z";
const CIUDADES_UK: [string, number, number, number][] = [
  // nombre, lon, lat, lado de la etiqueta (1 derecha, -1 izquierda)
  ["EDIMBURGO", -3.19, 55.95, 1],
  ["GLASGOW", -4.25, 55.86, -1],
  ["NEWCASTLE", -1.61, 54.98, 1],
  ["LEEDS", -1.55, 53.8, 1],
  ["MANCHESTER", -2.24, 53.48, 1],
  ["LIVERPOOL", -2.98, 53.41, -1],
  ["BIRMINGHAM", -1.9, 52.48, 1],
  ["CARDIFF", -3.18, 51.48, -1],
];
const LONDRES_M = mp([-0.09, 51.51]);
// Costa continental (Países Bajos → Bretaña), cerrada por fuera de la pantalla.
const CONTINENTE: [number, number][] = [[9, 54.2], [7.0, 53.6], [5.0, 53.4], [4.5, 53.0], [3.5, 51.4], [1.6, 50.9], [1.5, 50.2], [-1.3, 49.7], [-1.9, 49.0], [-4.8, 48.5], [-4.8, 46], [9, 46]];

/** Estrellas que titilan y destellos de cuatro puntas, como en el fondo de la serie. */
const Cosmos: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 110 }).map((_, k) => (
        <circle key={k} cx={rnd(k * 11.1) * 1080} cy={rnd(k * 13.7) * 1920} r={0.6 + rnd(k * 3.1) * 1.5} fill="#F6ECD2" opacity={0.15 + 0.35 * (0.5 + 0.5 * Math.sin(f / 18 + rnd(k * 5.5) * 9))} />
      ))}
      {Array.from({ length: 9 }).map((_, k) => {
        const x = 60 + rnd(k * 7.3) * 960,
          y = 120 + rnd(k * 9.9) * 1680;
        const b = Math.max(0, Math.sin(f / 22 + k * 1.7));
        const l = 10 + 22 * b;
        return (
          <g key={`d${k}`} opacity={0.25 + 0.75 * b}>
            <path d={`M${x} ${y - l} Q${x} ${y} ${x + l} ${y} Q${x} ${y} ${x} ${y + l} Q${x} ${y} ${x - l} ${y} Q${x} ${y} ${x} ${y - l} Z`} fill="#FFE2B0" />
            <circle cx={x} cy={y} r={l * 0.9} fill="#F0A955" opacity={0.15} />
          </g>
        );
      })}
    </svg>
  );
};

/** Película antigua: grano que cambia cada 2 fotogramas, rayas verticales sueltas, viñeta y parpadeo leve. */
const Pelicula: React.FC<{ op: number }> = ({ op }) => {
  const f = useCurrentFrame();
  const semilla = Math.floor(f / 2);
  const rayas = [0, 1, 2].filter((k) => rnd(semilla * 3.1 + k) > 0.55).map((k) => 60 + rnd(semilla * 7.7 + k) * 960);
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.5 }}>
        <filter id="pel-grano">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={semilla} />
          <feColorMatrix values="0 0 0 0 0.6  0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 1.2 -0.1" />
        </filter>
        <rect width={1080} height={1920} filter="url(#pel-grano)" />
      </svg>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {rayas.map((x, k) => (
          <line key={k} x1={x} y1={0} x2={x + 6} y2={1920} stroke="#F2E6C8" strokeOpacity={0.12} strokeWidth={2} />
        ))}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, transparent 45%, rgba(10,6,2,0.75) 100%)", opacity: 0.92 + 0.08 * Math.sin(f * 1.9) }} />
    </AbsoluteFill>
  );
};

/** Fachada del Banco de Inglaterra (Threadneedle Street): muro de Soane con nichos ciegos, pórtico de columnas
 *  y el edificio de Baker detrás. Se dibuja con líneas según `p` (0–1). */
const BancoInglaterra: React.FC<{ p: number; luz: number }> = ({ p, luz }) => {
  const c = "#E8D9B5";
  const t = (a: number) => Math.max(0, Math.min(1, (p - a) / 0.35));
  const col = (x: number, y0: number, y1: number, k: number) => (
    <g key={`c${x}-${y0}`}>
      <Trazo d={`M${x - 14} ${y1} L${x - 14} ${y0} M${x + 14} ${y1} L${x + 14} ${y0}`} p={k} color={c} grosor={3} />
      <Trazo d={`M${x - 22} ${y0} L${x + 22} ${y0} M${x - 20} ${y1} L${x + 20} ${y1}`} p={k} color={c} grosor={3} />
    </g>
  );
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="bi-luz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ORO} stopOpacity={0.0} />
          <stop offset="1" stopColor={ORO} stopOpacity={0.22 * luz} />
        </linearGradient>
      </defs>
      {/* edificio alto de Baker, detrás */}
      <rect x={230} y={640} width={620} height={420} fill="url(#bi-luz)" />
      <Trazo d="M230 1060 L230 640 L850 640 L850 1060" p={t(0.25)} color={c} grosor={4} />
      <Trazo d="M215 640 L865 640 M215 615 L865 615" p={t(0.3)} color={c} grosor={3} />
      {[300, 380, 460, 540, 620, 700, 780].map((x) => col(x, 700, 900, t(0.4)))}
      <Trazo d="M230 700 L850 700 M230 900 L850 900" p={t(0.4)} color={c} grosor={3} />
      {[300, 380, 460, 540, 620, 700, 780].map((x) => (
        <g key={`v${x}`}>
          <rect x={x - 8} y={960} width={16} height={60} fill={ORO} opacity={Math.max(0, Math.min(1, luz * 2 - (x - 300) / 480)) * 0.85} />
          <Trazo d={`M${x - 8} 960 L${x - 8} 1020 L${x + 8} 1020 L${x + 8} 960 Z`} p={t(0.5)} color={c} grosor={2} op={0.7} />
        </g>
      ))}
      {/* muro de Soane: largo, sin ventanas, con nichos ciegos */}
      <rect x={70} y={1060} width={940} height={300} fill="rgba(232,217,181,0.05)" />
      <Trazo d="M70 1360 L70 1060 L1010 1060 L1010 1360" p={t(0)} color={c} grosor={5} />
      <Trazo d="M60 1060 L1020 1060 M60 1090 L1020 1090" p={t(0.05)} color={c} grosor={3} />
      {[1150, 1210, 1270].map((y) => (
        <Trazo key={`h${y}`} d={`M70 ${y} L1010 ${y}`} p={t(0.1)} color={c} grosor={1.5} op={0.35} />
      ))}
      {[140, 230, 320, 760, 850, 940].map((x) => (
        <Trazo key={`n${x}`} d={`M${x - 26} 1330 L${x - 26} 1170 Q${x} 1130 ${x + 26} 1170 L${x + 26} 1330`} p={t(0.15)} color={c} grosor={2.5} op={0.8} />
      ))}
      {/* pórtico central */}
      {[430, 490, 590, 650].map((x) => col(x, 1110, 1340, t(0.2)))}
      <Trazo d="M510 1360 L510 1200 Q540 1160 570 1200 L570 1360" p={t(0.2)} color={ORO} grosor={4} />
      <Trazo d="M400 1110 L680 1110 M400 1095 L680 1095" p={t(0.2)} color={c} grosor={3} />
      {/* escalones */}
      <Trazo d="M40 1360 L1040 1360 M20 1385 L1060 1385" p={t(0)} color={c} grosor={3} />
      {/* mástil con la bandera (en plata, sin colores) */}
      <Trazo d="M540 615 L540 520" p={t(0.6)} color={c} grosor={3} />
      <path d={`M540 522 L${540 + 70 * t(0.7)} ${530 + Math.sin(useCurrentFrame() / 6) * 4} L540 560 Z`} fill={c} opacity={0.75 * t(0.7)} />
    </svg>
  );
};

/** Calle de Londres en 1992 delante del banco: farolas, un autobús de dos pisos y un taxi negro cruzando. */
const Calle1992: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const c = "#E8D9B5";
  const t = f - desde;
  const bus = -340 + t * 9.5;
  const taxi = 1200 - t * 14;
  const farola = (x: number) => (
    <g key={x}>
      <circle cx={x} cy={1210} r={70} fill={ORO} opacity={0.12} />
      <rect x={x - 4} y={1225} width={8} height={255} fill="#0E0A05" />
      <path d={`M${x - 18} 1225 L${x + 18} 1225 L${x + 12} 1195 L${x - 12} 1195 Z`} fill={ORO} opacity={0.9} />
      <path d={`M${x - 20} 1195 L${x} 1180 L${x + 20} 1195 Z`} fill="#0E0A05" />
    </g>
  );
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      {/* acera y calzada */}
      <rect x={0} y={1480} width={1080} height={10} fill={c} opacity={0.25} />
      {farola(110)}
      {farola(970)}
      {/* autobús de dos pisos (el único rojo de la escena) */}
      <g transform={`translate(${bus} 1330)`}>
        <rect x={0} y={0} width={300} height={140} rx={16} fill={ROJO} opacity={0.88} />
        {[0, 1].map((r) => [20, 80, 140, 200].map((x) => <rect key={`${r}-${x}`} x={x} y={14 + r * 62} width={46} height={34} rx={4} fill="#F2D58A" opacity={0.55} />))}
        <rect x={252} y={76} width={34} height={54} rx={3} fill="#1A0D08" />
        <circle cx={62} cy={142} r={20} fill="#0E0A05" />
        <circle cx={240} cy={142} r={20} fill="#0E0A05" />
      </g>
      {/* taxi negro */}
      <g transform={`translate(${taxi} 1405)`}>
        <path d="M0 60 L0 34 Q10 26 40 24 L62 2 L150 2 L178 26 Q200 28 204 38 L204 60 Z" fill="#0E0A05" stroke={c} strokeOpacity={0.5} strokeWidth={2} />
        <rect x={74} y={10} width={30} height={18} fill="#F2D58A" opacity={0.4} />
        <rect x={112} y={10} width={30} height={18} fill="#F2D58A" opacity={0.4} />
        <rect x={96} y={-8} width={26} height={10} rx={2} fill={ORO} />
        <circle cx={44} cy={62} r={15} fill="#0E0A05" stroke={c} strokeOpacity={0.4} />
        <circle cx={164} cy={62} r={15} fill="#0E0A05" stroke={c} strokeOpacity={0.4} />
      </g>
    </svg>
  );
};

/** Teletexto de la tele británica (Ceefax, página 210): la cotización se escribe letra a letra. */
const Teletexto: React.FC<{ desde: number; op: number }> = ({ desde, op }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const lineas: [string, string][] = [
    ["P210  CEEFAX 210", "#FFFFFF"],
    ["MERCADOS · LIBRA", "#00E5FF"],
    ["GBP/DEM  2,7780 ▼", "#FFE600"],
  ];
  let quedan = Math.floor((f - desde) * 1.6);
  return (
    <div style={{ position: "absolute", left: 150, top: 385, width: 780, padding: "10px 22px", background: "#000", opacity: op * 0.92, fontFamily: F.mono, fontWeight: 700, fontSize: 28, lineHeight: 1.25, letterSpacing: 2, boxShadow: "0 0 0 3px #222" }}>
      {lineas.map(([txt, color], i) => {
        const n = Math.max(0, Math.min(txt.length, quedan));
        quedan -= txt.length;
        return (
          <div key={i} style={{ color, whiteSpace: "pre" }}>
            {txt.slice(0, n)}
            {n < txt.length && n > 0 && Math.floor(f / 6) % 2 === 0 ? "█" : ""}
          </div>
        );
      })}
    </div>
  );
};

/** 2 · «Inglaterra, 1992»: globo 3D de noche → la cámara cae sobre Gran Bretaña → mapa antiguo con las ciudades
 *  → zoom a Londres → el Banco de Inglaterra se dibuja; la libra queda encadenada a su puerta. */
const Inglaterra: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [ing, anio, atada, artificial, banco, cueste] = b;
  // 1) vuelo hacia el Reino Unido
  const vuelo = interpolate(f, [0, atada - 4], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const giro = interpolate(f, [0, atada - 4], [1.1, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  // 2) el globo se funde con el mapa antiguo
  const mapa = interpolate(f, [atada - 10, atada + 4], [0, 1], cl);
  const costa = pr(f, atada - 6, 28);
  // 3) zoom a Londres y entra el banco
  const zoom = interpolate(f, [banco - 16, banco + 8], [1, 6], { ...cl, easing: Easing.in(Easing.cubic) });
  const banc = interpolate(f, [banco - 2, banco + 6], [0, 1], cl);
  const dibuja = pr(f, banco, 34, Easing.inOut(Easing.cubic));
  const antiguo = interpolate(f, [atada - 10, atada + 6], [0, 1], cl);
  const kS = sp(f, anio, REBOTE);
  return (
    <AbsoluteFill style={{ background: NOCHE }}>
      {/* globo */}
      {mapa < 1 && (
        <AbsoluteFill style={{ opacity: 1 - mapa }}>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #13254A 0%, ${NOCHE} 65%)` }} />
          <Cosmos />
          <Globo3D vuelo={vuelo} giro={giro} costas={[GB, IRLANDA]} brillo={1 + 0.3 * Math.sin(f / 7)} arcos={pr(f, ing + 2, Math.max(20, atada - ing - 16), Easing.inOut(Easing.quad))} />
        </AbsoluteFill>
      )}
      {/* mapa antiguo y banco, en sepia */}
      {mapa > 0 && (
        <AbsoluteFill style={{ opacity: mapa, background: "radial-gradient(ellipse at 45% 40%, #17385A 0%, #0C1D33 55%, #060E1A 100%)" }}>
          <AbsoluteFill style={{ opacity: 1 - banc, transform: `perspective(1700px) rotateX(${interpolate(f, [atada - 10, atada + 34], [52, 0], { ...cl, easing: Easing.out(Easing.cubic) })}deg) translate(${(540 - LONDRES_M[0]) * Math.sqrt((zoom - 1) / 5)}px, ${(1150 - LONDRES_M[1]) * Math.sqrt((zoom - 1) / 5)}px) scale(${zoom})`, transformOrigin: `${LONDRES_M[0]}px ${LONDRES_M[1]}px` }}>
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              <defs>
                <linearGradient id="mp-tierra" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#E6DDB0" />
                  <stop offset="0.5" stopColor="#BFC08A" />
                  <stop offset="1" stopColor="#8F9A62" />
                </linearGradient>
                <linearGradient id="mp-apagada" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#7D7462" />
                  <stop offset="1" stopColor="#4E4638" />
                </linearGradient>
                <filter id="mp-relieve" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000" floodOpacity="0.55" />
                </filter>
                <clipPath id="mp-gb">
                  <path d={trazoMapa(GB)} />
                </clipPath>
                <filter id="mp-difumina" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="28" />
                </filter>
                <filter id="mp-brillo" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>
              {/* olas suaves en el mar */}
              {Array.from({ length: 14 }).map((_, k) => {
                const y = 140 + k * 130;
                const dx = Math.sin(f / 30 + k) * 20;
                return <path key={`ol${k}`} d={`M${-40 + dx} ${y} q60 -14 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0`} fill="none" stroke="#8FB3D9" strokeOpacity={0.07} strokeWidth={2} />;
              })}
              {/* Europa continental, apagada, en la esquina */}
              <path d={trazoMapa(CONTINENTE)} fill="url(#mp-apagada)" opacity={0.85 * costa} filter="url(#mp-relieve)" />
              <text x={1000} y={1760} textAnchor="end" fontFamily={F.mono} fontWeight={700} fontSize={26} letterSpacing={6} fill="#C9BFA8" opacity={0.7 * costa}>EUROPA</text>
              {/* retícula de meridianos y paralelos */}
              {[-6, -4, -2, 0, 2].map((lo) => (
                <line key={`lo${lo}`} x1={mp([lo, 60])[0]} y1={0} x2={mp([lo, 48])[0]} y2={1920} stroke="#8FB3D9" strokeOpacity={0.12} strokeWidth={2} />
              ))}
              {[50, 52, 54, 56, 58].map((la) => (
                <line key={`la${la}`} x1={0} y1={mp([0, la])[1]} x2={1080} y2={mp([0, la])[1]} stroke="#8FB3D9" strokeOpacity={0.12} strokeWidth={2} />
              ))}
              {[IRLANDA, GB].map((pts, i) => (
                <g key={i}>
                  <path d={trazoMapa(pts)} fill="none" stroke={ORO} strokeWidth={16} strokeOpacity={0.22 * costa} filter="url(#mp-brillo)" />
                  <path d={trazoMapa(pts)} fill={i ? "url(#mp-tierra)" : "url(#mp-apagada)"} opacity={costa} filter="url(#mp-relieve)" />
                  <path d={trazoMapa(pts)} fill="none" stroke={i ? "#FFF3D6" : "#B9AE96"} strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - costa} />
                </g>
              ))}
              <g clipPath="url(#mp-gb)" opacity={costa} filter="url(#mp-difumina)">
                {(
                  [
                    [-4.6, 57.2, 170, 120, 0.75],
                    [-4.0, 55.4, 120, 60, 0.5],
                    [-2.2, 54.4, 50, 150, 0.55],
                    [-3.7, 52.4, 90, 110, 0.6],
                    [-3.9, 50.6, 70, 40, 0.35],
                  ] as const
                ).map(([lo, la, rx, ry, o], k) => (
                  <ellipse key={`al${k}`} cx={mp([lo, la])[0]} cy={mp([lo, la])[1]} rx={rx} ry={ry} fill="#8A6236" opacity={o} />
                ))}
              </g>
              <text x={mp([-4.6, 57.3])[0]} y={mp([-4.6, 57.3])[1]} textAnchor="middle" fontFamily={F.mono} fontWeight={700} fontSize={20} letterSpacing={6} fill="#3B2A14" opacity={0.55 * costa}>HIGHLANDS</text>
              <text x={mp([-8.2, 53.3])[0]} y={mp([-8.2, 53.3])[1]} textAnchor="middle" fontFamily={F.mono} fontWeight={700} fontSize={22} letterSpacing={5} fill="#2E2618" opacity={0.6 * costa}>IRLANDA</text>
              {/* la libra atada al marco: línea dorada de Londres hacia Alemania */}
              {f >= artificial && (
                <g opacity={pr(f, artificial, 10)}>
                  <path d={`M${LONDRES_M[0]} ${LONDRES_M[1]} Q${LONDRES_M[0] + 120} ${LONDRES_M[1] - 220} 1080 ${LONDRES_M[1] - 190}`} fill="none" stroke={ORO} strokeWidth={5} strokeDasharray="16 12" strokeDashoffset={-f * 2} pathLength={undefined} />
                  <rect x={1060 - 300} y={LONDRES_M[1] - 254} width={312} height={44} rx={8} fill="#0C1D33" opacity={0.88} stroke={ORO} strokeWidth={2} />
                  <text x={1060} y={LONDRES_M[1] - 222} textAnchor="end" fontFamily={F.mono} fontWeight={700} fontSize={26} letterSpacing={3} fill={ORO}>MARCO ALEMÁN →</text>
                </g>
              )}
              {CIUDADES_UK.map(([nombre, lo, la, lado], k) => {
                const [x, y] = mp([lo, la]);
                const ini = atada + 6 + Math.hypot(x - LONDRES_M[0], y - LONDRES_M[1]) / 55;
                const e = sp(f, ini);
                const onda = pr(f, ini, 18);
                void k;
                return (
                  <g key={nombre} opacity={Math.min(1, e)}>
                    <circle cx={x} cy={y} r={8 + 40 * onda} fill="none" stroke={ORO} strokeWidth={3} opacity={(1 - onda) * 0.8} />
                    <circle cx={x} cy={y} r={9 * e} fill={ACERO} stroke={ORO} strokeWidth={3} />
                    <line x1={x + lado * 12} y1={y} x2={x + lado * 34 * e} y2={y} stroke="#3A2C18" strokeOpacity={0.7} strokeWidth={2} />
                    <rect x={lado > 0 ? x + 34 : x - 34 - nombre.length * 19 - 12} y={y - 18} width={nombre.length * 19 + 12} height={36} rx={6} fill="#0C1D33" opacity={0.82 * Math.min(1, e)} />
                    <text x={x + lado * 40} y={y + 9} textAnchor={lado > 0 ? "start" : "end"} fontFamily={F.mono} fontWeight={700} fontSize={26} letterSpacing={3} fill="#F2E6C8">
                      {nombre}
                    </text>
                  </g>
                );
              })}
              {/* Londres, en oro y latiendo */}
              {(() => {
                const e = sp(f, atada + 2, REBOTE);
                return (
                  <g>
                    <circle cx={LONDRES_M[0]} cy={LONDRES_M[1]} r={(26 + 12 * Math.abs(Math.sin(f / 7))) * e} fill={ORO} opacity={0.25} />
                    <circle cx={LONDRES_M[0]} cy={LONDRES_M[1]} r={11 * e} fill={ORO} />
                    <rect x={LONDRES_M[0] + 18} y={LONDRES_M[1] - 56} width={196} height={46} rx={8} fill="#0C1D33" opacity={0.88 * Math.min(1, e)} stroke={ORO} strokeWidth={2} />
                    <text x={LONDRES_M[0] + 30} y={LONDRES_M[1] - 22} fontFamily={F.mono} fontWeight={700} fontSize={34} letterSpacing={4} fill={ORO} opacity={Math.min(1, e)}>
                      LONDRES
                    </text>
                  </g>
                );
              })()}
            </svg>
            {/* «precio artificial»: la libra fijada al marco */}
            {f >= artificial && (
              <div style={{ position: "absolute", left: LONDRES_M[0] - 330, top: LONDRES_M[1] + 50, padding: "14px 22px", border: `2px solid ${ORO}`, background: "rgba(26,19,10,0.85)", fontFamily: F.mono, fontWeight: 700, fontSize: 34, color: ORO, letterSpacing: 2, transform: `scale(${sp(f, artificial, REBOTE)})`, transformOrigin: "100% 0%" }}>
                £1 = 2,95 DM <span style={{ color: "#E8D9B5", fontSize: 22, letterSpacing: 4 }}>· FIJO</span>
              </div>
            )}
          </AbsoluteFill>
          {/* Banco de Inglaterra */}
          {banc > 0 && (
            <AbsoluteFill style={{ opacity: banc, transform: `scale(${1.12 - 0.12 * pr(f, banco, 60)})`, transformOrigin: "540px 1100px" }}>
              <AbsoluteFill style={{ background: "linear-gradient(180deg, #0B1830 0%, #15233E 38%, #2E2A2A 70%, #3A2A16 100%)" }} />
              <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
                {Array.from({ length: 40 }).map((_, k) => (
                  <circle key={k} cx={rnd(k * 4.1) * 1080} cy={60 + rnd(k * 6.3) * 560} r={1 + rnd(k * 2.9) * 1.6} fill="#F6ECD2" opacity={0.2 + 0.4 * (0.5 + 0.5 * Math.sin(f / 14 + k))} />
                ))}
              </svg>
              <BancoInglaterra p={dibuja} luz={pr(f, banco + 20, 20)} />
              <Calle1992 desde={banco} />
              <Libra x={540} y={1590} r={95 * sp(f, cueste - 4, REBOTE)} giro={Math.sin(f / 18) * 5} />
              <Cadena x0={470} y0={1580} x1={200} y1={1380} p={pr(f, cueste - 2, 14)} />
              <Cadena x0={610} y0={1580} x1={880} y1={1380} p={pr(f, cueste - 2, 14)} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 1064, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 9, color: "#E8D9B5", opacity: pr(f, banco + 10, 14) * 0.9 }}>
                BANCO DE INGLATERRA
              </div>
            </AbsoluteFill>
          )}
          <Pelicula op={antiguo} />
        </AbsoluteFill>
      )}
      {/* cabecera fija: capítulo y sello del año */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: mapa > 0.5 ? "#E8D9B5" : PLATA, opacity: pr(f, ing, 10) }}>
        // REINO UNIDO · {f >= anio ? "1992" : "····"}
      </div>
      {f >= anio && (
        <div style={{ position: "absolute", left: 800, top: 400, width: 190, height: 190, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #CC5E48, ${ROJO} 60%, #5E2016)`, transform: `scale(${2 - kS}) rotate(-12deg)`, opacity: Math.min(1, kS * 1.4) * (1 - pr(f, atada + 30, 12)), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: CLAVE, fontSize: 64, color: "#3A0B06", opacity: 0.85 }}>1992</div>
        </div>
      )}
      {mapa > 0 && <Teletexto desde={atada + 30} op={mapa} />}
      <Titulo y={1740} desde={cueste} texto="CUESTE LO QUE CUESTE" tam={78} color={ORO} />
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
        {/* pantalla de tubo: líneas de barrido y una franja de luz que baja */}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 5px)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: ((f * 9) % 560) - 90, height: 90, background: "linear-gradient(180deg, transparent, rgba(201,209,217,0.08), transparent)" }} />
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
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: PLATA, opacity: pr(f, inv, 8) * 0.85 }}>// MERCADO DE DIVISAS · LONDRES</div>
      {f >= inv && (
        <div style={{ position: "absolute", left: 110, top: 455, padding: "8px 18px", background: "#0C1D33", border: `2px solid ${ORO}`, borderRadius: 8, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: ORO, transform: `scale(${sp(f, inv, REBOTE)})`, transformOrigin: "0 50%" }}>INVERSIONISTA · HUNGRÍA → EE. UU.</div>
      )}
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

/** 4 · El pulso: la libra en la banda del ERM (datos reales del BoE hasta el 16-09). Soros empuja hacia abajo
 *  con órdenes de venta y el Banco de Inglaterra compra para sostenerla en el suelo de 2,778. */
const SERIE_ERM = LIBRA_DM.slice(0, LIBRA_DM.findIndex((d) => d.d === "16 Sep") + 1).map((d) => d.c);
const AZUL = "#4C8DFF";
/** Flecha de orden (abajo = venta, arriba = compra). */
const Flecha: React.FC<{ x: number; y: number; abajo: boolean; color: string }> = ({ x, y, abajo, color }) => (
  <g transform={`translate(${x} ${y}) scale(${abajo ? 1 : -1})`}>
    <rect x={-7} y={-46} width={14} height={36} rx={4} fill={color} />
    <path d="M-20 -14 L0 12 L20 -14 Z" fill={color} />
  </g>
);
const Balanza: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [soros, millones, libra, compra, vende] = b;
  const G = { x0: 90, x1: 990, y0: 620, y1: 1260 };
  const hi = 2.99,
    lo = 2.74;
  const y = (p: number) => G.y0 + ((hi - p) / (hi - lo)) * (G.y1 - G.y0);
  const n = SERIE_ERM.length;
  const dib = pr(f, soros - 6, Math.max(30, compra - soros), Easing.inOut(Easing.quad));
  const pts = SERIE_ERM.slice(0, Math.max(2, Math.ceil(1 + dib * (n - 1)))).map((p, k) => [G.x0 + (k / (n - 1)) * (G.x1 - G.x0 - 120), y(p)] as [number, number]);
  // al final el precio tiembla pegado al suelo: el pulso
  const pulso = f > vende ? Math.sin(f * 1.3) * 7 : f > compra ? Math.sin(f * 0.9) * 4 : 0;
  const [ux, uy] = pts[pts.length - 1];
  const ventas = f >= libra ? Math.min(26, 1 + Math.floor((f - libra) / (f > vende ? 2 : 5))) : 0;
  const compras = f >= compra ? Math.min(16, 1 + Math.floor((f - compra) / 4)) : 0;
  const grieta = pr(f, vende + 6, 20);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: PLATA, opacity: pr(f, 0, 10) * 0.85 }}>// LIBRA EN EL ERM · SEPT 1992</div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="erm-banda" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ORO} stopOpacity={0.1} />
            <stop offset="1" stopColor={ROJO} stopOpacity={0.14} />
          </linearGradient>
        </defs>
        {/* banda permitida: del central al suelo */}
        <rect x={G.x0} y={y(2.95)} width={G.x1 - G.x0} height={y(2.778) - y(2.95)} fill="url(#erm-banda)" opacity={pr(f, 0, 14)} />
        <line x1={G.x0} y1={y(2.95)} x2={G.x1} y2={y(2.95)} stroke="#E8D9B5" strokeWidth={3} strokeDasharray="12 10" opacity={0.6} />
        <text x={G.x1} y={y(2.95) - 14} textAnchor="end" fontFamily={F.mono} fontWeight={700} fontSize={26} letterSpacing={3} fill="#E8D9B5">CENTRAL 2,95</text>
        <line x1={G.x0} y1={y(2.778)} x2={G.x1} y2={y(2.778)} stroke={ROJO} strokeWidth={5} />
        <text x={G.x1} y={y(2.778) + 38} textAnchor="end" fontFamily={F.mono} fontWeight={700} fontSize={26} letterSpacing={3} fill={ROJO}>SUELO 2,778</text>
        {/* el suelo se agrieta cuando Soros no para */}
        {grieta > 0 && <Trazo d={`M${G.x1 - 330} ${y(2.778)} l30 18 l26 -26 l34 30 l22 -20 l40 24 l30 -14`} p={grieta} color="#FFE2B0" grosor={4} />}
        {/* precio real (cierres diarios del BoE) */}
        <polyline points={pts.map(([x, yy], k) => `${x},${k === pts.length - 1 ? yy + pulso : yy}`).join(" ")} fill="none" stroke={PLATA} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={ux} cy={uy + pulso} r={16 + 6 * Math.abs(Math.sin(f / 5))} fill={PLATA} opacity={0.2} />
        <circle cx={ux} cy={uy + pulso} r={10} fill={PLATA} />
        {/* órdenes de venta de Soros: caen sobre el precio */}
        {Array.from({ length: ventas }).map((_, k) => {
          const c = libra + k * (f > vende && k > 8 ? 2 : 5);
          const t = Math.min(1, (f - c) / 12);
          if (t <= 0 || t >= 1) return null;
          return <Flecha key={`v${k}`} x={ux - 60 + rnd(k * 3.3) * 160} y={560 + t * (uy - 600)} abajo color={ROJO} />;
        })}
        {/* compras del Banco de Inglaterra: suben desde abajo */}
        {Array.from({ length: compras }).map((_, k) => {
          const c = compra + k * 4;
          const t = Math.min(1, (f - c) / 12);
          if (t <= 0 || t >= 1) return null;
          return <Flecha key={`c${k}`} x={ux - 70 + rnd(k * 7.1) * 140} y={1480 - t * (1480 - uy - 50)} abajo={false} color={AZUL} />;
        })}
      </svg>
      {/* los dos bandos */}
      <Hombre x={880} y={1700} esc={0.62} borde={f >= libra ? ROJO : PLATA} op={pr(f, soros, 10)} />
      {f >= soros && <div style={{ position: "absolute", left: 700, top: 1730, width: 360, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: ROJO, opacity: pr(f, soros, 10) }}>SOROS · VENDE £</div>}
      {f >= compra && (
        <div style={{ position: "absolute", left: 60, top: 1540, width: 380, textAlign: "center", opacity: pr(f, compra, 10), transform: `scale(${sp(f, compra, REBOTE)})` }}>
          <svg width={380} height={170}>
            <path d="M60 160 L60 60 L320 60 L320 160 Z" fill="#0C1426" stroke={AZUL} strokeWidth={4} />
            {[100, 150, 200, 250, 290].map((x) => (
              <rect key={x} x={x - 8} y={66} width={14} height={90} fill={AZUL} opacity={0.6} />
            ))}
            <path d="M40 60 L190 18 L340 60 Z" fill={AZUL} />
          </svg>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: AZUL }}>BANCO · COMPRA £</div>
        </div>
      )}
      {f >= millones && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 455, display: "flex", justifyContent: "center", transform: `scale(${sp(f, millones, REBOTE)})` }}>
          <div style={{ background: ORO, color: NOCHE, fontFamily: CLAVE, fontSize: 84, padding: "4px 28px", transform: "rotate(-2deg)" }}>
            {Math.round(10000 * pr(f, millones, 26)).toLocaleString("es-ES").replace(/ /g, ".")} MILLONES $
          </div>
        </div>
      )}
      <Titulo y={1360} desde={vende} texto="Y SEGUÍA VENDIENDO" tam={70} color={PLATA} fuente={VIVO} />
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
  const [diarios, hombre, quebro, banco] = b;
  const kS = sp(f, banco, REBOTE);
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
      {f >= banco && (
        <div style={{ position: "absolute", left: 700, top: 500, width: 220, height: 220, borderRadius: "50%", border: `8px solid ${ROJO}`, color: ROJO, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: CLAVE, fontSize: 40, lineHeight: 1.05, transform: `scale(${2.2 - 1.2 * kS}) rotate(14deg)`, opacity: Math.min(1, kS * 1.5) * 0.9 }}>
          16·09
          <br />
          1992
        </div>
      )}
      <CajaTexto x={540} y={1360} desde={quebro} texto="EL HOMBRE QUE QUEBRÓ" fondo={PLATA} color={NOCHE} tam={66} />
      <CajaTexto x={540} y={1450} desde={quebro + 6} texto="AL BANCO DE INGLATERRA" fondo={PLATA} color={NOCHE} tam={66} giro={1} />
    </AbsoluteFill>
  );
};

/** 6b · La regla: folio bajo la lámpara. */
const Regla: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [regla, razon, todo] = b;
  const fuera = pr(f, regla - 8, 12);
  const escribe = pr(f, razon, 24, Easing.linear);
  const frase = "Cuando tienes razón:";
  return (
    <AbsoluteFill>
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
  const [apost, contra, banco, libra] = b;
  const flecha = sp(f, contra, REBOTE);
  const baja = pr(f, contra, 24) * 40;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 520, width: 800, height: 980, borderRadius: 40, background: `linear-gradient(170deg, ${ACERO}, #0B1426)`, border: `3px solid ${PLATA}66`, transform: `scale(${sp(f, 0)})` }} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${f >= banco && f < banco + 40 ? Math.sin(f * 1.7) * 14 * (1 - (f - banco) / 40) : 0}px)` }}>
        <Libra x={540} y={850} r={190} grieta={pr(f, banco, 40)} giro={Math.sin(f / 16) * 5} />
      </div>
      {/* la apuesta en contra: flecha roja que cae junto a la libra */}
      {f >= contra && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform={`translate(830 ${740 + baja + Math.sin(f / 5) * 10}) scale(${flecha * 1.5})`}>
            <rect x={-16} y={-70} width={32} height={90} rx={8} fill={ROJO} />
            <path d="M-50 10 L0 80 L50 10 Z" fill={ROJO} />
          </g>
        </svg>
      )}
      <Titulo y={1110} desde={apost} texto="¿APOSTARÍAS?" tam={110} color={PLATA} />
      <Titulo y={1250} desde={banco} texto="CONTRA UN BANCO ENTERO" tam={54} color={PLATA} />
      <CajaTexto x={540} y={1395} desde={libra} texto="COMENTA LIBRA" fondo={ORO} color={NOCHE} tam={96} />
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
export const inglaterra = def(Inglaterra, 6, () => [
  [0, "whoosh", 0.3],
  [1, "sello", 0.5],
  [2, "proyector", 0.22],
  [5, "cuerda", 0.3],
]);
export const grieta = def(Grieta, 4, () => [[2, "cristal", 0.35]]);
export const balanza = def(Balanza, 5, () => [
  [1, "monedas", 0.3],
  [2, "golpe", 0.35],
  [3, "subida", 0.3],
  [4, "punetazo", 0.35],
]);
export const miercoles = def(Miercoles, 5, () => [
  [0, "campana", 0.4],
  [2, "cristal", 0.5],
  [4, "perder", 0.4],
]);
export const periodico = def(Periodico, 4, () => [
  [0, "papel", 0.4],
  [3, "sello", 0.4],
]);
export const regla = def(Regla, 3, () => [[2, "golpe", 0.45]]);
export const miedoCodicia = def(MiedoCodicia, 4, () => [[2, "transforma", 0.3]]);
export const apuesta = def(Apuesta, 4, () => [
  [2, "cristal", 0.3],
  [3, "ding", 0.35],
]);
export const teaser = def(Teaser, 3, () => [
  [0, "whoosh", 0.35],
  [1, "tic", 0.3],
]);
void SECUND;
