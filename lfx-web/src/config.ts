/* Contact + social links for Comunidad LFX */
export const WHATSAPP = '527774448982'; // +52 777 444 8982 (Leo)
export const WA_TEXT =
  'Leo, quiero ser parte de la Comunidad LFX. ¿Cómo puedo ingresar? Envíame los planes disponibles y qué incluye cada uno.';
export const WA_VIP_TEXT =
  'Leo, quiero ser parte de la Comunidad VIP LFX y obtener la promoción limitada. ¿Cómo puedo ingresar?';

const wa = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
export const contactHref = wa(WA_TEXT);
export const vipHref = wa(WA_VIP_TEXT);
export const isExternal = true;

export const TELEGRAM = 'https://t.me/comunidadtradersfxl';
export const INSTAGRAM = 'https://www.instagram.com/leonardolfx';
export const TIKTOK = 'https://www.tiktok.com/@leonardo_forex';

/* Presentation video: drop the file in public/video/ and put its path here (e.g. './video/presentacion.mp4').
   Empty = the player shows a "video pendiente" frame. */
export const VIDEO_SRC = '';
export const VIDEO_POSTER = '';
