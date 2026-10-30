# Reto Oro (XAU/USD H4) — punto de partida

- Brief: storyboard "El Reto del Punto de Interés" (pantalla partida: Leo arriba 30 %, gráfica oscura abajo 70 %),
  respuesta B, estructura HH/HL, Fibonacci 71–79 %, Entry/SL/TP, cierre "Comenta LISTO". Voz: LEOPUPRIME.
- Referencia: video con presentador arriba, gráfica abajo, subtítulos de 1 palabra en la línea divisoria (letra condensada tipo Anton).
- Cambios acordados: no destacar la B durante la cuenta atrás; Leo animado arriba (o video real si Leo graba);
  velas bajistas #4A4F5A con borde (no #333 sobre #0B0E14).
- No hay conector de TradingView en la sesión: datos reales de Yahoo (GC=F, futuros del oro) agregados a 4h → `src/gold_h4.json`.
- `src/find_gold.py` encontró 6 casos reales (impulso HH/HL, toque en 71–79 %, llega al TP sin tocar el SL): `candidatos-oro.png`.
  Más limpios: n.º 4 (nov 2025, 3935→4250, toque 4010) y n.º 5 (abr 2026, 4580→4888, toque 4665).
- Motor a reutilizar: `leo-videos/reto-poi/src/` (poi3…poi8, render-poi.js, sound_poi.py, final.sh).
