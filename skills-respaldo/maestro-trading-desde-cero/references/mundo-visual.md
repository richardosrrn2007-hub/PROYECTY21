# Mundo visual Origine

## Base común
- 1080×1920, 30 fps. Planeta de la serie (`Planeta.tsx`) + brillos (`Cosmos` de Soros.tsx) en todos los fondos.
- Oro `#D4AF37`, plata `#C9D1D9`, crema `#E8D9B5`, rojo venta `#B8432F`, azul compra `#4C8DFF`, noche `#0A0F1E`.
- Fuentes: `CLAVE` y `VIVO` de `src/propias/mg.tsx` y `F.mono` para etiquetas HUD. Las de pago van en
  `public/fuentes/` (pedirlas a Richard si faltan).
- Cierre: monitor que se apaga y logo Origine (`Cierre.tsx`, `public/logo.mp4`), unos 2 s tras la voz.

## Un mundo por episodio
| Vídeo | Archivo | Fondo | Protagonista |
|---|---|---|---|
| 5 Soros 1992 | `Soros.tsx` | `FondoNoche` / `FondoBanco`, Londres, luna roja | silueta `Hombre` de espaldas |
| 6 Tortugas 1983 | `Tortugas.tsx` | `FondoTortuga` (verde `#12241A → #070B0A`) | `TortugaOro`, Chicago sepia |

Para uno nuevo: elige 1 color de mundo, 1 objeto icónico (tulipán, tortuga, libra…) y 1 lugar con época
(skyline + `Pelicula` para lo antiguo).

## Piezas reutilizables (exportadas)
- `Soros.tsx`: `CajaTexto` (caja con rebote), `Titulo`, `Panel`, `Polvo`, `Cosmos`, `Pelicula` (grano de
  película), `Hombre`, `Flecha`, `Luna`, `Londres`, `Tortuga`.
- `Tortugas.tsx` (copiar si se necesitan, son internas): `Hud` (línea `// LUGAR · AÑO`), `Tarjeta` (pastilla
  mono en inglés), `Cabecera` (número de regla + nombre), `Mono`, `Paseo` (personaje que cruza abajo),
  `Sello` (lacre con el año), `Ruptura` (rango de 20 velas y ruptura con BUY/SELL), contadores con `miles()`.
- `mg.tsx`: `pr`, `sp`, `REBOTE`, `temblor`, `Trazo`, `Chispas`, `encajar`.

## Reglas de animación
- Cada elemento entra en la palabra que lo nombra (`b[i]` = fotograma de la palabra `en[i]`).
- Rebote en entradas, barrido en 3–4 cambios de bloque, zoom en el resto.
- Para rellenar huecos: cinta de cotizaciones, contadores más largos, entradas escalonadas, chispas,
  algo que se apila. Decorativo = sin precios reales presentados como datos.
- Cuidado con solapes: revisa en las fotos que las etiquetas no tapen caras, velas ni cifras.

## Portada
`PortadaPropia.tsx`: pastilla «TRADING DESDE CERO» + 3 líneas (blanca / caja dorada inclinada / dorada)
sobre el fondo y el protagonista del episodio. Usa las mismas líneas de `plan.json → portada.lineas`.
