// Reto LFX 01 — cuestionario animado (Higgsedit)
// TIMING se reemplaza por los tiempos reales de la narración.
const TIMING = __TIMING__;
const PREVIEW = __PREVIEW__;

const W = 1080, H = 1920;
const C = {
  bg: "#0A0B10", card: "#12151B", stroke: "#2A2F38", white: "#F4F4F2", grey: "#8A8F98",
  dim: "#5C616B", em: "#2FD39A", emDark: "#0D2A20", gold: "#E5B23A",
};
const F = "DejaVu Sans";
// Inicio de la escena en construcción: los `at` de los nodos son absolutos.
let OFF = 0;
const A = "/home/user/lfx/assets/";

// Opacidad: entra en ta, sale en te (tiempos locales de la escena)
function fade(ta, te, d = 0.35) {
  const k = [];
  if (ta > 0) k.push({ at: 0, value: 0 }, { at: ta, value: 0 });
  else k.push({ at: 0, value: 0 });
  k.push({ at: ta + d, value: 1 });
  if (te - 0.3 > ta + d) k.push({ at: te - 0.3, value: 1 });
  k.push({ at: te, value: 0 });
  return { property: "opacity", keyframes: k };
}
function fadeIn(ta, d = 0.35) {
  const k = ta > 0 ? [{ at: 0, value: 0 }, { at: ta, value: 0 }] : [{ at: 0, value: 0 }];
  k.push({ at: ta + d, value: 1 });
  return { property: "opacity", keyframes: k };
}
function slide(prop, ta, from, d = 0.5) {
  const k = [];
  if (ta > 0) k.push({ at: 0, value: from });
  k.push({ at: ta, value: from, easing: "house" }, { at: ta + d, value: 0 });
  return { property: prop, keyframes: k };
}

