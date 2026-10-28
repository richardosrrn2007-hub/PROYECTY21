// Fondo: ciudad de velas japonesas en 3D. La cámara avanza entre dos avenidas de velas
// sobre una cuadrícula en perspectiva. Cada vela abre exactamente en el cierre de la anterior.
function createCity(parent) {
  const g = el("g", {}, parent);
  const HOR = 1080, F = 900, CAMH = 2.6, SPEED = 2.6, ZMAX = 70, YS = 1.9;
  const defs = el("defs", {}, g);
  const sky = el("linearGradient", { id: "sky", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el("stop", { offset: "0%", "stop-color": "#04050A" }, sky);
  el("stop", { offset: "52%", "stop-color": "#08130F" }, sky);
  el("stop", { offset: "56%", "stop-color": "#0C2A21" }, sky);
  el("stop", { offset: "72%", "stop-color": "#05070B" }, sky);
  el("stop", { offset: "100%", "stop-color": "#04050A" }, sky);
  el("rect", { width: 1080, height: 1920, fill: "url(#sky)" }, g);
  const hg = el("radialGradient", { id: "horGlow" }, defs);
  el("stop", { offset: "0%", "stop-color": C.em, "stop-opacity": 0.55 }, hg);
  el("stop", { offset: "100%", "stop-color": C.em, "stop-opacity": 0 }, hg);
  const horGlow = el("ellipse", { cx: 540, cy: HOR, rx: 760, ry: 150, fill: "url(#horGlow)" }, g);

  // Cuadrícula del suelo
  const gridG = el("g", {}, g);
  const vLines = [];
  for (let x = -24; x <= 24; x += 2) {
    const z0 = 1.2, z1 = ZMAX;
    vLines.push(el("line", { x1: 540 + (x * F) / z0, y1: HOR + (CAMH * F) / z0, x2: 540 + (x * F) / z1, y2: HOR + (CAMH * F) / z1, stroke: C.em, "stroke-width": 2, opacity: 0.22 }, gridG));
  }
  const hLines = [];
  for (let i = 0; i < 34; i++) hLines.push(el("line", { x1: 0, x2: 1080, stroke: C.em, "stroke-width": 2 }, gridG));

  // Series de precios por avenida (continuas)
  const lanes = [-2.6, 2.6, -6.2, 6.2].map((x, li) => {
    let seed = 31 + li * 17; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const cs = []; let close = 3.5 + li * 0.6;
    for (let k = 0; k < 420; k++) {
      const open = close;
      const drift = (5.0 - open) * 0.12 + (Math.sin(k / 9 + li) * 0.35);
      const d = drift + (rnd() - 0.5) * 2.0;
      close = Math.max(1.2, Math.min(9.5, open + d));
      const hi = Math.max(open, close) + 0.15 + rnd() * 0.6, lo = Math.min(open, close) - 0.15 - rnd() * 0.6;
      cs.push({ open, close, hi, lo });
    }
    return { x, cs, sp: li < 2 ? 1.5 : 1.9, off: li * 0.45, w: li < 2 ? 0.5 : 0.75 };
  });
  const candleG = el("g", {}, g);
  const pool = [];
  for (let i = 0; i < 200; i++) {
    const n = el("g", {}, candleG);
    pool.push({ n, side: el("polygon", {}, n), wick: el("line", { "stroke-linecap": "round" }, n), body: el("rect", {}, n), cap: el("polygon", {}, n) });
  }
  const fog = el("rect", { width: 1080, height: 1920, fill: "#05060A", opacity: 0.45 }, g);

  function proj(x, y, z) { const p = F / z; return [540 + x * p, HOR + (CAMH - y * YS) * p, p]; }

  return {
    g,
    update(t, fx = {}) {
      const camZ = t * SPEED;
      const pulse = fx.pulse ?? 0, pump = fx.pump ?? 0;
      horGlow.setAttribute("ry", (150 + pulse * 60 + pump * 90).toFixed(1));
      horGlow.setAttribute("opacity", (0.75 + pump * 0.25).toFixed(2));
      // líneas horizontales que avanzan
      const step = 2, ph = camZ % step;
      hLines.forEach((l, i) => {
        const z = 1.2 + i * step - ph;
        const y = HOR + (CAMH * F) / z;
        l.setAttribute("y1", y.toFixed(1)); l.setAttribute("y2", y.toFixed(1));
        l.setAttribute("opacity", (0.28 * clamp(1 - z / ZMAX) * clamp((z - 1.2) / 2)).toFixed(3));
      });
      // velas visibles, de lejos a cerca
      const vis = [];
      for (const ln of lanes) {
        const k0 = Math.max(0, Math.floor((camZ + 1.5 - ln.off) / ln.sp)), k1 = Math.min(ln.cs.length - 1, Math.ceil((camZ + ZMAX - ln.off) / ln.sp));
        for (let k = k0; k <= k1; k++) vis.push({ ln, k, z: k * ln.sp + ln.off - camZ });
      }
      vis.sort((a, b) => b.z - a.z);
      pool.forEach((p, i) => {
        const v = vis[i];
        if (!v || v.z < 1.6) { p.n.style.display = "none"; return; }
        p.n.style.display = "";
        candleG.appendChild(p.n);
        const c = v.ln.cs[v.k], x = v.ln.x, w = v.ln.w / 2, z = v.z;
        const bull = c.close >= c.open;
        const mid = (c.open + c.close) / 2, amp = 1 + pulse * 0.25;
        const top = mid + (Math.max(c.open, c.close) - mid) * amp, bot = mid - (mid - Math.min(c.open, c.close)) * amp;
        const [xl, yt] = proj(x - w, top, z), [xr, yb] = proj(x + w, bot, z);
        const [xc, yh] = proj(x, c.hi, z), [, yl] = proj(x, c.lo, z);
        const dz = v.ln.w; // profundidad de la vela
        const sx = x < 0 ? x + w : x - w;
        const [sx0, st0] = proj(sx, top, z), [, sb0] = proj(sx, bot, z), [sx1, st1] = proj(sx, top, z + dz), [, sb1] = proj(sx, bot, z + dz);
        const fogK = clamp(1 - z / ZMAX) * clamp((z - 1.6) / 2.5);
        const glow = bull ? lerp(0.75, 1, pump) : 0.6;
        const colF = bull ? (pump > 0.05 ? "#5BF0BE" : C.em) : "#5D6573";
        const colS = bull ? C.em2 : "#3A414C";
        p.body.setAttribute("x", Math.min(xl, xr).toFixed(1)); p.body.setAttribute("y", yt.toFixed(1));
        p.body.setAttribute("width", Math.abs(xr - xl).toFixed(1)); p.body.setAttribute("height", Math.max(1, yb - yt).toFixed(1));
        p.body.setAttribute("fill", colF);
        p.side.setAttribute("points", `${sx0.toFixed(1)},${st0.toFixed(1)} ${sx1.toFixed(1)},${st1.toFixed(1)} ${sx1.toFixed(1)},${sb1.toFixed(1)} ${sx0.toFixed(1)},${sb0.toFixed(1)}`);
        p.side.setAttribute("fill", colS);
        const [tx0, ty0] = proj(x - w, top, z + dz), [tx1] = proj(x + w, top, z + dz);
        p.cap.setAttribute("points", `${xl.toFixed(1)},${yt.toFixed(1)} ${xr.toFixed(1)},${yt.toFixed(1)} ${tx1.toFixed(1)},${ty0.toFixed(1)} ${tx0.toFixed(1)},${ty0.toFixed(1)}`);
        p.cap.setAttribute("fill", bull ? "#8CF7D2" : "#7A8290"); p.cap.setAttribute("opacity", 0.5);
        p.wick.setAttribute("x1", xc.toFixed(1)); p.wick.setAttribute("x2", xc.toFixed(1));
        p.wick.setAttribute("y1", yh.toFixed(1)); p.wick.setAttribute("y2", yl.toFixed(1));
        p.wick.setAttribute("stroke", colF); p.wick.setAttribute("stroke-width", Math.max(1, (F / z) * 0.08).toFixed(1));
        p.n.setAttribute("opacity", (fogK * glow).toFixed(3));
      });
      fog.setAttribute("opacity", (0.52 + (fx.dark ?? 0) * 0.35).toFixed(3));
    },
  };
}
