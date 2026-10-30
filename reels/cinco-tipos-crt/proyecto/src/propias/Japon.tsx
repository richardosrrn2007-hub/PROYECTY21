// Vídeo 3 · De dónde salieron las velas. El Japón del siglo XVIII contado con imágenes de tinta y papel
// (ukiyo-e) dentro del mismo mundo negro y dorado de la serie: sellos rojos, sol rojo, pincel y arroz.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { F, alfa } from "../motor/estilos";
import { rnd } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { arr, txt } from "../escenas/util";
import { Escritorio } from "./Escritorio";
import { AAPL_DIARIO } from "./aapl_diario";
import { continua } from "./Velas";
import { TRANSICION } from "./Cierre";
import { Chispas, Halo, KANJI, ORO, PRINCIPAL, REBOTE, ROJO, Revela, SECUND, Trazo, encajar, pr, principalPara, sp } from "./mg";

const PAPEL = "#E9DFC8";
const PAPEL2 = "#D8CBAE";
const TINTA = "#1A1612";
const SELLO = "#C0392B";
const CREMA = "#F2E8D5";
const AÑIL = "#1F2A44";

// ---------------------------------------------------------------- piezas comunes

/** Sello rojo japonés (hanko) que cae y se estampa. */
export const Hanko: React.FC<{ x: number; y: number; desde: number; texto: string; tam?: number; giro?: number; kanji?: boolean }> = ({ x, y, desde, texto, tam = 150, giro = -8, kanji = false }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  const k = sp(f, desde, { damping: 11, stiffness: 300, mass: 0.6 });
  return (
    <div style={{ position: "absolute", left: x - tam / 2, top: y - tam / 2, width: tam, height: tam, transform: `scale(${2.2 - 1.2 * Math.min(1, k)}) rotate(${giro}deg)`, opacity: Math.min(1, k * 1.6), border: `${tam * 0.06}px solid ${SELLO}`, borderRadius: tam * 0.12, display: "flex", alignItems: "center", justifyContent: "center", color: SELLO, fontFamily: kanji ? KANJI : PRINCIPAL, fontSize: kanji ? tam * 0.55 : Math.min(tam * 0.3, (tam * 1.15) / (Math.max(4, ...texto.split(' ').map((w) => w.length)) + 1)), lineHeight: 1, textAlign: "center", padding: tam * 0.08, background: alfa(SELLO, 0.08), boxShadow: `inset 0 0 ${tam * 0.1}px ${alfa(SELLO, 0.35)}` }}>
      {texto}
    </div>
  );
};

/** Papel washi con fibras. */
const Washi: React.FC<{ x: number; y: number; w: number; h: number; op?: number; children?: React.ReactNode; giro?: number }> = ({ x, y, w, h, op = 1, children, giro = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: op, transform: `rotate(${giro}deg)`, background: `radial-gradient(ellipse at 35% 30%, ${PAPEL} 0%, ${PAPEL2} 75%, #C4B38E 100%)`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", overflow: "hidden", borderRadius: 4 }}>
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 40 }).map((_, k) => (
        <path key={k} d={`M${rnd(k) * w} ${rnd(k + 9) * h} q${20 + rnd(k + 3) * 40} ${rnd(k + 5) * 10 - 5} ${50 + rnd(k + 7) * 60} ${rnd(k + 2) * 12 - 6}`} stroke={alfa("#8A7A5C", 0.18)} strokeWidth={1.2} fill="none" />
      ))}
    </svg>
    {children}
  </div>
);

/** Olas seigaiha doradas (banda decorativa). */
const Olas: React.FC<{ y: number; filas?: number; op?: number }> = ({ y, filas = 3, op = 0.35 }) => {
  const f = useCurrentFrame();
  const r = 60;
  return (
    <svg width={1080} height={filas * r + r} style={{ position: "absolute", left: 0, top: y, opacity: op }}>
      {Array.from({ length: filas }).map((_, fi) =>
        Array.from({ length: 11 }).map((__, k) => {
          const cx = k * r * 2 - (fi % 2 ? r : 0) + ((f * 0.6) % (r * 2)) - r;
          const cy = fi * r * 0.55 + r;
          return [r, r * 0.72, r * 0.44].map((rr, j) => <path key={`${fi}-${k}-${j}`} d={`M${cx - rr} ${cy} A${rr} ${rr} 0 0 1 ${cx + rr} ${cy}`} fill={j === 0 ? "#000" : "none"} stroke={ORO} strokeWidth={2.5} />);
        }),
      )}
    </svg>
  );
};

