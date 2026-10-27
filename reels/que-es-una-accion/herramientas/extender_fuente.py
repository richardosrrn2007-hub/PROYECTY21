"""Añade a Internet Friends los signos del español que no trae: tildes, ñ, ü, ¿ y ¡."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.boundsPen import BoundsPen

ent, sal = sys.argv[1], sys.argv[2]
f = TTFont(ent)
gs = f.getGlyphSet()
glyf, hmtx, cmap = f["glyf"], f["hmtx"], f.getBestCmap()
orden = f.getGlyphOrder()

def caja(n):
    bp = BoundsPen(gs); gs[n].draw(bp); return bp.bounds

def nuevo(nombre, dibujo, ancho=0):
    pen = TTGlyphPen(None if dibujo is None else gs)
    dibujo(pen)
    if nombre not in orden: orden.append(nombre)
    g = pen.glyph()
    glyf[nombre] = g
    g.recalcBounds(glyf)
    hmtx[nombre] = (ancho, getattr(g, "xMin", 0))

# acento agudo: barra inclinada del grosor del trazo
def agudo(p):
    p.moveTo((10, 840)); p.lineTo((70, 840)); p.lineTo((150, 975)); p.lineTo((80, 975)); p.closePath()
# virgulilla (tilde de la ñ): onda gruesa
def virgula(p):
    p.moveTo((0, 860)); p.qCurveTo((40, 950), (95, 900)); p.qCurveTo((140, 860), (180, 930)); p.lineTo((230, 905))
    p.qCurveTo((185, 800), (125, 845)); p.qCurveTo((75, 885), (50, 835)); p.closePath()
# diéresis: dos puntos cuadrados
def dieresis(p):
    for x in (0, 140):
        p.moveTo((x, 845)); p.lineTo((x + 70, 845)); p.lineTo((x + 70, 915)); p.lineTo((x, 915)); p.closePath()

nuevo("acutecomb.es", agudo); nuevo("tildecomb.es", virgula); nuevo("dieresiscomb.es", dieresis)
anchoAcento = {"acutecomb.es": (10, 150), "tildecomb.es": (0, 230), "dieresiscomb.es": (0, 210)}

def compuesto(cp, base, acento):
    b = cmap[ord(base)]
    x0, _, x1, _ = caja(b)
    a0, a1 = anchoAcento[acento]
    dx = round((x0 + x1) / 2 - (a0 + a1) / 2)
    nombre = f"uni{cp:04X}"
    def d(p):
        p.addComponent(b, (1, 0, 0, 1, 0, 0))
        p.addComponent(acento, (1, 0, 0, 1, dx, 0))
    nuevo(nombre, d, hmtx[b][0])
    return nombre

mapa = {}
for base, cps in {"a": "áÁ", "e": "éÉ", "i": "íÍ", "o": "óÓ", "u": "úÚ"}.items():
    for ch in cps: mapa[ord(ch)] = compuesto(ord(ch), base, "acutecomb.es")
for ch in "ñÑ": mapa[ord(ch)] = compuesto(ord(ch), "n", "tildecomb.es")
for ch in "üÜ": mapa[ord(ch)] = compuesto(ord(ch), "u", "dieresiscomb.es")
# ¿ y ¡: el ? y el ! girados 180°
for ch, base in (("¿", "?"), ("¡", "!")):
    b = cmap[ord(base)]; w = hmtx[b][0]; _, y0, _, y1 = caja(b)
    def d(p, b=b, w=w, y0=y0, y1=y1): p.addComponent(b, (-1, 0, 0, -1, w, round(y0 + y1)))
    nombre = f"uni{ord(ch):04X}"; nuevo(nombre, d, w); mapa[ord(ch)] = nombre

f.setGlyphOrder(orden)
for t in f["cmap"].tables:
    if t.isUnicode(): t.cmap.update(mapa)
f["maxp"].recalc(f)
f.save(sal)
print("añadidos:", "".join(chr(c) for c in mapa))
