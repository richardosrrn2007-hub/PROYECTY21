import { motion } from 'framer-motion';
import { contactHref, isExternal } from '../config';
import LogoMark from './Logo';

const links = [
  { label: 'Academia', href: '#academia' },
  { label: 'Programas', href: '#programas' },
  { label: 'Por dentro', href: '#por-dentro' },
  { label: 'Resultados', href: '#resultados' },
];

export default function Nav() {
  return (
    <motion.header
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-50 grid h-16 grid-cols-[auto_1fr] items-center px-5 md:grid-cols-[1fr_auto_1fr] md:px-10"
      style={{ background: 'linear-gradient(rgba(12,12,12,.7), rgba(12,12,12,0))' }}
    >
      <nav className="hidden items-center gap-[4vw] md:flex">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="text-[13px] font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70">
            {l.label}
          </a>
        ))}
      </nav>
      <a href="#top" className="flex items-center" aria-label="LFX Academy, inicio">
        <LogoMark className="text-[30px]" />
      </a>
      <div className="flex justify-end">
        <a
          href={contactHref}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="rounded-full px-5 py-2 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-300 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(100deg,#1F5BFF,#7A2BFF)', boxShadow: '0 0 18px rgba(90,80,255,.45)' }}
        >
          Únete
        </a>
      </div>
    </motion.header>
  );
}
