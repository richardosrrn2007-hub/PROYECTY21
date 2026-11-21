/* WhatsApp: número con prefijo de país, sin + ni espacios (ej. 5215512345678).
   Mientras esté vacío, los botones bajan a la sección de contacto. */
export const WHATSAPP = '';
const WA_TEXT = 'Hola, quiero información sobre LFX Academy.';

export const contactHref = WHATSAPP
  ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WA_TEXT)}`
  : '#contacto';

export const isExternal = contactHref.startsWith('http');
