import { ArrowUpRight, Send } from 'lucide-react';
import { contactHref, TELEGRAM } from '../config';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

/* Editorial buttons: solid black or solid white pills, a small arrow, a 1px lift on hover. */
export function ContactButton({ label = 'Quiero ser parte de LFX', tone = 'light' }: { label?: string; tone?: 'light' | 'dark' }) {
  return (
    <a href={contactHref} {...ext} className={`btn-ed ${tone === 'dark' ? 'btn-ed--dark' : 'btn-ed--light'}`}>
      <span>{label}</span>
      <ArrowUpRight className="btn-ed__arrow" />
    </a>
  );
}

export function TelegramButton({ label = 'Canal de Telegram', size = 'md' }: { label?: string; size?: 'sm' | 'md' }) {
  return (
    <a href={TELEGRAM} {...ext} className={`btn-ed btn-ed--tg${size === 'sm' ? ' btn-ed--sm' : ''}`}>
      <Send className="btn-ed__tg" />
      <span>{label}</span>
    </a>
  );
}

export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.9 9.9 0 0 0 12.04 2Zm5.8 14.1c-.24.68-1.42 1.3-1.95 1.35-.5.05-1.12.07-1.8-.11-.42-.13-.95-.31-1.63-.6-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.16-1.55-1.16-2.95 0-1.4.74-2.09 1-2.38.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.81 2 .88 2.14.07.15.12.32.02.51-.1.19-.14.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.3-.13.59.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.41.28.14.45.12.62-.07.17-.19.71-.83.9-1.12.19-.28.38-.24.64-.14.26.1 1.66.78 1.95.93.28.14.47.21.54.33.07.12.07.69-.17 1.36Z" />
    </svg>
  );
}

export function TikTokIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1 0-5.2c.27 0 .53.04.77.12V9.66a5.73 5.73 0 0 0-.77-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48Z" />
    </svg>
  );
}
