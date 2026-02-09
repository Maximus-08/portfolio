import { motion } from 'framer-motion';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-3xl mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-7xl font-bold text-zinc-100 tracking-tight mb-6"
        >
          Building Scalable Systems.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl text-zinc-400 mb-4"
        >
          Focused on Go, Kubernetes, and Open Source.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="text-sm text-zinc-500 mb-8"
        >
          <p>Pre-final Year Student @ IIIT Gwalior</p>
          <p className="mt-2">Backend Developer & Open Source Contributor</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex gap-4 justify-center flex-wrap"
        >
          <a
            href="#work"
            className="px-6 py-3 bg-white text-black font-medium rounded hover:opacity-90 transition-opacity"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-zinc-600 text-zinc-100 font-medium rounded hover:bg-white/5 transition-colors"
          >
            Contact
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
