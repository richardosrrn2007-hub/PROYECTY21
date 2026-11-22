import Nav from './components/Nav';
import CascadeSection from './cascade/CascadeSection';
import {
  ComunidadSection,
  FaqSection,
  FloatingVip,
  Footer,
  ResultsSection,
  ServicesSection,
  StepsSection,
  TestimonialsSection,
} from './sections/Sections';
import './sections/sections.css';

export default function App() {
  return (
    <main className="bg-[#0C0C0C] font-kanit" style={{ overflowX: 'clip' }}>
      <Nav />
      <CascadeSection />
      <div className="clean">
        <ComunidadSection />
        <StepsSection />
        <ServicesSection />
        <ResultsSection />
        <TestimonialsSection />
        <FaqSection />
        <Footer />
      </div>
      <FloatingVip />
    </main>
  );
}