/** Sol rojo de grabado japonés. */
const Sol: React.FC<{ x: number; y: number; r: number; desde?: number }> = ({ x, y, r, desde = 0 }) => {
  const f = useCurrentFrame();
  const k = pr(f, desde, 18, Easing.out(Easing.cubic));
  return <div style={{ position: "absolute", left: x - r, top: y - r + (1 - k) * 120, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #E0533F, ${SELLO} 60%, #8E2318)`, opacity: 0.9 * k, boxShadow: `0 0 120px ${alfa(SELLO, 0.45)}` }} />;
};

/** Grano de arroz. */
const Grano: React.FC<{ x: number; y: number; giro: number; esc?: number }> = ({ x, y, giro, esc = 1 }) => <ellipse cx={x} cy={y} rx={7 * esc} ry={13 * esc} transform={`rotate(${giro} ${x} ${y})`} fill="#FBF6EA" stroke="#CFC4AA" strokeWidth={1.5} />;

/** Saco de arroz (tawara). */
const Tawara: React.FC<{ x: number; y: number; esc?: number }> = ({ x, y, esc = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${esc})`}>
    <ellipse cx={0} cy={0} rx={70} ry={42} fill="#C9A86A" stroke={TINTA} strokeWidth={4} />
    <ellipse cx={-58} cy={0} rx={14} ry={36} fill="#B48E52" stroke={TINTA} strokeWidth={3} />
    {[-30, 0, 30].map((dx) => (
      <line key={dx} x1={dx} x2={dx} y1={-41} y2={41} stroke={TINTA} strokeWidth={4} />
    ))}
  </g>
);

/** Comerciante de Dojima con personalidad: kimono con estampado, obi, moño o cinta en la frente, cara que grita
 * y mano en alto haciendo señas de precio con los dedos (así se pujaba en Dojima). Origen: centro de la cabeza. */
const KIMONOS = [
  { tela: "#2B3A67", obi: "#C0392B", dibujo: "puntos" },
  { tela: "#7A2E22", obi: "#D4AA6E", dibujo: "rayas" },
  { tela: "#1E1A16", obi: "#6E8B3D", dibujo: "olas" },
  { tela: "#4E6B3A", obi: "#1E1A16", dibujo: "puntos" },
  { tela: "#5B3A20", obi: "#2B3A67", dibujo: "rayas" },
  { tela: "#2F2F45", obi: "#E2B655", dibujo: "olas" },
];
const Comerciante: React.FC<{ x: number; y: number; esc?: number; k: number; f: number; activo: boolean }> = ({ x, y, esc = 1, k, f, activo }) => {
  const kim = KIMONOS[k % KIMONOS.length];
  const ritmo = (f + k * 11) / 5;
  const puja = activo ? Math.max(0, Math.sin(ritmo)) : 0;
  const salta = activo ? Math.abs(Math.sin(ritmo)) * 10 : Math.sin(f / 15 + k) * 2;
  const grita = activo && Math.sin(ritmo) > 0.2;
  const dedos = 1 + ((k * 3 + Math.floor((f + k * 11) / 31)) % 5);
  const cinta = k % 3 === 1;
  const lado = k % 2 ? -1 : 1;
  // mano en alto
  const mx = lado * (58 + 10 * puja),
    my = 40 - 150 * puja;
  return (
    <g transform={`translate(${x} ${y - salta}) scale(${esc})`}>
      {/* cuerpo: kimono con mangas anchas */}
      <path d="M-62 200 L-52 78 Q0 52 52 78 L62 200 Z" fill={kim.tela} stroke={TINTA} strokeWidth={4} />
      {kim.dibujo === "puntos" && [[-30, 110], [25, 125], [-20, 160], [32, 175], [0, 140]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r={5} fill={alfa(CREMA, 0.55)} />)}
      {kim.dibujo === "rayas" && [-36, -18, 18, 36].map((px) => <line key={px} x1={px} x2={px * 1.15} y1={90} y2={198} stroke={alfa(CREMA, 0.35)} strokeWidth={4} />)}
      {kim.dibujo === "olas" && [110, 150, 185].map((py) => <path key={py} d={`M-50 ${py} q12 -12 25 0 q12 -12 25 0 q12 -12 25 0 q12 -12 25 0`} fill="none" stroke={alfa(ORO, 0.55)} strokeWidth={3} />)}
      <path d="M-20 74 L0 120 L20 74" fill="none" stroke={CREMA} strokeWidth={7} />
      <rect x={-56} y={128} width={112} height={18} fill={kim.obi} stroke={TINTA} strokeWidth={3} />
      {/* brazo bajo con abanico */}
      <path d={`M${-lado * 50} 96 Q${-lado * 74} 140 ${-lado * 46} 168`} fill="none" stroke={kim.tela} strokeWidth={30} strokeLinecap="round" />
      <g transform={`translate(${-lado * 46} 168) rotate(${-lado * 30 + Math.sin(f / 4 + k) * 18})`}>
        <path d="M0 0 L-34 -46 A58 58 0 0 1 34 -46 Z" fill={k % 2 ? CREMA : "#E8C88A"} stroke={TINTA} strokeWidth={3} />
        {[-22, -8, 8, 22].map((a) => <line key={a} x1={0} y1={0} x2={a} y2={-52} stroke={alfa(TINTA, 0.5)} strokeWidth={1.5} />)}
      </g>
      {/* brazo en alto haciendo señas */}
      <path d={`M${lado * 46} 90 Q${lado * 80} ${70 - 40 * puja} ${mx} ${my + 18}`} fill="none" stroke={kim.tela} strokeWidth={30} strokeLinecap="round" />
      <circle cx={mx} cy={my} r={15} fill="#D9A77C" stroke={TINTA} strokeWidth={3} />
      {Array.from({ length: dedos }).map((_, i) => (
        <line key={i} x1={mx - 10 + i * 5} y1={my - 8} x2={mx - 14 + i * 7} y2={my - 30} stroke="#D9A77C" strokeWidth={5} strokeLinecap="round" />
      ))}
      {/* cabeza */}
      <rect x={-14} y={28} width={28} height={26} rx={8} fill="#D9A77C" />
      <circle cx={0} cy={0} r={40} fill="#D9A77C" stroke={TINTA} strokeWidth={4} />
      {[-1, 1].map((s2) => <ellipse key={s2} cx={s2 * 40} cy={4} rx={7} ry={10} fill="#D9A77C" stroke={TINTA} strokeWidth={3} />)}
      {cinta ? (
        <>
          <path d="M-40 -12 Q0 -40 40 -12 L40 -26 Q0 -54 -40 -26 Z" fill="#2A1D12" />
          <path d="M-42 -14 L42 -14 L42 -2 L-42 -2 Z" fill={CREMA} stroke={TINTA} strokeWidth={2} />
          <circle cx={0} cy={-8} r={5} fill={SELLO} />
          <path d={`M40 -8 l18 ${-6 + Math.sin(f / 3) * 4} l-4 10 Z`} fill={CREMA} stroke={TINTA} strokeWidth={2} />
        </>
      ) : (
        <>
          <path d="M-38 -10 Q-36 -42 0 -44 Q36 -42 38 -10 Q20 -24 0 -24 Q-20 -24 -38 -10 Z" fill="#2A1D12" />
          <path d="M-8 -42 Q4 -66 26 -56 Q12 -52 6 -40 Z" fill="#2A1D12" />
        </>
      )}
      {/* cara: cejas, ojos, mejillas y boca que grita */}
      {[-1, 1].map((s2) => (
        <g key={`c${s2}`}>
          <path d={`M${s2 * 24} ${grita ? -16 : -12} L${s2 * 8} ${grita ? -10 : -12}`} stroke="#2A1D12" strokeWidth={4} strokeLinecap="round" />
          {grita ? <path d={`M${s2 * 22} -2 l${-s2 * 8} -4 l${s2 * 8} -4`} fill="none" stroke={TINTA} strokeWidth={3} strokeLinecap="round" /> : <circle cx={s2 * 15} cy={-2} r={4} fill={TINTA} />}
          <circle cx={s2 * 24} cy={14} r={6} fill={alfa("#E0533F", 0.35)} />
        </g>
      ))}
      {grita ? <ellipse cx={0} cy={20} rx={11} ry={12} fill="#5A1A12" stroke={TINTA} strokeWidth={3} /> : <path d="M-9 20 Q0 26 9 20" stroke={TINTA} strokeWidth={3} fill="none" strokeLinecap="round" />}
      {/* bocadillo con el precio que grita */}
      {grita && (
        <g transform={`translate(${-lado * 70} -96)`}>
          <path d="M-46 -26 L46 -26 L46 20 L8 20 L0 34 L-8 20 L-46 20 Z" fill="#FFF9EC" stroke={TINTA} strokeWidth={3} />
          <text x={0} y={6} textAnchor="middle" fontFamily={PRINCIPAL} fontSize={30} fill={k % 2 ? SELLO : TINTA}>
            ¡{50 + dedos}!
          </text>
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- 1 · origen: la vela se vuelve tinta

const Origen: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 30, b2 = 60] = b;
  // la vela del vídeo anterior flota en el mundo de siempre; al decir "arroz" se lanza hacia el planeta
  const cae = pr(f, b2 - 4, 22, Easing.in(Easing.cubic));
  const anio = Math.round(2026 - (2026 - 1730) * pr(f, b1 - 4, Math.max(44, b2 - b1 - 2), Easing.inOut(Easing.sin)));
  const late = 1 + 0.03 * Math.sin(f / 6);
  const nace = pr(f, 4, 26, Easing.out(Easing.back(1.4)));
  const esc = (1 - cae * 0.9) * late * (0.35 + 0.65 * nace);
  const cy = 700 + cae * 520;
  return (
    <AbsoluteFill>
      <Halo x={540} y={cy} r={360 * esc} op={0.25 * (1 - cae)} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - cae * 0.6 }}>
        <g transform={`translate(540 ${cy}) scale(${esc}) translate(-540 -700)`}>
          <line x1={540} x2={540} y1={380} y2={1020} stroke={CREMA} strokeWidth={12} />
          <rect x={460} y={500} width={160} height={380} fill={CREMA} />
        </g>
      </svg>
      {/* contador de años que retrocede */}
      {f >= b1 - 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center", opacity: 1 - cae, transform: `scale(${sp(f, b1 - 6, REBOTE)})` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 150, color: anio <= 1730 ? SELLO : CREMA, fontVariantNumeric: "tabular-nums" }}>{anio}</span>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: -40, textAlign: "center", opacity: 1 - cae }}>
        <div>
          <Revela desde={b0 - 6} tam={70} fuente={SECUND}>
            Esta figura tiene
          </Revela>
        </div>
        <div>
          <Revela desde={b1 - 4} tam={encajar("CASI 300 AÑOS", 940, 130, principalPara("CASI 300 AÑOS"))} color={ORO} fuente={principalPara("CASI 300 AÑOS")}>
            CASI 300 AÑOS
          </Revela>
        </div>
      </div>
      {f >= b2 - 4 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1270, textAlign: "center", transform: `scale(${sp(f, b2 - 4, REBOTE)})`, opacity: 1 - pr(f, b2 + 10, 10) }}>
          <div style={{ fontFamily: SECUND, fontSize: 58, color: CREMA }}>y nació en un</div>
          <div style={{ fontFamily: PRINCIPAL, fontSize: encajar("MERCADO DE ARROZ", 960, 96, PRINCIPAL), color: ORO }}>MERCADO DE ARROZ</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2 · mapa de Japón

export const HONSHU_P = "M250 934 L274 911 L322 866 L369 848 L417 843 L464 837 L492 820 L526 752 L554 734 L559 769 L597 763 L630 717 L659 678 L678 626 L682 592 L678 558 L697 524 L739 524 L754 564 L778 615 L758 683 L730 712 L730 769 L711 820 L725 837 L692 871 L673 877 L640 866 L626 900 L597 900 L540 900 L531 917 L492 962 L464 962 L450 917 L407 894 L350 911 L302 940 L255 940 Z";
export const KYUSHU_P = "M188 974 L217 940 L255 940 L298 980 L274 1082 L236 1105 L217 1082 L198 1008 Z";
export const SHIKOKU_P = "M322 940 L378 917 L426 923 L431 945 L407 974 L350 1002 L326 980 Z";
export const HOKKAIDO_P = "M682 506 L692 461 L678 444 L744 410 L758 284 L778 284 L839 347 L911 370 L948 404 L887 427 L834 478 L763 444 L730 489 Z";
export const OSAKA = { x: 469, y: 894 };
export const SAKATA = { x: 675, y: 654 };

const Mapa: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const trazo = pr(f, 0, 26, Easing.inOut(Easing.cubic));
  const pulso = f >= b2 - 2 ? 1 + 0.25 * Math.abs(Math.sin((f - b2) / 5)) : 0;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {[HONSHU_P, KYUSHU_P, SHIKOKU_P, HOKKAIDO_P].map((d, k) => (
          <g key={k}>
            <path d={d} fill={alfa(CREMA, 0.9 * pr(f, 16 + k * 3, 12))} />
            <Trazo d={d} p={trazo} grosor={6} color={TINTA} />
          </g>
        ))}
        {pulso > 0 && (
          <>
            <circle cx={OSAKA.x} cy={OSAKA.y} r={26 * pulso} fill="none" stroke={ORO} strokeWidth={4} opacity={0.7} />
            <circle cx={OSAKA.x} cy={OSAKA.y} r={14} fill={ORO} stroke={TINTA} strokeWidth={3} />
          </>
        )}
      </svg>
      {f >= b2 - 2 && (
        <div style={{ position: "absolute", left: OSAKA.x - 330, top: OSAKA.y + 30, transform: `scale(${sp(f, b2 - 2, REBOTE)})`, transformOrigin: "100% 0", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: KANJI, fontSize: 80, color: SELLO }}>大阪</span>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 70, color: ORO }}>OSAKA</span>
        </div>
      )}
      <div style={{ position: "absolute", left: 90, top: 300, transform: `scale(${sp(f, b0 - 2, REBOTE)})`, transformOrigin: "0 50%", fontFamily: PRINCIPAL, fontSize: 110, color: CREMA, textShadow: "0 6px 20px rgba(0,0,0,0.7)" }}>JAPÓN</div>
      <Hanko x={870} y={1150} desde={b1 - 2} texto="SIGLO XVIII" tam={190} giro={-10} />
      <Olas y={1260} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 3 · el mercado de Dojima

const Dojima: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const entra = pr(f, 0, 14, Easing.out(Easing.cubic));
  const campo = pr(f, b2 - 6, 16, Easing.out(Easing.cubic));
  const precio = 52 + Math.round(Math.sin(f / 6) * 3 + Math.sin(f / 2.3) * 1.5);
  // el contrato vuela de un comerciante a otro
  const vuela = pr(f, b2 + 4, 22, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Washi x={60} y={240 + (1 - entra) * 80} w={960} h={1120} op={entra}>
        {/* tablero de madera con el nombre del mercado */}
        <div style={{ position: "absolute", left: 220, top: 40, width: 520, height: 120, background: "#5B3A20", border: `6px solid ${TINTA}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: KANJI, fontSize: 78, color: CREMA, letterSpacing: 6, whiteSpace: "nowrap" }}>堂島米市場</div>
        {/* pizarra de precios */}
        <div style={{ position: "absolute", left: 360, top: 190, width: 240, height: 120, background: TINTA, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: CREMA }}>
          <span style={{ fontFamily: KANJI, fontSize: 40, color: ORO }}>米</span>
          <span style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 50, fontVariantNumeric: "tabular-nums" }}>{precio}</span>
        </div>
        <svg width={960} height={1120} style={{ position: "absolute", left: 0, top: 0 }}>
          {/* sacos de arroz */}
          {[[130, 520], [270, 520], [200, 450], [770, 520], [830, 450], [700, 450]].map(([x, y], k) => (
            <Tawara key={k} x={x} y={y} esc={0.9} />
          ))}
          {/* comerciantes pujando */}
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <Comerciante key={k} x={100 + k * 152} y={640 + (k % 2) * 40} esc={1.08} k={k} f={f} activo={f >= b0 - 4} />
          ))}
          {/* campo de arroz verde (aún sin cosechar) */}
          <g opacity={campo} transform={`translate(0 ${(1 - campo) * 60})`}>
            <rect x={0} y={900} width={960} height={220} fill="#6E8B3D" />
            {Array.from({ length: 48 }).map((_, k) => {
              const x = 10 + k * 20;
              const s = Math.sin(f / 8 + k) * 6;
              return <path key={k} d={`M${x} 1110 Q${x + s} 980 ${x + s * 2} ${930 + (k % 3) * 10}`} stroke="#A7C25A" strokeWidth={4} fill="none" />;
            })}
          </g>
        </svg>
        {/* contrato que pasa de mano en mano */}
        {f >= b2 + 2 && (
          <div style={{ position: "absolute", left: 180 + vuela * 520, top: 620 - Math.sin(vuela * Math.PI) * 180, width: 130, height: 170, background: "#FFF9EC", border: `3px solid ${TINTA}`, transform: `rotate(${-10 + vuela * 20}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }}>
            <span style={{ fontFamily: KANJI, fontSize: 56, color: TINTA }}>米</span>
            <span style={{ width: 70, height: 4, background: TINTA }} />
            <span style={{ width: 60, height: 4, background: TINTA }} />
            <span style={{ width: 34, height: 34, borderRadius: 6, border: `3px solid ${SELLO}` }} />
          </div>
        )}
      </Washi>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center", transform: `scale(${sp(f, b1 - 2, REBOTE)})` }}>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 80, color: ORO }}>DOJIMA</span>
        <span style={{ fontFamily: SECUND, fontSize: 50, color: CREMA }}> · Osaka</span>
      </div>
      {f >= b2 - 2 && (
        <div style={{ position: "absolute", left: 640, top: 1080, transform: `scale(${sp(f, b2 - 2, REBOTE)}) rotate(-6deg)`, background: CREMA, color: TINTA, fontFamily: PRINCIPAL, fontSize: 40, padding: "6px 18px", borderRadius: 10, border: `4px solid ${TINTA}` }}>ANTES DE COSECHAR</div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4 · futuros: hoy pactas, después entregas

const Futuros: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const flecha = pr(f, b0 + 6, 20, Easing.inOut(Easing.cubic));
  const crece = pr(f, b0, 40, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Washi x={70} y={330} w={420} h={600} op={pr(f, 0, 10)}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: PRINCIPAL, fontSize: 60, color: TINTA }}>HOY</div>
        <svg width={420} height={600} style={{ position: "absolute", left: 0, top: 0 }}>
          {/* brote de arroz */}
          <path d="M210 520 L210 400" stroke="#6E8B3D" strokeWidth={8} />
          <path d="M210 430 Q170 390 150 400 M210 420 Q250 380 270 392" stroke="#8DAE45" strokeWidth={8} fill="none" />
          <rect x={60} y={520} width={300} height={30} fill="#7A5A36" />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", fontFamily: SECUND, fontSize: 40, color: TINTA }}>pactas el precio</div>
        <div style={{ position: "absolute", left: 140, top: 210, width: 140, height: 160, background: "#FFF9EC", border: `3px solid ${TINTA}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: KANJI, fontSize: 64, color: TINTA }}>米</div>
      </Washi>
      <Washi x={590} y={330} w={420} h={600} op={pr(f, b0, 10)}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: PRINCIPAL, fontSize: 60, color: TINTA }}>COSECHA</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", fontFamily: SECUND, fontSize: 40, color: TINTA }}>entregas el arroz</div>
        <svg width={420} height={600} style={{ position: "absolute", left: 0, top: 0 }}>
          {[[130, 480], [290, 480], [210, 410]].map(([x, y], k) => (
            <g key={k} opacity={pr(f, b0 + 20 + k * 6, 8)}>
              <Tawara x={x} y={y} esc={0.9} />
            </g>
          ))}
          <path d={`M210 330 L210 ${330 - 80 * crece}`} stroke="#C9A86A" strokeWidth={8} />
        </svg>
      </Washi>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Trazo d="M470 630 C520 560 560 560 610 630" p={flecha} grosor={10} color={ORO} />
        <path d="M600 600 L612 634 L578 628" fill="none" stroke={ORO} strokeWidth={10} opacity={flecha > 0.95 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center" }}>
        <Revela desde={b1 - 4} tam={encajar("MERCADO DE FUTUROS", 960, 100, principalPara("MERCADO DE FUTUROS"))} color={ORO} fuente={principalPara("MERCADO DE FUTUROS")}>
          MERCADO DE FUTUROS
        </Revela>
      </div>
      {f >= b2 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center", transform: `scale(${sp(f, b2 - 2, REBOTE)}) rotate(-3deg)` }}>
          <span style={{ background: SELLO, color: CREMA, fontFamily: PRINCIPAL, fontSize: 52, padding: "8px 26px", borderRadius: 10 }}>DE LOS PRIMEROS DEL MUNDO</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5 · Homma

/** Munehisa Homma: comerciante en kimono con moño (chonmage), ábaco y pincel. Origen: centro de la cabeza. */
export const Homma: React.FC<{ x: number; y: number; esc?: number; animo?: "normal" | "rie" | "pinta" }> = ({ x, y, esc = 1, animo = "normal" }) => {
  const f = useCurrentFrame();
  const parpadea = f % 80 < 4;
  const rie = animo === "rie";
  return (
    <g transform={`translate(${x} ${y}) scale(${esc})`}>
      {/* kimono */}
      <path d="M-150 420 L-120 120 Q0 70 120 120 L150 420 Z" fill={AÑIL} stroke={TINTA} strokeWidth={5} />
      <path d="M-40 92 L0 200 L40 92" fill="none" stroke={CREMA} strokeWidth={10} />
      <path d="M-120 250 L120 250" stroke={TINTA} strokeWidth={22} />
      {/* blasón dorado (mon) */}
      {[-80, 80].map((dx) => (
        <g key={dx}>
          <circle cx={dx} cy={160} r={18} fill="none" stroke={ORO} strokeWidth={4} />
          <circle cx={dx} cy={160} r={6} fill={ORO} />
        </g>
      ))}
      {/* brazo con ábaco (soroban) */}
      <g transform={`translate(0 ${animo === "pinta" ? 0 : Math.sin(f / 10) * 3})`}>
        <rect x={-130} y={280} width={260} height={70} rx={8} fill="#6B4423" stroke={TINTA} strokeWidth={4} />
        <line x1={-125} x2={125} y1={300} y2={300} stroke={TINTA} strokeWidth={3} />
        {Array.from({ length: 9 }).map((_, k) => {
          const mueve = Math.sin(f / 4 + k * 1.7) > 0.6 ? -8 : 0;
          return (
            <g key={k}>
              <line x1={-104 + k * 26} x2={-104 + k * 26} y1={285} y2={345} stroke={TINTA} strokeWidth={2} />
              <ellipse cx={-104 + k * 26} cy={292} rx={10} ry={6} fill={ORO} />
              <ellipse cx={-104 + k * 26} cy={325 + mueve} rx={10} ry={6} fill={CREMA} />
            </g>
          );
        })}
      </g>
      {/* cabeza */}
      <rect x={-22} y={50} width={44} height={40} rx={12} fill="#D9A77C" />
      <ellipse cx={0} cy={0} rx={62} ry={70} fill="#D9A77C" stroke={TINTA} strokeWidth={4} />
      {/* coronilla afeitada y moño */}
      <path d="M-60 -18 Q-58 -66 0 -72 Q58 -66 60 -18 Q30 -40 0 -40 Q-30 -40 -60 -18 Z" fill="#2A1D12" />
      <path d="M-14 -70 Q0 -110 40 -96 Q20 -88 10 -66 Z" fill="#2A1D12" />
      <rect x={-6} y={-76} width={18} height={10} rx={3} fill={CREMA} />
      {/* cara */}
      {[-1, 1].map((s) => (
        <g key={s}>
          {parpadea ? <line x1={s * 22 - 8} x2={s * 22 + 8} y1={0} y2={0} stroke={TINTA} strokeWidth={4} /> : <path d={rie ? `M${s * 22 - 9} 2 Q${s * 22} -8 ${s * 22 + 9} 2` : `M${s * 22 - 9} 0 L${s * 22 + 9} 0`} stroke={TINTA} strokeWidth={5} fill="none" strokeLinecap="round" />}
          <path d={`M${s * 34} -20 L${s * 10} -16`} stroke="#2A1D12" strokeWidth={6} strokeLinecap="round" />
        </g>
      ))}
      <path d={rie ? "M-18 30 Q0 48 18 30" : "M-12 34 L12 34"} stroke={TINTA} strokeWidth={4} fill={rie ? "#7A2E22" : "none"} strokeLinecap="round" />
    </g>
  );
};

const HommaEsc: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const sube = sp(f, b0 - 6, REBOTE);
  const banda = pr(f, b1 - 4, 14, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(0 ${(1 - sube) * 500})`}>
          <Homma x={540} y={560} esc={1.35} />
        </g>
      </svg>
      {/* banda vertical roja con su nombre en kanji */}
      <div style={{ position: "absolute", left: 110, top: 300, width: 130, height: 520 * banda, overflow: "hidden", background: SELLO, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 30, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
        {"本間".split("").map((c) => (
          <span key={c} style={{ fontFamily: KANJI, fontSize: 110, color: CREMA, lineHeight: 1.2 }}>{c}</span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center" }}>
        <div>
          <Revela desde={b1 - 4} tam={encajar("MUNEHISA HOMMA", 940, 110, principalPara("MUNEHISA HOMMA"))} color={ORO} fuente={principalPara("MUNEHISA HOMMA")}>
            MUNEHISA HOMMA
          </Revela>
        </div>
        {f >= b2 - 2 && <div style={{ fontFamily: SECUND, fontSize: 46, color: CREMA, opacity: pr(f, b2 - 2, 8) }}>comerciante de arroz · 1724–1803</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 6 · el pincel: cuatro precios

const PARTES_P: [string, number, number, string][] = [
  // nombre, y en el pergamino, x de salida, color
  ["MÁXIMO", 380, 540, SELLO],
  ["CIERRE", 520, 600, TINTA],
  ["APERTURA", 820, 600, TINTA],
  ["MÍNIMO", 960, 540, SELLO],
];
const ORDEN_PARTES = [2, 1, 0, 3]; // la voz dice: apertura, cierre, máximo, mínimo

const Pincel: React.FC<PropsEscena> = ({ p, b }) => {
  const f = useCurrentFrame();
  const partes = txt(p, "modo") === "partes";
  const [b0 = 0, b1 = 20, b2 = 40, b3 = 60] = b;
  const abre = pr(f, 0, 14, Easing.out(Easing.cubic));
  const mecha = partes ? 1 : pr(f, b1 - 4, 18, Easing.inOut(Easing.cubic));
  const cuerpo = partes ? 1 : pr(f, b1 + 10, 18, Easing.inOut(Easing.cubic));
  // el pincel sigue el trazo que está dibujando
  const pinX = cuerpo > 0 && cuerpo < 1 ? 470 + 140 * cuerpo : 540;
  const pinY = cuerpo > 0 && cuerpo < 1 ? 520 + 300 * cuerpo : 380 + 580 * mecha;
  const pinta = !partes && mecha > 0 && cuerpo < 1;
  const momentos = [b0, b1, b2, b3];
  return (
    <AbsoluteFill style={{ transform: partes ? "translateX(-80px)" : undefined }}>
      {/* pergamino colgante (kakejiku) */}
      <div style={{ position: "absolute", left: 250, top: 260, width: 580, height: 30, background: "#5B3A20", borderRadius: 15 }} />
      <div style={{ position: "absolute", left: 270, top: 280, width: 540, height: 860 * abre, overflow: "hidden" }}>
        <Washi x={0} y={0} w={540} h={860} />
      </div>
      <div style={{ position: "absolute", left: 250, top: 280 + 860 * abre - 10, width: 580, height: 30, background: "#5B3A20", borderRadius: 15 }} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Trazo d="M540 380 L540 960" p={mecha} grosor={12} color={TINTA} />
        <Trazo d="M470 520 L610 520 L610 820 L470 820 Z" p={cuerpo} grosor={14} color={TINTA} />
        {partes &&
          ORDEN_PARTES.map((i, k) => {
            const [nombre, y, x0, col] = PARTES_P[i];
            const d = momentos[k];
            if (f < d - 2) return null;
            const t = sp(f, d - 2, REBOTE);
            return (
              <g key={nombre} opacity={Math.min(1, t)}>
                <circle cx={x0} cy={y} r={9} fill={col} />
                <line x1={x0} x2={x0 + (835 - x0) * Math.min(1, t)} y1={y} y2={y} stroke={col === TINTA ? CREMA : col} strokeWidth={4} />
              </g>
            );
          })}
        {/* pincel */}
        {pinta && (
          <g transform={`translate(${pinX} ${pinY}) rotate(25)`}>
            <path d="M-8 0 Q0 -30 8 0 Z" fill={TINTA} />
            <rect x={-7} y={-200} width={14} height={180} rx={6} fill="#8B5A2B" stroke={TINTA} strokeWidth={2} />
          </g>
        )}
      </svg>
      {partes &&
        ORDEN_PARTES.map((i, k) => {
          const [nombre, y, , col] = PARTES_P[i];
          const d = momentos[k];
          if (f < d - 2) return null;
          return (
            <div key={nombre} style={{ position: "absolute", left: 845, top: y - 24, fontFamily: F.texto, fontWeight: 800, fontSize: 38, letterSpacing: 2, color: col === TINTA ? CREMA : "#E8695A", transform: `translateX(${(1 - Math.min(1, sp(f, d - 2, REBOTE))) * 30}px)`, textShadow: "0 3px 10px rgba(0,0,0,0.8)" }}>
              {nombre}
            </div>
          );
        })}
      {!partes && <Hanko x={820} y={1050} desde={b2 - 2} texto="4 PRECIOS" tam={180} />}
      {!partes && f >= b0 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1220, textAlign: "center", fontFamily: SECUND, fontSize: 52, color: CREMA, opacity: pr(f, b0 - 2, 8) }}>
          resumir <span style={{ fontFamily: PRINCIPAL, color: ORO, fontSize: 64 }}>CADA DÍA</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 7 · máscaras: el miedo y la codicia tiran de la vela

/** Máscara de demonio (oni) roja: la codicia. */
const Oni: React.FC<{ x: number; y: number; esc?: number; f: number }> = ({ x, y, esc = 1, f }) => (
  <g transform={`translate(${x + Math.sin(f / 2.2) * 3} ${y}) scale(${esc})`}>
    {[-1, 1].map((s) => (
      <path key={s} d={`M${s * 50} -70 L${s * 80} -150 L${s * 30} -80 Z`} fill={CREMA} stroke={TINTA} strokeWidth={4} />
    ))}
    <path d="M-95 -40 Q-100 -95 0 -100 Q100 -95 95 -40 L85 60 Q60 120 0 125 Q-60 120 -85 60 Z" fill="#C0392B" stroke={TINTA} strokeWidth={5} />
    {[-1, 1].map((s) => (
      <g key={`o${s}`}>
        <path d={`M${s * 58} -30 L${s * 18} -10 L${s * 52} 4 Z`} fill="#F4D03F" stroke={TINTA} strokeWidth={4} />
        <path d={`M${s * 70} -52 L${s * 14} -26`} stroke={TINTA} strokeWidth={8} strokeLinecap="round" />
      </g>
    ))}
    <path d="M-50 60 Q0 40 50 60 L40 90 Q0 80 -40 90 Z" fill="#5A1A12" stroke={TINTA} strokeWidth={4} />
    {[-1, 1].map((s) => (
      <path key={`c${s}`} d={`M${s * 32} 58 L${s * 26} 92 L${s * 18} 60 Z`} fill={CREMA} />
    ))}
  </g>
);

/** Máscara pálida azulada con ojos abiertos: el miedo. */
const Miedo: React.FC<{ x: number; y: number; esc?: number; f: number }> = ({ x, y, esc = 1, f }) => (
  <g transform={`translate(${x + Math.cos(f / 1.7) * 4} ${y}) scale(${esc})`}>
    <path d="M-90 -50 Q-95 -110 0 -112 Q95 -110 90 -50 L80 60 Q55 125 0 128 Q-55 125 -80 60 Z" fill="#AFC6DA" stroke={TINTA} strokeWidth={5} />
    {[-1, 1].map((s) => (
      <g key={s}>
        <ellipse cx={s * 36} cy={-14} rx={24} ry={30} fill={CREMA} stroke={TINTA} strokeWidth={4} />
        <circle cx={s * 36} cy={-10} r={8} fill={TINTA} />
        <path d={`M${s * 62} -64 Q${s * 36} -78 ${s * 12} -56`} stroke={TINTA} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    ))}
    <ellipse cx={0} cy={72} rx={24} ry={32} fill="#2B3A4A" stroke={TINTA} strokeWidth={4} />
    <path d="M70 -60 q8 14 0 22 q-8 -8 0 -22 Z" fill="#7FB3E0" />
  </g>
);

const Mascaras: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const precio = 0.5 + 0.32 * Math.sin(f / 9) + 0.12 * Math.sin(f / 3.3);
  const yC = 980 - 420 * precio;
  const yA = 770;
  const entra = sp(f, b0 - 6, REBOTE);
  return (
    <AbsoluteFill>
      <Olas y={1250} op={0.3} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={540} x2={540} y1={380} y2={yC} stroke={ORO} strokeWidth={6} />
        <line x1={540} x2={540} y1={yC} y2={1130} stroke={ORO} strokeWidth={6} />
        <rect x={450} y={Math.min(yA, yC)} width={180} height={Math.max(4, Math.abs(yC - yA))} fill={yC < yA ? CREMA : TINTA} stroke={CREMA} strokeWidth={5} />
        <circle cx={540} cy={yC} r={12} fill="none" stroke={ORO} strokeWidth={5} />
        <g transform={`translate(0 ${(1 - entra) * -300})`}>
          <Oni x={540} y={300} esc={1.45} f={f} />
        </g>
        <g transform={`translate(0 ${(1 - entra) * 300})`}>
          <Miedo x={540} y={1240} esc={1.45} f={f} />
        </g>
      </svg>
      {f >= b2 - 2 && (
        <div style={{ position: "absolute", left: 690, top: 240, transform: `scale(${sp(f, b2 - 2, REBOTE)})`, fontFamily: PRINCIPAL, fontSize: 64, color: "#E8695A" }}>CODICIA</div>
      )}
      {f >= b1 - 2 && (
        <div style={{ position: "absolute", left: 690, top: 1190, transform: `scale(${sp(f, b1 - 2, REBOTE)})`, fontFamily: PRINCIPAL, fontSize: 64, color: "#9FC3E0" }}>MIEDO</div>
      )}
      {void dur}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 8 · banderas en las montañas

const PICOS: [number, number][] = [
  [110, 1020],
  [290, 880],
  [470, 940],
  [650, 800],
  [820, 860],
  [970, 720],
];

const Banderas: React.FC<PropsEscena> = ({ b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const viaje = pr(f, b0, Math.max(30, b2 - b0), Easing.inOut(Easing.sin));
  const tramo = viaje * (PICOS.length - 1);
  const i = Math.min(PICOS.length - 2, Math.floor(tramo));
  const t = tramo - i;
  const px = PICOS[i][0] + (PICOS[i + 1][0] - PICOS[i][0]) * t;
  const py = PICOS[i][1] + (PICOS[i + 1][1] - PICOS[i][1]) * t - Math.sin(t * Math.PI) * 60 - 150;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* capas de montañas a la aguada */}
        {[
          { y: 0, col: "#3A352D", op: 0.6 },
          { y: 120, col: "#2A261F", op: 0.8 },
          { y: 240, col: "#15130F", op: 1 },
        ].map((c, k) => (
          <path key={k} d={`M0 ${1100 + c.y} ${PICOS.map(([x, y]) => `L${x + k * 20} ${y + c.y + k * 40} L${x + 80 + k * 20} ${y + c.y + 130}`).join(" ")} L1080 ${1100 + c.y} L1080 1500 L0 1500 Z`} fill={c.col} opacity={c.op} />
        ))}
        <path d={`M${PICOS.map(([x, y]) => `${x} ${y - 150}`).join(" L")}`} fill="none" stroke={alfa(ORO, 0.25)} strokeWidth={4} strokeDasharray="10 12" />
        {/* hombres con banderas en cada cumbre */}
        {PICOS.map(([x, y], k) => {
          const llega = k / (PICOS.length - 1) <= viaje + 0.001;
          const sube = llega ? sp(f, b0 + (k / (PICOS.length - 1)) * Math.max(30, b2 - b0), REBOTE) : 0;
          const ondea = Math.sin(f / 4 + k) * 6;
          return (
            <g key={k} transform={`translate(${x} ${y})`}>
              <circle cx={0} cy={-38} r={12} fill={TINTA} />
              <path d="M-14 -24 L14 -24 L18 10 L-18 10 Z" fill={TINTA} />
              <line x1={14} x2={14} y1={0} y2={-20 - 130 * sube} stroke="#8B5A2B" strokeWidth={6} />
              {sube > 0.05 && <path d={`M14 ${-20 - 130 * sube} L${80 + ondea} ${-5 - 130 * sube + ondea / 2} L14 ${10 - 130 * sube} Z`} fill={k % 2 ? CREMA : SELLO} stroke={TINTA} strokeWidth={3} />}
            </g>
          );
        })}
        {/* el precio viaja de cumbre en cumbre */}
        {f >= b0 && viaje < 1 && <circle cx={px} cy={py} r={16} fill={ORO} stroke={TINTA} strokeWidth={3} />}
      </svg>
      <div style={{ position: "absolute", left: 40, top: 1150, fontFamily: PRINCIPAL, fontSize: 52, color: ORO }}>
        OSAKA <span style={{ fontFamily: KANJI, color: SELLO }}>大阪</span>
      </div>
      <div style={{ position: "absolute", right: 30, top: 470, textAlign: "right", fontFamily: PRINCIPAL, fontSize: 52, color: ORO, opacity: pr(f, b1, 10) }}>
        SAKATA <span style={{ fontFamily: KANJI, color: SELLO }}>酒田</span>
      </div>
      {f >= b2 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1330, textAlign: "center", transform: `scale(${sp(f, b2 - 2, REBOTE)}) rotate(-3deg)` }}>
          <span style={{ background: ORO, color: TINTA, fontFamily: PRINCIPAL, fontSize: 60, padding: "6px 24px", borderRadius: 12 }}>ANTES QUE NADIE</span>
        </div>
      )}
      {void dur}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 9 · tan rico que le cantaban

const Rico: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const rollo = pr(f, b1 - 4, 16, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Halo x={540} y={700} r={500} op={0.25} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* monedas koban que llueven */}
        {f >= b0 - 4 &&
          Array.from({ length: 40 }).map((_, k) => {
            const t0 = b0 - 4 + rnd(k) * 30;
            const t = Math.max(0, f - t0);
            const x = 80 + rnd(k + 3) * 920;
            const y = Math.min(1250 - rnd(k + 8) * 60, 200 + t * t * 1.2);
            return f >= t0 ? (
              <g key={k} transform={`translate(${x} ${y}) rotate(${rnd(k + 1) * 60 - 30 + (y < 1180 ? t * 6 : 0)})`}>
                <ellipse rx={30} ry={46} fill="#E2B655" stroke="#8A6420" strokeWidth={4} />
                {[-18, 0, 18].map((dy) => (
                  <line key={dy} x1={-16} x2={16} y1={dy} y2={dy} stroke="#B88A30" strokeWidth={3} />
                ))}
              </g>
            ) : null;
          })}
        <Homma x={300} y={900} esc={0.8} animo="rie" />
      </svg>
      {/* pergamino con la canción */}
      <div style={{ position: "absolute", left: 560, top: 380, width: 400, height: 760 * rollo, overflow: "hidden" }}>
        <Washi x={0} y={0} w={400} h={760}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 60, fontFamily: SECUND, fontSize: 44, lineHeight: 1.35, color: TINTA }}>
            {[
              ["♪ Nunca seré", b1 + 2],
              ["como Homma…", b1 + 22],
              ["", 0],
              ["como mucho,", b2 - 26],
            ].map(([t, d], i) => (
              <div key={i} style={{ minHeight: 60, opacity: pr(f, Number(d), 8), transform: `translateY(${(1 - pr(f, Number(d), 8)) * 14}px)` }}>{t}</div>
            ))}
            <div style={{ fontFamily: PRINCIPAL, fontSize: 52, color: SELLO, opacity: pr(f, b2 - 10, 8), transform: `scale(${f >= b2 - 10 ? sp(f, b2 - 10, REBOTE) : 0})`, transformOrigin: "0 50%" }}>un señor feudal ♪</div>
          </div>
        </Washi>
      </div>
      {f >= b0 - 2 && (
        <div style={{ position: "absolute", left: 60, top: 300, transform: `scale(${sp(f, b0 - 2, REBOTE)}) rotate(-4deg)`, fontFamily: PRINCIPAL, fontSize: 90, color: ORO }}>TAN RICO</div>
      )}
      {f >= b2 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {[0, 1, 2].map((k) => {
            const t = ((f - b2 + k * 10) % 30) / 30;
            return (
              <text key={k} x={560 + k * 120} y={360 - t * 120} fontSize={60} fill={ORO} opacity={1 - t}>
                ♪
              </text>
            );
          })}
        </svg>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 10 · 1991: viaje a Occidente

const Viaje: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const cuenta = pr(f, 0, Math.max(10, b0), Easing.inOut(Easing.cubic));
  const anio = Math.round(1750 + (1991 - 1750) * cuenta);
  const ciudad = pr(f, b2 - 8, 20, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: PRINCIPAL, fontSize: 220, color: anio === 1991 ? ORO : CREMA, fontVariantNumeric: "tabular-nums", transform: `scale(${anio === 1991 ? sp(f, b0, REBOTE) * 0.1 + 0.9 : 1})` }}>{anio}</div>
      {/* libro */}
      {f >= b1 - 4 && (
        <div style={{ position: "absolute", left: 360, top: 560, width: 360, height: 480, transform: `scale(${sp(f, b1 - 4, REBOTE)}) rotate(-5deg)`, background: "linear-gradient(135deg, #1B1B1B, #000)", border: `4px solid ${ORO}`, borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <svg width={200} height={180}>
            {(() => {
              // cinco velas seguidas: cada una abre donde cerró la anterior
              const cierres = [130, 95, 110, 70, 45];
              let o = 150;
              return cierres.map((c, k) => {
                const sube = c < o;
                const top = Math.min(o, c),
                  alto = Math.abs(o - c);
                const el = (
                  <g key={k}>
                    <line x1={20 + k * 40} x2={20 + k * 40} y1={top - 14} y2={top + alto + 12} stroke={CREMA} strokeWidth={3} />
                    <rect x={8 + k * 40} y={top} width={24} height={Math.max(4, alto)} fill={sube ? CREMA : "#000"} stroke={CREMA} strokeWidth={3} />
                  </g>
                );
                o = c;
                return el;
              });
            })()}
          </svg>
          <div style={{ fontFamily: PRINCIPAL, fontSize: 44, color: ORO, textAlign: "center", lineHeight: 1 }}>VELAS<br />JAPONESAS</div>
          <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: CREMA }}>STEVE NISON</div>
        </div>
      )}
      {/* ciudad occidental */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: ciudad }}>
        {Array.from({ length: 16 }).map((_, k) => {
          const w = 50 + rnd(k) * 30;
          const h = 120 + rnd(k + 5) * 260;
          return <rect key={k} x={k * 70} y={1320 - h * ciudad} width={w} height={h} fill="#141210" stroke={alfa(ORO, 0.4)} strokeWidth={2} />;
        })}
      </svg>
      {f >= b2 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1100, textAlign: "center", transform: `scale(${sp(f, b2 - 2, REBOTE)})`, fontFamily: PRINCIPAL, fontSize: 80, color: ORO }}>OCCIDENTE</div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 11 · hoy: la vela está hecha de arroz

/** Móvil con una app de gráficos: velas reales que van entrando, precio que late y la última vela viva. */
const TEMAS_APP = [
  { fondo: "#131722", texto: "#D1D4DC", sube: "#089981", baja: "#F23645", nombre: "oscuro" },
  { fondo: "#FFFFFF", texto: "#131722", sube: "#26A69A", baja: "#EF5350", nombre: "claro" },
  { fondo: "#0B0A08", texto: CREMA, sube: CREMA, baja: "#000000", nombre: "papel" },
];
const Movil: React.FC<{ x: number; y: number; esc: number; giro: number; tema: (typeof TEMAS_APP)[number]; f: number; desde: number; arroz?: number }> = ({ x, y, esc, giro, tema, f, desde, arroz = -1 }) => {
  const W = 380,
    H = 720;
  // cada vela abre donde cerró la anterior
  const velas = continua(AAPL_DIARIO.slice(-26));
  const lo = Math.min(...velas.map((v) => v.l)),
    hi = Math.max(...velas.map((v) => v.h));
  const yP = (pr0: number) => 210 + ((hi - pr0) / (hi - lo)) * 330;
  const xV = (i: number) => 26 + i * 12.4;
  const ult = velas[velas.length - 1];
  const precio = ult.c + Math.sin(f / 4) * 0.12;
  return (
    <div style={{ position: "absolute", left: x - W / 2, top: y - H / 2, width: W, height: H, transform: `scale(${esc}) rotate(${giro}deg)`, borderRadius: 48, border: "10px solid #1B1B1B", background: tema.fondo, boxShadow: "0 40px 80px rgba(0,0,0,0.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 140, top: 14, width: 100, height: 22, borderRadius: 11, background: "#000" }} />
      <div style={{ position: "absolute", left: 24, top: 60, fontFamily: F.texto, fontWeight: 800, fontSize: 30, color: tema.texto }}>AAPL</div>
      <div style={{ position: "absolute", left: 24, top: 100, fontFamily: F.texto, fontWeight: 800, fontSize: 44, color: tema.texto, fontVariantNumeric: "tabular-nums" }}>{precio.toFixed(2).replace(".", ",")}</div>
      <div style={{ position: "absolute", left: 24, top: 156, fontFamily: F.texto, fontWeight: 700, fontSize: 22, color: tema.nombre === "papel" ? ORO : tema.sube }}>▲ +0,42%</div>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {[0, 1, 2, 3].map((i) => <line key={i} x1={20} x2={W - 20} y1={230 + i * 100} y2={230 + i * 100} stroke={alfa(tema.texto, 0.08)} strokeWidth={1.5} />)}
        {velas.map((v, i) => {
          const entra = desde + i * 1.2;
          if (f < entra) return null;
          const t = Math.min(1, (f - entra) / 6);
          const sube = v.c >= v.o;
          const col = sube ? tema.sube : tema.baja;
          const borde = tema.nombre === "papel" ? CREMA : col;
          const yA = yP(Math.max(v.o, v.c)),
            yB = yP(Math.min(v.o, v.c));
          const ultima = i === velas.length - 1;
          const mid = (yA + yB) / 2;
          return (
            <g key={i} opacity={t} transform={`translate(0 ${(1 - t) * 20})`}>
              <line x1={xV(i)} x2={xV(i)} y1={yP(v.h)} y2={yP(v.l)} stroke={borde} strokeWidth={2} />
              {ultima && arroz >= 0 ? (
                // la última vela se llena de granos de arroz
                <g>
                  <rect x={xV(i) - 9} y={mid - 34} width={18} height={68} rx={2} fill={alfa(ORO, 0.15)} stroke={ORO} strokeWidth={1.8} />
                  {Array.from({ length: 24 }).map((_, g) => {
                    const t0 = arroz + g * 1;
                    if (f < t0) return null;
                    const cae = Math.min(1, (f - t0) / 7);
                    const gy = mid + 29 - Math.floor(g / 3) * 8.2;
                    return <ellipse key={g} cx={xV(i) - 5 + (g % 3) * 5} cy={gy - (1 - cae) * 70} rx={2.3} ry={3.9} transform={`rotate(${(g * 37) % 60 - 30} ${xV(i) - 5 + (g % 3) * 5} ${gy - (1 - cae) * 70})`} fill="#FBF6EA" stroke="#CFC4AA" strokeWidth={0.6} />;
                  })}
                </g>
              ) : (
                <rect x={xV(i) - 4.5} y={yA} width={9} height={Math.max(2, yB - yA)} fill={sube ? (tema.nombre === "papel" ? CREMA : col) : col} stroke={borde} strokeWidth={tema.nombre === "papel" ? 1.5 : 0} />
              )}
              {ultima && <line x1={20} x2={W - 20} y1={yP(ult.c)} y2={yP(ult.c)} stroke={alfa(tema.sube, 0.6)} strokeWidth={1.5} strokeDasharray="4 5" />}
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, borderTop: `1px solid ${alfa(tema.texto, 0.1)}`, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 26, height: 26, borderRadius: 7, background: alfa(tema.texto, i === 1 ? 0.5 : 0.15) }} />)}
      </div>
    </div>
  );
};

const Hoy: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  // tres apps distintas entran en abanico ("en cualquier app"); luego las de los lados se van y la del centro se acerca
  const entra = (i: number) => sp(f, b0 - 8 + i * 4, REBOTE);
  const aparta = pr(f, b1 - 4, 14, Easing.inOut(Easing.cubic));
  const zoom = pr(f, b1 + 2, 22, Easing.inOut(Easing.cubic));
  const lados = [
    { x: 290, giro: -12, tema: TEMAS_APP[1] },
    { x: 790, giro: 12, tema: TEMAS_APP[2] },
  ];
  return (
    <AbsoluteFill>
      <Halo x={540} y={720} r={520} op={0.2} />
      {lados.map((l, i) =>
        entra(i) > 0.01 ? (
          <Movil key={i} x={l.x + (i ? 1 : -1) * aparta * 600} y={760 + (1 - entra(i)) * 900} esc={0.78} giro={l.giro} tema={l.tema} f={f} desde={b0 - 4} />
        ) : null,
      )}
      {entra(2) > 0.01 && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 3.6 * zoom})`, transformOrigin: "679px 600px" }}>
          <Movil x={540} y={740 + (1 - entra(2)) * 900} esc={0.95} giro={0} tema={TEMAS_APP[0]} f={f} desde={b0 - 4} arroz={b2 - 6} />
        </div>
      )}
      {f >= b0 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1190, textAlign: "center", opacity: 1 - zoom, transform: `scale(${sp(f, b0 - 2, REBOTE)})` }}>
          <span style={{ fontFamily: SECUND, fontSize: 56, color: CREMA }}>en </span>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 72, color: ORO }}>CUALQUIER APP</span>
        </div>
      )}
      {f >= b2 - 2 && (
        <>
          <Hanko x={540} y={1180} desde={b2 - 2} texto="ARROZ" tam={200} giro={-8} />
          <Chispas desde={b2 - 2} x={540} y={700} n={16} r={260} color={CREMA} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 12 · CTA: comenta ARROZ y adelanto

const Comenta: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const palabra = txt(p, "palabra", "ARROZ");
  return (
    <AbsoluteFill>
      <Escritorio dur={dur} apagaEn={dur - TRANSICION} cabecera="PRÓXIMO VÍDEO" foco={[[0, 540]]} asiente={[b0, b1]}>
        <Halo x={540} y={560} r={400} op={0.2} />
        {f >= b2 - 4 && (
          <div style={{ position: "absolute", left: 300, top: 400, width: 480, height: 420, transform: `scale(${sp(f, b2 - 4, REBOTE)}) rotate(-3deg)`, background: CREMA, borderRadius: 18, padding: 28, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: ORO }}>PRÓXIMO</div>
            <div style={{ fontFamily: PRINCIPAL, fontSize: 60, color: "#16120E", lineHeight: 1 }}>LAS 3 VELAS</div>
            <div style={{ fontFamily: SECUND, fontSize: 30, color: "#16120E" }}>que más vas a ver</div>
            <svg width={420} height={200} style={{ marginTop: 14 }}>
              {[0, 1, 2].map((k) => (
                <g key={k} transform={`translate(${70 + k * 140} 0)`}>
                  <line x1={0} x2={0} y1={k === 1 ? 20 : 10} y2={k === 0 ? 190 : 170} stroke="#16120E" strokeWidth={5} />
                  <rect x={-24} y={k === 0 ? 30 : k === 1 ? 90 : 40} width={48} height={k === 0 ? 30 : k === 1 ? 6 : 110} fill={k === 2 ? CREMA : "#16120E"} stroke="#16120E" strokeWidth={5} />
                  <text x={0} y={-2} textAnchor="middle" fontFamily={PRINCIPAL} fontSize={34} fill={ORO}>?</text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </Escritorio>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", transform: `scale(${sp(f, b0 - 4, REBOTE)})` }}>
        <div style={{ fontFamily: SECUND, fontSize: 64, color: CREMA }}>
          ¿Lo sabías? <span style={{ color: ORO, opacity: pr(f, b0 + 20, 6), display: "inline-block", transform: `scale(${f >= b0 + 20 ? sp(f, b0 + 20, REBOTE) : 0})` }}>Si no…</span>
        </div>
      </div>
      {f >= b1 - 18 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 22 }}>
          <span style={{ fontFamily: SECUND, fontSize: 70, color: CREMA, display: "inline-block", transform: `scale(${sp(f, b1 - 18, REBOTE)})` }}>comenta</span>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 120, color: ORO, background: alfa(ORO, 0.12), border: `4px solid ${ORO}`, borderRadius: 24, padding: "0 24px", transform: `scale(${f >= b1 - 4 ? sp(f, b1 - 4, REBOTE) : 0}) rotate(${Math.sin(f / 8) * 3}deg)`, display: "inline-block" }}>{palabra}</span>
        </div>
      )}
      {f >= b1 - 4 && <Chispas desde={b1 - 4} x={540} y={180} n={14} r={220} color={ORO} />}
      {void arr}
    </AbsoluteFill>
  );
};

export const origen: DefEscena = { C: Origen, momentos: 3, alInicio: () => true, sonidos: () => [[1, "reloj", 0.22]] };
export const mapa: DefEscena = { C: Mapa, momentos: 3, alInicio: () => true, sonidos: () => [[0, "pincel", 0.35], [1, "sello", 0.42], [2, "ding", 0.2]] };
export const dojima: DefEscena = { C: Dojima, momentos: 3, alInicio: () => true, sonidos: () => [[0, "taiko", 0.4], [2, "papel", 0.35]] };
export const futuros: DefEscena = { C: Futuros, momentos: 3, alInicio: () => true, sonidos: () => [[0, "papel", 0.3], [1, "pop", 0.28], [2, "taiko", 0.35]] };
export const homma: DefEscena = { C: HommaEsc, momentos: 3, alInicio: () => true, sonidos: () => [[0, "taiko", 0.4], [1, "gong", 0.35]] };
export const pincel: DefEscena = { C: Pincel, momentos: (p) => (txt(p, "modo") === "partes" ? 4 : 3), alInicio: () => true, sonidos: (p) => (txt(p, "modo") === "partes" ? [[0, "tic", 0.3], [1, "tic", 0.3], [2, "tic", 0.3], [3, "tic", 0.3]] : [[1, "pincel", 0.4], [2, "sello", 0.4]]) };
export const mascaras: DefEscena = { C: Mascaras, momentos: 3, alInicio: () => true, sonidos: () => [[0, "whoosh", 0.25], [1, "taiko", 0.4], [2, "taiko", 0.45]] };
export const banderas: DefEscena = { C: Banderas, momentos: 3, alInicio: () => true, sonidos: () => [[0, "viento", 0.3], [2, "ding", 0.3]] };
export const rico: DefEscena = { C: Rico, momentos: 3, alInicio: () => true, sonidos: () => [[0, "monedas", 0.4], [1, "papel", 0.3]] };
export const viaje: DefEscena = { C: Viaje, momentos: 3, alInicio: () => true, sonidos: () => [[0, "subida", 0.3], [1, "pop", 0.3], [2, "zip", 0.3]] };
export const hoy: DefEscena = { C: Hoy, momentos: 3, alInicio: () => true, sonidos: () => [[0, "swoosh", 0.25], [1, "whoosh", 0.22], [2, "arroz", 0.4]] };
export const comentaJ: DefEscena = { C: Comenta, momentos: 3, alInicio: () => true, sonidos: () => [[1, "campana", 0.25], [2, "papel", 0.25]] };
