# Revisión de diseño · Web Comunidad LFX

Revisión hecha con la skill **UI Design Review** sobre la web renderizada en escritorio (1440 px), tableta (768 px) y móvil (375 px), con medición automática de contraste y tamaño de botones. No incluye ejemplos de UXKIN, porque no está conectado.

- **Para qué es la página:** convencer a alguien interesado en trading de que LFX es serio y de que escriba a Leo.
- **Quién la usa:** personas que llegan desde Instagram o TikTok, casi siempre desde el móvil.
- **La única acción que importa:** escribir a Leo por WhatsApp o entrar al canal de Telegram.

## Lo que ya funciona

- La portada gris con la foto del trader y "COMUNIDAD LFX" transmite seriedad y no parece una plantilla.
- El manifiesto que se ilumina palabra a palabra y la foto del oro fundido son el momento más memorable de la página.

---

## 1. Hay que arreglarlo

### 1.1 La tableta (768 px) se ve rota
- **Dónde:** portada.
- **Problema:** entre 760 y 1024 px se usa el diseño de escritorio a escala reducida. Los textos bajan a 9–10 px, "Asia · New York" queda tapado por el botón "Hablar con Leo", el marco de cifras se monta sobre la foto y "Comunidad VIP" se parte en dos líneas.
- **Arreglo:** usar el diseño de móvil hasta 1024 px. En tableta, la foto y los textos van en dos columnas.

### 1.2 El botón flotante VIP tapa el contenido en todas las pantallas
- **Dónde:** de la segunda pantalla en adelante.
- **Problema:** queda encima de títulos, de las flechas de los carruseles y de los comentarios. En el móvil ocupa todo el ancho del pie.
- **Arreglo:** convertirlo en una barra fina abajo, con espacio reservado debajo del contenido, que se oculte cuando ya hay otro botón de WhatsApp a la vista y en la parte de preguntas y pie.

### 1.3 "Señal verificada" y "+900 pips" pueden dar problemas legales
- **Dónde:** panel "Alumnos que operan con un plan".
- **Problema:** el sello "Señal verificada" da a entender que un tercero lo comprobó, y "+900 pips" es el mejor resultado de una sola señal presentado como cifra principal. En publicidad de trading, eso es lo que suelen denunciar las plataformas y los reguladores.
- **Arreglo:** quitar el sello y cambiar la tarjeta por un dato que describa la comunidad, no una ganancia, por ejemplo "3 canales de señales · sesiones en vivo de lunes a viernes". Los resultados ya tienen su propia sección, con el aviso de riesgo.
- **Sobre el "4.5/5":** conviene decir de dónde sale (por ejemplo, "encuesta a miembros, noviembre 2026"). Si no hay una fuente, es mejor quitarlo.

### 1.4 Textos ilegibles
| Dónde | Contraste | Arreglo |
|---|---|---|
| Etiquetas de 10,5 px en la tarjeta de la foto del escritorio | 1,2–1,6 : 1 | Mínimo 12 px, con fondo oscuro detrás |
| "XAUUSD · FOREX · ÍNDICES" sobre la chaqueta | 1,4 : 1 | Quitarlo o ponerlo sobre la placa oscura |
| Líneas inactivas del índice y notas en gris #6f6f6f | 4,2 : 1 | Subir el gris a #9a9a9a (≥ 4,5 : 1) |

### 1.5 Botones demasiado pequeños para el dedo
- **Barras del recorrido de la academia:** 14 px de alto. Subirlas a 44 px de zona táctil.
- **Menú del móvil:** 34 px de alto. Subirlo a 44 px.
- **Miniaturas ocultas del índice:** se pueden enfocar con el teclado aunque no se ven. Hay que quitarlas del recorrido del teclado cuando están cerradas.

---

## 2. Conviene arreglarlo: lo que hace que parezca hecha con IA

### 2.1 Demasiadas "etiquetas de plantilla"
- **Problema:** hay 50 textos en MAYÚSCULAS y 27 puntos medios ("A · B · C"), una etiqueta encima de cada título ("(01) LA ACADEMIA…", "02 · EL RECORRIDO") y una flecha ↗ en todos los botones.
- **Arreglo:**
  - Quitar las etiquetas de encima de los títulos.
  - Cambiar los puntos medios por frases normales.
  - Dejar la flecha solo en los enlaces que salen de la web.

### 2.2 Numeración donde no hay secuencia
- **Problema:** "Todo en un solo lugar" va numerado del 01 al 07, pero no es un orden.
- **Arreglo:** quitar los números. Solo los pasos de "Cómo funciona" son una secuencia y pueden llevarlos.

### 2.3 Se repite la misma historia
- **Problema:** "¿Cómo funciona?" (4 pasos) y "¿Cómo aprovechar las señales?" (4 pasos) cuentan casi lo mismo. El botón "Quiero ser parte" aparece 9 veces. La página mide unos 10 200 px en escritorio y 11 000 px en móvil.
- **Arreglo:** unir las dos en **una sola secuencia de 4 pasos con captura grande**: unirse, elegir canal, copiar en MT5 y seguir el resultado. Dejar 3 botones de contacto en total, más la barra fija. La página bajaría alrededor de un 25 %.

### 2.4 Tarjetas idénticas
- **Problema:** pasos, señales y comentarios van en la misma caja redondeada y gris, y todas se levantan al pasar el ratón.
- **Arreglo:** los pasos y las señales, sin caja: captura grande y texto debajo, separados por líneas finas. Quitar el efecto de levantarse en todo salvo en las capturas que se pueden ampliar.

### 2.5 Títulos con tres estilos distintos
- **Problema:** conviven títulos en mayúsculas anchas (Archivo), títulos en minúscula (Inter) y dos formatos de etiqueta ("(01)" y "02 ·").
- **Arreglo:** un solo sistema. Mayúsculas anchas para los títulos de sección y minúscula para todo lo demás.

### 2.6 Textos de botones
- **Problema:** hay varios nombres para la misma acción ("Quiero ser parte", "Conocer los planes", "Hablar con Leo", "Quiero comenzar en la Comunidad VIP"), y todos abren el mismo WhatsApp.
- **Arreglo:**
  - **"Escribir a Leo por WhatsApp"** para todos los botones de WhatsApp.
  - **"Ver el canal de Telegram"** para todos los de Telegram.

### 2.7 Detalles de la plantilla original
- **"(’26)"** junto al título no significa nada para LFX. Quitarlo.
- **"Desde 2025":** confirmar que es real.

---

## 3. Pulido

- **Testimonios:** las capturas en gris pierden el verde de los chats. Mantenerlas a color, con algo menos de saturación.
- **Recorrido de la academia:** cuando haya video real, cambiarlo por el video, con el sonido apagado al inicio.
- **Pie de página:** añadir el aviso de riesgo en una línea, encima del logo.

---

## Orden recomendado

1. Diseño de tableta y barra fija de WhatsApp (1.1 y 1.2).
2. Sello "verificada", "+900 pips" y "4.5/5" (1.3).
3. Contraste y tamaño de los botones (1.4 y 1.5).
4. Quitar etiquetas, numeración y repeticiones, y unir los dos bloques de pasos (2.1 a 2.3).
5. Tarjetas, títulos y textos de botones (2.4 a 2.7).

Para comprobarlo automáticamente cuando la web esté online, existe un detector gratuito de "aspecto IA": https://uxkin.com/tools/ai-slop-detector
