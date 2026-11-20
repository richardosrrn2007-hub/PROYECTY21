# RDO Trading: "El descenso" (assets list)

Adaptation of the Hollowmere illustrated-descent structure to RDO Trading & Education VIP.
Same mechanics: five stacked flat-vector scenes, four rock seams, one continuous falls, code-driven motion.
Change: the pale ghost-light falls becomes **a river of molten gold**, the brand's core image (gold that falls and settles into order).

## Concept

Scrolling down means going deeper into discipline. It starts with the chaotic market at night and ends at dawn over a calm lake.

| # | Scene | Section | Copy idea |
|---|---|---|---|
| 1 | Night canyon of black obsidian towers, a huge pale-gold moon, a gold waterfall falling into a pool | Hero | "RDO TRADING" / "DISCIPLINA HOY, LIBERTAD MAÑANA" |
| 2 | Underground study vault: shelves of books, blackboards with candlestick drawings, a glass tower of glowing gold orbs | Qué obtienes | 6 benefits |
| 3 | Clockwork chamber: a giant gear wheel turned by the gold falls, five stone platforms climbing up | Cómo funciona | 5 steps |
| 4 | Gold foundry: the falls pours into a crucible, three pipes fill three ingot moulds | Planes | €40 / €100 / €150 |
| 5 | Cave mouth onto a calm lake at dawn with hundreds of floating gold lanterns | Comunidad VIP + CTA | "Únete a la comunidad" + WhatsApp |

## Palette

| Token | Value |
|---|---|
| `--night` | `#0D0B08` |
| `--ink` | `#F4EFE4` |
| `--soft` | `rgba(201,194,179,.82)` |
| `--gold` (falls, accents) | `#C9962F` |
| `--ember` (button hover) | `#E0B04A` |
| Cold contrast (rim light, glass) | steel blue `#7FA6C9` |

Fonts: Fraunces (title), Manrope (body), Space Mono (labels). Same as the current RDO site.

## Shared style block (paste at the end of every prompt)

```
Flat vector illustration in one consistent style: angular shard-cut shapes,
grainy speckled risograph texture, glowing rim light. Palette: obsidian black
and deep charcoal brown, burnished bronze, molten gold light, warm amber
accents, cool steel-blue rim light on rock edges. Painterly depth, cinematic,
very detailed. The top 8% and the bottom 8% of the image fade into solid
near-black (#0D0B08) so scenes can be stacked. No text, no logos, no
lettering, no numbers, no symbols anywhere.
```

## Asset list, in generation order

Generate the five scenes first. The seams are made after, using the two neighbouring scenes as reference images, so the rock matches.

### 01. `scene-1-hero.png`: 2688 × 1520

```
Wide panorama of a deep night canyon walled by tall black obsidian towers and
cliffs with tiny warm windows, like a sleeping city carved into rock. A huge
pale-gold moon sits high in the centre, at about 25% from the top. A waterfall
of glowing molten gold starts at the centre of the frame (about 50% across,
from 50% down), falls into a misty golden pool at about 73% down, then
continues as a lower cascade down the centre to the bottom edge. Small amber
lights scattered on the towers left and right. Calm dark sky in the top third
around the moon, and calm dark hills just below the moon, as space for a title.
[SHARED STYLE BLOCK]
```

### 02. `scene-2-vault.png`: 2688 × 1520

```
Wide panorama of an underground study vault carved in rock. The molten gold
waterfall enters from the top centre (40% to 58% across) and falls all the way
down to a glowing pool at about 85% down. On the right, a tall glass tower of
round jars, each holding a softly glowing gold orb. On the lower left, a desk
with a brass lamp and a glowing glass globe. Shelves of old books and dark
blackboards with simple hand-drawn candlestick chart shapes. The upper-left
third is a calm shadowed rock wall, as space for text.
[SHARED STYLE BLOCK]
```

### 03. `scene-3-gears.png`: 2688 × 1520

