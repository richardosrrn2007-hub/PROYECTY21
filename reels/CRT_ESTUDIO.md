# CRT · estudio para la serie y para analizar gráficos

Fuentes (de Richard, no están en el repo):
- PDF «Candle Range Theory (CRT)» · Legacy Trading, 20 fichas — `~/Downloads/VIDEOS ORIGUINE/MATERIALSTA/candlerangetheorycrtbylegacytrading-251009231817-938a5865.pdf`
- Clase «Wyckoff, CRT & MSNR» (transcripción) — `~/Downloads/HURAKAN/comprobacion/WYCKOFF,CRT_&_MSNR.txt`
- Vídeo de referencia «CRT-Fondeo-LEO-Fluido» — `~/Downloads/CRT-Fondeo-LEO-Fluido (1).mp4`
- Definiciones públicas: LuxAlgo, TradingFinder (coinciden con lo de abajo).

Resumen en nuestras palabras (no copia literal).

## 1. Qué es
- Cada vela es un rango (en cualquier temporalidad). Ese rango puede **barrerse** (mecha fuera y vuelta dentro = *turtle soup*, TS), **romperse** (cierre fuera) o **re-testearse**.
- CRT clásico = **3 velas en temporalidad mayor (HTF)** = Power of 3 (PO3) = **AMD**:
  - **C1 · Acumulación:** marca el rango. Se marcan su máximo y su mínimo.
  - **C2 · Manipulación:** barre un extremo de C1 y **cierra dentro**. Aquí están las entradas más avanzadas.
  - **C3 · Distribución:** va hacia el extremo contrario. Es la entrada más fácil y de más probabilidad.
- Variante para empezar: **CRT + inside bar** (varias velas dentro del rango de C1): tarda más en formarse, más probabilidad.
- El sesgo HTF se lee mirando si la vela HTF fue barrida (TS) o no.

## 2. El barrido (TS) y el cambio de estado (CSD)
- **Alcista:** mecha por debajo del mínimo anterior y cierre por encima (de vuelta dentro).
- **Bajista:** mecha por encima del máximo anterior y cierre por debajo.
- Regla de la clase de Wyckoff/CRT: C2 tiene que **cerrar contraria** (si barre un mínimo, cierra alcista; si barre un máximo, cierra bajista). Sacar liquidez no basta.
- **CSD** (change in state of delivery): cerrar por encima del último order block que dejó el precio antes de girar.
- Forma de la vela (ficha OLHC/OHLC): en una vela alcista el precio suele ir primero abajo (open → low → high → close); en una bajista, primero arriba (open → high → low → close). La mecha contraria es la manipulación.

## 3. Dónde tiene que pasar (lo que separa un CRT bueno de uno cualquiera)
El barrido **tiene que darse en una zona clave de temporalidad mayor**:
oferta/demanda (SND), soporte/resistencia (SNR), order block (OB), gap (double maru), breaker, QM (QMR/QMC/QMM), SNR C1/C2/C3.

| Zona clave en… | CRT en… |
|---|---|
| H4, H1 | 15M |
| D1, H4 | H1 |
| W, D1 | H4 |
| M, W | D1 |
| Y, M | W |

→ Un CRT **diario** (como el de junio 2026 del vídeo 4) se valida con zonas **semanales/mensuales**. En el vídeo 4 no se comprobó; por eso el guion no afirma que mayo «no tuviera zona».

## 4. Entradas
- **Modelo 1 · en C2 (TS):** al barrer en la zona clave, bajar de temporalidad y entrar con OB / CSD.
- **Modelo 2 · en C3:** alcista → comprar **por debajo de la apertura de C3**, en el 50 % del rango de C2; bajista → vender **por encima de la apertura de C3**, en el 50 % de C2.
- Objetivos: **TP1 en el 50 %** del rango, **TP2 en el máximo/mínimo de C1** (el extremo contrario).
- Temporalidad de entrada según la del CRT: anual→W, mensual→D1, semanal→H4, diario→H1, H4→M30/M15, H1→M15/M5, M30/M15→M1.
- Vídeo de LEO (mismo modelo, en 1H→15M): rango 1H → ruptura fallida del mínimo → en 15M rompe el máximo local → retroceso al FVG → compra, stop bajo el barrido, objetivo el máximo del rango (1:6).

