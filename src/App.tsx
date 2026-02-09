import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import PhysicsSkills from './components/PhysicsSkills';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <div className="bg-zinc-950">
      <Navbar />
      <Hero />
      <About />
      <PhysicsSkills />
      <Projects />
      <Contact />
    </div>
  );
}

export default App;