```
Wide panorama of a clockwork chamber inside a cave. The molten gold waterfall
enters from the top at 20% to 38% across and strikes a giant bronze gear wheel
on the left side, turning it, with golden spray where it hits. Five stone
platforms climb in steps on the lower right, each lit by a small candle. Two
open ledger books glowing softly on stands, lower right. The upper-right half
is a calm dark rock wall, as space for text.
[SHARED STYLE BLOCK]
```

### 04. `scene-4-foundry.png`: 2688 × 1520

```
Wide panorama of an underground gold foundry. The molten gold waterfall enters
from the top at 67% to 79% across and pours into a huge iron crucible at about
33% down. From the crucible three straight iron pipes go down, at 62%, 69%
and 76% across, each pouring a thin stream into one of three ingot moulds on
the floor. Warm orange glow across the floor, a large amber glowing bubble on
the left. The left 45% of the frame is calm dark brick and rock, as space for
text.
[SHARED STYLE BLOCK]
```

### 05. `scene-5-lake.png`: 2688 × 1520

```
Wide panorama from inside a cave mouth looking out at a calm lake at first
dawn. A low pale-gold sun at about 39% across and 56% down, with a shimmering
pillar of light on the water below it. Hundreds of small floating gold paper
lanterns on the water in the lower third. Jagged cave edges frame the scene
left, right and top, with steel-blue rim light. Two small warm lanterns on
rocks inside the cave, far left and far right. The sky above the horizon,
centred, is calm, as space for a centred title.
[SHARED STYLE BLOCK]
```

### 06–09. Seams: 2688 × 1152, transparent background

How to make each one:
1. Generate it on a flat solid green (#00FF00) background, using the two neighbouring scenes as reference images.
2. Run the background remover.
3. The rock must fill roughly 19% to 80% of the height. Everything above and below is transparent.

| File | Top half (floor of the scene above) | Bottom half (ceiling of the scene below) | Opening for the falls |
|---|---|---|---|
| `seam-1.png` | Canyon floor: black boulders, two small amber lanterns, dry grass | Vault ceiling: stalactites, roots, a chain with a small brass lamp | 47–53% across |
| `seam-2.png` | Vault floor: flagstones, stacks of old books, melted candles | Gear chamber ceiling: wooden beams, stalactites | 23–31% across |
| `seam-3.png` | Gear chamber floor: iron grate, gold puddles, candles | Foundry ceiling: riveted pipes, chains, a cog | 62–73%, the falls passes through an iron pipe collar |
| `seam-4.png` | Foundry floor: glowing gold puddles, a dropped ingot | Jagged sea-cave ceiling: dark shards, steel-blue rim, stalactites | none |

Prompt (swap the bracketed parts per row):

```
A horizontal cross-section band of rock strata, full width, isolated on a flat
solid green background. Top half: [TOP HALF]. Bottom half: [BOTTOM HALF].
The rock band fills from 19% to 80% of the height, ragged and natural on both
edges. [A vertical gap through the whole band at X% to Y% across, where a
waterfall passes through. | No opening.] Matches the style and colours of the
two reference images exactly.
[SHARED STYLE BLOCK, without the line about fading edges]
```

### 10. `sprites.png`: 1024 × 688, transparent background

```
Sprite sheet on a flat solid green background, evenly spaced, nothing
touching. Top row: four small floating gold crystal shards shaped like
candlestick bars, each glowing softly, in four different poses (tilted,
upright, tall, small). Bottom row: a bronze hawk in flight seen from the side,
twice: once with wings up, once with wings down, same size and position.
[SHARED STYLE BLOCK, without the line about fading edges]
```

Then run the background remover. I measure the crop boxes myself once the sheet exists.

## Already in the repo, reused

- `rdo-trading-academy/assets/logo-icon.png`: nav logo.
- `rdo-trading-academy/assets/founder-eddymar.png`: optional, a portrait card in scene 2.
- WhatsApp link already used on the current site.
