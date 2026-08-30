# Design Package — RDO Trading & Education VIP (Tier 1, trimmed)

## 1. Brand premise
Disciplina. Todo el sitio enseña y vende una sola idea: el trading que rinde no viene de señales sueltas, viene de disciplina. El video mismo lo actúa: oro que cae y se ordena solo, en calma, en vez de caos.

## 2. Palette
```css
:root{
  --canvas:#0d0b08;        /* near-black, tinted warm toward the gold grade */
  --panel:#17130d;
  --accent:#c9962f;        /* RDO gold */
  --accent-hover:#e0b04a;
  --accent-muted:#c9962f66;
  --text-secondary:#c9c2b3;
  --text-primary:#f4efe4;
}
```

## 3. Type trio
- Display: Fraunces (serif, real character, authority)
- Body: Manrope (quiet, clean)
- Mono: Space Mono (small labels, ticker-style readouts)

## 4. Band map (4 bands, ~400vh hero)

| Band | Range | Footage moment | Copy | Entrance |
|---|---|---|---|---|
| 1 | 0.00–0.20 | oro cayendo en la oscuridad | "RDO Trading & Education" (kicker) / "Donde el trading deja de ser suerte." | drift-down |
| 2 | 0.22–0.55 | el oro cruza un velo de niebla dorada | "Las señales solas no enseñan a operar. La disciplina, sí." | blur-to-sharp |
| 3 | 0.58–0.85 | el oro se acomoda en barras de velas | "Análisis profesional. Gestión de riesgo real. Acompañamiento, no abandono." | word-punch |
| 4 | 0.86–1.00 (settle) | el gráfico dorado, quieto y perfecto | "RDO VIP." / "Disciplina hoy, libertad mañana." / CTA: "Conoce la comunidad" | word-by-word rise |

## 5. Static-hero copy block
Headline: "Donde el trading deja de ser suerte."
Subline: "Educación, señales con respaldo y una comunidad que no te suelta la mano."
CTA: "Conoce la comunidad"

## 6. Below-fold outline
1. Qué obtienes (benefits, verbatim from brand material): Educación profesional, Señales de alta calidad, Acompañamiento continuo, Gestión de riesgo, Psicotrading y disciplina, Comunidad VIP.
2. Cómo funciona (5 steps, verbatim): Regístrate, Realiza tu depósito, Opera y mantente activo, Accede a la comunidad, Crece con nosotros.
3. Interactive moment: "la prueba de disciplina" — press and hold, scattered gold particles align into the RDO candlestick mark; release early and it scatters back.
4. Planes (verbatim pricing): Mensualidad estándar €40 / 3 meses €100 (ahorra €20) / 6 meses €150 (ahorra €90, solo €25/mes).
5. FAQ (answers real objections found in research): ¿Es esto una estafa? / ¿Las señales realmente funcionan? / ¿Necesito experiencia previa? / ¿Por qué operar con PUPrime?
6. Proof section: NO invented testimonials (never fabricate fake reviews/quotes). Ask user for real testimonials or numbers; until then, use structural trust only (broker partnership, program mechanics, transparency of the rebate program).
7. Final CTA + form. Form handling: TBD with user in Phase 8 (mailto vs form service vs external broker link).
8. Footer.

## 7. Vector layer plan
Self-drawing SVG line motif echoing a candlestick/uptrend line, drawn on scroll, reused as a divider between sections. Whisper-level drifting gold particles as the fixed background layer.

## 9. Copy gate line
Every viewer-facing line above ships verbatim once approved. Final build must pass the Phase 9 grep gate (zero em dashes, zero stock words) and the AI-tell sweep before anyone sees it.
