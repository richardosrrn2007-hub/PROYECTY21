import { motion } from 'framer-motion';
import type { ElementType, ReactNode, CSSProperties } from 'react';

type FadeInProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
};

const cache = new Map<ElementType, ReturnType<typeof motion.create>>();
function motionFor(as: ElementType) {
  if (!cache.has(as)) cache.set(as, motion.create(as as never));
  return cache.get(as)!;
}

export default function FadeIn({ children, as = 'div', delay = 0, duration = 0.7, x = 0, y = 30, className, style }: FadeInProps) {
  const Comp = motionFor(as) as ElementType;
  return (
    <Comp
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Comp>
  );
}
