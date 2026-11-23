import Nav from './components/Nav';
import MostarHero from './hero/MostarHero';
import {
  ComunidadSection,
  FaqSection,
  FloatingVip,
  Footer,
  ResultsSection,
  SignalsSection,
  StepsSection,
  TestimonialsSection,
} from './sections/Sections';
import './sections/sections.css';

/* Cinematic hero first (logo, Comunidad LFX, video, the seven channel cards),
   then every section on the clean dark background so the content reads well. */
export default function App() {
  return (
    <main className="bg-[#0C0C0C] font-kanit" style={{ overflowX: 'clip' }}>
      <Nav />
      <MostarHero />
      <div className="clean">
        <ComunidadSection classesOnly />
        <StepsSection />
        <SignalsSection />
        <ResultsSection />
        <TestimonialsSection />
        <FaqSection />
        <Footer />
      </div>
      <FloatingVip />
    </main>
  );
}
