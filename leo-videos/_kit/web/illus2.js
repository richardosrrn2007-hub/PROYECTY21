// Ejemplos detallados y animados (sustituyen a las versiones simples de illus.js).
// Cada ilustración ocupa ~300 px centrada en 0,0 y expone update(t).

function ilDefs2() {
  ilDefs();
  if (document.getElementById("il2Defs")) return;
  const d = el("defs", { id: "il2Defs" }, document.querySelector("svg"));
  const lin = (id, stops, a = { x1: 0, y1: 0, x2: 0, y2: 1 }) => { const g = el("linearGradient", { id, ...a }, d); stops.forEach(([o, c, op2]) => el("stop", { offset: o, "stop-color": c, "stop-opacity": op2 ?? 1 }, g)); };
  lin("whaleTop", [["0%", "#3E6A8E"], ["55%", "#28496A"], ["100%", "#1A3149"]]);
  lin("whaleBelly", [["0%", "#E8EEF2"], ["100%", "#B9C8D3"]]);
  lin("sea", [["0%", "#1B6F86", 0.0], ["30%", "#155B70", 0.55], ["100%", "#0A2733", 0.9]]);
  lin("bill", [["0%", "#6FCF97"], ["100%", "#2E8B57"]]);
  lin("desk", [["0%", "#7A5638"], ["100%", "#4E3420"]]);
  lin("monitor", [["0%", "#1D232D"], ["100%", "#0B0E13"]]);
  lin("skin2", [["0%", "#F3D5BE"], ["100%", "#DDB094"]]);
  lin("glass", [["0%", "#8FB9D9"], ["100%", "#3D6A8F"]]);
  lin("truck", [["0%", "#F2F2F2"], ["100%", "#BFC4CC"]]);
  lin("pieGold", [["0%", "#FFE08A"], ["100%", "#C9961F"]]);
}

