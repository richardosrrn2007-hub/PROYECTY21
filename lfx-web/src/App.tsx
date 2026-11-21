import Nav from './components/Nav';
import CascadeSection from './cascade/CascadeSection';
import { FaqSection, Footer } from './cascade/content';

export default function App() {
  return (
    <main className="bg-[#0C0C0C] font-kanit" style={{ overflowX: 'clip' }}>
      <Nav />
      <CascadeSection />
      <div className="cascade-after">
        <FaqSection />
        <Footer />
      </div>
    </main>
  );
}
