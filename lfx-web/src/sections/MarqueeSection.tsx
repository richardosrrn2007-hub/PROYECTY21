import { useEffect, useRef, useState } from 'react';

/* Real class covers from the LFX platform */
const covers = [
  './cursos/c01.webp', './cursos/c02.webp', './cursos/c03.webp', './cursos/c04.webp', './cursos/c05.webp',
  './cursos/c06.webp', './cursos/c07.webp', './cursos/c08.webp', './cursos/c09.webp', './cursos/c10.webp',
  './cursos/c11.webp', './cursos/c12.webp', './cursos/c13.webp', './cursos/c14.webp', './cursos/c15.webp',
  './cursos/c16.webp', './cursos/c17.webp', './cursos/c18.webp', './cursos/c19.webp', './cursos/c20.webp',
  './cursos/c21.webp',
];
const row1 = [...covers.slice(0, 11), ...covers.slice(0, 11), ...covers.slice(0, 11)];
const row2 = [...covers.slice(11), ...covers.slice(11), ...covers.slice(11)];

export default function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - top + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={ref} className="flex flex-col gap-3 overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40" aria-label="Portadas de las clases de LFX Academy">
      <Row items={row1} x={offset - 200} />
      <Row items={row2} x={-(offset - 200)} />
    </section>
  );
}

function Row({ items, x }: { items: string[]; x: number }) {
  return (
    <div className="flex w-max gap-3" style={{ transform: `translateX(${x}px)`, willChange: 'transform' }}>
      {items.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
        />
      ))}
    </div>
  );
}