## 5. Las 5 confirmaciones
1. **Zona clave HTF** (ver tabla): el precio reacciona con fuerza en ella.
2. **CRT de LTF dentro del CRT de HTF:** marcar el CRT en HTF; cuando el precio toca un extremo, bajar de temporalidad y dibujar el CRT en la vela que tocó (p. ej. H4 → H1).
3. **Lugar de entrada** (tabla de temporalidades de entrada).
4. **Rango a su hora:** en H4, velas de 1, 5 y 9 (am/pm, hora de Nueva York); 1.ª semana del mes; lunes y viernes.
5. **Barrido a su hora:** el TS tiene que formarse en una hora concreta; si no, no se opera (ej. semana 1: rango lunes/viernes, TS a las 5 pm, 9 pm o 5 am en H4).
- Clase Wyckoff/CRT: el CRT de HTF (p. ej. 2H) marca un posible *strong low/high*; la temporalidad baja (15–30M) solo sirve para afinar la entrada. Esperar el cierre de la vela HTF.

## 5b. Estructura y liquidez (Bootcamp 3.0 · fichas en `~/Downloads/VIDEOS ORIGUINE/MATERIALSTA/`)
- **Dirección del precio:** fractales (máximos/mínimos ascendentes o descendentes); **CHoCH** = cambio de estructura, **BOS** = continuación. **Sweep** = el precio penetra el nivel con mecha; **ruptura** = cierra con cuerpo fuera. Rango operativo entre Swing High y Swing Low; estructura swing e interna (iCHoCH/iBOS, ej. 1H/15M) y su alineación. Un CHoCH no garantiza giro. Usar siempre el mismo criterio de cierre.
- **Liquidez:** zonas alrededor de máximos, mínimos, líneas de tendencia y canales; **EQH/EQL** (máximos/mínimos iguales) como candidatos a concentrar stops; **liquidez externa** en los extremos swing del rango e **interna** dentro; recorrido de interna a externa. Sesiones Asia/Londres/Nueva York con secuencia AMD (comprobar horarios y horario de verano antes de llevarlos a un gráfico real).
- **Regla de redacción:** dónde están los stops es una **hipótesis**, no algo que se vea en las velas → en guiones, «donde suele haber stops» mejor que «donde estaban los stops».
- Un tema principal por vídeo, con su secuencia, condición de entrada e invalidación. No mezclar casos distintos como si fueran una sola operación.
- Encaje con CRT: el barrido de C2 es un *sweep* (mecha), no una ruptura (cuerpo); el extremo de C1 suele ser liquidez externa del rango.

## 6. Checklist para analizar un gráfico (lo que hago yo antes de usar un ejemplo)
1. Temporalidad del CRT y su temporalidad de zona clave (tabla 3).
2. C1: máximo, mínimo, fecha. C2: ¿barre un extremo? ¿cierra dentro? ¿cierra contraria?
3. ¿El barrido toca una zona clave de la temporalidad mayor? (marcarla con su origen)
4. Hora/día del rango y del barrido (confirmaciones 4 y 5).
5. Resultado real: ¿C3 (o la siguiente) llegó al 50 % y al extremo de C1 antes de romper el extremo de C2 (invalidación)?
6. En el vídeo: precios reales (TradingView OANDA:XAUUSD), niveles con el dato real aunque el dibujo pase por `continua()`; nunca afirmar algo que no se haya comprobado.

## 7. Uso en la serie
- **Parte 1 (vídeo 4, el doji):** rango → barrido → cierre dentro → objetivo; «necesita una zona clave».
- **Parte 2 · CRT paso a paso:** zona clave HTF + entrada (modelo C3 al 50 % de C2, TP1 50 %, TP2 extremo de C1) con oro real; estructura del vídeo de LEO.
- **Parte 3:** confirmaciones de tiempo (horas, días, semana del mes) y CRT dentro de CRT; AMD por sesiones.
