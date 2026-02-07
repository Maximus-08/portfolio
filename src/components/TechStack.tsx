import { motion } from 'framer-motion';
import { Code2, Container, Boxes, Chrome, Brackets, Terminal } from 'lucide-react';

const techs = [
  { name: 'Go', icon: Code2 },
  { name: 'Docker', icon: Container },
  { name: 'Kubernetes', icon: Boxes },
  { name: 'React', icon: Chrome },
  { name: 'TypeScript', icon: Brackets },
  { name: 'Linux', icon: Terminal },
];

export default function TechStack() {
  return (
    <section className="bg-zinc-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-zinc-100 mb-12 text-center"
        >
          Tech Stack
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8"
        >
          {techs.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <Icon className="w-6 h-6 text-zinc-400 hover:text-cyan-400 transition-colors" />
                </div>
                <span className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
