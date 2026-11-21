import Nav from './components/Nav';
import CascadeSection from './cascade/CascadeSection';

export default function App() {
  return (
    <main className="bg-[#0C0C0C] font-kanit" style={{ overflowX: 'clip' }}>
      <Nav />
      <CascadeSection />
    </main>
  );
}
