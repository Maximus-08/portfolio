import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Journey from './components/Journey';
import OpenSource from './components/OpenSource';
import Work from './components/Work';
import Toolbox from './components/Toolbox';
import ChaosGame from './components/ChaosGame';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#journey"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <OpenSource />
        <Work />
        <Toolbox />
        <ChaosGame />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
