// Vídeo 4 · El doji (parte 1 de «Las 3 velas que más vas a ver»). Mismo mundo de la serie: planeta de noche,
// dorado y crema. Las tres velas entran borrosas y salta el doji; luego el oro real (OANDA:XAUUSD diario,
// mayo-junio 2026) en el monitor con estilo papel, un contraejemplo y los porcentajes de Bulkowski.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { F, alfa } from "../motor/estilos";
import { numeroES } from "../motor/anim";
import type { DefEscena, PropsEscena } from "../tipos";
import { txt } from "../escenas/util";
import { Escritorio } from "./Escritorio";
import { GraficoVelas, PAPEL, continua, geometria, type Marco } from "./Velas";
import { TRANSICION } from "./Cierre";
import { XAU, idx, type VelaFecha } from "./xau";
import { Chispas, Cuenta, Halo, ORO, PRINCIPAL, PRO, REBOTE, ROJO, SECUND, VERDE, Trazo, pr, principalPara, sp, temblor } from "./mg";

const CREMA = "#F2E8D5";
const TINTA = "#141414";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Fotograma (relativo a la escena) en que se oye la palabra que empieza por `w`; si no está, `def`. */
const enPalabra = (palabras: PropsEscena["palabras"], w: string, def: number) =>
  palabras.find((x) => x.w.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "").startsWith(w))?.f ?? def;
/** Latido 1 → 1+k → 1 que dura `d` fotogramas desde `a` (para que algo "respire" en un tramo sin cambios). */
const latido = (f: number, a: number, k = 0.08, d = 12) => (f < a || f > a + d ? 1 : 1 + k * Math.sin(((f - a) / d) * Math.PI));

// ---------------------------------------------------------------- vela suelta (dibujo grande)

type Forma = { o: number; c: number; h: number; l: number };
/** Vela grande de la marca: alcista crema rellena, bajista negra con borde crema. y = 0 arriba, 1 abajo. */
const VelaG: React.FC<{ x: number; y: number; alto: number; ancho?: number; v: Forma; color?: string }> = ({ x, y, alto, ancho = 90, v, color = CREMA }) => {
  const Y = (p: number) => y + p * alto;
  const top = Y(Math.min(v.o, v.c)),
    bot = Y(Math.max(v.o, v.c));
  const alza = v.c < v.o; // en coordenadas de pantalla: cierre más arriba que la apertura
  return (
    <g>
      <line x1={x} x2={x} y1={Y(v.h)} y2={Y(v.l)} stroke={color} strokeWidth={7} strokeLinecap="round" />
      <rect x={x - ancho / 2} y={top} width={ancho} height={Math.max(8, bot - top)} rx={4} fill={alza ? color : "#000"} stroke={color} strokeWidth={6} />
    </g>
  );
};
const MARTILLO: Forma = { o: 0.3, c: 0.18, h: 0.12, l: 1 };
const DOJI: Forma = { o: 0.5, c: 0.505, h: 0, l: 1 };
const PREVIA: Forma = { o: 0.42, c: 0.62, h: 0.36, l: 0.7 };
const ENVUELVE: Forma = { o: 0.72, c: 0.18, h: 0.1, l: 0.8 };

// ---------------------------------------------------------------- Bulkowski (personaje)

/**
 * Thomas Bulkowski como personaje de la serie (ilustración, no retrato): ingeniero que pasó a trader y probó
 * 103 patrones de velas. Gafas, pelo canoso, camisa y corbata, el libro «103 VELAS» y un bolígrafo para señalar.
 * Entra con rebote en `desde`; en `senala` levanta el bolígrafo hacia el dato; se ajusta las gafas y hojea el libro.
 */
