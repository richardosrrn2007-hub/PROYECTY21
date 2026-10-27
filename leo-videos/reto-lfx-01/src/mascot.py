# Genera el personaje "Leo" (toro LFX) en varias poses como SVG
import sys, os
OUT = sys.argv[1]
CREAM="#F3EFE6"; CREAM_D="#DCD4C3"; MUZ="#E8D9BF"; GOLD="#E5B23A"; GOLD_D="#C08F22"
INK="#111317"; HOOD="#1B1F25"; HOOD_L="#262B33"; EM="#2FD39A"; EM_D="#1FA97A"

def horns():
    return f'''
  <path d="M205 215 C150 205 110 160 118 95 C122 70 140 62 146 80 C150 120 175 160 230 175 Z" fill="{GOLD}"/>
  <path d="M395 215 C450 205 490 160 482 95 C478 70 460 62 454 80 C450 120 425 160 370 175 Z" fill="{GOLD}"/>
  <path d="M146 80 C150 120 175 160 230 175 L222 190 C175 180 150 150 146 80 Z" fill="{GOLD_D}" opacity=".55"/>
  <path d="M454 80 C450 120 425 160 370 175 L378 190 C425 180 450 150 454 80 Z" fill="{GOLD_D}" opacity=".55"/>'''

def ears():
    return f'''
  <path d="M190 270 C150 250 105 262 85 290 C110 315 160 318 200 300 Z" fill="{CREAM}"/>
  <path d="M182 280 C152 270 122 276 108 291 C130 303 160 304 186 296 Z" fill="{MUZ}"/>
  <path d="M410 270 C450 250 495 262 515 290 C490 315 440 318 400 300 Z" fill="{CREAM}"/>
  <path d="M418 280 C448 270 478 276 492 291 C470 303 440 304 414 296 Z" fill="{MUZ}"/>'''

def head(eyes="open", mood="smile"):
    if eyes=="open":
        e=f'''
  <circle cx="248" cy="300" r="30" fill="#fff"/><circle cx="352" cy="300" r="30" fill="#fff"/>
  <circle cx="254" cy="304" r="18" fill="{INK}"/><circle cx="346" cy="304" r="18" fill="{INK}"/>
  <circle cx="260" cy="297" r="6" fill="#fff"/><circle cx="352" cy="297" r="6" fill="#fff"/>'''
    else:
        e=f'''
  <path d="M222 304 Q248 322 274 304" stroke="{INK}" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M326 304 Q352 322 378 304" stroke="{INK}" stroke-width="8" fill="none" stroke-linecap="round"/>'''
    if mood=="smile":
        brow=f'''<path d="M222 258 Q248 244 274 256" stroke="{INK}" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M326 256 Q352 244 378 258" stroke="{INK}" stroke-width="9" fill="none" stroke-linecap="round"/>'''
        mouth=f'<path d="M262 440 Q300 468 338 440" stroke="{INK}" stroke-width="8" fill="none" stroke-linecap="round"/>'
    elif mood=="think":
        brow=f'''<path d="M222 252 Q248 248 274 260" stroke="{INK}" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M326 250 Q352 238 378 246" stroke="{INK}" stroke-width="9" fill="none" stroke-linecap="round"/>'''
        mouth=f'<path d="M280 448 Q300 440 322 446" stroke="{INK}" stroke-width="8" fill="none" stroke-linecap="round"/>'
    else: # wow / celebrate
        brow=f'''<path d="M222 250 Q248 232 274 248" stroke="{INK}" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M326 248 Q352 232 378 250" stroke="{INK}" stroke-width="9" fill="none" stroke-linecap="round"/>'''
        mouth=f'<path d="M266 436 Q300 486 334 436 Z" fill="{INK}"/><path d="M282 456 Q300 474 318 456 Q300 462 282 456Z" fill="#E86A6A"/>'
    return f'''
  <path d="M300 170 C385 170 420 225 418 300 C416 360 400 395 392 420 C380 480 340 500 300 500 C260 500 220 480 208 420 C200 395 184 360 182 300 C180 225 215 170 300 170 Z" fill="{CREAM}"/>
  <path d="M262 176 C275 150 300 140 318 152 C330 140 352 150 345 178 C330 168 312 172 300 182 C288 172 275 170 262 176 Z" fill="{GOLD}"/>
  <path d="M300 182 L292 200 L300 214 L308 200 Z" fill="{EM}"/>
  <ellipse cx="300" cy="420" rx="98" ry="64" fill="{MUZ}"/>
  <ellipse cx="266" cy="412" rx="13" ry="17" fill="{INK}" opacity=".85"/>
  <ellipse cx="334" cy="412" rx="13" ry="17" fill="{INK}" opacity=".85"/>
  <ellipse cx="218" cy="372" rx="20" ry="11" fill="#F0A9A0" opacity=".45"/>
  <ellipse cx="382" cy="372" rx="20" ry="11" fill="#F0A9A0" opacity=".45"/>
  {brow}{e}
  {mouth}'''

