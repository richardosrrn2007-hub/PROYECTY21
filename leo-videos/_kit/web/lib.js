// Utilidades de animación: todo es función pura del tiempo t (segundos).
const NS = "http://www.w3.org/2000/svg";
const C = {
  bg: "#07080C", bg2: "#0E1117", card: "#12161D", stroke: "#262C36", white: "#F5F5F2",
  grey: "#8B919C", dim: "#4A505B", em: "#2FD39A", em2: "#1FA97A", emDark: "#0B2A20",
  gold: "#E9B53C", red: "#F0645A", cream: "#F3EFE6", ink: "#111317",
};

function el(tag, attrs = {}, parent = null, text = null) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const E = {
  lin: (k) => k,
  out: (k) => 1 - Math.pow(1 - k, 3),
  in: (k) => k * k * k,
  inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  back: (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
  backBig: (k) => { const c1 = 2.6, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
  elastic: (k) => (k === 0 || k === 1 ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
  expo: (k) => (k === 1 ? 1 : 1 - Math.pow(2, -10 * k)),
};
// Progreso 0..1 de un tramo [t0, t0+d] con easing
function P(t, t0, d, ease = E.out) { return ease(clamp((t - t0) / d)); }
// Valor animado de a->b
function tw(t, t0, d, a, b, ease = E.out) { return lerp(a, b, P(t, t0, d, ease)); }
// Visibilidad con entrada/salida: 0..1
function win(t, t0, t1, din = 0.3, dout = 0.3) {
  if (t < t0 || t > t1) return 0;
  return Math.min(clamp((t - t0) / din), clamp((t1 - t) / dout));
}
// Interpola por keyframes [[t, valor], ...]
function kf(t, keys, ease = E.inOut) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t <= t1) {
      const k = ease((t - t0) / (t1 - t0));
      if (typeof v0 === "object") { const o = {}; for (const key in v0) o[key] = lerp(v0[key], v1[key] ?? v0[key], k); return o; }
      return lerp(v0, v1, k);
    }
  }
  return keys[keys.length - 1][1];
}
function setT(e, x, y, s = 1, r = 0, sy = null) {
  e.setAttribute("transform", `translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${r.toFixed(2)}) scale(${s.toFixed(4)},${(sy ?? s).toFixed(4)})`);
}
function op(e, v) { e.setAttribute("opacity", clamp(v).toFixed(3)); e.style.display = v <= 0.001 ? "none" : ""; }
// Ruido suave determinista
function noise(t, seed = 0) { return Math.sin(t * 1.7 + seed) * 0.5 + Math.sin(t * 2.9 + seed * 1.3) * 0.3 + Math.sin(t * 5.3 + seed * 2.1) * 0.2; }
