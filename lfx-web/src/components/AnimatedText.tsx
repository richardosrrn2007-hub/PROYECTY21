import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';

type Props = { text: string; className?: string; style?: CSSProperties };

/* Each character brightens from 0.2 to 1 as the paragraph scrolls through the viewport. */
export default function AnimatedText({ text, className, style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const chars = [...text];

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((ch, i) => {
        const start = i / chars.length;
        const end = start + 1 / chars.length;
        return <Char key={i} ch={ch} range={[start, end]} progress={scrollYProgress} />;
      })}
    </p>
  );
}

function Char({ ch, range, progress }: { ch: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="invisible">{ch}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {ch}
      </motion.span>
    </span>
  );
}
