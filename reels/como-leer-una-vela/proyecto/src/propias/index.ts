// Escenas propias: cuando ninguna escena de la biblioteca encaja con una frase, se escribe una aquí
// (copia Ejemplo.tsx), se registra en esta lista y se usa en el plan con
//   "escena": { "tipo": "propia", "nombre": "MiEscena", "en": ["palabra", …], …props }
import type { DefEscena } from "../tipos";
import { ejemplo } from "./Ejemplo";
import { gancho, kinetico } from "./Texto";
import { pizza } from "./Pizza";
import { broker, mercado } from "./Broker";
import { comision, ganarPerder, precioDef, proximo } from "./Graficas";
import { adelanto, apps, batalla, comenta, grafica, reto } from "./Batalla";

export const PROPIAS: Record<string, DefEscena> = {
  Ejemplo: ejemplo,
  Gancho: gancho,
  Kinetico: kinetico,
  Pizza: pizza,
  Broker: broker,
  Mercado: mercado,
  Precio: precioDef,
  GanarPerder: ganarPerder,
  Comision: comision,
  Proximo: proximo,
  Reto: reto,
  Batalla: batalla,
  Apps: apps,
  Grafica: grafica,
  Adelanto: adelanto,
  Comenta: comenta,
};
