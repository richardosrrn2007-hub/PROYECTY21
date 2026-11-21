import { motion } from 'framer-motion';
import { contactHref } from '../config';
import LogoMark from './Logo';
import { TelegramButton, WhatsAppIcon } from './Buttons';

const links = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Qué encontrarás', href: '#servicios' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Preguntas', href: '#faq' },
];

export default function Nav() {
  return (
    <motion.header
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-50 grid h-16 grid-cols-[auto_1fr] items-center px-4 md:grid-cols-[1fr_auto_1fr] md:px-10"
      style={{ background: 'linear-gradient(rgba(12,12,12,.75), rgba(12,12,12,0))' }}
    >
      <nav className="hidden items-center gap-[2.6vw] md:flex">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="text-[13px] font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70">
            {l.label}
          </a>
        ))}
      </nav>
      <a href="#top" className="flex items-center" aria-label="Comunidad LFX, inicio">
        <LogoMark className="text-[30px]" />
      </a>
      <div className="flex items-center justify-end gap-2">
        <TelegramButton label="Telegram" size="sm" />
        <a
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hablar con Leo por WhatsApp"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-widest text-white transition-transform duration-300 hover:-translate-y-0.5 md:px-4"
          style={{ background: 'linear-gradient(110deg,#7A2BFF,#B600A8)' }}
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Hablar con Leo</span>
        </a>
      </div>
    </motion.header>
  );
}