const Bulkowski: React.FC<{ x: number; y: number; esc?: number; desde: number; senala?: number; gafas?: number; mira?: number }> = ({ x, y, esc = 1, desde, senala = 1e9, gafas = 1e9, mira = 1 }) => {
  const f = useCurrentFrame();
  const e = sp(f, desde, REBOTE);
  if (e <= 0) return null;
  const T = TINTA,
    PIEL = "#D9A77C",
    CANA = "#C9C3B8";
  const parpadea = (f - desde) % 70 < 4 && f - desde > 10;
  const resp = Math.sin(f / 9) * 3; // respira
  const brazo = pr(f, senala, 10, Easing.out(Easing.back(2)));
  const ajusta = Math.max(0, Math.sin(Math.min(1, Math.max(0, (f - gafas) / 16)) * Math.PI));
  const hoja = Math.sin(f / 5) > 0.7 ? 1 : 0; // hojea el libro de vez en cuando
  const cabeza = Math.sin(f / 13) * 3 + (brazo > 0 ? -4 * mira : 0);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <g transform={`translate(${x} ${y + (1 - e) * 260}) scale(${esc * Math.min(1, 0.6 + 0.4 * e)})`} opacity={Math.min(1, e * 1.5)}>
        {/* cuerpo: camisa, chaleco y corbata dorada */}
        <g transform={`translate(0 ${resp})`}>
          <path d="M-125 330 L-105 120 Q0 80 105 120 L125 330 Z" fill="#2B3446" stroke={T} strokeWidth={5} />
          <path d="M-42 104 L0 175 L42 104 Z" fill={CREMA} stroke={T} strokeWidth={4} />
          <path d="M-10 118 L10 118 L16 200 L0 222 L-16 200 Z" fill={ORO} stroke={T} strokeWidth={3} />
          {/* libro «103 VELAS» en el brazo izquierdo */}
          <g transform={`translate(-70 190) rotate(${-8 + hoja * 3})`}>
            <rect x={-70} y={-55} width={130} height={150} rx={8} fill="#7A1F1A" stroke={T} strokeWidth={5} />
            <rect x={48} y={-50} width={14} height={140} fill={CREMA} stroke={T} strokeWidth={2} />
            <text x={-5} y={0} textAnchor="middle" fontFamily={PRO} fontSize={34} fill={ORO}>103</text>
            <text x={-5} y={36} textAnchor="middle" fontFamily={PRO} fontSize={22} fill={CREMA}>VELAS</text>
            {hoja > 0 && <path d="M60 -48 Q30 10 58 88" fill="none" stroke={CREMA} strokeWidth={4} />}
          </g>
          {/* brazo derecho con bolígrafo: baja → señala */}
          <g transform={`translate(85 140) rotate(${20 - 110 * brazo - 70 * ajusta * (1 - brazo)})`}>
            <rect x={-18} y={0} width={36} height={120} rx={18} fill="#2B3446" stroke={T} strokeWidth={4} />
            <circle cx={0} cy={128} r={20} fill={PIEL} stroke={T} strokeWidth={4} />
            <rect x={-4} y={140} width={8} height={60} rx={3} fill={ORO} stroke={T} strokeWidth={2} />
          </g>
        </g>
        {/* cabeza */}
        <g transform={`rotate(${cabeza} 0 60)`}>
          <rect x={-22} y={50} width={44} height={40} rx={12} fill={PIEL} />
          <ellipse cx={0} cy={0} rx={62} ry={72} fill={PIEL} stroke={T} strokeWidth={4} />
          {/* pelo canoso a los lados, entradas arriba */}
          <path d="M-62 -6 Q-66 -60 -30 -70 Q-46 -40 -48 -4 Z" fill={CANA} stroke={T} strokeWidth={3} />
          <path d="M62 -6 Q66 -60 30 -70 Q46 -40 48 -4 Z" fill={CANA} stroke={T} strokeWidth={3} />
          <path d="M-30 -70 Q0 -82 30 -70" fill="none" stroke={CANA} strokeWidth={6} strokeLinecap="round" />
          {/* gafas (suben un poco al ajustarlas) */}
          <g transform={`translate(0 ${-6 * ajusta})`}>
            {[-24, 24].map((dx) => (
              <circle key={dx} cx={dx} cy={-2} r={20} fill={alfa(CREMA, 0.25)} stroke={T} strokeWidth={5} />
            ))}
            <line x1={-4} x2={4} y1={-4} y2={-4} stroke={T} strokeWidth={5} />
            {[-24, 24].map((dx) => (parpadea ? <line key={`o${dx}`} x1={dx - 8} x2={dx + 8} y1={-2} y2={-2} stroke={T} strokeWidth={4} /> : <circle key={`o${dx}`} cx={dx + 3 * mira} cy={-2} r={5} fill={T} />))}
          </g>
          {/* bigote y boca */}
          <path d="M-22 30 Q0 20 22 30 Q0 40 -22 30 Z" fill={CANA} stroke={T} strokeWidth={3} />
          <path d={brazo > 0.5 ? "M-12 46 Q0 56 12 46" : "M-10 48 L10 48"} fill="none" stroke={T} strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- 1 · tres velas borrosas, salta el doji

const Tres: React.FC<PropsEscena> = ({ b }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const salta = sp(f, b2 - 4, REBOTE);
  const aparta = pr(f, b2 - 4, 16, Easing.inOut(Easing.cubic));
  const velas = [
    { x: 250, nombre: "MARTILLO", dibujo: <VelaG x={250} y={760} alto={420} v={MARTILLO} /> },
    { x: 540, nombre: "DOJI", dibujo: <VelaG x={540} y={760} alto={420} v={DOJI} /> },
    {
      x: 830,
      nombre: "ENVOLVENTE",
      dibujo: (
        <>
          <VelaG x={785} y={760} alto={420} ancho={62} v={PREVIA} />
          <VelaG x={875} y={760} alto={420} ancho={78} v={ENVUELVE} />
        </>
      ),
    },
  ];
  return (
    <AbsoluteFill>
      {velas.map((v, i) => {
        const e = sp(f, b0 + i * 5, REBOTE);
        if (e <= 0) return null;
        const esDoji = i === 1;
        const lado = i === 0 ? -1 : i === 2 ? 1 : 0;
        const blur = esDoji ? 7 * (1 - salta) : 7 + 5 * aparta;
        const esc = (esDoji ? 1 + 0.45 * salta : 1 - 0.18 * aparta) * latido(f, b1 + 4 + i * 7, 0.12, 12);
        const dy = (1 - e) * 500 + (esDoji ? -60 * salta : 0);
        const op = esDoji ? 0.55 + 0.45 * salta : 0.55 - 0.25 * aparta;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: op, filter: `blur(${blur}px)`, transform: `translate(${lado * 70 * aparta}px, ${dy}px) scale(${esc})`, transformOrigin: `${v.x}px 970px` }}>
            {esDoji && salta > 0.05 && <Halo x={540} y={970} r={330} op={0.3 * Math.min(1, salta)} />}
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              {v.dibujo}
            </svg>
            <div style={{ position: "absolute", left: v.x - 200, width: 400, top: 1240, textAlign: "center", fontFamily: SECUND, fontSize: 40, color: CREMA, opacity: pr(f, b1 - 2 + i * 3, 10) }}>{v.nombre}</div>
          </div>
        );
      })}
      {f >= b2 - 4 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1390, textAlign: "center", transform: `scale(${salta})` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 92, color: ORO }}>1 / 3</span>
        </div>
      )}
      <Chispas desde={b2 - 2} x={540} y={910} n={16} r={300} color={CREMA} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2-3 · el doji de cerca

