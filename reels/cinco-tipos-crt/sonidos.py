"""Efectos del vídeo 6 sintetizados con código (sin muestras ajenas): todos en re mayor pentatónico
para que suenen musicales encima de cualquier música de fondo.

  python3 sonidos.py <carpeta public/sonidos>

nota1…nota6  marimba (re, mi, fa#, la, si, re agudo): cada vela que se forma, cada número, cada tarjeta
brillo       barrido: campana brillante + chispas + golpe grave suave
resuelve     objetivo alcanzado: arpegio re–fa#–la–re
aire         paso de aire suave (cambio de tipo, flecha)
impacto      el «5» gigante: bombo grave + campana
"""
import os
import sys
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(6)


def t(d):
    return np.arange(int(SR * d)) / SR


def ataque(x, ms=3):
    n = int(SR * ms / 1000)
    x[:n] *= np.linspace(0, 1, n)
    return x


def marimba(f, d=0.9):
    s = t(d)
    x = np.sin(2 * np.pi * f * s) * np.exp(-s / 0.32)
    x += 0.35 * np.sin(2 * np.pi * f * 4 * s) * np.exp(-s / 0.05)
    x += 0.12 * np.sin(2 * np.pi * f * 9.2 * s) * np.exp(-s / 0.015)
    return ataque(x)


def campana(f, d=2.0, k=1.0):
    s = t(d)
    x = np.zeros_like(s)
    for p, a, dec in [(1, 1, 1.4), (2.0, 0.45, 0.9), (2.76, 0.3, 0.6), (5.4, 0.15, 0.25), (8.93, 0.07, 0.12)]:
        x += a * np.sin(2 * np.pi * f * p * s) * np.exp(-s / (dec * k))
    return ataque(x, 2)


def paso_bajo(x, corte):
    """Filtro de un polo con corte variable (array o número), en Hz."""
    corte = np.broadcast_to(corte, x.shape)
    a = 1 - np.exp(-2 * np.pi * corte / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def aire(d=0.55):
    s = t(d)
    env = np.sin(np.pi * np.clip(s / d, 0, 1)) ** 2
    ruido = rng.standard_normal(len(s))
    x = paso_bajo(ruido, 300 + 3200 * env) - paso_bajo(ruido, 120)
    return x * env


def mezcla(*partes):
    n = max(len(p) + int(SR * off) for p, off, _ in partes)
    x = np.zeros(n)
    for p, off, a in partes:
        i = int(SR * off)
        x[i : i + len(p)] += a * p
    return x


def chispas(n=9, d=0.4):
    out = []
    for k in range(n):
        f = rng.choice([2349.3, 2637.0, 2960.0, 3520.0, 3951.1])
        out.append((marimba(f, 0.25) * 0.6, k * d / n + rng.uniform(0, 0.02), 0.25))
    return out


def grave(f0=90, f1=48, d=0.35):
    s = t(d)
    f = f1 + (f0 - f1) * np.exp(-s / 0.05)
    fase = 2 * np.pi * np.cumsum(f) / SR
    return ataque(np.sin(fase) * np.exp(-s / 0.12), 1)


def guardar(x, ruta):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89  # pico a -1 dB
    cola = int(SR * 0.03)
    x[-cola:] *= np.linspace(1, 0, cola)
    pcm = (np.repeat(x[:, None], 2, axis=1) * 32767).astype("<i2")
    with wave.open(ruta, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    dest = sys.argv[1]
    escala = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66]  # re mayor pentatónico
    for i, f in enumerate(escala, 1):
        guardar(marimba(f), os.path.join(dest, f"nota{i}.wav"))
    guardar(mezcla((campana(1760.0, 1.6), 0, 0.8), (campana(2637.0, 1.2, 0.7), 0.03, 0.4), (grave(), 0, 0.7), *chispas()), os.path.join(dest, "brillo.wav"))
    guardar(mezcla(*[(mezcla((marimba(f, 1.4), 0, 1), (campana(f, 1.6, 0.8), 0, 0.35)), k * 0.07, 1) for k, f in enumerate([587.33, 739.99, 880.0, 1174.66])]), os.path.join(dest, "resuelve.wav"))
    guardar(aire(), os.path.join(dest, "aire.wav"))
    guardar(mezcla((grave(110, 40, 0.9), 0, 1), (campana(587.33, 2.0), 0.01, 0.5), (campana(1174.66, 1.6), 0.02, 0.25), *chispas(6, 0.3)), os.path.join(dest, "impacto.wav"))
    print("sonidos listos en", dest)
