# Guion de la serie

## Estructura que ha funcionado (vídeos 5 Soros y 6 Tortugas)
1. **Gancho** (0–8 s): una cifra y una contradicción. «Veintitrés desconocidos ganaron 175 millones…».
2. **Contexto**: lugar y año, el protagonista, el conflicto (apuesta, enemigo, crisis).
3. **Desarrollo**: 3–5 frases que enseñan algo útil (las reglas, el mecanismo, el error).
4. **Resultado**: la cifra final con contador.
5. **Lección**: una frase que se recuerde («El secreto no era el sistema. Era la DISCIPLINA.»).
6. **CTA**: «Comenta PALABRA. Próximo: <adelanto con gancho>». El adelanto debe coincidir con el siguiente
   vídeo que se hará de verdad.

~150 palabras ≈ 58 s con la voz acelerada. Más de 160 palabras no cabe en 60 s.

## Comprobación de datos
- Cada cifra, fecha y lugar con fuente (Wikipedia + otra). Si no hay acuerdo, se dice algo menos concreto
  («una fortuna») antes que una cifra dudosa.
- Quita lo que solo sale en una fuente débil («hasta 80 % anual», edades, anécdotas).
- Ojo con lugares: Soros/Tortugas → la reunión fue en Chicago, no en Boston.
- Conceptos financieros exactos: p. ej. en Turtle, 1N = 1 % de la cuenta y stop a 2N ≈ 2 % de riesgo.
- Nada de promesas de ganancia ni «sin riesgo». Ejemplos marcados como ejemplo.
- Enseña la lista de correcciones junto al guion: Richard la lee antes de aprobar.

## Formato en plan.json
- `texto`: lo que se lee en subtítulos, con cifras («1.600», «175»).
- `voz`: lo que dice la voz, con números en letra («mil seiscientos») y siglas como se pronuncian.
- Términos técnicos en inglés y en MAYÚSCULAS, como salen en las apps (TREND FOLLOWING, STOP LOSS).
- `sinSubtitulos: true` en gancho, cifras grandes, lección y CTA (el texto ya está en pantalla).
- Cada frase lleva una «tarjeta» corta en inglés (THE GREATEST TRADING EXPERIMENT, RULE 2 · 1N = 1%).

## GUION.md en el repo
Tabla `| # | Voz | Tarjeta (EN) |`, luego «Correcciones sobre el borrador» y «Fuentes».
