# Vídeo 5 · El hombre que le declaró la guerra a Inglaterra (Soros, Miércoles Negro)

59,3 s + 2 s de cierre de marca. Voz: «Narradora de jujutsu kaisen» (ElevenLabs), 3 tomas unidas sin regenerar; solo se acortan silencios reales (< −40 dB) a 0,25 s, acelerada 1,19× y normalizada a −14 LUFS. Mundo: noche azul, planeta de la serie, luna roja, Londres en plata. Paleta 60-30-10: fondo oscuro, plata/blanco, oro; rojo #B8432F solo como acento dramático.

| # | Voz | En pantalla |
|---|---|---|
| 1 | Este hombre hundió la moneda de un país entero... y ganó mil millones de dólares. En un solo día. | Soros de espaldas, 3 pantallas, BOOM: UN PAÍS ENTERO · 1.000.000.000 $ (caja dorada) |
| 2 | Inglaterra, 1992. La libra estaba atada a un precio artificial. El Banco de Inglaterra juraba defenderla... cueste lo que cueste. | La cámara se lanza al planeta: Gran Bretaña en plata, Londres en oro; sello 1992; Londres y el Big Ben suben; £ atada al reloj |
| 3 | Un inversionista húngaro miraba la misma pantalla que todos. Pero él vio lo que nadie quería ver: eso no se sostiene. | GBP/DEM 2,7784, ojos reflejados, grieta en la cadena; «eso no se sostiene» a mano |
| 4 | George Soros apostó 10.000 millones de dólares contra la libra. Si fallaba, perdía poco. Si acertaba, ganaba una fortuna. El banco compraba sin parar... y Soros seguía vendiendo. | Balanza: Soros lanza fichas al banco; 10.000 MILLONES $; POCO RIESGO / MUCHO PREMIO |
| 5 | Un miércoles por la noche, Inglaterra se rindió. La libra quedó libre... y se desplomó. | 16 SEPT 1992 · 19:00 LONDRES; la cadena se rompe; velas reales cayendo; −14 % |
| 6 | Los diarios lo llamaron el hombre que quebró al Banco de Inglaterra. | Periódico genérico «LONDON · 1992»; la cámara se aleja del planeta |
| 7 | No usó velas ni indicadores. Usó una sola regla: cuando tienes razón... ve con todo. | Velas e indicador tachados; folio bajo la lámpara |
| 8 | El precio lo mueve siempre lo mismo... el miedo y la codicia. | Polvo de oro, la luna sube: MIEDO / Y CODICIA |
| 9 | ¿Apostarías contra un banco entero? Comenta LIBRA. | £ de plata agrietada; COMENTA LIBRA (caja dorada) |
| 10 | En el próximo: la apuesta que convirtió a gente normal... en los mejores traders de la historia. | Pin en Boston 1983; tortugas sobre un gráfico |

## Cambios sobre el guion original
- Quitadas (recortando el audio, sin regenerar) para no pasar de 60 s: «Si fallaba, perdía poco. Si acertaba, ganaba una fortuna», «No usó velas ni indicadores» y la escena «El precio lo mueve siempre lo mismo… el miedo y la codicia». Se mantiene «Un inversionista húngaro…» porque sin ella «Pero él vio…» no tiene sujeto.
- Escena 2 en 3D (`Globo3D.tsx`, @remotion/three): planeta de la serie con continentes de puntos y arcos de dinero hacia Londres → mapa del Reino Unido de 1992 con relieve y ciudades → Banco de Inglaterra (Threadneedle St.) con calle de época y teletexto Ceefax.
- Escena 4: la balanza pasa a ser el pulso en la banda del ERM (central 2,95, suelo 2,778) con los cierres reales del BoE.
- «Todo o nada» → «Si fallaba, perdía poco. Si acertaba, ganaba una fortuna»: con la libra en el suelo del ERM el riesgo era pequeño (apuesta asimétrica).
- Quitado «300 años de historia lo confirman» para no pasar de 60 s.
- Sin Big Ben a medianoche: el anuncio fue por la tarde-noche (19:00 según Wikipedia; otras fuentes 19:40).
- El titular se muestra en un periódico genérico: no hemos encontrado qué diario lo usó primero.

## Datos
- Continentes del globo: Natural Earth 110 m (dominio público) vía el paquete `world-atlas`, convertido a puntos en `proyecto/src/propias/tierra.ts`.
- Tipo central de la libra en el ERM: 2,95 DM; suelo 2,7780 DM.
- Libra/marco: Bank of England, serie XUDLDMS, diario (`proyecto/src/propias/libra.ts`, CSV en `boe_1992.csv`). 16-09-1992: 2,7784 → 05-10-1992: 2,393 (−14 %). Libra/dólar (XUDLUSS): 2,0036 (2 sep) → 1,5105 (27 nov), −25 %.
- Posición ~10.000 M $ y ganancia ~1.000 M $: estimaciones de prensa (World Finance, MoneyWeek, Benzinga; Wikipedia: «más de 1.000 M £»). Sin fuente primaria.
- Hora: Wikipedia «Black Wednesday» (tipos 10 → 12 % a las 10:30; anuncio de Lamont a las 19:00).
