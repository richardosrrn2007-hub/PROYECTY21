# LFX: "El descenso" (imágenes para ChatGPT)

Web de una sola página con la estructura de Hollowmere: 5 escenas ilustradas apiladas, 4 franjas de roca que las unen y todo el movimiento hecho con código.
Hilo conductor: **un río de oro líquido** que baja por toda la página. Bajar con el scroll es entrar en la disciplina: empieza de noche y termina al amanecer.

## Marca (solo se toma el logo como referencia)

| Token | Valor | Origen |
|---|---|---|
| `--night` | `#111317` | Fondo, carbón casi negro |
| `--panel` | `#1B1F25` | Carbón de la marca |
| `--gold` | `#E7B744` | Cuernos del logo |
| `--gold-deep` | `#D09F2D` | Sombra del oro |
| `--ink` | `#F3F2EB` | Crema del logo |
| `--bull` | `#2FD39A` | Solo velas alcistas y detalles mínimos |

Regla 60-30-10: 60 % carbón, 30 % crema, 10 % oro. El verde no pasa del 2 %.

## Escenas

| # | Archivo | Sección | Escena |
|---|---|---|---|
| 1 | `scene-1-hero.png` | Hero "LFX" | Cañón nocturno con dos agujas de roca curvas como cuernos alrededor de una luna dorada. Del centro cae la cascada de oro |
| 2 | `scene-2-vault.png` | Qué aprendes | Bóveda de estudio subterránea: libros, pizarras con velas y una torre de orbes dorados |
| 3 | `scene-3-gears.png` | Cómo funciona | Engranaje gigante movido por el oro y 5 plataformas de piedra |
| 4 | `scene-4-foundry.png` | Planes | Fundición: 3 tubos llenan 3 moldes de lingote |
| 5 | `scene-5-lake.png` | Comunidad y CTA | Boca de cueva frente a un lago al amanecer con linternas doradas |

## Cómo trabajar en ChatGPT

1. Abre **un solo chat** para todas las imágenes, así mantiene el estilo.
2. Pega primero el **mensaje 0**: fija el estilo y no genera nada.
3. Pega las imágenes de una en una, en orden. Si una sale mal, pide el cambio en el mismo chat ("repite la 2, pero con la cascada más estrecha").
4. Descarga cada imagen en PNG, con el nombre de la tabla.
5. Pásamelas todas juntas. El recorte, el tamaño final y las medidas los hago yo.

Formatos: las escenas y las franjas en **horizontal 3:2 (1536 × 1024)**, los sprites en **cuadrado (1024 × 1024)**.

---

### Mensaje 0: estilo (pegar primero)

```
Vamos a crear una serie de 10 ilustraciones para una web. Todas deben tener exactamente el mismo estilo:

- Ilustración vectorial plana, formas angulares cortadas como esquirlas de cristal, textura granulada tipo risografía, luz de contorno brillante en los bordes.
- Paleta: carbón casi negro (#111317) y carbón azulado (#1B1F25) como base, crema (#F3F2EB) para las luces frías, oro (#E7B744) y oro oscuro (#D09F2D) para todo lo que brilla. Un verde (#2FD39A) solo en detalles diminutos.
- Atmósfera: elegante, seria, de lujo silencioso. Nada infantil, nada de dibujos animados, sin personajes.
- En ninguna imagen debe haber texto, letras, números, logos ni símbolos.

Confírmame que lo entiendes y espera mi primera imagen.
```

### 01. `scene-1-hero.png` (horizontal 3:2)

```
Imagen 1. Panorámica horizontal 3:2 de un cañón de noche. A los lados, torres y acantilados de obsidiana negra con pequeñas ventanas cálidas, como una ciudad dormida tallada en la roca. Arriba, en el centro, a un 25 % desde el borde superior, una gran luna dorada pálida. A su izquierda y a su derecha se elevan dos agujas de roca curvas que se cierran hacia ella como dos cuernos dorados enormes. Una cascada de oro líquido brillante nace en el centro exacto de la imagen (a mitad de altura), cae en una poza dorada con niebla a un 73 % de altura y sigue como una segunda cascada hasta el borde inferior, siempre centrada. El cielo alrededor de la luna y las colinas oscuras justo debajo de ella quedan tranquilos, sin detalles, para poner un título encima. El 8 % superior y el 8 % inferior de la imagen se funden en carbón liso #111317. Sin texto, letras ni logos.
```

### 02. `scene-2-vault.png` (horizontal 3:2)

```
Imagen 2, mismo estilo. Panorámica horizontal 3:2 de una bóveda de estudio subterránea tallada en roca. La cascada de oro líquido entra por arriba entre el 40 % y el 58 % del ancho y cae hasta una poza brillante a un 85 % de altura. A la derecha, una torre alta de cristal llena de frascos redondos, cada uno con un orbe dorado que brilla suave. Abajo a la izquierda, un escritorio con una lámpara de latón y un globo de cristal luminoso. Estanterías con libros antiguos y pizarras oscuras con velas japonesas dibujadas a mano, solo formas, sin números. El tercio superior izquierdo es una pared de roca en sombra, tranquila, para poner texto. El 8 % superior y el 8 % inferior se funden en carbón liso #111317. Sin texto, letras ni logos.
```

### 03. `scene-3-gears.png` (horizontal 3:2)