const DojiZoom: React.FC<PropsEscena> = ({ p, b }) => {
  const f = useCurrentFrame();
  const duda = txt(p, "modo") === "duda";
  const [b0 = 0, b1 = 15, b2 = 30, b3 = 45] = b;
  const X = 540,
    Y0 = 560,
    ALTO = 900;
  const yA = Y0 + DOJI.o * ALTO,
    yC = Y0 + DOJI.c * ALTO;
  const t = duda ? temblor(f, b2, 12, 12) : { x: 0, y: 0 };
  const tambalea = duda ? Math.sin(Math.max(0, f - b3) / 3) * 4 * pr(f, b3, 6) : 0;
  const entra = duda ? 1 : sp(f, b0 - 6, REBOTE);
  return (
    <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
      <Halo x={X} y={yA} r={360} op={0.22} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`translate(0 ${(1 - entra) * 300}) rotate(${tambalea} ${X} ${yA})`} opacity={Math.min(1, entra)}>
          <VelaG x={X} y={Y0} alto={ALTO} ancho={150} v={DOJI} />
        </g>
        {!duda && (
          <>
            <Trazo d={`M${X - 380} ${yA} L${X - 90} ${yA}`} p={pr(f, b1 - 2, 12)} color={ORO} grosor={5} />
            <Trazo d={`M${X + 90} ${yC} L${X + 380} ${yC}`} p={pr(f, b2 - 2, 12)} color={ORO} grosor={5} />
          </>
        )}
        {duda && (
          <>
            {/* compradores empujan desde abajo, vendedores desde arriba: chocan en el cuerpo */}
            {(() => {
              const k1 = pr(f, b0 - 4, 14, Easing.in(Easing.cubic)),
                k2 = pr(f, b1 - 4, 14, Easing.in(Easing.cubic));
              const choca = Math.min(k1, k2);
              const yS = 1700 - (1700 - (yA + 70)) * k1,
                yB = 380 + (yA - 70 - 380) * k2;
              return (
                <>
                  {k1 > 0 && <path d={`M${X - 220} ${yS + 70} L${X - 220} ${yS} L${X - 255} ${yS + 40} M${X - 220} ${yS} L${X - 185} ${yS + 40}`} stroke={VERDE} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                  {k2 > 0 && <path d={`M${X + 220} ${yB - 70} L${X + 220} ${yB} L${X + 185} ${yB - 40} M${X + 220} ${yB} L${X + 255} ${yB - 40}`} stroke={ROJO} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                  {choca >= 1 && <circle cx={X} cy={yA} r={40 + 160 * pr(f, b2, 14)} fill="none" stroke={ORO} strokeWidth={6} opacity={1 - pr(f, b2, 14)} />}
                </>
              );
            })()}
          </>
        )}
      </svg>
      {!duda && (
        <>
          <div style={{ position: "absolute", left: X - 400, top: yA - 70, fontFamily: PRO, fontSize: 40, color: ORO, opacity: pr(f, b1, 8) }}>APERTURA</div>
          <div style={{ position: "absolute", left: X + 160, top: yC + 20, fontFamily: PRO, fontSize: 40, color: ORO, opacity: pr(f, b2, 8) }}>CIERRE</div>
          {f >= b3 - 3 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b3 - 3, REBOTE)})` }}>
              <span style={{ fontFamily: SECUND, fontSize: 64, color: CREMA }}>apertura </span>
              <span style={{ fontFamily: PRINCIPAL, fontSize: 110, color: ORO }}>≈</span>
              <span style={{ fontFamily: SECUND, fontSize: 64, color: CREMA }}> cierre</span>
            </div>
          )}
        </>
      )}
      {duda && (
        <>
          <div style={{ position: "absolute", left: X - 330, top: 1560, fontFamily: PRO, fontSize: 36, color: VERDE, opacity: pr(f, b0, 8) }}>COMPRADORES</div>
          <div style={{ position: "absolute", left: X + 60, top: 330, fontFamily: PRO, fontSize: 36, color: ROJO, opacity: pr(f, b1, 8) }}>VENDEDORES</div>
          {f >= b2 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 1460, textAlign: "center", transform: `scale(${sp(f, b2, REBOTE)})` }}>
              <span style={{ fontFamily: PRINCIPAL, fontSize: 96, color: ORO }}>EMPATE</span>
            </div>
          )}
          {f >= b3 - 2 && <div style={{ position: "absolute", left: X + 120, top: yA - 260, fontFamily: PRINCIPAL, fontSize: 170, color: CREMA, transform: `scale(${sp(f, b3 - 2, REBOTE)}) rotate(12deg)` }}>?</div>}
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4 · el dato de Bulkowski (doji estrella alcista)

const Dato: React.FC<PropsEscena> = ({ b, palabras }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const fuente = enPalabra(palabras, "bulkowski", b1 - 4);
  // patrón: vela negra alta y doji debajo. Lo que "se espera" (sube) frente a lo que pasó (siguió cayendo)
  const espera = pr(f, b0, 16, Easing.inOut(Easing.cubic));
  const real = pr(f, b2 - 6, 18, Easing.inOut(Easing.cubic));
  const tacha = pr(f, b2 - 8, 8);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g opacity={sp(f, b0 - 8)}>
          <VelaG x={300} y={520} alto={600} ancho={86} v={{ o: 0.05, c: 0.62, h: 0, l: 0.68 }} />
          <VelaG x={420} y={520} alto={600} ancho={86} v={{ o: 0.8, c: 0.805, h: 0.74, l: 0.88 }} />
        </g>
        {f >= b1 - 2 && <circle cx={420} cy={1003} r={50 * latido(f, b1 - 2, 0.3, 14)} fill="none" stroke={ORO} strokeWidth={5} opacity={pr(f, b1 - 2, 6)} />}
        {/* lo que se espera: giro al alza */}
        <Trazo d="M470 990 C 560 990, 640 820, 760 640" p={espera} color={ORO} grosor={8} guion op={1 - 0.6 * tacha} />
        {espera > 0.95 && <path d="M760 640 l-46 6 M760 640 l-4 46" stroke={ORO} strokeWidth={8} strokeLinecap="round" opacity={1 - 0.6 * tacha} />}
        {tacha > 0 && <path d={`M640 700 L${640 + 140 * tacha} ${700 + 140 * tacha} M780 700 L${780 - 140 * tacha} ${700 + 140 * tacha}`} stroke={ROJO} strokeWidth={14} strokeLinecap="round" />}
        {/* lo que pasó: siguió cayendo */}
        <Trazo d="M470 1000 C 560 1040, 650 1160, 780 1290" p={real} color={CREMA} grosor={9} />
        {real > 0.95 && <path d="M780 1290 l-8 -46 M780 1290 l-46 -4" stroke={CREMA} strokeWidth={9} strokeLinecap="round" />}
      </svg>
      <div style={{ position: "absolute", left: 600, top: 520, fontFamily: PRO, fontSize: 38, color: ORO, opacity: pr(f, b0 + 6, 8) * (1 - 0.6 * tacha) }}>¿GIRO?</div>
      <Bulkowski x={250} y={1100} esc={0.95} desde={fuente - 4} gafas={fuente + 14} senala={b2 - 2} />
      {f >= fuente - 2 && (
        <div style={{ position: "absolute", left: 90, top: 1640, transform: `scale(${sp(f, fuente - 2)})`, transformOrigin: "0 50%", fontFamily: PRO, fontSize: 32, color: CREMA, opacity: 0.85 }}>
          Thomas Bulkowski · Encyclopedia of Candlestick Charts
          <div style={{ fontSize: 26, opacity: 0.7, marginTop: 6 }}>Doji estrella alcista · thepatternsite.com</div>
        </div>
      )}
      {f >= b2 - 4 && (
        <div style={{ position: "absolute", left: 600, top: 1210, transform: `scale(${sp(f, b2 - 4, REBOTE)})`, transformOrigin: "0 50%" }}>
          <div style={{ display: "inline-block", transform: `scale(${latido(f, b2 + 30, 0.1, 12)})`, transformOrigin: "0 50%" }}><Cuenta desde={b2 - 4} de={0} a={64} sufijo=" %" tam={150} color={ORO} /></div>
          <div style={{ fontFamily: SECUND, fontSize: 44, color: CREMA, marginTop: -10 }}>siguió cayendo</div>
          {f >= b2 + 18 && <div style={{ fontFamily: PRO, fontSize: 34, color: ORO, marginTop: 14, opacity: pr(f, b2 + 18, 8), transform: `translateX(${(1 - pr(f, b2 + 18, 10)) * 40}px)` }}>solo el 36 % giró</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5-11 · el oro real en el monitor

const MARCO: Marco = { x0: 110, x1: 975, y0: 360, y1: 830 };

/**
 * Gráfico de papel del oro con una ventana de fechas. Con zoom > 1 la cámara se acerca a las velas `foco`:
 * el marco crece alrededor de ellas (las velas se ensanchan y los textos siguen nítidos y del mismo tamaño).
 */
const usaVentana = (desde: string, hasta: string, zoom = 1, foco: string[] = []) => {
  const a = idx(desde),
    z = idx(hasta);
  const velas = continua(XAU).slice(a, z + 1) as VelaFecha[];
  const k = (fecha: string) => idx(fecha) - a;
  const g0 = geometria(velas, MARCO, 20);
  const fs = foco.map(k);
  const ox = fs.length ? fs.reduce((m, j) => m + g0.xVela(j), 0) / fs.length : 540;
  const oy = fs.length ? (g0.yPrecio(Math.max(...fs.map((j) => velas[j].h))) + g0.yPrecio(Math.min(...fs.map((j) => velas[j].l)))) / 2 : 600;
  // mientras se acerca, el foco viaja al centro del panel (si no, el setup se sale por el borde)
  const t = Math.min(1, Math.max(0, (zoom - 1) / 0.7));
  const cx = ox + ((MARCO.x0 + MARCO.x1 - g0.anchoEje) / 2 - ox) * t,
    cy = oy + ((MARCO.y0 + MARCO.y1) / 2 - 10 - oy) * t;
  const marco: Marco = { x0: cx + (MARCO.x0 - ox) * zoom, x1: cx + (MARCO.x1 - ox) * zoom, y0: cy + (MARCO.y0 - oy) * zoom, y1: cy + (MARCO.y1 - oy) * zoom };
  const g = geometria(velas, marco, 20);
  return { velas, g, k, marco };
};

const Cabecera: React.FC<{ v: VelaFecha }> = ({ v }) => (
  <div style={{ position: "absolute", left: MARCO.x0, top: MARCO.y0 - 52, fontFamily: F.texto, fontSize: 19, color: "#8A8A8A", whiteSpace: "nowrap" }}>
    Oro / Dólar · 1D · OANDA <span style={{ color: TINTA, fontWeight: 700 }}>&nbsp;O {numeroES(v.o, 1)} &nbsp;H {numeroES(v.h, 1)} &nbsp;L {numeroES(v.l, 1)} &nbsp;C {numeroES(v.c, 1)}</span>
  </div>
);

const Fondo: React.FC = () => <div style={{ position: "absolute", left: MARCO.x0 - 20, top: MARCO.y0 - 70, width: MARCO.x1 - MARCO.x0 + 40, height: MARCO.y1 - MARCO.y0 + 120, background: "#DBDBDB", borderRadius: 6 }} />;

/** Línea horizontal de nivel con etiqueta de precio a la derecha. */
const Nivel: React.FC<{ y: number; x0: number; p: number; color: string; texto: string; guion?: boolean }> = ({ y, x0, p, color, texto, guion = true }) => (
  <>
    <line x1={x0} x2={x0 + (MARCO.x1 - 100 - x0) * p} y1={y} y2={y} stroke={color} strokeWidth={3} strokeDasharray={guion ? "10 7" : undefined} />
    {p > 0.9 && (
      <g>
        <rect x={MARCO.x1 - 112} y={y - 15} width={104} height={30} rx={5} fill={color} />
        <text x={MARCO.x1 - 60} y={y + 7} textAnchor="middle" fontFamily={F.texto} fontWeight={800} fontSize={18} fill="#fff">
          {texto}
        </text>
      </g>
    )}
  </>
);

const Rotulo: React.FC<{ x: number; y: number; desde: number; children: React.ReactNode; color?: string; tam?: number }> = ({ x, y, desde, children, color = TINTA, tam = 30 }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${sp(f, desde, REBOTE)})`, fontFamily: principalPara(String(children)), fontSize: tam, color, whiteSpace: "nowrap", textShadow: "0 0 12px rgba(219,219,219,0.9)" }}>
      {children}
    </div>
  );
};

