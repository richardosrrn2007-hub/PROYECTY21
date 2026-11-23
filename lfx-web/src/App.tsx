import { EditorialHero, GoldBand, Statement, TrustPanel } from './editorial/Editorial';
import {
  ComunidadSection,
  FaqSection,
  FloatingVip,
  Footer,
  ResultsSection,
  ServicesSection,
  SignalsSection,
  StepsSection,
  TestimonialsSection,
} from './sections/Sections';
import './sections/sections.css';

/* Editorial monochrome page: grey hero with the trader photo, black manifesto,
   the gold pour band, the trust panel, then the content sections on black. */
export default function App() {
  return (
    <main style={{ overflowX: 'clip', background: '#000' }}>
      <EditorialHero />
      <Statement />
      <GoldBand />
      <TrustPanel />
      <div className="clean">
        <ComunidadSection classesOnly />
        <StepsSection />
        <ServicesSection />
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
