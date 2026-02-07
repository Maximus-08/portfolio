import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-bold text-zinc-100 tracking-tight">
          Avnish.
        </div>
        <div className="flex gap-8">
          <a href="#work" className="text-zinc-400 hover:text-zinc-100 transition-colors text-sm">
            Work
          </a>
          <a href="#about" className="text-zinc-400 hover:text-zinc-100 transition-colors text-sm">
            About
          </a>
          <a href="#resume" className="text-zinc-400 hover:text-zinc-100 transition-colors text-sm">
            Resume
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