const Oro: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const modo = txt(p, "modo", "entra");
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  // cámara: primero el gráfico real completo; luego se acerca al setup frase a frase (sin saltos entre escenas)
  const CAM: Record<string, [number, number]> = { entra: [1, 1], rango: [1, 1.8], barre: [1.8, 2.1], cierre: [2.1, 2.2], sube: [2.2, 2.2] };
  const [z0, z1] = CAM[modo] ?? [1, 1];
  const zoom = z0 + (z1 - z0) * pr(f, 0, Math.max(20, dur - 4), Easing.inOut(Easing.cubic));
  const { velas, g, k, marco } = usaVentana("13 may", "15 jun", zoom, ["10 jun", "11 jun", "12 jun", "15 jun"]);
  const n = velas.length;
  const c1 = k("10 jun"),
    c2 = k("11 jun"),
    ind = k("12 jun"),
    c3 = k("15 jun");
  // los niveles se marcan con los precios reales de TradingView (continua() solo ajusta el dibujo)
  const V1 = XAU[idx("10 jun")],
    V2 = XAU[idx("11 jun")];
  const orden = ["entra", "rango", "barre", "cierre", "sube"].indexOf(modo);
  const ya = (m: number) => orden > m; // la marca de un paso anterior ya está puesta
  // qué velas se ven: hasta C1 al principio, C2 desde "barre", el resto en "sube"
  const ultima = orden < 2 ? c1 : orden < 4 ? c2 : n - 1;
  const entra = (j: number) => {
    if (j > ultima) return 1e9;
    if (modo === "entra") return b0 - 10 + j * 2;
    if (modo === "barre" && j === c2) return b0 - 2;
    if (modo === "sube" && j > c2) return (j === ind ? b0 - 6 : b1 - 4) + (j - ind) * 2;
    return -60;
  };
  const foco = (j: number) => (orden === 0 ? 1 : j === c1 || j === c2 || (orden === 4 && j > c2) ? 1 : 0.45);
  const x1 = g.xVela(c1) - g.hueco * 0.45;
  const yH = g.yPrecio(V1.h),
    yL = g.yPrecio(V1.l);
  const rect = modo === "rango" ? pr(f, b0, 14) : ya(1) ? 1 : 0;
  const vh = velas[Math.min(ultima, n - 1)];
  // C2: el barrido (mecha bajo el mínimo) y el cierre de vuelta dentro
  const xC2 = g.xVela(c2),
    yMin2 = g.yPrecio(V2.l),
    yC2 = g.yPrecio(V2.c);
  const flash = modo === "barre" ? interpolate(f, [b1 - 2, b1 + 2, b1 + 14], [0, 1, 0], cl) : 0;
  return (
    <>
    <Escritorio dur={dur} cabecera="XAUUSD · ORO AL CONTADO · DIARIO" foco={[[0, 540], [b1, g.xVela(c1)], [b2, xC2]]} asiente={[b1, b2]}>
      <AbsoluteFill style={{ clipPath: `inset(${MARCO.y0 - 70}px ${1080 - MARCO.x1 - 20}px ${1920 - MARCO.y1 - 50}px ${MARCO.x0 - 20}px)` }}>
        <Fondo />
        <Cabecera v={vh} />
        <GraficoVelas velas={velas} marco={marco} entra={entra} forma={6} letra={20} tema={PAPEL} vivo={false} volumen={false} opacidad={foco} fechas={velas.map((v, j) => (zoom > 1.6 || j % 3 === 0 || j === c1 || j === c2 ? v.fecha : ""))} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {/* rango de C1 */}
          {rect > 0 && <rect x={x1} y={yH} width={(MARCO.x1 - 110 - x1) * rect} height={yL - yH} fill={alfa(ORO, modo === "rango" ? 0.16 + 0.4 * (latido(f, b2 + 10, 1, 14) - 1) + 0.4 * (latido(f, b2 + 28, 1, 14) - 1) : 0.16)} stroke={ORO} strokeWidth={3} />}
          {(modo === "rango" || ya(1)) && (
            <>
              <Nivel y={yH} x0={x1} p={modo === "rango" ? pr(f, b1 - 2, 10) : 1} color="#9C7A45" texto={numeroES(V1.h, 1)} guion={false} />
              <Nivel y={yL} x0={x1} p={modo === "rango" ? pr(f, b2 - 2, 10) : 1} color="#9C7A45" texto={numeroES(V1.l, 1)} guion={false} />
            </>
          )}
          {/* barrido: los stops bajo el mínimo saltan */}
          {orden >= 2 &&
            [0, 1, 2, 3, 4].map((s) => {
              const xs = xC2 - 40 + s * 20,
                ys = yL + 14 + (s % 2) * 10;
              const cae = modo === "barre" ? pr(f, b2 - 4 + s, 6) : 1;
              return (
                <g key={s} opacity={1 - cae}>
                  <path d={`M${xs - 6} ${ys - 6} l12 12 m0 -12 l-12 12`} stroke={ROJO} strokeWidth={3} />
                </g>
              );
            })}
          {orden >= 2 && <circle cx={xC2} cy={yMin2} r={10 + 50 * flash} fill="none" stroke={ROJO} strokeWidth={4} opacity={modo === "barre" ? pr(f, b1 - 2, 4) * (1 - 0.5 * flash) : 0.8} />}
          {/* cierre dentro del rango */}
          {orden >= 3 && (
            <>
              <circle cx={xC2} cy={yC2} r={modo === "cierre" ? 12 + 6 * Math.sin(Math.max(0, f - b2) / 3) * pr(f, b2, 4) : 12} fill={ORO} stroke={TINTA} strokeWidth={3} opacity={modo === "cierre" ? pr(f, b0, 6) : 1} />
              <Trazo d={`M${xC2 + 26} ${yMin2} C ${xC2 + 70} ${yMin2}, ${xC2 + 70} ${yC2 + 20}, ${xC2 + 26} ${yC2 + 6}`} p={modo === "cierre" ? pr(f, b0 - 4, 14) : 1} color={ORO} grosor={5} />
            </>
          )}
          {/* después: indecisión y el precio llega al otro lado del rango */}
          {orden >= 4 && (
            <>
              <circle cx={g.xVela(ind)} cy={g.yPrecio(velas[ind].c)} r={34} fill="none" stroke={TINTA} strokeWidth={3} strokeDasharray="6 5" opacity={pr(f, b0, 8)} />
              <Trazo d={`M${g.xVela(ind)} ${g.yPrecio(velas[ind].c)} L${g.xVela(c3)} ${yH - 4}`} p={pr(f, b1, 14)} color={ORO} grosor={6} />
              {f >= b2 - 2 && <circle cx={g.xVela(c3)} cy={yH} r={12 + 30 * pr(f, b2 - 2, 12)} fill="none" stroke={ORO} strokeWidth={4} opacity={1 - 0.6 * pr(f, b2 - 2, 12)} />}
            </>
          )}
        </svg>
        {modo === "entra" && <Rotulo x={560} y={420} desde={b2 - 2} tam={44}>1D · DIARIO</Rotulo>}
        {modo === "entra" && <Rotulo x={300} y={760} desde={b1 - 2} tam={40} color="#7A5C2E">JUNIO 2026</Rotulo>}
        {modo === "entra" && f >= b1 + 8 && f <= b1 + 30 && (
          <div style={{ position: "absolute", top: MARCO.y0 - 60, height: MARCO.y1 - MARCO.y0 + 100, left: MARCO.x0 - 160 + (MARCO.x1 - MARCO.x0 + 200) * pr(f, b1 + 8, 22, Easing.inOut(Easing.cubic)), width: 140, background: `linear-gradient(90deg, transparent, ${alfa(ORO, 0.55)}, transparent)` }} />
        )}
        {modo === "rango" && <Rotulo x={(x1 + MARCO.x1 - 110) / 2} y={yH - 34} desde={b0 + 4} tam={34} color="#7A5C2E">RANGO · 10 JUN</Rotulo>}
        {orden >= 2 && <Rotulo x={xC2} y={yMin2 + 44} desde={modo === "barre" ? b1 : -99} tam={30} color={ROJO}>BARRIDO {numeroES(V2.l, 1)}</Rotulo>}
        {modo === "barre" && <Rotulo x={xC2 - 130} y={yL + 24} desde={b2} tam={30} color={ROJO}>STOPS</Rotulo>}
        {orden === 3 && <Rotulo x={xC2 + 10} y={yH + 34} desde={modo === "cierre" ? b1 : -99} tam={30} color="#7A5C2E">CIERRE DENTRO</Rotulo>}
        {orden >= 4 && <Rotulo x={g.xVela(ind)} y={g.yPrecio(velas[ind].l) + 40} desde={b0 + 2} tam={26}>indecisión</Rotulo>}
        
      </AbsoluteFill>
    </Escritorio>
    {modo === "rango" && f >= b2 + 10 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b2 + 10, REBOTE)})` }}>
        <span style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>rango de </span>
        <span style={{ display: "inline-block", transform: `scale(${latido(f, b2 + 36, 0.18, 12)})` }}><Cuenta desde={b2 + 10} de={0} a={V1.h - V1.l} sufijo=" $" tam={78} color={ORO} /></span>
        {f >= b2 + 46 && <div style={{ fontFamily: PRO, fontSize: 36, color: CREMA, marginTop: 8, opacity: pr(f, b2 + 46, 8), transform: `translateY(${(1 - pr(f, b2 + 46, 10)) * 30}px)` }}>1,8 veces su ATR de 14 días</div>}
      </div>
    )}
    {modo === "sube" && f >= b2 - 2 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b2 - 2, REBOTE)})` }}>
        <span style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>objetivo </span>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 78, color: ORO }}>{numeroES(V1.h, 1)} ✓</span>
      </div>
    )}
    {modo === "cierre" && f >= b2 - 2 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b2 - 2, REBOTE)})` }}>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 78, color: ORO }}>LO QUE IMPORTA</span>
      </div>
    )}
    </>
  );
};

// ---------------------------------------------------------------- 10-11 · contraejemplo: doji perfecto en mayo

const Mayo: React.FC<PropsEscena> = ({ p, b, dur }) => {
  const f = useCurrentFrame();
  const rompe = txt(p, "modo") === "rompe";
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const zoom = rompe ? 1.7 : 1 + 0.7 * pr(f, 0, Math.max(20, dur - 4), Easing.inOut(Easing.cubic));
  const { velas, g, k, marco } = usaVentana("13 may", "28 may", zoom, ["19 may", "20 may", "21 may", "22 may", "25 may", "26 may", "27 may"]);
  const c1 = k("19 may"),
    c2 = k("20 may"),
    dj = k("21 may"),
    rot = k("27 may");
  const V1 = velas[c1],
    V2 = velas[c2];
  const ultima = rompe ? rot : dj;
  const entra = (j: number) => (j > ultima ? 1e9 : rompe && j > dj ? b0 - 14 + (j - dj) * 3 : -60);
  const x1 = g.xVela(c1) - g.hueco * 0.45;
  const yH = g.yPrecio(V1.h),
    yL = g.yPrecio(V1.l),
    yInv = g.yPrecio(V2.l);
  const xD = g.xVela(dj),
    yD = g.yPrecio(velas[dj].c);
  const t = rompe ? temblor(f, b0 + 2, 10, 10) : { x: 0, y: 0 };
  const x = pr(f, b1 - 4, 8);
  const checks = ["barrido", "cierre dentro", "doji"];
  return (
    <>
    <Escritorio dur={dur} cabecera="XAUUSD · ORO AL CONTADO · DIARIO" foco={[[0, xD], [b1, xD]]} asiente={[b1]}>
      <AbsoluteFill style={{ transform: `translate(${t.x}px, ${t.y}px)`, clipPath: `inset(${MARCO.y0 - 70}px ${1080 - MARCO.x1 - 20}px ${1920 - MARCO.y1 - 50}px ${MARCO.x0 - 20}px)` }}>
        <Fondo />
        <Cabecera v={velas[ultima]} />
        <GraficoVelas velas={velas} marco={marco} entra={entra} forma={5} letra={20} tema={PAPEL} vivo={false} volumen={false} opacidad={(j) => (j < c1 ? 0.45 : 1)} fechas={velas.map((v) => v.fecha)} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <rect x={x1} y={yH} width={MARCO.x1 - 110 - x1} height={yL - yH} fill={alfa(ORO, 0.14)} stroke={ORO} strokeWidth={3} />
          <Nivel y={yInv} x0={x1} p={1} color={ROJO} texto={numeroES(V2.l, 0)} />
          {!rompe && <circle cx={xD} cy={yD} r={30 + 4 * Math.sin(f / 4)} fill="none" stroke={ORO} strokeWidth={5} opacity={pr(f, b1 - 4, 8)} />}
          {rompe && <circle cx={g.xVela(rot)} cy={g.yPrecio(velas[rot].l)} r={14 + 40 * pr(f, b0, 12)} fill="none" stroke={ROJO} strokeWidth={5} opacity={1 - 0.7 * pr(f, b0, 12)} />}
          {rompe && x > 0 && <path d={`M${xD - 60} ${yD - 60} l${120 * x} ${120 * x} M${xD + 60} ${yD - 60} l${-120 * x} ${120 * x}`} stroke={ROJO} strokeWidth={14} strokeLinecap="round" />}
        </svg>
        {!rompe && <Rotulo x={xD + 10} y={yD - 70} desde={b1 - 2} tam={32} color="#7A5C2E">DOJI PERFECTO · 1 %</Rotulo>}
        {rompe && <Rotulo x={g.xVela(rot) - 30} y={g.yPrecio(velas[rot].l) + 46} desde={b0 + 2} tam={30} color={ROJO}>ROTO · 27 MAY</Rotulo>}
      </AbsoluteFill>
    </Escritorio>
      {!rompe && (
        <div style={{ position: "absolute", left: 120, top: 1250 }}>
          {checks.map((c, i) => (
            <div key={c} style={{ fontFamily: PRO, fontSize: 40, color: CREMA, opacity: pr(f, b2 - 6 + i * 5, 6), transform: `translateX(${(1 - pr(f, b2 - 6 + i * 5, 8)) * -40}px)`, marginBottom: 10 }}>
              <span style={{ color: ORO }}>✓</span> {c}
            </div>
          ))}
        </div>
      )}
      {rompe && f >= b1 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b1 - 2, REBOTE)}) rotate(-4deg)` }}>
          <span style={{ fontFamily: PRINCIPAL, fontSize: 88, color: ROJO, border: `8px solid ${ROJO}`, borderRadius: 16, padding: "4px 28px", background: "rgba(0,0,0,0.6)" }}>NO BASTA</span>
          {f >= b2 - 2 && (
            <div style={{ marginTop: 28, transform: `rotate(4deg) scale(${sp(f, b2 - 2, REBOTE)})` }}>
              <span style={{ fontFamily: SECUND, fontSize: 44, color: CREMA }}>necesita </span>
              <span style={{ fontFamily: PRINCIPAL, fontSize: 60, color: ORO }}>ZONA CLAVE</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 12 · porcentajes de Bulkowski

const Porcentajes: React.FC<PropsEscena> = ({ b, palabras }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const filas = [
    { nombre: "MARTILLO", v: 60, desde: b0 },
    { nombre: "ENVOLVENTE", v: 63, desde: b1 },
  ];
  const X0 = 140,
    W = 800;
  const moneda = sp(f, b2 - 4, REBOTE);
  const fuente = enPalabra(palabras, "bulkowski", 0),
    velas = enPalabra(palabras, "velas", 12),
    w63 = enPalabra(palabras, "63", b1 + 30);
  return (
    <AbsoluteFill>
      {filas.map((r, i) => {
        const y = 560 + i * 300;
        const k = pr(f, r.desde - 2, 18, Easing.out(Easing.cubic));
        if (f < r.desde - 4) return null;
        return (
          <div key={r.nombre} style={{ position: "absolute", left: X0, top: y, width: W, opacity: pr(f, r.desde - 4, 6), transform: `translateX(${(1 - pr(f, r.desde - 4, 16, Easing.out(Easing.exp))) * 420}px)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: SECUND, fontSize: 50, color: CREMA }}>{r.nombre}</span>
              <span style={{ display: "inline-block", transform: `scale(${latido(f, i ? w63 : r.desde + 14, 0.2, 12)})` }}><Cuenta desde={r.desde - 2} de={0} a={r.v} sufijo=" %" tam={96} color={ORO} /></span>
            </div>
            <div style={{ position: "relative", height: 34, borderRadius: 17, background: alfa(CREMA, 0.12), marginTop: 10 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${r.v * k}%`, borderRadius: 17, background: ORO }} />
              <div style={{ position: "absolute", left: "50%", top: -14, bottom: -14, width: 4, background: CREMA, opacity: 0.8 }} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: X0 + W / 2 - 60, top: 1170, fontFamily: PRO, fontSize: 30, color: CREMA, opacity: 0.8 * pr(f, b0 + 22, 8), transform: `scale(${latido(f, b0 + 22, 0.25, 14)})` }}>50 % = azar</div>
      {f >= w63 + 14 && <div style={{ position: "absolute", left: 0, right: 0, top: 1220, textAlign: "center", fontFamily: PRO, fontSize: 36, color: ORO, opacity: pr(f, w63 + 14, 8), transform: `translateY(${(1 - pr(f, w63 + 14, 10)) * 30}px)` }}>solo 10-13 puntos más que el azar</div>}
      {/* al decir «velas», tres velas pequeñas; luego cada fila lleva su icono */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {[0, 1, 2].map((i) => {
          const e = sp(f, velas - 4 + i * 4, REBOTE);
          if (e <= 0 || f > b0 + 10) return null;
          return <g key={i} opacity={Math.min(1, e) * (1 - pr(f, b0 + 2, 8))} transform={`translate(${380 + i * 160} ${(1 - e) * 120})`}><VelaG x={0} y={300} alto={200} ancho={50} v={[MARTILLO, DOJI, ENVUELVE][i]} /></g>;
        })}
        {f >= b0 + 16 && <g opacity={pr(f, b0 + 16, 8)} transform={`translate(${X0 + W + 20} ${600}) scale(${sp(f, b0 + 16, REBOTE) * latido(f, b0 + 28, 0.3, 12)})`}><VelaG x={0} y={-40} alto={150} ancho={40} v={MARTILLO} color={ORO} /></g>}
        {f >= b1 + 12 && <g opacity={pr(f, b1 + 12, 8)} transform={`translate(${X0 + W + 20} ${900}) scale(${sp(f, b1 + 12, REBOTE)})`}><VelaG x={-14} y={-40} alto={150} ancho={26} v={PREVIA} color={ORO} /><VelaG x={16} y={-40} alto={150} ancho={30} v={ENVUELVE} color={ORO} /></g>}
      </svg>
      {f >= fuente && f < b0 + 10 && <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: PRO, fontSize: 40, color: CREMA, opacity: pr(f, fuente, 8) * (1 - pr(f, b0 + 2, 8)) }}>Thomas Bulkowski · pruebas históricas</div>}
      {f < b0 + 16 && <Bulkowski x={540 - 760 * pr(f, b0 - 4, 16, Easing.in(Easing.cubic))} y={760} esc={1.15} desde={fuente - 2} gafas={velas - 6} senala={velas + 4} />}
      {moneda > 0 && (
        <div style={{ position: "absolute", left: 540 - 110, top: 1290, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #F0D59A, ${ORO} 60%, #8C6A36)`, transform: `scale(${moneda}) scaleX(${Math.cos((f - b2) * 0.35)})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PRINCIPAL, fontSize: 64, color: "#3A2A12", boxShadow: `0 0 60px ${alfa(ORO, 0.4)}` }}>
          {Math.cos((f - b2) * 0.35) > 0 ? "50/50" : ""}
        </div>
      )}
      <div style={{ position: "absolute", left: X0, top: 1640, fontFamily: PRO, fontSize: 26, color: CREMA, opacity: 0.7 * pr(f, b0, 8) }}>Fuente: Bulkowski · thepatternsite.com (giro en la dirección esperada)</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 13 · capas del análisis

const Capas: React.FC<PropsEscena> = ({ b, palabras }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 15, b2 = 30, b3 = 45] = b;
  const capas = [
    { t: "ZONA CLAVE", desde: b1 + 6 },
    { t: "CRT", desde: b1 + 12 },
    { t: "AMD", desde: b2 },
    { t: "SMC", desde: b3 },
  ];
  const BASE = 1260,
    H = 150;
  return (
    <AbsoluteFill>
      {f >= b0 - 2 && f < b1 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", transform: `scale(${sp(f, b0 - 2, REBOTE)})` }}>
          <span style={{ fontFamily: SECUND, fontSize: 76, color: CREMA }}>{"esto tiene nombre…".slice(0, Math.round(18 * pr(f, b0 - 2, 14, Easing.linear)))}</span>
          <div style={{ height: 10, background: ORO, borderRadius: 5, margin: "14px auto 0", width: 700 * pr(f, b0, 16, Easing.inOut(Easing.cubic)) }} />
        </div>
      )}
      {f >= b1 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", transform: `scale(${sp(f, b1 - 2, REBOTE)})` }}>
          <div style={{ fontFamily: PRINCIPAL, fontSize: 150, color: ORO, lineHeight: 1 }}>CRT</div>
          <div style={{ fontFamily: PRO, fontSize: 38, letterSpacing: 2, marginTop: 14, opacity: pr(f, b1 + 4, 10), display: "flex", justifyContent: "center", gap: 18 }}>
            {[["RANGO", "rango"], ["BARRIDO", "barrido"], ["CIERRE DENTRO", "cierre"]].map(([t, w]) => {
              const a = enPalabra(palabras, w, b1 + 20);
              const on = pr(f, a - 2, 6);
              return (
                <span key={t} style={{ color: on > 0.5 ? "#16120E" : CREMA, background: alfa(ORO, on), borderRadius: 8, padding: "2px 10px", transform: `scale(${latido(f, a - 2, 0.25, 10)})`, display: "inline-block" }}>{t}</span>
              );
            })}
          </div>
        </div>
      )}
      {capas.map((c, i) => {
        const k = sp(f, c.desde - 4, REBOTE);
        if (k <= 0) return null;
        const y = BASE - i * (H - 30) - (1 - k) * 220;
        return (
          <div key={c.t} style={{ position: "absolute", left: 180, width: 720, top: y, height: H, opacity: Math.min(1, k) }}>
            <div style={{ position: "absolute", inset: 0, transform: "perspective(900px) rotateX(58deg)", background: `linear-gradient(180deg, ${alfa(ORO, 0.55 - i * 0.08)}, ${alfa(ORO, 0.2)})`, border: `3px solid ${ORO}`, borderRadius: 18, boxShadow: `0 20px 40px rgba(0,0,0,0.5)` }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PRO, fontSize: 44, color: CREMA, letterSpacing: 4 }}>{c.t}</div>
          </div>
        );
      })}
      {/* la vela, pequeña, encima de todo: es la firma, no la base */}
      {f >= b3 + 8 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: pr(f, b3 + 8, 8) }}>
          <g transform={`translate(0 ${(1 - sp(f, b3 + 8, REBOTE)) * -200})`}>
            <VelaG x={540} y={700} alto={200} ancho={60} v={DOJI} color={ORO} />
          </g>
        </svg>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 14 · la firma y el próximo vídeo

const Firma: React.FC<PropsEscena> = ({ b, dur, palabras }) => {
  const f = useCurrentFrame();
  const [b0 = 0, b1 = 20, b2 = 40] = b;
  const firma = pr(f, b0 - 6, 22, Easing.inOut(Easing.cubic));
  const wCrt = enPalabra(palabras, "crt", b1 + 20),
    wPaso = enPalabra(palabras, "paso", b2);
  return (
    <>
    <Escritorio dur={dur} apagaEn={dur - TRANSICION} cabecera="PRÓXIMO VÍDEO" cursor={[[0, 420, 760], [b0 + 4, 320, 700], [b1 - 6, 700, 520], [b1 + 10, 760, 470]]} clics={[wCrt]} asiente={[b0, b1]}>
      <Chispas desde={b0 + 16} x={300} y={490} n={12} r={160} color={ORO} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <VelaG x={300} y={340} alto={300} ancho={80} v={DOJI} color={CREMA} />
        <Trazo d="M140 700 C 190 630, 240 740, 280 680 S 350 640, 390 700 S 450 660, 500 690" p={firma} color={ORO} grosor={7} />
      </svg>
      {f >= b1 - 2 && (
        <div style={{ position: "absolute", left: 580, top: 400, width: 360, transform: `scale(${sp(f, b1 - 2, REBOTE) * latido(f, wCrt, 0.12, 10)}) rotate(-3deg)`, background: CREMA, borderRadius: 18, padding: 26, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: "#9C7A45" }}>PARTE 2</div>
          <div style={{ fontFamily: PRINCIPAL, fontSize: 84, color: "#16120E", lineHeight: 1 }}>CRT</div>
          <div style={{ fontFamily: SECUND, fontSize: 34, color: "#16120E", opacity: pr(f, b2 - 2, 8) }}>paso a paso</div>
        </div>
      )}
    </Escritorio>
    {/* abajo, como en las otras escenas: primero la firma, luego el próximo vídeo */}
    {f >= b0 && f < b1 + 2 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b0, REBOTE)})`, opacity: 1 - pr(f, b1 - 4, 6) }}>
        <span style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>la vela es </span>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 84, color: ORO }}>LA FIRMA</span>
      </div>
    )}
    {f >= b1 + 2 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", transform: `scale(${sp(f, b1 + 2, REBOTE)})` }}>
        <span style={{ fontFamily: SECUND, fontSize: 52, color: CREMA }}>parte 2 → </span>
        <span style={{ fontFamily: PRINCIPAL, fontSize: 84, color: ORO, display: "inline-block", transform: `scale(${latido(f, wCrt, 0.25, 12)})` }}>CRT</span>
        {f >= wPaso - 2 && <div style={{ fontFamily: SECUND, fontSize: 56, color: CREMA, opacity: pr(f, wPaso - 2, 6), transform: `translateY(${(1 - pr(f, wPaso - 2, 10)) * 40}px)` }}>paso a paso</div>}
      </div>
    )}
    <Chispas desde={wPaso + 8} x={540} y={1330} n={20} r={380} color={ORO} />
    <Chispas desde={wPaso + 20} x={300} y={500} n={14} r={260} color={CREMA} />
    </>
  );
};

export const tres: DefEscena = { C: Tres, momentos: 3, alInicio: () => true, sonidos: () => [[2, "pop", 0.3]] };
export const dojiZoom: DefEscena = { C: DojiZoom, momentos: 4, alInicio: () => true, sonidos: (p) => (txt(p, "modo") === "duda" ? [[2, "golpe", 0.25]] : [[1, "tic", 0.3], [2, "tic", 0.3]]) };
export const dato: DefEscena = { C: Dato, momentos: 3, alInicio: () => true, sonidos: () => [[2, "ding", 0.25]] };
export const oro: DefEscena = {
  C: Oro,
  momentos: 3,
  alInicio: () => true,
  sonidos: (p) => {
    const m = txt(p, "modo");
    return m === "rango" ? [[0, "tic", 0.3]] : m === "barre" ? [[1, "zip", 0.3]] : m === "cierre" ? [[2, "ding", 0.25]] : m === "sube" ? [[1, "subida", 0.25]] : [];
  },
};
export const mayo: DefEscena = { C: Mayo, momentos: 3, alInicio: () => true, sonidos: (p) => (txt(p, "modo") === "rompe" ? [[0, "negacion", 0.3], [1, "sello", 0.35]] : [[1, "tic", 0.3]]) };
export const porcentajes: DefEscena = { C: Porcentajes, momentos: 3, alInicio: () => true, sonidos: () => [[0, "tic", 0.3], [1, "tic", 0.3], [2, "monedas", 0.3]] };
export const capas: DefEscena = { C: Capas, momentos: 4, alInicio: () => true, sonidos: () => [[1, "papel", 0.25], [2, "papel", 0.25], [3, "papel", 0.25]] };
export const firma: DefEscena = { C: Firma, momentos: 3, alInicio: () => true, sonidos: () => [[0, "pincel", 0.35], [1, "campana", 0.25]] };