// Persona detallada: cabeza con pelo, cara, cuello, camisa con cuello y brazos.
function ilHuman(g, o = {}) {
  const p = el("g", {}, g);
  const shirt = o.shirt ?? "#3A6FD8", hair = o.hair ?? "#2B1D16", skin = o.skin ?? "url(#skin2)";
  el("path", { d: "M-58 120 C-60 60 -48 28 -20 18 L20 18 C48 28 60 60 58 120 Z", fill: shirt }, p);
  el("path", { d: "M-20 18 L0 40 L20 18 L10 14 L0 26 L-10 14 Z", fill: "#fff", opacity: 0.9 }, p);
  el("rect", { x: -11, y: 0, width: 22, height: 22, rx: 6, fill: skin }, p);
  const head = el("g", {}, p);
  el("ellipse", { cx: 0, cy: -26, rx: 30, ry: 35, fill: skin }, head);
  el("ellipse", { cx: -30, cy: -24, rx: 6, ry: 9, fill: "#DDB094" }, head);
  el("ellipse", { cx: 30, cy: -24, rx: 6, ry: 9, fill: "#DDB094" }, head);
  el("path", { d: o.long ? "M-32 -30 C-36 -70 32 -78 34 -30 C34 0 30 20 26 30 L22 -20 C10 -40 -14 -42 -26 -20 L-28 30 C-34 10 -34 -10 -32 -30 Z" : "M-31 -28 C-34 -62 -8 -70 6 -66 C24 -64 36 -52 32 -26 C26 -40 12 -46 -2 -42 C-14 -40 -24 -36 -31 -28 Z", fill: hair }, head);
  const eyes = el("g", {}, head);
  el("ellipse", { cx: -11, cy: -24, rx: 3.6, ry: 4.4, fill: "#24160F" }, eyes);
  el("ellipse", { cx: 11, cy: -24, rx: 3.6, ry: 4.4, fill: "#24160F" }, eyes);
  el("path", { d: "M-17 -34 L-5 -35 M5 -35 L17 -34", stroke: hair, "stroke-width": 3.5, "stroke-linecap": "round" }, head);
  el("path", { d: "M0 -20 L-3 -8 L2 -7", stroke: "#C4917A", "stroke-width": 2.4, fill: "none", "stroke-linecap": "round" }, head);
  const mouth = el("path", { d: "M-8 2 Q0 8 8 2", stroke: "#A86A5E", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, head);
  const armL = el("path", { stroke: shirt, "stroke-width": 20, "stroke-linecap": "round", fill: "none" }, p);
  const armR = el("path", { stroke: shirt, "stroke-width": 20, "stroke-linecap": "round", fill: "none" }, p);
  const handL = el("circle", { r: 10, fill: skin }, p), handR = el("circle", { r: 10, fill: skin }, p);
  return {
    p, head, eyes, mouth,
    arms(l, r) { // l, r: [x, y] posiciones de las manos
      armL.setAttribute("d", `M-44 40 Q${(-44 + l[0]) / 2 - 12} ${(40 + l[1]) / 2 + 8} ${l[0]} ${l[1]}`);
      armR.setAttribute("d", `M44 40 Q${(44 + r[0]) / 2 + 12} ${(40 + r[1]) / 2 + 8} ${r[0]} ${r[1]}`);
      handL.setAttribute("cx", l[0]); handL.setAttribute("cy", l[1]); handR.setAttribute("cx", r[0]); handR.setAttribute("cy", r[1]);
    },
    blink(t, seed = 0) { const ph = (t * 0.4 + seed) % 1; eyes.setAttribute("transform", `translate(0,-24) scale(1,${ph < 0.04 ? 0.1 : 1}) translate(0,24)`); },
  };
}

// Ballena jorobada detallada. Devuelve {g, tail, spout, update(t)}
function Whale(parent) {
  ilDefs2();
  const g = el("g", {}, parent);
  const tail = el("g", {}, g);
  el("path", { d: "M-150 0 C-170 -6 -190 -10 -205 -16", stroke: "#1F3B57", "stroke-width": 26, "stroke-linecap": "round", fill: "none" }, tail);
  const flukes = el("g", { transform: "translate(-205,-16)" }, tail);
  el("path", { d: "M0 0 C-20 -40 -55 -70 -90 -64 C-70 -50 -52 -30 -44 -6 C-56 -2 -70 8 -78 22 C-50 26 -20 18 0 0 Z", fill: "url(#whaleTop)" }, flukes);
  el("path", { d: "M-90 -64 C-82 -58 -76 -54 -70 -46 M-78 22 C-72 18 -64 14 -56 12", stroke: "#0F2236", "stroke-width": 3, fill: "none" }, flukes);
  const finBack = el("path", { d: "M-10 -18 C-30 30 -60 70 -96 92 C-60 90 -24 64 6 18 Z", fill: "#1A3149" }, g);
  // cuerpo
  el("path", { d: "M-160 -2 C-150 -60 -60 -100 40 -98 C120 -96 182 -60 196 -14 C204 14 196 40 170 54 C110 82 -10 78 -90 50 C-130 36 -158 20 -160 -2 Z", fill: "url(#whaleTop)" }, g);
  el("path", { d: "M-120 30 C-40 70 90 74 176 44 C190 36 196 24 198 10 C170 40 60 58 -20 50 C-70 44 -100 38 -120 30 Z", fill: "url(#whaleBelly)" }, g);
  for (let i = 0; i < 7; i++) el("path", { d: `M${-40 + i * 30} ${52 + Math.sin(i) * 2} C${-10 + i * 30} ${60} ${20 + i * 30} ${60} ${46 + i * 30} ${50}`, stroke: "#9DB0BE", "stroke-width": 2.4, fill: "none", opacity: 0.8 }, g);
  for (let i = 0; i < 9; i++) el("circle", { cx: 150 + (i % 3) * 12 - Math.floor(i / 3) * 8, cy: -54 + Math.floor(i / 3) * 12, r: 3.6, fill: "#4C7699" }, g); // tubérculos
  for (const [x, y, r] of [[-40, -60, 5], [-30, -52, 3], [20, -82, 4], [80, -78, 3.5], [96, -70, 2.5], [-100, -30, 4]]) el("circle", { cx: x, cy: y, r, fill: "#C9D3DB", opacity: 0.55 }, g); // percebes
  el("path", { d: "M196 -4 C160 6 120 12 90 10", stroke: "#0F2236", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, g);
  el("circle", { cx: 104, cy: -12, r: 9, fill: "#0B141E" }, g);
  el("circle", { cx: 107, cy: -15, r: 3, fill: "#fff" }, g);
  el("path", { d: "M92 -24 C100 -28 110 -28 118 -22", stroke: "#0F2236", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, g);
  el("path", { d: "M-120 -44 C-60 -82 40 -94 120 -76", stroke: "#6E9BC0", "stroke-width": 6, fill: "none", "stroke-linecap": "round", opacity: 0.35 }, g); // brillo
  const fin = el("path", { d: "M40 30 C30 80 0 120 -50 140 C-20 112 0 80 10 36 Z", fill: "url(#whaleTop)", stroke: "#0F2236", "stroke-width": 2 }, g);
  const spout = el("g", {}, g);
  const drops = [];
  for (let i = 0; i < 14; i++) drops.push(el("circle", { r: 4 + (i % 3) * 2, fill: "#BFEFFF" }, spout));
  return {
    g, tail, spout,
    update(t) {
      const fl = Math.sin(t * 4.2);
      tail.setAttribute("transform", `rotate(${(fl * 9).toFixed(2)},-150,0)`);
      flukes.setAttribute("transform", `translate(-205,-16) rotate(${(fl * 14).toFixed(2)}) scale(1,${(1 - Math.abs(fl) * 0.15).toFixed(3)})`);
      fin.setAttribute("transform", `rotate(${(Math.sin(t * 2.6) * 14).toFixed(2)},30,32)`);
      finBack.setAttribute("transform", `rotate(${(Math.sin(t * 2.6 + 1) * 10).toFixed(2)},0,0)`);
      const ph = (t * 0.7) % 1.6;
      drops.forEach((dp, i) => {
        const a = (i / 14 - 0.5) * 1.6, k = clamp(ph / 0.9);
        const x = 60 + Math.sin(a) * 70 * k, y = -98 - Math.cos(a * 0.6) * 150 * k + 260 * k * k * 0.4;
        dp.setAttribute("cx", x.toFixed(1)); dp.setAttribute("cy", y.toFixed(1));
        dp.setAttribute("opacity", (ph < 0.9 ? Math.sin(k * Math.PI) * 0.9 : 0).toFixed(2));
      });
    },
  };
}

// ---------- Ejemplos de alternativas ----------
IL.coins = (parent) => { // mucho capital: fajos de billetes, lingotes y monedas que llueven
  ilDefs2(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 170);
  const bill = (x, y, r = 0) => { const b = el("g", { transform: `translate(${x},${y}) rotate(${r})` }, g); el("rect", { x: -60, y: -18, width: 120, height: 36, rx: 4, fill: "url(#bill)", stroke: "#1E6B42", "stroke-width": 2 }, b); el("circle", { r: 11, fill: "none", stroke: "#1E6B42", "stroke-width": 2 }, b); el("text", { x: 0, y: 6, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 16, fill: "#1E6B42" }, b, "$"); el("rect", { x: -60, y: -4, width: 12, height: 8, fill: "#E9B53C" }, b); return b; };
  for (let i = 0; i < 6; i++) bill(-70, 100 - i * 14, (i % 2) * 2 - 1);
  for (let i = 0; i < 4; i++) bill(40, 104 - i * 14, (i % 2) * -2 + 1);
  const bar = (x, y) => { const b = el("g", { transform: `translate(${x},${y})` }, g); el("path", { d: "M-36 14 L-26 -10 L26 -10 L36 14 Z", fill: "url(#ilGold)", stroke: "#A97A16", "stroke-width": 2 }, b); el("path", { d: "M-26 -10 L26 -10 L22 -4 L-22 -4 Z", fill: "#FFF0B8", opacity: 0.7 }, b); };
  bar(-20, 40); bar(30, 40); bar(5, 18);
  for (let i = 0; i < 6; i++) ilCoin(g, 110, 100 - i * 13, 30);
  const rain = []; for (let i = 0; i < 7; i++) rain.push(ilCoin(g, 0, 0, 16));
  const glint = el("path", { d: "M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z", fill: "#fff" }, g);
  return { g, update(t) {
    rain.forEach((c, i) => { const ph = (t * 0.8 + i / 7) % 1; const x = -110 + ((i * 53) % 230), y = -170 + ph * 230; c.setAttribute("transform", `translate(${x},${y}) scale(1,${(0.5 + 0.5 * Math.abs(Math.cos(t * 8 + i))).toFixed(2)})`); c.setAttribute("opacity", (ph < 0.85 ? 1 : (1 - ph) / 0.15).toFixed(2)); });
    const gp = (t * 0.9) % 1; glint.setAttribute("transform", `translate(${[-20, 30, 110][Math.floor(t * 0.9) % 3]},${[30, 30, 30][0]}) scale(${Math.sin(gp * Math.PI).toFixed(2)})`);
  } };
};
IL.calendar = (parent) => { // meses: se arrancan hojas mientras el gráfico avanza lento
  ilDefs2(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g);
  el("rect", { x: -120, y: -110, width: 240, height: 230, rx: 26, fill: "url(#ilPaper)" }, g);
  el("rect", { x: -120, y: -110, width: 240, height: 70, rx: 26, fill: C.em2 }, g);
  for (const x of [-60, 60]) el("rect", { x: x - 9, y: -132, width: 18, height: 44, rx: 9, fill: "#2A303A" }, g);
  const MES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO"];
  const label = el("text", { x: 0, y: -62, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 40, fill: "#fff", "letter-spacing": 4 }, g, "ENE");
  const chart = el("path", { d: "", stroke: C.em, "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, g);
  el("path", { d: "M-96 96 H96", stroke: "#CFC6B6", "stroke-width": 3 }, g);
  const page = el("g", {}, g);
  el("rect", { x: -120, y: -110, width: 240, height: 70, rx: 26, fill: "#25C08A" }, page);
  const pl = el("text", { x: 0, y: -62, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 40, fill: "#fff", "letter-spacing": 4 }, page, "ENE");
  return { g, update(t) {
    const k = Math.floor(t * 1.2), ph = (t * 1.2) % 1;
    label.textContent = MES[(k + 1) % MES.length]; pl.textContent = MES[k % MES.length];
    page.setAttribute("transform", `translate(${(ph * 160).toFixed(1)},${(-ph * 140 + ph * ph * 260).toFixed(1)}) rotate(${(ph * 50).toFixed(1)})`);
    page.setAttribute("opacity", (1 - ph).toFixed(2));
    const n = 12, prog = clamp(((t * 0.25) % 1.2));
    let d = ""; for (let i = 0; i <= n * prog; i++) { const x = -96 + i * 16, y = 70 - i * 4 - Math.sin(i * 1.3) * 10; d += (d ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }
    chart.setAttribute("d", d);
  } };
};
IL.swarm = (parent) => { // muchas operaciones pequeñas: móvil con tickets que saltan
  ilDefs2(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 120);
  el("rect", { x: -80, y: -140, width: 160, height: 280, rx: 26, fill: "#12161D", stroke: "#3A424E", "stroke-width": 6 }, g);
  el("rect", { x: -66, y: -118, width: 132, height: 236, rx: 12, fill: "url(#monitor)" }, g);
  el("rect", { x: -20, y: -132, width: 40, height: 8, rx: 4, fill: "#3A424E" }, g);
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const r = el("g", {}, g);
    const bg2 = el("rect", { x: -58, y: -14, width: 116, height: 28, rx: 8, fill: "#1E2530" }, r);
    const tx = el("text", { x: -48, y: 6, "font-family": FONT2, "font-weight": 800, "font-size": 16, fill: "#fff" }, r, "BUY");
    const v = el("text", { x: 50, y: 6, "text-anchor": "end", "font-family": FONT2, "font-weight": 800, "font-size": 16, fill: C.em }, r, "+0.1%");
    rows.push({ r, tx, v, bg2 });
  }
  const tap = el("circle", { r: 16, fill: "#fff", opacity: 0.4 }, g);
  const bolt = el("path", { d: "M18 -60 L-30 14 L4 14 L-10 70 L44 -6 L8 -6 Z", fill: "url(#ilGold)", stroke: C.bg, "stroke-width": 5, transform: "translate(100,-110) scale(0.9)" }, g);
  return { g, update(t) {
    const step = t * 5, k = Math.floor(step), ph = step - k;
    rows.forEach((o, i) => {
      const n = k + i, buy = (n * 7) % 3 !== 0;
      o.tx.textContent = buy ? "BUY" : "SELL"; o.v.textContent = (buy ? "+" : "-") + "0." + ((n * 3) % 5 + 1) + "%";
      o.v.setAttribute("fill", buy ? C.em : "#E06A5E");
      o.r.setAttribute("transform", `translate(0,${(-90 + i * 36 + (1 - E.out(ph)) * -36).toFixed(1)})`);
      o.r.setAttribute("opacity", i === 0 ? E.out(ph).toFixed(2) : "1");
    });
    tap.setAttribute("cx", 30); tap.setAttribute("cy", 96); tap.setAttribute("r", (6 + ph * 22).toFixed(1)); tap.setAttribute("opacity", (0.5 * (1 - ph)).toFixed(2));
    bolt.setAttribute("transform", `translate(100,-110) scale(${(0.9 + Math.max(0, Math.sin(t * 10)) * 0.1).toFixed(3)})`);
  } };
};
IL.trader = (parent) => { // trader individual en su escritorio, tecleando
  ilDefs2(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 170);
  el("path", { d: "M-40 70 L-50 130 M40 70 L50 130", stroke: "#2A303A", "stroke-width": 10 }, g);
  const pr = ilHuman(g, { shirt: "url(#ilShirtB)" }); pr.p.setAttribute("transform", "translate(0,-40) scale(1.05)");
  el("rect", { x: -150, y: 60, width: 300, height: 20, rx: 6, fill: "url(#desk)" }, g);
  const mon = el("g", { transform: "translate(0,-6)" }, g);
  el("rect", { x: -96, y: -34, width: 192, height: 96, rx: 8, fill: "url(#monitor)", stroke: "#4A5260", "stroke-width": 4 }, mon);
  el("rect", { x: -12, y: 62, width: 24, height: 10, fill: "#4A5260" }, mon);
  const line = el("path", { d: "", stroke: C.em, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, mon);
  const mug = el("g", { transform: "translate(120,40)" }, g);
  el("rect", { x: -14, y: -20, width: 28, height: 30, rx: 5, fill: "#E9E4DA" }, mug);
  el("path", { d: "M14 -12 C26 -12 26 4 14 4", stroke: "#E9E4DA", "stroke-width": 5, fill: "none" }, mug);
  const steam = [0, 1].map(() => el("path", { stroke: "#fff", "stroke-width": 3, fill: "none", opacity: 0.4, "stroke-linecap": "round" }, mug));
  return { g, update(t) {
    pr.p.setAttribute("transform", "translate(0,-40) scale(1.05)");
    pr.head.setAttribute("transform", `rotate(${(Math.sin(t * 1.3) * 4).toFixed(2)},0,0)`);
    const ty = Math.sin(t * 16) * 4;
    pr.arms([-40, 62 + ty], [40, 62 - ty]); pr.blink(t, 0.3);
    let d = ""; for (let i = 0; i <= 10; i++) { const x = -80 + i * 16, y = 30 - i * 4 + Math.sin(t * 3 + i * 0.9) * 10; d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }
    line.setAttribute("d", d);
    steam.forEach((s2, i) => { const ph = (t * 0.6 + i / 2) % 1; s2.setAttribute("d", `M${-4 + i * 8} -24 C${-10 + i * 8} ${-34 - ph * 20} ${6 + i * 8} ${-44 - ph * 20} ${-2 + i * 8} ${-56 - ph * 24}`); s2.setAttribute("opacity", (0.45 * Math.sin(ph * Math.PI)).toFixed(2)); });
  } };
};
IL.company = (parent) => { // empresa: fábrica con cinta transportadora y camión
  ilDefs2(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 190);
  el("path", { d: "M-150 80 L-150 -20 L-90 -60 L-90 -20 L-30 -60 L-30 -20 L30 -60 L30 -110 L66 -110 L66 -20 L120 -20 L120 80 Z", fill: "url(#ilFactory)" }, g);
  for (let i = 0; i < 4; i++) el("rect", { x: -134 + i * 62, y: -4, width: 38, height: 28, rx: 4, fill: "url(#glass)" }, g);
  el("rect", { x: -40, y: 36, width: 50, height: 44, rx: 4, fill: "#2A303A" }, g);
  el("rect", { x: -150, y: 80, width: 300, height: 16, rx: 8, fill: "#3A414C" }, g);
  const rollers = []; for (let i = 0; i < 9; i++) rollers.push(el("circle", { cx: -140 + i * 34, cy: 88, r: 6, fill: "#8B919C" }, g));
  const boxes = []; for (let i = 0; i < 4; i++) { const b = el("g", {}, g); el("rect", { x: -18, y: -18, width: 36, height: 34, rx: 3, fill: "#C9925A" }, b); el("path", { d: "M-18 -2 H18 M0 -18 V16", stroke: "#8E6334", "stroke-width": 3 }, b); boxes.push(b); }
  const truck = el("g", {}, g);
  el("rect", { x: -60, y: -40, width: 80, height: 50, rx: 6, fill: "url(#truck)" }, truck);
  el("path", { d: "M20 -26 L46 -26 L60 -6 L60 10 L20 10 Z", fill: C.em2 }, truck);
  el("rect", { x: 28, y: -20, width: 18, height: 14, rx: 2, fill: "url(#glass)" }, truck);
  const wheels = [-38, 38].map((x) => el("circle", { cx: x, cy: 14, r: 11, fill: "#1A1E24", stroke: "#8B919C", "stroke-width": 3 }, truck));
  const smoke = [0, 1, 2].map(() => el("circle", { r: 14, fill: "#9AA1AC" }, g));
  return { g, update(t) {
    boxes.forEach((b, i) => { const ph = (t * 0.35 + i / 4) % 1; b.setAttribute("transform", `translate(${(-140 + ph * 280).toFixed(1)},62)`); });
    rollers.forEach((r, i) => r.setAttribute("opacity", (0.6 + 0.4 * Math.sin(t * 8 - i)).toFixed(2)));
    const tp = (t * 0.25) % 1; truck.setAttribute("transform", `translate(${(-260 + tp * 520).toFixed(1)},130) scale(0.8)`);
    smoke.forEach((s2, i) => { const ph = (t * 0.8 + i / 3) % 1; s2.setAttribute("cx", (48 + ph * 30).toFixed(1)); s2.setAttribute("cy", (-120 - ph * 80).toFixed(1)); s2.setAttribute("r", (10 + ph * 20).toFixed(1)); s2.setAttribute("opacity", (0.6 * (1 - ph)).toFixed(2)); });
  } };
};
IL.bank = (parent) => { // banco: edificio con rascacielos detrás y dinero entrando
  ilDefs2(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 180);
  for (const [x, w, h2] of [[-150, 60, 200], [-90, 50, 250], [90, 60, 230], [140, 44, 180]]) {
    el("rect", { x, y: 100 - h2, width: w, height: h2, fill: "#2A3646" }, g);
    for (let r = 0; r < h2 / 26 - 1; r++) for (let c = 0; c < 2; c++) el("rect", { x: x + 10 + c * (w / 2 - 4), y: 110 - h2 + r * 26, width: w / 2 - 16, height: 12, fill: (r + c) % 3 ? "#3E5068" : "#E9C46A", opacity: 0.8 }, g);
  }
  const b = ilBank(g); b.setAttribute("transform", "translate(0,6) scale(0.95)");
  for (let i = 0; i < 3; i++) el("rect", { x: -150 + i * 8, y: 98 + i * 7, width: 300 - i * 16, height: 8, fill: "#C9C2B2" }, g);
  const flag = el("path", { fill: C.em }, g);
  el("rect", { x: -2, y: -170, width: 4, height: 70, fill: "#C9CED6" }, g);
  const flow = []; for (let i = 0; i < 6; i++) flow.push(ilCoin(g, 0, 0, 14));
  return { g, update(t) {
    flag.setAttribute("d", `M2 -168 C20 ${-176 + Math.sin(t * 6) * 4} 30 ${-160 + Math.sin(t * 6 + 1) * 4} 46 ${-166 + Math.sin(t * 6 + 2) * 5} L46 ${-140 + Math.sin(t * 6 + 2) * 5} C30 ${-134 + Math.sin(t * 6 + 1) * 4} 20 ${-150 + Math.sin(t * 6) * 4} 2 -142 Z`);
    flow.forEach((c, i) => { const ph = (t * 0.7 + i / 6) % 1, side = i % 2 ? 1 : -1; c.setAttribute("transform", `translate(${(side * (200 - ph * 200)).toFixed(1)},${(80 - Math.sin(ph * Math.PI) * 60).toFixed(1)})`); c.setAttribute("opacity", Math.sin(ph * Math.PI).toFixed(2)); });
  } };
};
IL.fund = (parent) => { // fondo: inversionistas meten monedas y el fondo las reparte
  ilDefs2(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 190);
  const vault = el("g", { transform: "translate(60,-40)" }, g);
  el("circle", { r: 96, fill: "#3A414C" }, vault);
  const pie = el("g", {}, vault);
  el("path", { d: "M0 0 L0 -84 A84 84 0 0 1 80 26 Z", fill: C.em }, pie);
  el("path", { d: "M0 0 L80 26 A84 84 0 0 1 -28 79 Z", fill: "url(#pieGold)" }, pie);
  el("path", { d: "M0 0 L-28 79 A84 84 0 0 1 0 -84 Z", fill: "#6B7380" }, pie);
  el("circle", { r: 30, fill: "#1A1E24" }, vault);
  el("text", { x: 0, y: 8, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 22, fill: "#fff" }, vault, "FONDO");
  const people = [[-150, 70, "#3A6FD8", false], [-90, 90, "#D8653A", true], [-30, 96, "#8A5AD8", false]].map(([x, y, c, long]) => { const h2 = ilHuman(g, { shirt: c, long }); h2.p.setAttribute("transform", `translate(${x},${y}) scale(0.55)`); return { h2, x, y }; });
  const coins = people.map(() => ilCoin(g, 0, 0, 13));
  return { g, update(t) {
    pie.setAttribute("transform", `rotate(${((t * 30) % 360).toFixed(1)})`);
    people.forEach(({ h2, x, y }, i) => { const ph = (t * 0.7 + i / 3) % 1; h2.arms([-24, 50], [30 + Math.sin(ph * Math.PI) * 14, 20 - Math.sin(ph * Math.PI) * 30]); h2.blink(t, i * 0.3); h2.p.setAttribute("transform", `translate(${x},${(y - Math.abs(Math.sin(t * 3 + i)) * 6).toFixed(1)}) scale(0.55)`);
      const c = coins[i]; const k = ph; c.setAttribute("transform", `translate(${lerp(x + 20, 60, k).toFixed(1)},${(lerp(y - 10, -40, k) - Math.sin(k * Math.PI) * 60).toFixed(1)})`); c.setAttribute("opacity", (Math.sin(k * Math.PI)).toFixed(2)); });
  } };
};
IL.retail = (parent) => { // trader retail: una persona con su móvil y su propia cartera
  ilDefs2(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 170);
  const pr = ilHuman(g, { shirt: "url(#ilShirtG)" }); pr.p.setAttribute("transform", "translate(-30,-30) scale(1.2)");
  const phone = el("g", {}, g);
  el("rect", { x: -18, y: -32, width: 36, height: 64, rx: 7, fill: "#12161D", stroke: "#4A5260", "stroke-width": 3 }, phone);
  const pl = el("path", { stroke: C.em, "stroke-width": 3, fill: "none" }, phone);
  const wallet = el("g", { transform: "translate(110,70)" }, g);
  el("rect", { x: -46, y: -32, width: 92, height: 64, rx: 12, fill: "#8E6334" }, wallet);
  el("rect", { x: 4, y: -12, width: 46, height: 26, rx: 8, fill: "#6B4A26" }, wallet);
  el("circle", { cx: 26, cy: 1, r: 6, fill: C.gold }, wallet);
  const bills = el("rect", { x: -40, y: -44, width: 60, height: 20, rx: 3, fill: "url(#bill)" }, wallet);
  const coin = ilCoin(g, 0, 0, 16);
  const tag = el("g", { transform: "translate(-30,-150)" }, g);
  el("rect", { x: -54, y: -18, width: 108, height: 36, rx: 18, fill: C.em }, tag);
  el("text", { x: 0, y: 7, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 18, fill: C.bg }, tag, "MI CUENTA");
  return { g, update(t) {
    const hx = 30 + Math.sin(t * 2) * 4, hy = 40;
    pr.arms([-10, 60], [hx / 1.2 + 20, hy / 1.2]); pr.blink(t, 0.6);
    phone.setAttribute("transform", `translate(${(hx + 12).toFixed(1)},${(hy - 30).toFixed(1)}) rotate(-8)`);
    let d = ""; for (let i = 0; i <= 6; i++) { const x = -12 + i * 4, y = 14 - i * 4 + Math.sin(t * 4 + i) * 3; d += (i ? " L" : "M") + x + " " + y.toFixed(1); } pl.setAttribute("d", d);
    bills.setAttribute("transform", `rotate(${(Math.sin(t * 3) * 6).toFixed(2)},-10,-34)`);
    const ph = (t * 0.9) % 1; coin.setAttribute("transform", `translate(${lerp(110, hx + 12, ph).toFixed(1)},${(lerp(50, hy - 30, ph) - Math.sin(ph * Math.PI) * 80).toFixed(1)})`); coin.setAttribute("opacity", Math.sin(ph * Math.PI).toFixed(2));
    tag.setAttribute("transform", `translate(-30,${(-150 + Math.sin(t * 2.5) * 6).toFixed(1)})`);
  } };
};
IL.bankClients = (parent) => { // banco que opera para sus clientes
  ilDefs2(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 200);
  const b = ilBank(g, "#5D6573"); b.setAttribute("transform", "translate(0,-20) scale(0.85)");
  const desk = el("rect", { x: -60, y: 60, width: 120, height: 18, rx: 4, fill: "url(#desk)" }, g);
  const clients = [[-170, "#3A6FD8", false], [170, "#D8653A", true], [-110, "#8A5AD8", true]].map(([x, c, long]) => { const h2 = ilHuman(g, { shirt: c, long }); return { h2, x }; });
  const docs = [0, 1].map(() => { const d2 = el("g", {}, g); el("rect", { x: -14, y: -18, width: 28, height: 36, rx: 3, fill: "#fff" }, d2); el("path", { d: "M-8 -8 H8 M-8 0 H8 M-8 8 H4", stroke: "#8B919C", "stroke-width": 2.5 }, d2); return d2; });
  return { g, update(t) {
    clients.forEach(({ h2, x }, i) => { h2.p.setAttribute("transform", `translate(${(x + Math.sin(t * 1.5 + i * 2) * 8).toFixed(1)},${70 - Math.abs(Math.sin(t * 3 + i)) * 5}) scale(0.6)`); h2.arms([-30, 60], [34, 40 - Math.abs(Math.sin(t * 2 + i)) * 20]); h2.blink(t, i * 0.4); });
    docs.forEach((d2, i) => { const ph = (t * 0.6 + i / 2) % 1, side = i ? 1 : -1; d2.setAttribute("transform", `translate(${(side * lerp(0, 160, ph)).toFixed(1)},${(40 - Math.sin(ph * Math.PI) * 70).toFixed(1)}) rotate(${(ph * 180 * side).toFixed(1)})`); d2.setAttribute("opacity", Math.sin(ph * Math.PI).toFixed(2)); });
  } };
};