export default async (ctx) => {
  const { project, text, rect, media, path, icon } = ctx;
  const p = await project({ dir: "quiz", size: `${W}x${H}`, fps: 30, background: C.bg });
  const logo = await p.add(A + "logo-lfx.png");
  const leo = {};
  for (const n of ["idle", "point", "think", "celebrate"]) {
    leo[n] = await p.add(A + `png/leo-${n}.png`);
    leo[n + "B"] = await p.add(A + `png/leo-${n}-blink.png`);
  }
  const D = TIMING.total;

  // ---------- Fondo: gráfica de velas tenue ----------
  {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const nodes = [rect({ x: 0, y: 0, width: W, height: H, fill: { kind: "radial", stops: [{ offset: 0, color: "#11141B" }, { offset: 1, color: "#07080B" }] } })];
    for (let i = 0; i < 9; i++) nodes.push(rect({ x: 0, y: 260 + i * 180, width: W, height: 1, fill: "#FFFFFF", opacity: 0.035 }));
    let price = 1260;
    const candles = [];
    for (let i = 0; i < 64; i++) {
      const drift = i < 20 ? -6 : i < 30 ? 14 : i < 44 ? -9 : -4;
      const o = price, c = price + drift + (rnd() - 0.5) * 70;
      const hi = Math.min(o, c) - rnd() * 30, lo = Math.max(o, c) + rnd() * 30;
      const x = 20 + i * 26;
      candles.push(rect({ x: x + 7, y: hi, width: 2, height: lo - hi, fill: "#FFFFFF", opacity: 0.09 }));
      candles.push(rect({ x, y: Math.min(o, c), width: 16, height: Math.max(4, Math.abs(c - o)), fill: c < o ? "#FFFFFF" : "#8A8F98", opacity: c < o ? 0.11 : 0.07, radius: 2 }));
      price = c;
    }
    nodes.push(...candles.map((n) => ({ ...n, animate: [{ property: "offsetX", from: 0, to: -540, duration: D, easing: "linear" }] })));
    nodes.push(media({ file: logo, x: 240, y: 1040, width: 600, animate: [{ property: "opacity", keyframes: [{ at: 0, value: 0.04 }, { at: D, value: 0.04 }] }] }));
    p.compose(nodes, { at: 0, dur: D, name: "fondo" });
  }

  // ---------- Leo: poses, respiración y parpadeo ----------
  function leoNodes(segs, sceneDur, x = 24, y = 1262, w = 470) {
    const out = [];
    for (const [pose, t0, t1] of segs) {
      const dur = Math.min(t1, sceneDur) - t0;
      if (dur <= 0.05) continue;
      const bob = [];
      for (let t = 0; t <= dur + 1e-6; t += 1) bob.push({ at: Math.min(t, dur), value: (Math.round(t) % 2) ? -8 : 0, easing: "ease-in-out" });
      const first = t0 === segs[0][1];
      const anim = [
        { property: "offsetY", keyframes: bob.length > 1 ? bob : [{ at: 0, value: 0 }, { at: dur, value: 0 }] },
        { property: "scale", keyframes: [{ at: 0, value: first ? 0.6 : 0.96 }, { at: first ? 0.45 : 0.15, value: 1 }, { at: dur, value: 1 }], },
      ];
      if (first) anim.push({ property: "opacity", keyframes: [{ at: 0, value: 0 }, { at: 0.3, value: 1 }, { at: dur, value: 1 }] });
      out.push(media({ file: leo[pose], x, y, width: w, at: OFF + t0, duration: dur, animate: anim }));
      for (let b = 1.6; b + 0.14 < dur; b += 2.9) {
        out.push(media({ file: leo[pose + "B"], x, y, width: w, at: OFF + t0 + b, duration: 0.14,
          animate: [{ property: "offsetY", keyframes: [{ at: 0, value: (Math.round(b) % 2) ? -8 : 0 }, { at: 0.14, value: (Math.round(b) % 2) ? -8 : 0 }] }] }));
      }
    }
    return out;
  }

  // ---------- Burbuja de diálogo (subtítulos) ----------
  function bubble(chunks, b0, b1, sceneDur) {
    if (!chunks.length) return [];
    const x = 486, y = 1310, w = 566, h = 236;
    const out = [];
    const life = { at: OFF + b0, duration: Math.min(b1, sceneDur) - b0 };
    const pop = [fade(0, life.duration, 0.25), { property: "scale", keyframes: [{ at: 0, value: 0.85, easing: "house" }, { at: 0.3, value: 1 }, { at: life.duration, value: 1 }] }];
    out.push(rect({ x, y, width: w, height: h, fill: C.card, strokeColor: C.em, strokeWidth: 3, radius: 30, ...life, animate: pop }));
    out.push(path({ x: x - 34, y: y + 150, width: 44, height: 44, d: "M44 0 L0 30 L44 40 Z", fill: C.card, ...life, animate: [fade(0, life.duration, 0.25)] }));
    out.push(path({ x: x - 34, y: y + 150, width: 44, height: 44, d: "M44 2 L0 30 L44 38", stroke: { width: 3, color: C.em, cap: "round" }, ...life, animate: [fade(0, life.duration, 0.25)] }));
    for (const [t, c0, c1] of chunks) {
      const dur = Math.min(c1, b1, sceneDur) - c0;
      if (dur <= 0.05) continue;
      out.push(text(t, { x: x + 34, y: y + 34, width: w - 68, height: h - 60, fontFamily: F, fontWeight: 700, fontSize: 40, lineHeight: 1.25, color: C.white,
        at: OFF + c0, duration: dur, animate: [fade(0, dur, 0.2)] }));
    }
    return out;
  }

  // ---------- Cabecera ----------
  function header(n, sceneDur) {
    const out = [text("MÉTODO LFX · RETO 01", { x: 64, y: 128, width: 600, fontFamily: F, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: C.grey, animate: [fade(0, sceneDur)] })];
    for (let i = 0; i < 3; i++) {
      const on = i < n;
      out.push(rect({ x: 830 + i * 64, y: 136, width: 52, height: 12, radius: 6, fill: on ? C.em : "#2A2F38", animate: [fade(0.1 * i, sceneDur)] }));
    }
    out.push(text(`${n}/3`, { x: 830, y: 162, width: 180, align: "right", fontFamily: F, fontWeight: 700, fontSize: 26, color: C.em, animate: [fade(0.2, sceneDur)] }));
    return out;
  }

  // ---------- Escena de pregunta ----------
  function questionScene(q, n) {
    const S = q.dur;
    const nodes = [...header(n, S)];
    nodes.push(text(q.question, { x: 64, y: 230, width: 952, fontFamily: F, fontWeight: 700, fontSize: 62, lineHeight: 1.14, color: C.white,
      animate: [fade(0.1, S), slide("offsetY", 0.1, 40)] }));
    nodes.push(rect({ x: 64, y: 470, width: 120, height: 6, radius: 3, fill: C.em, animate: [fade(0.4, S)] }));

    const letters = ["A", "B", "C"];
    q.options.forEach((opt, i) => {
      const y = 520 + i * 176, h = 150, ta = q.optAt[i];
      const correct = i === q.correct;
      const lines = opt.length > 33 ? 2 : 1;
      const base = [fade(ta, S), slide("offsetX", ta, 80)];
      nodes.push(rect({ x: 64, y, width: 952, height: h, radius: 28, fill: C.card, strokeColor: C.stroke, strokeWidth: 3, animate: base }));
      nodes.push(rect({ x: 96, y: y + 33, width: 84, height: 84, radius: 42, fill: "#1E232B", animate: base }));
      nodes.push(text(letters[i], { x: 96, y: y + 50, width: 84, align: "center", fontFamily: F, fontWeight: 700, fontSize: 40, color: C.white, animate: base }));
      nodes.push(text(opt, { x: 210, y: y + (h - lines * 50) / 2 + 2, width: 770, fontFamily: F, fontWeight: 700, fontSize: 40, lineHeight: 1.25, color: C.white, animate: base }));
      // Revelado
      const tr = q.revealAt, rd = S - tr;
      if (correct) {
        const life = { at: OFF + tr, duration: rd };
        const pop = [fade(0, rd, 0.25), { property: "scale", keyframes: [{ at: 0, value: 1, easing: "house" }, { at: 0.18, value: 1.04, easing: "house" }, { at: 0.4, value: 1 }, { at: rd, value: 1 }] }];
        nodes.push(rect({ x: 64, y, width: 952, height: h, radius: 28, fill: C.emDark, strokeColor: C.em, strokeWidth: 4, ...life, animate: pop }));
        nodes.push(rect({ x: 96, y: y + 33, width: 84, height: 84, radius: 42, fill: C.em, ...life, animate: pop }));
        nodes.push(text(letters[i], { x: 96, y: y + 50, width: 84, align: "center", fontFamily: F, fontWeight: 700, fontSize: 40, color: C.bg, ...life, animate: pop }));
        nodes.push(text(opt, { x: 210, y: y + (h - lines * 50) / 2 + 2, width: 700, fontFamily: F, fontWeight: 700, fontSize: 40, lineHeight: 1.25, color: C.white, ...life, animate: pop }));
        nodes.push(icon("circle-check", { x: 930, y: y + 45, size: 60, color: C.em, strokeWidth: 2.4, ...life,
          animate: [fade(0.15, rd, 0.2), { property: "scale", keyframes: [{ at: 0, value: 0.2, easing: "house" }, { at: 0.15, value: 0.2, easing: "house" }, { at: 0.5, value: 1 }, { at: rd, value: 1 }] }] }));
      } else {
        nodes.push(rect({ x: 60, y: y - 4, width: 960, height: h + 8, radius: 30, fill: C.bg, at: OFF + tr, duration: rd,
          animate: [{ property: "opacity", keyframes: [{ at: 0, value: 0 }, { at: 0.3, value: 0.6 }, { at: rd - 0.3, value: 0.6 }, { at: rd, value: 0 }] }] }));
      }
    });

    // Cuenta regresiva 5 s
    const tc = q.countAt;
    nodes.push(rect({ x: 64, y: 1212, width: 952, height: 12, radius: 6, fill: "#22262D", at: OFF + tc - 0.3, duration: 5.6, animate: [fade(0, 5.6, 0.3)] }));
    nodes.push(rect({ x: 64, y: 1212, width: 952, height: 12, radius: 6, fill: C.em, at: OFF + tc, duration: 5,
      animate: [{ property: "scaleX", keyframes: [{ at: 0, value: 1, easing: "linear" }, { at: 5, value: 0 }] }] }));
    for (let k = 0; k < 5; k++) {
      nodes.push(text(String(5 - k), { x: 0, y: 1060, width: W, align: "center", fontFamily: F, fontWeight: 700, fontSize: 120, color: k >= 3 ? C.em : C.white,
        at: OFF + tc + k, duration: 1,
        animate: [{ property: "opacity", keyframes: [{ at: 0, value: 0 }, { at: 0.12, value: 1 }, { at: 0.8, value: 1 }, { at: 1, value: 0 }] },
          { property: "scale", keyframes: [{ at: 0, value: 1.5, easing: "house" }, { at: 0.35, value: 1 }, { at: 1, value: 0.92 }] }] }));
    }
    nodes.push(...leoNodes(q.leo, S));
    for (const [b0, b1, ch] of q.bubbles) nodes.push(...bubble(ch, b0, b1, S));
    return nodes;
  }

  // ---------- Intro ----------
  {
    const s = TIMING.intro, S = s.dur;
    OFF = s.at;
    const nodes = [
      text("RETO LFX · 01", { x: 0, y: 300, width: W, align: "center", fontFamily: F, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: C.em, animate: [fade(0.2, S), slide("offsetY", 0.2, 30)] }),
      text("PON A PRUEBA", { x: 0, y: 380, width: W, align: "center", fontFamily: F, fontWeight: 700, fontSize: 104, color: C.white, animate: [fade(0.35, S), slide("offsetY", 0.35, 50)] }),
      text("LO QUE", { x: 0, y: 500, width: W, align: "center", fontFamily: F, fontWeight: 700, fontSize: 104, color: C.white, animate: [fade(0.5, S), slide("offsetY", 0.5, 50)] }),
      text("APRENDISTE", { x: 0, y: 620, width: W, align: "center", fontFamily: F, fontWeight: 700, fontSize: 104, color: C.em, animate: [fade(0.65, S), slide("offsetY", 0.65, 50)] }),
      rect({ x: 480, y: 770, width: 120, height: 6, radius: 3, fill: C.em, animate: [fade(0.9, S)] }),
    ];
    const chips = ["3 PREGUNTAS", "5 SEGUNDOS", "1 RESPUESTA"];
    chips.forEach((c, i) => {
      const x = 64 + i * 324;
      nodes.push(rect({ x, y: 850, width: 300, height: 92, radius: 46, fill: C.card, strokeColor: C.stroke, strokeWidth: 3, animate: [fade(1.1 + i * 0.15, S), slide("offsetY", 1.1 + i * 0.15, 30)] }));
      nodes.push(text(c, { x, y: 878, width: 300, align: "center", fontFamily: F, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: C.white, animate: [fade(1.1 + i * 0.15, S), slide("offsetY", 1.1 + i * 0.15, 30)] }));
    });
    nodes.push(...leoNodes(s.leo, S));
    for (const [b0, b1, ch] of s.bubbles) nodes.push(...bubble(ch, b0, b1, S));
    p.compose(nodes, { at: s.at, dur: S, name: "intro" });
  }

  TIMING.questions.forEach((q, i) => { OFF = q.at; p.compose(questionScene(q, i + 1), { at: q.at, dur: q.dur, name: `pregunta-${i + 1}` }); });

  // ---------- Resultado ----------
  {
    const s = TIMING.result, S = s.dur;
    OFF = s.at;
    const nodes = [
      text("¿CUÁNTAS", { x: 0, y: 330, width: W, align: "center", fontFamily: F, fontWeight: 700, fontSize: 112, color: C.white, animate: [fade(0.1, S), slide("offsetY", 0.1, 50)] }),
      text("ACERTASTE?", { x: 0, y: 460, width: W, align: "center", fontFamily: F, fontWeight: 700, fontSize: 112, color: C.em, animate: [fade(0.25, S), slide("offsetY", 0.25, 50)] }),
      text("COMENTA TU RESULTADO", { x: 0, y: 630, width: W, align: "center", fontFamily: F, fontWeight: 700, fontSize: 38, letterSpacing: 6, color: C.grey, animate: [fade(0.5, S)] }),
    ];
    ["1/3", "2/3", "3/3"].forEach((c, i) => {
      const x = 120 + i * 300, ta = 0.8 + i * 0.2;
      nodes.push(rect({ x, y: 750, width: 240, height: 140, radius: 32, fill: i === 2 ? C.emDark : C.card, strokeColor: i === 2 ? C.em : C.stroke, strokeWidth: 3,
        animate: [fade(ta, S), { property: "scale", keyframes: [{ at: 0, value: 0.6 }, { at: ta, value: 0.6, easing: "house" }, { at: ta + 0.45, value: 1 }, { at: S, value: 1 }] }] }));
      nodes.push(text(c, { x, y: 783, width: 240, align: "center", fontFamily: F, fontWeight: 700, fontSize: 64, color: i === 2 ? C.em : C.white,
        animate: [fade(ta, S), { property: "scale", keyframes: [{ at: 0, value: 0.6 }, { at: ta, value: 0.6, easing: "house" }, { at: ta + 0.45, value: 1 }, { at: S, value: 1 }] }] }));
    });
    nodes.push(...leoNodes(s.leo, S));
    for (const [b0, b1, ch] of s.bubbles) nodes.push(...bubble(ch, b0, b1, S));
    p.compose(nodes, { at: s.at, dur: S, name: "resultado" });
  }

  // ---------- Cierre LFX (4 s, de abajo hacia arriba) ----------
  {
    const s = TIMING.outro, S = s.dur;
    const up = (ta) => [fadeIn(ta), slide("offsetY", ta, 140, 0.7)];
    const nodes = [
      rect({ x: 0, y: 0, width: W, height: H, fill: C.bg, animate: [{ property: "opacity", keyframes: [{ at: 0, value: 0 }, { at: 0.3, value: 1 }, { at: S, value: 1 }] }] }),
      media({ file: logo, x: 205, y: 705, width: 686, animate: up(0.2) }),
      text("COMUNIDAD GRATUITA LFX", { x: 0, y: 1062, width: W, align: "center", fontFamily: F, fontWeight: 700, fontSize: 46, letterSpacing: 4, color: C.white, animate: up(0.45) }),
      text("Link en mi descripción", { x: 0, y: 1132, width: W, align: "center", fontFamily: F, fontWeight: 700, fontSize: 36, color: C.em, animate: up(0.6) }),
      rect({ x: 148, y: 780, width: 4, height: 520, radius: 2, fill: C.em, animate: [fadeIn(0.3), { property: "scaleY", keyframes: [{ at: 0, value: 0 }, { at: 0.3, value: 0, easing: "house" }, { at: 1.0, value: 1 }, { at: S, value: 1 }] }] }),
      path({ x: 122, y: 772, width: 56, height: 32, d: "M2 30 L28 4 L54 30", stroke: { width: 4, color: C.em, cap: "round" }, animate: up(0.9) }),
    ];
    p.compose(nodes, { at: s.at, dur: S, name: "cierre" });
  }

  // ---------- Audio ----------
  if (TIMING.audio) {
    for (const a of TIMING.audio) {
      const h = await p.add(a.file);
      p.cut(h, { at: a.at, ...(a.dur ? { dur: a.dur } : {}) });
    }
  }

  if (PREVIEW) {
    for (const [t, out] of PREVIEW) await p.frame(t, out);
  }
};
