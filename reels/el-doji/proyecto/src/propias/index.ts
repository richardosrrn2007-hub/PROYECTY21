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
import { capas, dato, dojiZoom, firma, mayo, oro, porcentajes, tres } from "./Doji";
import { banderas, comentaJ, dojima, futuros, homma, hoy, mapa, mascaras, origen, pincel, rico, viaje } from "./Japon";

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
  ComentaVela: comenta,
  Origen: origen,
  Mapa: mapa,
  Dojima: dojima,
  Futuros: futuros,
  Homma: homma,
  Pincel: pincel,
  Mascaras: mascaras,
  Banderas: banderas,
  Rico: rico,
  Viaje: viaje,
  Hoy: hoy,
  Comenta: comentaJ,
  Tres: tres,
  DojiZoom: dojiZoom,
  Dato: dato,
  Oro: oro,
  Mayo: mayo,
  Porcentajes: porcentajes,
  Capas: capas,
  Firma: firma,
};