def body():
    return f'''
  <path d="M120 720 C120 600 160 540 230 520 L300 548 L370 520 C440 540 480 600 480 720 Z" fill="{HOOD}" stroke="#3A424D" stroke-width="5"/>
  <path d="M230 520 L300 548 L370 520 L356 510 L300 532 L244 510 Z" fill="{HOOD_L}"/>
  <path d="M286 560 L286 640" stroke="{EM}" stroke-width="5" stroke-linecap="round"/>
  <path d="M314 560 L314 630" stroke="{EM}" stroke-width="5" stroke-linecap="round"/>
  <text x="300" y="690" text-anchor="middle" font-family="Montserrat, DejaVu Sans, sans-serif" font-weight="800" font-size="40" fill="{EM}" letter-spacing="2">LFX</text>'''

def hand(cx,cy,r=30):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{CREAM}"/><path d="M{cx-r+6} {cy+6} Q{cx} {cy+r} {cx+r-6} {cy+6}" stroke="{CREAM_D}" stroke-width="4" fill="none"/>'

def arm(path, w=56):
    return f'<path d="{path}" stroke="#3A424D" stroke-width="{w+10}" fill="none" stroke-linecap="round"/><path d="{path}" stroke="{HOOD}" stroke-width="{w}" fill="none" stroke-linecap="round"/><path d="{path}" stroke="{HOOD_L}" stroke-width="{w-40}" fill="none" stroke-linecap="round" opacity=".6"/>'

def pose(name, eyes="open"):
    back=""; front=""; mood="smile"
    if name=="idle":
        front=arm("M175 580 C150 630 150 670 160 705")+arm("M425 580 C450 630 450 670 440 705")
    elif name=="point":
        front=arm("M175 580 C150 630 150 670 160 705")+arm("M430 578 C480 560 505 500 512 440")+f'<path d="M520 418 L572 372" stroke="{CREAM}" stroke-width="20" stroke-linecap="round"/>'+hand(512,428,30)+f'<path d="M492 412 Q500 396 516 400" stroke="{CREAM_D}" stroke-width="4" fill="none" stroke-linecap="round"/>'
    elif name=="think":
        mood="think"
        front=arm("M425 580 C450 630 450 670 440 705")+arm("M180 585 C200 560 235 520 262 500",50)+hand(270,490,28)
    elif name=="celebrate":
        mood="wow"
        front=arm("M175 575 C130 520 110 450 108 395")+hand(108,375)+arm("M425 575 C470 520 490 450 492 395")+hand(492,375)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="600" height="720" viewBox="0 0 600 720">
  {back}{body()}{horns()}{ears()}{head(eyes,mood)}{front}
</svg>'''

os.makedirs(OUT, exist_ok=True)
for n in ["idle","point","think","celebrate"]:
    open(f"{OUT}/leo-{n}.svg","w").write(pose(n))
    open(f"{OUT}/leo-{n}-blink.svg","w").write(pose(n,"closed"))
