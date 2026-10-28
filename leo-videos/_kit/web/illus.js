// Ilustraciones de cada alternativa (caja ~260 px centrada en 0,0). update(t) = animación en reposo.
const IL = {};
function ilDefs() {
  if (document.getElementById("ilDefs")) return;
  const svgRoot = document.querySelector("svg");
  const d = el("defs", { id: "ilDefs" }, svgRoot);
  const lin = (id, stops, a = { x1: 0, y1: 0, x2: 0, y2: 1 }) => { const g = el("linearGradient", { id, ...a }, d); stops.forEach(([o, c]) => el("stop", { offset: o, "stop-color": c }, g)); };
  lin("ilBag", [["0%", "#4FD9A6"], ["55%", "#2FA67A"], ["100%", "#1C7454"]], { x1: 0, y1: 0, x2: 1, y2: 1 });
  lin("ilGold", [["0%", "#FFE08A"], ["50%", "#E9B53C"], ["100%", "#B8861E"]]);
  lin("ilStone", [["0%", "#FFFFFF"], ["100%", "#D8D1C2"]], { x1: 0, y1: 0, x2: 1, y2: 0 });
  lin("ilRoof", [["0%", "#5BF0BE"], ["100%", "#1FA97A"]]);
  lin("ilFactory", [["0%", "#7A8392"], ["100%", "#454C58"]]);
  lin("ilPaper", [["0%", "#FFFFFF"], ["100%", "#E6DED0"]]);
  lin("ilScreen", [["0%", "#222833"], ["100%", "#0F1318"]]);
  lin("ilShirtB", [["0%", "#5A8BF0"], ["100%", "#2C55B0"]]);
  lin("ilShirtG", [["0%", "#4FE3AE"], ["100%", "#1F9B70"]]);
  const f = el("filter", { id: "ilShadow", x: "-30%", y: "-30%", width: "160%", height: "170%" }, d);
  el("feDropShadow", { dx: 0, dy: 14, stdDeviation: 12, "flood-color": "#000", "flood-opacity": 0.55 }, f);
}
function ilGround(g, w = 150) { el("ellipse", { cx: 0, cy: 128, rx: w, ry: 16, fill: "#000", opacity: 0.35 }, g); }
function ilPerson(g, x, y, s, shirt = C.em, skin = "#EFCDB4") {
  const p = el("g", { transform: `translate(${x},${y}) scale(${s})` }, g);
  el("path", { d: "M-46 70 C-46 20 -26 4 0 4 C26 4 46 20 46 70 Z", fill: shirt }, p);
  el("circle", { cx: 0, cy: -26, r: 26, fill: skin }, p);
  el("path", { d: "M-24 -36 C-20 -58 20 -60 26 -34 C14 -44 -10 -44 -24 -36 Z", fill: "#3A2E24" }, p);
  return p;
}
function ilCoin(g, x, y, r = 30) {
  const c = el("g", { transform: `translate(${x},${y})` }, g);
  el("ellipse", { cx: 0, cy: 6, rx: r, ry: r * 0.42, fill: "#B8861E" }, c);
  el("ellipse", { cx: 0, cy: 0, rx: r, ry: r * 0.42, fill: "url(#ilGold)" }, c);
  el("ellipse", { cx: 0, cy: 0, rx: r * 0.66, ry: r * 0.26, fill: "none", stroke: "#F6D27A", "stroke-width": 3 }, c);
  return c;
}
function ilBank(g, col = C.em) {
  const b = el("g", {}, g);
  el("path", { d: "M-120 -40 L0 -110 L120 -40 Z", fill: col === C.em ? "url(#ilRoof)" : col }, b);
  el("rect", { x: -120, y: -44, width: 240, height: 16, fill: col }, b);
  for (let i = 0; i < 5; i++) el("rect", { x: -104 + i * 48, y: -24, width: 22, height: 104, rx: 4, fill: "url(#ilStone)" }, b);
  el("rect", { x: -132, y: 80, width: 264, height: 22, rx: 6, fill: col }, b);
  el("circle", { cx: 0, cy: -66, r: 16, fill: C.bg }, b);
  el("text", { x: 0, y: -58, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 24, fill: C.gold }, b, "$");
  return b;
}
IL.coins = (parent) => {
  ilDefs(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g);
  const bag = el("g", {}, g);
  el("path", { d: "M-40 -70 C-70 -20 -110 20 -100 70 C-90 110 -10 116 20 110 C80 100 90 40 60 -10 C40 -40 20 -60 10 -70 Z", fill: "url(#ilBag)" }, bag);
  el("path", { d: "M-40 -70 L-55 -100 L-20 -88 L0 -104 L10 -70 Z", fill: "#27966D" }, bag);
  el("path", { d: "M-70 0 C-80 30 -76 60 -60 80", stroke: "#fff", "stroke-width": 8, fill: "none", "stroke-linecap": "round", opacity: 0.25 }, bag);
  el("rect", { x: -48, y: -78, width: 66, height: 14, rx: 7, fill: C.gold }, bag);
  el("text", { x: -14, y: 52, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 92, fill: C.cream }, bag, "$");
  const stack = [];
  for (let i = 0; i < 6; i++) stack.push(ilCoin(g, 95, 96 - i * 15, 36));
  for (let i = 0; i < 4; i++) stack.push(ilCoin(g, 30, 110 - i * 15, 32));
  const fly = [0, 1, 2].map(() => ilCoin(g, 0, 0, 22));
  return { g, update(t) {
    bag.setAttribute("transform", `rotate(${Math.sin(t * 3) * 4}) scale(${1 + Math.sin(t * 6) * 0.02})`);
    fly.forEach((c, i) => { const ph = (t * 0.9 + i / 3) % 1; c.setAttribute("transform", `translate(${-80 + i * 70},${-60 - ph * 90}) scale(${1 - ph * 0.3})`); c.setAttribute("opacity", Math.sin(ph * Math.PI).toFixed(2)); });
  } };
};
IL.calendar = (parent) => {
  ilDefs(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g);
  el("rect", { x: -120, y: -110, width: 240, height: 230, rx: 26, fill: "url(#ilPaper)" }, g);
  el("rect", { x: -120, y: -110, width: 240, height: 64, rx: 26, fill: C.em }, g);
  el("rect", { x: -120, y: -66, width: 240, height: 22, fill: C.em }, g);
  for (const x of [-60, 60]) el("rect", { x: x - 9, y: -132, width: 18, height: 44, rx: 9, fill: C.ink }, g);
  el("text", { x: 0, y: -63, "text-anchor": "middle", "font-family": FONT, "font-weight": 900, "font-size": 30, fill: C.bg, "letter-spacing": 4 }, g, "MESES");
  const cells = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) cells.push(el("rect", { x: -96 + c * 40, y: -28 + r * 36, width: 30, height: 26, rx: 6, fill: "#D9D1C0" }, g));
  const page = el("g", {}, g);
  el("rect", { x: -120, y: -110, width: 240, height: 64, rx: 26, fill: C.em2 }, page);
  return { g, update(t) {
    const k = Math.floor(t * 4) % cells.length;
    cells.forEach((c, i) => c.setAttribute("fill", i <= k ? C.em : "#D9D1C0"));
    const ph = (t * 1.5) % 1; page.setAttribute("transform", `translate(0,${-110}) scale(1,${(1 - ph).toFixed(3)}) translate(0,110)`); page.setAttribute("opacity", (1 - ph).toFixed(2));
  } };
};
IL.swarm = (parent) => {
  ilDefs(); const g = el("g", { filter: "url(#ilShadow)" }, parent);
  const minis = [];
  for (let i = 0; i < 18; i++) {
    const m = el("g", {}, g);
    const up = i % 3 !== 0;
    el("rect", { x: -1.5, y: -18, width: 3, height: 36, fill: up ? C.em : "#8B919C" }, m);
    el("rect", { x: -7, y: -10, width: 14, height: 20, rx: 2, fill: up ? C.em : "#8B919C" }, m);
    minis.push({ m, x: -120 + (i % 6) * 48, y: -70 + Math.floor(i / 6) * 70 });
  }
  const bolt = el("path", { d: "M18 -110 L-50 20 L0 20 L-20 120 L60 -20 L8 -20 Z", fill: "url(#ilGold)", stroke: C.bg, "stroke-width": 6 }, g);
  return { g, update(t) {
    minis.forEach((o, i) => { const s = 0.6 + 0.4 * Math.abs(Math.sin(t * 6 + i * 1.3)); o.m.setAttribute("transform", `translate(${o.x},${o.y}) scale(${s.toFixed(3)})`); });
    bolt.setAttribute("transform", `scale(${1 + Math.max(0, Math.sin(t * 9)) * 0.08})`);
  } };
};
IL.trader = (parent) => {
  ilDefs(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g);
  ilPerson(g, 0, -40, 1.5, "url(#ilShirtB)");
  const lap = el("g", {}, g);
  el("path", { d: "M-110 40 L110 40 L130 110 L-130 110 Z", fill: "#2A303A" }, lap);
  el("rect", { x: -100, y: -36, width: 200, height: 80, rx: 8, fill: "url(#ilScreen)", stroke: "#4A5260", "stroke-width": 4 }, lap);
  el("rect", { x: -100, y: -36, width: 200, height: 80, rx: 8, fill: C.em, opacity: 0.08 }, lap);
  const line = el("path", { d: "", stroke: C.em, "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, lap);
  return { g, update(t) {
    let d = ""; for (let i = 0; i <= 8; i++) { const x = -84 + i * 21, y = 20 - i * 5 + Math.sin(t * 4 + i) * 8; d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }
    line.setAttribute("d", d);
  } };
};
IL.company = (parent) => {
  ilDefs(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 170);
  el("path", { d: "M-130 100 L-130 -20 L-70 -60 L-70 -20 L-10 -60 L-10 -20 L50 -60 L50 -100 L90 -100 L90 -20 L130 -20 L130 100 Z", fill: "url(#ilFactory)" }, g);
  for (let i = 0; i < 4; i++) el("rect", { x: -110 + i * 58, y: 10, width: 36, height: 30, rx: 4, fill: C.gold, opacity: 0.85 }, g);
  el("rect", { x: -20, y: 50, width: 44, height: 50, rx: 4, fill: C.ink }, g);
  const smoke = [0, 1, 2].map(() => el("circle", { r: 14, fill: "#8B919C" }, g));
  const boxes = [0, 1].map((i) => { const b = el("g", {}, g); el("rect", { x: -20, y: -20, width: 40, height: 40, rx: 4, fill: "#C9925A" }, b); el("path", { d: "M-20 0 H20 M0 -20 V20", stroke: "#8E6334", "stroke-width": 4 }, b); return b; });
  return { g, update(t) {
    smoke.forEach((s, i) => { const ph = (t * 0.8 + i / 3) % 1; s.setAttribute("cx", (70 + ph * 30).toFixed(1)); s.setAttribute("cy", (-110 - ph * 80).toFixed(1)); s.setAttribute("r", (10 + ph * 18).toFixed(1)); s.setAttribute("opacity", (0.6 * (1 - ph)).toFixed(2)); });
    boxes.forEach((b, i) => { const ph = (t * 0.6 + i / 2) % 1; const x = i ? 160 - ph * 320 : -160 + ph * 320; b.setAttribute("transform", `translate(${x.toFixed(1)},130)`); b.setAttribute("opacity", Math.sin(ph * Math.PI).toFixed(2)); });
  } };
};
IL.bank = (parent) => {
  ilDefs(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 160);
  const b = ilBank(g);
  if (!document.getElementById("bankClip")) { const cp = el("clipPath", { id: "bankClip" }, document.getElementById("ilDefs")); el("path", { d: "M-132 102 L-132 -44 L0 -112 L132 -44 L132 102 Z" }, cp); }
  const sg = el("g", { "clip-path": "url(#bankClip)" }, g);
  const shine = el("rect", { x: -30, y: -130, width: 40, height: 260, fill: "#fff", opacity: 0.22, transform: "skewX(-20)" }, sg);
  return { g, update(t) { const ph = (t * 0.5) % 1; shine.setAttribute("x", (-200 + ph * 400).toFixed(1)); } };
};
IL.fund = (parent) => {
  ilDefs(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g);
  const pie = el("g", { transform: "translate(40,-30)" }, g);
  el("circle", { r: 90, fill: "#5D6573" }, pie);
  el("path", { d: "M0 0 L0 -90 A90 90 0 0 1 85.6 27.8 Z", fill: C.em }, pie);
  el("path", { d: "M0 0 L85.6 27.8 A90 90 0 0 1 -30 84.8 Z", fill: C.gold }, pie);
  el("circle", { r: 34, fill: C.bg }, pie);
  const people = [-110, -60, -10].map((x, i) => ilPerson(g, x, 80, 0.7, ["#3A6FD8", "#D8653A", "#8A5AD8"][i]));
  return { g, update(t) {
    pie.setAttribute("transform", `translate(40,-30) rotate(${(t * 40) % 360})`);
    people.forEach((p, i) => p.setAttribute("transform", `translate(${[-110, -60, -10][i]},${80 - Math.abs(Math.sin(t * 4 + i)) * 12}) scale(0.7)`));
  } };
};
IL.retail = (parent) => {
  ilDefs(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g);
  ilPerson(g, -30, -40, 1.5, "url(#ilShirtG)");
  const w = el("g", {}, g);
  el("rect", { x: 40, y: 20, width: 110, height: 80, rx: 14, fill: "#8E6334" }, w);
  el("rect", { x: 100, y: 46, width: 54, height: 30, rx: 10, fill: "#6B4A26" }, w);
  el("circle", { cx: 122, cy: 61, r: 7, fill: C.gold }, w);
  const coin = ilCoin(g, 0, 0, 22);
  return { g, update(t) {
    w.setAttribute("transform", `rotate(${Math.sin(t * 3) * 5},95,60)`);
    const ph = (t * 1.1) % 1; coin.setAttribute("transform", `translate(${95 - ph * 20},${10 - ph * 120})`); coin.setAttribute("opacity", Math.sin(ph * Math.PI).toFixed(2));
  } };
};
IL.bankClients = (parent) => {
  ilDefs(); const g = el("g", { filter: "url(#ilShadow)" }, parent); ilGround(g, 190);
  const b = ilBank(g, "#5D6573");
  b.setAttribute("transform", "translate(0,-20) scale(0.85)");
  const people = [-150, 150].map((x, i) => ilPerson(g, x, 70, 0.8, i ? "#D8653A" : "#3A6FD8"));
  return { g, update(t) { people.forEach((p, i) => p.setAttribute("transform", `translate(${[-150, 150][i] + Math.sin(t * 2 + i * 3) * 10},70) scale(0.8)`)); } };
};
