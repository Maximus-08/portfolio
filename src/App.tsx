import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-zinc-950">
      <Navbar />
      <Hero />
      <TechStack />
      <Projects />
      <Achievements />
      <Footer />
    </div>
  );
}

export default App;