```
Imagen 3, mismo estilo. Panorámica horizontal 3:2 de una sala de engranajes dentro de una cueva. La cascada de oro líquido entra por arriba entre el 20 % y el 38 % del ancho y golpea una rueda dentada gigante de bronce en el lado izquierdo, haciéndola girar, con salpicaduras doradas en el punto de impacto. Abajo a la derecha, cinco plataformas de piedra suben en escalera, cada una con una vela pequeña. Dos libros de contabilidad abiertos brillan suave sobre atriles, abajo a la derecha. La mitad superior derecha es una pared de roca oscura y tranquila, para poner texto. El 8 % superior y el 8 % inferior se funden en carbón liso #111317. Sin texto, letras ni logos.
```

### 04. `scene-4-foundry.png` (horizontal 3:2)

```
Imagen 4, mismo estilo. Panorámica horizontal 3:2 de una fundición de oro subterránea. La cascada de oro líquido entra por arriba entre el 67 % y el 79 % del ancho y cae dentro de un gran crisol de hierro a un 33 % de altura. Del crisol bajan tres tubos de hierro rectos, al 62 %, 69 % y 76 % del ancho, y cada uno vierte un hilo de oro en un molde de lingote en el suelo. Un brillo cálido dorado cubre el suelo, y a la izquierda hay una gran burbuja de oro brillante. El 45 % izquierdo de la imagen es ladrillo y roca oscura y tranquila, para poner texto. El 8 % superior y el 8 % inferior se funden en carbón liso #111317. Sin texto, letras ni logos.
```

### 05. `scene-5-lake.png` (horizontal 3:2)

```
Imagen 5, mismo estilo. Panorámica horizontal 3:2 vista desde dentro de la boca de una cueva, mirando a un lago en calma al amanecer. Un sol dorado pálido y bajo, al 39 % del ancho y 56 % de altura, con una columna de luz que brilla sobre el agua. En el tercio inferior, cientos de pequeñas linternas de papel doradas flotan en el lago. Los bordes irregulares de la cueva enmarcan la escena a izquierda, derecha y arriba, con luz de contorno crema. Dos linternas cálidas sobre rocas dentro de la cueva, una en el extremo izquierdo y otra en el derecho. El cielo sobre el horizonte, en el centro, queda tranquilo para poner un título centrado. El 8 % superior se funde en carbón liso #111317. Sin texto, letras ni logos.
```

### 06–09. Franjas de roca (horizontal 3:2, fondo transparente)

Antes de pedir cada franja, sube en el mismo mensaje las dos escenas que une, para que la roca encaje. Pega este texto cambiando lo que va entre corchetes:

```
Imagen [N], mismo estilo, con fondo transparente (PNG). Te adjunto las dos escenas que debe unir. Dibuja una franja horizontal de estratos de roca que ocupe todo el ancho y solo la banda central de la imagen, del 30 % al 70 % de la altura. Por encima y por debajo, todo transparente. Los dos bordes de la franja son irregulares y naturales. Mitad superior de la franja: [ARRIBA]. Mitad inferior: [ABAJO]. [HUECO]. Mismo estilo y colores que las dos escenas adjuntas. Sin texto, letras ni logos.
```

| Archivo | Une | [ARRIBA] | [ABAJO] | [HUECO] |
|---|---|---|---|---|
| `seam-1.png` | 1 → 2 | suelo del cañón: rocas negras, dos farolillos dorados pequeños, hierba seca | techo de la bóveda: estalactitas, raíces, una cadena con una lámpara de latón pequeña | Un hueco vertical que atraviesa toda la franja entre el 47 % y el 53 % del ancho, por donde pasa una cascada |
| `seam-2.png` | 2 → 3 | suelo de la bóveda: losas de piedra, pilas de libros viejos, velas derretidas | techo de la sala de engranajes: vigas de madera y estalactitas | Un hueco vertical entre el 23 % y el 31 % del ancho |
| `seam-3.png` | 3 → 4 | suelo de la sala de engranajes: rejilla de hierro, charcos dorados, velas | techo de la fundición: tubos remachados, cadenas, una rueda dentada | Un hueco entre el 62 % y el 73 % del ancho, rodeado por un collar de tubo de hierro |
| `seam-4.png` | 4 → 5 | suelo de la fundición: charcos de oro brillante y un lingote caído | techo irregular de cueva marina: esquirlas oscuras, borde crema, estalactitas | Sin hueco |

### 10. `sprites.png` (cuadrado 1024 × 1024, fondo transparente)

```
Imagen 10, mismo estilo, con fondo transparente (PNG). Hoja de sprites con elementos separados, sin tocarse y con espacio entre ellos. Fila de arriba: cuatro pequeños cristales dorados flotantes con forma de vela japonesa, cada uno con un brillo suave y en una pose distinta (inclinado, recto, alto, pequeño). Fila de abajo: un halcón de bronce volando visto de lado, dos veces, una con las alas arriba y otra con las alas abajo, mismo tamaño y misma posición. Sin texto, letras ni logos.
```

---

## Logo

El logo actual solo sirve de referencia. Recomendación: **redibujarlo en vector (SVG) en código**, no con ChatGPT, porque los generadores de imagen deforman las letras.

- **Símbolo:** cabeza de toro geométrica en pocas formas planas: cuernos en oro `#E7B744`, cara en crema `#F3F2EB`. Sin la palabra FOREX dentro.
- **Logotipo:** "LFX" en una sans geométrica gruesa y, debajo, un descriptor corto con mucho espaciado entre letras.
- **Versiones:** horizontal (nav), solo símbolo (favicon y móvil) y monocroma crema.
